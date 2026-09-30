// Public pricing shown on the landing page.
//
// SOURCE OF TRUTH: fluxcode-app/src/lib/subscription.ts → TIER_CONFIG
// (monthly price, burst cap, routing flags). This file mirrors those
// values for the marketing site; src/lib/pricing.test.ts fails if the
// two drift when the app repo is checked out alongside this one.
//
// Annual and lifetime cadences are not in TIER_CONFIG. Pro Annual ($149)
// is taken from the app's create-checkout edge function
// (CREEM_PRODUCT_PRO_ANNUAL) and Terms of Service §4. Ultra Lifetime is
// deliberately NOT in PRICING_TIERS: it is "coming at launch" in the app
// and is not a purchasable product yet, so the pricing section publishes
// no price for it. Its phase ladder lives in the pending-decisions block
// below and is rendered only by the Terms of Service (§4(f)).
//
// Every dollar figure below must match the corresponding Creem product
// record exactly — confirm in the Creem dashboard before deploying.

import type { SubscriptionTier } from "./subscription";

// Autorouter-routed requests burn quota at half rate
// (fluxcode-app/src/lib/workspaceUtils.ts → isAutorouterModel ? 0.5 : 1),
// so the "effective" burst count is cap / 0.5. With class-weighted
// credits (below) the Autorouter halves the class weight, so this is an
// upper bound ("up to") unless every routed request lands on a Fast model.
export const AUTOROUTER_QUOTA_RATE = 0.5;

export function effectiveBurst(burstCap: number): number {
  return Math.round(burstCap / AUTOROUTER_QUOTA_RATE);
}

// ── PENDING FOUNDER DECISIONS ─────────────────────────────────────────
// Every value in this block is a DEFAULT from
// RADA_LIFETIME_READINESS_PLAN.md ("Decisions for you", 2026-09-30) and is
// still awaiting the founder's decision. Each decision lives in exactly one
// constant so changing it is a one-line edit here. The Terms of Service
// (src/Terms.tsx) and the site copy READ these constants — never retype the
// numbers in prose.
//
// These values MUST match the app and backend once Workstreams 1 and 4
// ship: credit weights (proxy pricing, Rust burst_units_for,
// consume_burst/refund_burst), fair-use ceilings (usage_costs view and the
// proxy's soft/hard checks), daily credits (TIER_CONFIG.burstCap plus the
// lifetime entitlement), the lifetime ladder (lifetime_phases table and the
// four Creem lifetime products), and TERMS_VERSION (recorded as
// lifetime_purchases.terms_version). Change them in the same release.

/** Version of the Terms of Service; also the "Last updated" date shown on /terms. */
export const TERMS_VERSION = "2026-10-01";

/** Model classes on Rada's key, cheapest first. */
export type ModelClass = "Fast" | "Standard" | "Premium" | "Frontier";
export const MODEL_CLASSES: readonly ModelClass[] = ["Fast", "Standard", "Premium", "Frontier"];

/**
 * Credits one request costs, by the class of the model that serves it.
 * An Autorouter-routed request costs weight × AUTOROUTER_QUOTA_RATE (half).
 */
export const CREDIT_WEIGHTS: Record<ModelClass, number> = {
  Fast: 1,
  Standard: 2,
  Premium: 3,
  Frontier: 6,
};

/** Plans as the Terms distinguish them for allowances and fair use. */
export type AllowancePlan = "Pro" | "ProAnnual" | "Ultra" | "Lifetime";
export const ALLOWANCE_PLAN_LABELS: Record<AllowancePlan, string> = {
  Pro: "Pro Monthly",
  ProAnnual: "Pro Annual",
  Ultra: "Ultra Monthly",
  Lifetime: "Ultra Lifetime",
};

/** Daily credits on Rada's key, reset at 00:00 UTC. Free has no managed cloud. */
export const DAILY_CREDITS: Record<"Free" | AllowancePlan, number> = {
  Free: 0,
  Pro: 20,
  ProAnnual: 20,
  Ultra: 75,
  Lifetime: 75,
};

/**
 * Monthly fair-use ceilings in USD of actual provider cost on Rada's key,
 * per calendar month (UTC). Soft: only Fast models stay available. Hard: no
 * cloud on Rada's key. Both lift on the 1st of the next month.
 */
export const FAIR_USE_CEILINGS: Record<AllowancePlan, { softUsd: number; hardUsd: number }> = {
  Pro: { softUsd: 6, hardUsd: 12 },
  ProAnnual: { softUsd: 4, hardUsd: 8 },
  Ultra: { softUsd: 25, hardUsd: 40 },
  Lifetime: { softUsd: 12, hardUsd: 24 },
};

/**
 * Ultra Lifetime phase ladder. The price is set by cumulative seats ever
 * sold (refunds never lower it). PENDING: these are the founder's proposed
 * $500/$600/$800/$1,000; the readiness plan recommends an entry price of
 * $550 or more. The seat cap is the sum of the phases.
 */
