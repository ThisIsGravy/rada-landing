import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AUTOROUTER_QUOTA_RATE,
  CREDIT_WEIGHTS,
  CURRENCY,
  DAILY_CREDITS,
  FAIR_USE_CEILINGS,
  LIFETIME_LADDER,
  LIFETIME_PHASES,
  LIFETIME_SEAT_CAP,
  MODEL_CLASSES,
  PRICING_TIERS,
  PRO_RATA_MIN_TERM_YEARS,
  TERMS_VERSION,
  creditCost,
  effectiveBurst,
  formatUsd,
  proRataRefundUsd,
} from "./pricing";

// The desktop app is a sibling checkout of this repo. When it is present,
// assert the published figures match its TIER_CONFIG verbatim; when it is
// not (e.g. CI for the landing alone), fall back to the pinned values.
const APP_SUBSCRIPTION = resolve(__dirname, "../../../fluxcode-app/src/lib/subscription.ts");
// The app's model catalog is the single source for credit weights and the
// Autorouter discount (read by the proxy, the app and Rust). When the app
// repo sits next to this one, the public numbers must match it.
const APP_MODEL_CATALOG = resolve(
  __dirname,
  "../../../fluxcode-app/supabase/functions/_shared/modelCatalog.json",
);

function parseTierConfig(src: string) {
  const start = src.indexOf("export const TIER_CONFIG");
  const block = src.slice(start, src.indexOf("};", start));
  const out: Record<string, { monthlyPriceUsd: number; burstCap: number; priorityRouting: boolean; cloudModelAccess: boolean }> = {};
  for (const m of block.matchAll(/(Free|Pro|Ultra): \{([\s\S]*?)\n  \}/g)) {
    const body = m[2];
    const num = (k: string) => Number(/(\d+)/.exec(new RegExp(`${k}: (\\d+)`).exec(body)?.[1] ?? "")?.[1]);
    const bool = (k: string) => new RegExp(`${k}: (true|false)`).exec(body)?.[1] === "true";
    out[m[1]] = {
      monthlyPriceUsd: num("monthlyPriceUsd"),
      burstCap: num("burstCap"),
      priorityRouting: bool("priorityRouting"),
      cloudModelAccess: bool("cloudModelAccess"),
    };
  }
  return out;
}

const byTier = Object.fromEntries(PRICING_TIERS.map((t) => [t.tier, t]));

