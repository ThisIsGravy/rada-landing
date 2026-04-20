import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./useAuth";
import { openApp } from "./appUrl";
import {
  type SubscriptionState,
  type SubscriptionStatus,
  type SubscriptionTier,
  DEFAULT_SUBSCRIPTION_STATE,
  getUpgradeTarget,
} from "./subscription";

type SubscriptionRow = {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  creem_customer_id: string | null;
  creem_subscription_id: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
};

function rowToState(row: SubscriptionRow): SubscriptionState {
  const toEpoch = (iso: string | null) =>
    iso ? Math.floor(new Date(iso).getTime() / 1000) : null;
  return {
    tier: row.tier,
    status: row.status,
    creemCustomerId: row.creem_customer_id,
    creemSubscriptionId: row.creem_subscription_id,
    currentPeriodEnd: toEpoch(row.current_period_end),
    trialEnd: toEpoch(row.trial_end),
    cancelAtPeriodEnd: row.cancel_at_period_end,
  };
}

export type UseSubscriptionReturn = {
  state: SubscriptionState;
  tier: SubscriptionTier;
  loading: boolean;
  // Kicks the visitor into the desktop app to complete checkout.
  // Kept as an async function so callers don't need to rewrite.
  startCheckout: (tier: "Pro" | "Ultra") => Promise<void>;
  upgradeTarget: "Pro" | "Ultra" | null;
};

// Landing-site subscription hook. Reads the current tier from
// Supabase (if the visitor has an existing session), so pricing
// CTAs can say "Current plan" correctly. Checkout itself redirects
// to the desktop app \u2014 the landing doesn't hold payment state.
export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<SubscriptionState>(DEFAULT_SUBSCRIPTION_STATE);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setState(DEFAULT_SUBSCRIPTION_STATE);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "tier, status, creem_customer_id, creem_subscription_id, current_period_end, trial_end, cancel_at_period_end",
      )
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) {
      setState(DEFAULT_SUBSCRIPTION_STATE);
    } else {
      setState(rowToState(data as SubscriptionRow));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    void refresh();
  }, [refresh]);

  const startCheckout = useCallback(async (tier: "Pro" | "Ultra") => {
    openApp(`/checkout?tier=${tier}`);
  }, []);

  return {
    state,
    tier: state.tier,
    loading,
    startCheckout,
    upgradeTarget: getUpgradeTarget(state.tier),
  };
}
