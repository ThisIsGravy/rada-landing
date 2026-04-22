import { navigateToRoute, scrollToSection } from "./siteNavigation";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";

type EnterpriseFeature = {
  eyebrow: string;
  title: string;
  description: string;
};

const enterpriseFeatures: EnterpriseFeature[] = [
  {
    eyebrow: "Absolute Privacy",
    title: "Protect proprietary code by default.",
    description:
      "Run lightweight models locally so proprietary code never leaves your network. Cloud routing is opt-in per session and uses OpenRouter's zero-retention endpoints. BYOK (Bring Your Own Key) is on the enterprise roadmap.",
  },
  {
    eyebrow: "Predictable Team Capacity",
    title: "No surprise bills. No surprise throttling.",
    description:
      "Every seat ships with a daily burst cap. Admins see who's routing where, so capacity is easy to plan and impossible to over-spend. Team-level quota pooling is on the roadmap.",
  },
  {
    eyebrow: "Centralized Billing & SSO",
    title: "Admin-friendly controls with clean rollout.",
    description:
      "One invoice. Google and GitHub SSO today; SAML on request. Easy onboarding for engineering teams.",
  },
];

function SecurityGlyph() {
  return (
    <div className="inline-flex rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-500">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3l7 3v5c0 5-2.9 8.8-7 10-4.1-1.2-7-5-7-10V6l7-3Z" />
        <path d="M9.3 12.1 11.2 14l3.8-4.1" />
      </svg>
    </div>
  );
}

function EnterpriseForm() {
  return (
    <div className="rounded-[28px] border border-[#333] bg-[#121212] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-blue-400">
            Contact Sales
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
            Book your enterprise rollout
          </h2>
        </div>
        <SecurityGlyph />
      </div>

      <form className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-300">Work Email</span>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full rounded-2xl border border-[#333] bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-300">Company Name</span>
          <input
            type="text"
            placeholder="Rada Labs"
            className="w-full rounded-2xl border border-[#333] bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-300">Team Size</span>
          <select className="w-full rounded-2xl border border-[#333] bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20">
            <option>1-10</option>
            <option>11-50</option>
            <option>50+</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-300">How can we help?</span>
          <textarea
            rows={5}
            placeholder="Tell us about your security, rollout, or compute requirements."
            className="w-full resize-none rounded-2xl border border-[#333] bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full border border-blue-500/30 bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-[0_0_32px_rgba(59,130,246,0.24)] transition hover:bg-blue-400"
        >
          Contact Sales
        </button>
      </form>
    </div>
  );
}

export default function Enterprise() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
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

            <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
              <button
                type="button"
                onClick={() => scrollToSection("privacy")}
                className="transition hover:text-white"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="transition hover:text-white"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="transition hover:text-white"
              >
                Contact
              </button>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center justify-center rounded-full border border-[#333] bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-blue-500/30 hover:bg-blue-500/10"
            >
              Speak with Sales
            </button>
          </nav>
        </header>

        <section className="grid flex-1 gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start lg:gap-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-blue-400">
              Enterprise-grade AI deployment
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Ship faster. Protect your IP. Scale infinitely.
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-zinc-400 sm:text-lg">
              Rada Enterprise gives your engineering team pooled compute limits,
              zero-data-retention cloud routing, and localized AI models to
              guarantee proprietary code never leaves your network.
            </p>

            <div
              id="features"
              className="mt-12 overflow-hidden rounded-[28px] border border-[#333] bg-[#111111]"
            >
              {enterpriseFeatures.map((feature, index) => (
                <div
                  key={feature.eyebrow}
                  className={`grid gap-5 px-6 py-6 sm:px-8 ${
                    index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                  } ${index !== enterpriseFeatures.length - 1 ? "border-b border-[#222]" : ""}`}
                >
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-blue-400">
                    {feature.eyebrow}
                  </div>
                  <div className="max-w-2xl">
                    <div className="text-xl font-semibold tracking-[-0.03em] text-white">
                      {feature.title}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              id="privacy"
              className="mt-8 flex flex-col gap-4 rounded-[24px] border border-blue-500/15 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-blue-400">
                  Security posture
                </div>
                <div className="mt-2 text-sm leading-7 text-zinc-300">
                  Private local inference, BYOK cloud isolation, and centralized
                  controls for every team that touches production code.
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">
                Local-first by default
              </div>
            </div>
          </div>

          <div id="contact" className="lg:sticky lg:top-28">
            <EnterpriseForm />
          </div>
        </section>
      </div>
    </main>
  );
}
