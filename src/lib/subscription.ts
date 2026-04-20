// Web-only subset of the subscription module. Mirrors types used by
// the desktop app so landing UI (pricing, upgrade CTAs) stays in
// sync, but strips everything that requires Tauri \u2014 no invoke(),
// no local cache, no Creem checkout initiation. Checkout happens
// inside the desktop app where the session lives.

export type SubscriptionTier = "Free" | "Pro" | "Ultra";

export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused"
  | "expired";

export type SubscriptionState = {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  creemCustomerId: string | null;
  creemSubscriptionId: string | null;
  currentPeriodEnd: number | null;
  trialEnd: number | null;
  cancelAtPeriodEnd: boolean;
};

export const DEFAULT_SUBSCRIPTION_STATE: SubscriptionState = {
  tier: "Free",
  status: "none",
  creemCustomerId: null,
  creemSubscriptionId: null,
  currentPeriodEnd: null,
  trialEnd: null,
  cancelAtPeriodEnd: false,
};

export function getUpgradeTarget(currentTier: SubscriptionTier): "Pro" | "Ultra" | null {
  switch (currentTier) {
    case "Free":
      return "Pro";
    case "Pro":
      return "Ultra";
    case "Ultra":
      return null;
  }
}
