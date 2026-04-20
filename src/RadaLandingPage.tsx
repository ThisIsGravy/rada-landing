import { navigateToRoute, scrollToSection } from "./siteNavigation";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";
import { useAuth } from "./lib/useAuth";
import { useSubscription } from "./lib/useSubscription";

type FeatureCard = {
  title: string;
  description: string;
  icon: "hybrid" | "routing" | "blueprint";
};

type PricingTier = {
  name: string;
  price: string;
  description: string;
  footnote?: string;
  cta: string;
  featured?: boolean;
  route: "workspace" | "enterprise";
  buttonVariant?: "default" | "featured" | "ghost";
  // Set for Pro/Ultra so the CTA drives a Creem checkout (after sign-in)
  // instead of just dropping the user into the workspace.
  paidTier?: "Pro" | "Ultra";
};

type PricingTierDefinition =
  | (Omit<PricingTier, "price"> & {
      priceType: "label";
      priceLabel: string;
    })
  | (Omit<PricingTier, "price"> & {
      priceType: "monthly";
      monthlyPrice: number;
    });

const featureCards: FeatureCard[] = [
  {
    title: "Hybrid Context Engine",
    description:
      "Run local models for free, private refactoring. Route to the cloud for massive architectures.",
    icon: "hybrid",
  },
  {
    title: "Intent-Driven Routing",
    description:
      "Tell us what you want to build. We pick the perfect model and context window.",
    icon: "routing",
  },
  {
    title: "Viral Blueprints",
    description:
      "Export your software architectures as shareable JSON blueprints.",
    icon: "blueprint",
  },
];

const pricingTierDefinitions: PricingTierDefinition[] = [
  {
    name: "Developer",
    priceType: "label" as const,
    priceLabel: "Free*",
    description:
      "Bring your own OpenRouter key. Free local compute. Community blueprints.",
    footnote: "* Cloud routing with your own API key.",
    cta: "Get Started",
    route: "workspace",
    buttonVariant: "default",
  },
  {
    name: "Rada Pro",
    priceType: "monthly" as const,
    monthlyPrice: 19,
    description:
      "Zero setup. 20 Daily Cloud Burst with a 0.5x burn rate on Autorouter routes. Managed routing.",
    cta: "Start 14-Day Trial",
    featured: true,
    route: "workspace",
    buttonVariant: "featured",
    paidTier: "Pro",
  },
  {
    name: "Ultra",
    priceType: "monthly" as const,
    monthlyPrice: 39,
    description:
      "75 Daily Cloud Burst — 2.5× Pro capacity. Priority heavyweight routing for larger builds and power users.",
    cta: "Go Ultra",
    route: "workspace",
    buttonVariant: "ghost",
    paidTier: "Ultra",
  },
];

function FeatureIcon({ icon }: { icon: FeatureCard["icon"] }) {
  if (icon === "hybrid") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[#77c4ff]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 7h10v10H7z" />
        <path d="M3.5 12h3M17.5 12h3M12 3.5v3M12 17.5v3" />
      </svg>
    );
  }

  if (icon === "routing") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[#77c4ff]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 6h12" />
        <path d="M6 12h8" />
        <path d="M6 18h12" />
        <path d="m14 10 3 2-3 2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#77c4ff]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 5h10v14H7z" />
      <path d="M10 9h4M10 13h4M10 17h4" />
      <path d="M4.5 8H7M17 16h2.5" />
    </svg>
  );
}

