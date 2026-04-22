import { useState, type FormEvent } from "react";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";

// Formspree endpoint for waitlist signups. Swap in the real form id
// via VITE_FORMSPREE_URL before launch — placeholder accepts but
// drops submissions.
const FORMSPREE_URL =
  import.meta.env.VITE_FORMSPREE_URL ?? "https://formspree.io/f/placeholder";

type FormState = "idle" | "submitting" | "success" | "error";

type FeatureCard = {
  icon: "memory" | "team" | "review";
  title: string;
  description: string;
};

const featureCards: FeatureCard[] = [
  {
    icon: "memory",
    title: "Persistent session memory",
    description:
      "Context, decisions, and code patterns survive session restarts. Pick up exactly where you left off — every time.",
  },
  {
    icon: "team",
    title: "Team context sharing",
    description:
      "Shared memory across your engineering team. Everyone's AI assistant knows the same architecture, the same rules, the same codebase.",
  },
  {
    icon: "review",
    title: "Decision log with conflict detection",
    description:
      "Capture architecture decisions, naming rules, and constraints once. Rada surfaces them to every teammate's AI and flags when a new decision contradicts a past one.",
  },
];

type ComparisonRow = {
  feature: string;
  competitors: string;
  rada: string;
};

const comparisonRows: ComparisonRow[] = [
  {
    feature: "Cross-session memory",
    competitors: "Resets on close",
    rada: "Always on",
  },
  {
    feature: "Team-shared context",
    competitors: "Per-developer only",
    rada: "Synced across team",
  },
  {
    feature: "Codebase conventions",
    competitors: "Must re-explain each time",
    rada: "Learned once, always applied",
  },
  {
    feature: "Where models run",
    competitors: "Cloud API only",
    rada: "Local-first, cloud when needed",
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
          <span className="rounded-full border border-[#1f1f23] bg-[#111113] px-3 py-1 text-xs text-zinc-500">
            Private beta &middot; 2026
          </span>
        </nav>

        <section className="py-20 text-center sm:py-24">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#0096C7]/25 bg-[#0096C7]/[0.1] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#77c4ff]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#77c4ff]" />
            Now accepting early access
          </div>

          <h1 className="bg-gradient-to-br from-white from-40% to-[#77c4ff] bg-clip-text text-[clamp(38px,6vw,58px)] font-extrabold leading-[1.1] tracking-[-1.5px] text-transparent">
            Rada remembers what
            <br />
            every other AI forgets.
          </h1>

          <p className="mx-auto mt-6 max-w-[540px] text-[19px] leading-[1.55] text-zinc-200">
            AI coding that picks the right model for every task — local-first,
            cloud when you need it so you never lose your path.
          </p>

          <p className="mx-auto mb-12 mt-4 max-w-[480px] text-[16px] leading-[1.65] text-zinc-500">
            Cursor, Claude&nbsp;Code, and Codex all lose context when the session
            ends.{" "}
            <strong className="font-medium text-zinc-200">
              Rada persists memory across sessions
            </strong>{" "}
            — so your AI assistant actually knows your codebase.
          </p>

          <WaitlistForm
            ctaLabel="Join the waitlist"
            successLabel="You're on the list — we'll be in touch soon."
            errorLabel="Something went wrong. Try"
          />

          <p className="mt-3 text-xs text-zinc-500">
            No spam. Unsubscribe any time.
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
              <span className="font-semibold text-zinc-200">Developers</span> on
              the waitlist — shipping Q3&nbsp;2026
            </span>
          </div>
        </section>

        <section className="relative my-[72px] overflow-hidden rounded-[16px] border border-[#1f1f23] bg-[#111113] px-10 py-9">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0096C7] to-transparent" />
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
            The problem
          </div>
          <p className="max-w-[580px] text-[17px] leading-[1.7] text-zinc-200">
            You close the window.{" "}
            <em className="not-italic text-[#77c4ff]">It forgets everything.</em>
            <br />
            Every AI session starts from scratch — your architecture decisions,
            your naming conventions, your team's unwritten rules. You spend more
            time re-explaining your codebase than writing code.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-[10px] border border-[#1f1f23] bg-white/[0.03] px-4 py-3.5 font-mono text-xs leading-[1.8] text-zinc-500">
            <span className="text-[#546e7a]"># What you tell your AI assistant every. single. day.</span>
            {"\n"}
            <span className="text-[#546e7a]"># "As a reminder, we use PostgreSQL not MySQL..."</span>
            {"\n"}
            <span className="text-[#546e7a]"># "As a reminder, auth is handled by the middleware layer..."</span>
            {"\n"}
            <span className="text-[#546e7a]"># "As a reminder, don't touch the legacy billing module..."</span>
            {"\n\n"}
            <span className="text-[#82aaff]">rada</span>
            <span>.</span>
            <span className="text-[#c792ea]">remember</span>
            <span>(</span>
            <span className="text-[#c3e88d]">"everything"</span>
            <span>)</span>
            {"  "}
            <span className="text-[#546e7a]"># once</span>
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

        <section className="relative mb-24 overflow-hidden rounded-[16px] border border-[#1f1f23] bg-[#111113] px-10 py-14 text-center">
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0096C7] to-transparent" />
          <div className="pointer-events-none absolute -bottom-[60px] left-1/2 h-[200px] w-[400px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(0,150,199,0.16)_0%,transparent_70%)]" />
          <h2 className="relative bg-gradient-to-br from-white from-40% to-[#77c4ff] bg-clip-text text-[clamp(26px,4vw,36px)] font-bold leading-tight tracking-[-0.8px] text-transparent">
            The AI coding layer
            <br />
            your team actually shares.
          </h2>
          <p className="relative mb-9 mt-3.5 text-base text-zinc-500">
            Early access is limited. Get notified before we open the doors.
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
