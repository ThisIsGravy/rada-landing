import { useEffect, useMemo, useState } from "react";
import { navigateToRoute } from "./siteNavigation";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";

// Deep-link target the Tauri build registers as a custom URL scheme.
// The desktop app reads `rada://workspace` and routes the user back into
// the workspace view after a successful purchase redirect.
const APP_DEEP_LINK = "rada://workspace";

// Auto-redirect window. Kept short so the Tauri app can resume quickly,
// long enough to read the headline and press the manual button if the
// deep link is blocked by the browser.
const COUNTDOWN_SECONDS = 5;

type CheckoutTier = "Pro" | "Ultra" | "Lifetime" | null;

// IMPORTANT: this page is a redirect landing only. We deliberately do NOT
// verify the Creem checkout signature client-side. Signature verification,
// idempotent activation of the subscription record, and any tier mutation
// happen in the Creem webhook handler on the server. Client-side
// "verification" here would be trivially spoofable and is out of scope.
function parseCheckoutQuery(search: string): {
  checkoutId: string | null;
  userId: string | null;
  tier: CheckoutTier;
} {
  const params = new URLSearchParams(search);
  const checkoutId = params.get("checkout_id");
  const userId = params.get("user_id");
  const rawTier = (params.get("tier") ?? "").toLowerCase();

  let tier: CheckoutTier = null;
  if (rawTier === "pro" || rawTier === "pro_monthly" || rawTier === "pro_annual") {
    tier = "Pro";
  } else if (rawTier === "ultra" || rawTier === "ultra_monthly") {
    tier = "Ultra";
  } else if (rawTier === "lifetime" || rawTier === "ultra_lifetime") {
    tier = "Lifetime";
  }

  return { checkoutId, userId, tier };
}

function openDeepLink() {
  // Assigning to window.location is the cross-browser-friendly way to
  // hand the URL to the OS handler. Browsers that don't recognise the
  // scheme silently no-op; the visible "Open Rada" fallback covers it.
  window.location.href = APP_DEEP_LINK;
}

export default function CheckoutSuccess() {
  const { checkoutId, userId, tier } = useMemo(
    () => parseCheckoutQuery(window.location.search),
    [],
  );

  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (hasOpened) return;
    if (secondsLeft <= 0) {
      setHasOpened(true);
      openDeepLink();
      return;
    }
    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft, hasOpened]);

  const tierLabel = tier ?? "Rada";
  const headline =
    tier === "Lifetime"
      ? "Welcome to Ultra Lifetime."
      : tier
        ? `Welcome to ${tier}!`
        : "Welcome to Rada.";

  return (
    <main className="relative min-h-screen bg-[#0e0e0e] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
        <header className="sticky top-0 z-20 rounded-full border border-[#333] bg-[#0e0e0e]/80 px-4 py-3 backdrop-blur-xl">
          <nav className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateToRoute("landing")}
              className="flex items-center gap-3 border-0 bg-transparent p-0 text-left"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#333] bg-white/[0.03] shadow-[0_0_32px_rgba(59,130,246,0.18)]">
                <RadaLogoMark className="h-9 w-9 object-contain select-none" />
              </div>
              <RadaWordmark
                className="h-14 w-[188px] object-contain select-none sm:w-[208px]"
                showMark={false}
              />
            </button>

            <div className="hidden rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-blue-300 sm:inline-flex">
              Payment received
            </div>
          </nav>
        </header>

        <section className="flex flex-1 items-center justify-center py-16 sm:py-20">
          <div className="w-full max-w-2xl rounded-[28px] border border-[#333] bg-[#121212] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>

            <div className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-blue-400">
              Checkout complete
            </div>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              {headline}
            </h1>
            <p className="mt-4 text-pretty text-base leading-7 text-zinc-400">
              Thanks for upgrading. Your payment to Creem went through and
              your {tierLabel} access will activate the moment our webhook
              processes the confirmation. The desktop app may take a few
              seconds to reflect the new tier — if it still shows the old
              plan after a minute, restart Rada or sign out and back in.
            </p>

            <div className="mt-8 grid gap-4 rounded-2xl border border-[#222] bg-[#0f0f0f] p-5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-zinc-500">Tier</span>
                <span className="text-white">
                  {tier ?? "Awaiting webhook"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-zinc-500">Checkout ID</span>
                <span className="break-all text-right font-mono text-[12px] text-zinc-300">
                  {checkoutId ?? "—"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-zinc-500">User ID</span>
                <span className="break-all text-right font-mono text-[12px] text-zinc-300">
                  {userId ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-zinc-400">
                {hasOpened
                  ? "Opening Rada now…"
                  : `Returning you to Rada in ${secondsLeft}s…`}
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasOpened(true);
                  openDeepLink();
                }}
                className="inline-flex items-center justify-center rounded-full border border-blue-500/30 bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-[0_0_32px_rgba(59,130,246,0.24)] transition hover:bg-blue-400"
              >
                Open Rada
              </button>
            </div>

            <p className="mt-6 text-xs leading-6 text-zinc-500">
              Subscription activation is finalized server-side via the Creem
              webhook. This page does not (and cannot) verify the payment on
              its own. If your tier hasn't updated within a few minutes, email{" "}
              <a
                href="mailto:billing@userada.dev"
                className="text-blue-300 underline-offset-4 hover:underline"
              >
                billing@userada.dev
              </a>{" "}
              with the checkout ID above.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
