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
// deliberately NOT listed here: it is "coming at launch" in the app and
// is not a purchasable product yet, so no price is published for it.
//
// Every dollar figure below must match the corresponding Creem product
// record exactly — confirm in the Creem dashboard before deploying.

import type { SubscriptionTier } from "./subscription";

// Autorouter-routed requests burn quota at half rate
// (fluxcode-app/src/lib/workspaceUtils.ts → isAutorouterModel ? 0.5 : 1),
// so the "effective" burst count is cap / 0.5.
export const AUTOROUTER_QUOTA_RATE = 0.5;

export function effectiveBurst(burstCap: number): number {
  return Math.round(burstCap / AUTOROUTER_QUOTA_RATE);
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
    burstCap: 0,
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
    burstCap: 20,
    priorityRouting: false,
    cloudModelAccess: true,
    tagline: "Managed cloud routing when a task outgrows local.",
    features: [
      "Everything in Free",
      "Managed cloud model access — no API keys needed",
      "20 Daily Cloud Burst (40 effective with Autorouter)",
      "Burst Day uplift on the first Tuesday of each month",
    ],
    creemProducts: ["Rada Pro Monthly", "Rada Pro Annual"],
    highlight: "blue",
  },
  {
    tier: "Ultra",
    name: "Ultra",
    monthlyPriceUsd: 55,
    burstCap: 75,
    priorityRouting: true,
    cloudModelAccess: true,
    tagline: "Priority routing and heavyweight models.",
    features: [
      "Everything in Pro",
      "75 Daily Cloud Burst (150 effective with Autorouter)",
      "Priority routing queue",
      "Heavyweight cloud models",
    ],
    creemProducts: ["Rada Ultra Monthly"],
    highlight: "gold",
  },
];

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
