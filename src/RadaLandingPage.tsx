import { useState, type FormEvent } from "react";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";

// Formspree endpoint for waitlist signups. Swap in the real form id
// via VITE_FORMSPREE_URL before launch — placeholder accepts but
// drops submissions.
const FORMSPREE_URL =
  import.meta.env.VITE_FORMSPREE_URL ?? "https://formspree.io/f/placeholder";

// Manually-bumped waitlist counter. Set VITE_WAITLIST_COUNT in Vercel env
// (build-time) — leave unset and the social-proof row falls back to the
// number-free "Early access list open" copy, which reads more confidently
// than a small count. Bump the env value when the number becomes flattering
// (rule-of-thumb: ~50+ signups). Redeploy to publish; no runtime fetch.
//
// Now that the Formspree paid plan is active, a follow-up could replace
// this build-time env var with a live fetch from
// `GET https://formspree.io/api/0/forms/<FORM_ID>/submissions?stats=1`
// using a Personal Access Token in a Vercel Edge Function. Skipping for
// now because the static number is faster, leaks no count when low, and
// the paid plan's value here is mainly the higher submission ceiling +
// spam filtering — both server-side wins.
function parseWaitlistCount(): number | null {
  const raw = import.meta.env.VITE_WAITLIST_COUNT;
  if (raw == null || raw === "") return null;
  const parsed = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}
const WAITLIST_COUNT = parseWaitlistCount();

type FormState = "idle" | "submitting" | "success" | "error";

type FeatureCard = {
  icon: "memory" | "team" | "review";
  title: string;
  description: string;
};

const featureCards: FeatureCard[] = [
  {
    icon: "memory",
    title: "Behavioral Routing",
    description:
      "One local model, three behaviors. Rada adjusts the system prompt, temperature, and context window based on whether you're refactoring, building, or learning.",
  },
  {
    icon: "team",
    title: "Smart cloud routing",
    description:
      "When a task exceeds local capability, the Autorouter picks the right cloud endpoint automatically. Routed requests burn at half the normal quota rate.",
  },
  {
    icon: "review",
    title: "Persistent memory",
    description:
      "Context, decisions, and code patterns survive session restarts. Your AI assistant actually knows your codebase without being reminded every time.",
  },
];

type ComparisonRow = {
  feature: string;
  competitors: string;
  rada: string;
};

const comparisonRows: ComparisonRow[] = [
  {
    feature: "Where models run",
    competitors: "Cloud only",
    rada: "Local-first, cloud when needed",
  },
  {
    feature: "Model switching",
    competitors: "Hot-swap (RAM spikes)",
    rada: "One model, behavioral routing",
  },
  {
    feature: "Cloud cost control",
    competitors: "$20-60/mo, usage-gated",
    rada: "Daily burst quota, 0.5x autoroute rate",
  },
  {
    feature: "Session memory",
    competitors: "Resets on close",
    rada: "Persists across sessions",
  },
];