function ScreenshotPanel() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute inset-x-16 -top-8 h-36 rounded-full bg-[#0096C7]/25 blur-3xl md:inset-x-24 md:h-44" />
      <div className="relative overflow-hidden rounded-[28px] border border-[#333] bg-[#111111] shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between border-b border-[#333] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400">
            Rada Workspace
          </div>
        </div>

        <div className="grid gap-px bg-[#333] md:grid-cols-[220px_minmax(0,1fr)_280px]">
          <div className="space-y-4 bg-[#101010] p-4">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Intent
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-3">
                <div className="text-sm font-medium text-white">Build from scratch</div>
                <div className="mt-2 text-xs leading-5 text-zinc-400">
                  Claude 3.5 Sonnet routed for complex architecture and broader planning.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Context
              </div>
              <div className="space-y-2 rounded-2xl bg-white/[0.03] p-3">
                <div className="rounded-xl bg-[#171717] px-3 py-2 text-xs text-zinc-300">
                  Local micro-model ready
                </div>
                <div className="rounded-xl bg-[#171717] px-3 py-2 text-xs text-zinc-300">
                  4 project files indexed
                </div>
                <div className="rounded-xl bg-[#171717] px-3 py-2 text-xs text-zinc-300">
                  Exportable JSON blueprint
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#131313] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-full border border-[#0096C7]/20 bg-[#0096C7]/10 px-3 py-1 text-[11px] font-medium text-[#77c4ff]">
                Intent-driven workspace
              </div>
              <div className="text-xs text-zinc-500">Hybrid mode</div>
            </div>

            <div className="space-y-3 rounded-[22px] border border-white/5 bg-[#161616] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Blueprint preview
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f]">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                  <div className="text-sm font-medium text-white">App Architecture</div>
                  <div className="text-xs text-zinc-500">JSON</div>
                </div>
                <div className="space-y-2 px-4 py-4 text-xs leading-6 text-zinc-400">
                  <div>{"{"}</div>
                  <div className="pl-4">"intent": "buildFromScratch",</div>
                  <div className="pl-4">"router": "hybrid",</div>
                  <div className="pl-4">"cloudModel": "claude-3.5-sonnet",</div>
                  <div className="pl-4">"localModel": "qwen2.5-coder:7b"</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-[#101010] p-4">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Routing
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-3">
                <div className="text-sm font-medium text-white">Rada Pro Router</div>
                <div className="mt-2 text-xs leading-5 text-zinc-400">
                  Dynamic handoff between local micro-models and Claude, Gemini, or standard cloud lanes.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#0096C7]/15 bg-gradient-to-br from-[#0096C7]/10 via-transparent to-transparent p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#77c4ff]">
                Daily Cloud Burst
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">19.5 / 20</div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 w-[98%] rounded-full bg-[#0096C7]" />
              </div>
              <div className="mt-3 text-xs leading-5 text-zinc-400">
                Autorouter routes burn at half rate — 20 burst units become 40 effective requests per day.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRegionalPriceLabel() {
  const locale =
    typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "en-us";
  const timeZone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() ?? ""
      : "";

  if (
    locale.startsWith("et") ||
    locale.startsWith("fi") ||
    locale.startsWith("de") ||
    locale.startsWith("fr") ||
    locale.startsWith("es") ||
    locale.startsWith("it") ||
    timeZone.startsWith("europe/")
  ) {
    return "€19/mo";
  }

  return "$19/mo";
}

function getRegionalPrice(amount: number) {
  const locale =
    typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "en-us";
  const timeZone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() ?? ""
      : "";

  const useEuro =
    locale.startsWith("et") ||
    locale.startsWith("fi") ||
    locale.startsWith("de") ||
    locale.startsWith("fr") ||
    locale.startsWith("es") ||
    locale.startsWith("it") ||
    timeZone.startsWith("europe/");

  return `${useEuro ? "€" : "$"}${amount}/mo`;
}

export default function RadaLandingPage() {
  const regionalPriceLabel = getRegionalPriceLabel();
  const pricingTiers: PricingTier[] = pricingTierDefinitions.map((tier) => ({
    ...tier,
    price:
      tier.priceType === "monthly"
        ? getRegionalPrice(tier.monthlyPrice)
        : tier.priceLabel,
  }));

  const { user } = useAuth();
  const { startCheckout } = useSubscription();

  // Pro/Ultra CTAs: anonymous → sign in (so the Edge Function can attach
  // the subscription to a user_id); authed → kick off Creem checkout via
  // the server-side proxy. Free tier and other CTAs keep their prior
  // workspace-navigation behavior.
  const handleTierCta = (tier: PricingTier) => {
    if (!tier.paidTier) {
      navigateToRoute(tier.route);
      return;
    }
    if (!user) {
      navigateToRoute("signin");
      return;
    }
    void startCheckout(tier.paidTier);
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#0096C7]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,150,199,0.08),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#d7a22a] bg-[#2a1f00] px-4 py-3 text-sm text-[#f3d88d]">
          <span className="text-pretty">
            Caught in the Antigravity price hike? Take back your margins with Rada Hybrid Compute.
          </span>
          <button
            type="button"
            onClick={() => scrollToSection("pricing")}
            className="shrink-0 font-medium text-[#f6df9e] transition hover:text-white"
            aria-label="Jump to pricing"
          >
            →
          </button>
        </div>

        <header className="sticky top-0 z-20 rounded-full border border-[#333] bg-[#0e0e0e]/80 px-4 py-3 backdrop-blur-xl">
          <nav className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateToRoute("landing")}
              className="flex items-center gap-3 border-0 bg-transparent p-0 text-left"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#333] bg-white/[0.03] shadow-[0_0_32px_rgba(0,150,199,0.18)]">
                <RadaLogoMark className="h-9 w-9 object-contain select-none" />
              </div>
              <RadaWordmark
                className="h-14 w-[188px] object-contain select-none sm:w-[208px]"
                showMark={false}
              />
            </button>

            <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="transition hover:text-white"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className="transition hover:text-white"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={() => navigateToRoute("enterprise")}
                className="transition hover:text-white"
              >
                Enterprise
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateToRoute(user ? "workspace" : "signin")}
                className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
              >
                {user ? "Open Workspace" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => navigateToRoute("workspace")}
                aria-label="Download for macOS, Windows, and Linux"
                className="inline-flex items-center justify-center rounded-full border border-[#0096C7]/30 bg-[#0096C7] px-4 py-2 text-sm font-medium text-white shadow-[0_0_30px_rgba(0,150,199,0.28)] transition hover:bg-[#00B4D8]"
              >
                Download for Desktop
              </button>
            </div>
          </nav>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#333] bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#77c4ff]">
              Intent-aware routing for local and cloud AI
            </div>

            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
              Tell us what to build. The AI workspace for the next million founders.
            </h1>

            <p className="mt-6 max-w-3xl text-pretty text-base leading-8 text-zinc-400 sm:text-lg">
              Stop fighting with API keys and context windows. Rada routes your
              intent across local micro-models and cloud heavyweights like Claude
              3.5 seamlessly.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigateToRoute("workspace")}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#00B4D8]/40 bg-[#0096C7] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_48px_rgba(0,150,199,0.38),0_18px_40px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-[#00B4D8]"
              >
                Start Building Free
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#333] bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-white/[0.05]"
              >
                View Documentation
              </button>
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            <ScreenshotPanel />
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:mb-14">
            <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#77c4ff]">
              Features
            </div>
            <div className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              A workspace that feels local-first, but scales like a cloud platform.
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-[28px] border border-[#333] bg-[#121212] p-6 transition hover:border-[#0096C7]/30 hover:bg-[#151515]"
              >
                <div className="mb-5 inline-flex rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="grid gap-8 rounded-[32px] border border-[#333] bg-[#121212] px-6 py-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="space-y-4">
              <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#77c4ff]">
                Why Rada?
              </div>
              <h2 className="max-w-sm text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Keep the fast path local. Pay for cloud only when the work demands it.
              </h2>
            </div>

            <div className="rounded-[24px] border border-white/6 bg-white/[0.03] p-6">
              <p className="text-base leading-8 text-zinc-300 sm:text-lg">
                Stop paying the &quot;Cloud Tax&quot; for every keystroke. While cloud-only IDEs
                force you into unpredictable, floating price hikes for basic refactoring, Rada
                runs local micro-models for free. We only route to premium cloud models when your
                architecture demands it. Predictable {regionalPriceLabel} pricing. Zero surprise
                bills.
              </p>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="border-t border-[#222] py-16 sm:py-20"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-start text-left">
            <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#77c4ff]">
              Pricing
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Start free, then upgrade when you want managed routing and burst capacity.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              The free tier is ideal for developer-led exploration. Rada Pro is
              built for teams, individuals, founders, and fast-moving product
              loops with daily cloud capacity and discounted Autorouter burn.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-[28px] border p-6 ${
                tier.featured
                  ? "border-[#0096C7]/40 bg-gradient-to-b from-[#0096C7]/10 via-[#141414] to-[#111111] shadow-[0_0_50px_rgba(0,150,199,0.14)]"
                  : "border-[#333] bg-[#121212]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
                    {tier.name}
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {tier.price.endsWith("*") ? (
                      <>
                        {tier.price.slice(0, -1)}
                        <sup className="ml-0.5 align-top text-base text-zinc-400">*</sup>
                      </>
                    ) : (
                      tier.price
                    )}
                  </div>
                </div>
                {tier.featured ? (
                  <div className="rounded-full border border-[#0096C7]/20 bg-[#0096C7]/10 px-3 py-1 text-[11px] font-medium text-[#77c4ff]">
                    Most popular
                  </div>
                ) : null}
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                {tier.description}
              </p>
              {tier.footnote ? (
                <p className="mt-3 text-[11px] leading-5 text-zinc-500">
                  {tier.footnote}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => handleTierCta(tier)}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition ${
                  tier.buttonVariant === "featured"
                    ? "border border-[#0096C7]/30 bg-[#0096C7] text-white shadow-[0_0_28px_rgba(0,150,199,0.25)] hover:bg-[#00B4D8]"
                    : tier.buttonVariant === "ghost"
                      ? "border border-[#333] bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04]"
                      : "border border-[#333] bg-white/[0.03] text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.05]"
                }`}
              >
                {tier.paidTier && !user ? "Sign in to upgrade" : tier.cta}
              </button>
            </article>
          ))}
          </div>
        </section>

        <section
          id="enterprise"
          className="rounded-[32px] border border-[#333] bg-gradient-to-br from-white/[0.03] to-transparent px-6 py-10 sm:px-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#77c4ff]">
                Enterprise
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Give your entire product team one AI workspace with sane defaults.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                SSO, admin-managed routing, shared blueprints, and private local
                model policies for regulated teams.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigateToRoute("enterprise")}
              className="inline-flex items-center justify-center rounded-full border border-[#333] bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-[#0096C7]/30 hover:bg-[#0096C7]/10 hover:text-white"
            >
              Talk to Sales
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