describe("public pricing", () => {
  it("lists exactly Free, Pro and Ultra in that order", () => {
    expect(PRICING_TIERS.map((t) => t.tier)).toEqual(["Free", "Pro", "Ultra"]);
    expect(CURRENCY).toBe("USD");
  });

  it("pins the figures published on the site", () => {
    expect(byTier.Free).toMatchObject({ monthlyPriceUsd: 0, burstCap: 0, cloudModelAccess: false });
    expect(byTier.Pro).toMatchObject({ monthlyPriceUsd: 19, burstCap: 20, priorityRouting: false, cloudModelAccess: true, annualPriceUsd: 149 });
    expect(byTier.Ultra).toMatchObject({ monthlyPriceUsd: 55, burstCap: 75, priorityRouting: true, cloudModelAccess: true });
    expect(byTier.Ultra.annualPriceUsd).toBeUndefined();
  });

  it("derives the Autorouter-effective burst at the app's 0.5x rate", () => {
    expect(AUTOROUTER_QUOTA_RATE).toBe(0.5);
    expect(effectiveBurst(20)).toBe(40);
    expect(effectiveBurst(75)).toBe(150);
    expect(byTier.Pro.features.join(" ")).toMatch(/20 Daily Cloud Burst \(40 effective/);
    // Ultra's Autorouter can land on heavier classes, so 150 is a ceiling.
    expect(byTier.Ultra.features.join(" ")).toMatch(/75 Daily Cloud Burst \(up to 150 with the Autorouter\)/);
    expect(byTier.Ultra.features.join(" ")).not.toMatch(/effective/);
  });

  it("maps every paid tier to at least one Creem product", () => {
    for (const t of PRICING_TIERS) {
      if (t.monthlyPriceUsd > 0) expect(t.creemProducts.length).toBeGreaterThan(0);
      if (t.annualPriceUsd != null) expect(t.creemProducts.join(" ")).toMatch(/Annual/);
    }
  });

  it("formats whole and fractional USD amounts", () => {
    expect(formatUsd(19)).toBe("$19");
    expect(formatUsd(1000)).toBe("$1,000");
    expect(formatUsd(333.3333)).toBe("$333.33");
  });

  const hasApp = existsSync(APP_SUBSCRIPTION);
  it.skipIf(!hasApp)("matches fluxcode-app TIER_CONFIG (source of truth)", () => {
    const cfg = parseTierConfig(readFileSync(APP_SUBSCRIPTION, "utf8"));
    expect(Object.keys(cfg)).toEqual(["Free", "Pro", "Ultra"]);
    for (const [tier, expected] of Object.entries(cfg)) {
      expect(byTier[tier], tier).toMatchObject(expected);
    }
  });

  it.skipIf(!existsSync(APP_MODEL_CATALOG))(
    "matches the app's Autorouter discount and credit weights",
    () => {
      const catalog = JSON.parse(readFileSync(APP_MODEL_CATALOG, "utf8")) as {
        autorouterCreditFactor: number;
        creditWeights: Record<string, number>;
      };
      expect(catalog.autorouterCreditFactor).toBe(AUTOROUTER_QUOTA_RATE);
      expect(catalog.creditWeights).toEqual(CREDIT_WEIGHTS);
    },
  );
});

// The pending-decisions block holds founder DEFAULTS. These tests pin the
// invariants a decision must keep, not the values, so changing a decision
// stays a one-line edit in pricing.ts.
describe("pending founder decisions", () => {
  it("dates the Terms version", () => {
    expect(TERMS_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(TERMS_VERSION))).toBe(false);
  });

  it("weights model classes cheapest first, with the Autorouter halving", () => {
    expect(MODEL_CLASSES).toEqual(["Fast", "Standard", "Premium", "Frontier"]);
    const weights = MODEL_CLASSES.map((c) => CREDIT_WEIGHTS[c]);
    expect(weights).toEqual([...weights].sort((a, b) => a - b));
    for (const c of MODEL_CLASSES) {
      expect(creditCost(c, true)).toBe(CREDIT_WEIGHTS[c] * 0.5);
      // The proxy accepts costs from 0.5 to 6 in steps of 0.5 (plan §1b).
      for (const cost of [creditCost(c), creditCost(c, true)]) {
        expect(cost).toBeGreaterThanOrEqual(0.5);
        expect(cost).toBeLessThanOrEqual(6);
        expect(Number.isInteger(cost * 2)).toBe(true);
      }
    }
  });

  it("keeps daily credits in step with the published tiers", () => {
    expect(DAILY_CREDITS.Free).toBe(byTier.Free.burstCap);
    expect(DAILY_CREDITS.Pro).toBe(byTier.Pro.burstCap);
    expect(DAILY_CREDITS.ProAnnual).toBe(byTier.Pro.burstCap);
    expect(DAILY_CREDITS.Ultra).toBe(byTier.Ultra.burstCap);
    expect(DAILY_CREDITS.Lifetime).toBeGreaterThan(0);
    expect(DAILY_CREDITS.Lifetime).toBeLessThanOrEqual(DAILY_CREDITS.Ultra);
  });

  it("sets every soft ceiling below its hard ceiling", () => {
    for (const [plan, { softUsd, hardUsd }] of Object.entries(FAIR_USE_CEILINGS)) {
      expect(softUsd, plan).toBeGreaterThan(0);
      expect(softUsd, plan).toBeLessThan(hardUsd);
    }
  });

  it("builds a contiguous, non-decreasing lifetime ladder", () => {
    expect(LIFETIME_SEAT_CAP).toBe(LIFETIME_LADDER.reduce((n, p) => n + p.seats, 0));
    expect(LIFETIME_PHASES[0].firstSeat).toBe(1);
    LIFETIME_PHASES.forEach((p, i) => {
      expect(p.phase).toBe(i + 1);
      expect(p.lastSeat - p.firstSeat + 1).toBe(p.seats);
      if (i > 0) {
        expect(p.firstSeat).toBe(LIFETIME_PHASES[i - 1].lastSeat + 1);
        expect(p.priceUsd).toBeGreaterThanOrEqual(LIFETIME_PHASES[i - 1].priceUsd);
      }
    });
    expect(LIFETIME_PHASES[LIFETIME_PHASES.length - 1].lastSeat).toBe(LIFETIME_SEAT_CAP);
  });

  it("computes the pro-rata refund over the minimum term", () => {
    const months = PRO_RATA_MIN_TERM_YEARS * 12;
    expect(proRataRefundUsd(600, 0)).toBe(600);
    expect(proRataRefundUsd(600, months)).toBe(0);
    expect(proRataRefundUsd(600, months + 5)).toBe(0);
    expect(proRataRefundUsd(600, months / 2)).toBe(300);
    // Partial months count as elapsed only once whole.
    expect(proRataRefundUsd(600, 1.9)).toBe(proRataRefundUsd(600, 1));
  });
});
