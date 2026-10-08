// Plan tiers, mirroring fluxcode-app/src/lib/subscription.ts. The landing
// site holds no subscription state; checkout and plan status live in the app.
export type SubscriptionTier = "Free" | "Pro" | "Ultra";