export const LIFETIME_LADDER: readonly { phase: number; seats: number; priceUsd: number }[] = [
  { phase: 1, seats: 375, priceUsd: 500 },
  { phase: 2, seats: 375, priceUsd: 600 },
  { phase: 3, seats: 375, priceUsd: 800 },
  { phase: 4, seats: 375, priceUsd: 1000 },
];

/** Minimum term (years from purchase) covered by the pro-rata refund if Rada discontinues the managed cloud service. */
export const PRO_RATA_MIN_TERM_YEARS = 3;
// ── end of pending founder decisions ──────────────────────────────────

/** Total Ultra Lifetime seats across all phases (derived from LIFETIME_LADDER). */
export const LIFETIME_SEAT_CAP = LIFETIME_LADDER.reduce((sum, p) => sum + p.seats, 0);

/** LIFETIME_LADDER with each phase's seat range (1-based, inclusive). */
export const LIFETIME_PHASES = LIFETIME_LADDER.map((p, i) => {
  const firstSeat = LIFETIME_LADDER.slice(0, i).reduce((sum, q) => sum + q.seats, 0) + 1;
  return { ...p, firstSeat, lastSeat: firstSeat + p.seats - 1 };
});

/** Credits one request costs for a model class, optionally via the Autorouter. */
export function creditCost(modelClass: ModelClass, viaAutorouter = false): number {
  return CREDIT_WEIGHTS[modelClass] * (viaAutorouter ? AUTOROUTER_QUOTA_RATE : 1);
}

/** Pro-rata lifetime refund if the managed cloud service ends `monthsElapsed` whole months after purchase. */
export function proRataRefundUsd(pricePaidUsd: number, monthsElapsed: number): number {
  const termMonths = PRO_RATA_MIN_TERM_YEARS * 12;
  const remaining = Math.max(0, termMonths - Math.max(0, Math.floor(monthsElapsed)));
  return Math.round((pricePaidUsd * remaining * 100) / termMonths) / 100;
}

export type PricingTier = {
  tier: SubscriptionTier;
  name: string;
  /** Mirrors TIER_CONFIG[tier].monthlyPriceUsd */
  monthlyPriceUsd: number;
  /** Mirrors TIER_CONFIG[tier].burstCap */
  burstCap: number;
  /** Mirrors TIER_CONFIG[tier].priorityRouting */
  priorityRouting: boolean;
  /** Mirrors TIER_CONFIG[tier].cloudModelAccess */
  cloudModelAccess: boolean;
  /** Optional annual price (USD per year), billed once per 12-month term. */
  annualPriceUsd?: number;
  tagline: string;
  features: string[];
  /** Creem products this tier maps to (names as created in the dashboard). */
  creemProducts: string[];
  highlight?: "blue" | "gold";
};

export const CURRENCY = "USD";

export const PRICING_TIERS: PricingTier[] = [
  {
    tier: "Free",
    name: "Free",
    monthlyPriceUsd: 0,
    burstCap: DAILY_CREDITS.Free,
    priorityRouting: false,
    cloudModelAccess: false,
    tagline: "Local models on your own machine.",
    features: [
      "Local models only — runs entirely on your hardware",
      "Bring-your-own-key cloud routing (your API keys, your bill)",
      "Persistent session memory",
      "No Daily Cloud Burst",
    ],
    creemProducts: [],
  },
  {
    tier: "Pro",
    name: "Pro",
    monthlyPriceUsd: 19,
    annualPriceUsd: 149,
    burstCap: DAILY_CREDITS.Pro,
    priorityRouting: false,
    cloudModelAccess: true,
    tagline: "Managed cloud routing when a task outgrows local.",
    features: [
      "Everything in Free",
      "Managed cloud model access — no API keys needed",
      // Pro's Autorouter lanes are all Fast (weight 1), so "effective" stays exact.
      `${DAILY_CREDITS.Pro} Daily Cloud Burst (${effectiveBurst(DAILY_CREDITS.Pro)} effective with Autorouter)`,
      "Burst Day uplift on the first Tuesday of each month",
    ],
    creemProducts: ["Rada Pro Monthly", "Rada Pro Annual"],
    highlight: "blue",
  },
  {
    tier: "Ultra",
    name: "Ultra",
    monthlyPriceUsd: 55,
    burstCap: DAILY_CREDITS.Ultra,
    priorityRouting: true,
    cloudModelAccess: true,
    tagline: "Priority routing and heavyweight models.",
    features: [
      "Everything in Pro",
      `${DAILY_CREDITS.Ultra} Daily Cloud Burst (up to ${effectiveBurst(DAILY_CREDITS.Ultra)} with the Autorouter)`,
      "Priority routing queue",
      "Heavyweight cloud models",
    ],
    creemProducts: ["Rada Ultra Monthly"],
    highlight: "gold",
  },
];

export function formatUsd(amount: number): string {
  const cents = Number.isInteger(amount) ? 0 : 2;
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: cents, maximumFractionDigits: cents })}`;
}
