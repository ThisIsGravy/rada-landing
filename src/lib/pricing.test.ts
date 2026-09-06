import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AUTOROUTER_QUOTA_RATE,
  CURRENCY,
  PRICING_TIERS,
  effectiveBurst,
} from "./pricing";

// The desktop app is a sibling checkout of this repo. When it is present,
// assert the published figures match its TIER_CONFIG verbatim; when it is
// not (e.g. CI for the landing alone), fall back to the pinned values.
const APP_SUBSCRIPTION = resolve(__dirname, "../../../fluxcode-app/src/lib/subscription.ts");
const APP_WORKSPACE_UTILS = resolve(__dirname, "../../../fluxcode-app/src/lib/workspaceUtils.ts");

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
    expect(byTier.Ultra.features.join(" ")).toMatch(/75 Daily Cloud Burst \(150 effective/);
  });

  it("maps every paid tier to at least one Creem product", () => {
    for (const t of PRICING_TIERS) {
      if (t.monthlyPriceUsd > 0) expect(t.creemProducts.length).toBeGreaterThan(0);
      if (t.annualPriceUsd != null) expect(t.creemProducts.join(" ")).toMatch(/Annual/);
    }
  });

  const hasApp = existsSync(APP_SUBSCRIPTION);
  it.skipIf(!hasApp)("matches fluxcode-app TIER_CONFIG (source of truth)", () => {
    const cfg = parseTierConfig(readFileSync(APP_SUBSCRIPTION, "utf8"));
    expect(Object.keys(cfg)).toEqual(["Free", "Pro", "Ultra"]);
    for (const [tier, expected] of Object.entries(cfg)) {
      expect(byTier[tier], tier).toMatchObject(expected);
    }
  });

  it.skipIf(!existsSync(APP_WORKSPACE_UTILS))("matches the app's Autorouter quota rate", () => {
    const src = readFileSync(APP_WORKSPACE_UTILS, "utf8");
    const rate = /isAutorouterModel\(modelId\) \? ([0-9.]+) : 1/.exec(src)?.[1];
    expect(Number(rate)).toBe(AUTOROUTER_QUOTA_RATE);
  });
});