function FeatureIcon({ icon }: { icon: FeatureCard["icon"] }) {
  const common = {
    className: "h-[18px] w-[18px] text-[#77c4ff]",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (icon === "memory") {
    return (
      <svg {...common}>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
      </svg>
    );
  }

  if (icon === "team") {
    return (
      <svg {...common}>
        <path d="M7 7h10" />
        <path d="m14 4 3 3-3 3" />
        <path d="M17 17H7" />
        <path d="m10 20-3-3 3-3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 6h16v12H4z" />
      <path d="M8 10h8M8 14h5" />
      <path d="m18 18 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 text-[#34d399]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 10 4 4 8-8" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 text-zinc-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

function WaitlistForm({
  ctaLabel,
  submittingLabel = "Joining…",
  successLabel,
  errorLabel,
  compact = false,
}: {
  ctaLabel: string;
  submittingLabel?: string;
  successLabel: string;
  errorLabel: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setState("error");
      return;
    }
    setState("submitting");

    // Capture UTM parameters from the URL at submit time so every waitlist
    // signup is tagged with its original attribution source (which tweet,
    // HN comment, referral link, etc. drove the click). Formspree treats
    // these as top-level fields and surfaces them as columns in the
    // submissions dashboard — no extra integration needed.
    const attribution: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      for (const key of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ]) {
        const value = params.get(key);
        if (value) attribution[key] = value;
      }
      if (document.referrer) {
        attribution["referrer"] = document.referrer;
      }
    }

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmed, ...attribution }),
      });
      if (!res.ok) throw new Error("non-2xx");
      setState("success");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div
        className={`mx-auto flex items-center gap-3 rounded-2xl border border-[#0096C7]/25 bg-[#0096C7]/[0.08] px-4 py-3 text-sm text-[#77c4ff] ${
          compact ? "max-w-[400px]" : "max-w-[440px]"
        }`}
        role="status"
      >
        <span aria-hidden="true">✦</span>
        <span>{successLabel}</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full ${compact ? "max-w-[400px]" : "max-w-[440px]"}`}
    >
      <div className="flex flex-col gap-2 rounded-2xl border border-[#2e2e35] bg-[#111111] p-1.5 pl-4 transition focus-within:border-[#0096C7] focus-within:shadow-[0_0_0_3px_rgba(0,150,199,0.2)] sm:flex-row sm:items-center sm:gap-2.5">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@yourcompany.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          disabled={state === "submitting"}
          className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2.5 text-[15px] text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-60 sm:py-0"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] bg-[#0096C7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(0,150,199,0.35)] transition hover:-translate-y-px hover:bg-[#00B4D8] hover:shadow-[0_6px_24px_rgba(0,150,199,0.45)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? submittingLabel : ctaLabel}
        </button>
      </div>
      {state === "error" ? (
        <div
          className="mt-3 flex items-center gap-2 rounded-xl border border-[#f87171]/25 bg-[#f87171]/[0.08] px-4 py-3 text-sm text-[#f87171]"
          role="alert"
        >
          <span aria-hidden="true">✕</span>
          <span>
            {errorLabel}{" "}
            <a
              href="mailto:support@userada.dev"
              className="underline underline-offset-2 hover:text-[#fca5a5]"
            >
              email us
            </a>{" "}
            instead.
          </span>
        </div>
      ) : null}
    </form>
  );
}

export default function RadaLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0e0e0e] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[-20%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,150,199,0.14)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,150,199,0.06),transparent_30%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[760px] px-6">
        <nav className="flex items-center justify-between pt-7">
          <a
            href="#"
            className="flex items-center gap-3 text-[18px] font-bold tracking-[-0.4px] text-white no-underline"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#333] bg-white/[0.03] shadow-[0_0_24px_rgba(0,150,199,0.2)]">
              <RadaLogoMark className="h-7 w-7 object-contain select-none" />
            </div>
            <RadaWordmark
              className="h-9 w-[110px] object-contain select-none"
              showMark={false}
            />
          </a>
          <div className="flex items-center gap-2">
            {/* Category label — sits in the nav so the IDE framing is
                visible the moment a visitor lands, even before they
                read the hero. Hidden on narrow screens to keep the
                nav from wrapping. */}
            <span className="hidden rounded-full border border-[#1f1f23] bg-[#111113] px-3 py-1 text-xs text-zinc-300 sm:inline-block">
              Desktop AI IDE
            </span>
            <span className="rounded-full border border-[#0096C7]/25 bg-[#0096C7]/[0.08] px-3 py-1 text-xs text-[#77c4ff]">
              Patent Pending
            </span>
            <span className="rounded-full border border-[#1f1f23] bg-[#111113] px-3 py-1 text-xs text-zinc-500">
              Private beta &middot; 2026
            </span>
          </div>
        </nav>

        <section className="py-20 text-center sm:py-24">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#0096C7]/25 bg-[#0096C7]/[0.1] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#77c4ff]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#77c4ff]" />
            Local-first AI coding · Now accepting early access
          </div>

          <h1 className="bg-gradient-to-br from-white from-40% to-[#77c4ff] bg-clip-text text-[clamp(38px,6vw,58px)] font-extrabold leading-[1.1] tracking-[-1.5px] text-transparent">
            Your AI. Your machine.
            <br />
            Cloud when you need it.
          </h1>

          <p className="mx-auto mt-6 max-w-[560px] text-[19px] leading-[1.55] text-zinc-200">
            <strong className="font-semibold text-white">A desktop AI coding workspace</strong>{" "}
            that runs local models by default and routes to cloud only when the
            task demands it. One model in RAM, zero model swapping.
          </p>

          <p className="mx-auto mb-12 mt-4 max-w-[480px] text-[16px] leading-[1.65] text-zinc-500">
            Copilot paused signups. Cursor is $60/mo. Claude Code might leave
            Pro.{" "}
            <strong className="font-medium text-zinc-200">
              Rada gives you local-first AI coding without the cloud lock-in.
            </strong>
          </p>

          <WaitlistForm
            ctaLabel="Join the waitlist"
            successLabel="You're on the list — we'll be in touch soon."
            errorLabel="Something went wrong. Try"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Native app for macOS, Windows, and Linux · No spam · Unsubscribe any time
          </p>

          <div className="mt-10 flex items-center justify-center gap-3 text-[13px] text-zinc-500">
            <div className="flex">
              <div className="-mr-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0e0e0e] bg-gradient-to-br from-[#0096C7] to-[#005f80] text-[11px] font-bold text-white">
                EK
              </div>
              <div className="-mr-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0e0e0e] bg-gradient-to-br from-[#34d399] to-[#059669] text-[11px] font-bold text-white">
                JS
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0e0e0e] bg-gradient-to-br from-[#fb923c] to-[#ea580c] text-[11px] font-bold text-white">
                MR
              </div>
            </div>
            <span>
              {WAITLIST_COUNT != null ? (
                <>
                  <span className="font-semibold text-zinc-200">
                    {WAITLIST_COUNT.toLocaleString()} developers
                  </span>{" "}
                  on the waitlist — shipping Q3&nbsp;2026
                </>
              ) : (
                <>
                  <span className="font-semibold text-zinc-200">
                    Early access list open
                  </span>{" "}
                  — shipping Q3&nbsp;2026
                </>
              )}
            </span>
          </div>
        </section>

        <section className="relative my-[72px] overflow-hidden rounded-[16px] border border-[#1f1f23] bg-[#111113] px-10 py-9">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0096C7] to-transparent" />
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
            The problem
          </div>
          <p className="max-w-[580px] text-[17px] leading-[1.7] text-zinc-200">
            Every AI coding tool is cloud-only.{" "}
            <em className="not-italic text-[#77c4ff]">The cost model is breaking.</em>
            <br />
            You're paying cloud prices for refactors, explanations, and quick
            fixes that could run on your own hardware. And when providers
            can't sustain it, they raise prices or cut access.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-[10px] border border-[#1f1f23] bg-white/[0.03] px-4 py-3.5 font-mono text-xs leading-[1.8] text-zinc-500">
            <span className="text-[#546e7a]"># What cloud-only AI coding looks like</span>
            {"\n"}
            <span className="text-[#546e7a]"># refactor_function()    → cloud API  → $0.03</span>
            {"\n"}
            <span className="text-[#546e7a]"># explain_this_code()    → cloud API  → $0.02</span>
            {"\n"}
            <span className="text-[#546e7a]"># fix_typo()             → cloud API  → $0.01</span>
            {"\n\n"}
            <span className="text-[#546e7a]"># What Rada does instead</span>
            {"\n"}
            <span className="text-[#82aaff]">rada</span>
            <span>.</span>
            <span className="text-[#c792ea]">route</span>
            <span>(</span>
            <span className="text-[#c3e88d]">"local"</span>
            <span>)</span>
            {"  "}
            <span className="text-[#546e7a]"># your machine, your model, $0</span>
          </pre>
        </section>

        <section className="mb-20">
          <div className="mb-7 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
            What Rada does
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-[16px] border border-[#1f1f23] bg-[#111113] p-6 transition hover:-translate-y-0.5 hover:border-[#2e2e35]"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#0096C7]/15">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h2 className="mb-2 text-[15px] font-semibold tracking-[-0.2px] text-white">
                  {feature.title}
                </h2>
                <p className="text-sm leading-[1.6] text-zinc-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-7 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
            How Rada compares
          </div>
          <div className="overflow-hidden rounded-[16px] border border-[#1f1f23] bg-[#111113]">
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-[#1f1f23] max-[560px]:grid-cols-[1fr_1fr]">
              <div className="px-5 py-4 text-[13px] font-semibold text-zinc-500">
                Capability
              </div>
              <div className="px-5 py-4 text-[13px] font-semibold text-zinc-500 max-[560px]:hidden">
                Cursor / Claude Code / Codex
              </div>
              <div className="border-x border-[#1f1f23] bg-[#0096C7]/[0.06] px-5 py-4 text-[13px] font-semibold text-[#77c4ff]">
                Rada
              </div>
            </div>
            {comparisonRows.map((row, idx) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[1fr_1fr_1fr] max-[560px]:grid-cols-[1fr_1fr] ${
                  idx < comparisonRows.length - 1
                    ? "border-b border-[#1f1f23]"
                    : ""
                }`}
              >
                <div className="px-5 py-3.5 text-sm font-medium text-zinc-200">
                  {row.feature}
                </div>
                <div className="flex items-center gap-2 px-5 py-3.5 text-sm text-zinc-500 max-[560px]:hidden">
                  <CrossIcon />
                  <span>{row.competitors}</span>
                </div>
                <div className="flex items-center gap-2 border-x border-[#1f1f23] bg-[#0096C7]/[0.05] px-5 py-3.5 text-sm text-zinc-100">
                  <CheckIcon />
                  <span>{row.rada}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Beta perks ──────────────────────────────────────────
            Replaces the previous price-tier matrix. The landing page
            is now waitlist-funnel-only — no dollar amounts, no urgency
            counters, no "limited X seats" framing. The single perk we
            DO surface is the priority lane for Ultra Lifetime that
            beta participants get when sales open, because that's both
            (a) a real benefit, and (b) a reason to convert today
            without putting a price tag on the conversion. */}
        <section className="mb-20">
          <div className="mb-7 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
            Beta perks
          </div>

          <div className="relative overflow-hidden rounded-[16px] border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.08] via-[#111113] to-[#111113] p-7">
            <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/15 blur-[70px]" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300">
                For closed-beta members
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.4px] text-white sm:text-2xl">
                Beta testers go first for Ultra Lifetime cloud access.
              </h3>

              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-300">
                Beta testers help us shape Rada, so beta testers are first
                in line when the one-time Ultra Lifetime tier opens.
                Lifetime is one payment for cloud access at the Ultra
                level — forever — and as a beta participant you'll be
                invited before it goes public.
              </p>

              <ul className="mt-5 grid grid-cols-1 gap-3 text-sm text-zinc-200 sm:grid-cols-3">
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span>Early-access invite to the Lifetime tier when it goes live</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span>Direct line to the team during the beta — your bugs, your features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span>Founding-supporter recognition once we exit beta</span>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-amber-500/15 pt-5">
                <span className="text-sm text-zinc-400">
                  No price commitment to join the waitlist — we'll reach
                  out when there's something to try.
                </span>
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-[13px] font-medium text-amber-200 no-underline transition hover:bg-amber-500/20"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("waitlist")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  Join the closed beta →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="waitlist"
          className="relative mb-24 overflow-hidden rounded-[16px] border border-[#1f1f23] bg-[#111113] px-10 py-14 text-center"
        >
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0096C7] to-transparent" />
          <div className="pointer-events-none absolute -bottom-[60px] left-1/2 h-[200px] w-[400px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(0,150,199,0.16)_0%,transparent_70%)]" />
          <h2 className="relative bg-gradient-to-br from-white from-40% to-[#77c4ff] bg-clip-text text-[clamp(26px,4vw,36px)] font-bold leading-tight tracking-[-0.8px] text-transparent">
            Local-first AI coding.
            <br />
            No cloud lock-in.
          </h2>
          <p className="relative mb-9 mt-3.5 text-base text-zinc-500">
            Closed beta coming soon. Get early access.
          </p>
          <div className="relative">
            <WaitlistForm
              ctaLabel="Get early access"
              successLabel="You're in — we'll reach out soon."
              errorLabel="Something went wrong. Try"
              compact
            />
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1f1f23] py-8 pb-10 max-[560px]:flex-col max-[560px]:items-start">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 no-underline transition hover:text-zinc-200"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#333] bg-white/[0.03]">
              <RadaLogoMark className="h-4 w-4 object-contain select-none" />
            </div>
            Rada
          </a>
          <div className="flex gap-6">
            <a
              href="mailto:support@userada.dev"
              className="text-[13px] text-zinc-500 no-underline transition hover:text-zinc-200"
            >
              support@userada.dev
            </a>
            <a
              href="mailto:support@userada.dev"
              className="text-[13px] text-zinc-500 no-underline transition hover:text-zinc-200"
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
