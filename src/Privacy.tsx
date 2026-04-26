import { navigateToRoute } from "./siteNavigation";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";

type Processor = {
  name: string;
  role: string;
  region: string;
};

const processors: Processor[] = [
  {
    name: "Supabase",
    role: "Account authentication and Postgres storage for account email, beta invite code, and opted-in cloud_request_completed telemetry events.",
    region: "United States and European Union (dual-region; account data is replicated across both regions for redundancy).",
  },
  {
    name: "Creem.io",
    role: "Merchant of record for all paid subscriptions. Handles payment processing, card storage, VAT and sales-tax collection, invoicing, and refunds.",
    region: "Determined by Creem's own data-processing terms; payment card data is never stored by Rada.",
  },
  {
    name: "Sentry",
    role: "Crash reports and unhandled-error events from the Rada desktop application, used solely to diagnose product defects.",
    region: "European Union (Sentry EU region).",
  },
  {
    name: "OpenRouter",
    role: "LLM inference proxy for opt-in cloud requests. Forwards prompts and returns model output. Rada does not log or persist the prompt or output content beyond the duration of the request.",
    region: "Routing is handled by OpenRouter; specific upstream model regions vary per request and are governed by OpenRouter's terms.",
  },
];

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "what-we-collect",
    title: "1. What We Collect",
    body: (
      <>
        <p>The Service collects only the following categories of personal data:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="text-white">Account email</span> — provided when
            you create an account, stored in Supabase auth, used to identify
            your account and to send transactional emails (sign-in links,
            billing receipts, security notifications).
          </li>
          <li>
            <span className="text-white">Beta invite code</span> — the redeemed
            invite code is recorded against your profile so we can attribute
            beta cohorts and revoke access if necessary.
          </li>
          <li>
            <span className="text-white">Local diagnostics</span> — when you
            opt in at first launch, the desktop app writes structured event
            logs to{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px] text-zinc-200">
              ~/.rada/diagnostics/rada-events.jsonl
            </code>
            . These logs stay on your device and are never uploaded by Rada
            unless you explicitly attach them to a support ticket.
          </li>
          <li>
            <span className="text-white">cloud_request_completed events</span>{" "}
            — for authenticated users who have opted into cloud telemetry,
            metadata about completed cloud LLM requests (model id, token
            counts, timestamp, latency, opaque request id) is synced to
            Supabase to support quota accounting and billing reconciliation.
            Prompt and response content are not included.
          </li>
          <li>
            <span className="text-white">Sentry crash and error events</span>{" "}
            — application stack traces, breadcrumbs, OS and app version
            metadata, and an anonymous installation id, transmitted to Sentry
            (EU region) for defect diagnosis.
          </li>
          <li>
            <span className="text-white">Billing data</span> — handled by
            Creem; we receive only a customer reference, subscription tier,
            and invoice metadata.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "what-we-do-not-collect",
    title: "2. What We Do NOT Collect",
    body: (
      <>
        <p>
          We have designed the Service so that the following categories of
          information do not leave your device through any Rada-operated
          channel:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>The text of your prompts.</li>
          <li>The contents of your source code or repositories.</li>
          <li>The contents of any file Rada reads from your filesystem.</li>
          <li>
            The text of any model output (cloud or local) generated for you.
          </li>
        </ul>
        <p className="mt-3">
          Cloud requests forwarded through OpenRouter are subject to
          OpenRouter's own terms, but Rada does not retain a copy of the
          prompt or output content after the request completes.
        </p>
      </>
    ),
  },
  {
    id: "processors",
    title: "3. Third-Party Processors",
    body: (
      <>
        <p>
          We rely on the following sub-processors. Each processes personal
          data only on documented instructions from Rada and is bound by a
          data-processing agreement.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#333]">
          {processors.map((processor, index) => (
            <div
              key={processor.name}
              className={`grid gap-2 px-5 py-5 ${
                index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
              } ${index !== processors.length - 1 ? "border-b border-[#222]" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-base font-semibold tracking-[-0.02em] text-white">
                  {processor.name}
                </div>
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-400">
                  {processor.region}
                </div>
              </div>
              <p className="text-sm leading-7 text-zinc-400">{processor.role}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "retention",
    title: "4. Data Retention",
    body: (
      <>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="text-white">Account records</span> are retained
            for the lifetime of your account and for up to ninety (90) days
            after closure to handle billing reversals and legal obligations.
          </li>
          <li>
            <span className="text-white">cloud_request_completed events</span>{" "}
            are retained for thirteen (13) months from the date of the event,
            then aggregated and deleted.
          </li>
          <li>
            <span className="text-white">Sentry events</span> are retained for
            ninety (90) days under our Sentry plan and then automatically
            purged.
          </li>
          <li>
            <span className="text-white">Local diagnostics</span> remain on
            your device and are rotated according to your local disk policy;
            you can delete them at any time.
          </li>
          <li>
            <span className="text-white">Billing records</span> retained by
            Creem are kept according to applicable tax and accounting law
            (typically seven years in Estonia).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "rights",
    title: "5. Your Rights Under the GDPR",
    body: (
      <>
        <p>
          Because Rada is operated by an Estonian entity and offers its
          Service to individuals in the European Economic Area, the General
          Data Protection Regulation applies. You have the right to:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="text-white">Access</span> the personal data we
            hold about you and obtain a copy.
          </li>
          <li>
            <span className="text-white">Rectify</span> inaccurate or
            incomplete personal data.
          </li>
          <li>
            <span className="text-white">Erasure</span> ("right to be
            forgotten") of personal data, subject to legal retention
            obligations.
          </li>
          <li>
            <span className="text-white">Data portability</span> — receive
            your data in a structured, commonly used, machine-readable format.
          </li>
          <li>
            <span className="text-white">Object</span> to processing based on
            our legitimate interests, including telemetry processing.
          </li>
          <li>
            <span className="text-white">Withdraw consent</span> for any
            processing that relies on consent (e.g. opted-in cloud
            telemetry), at any time and without affecting the lawfulness of
            processing carried out before withdrawal.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact{" "}
          <a
            href="mailto:privacy@userada.dev"
            className="text-blue-300 underline-offset-4 hover:underline"
          >
            privacy@userada.dev
          </a>
          . We will respond within thirty (30) days.
        </p>
      </>
    ),
  },
  {
    id: "complaints",
    title: "6. Complaints",
    body: (
      <>
        <p>
          If you believe we have not handled your personal data in accordance
          with applicable law, you have the right to lodge a complaint with
          your local supervisory authority. Rada's lead supervisory authority
          is the{" "}
          <span className="text-white">
            Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)
          </span>
          ,{" "}
          <a
            href="https://www.aki.ee/en"
            target="_blank"
            rel="noreferrer"
            className="text-blue-300 underline-offset-4 hover:underline"
          >
            aki.ee/en
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "7. Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Material changes
        will be communicated by email to active accounts at least thirty (30)
        days before they take effect. The "Last updated" date at the top of
        this page indicates when the policy was most recently revised.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <main className="relative min-h-screen bg-[#0e0e0e] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 pb-20 pt-6 sm:px-8 lg:px-10">
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateToRoute("terms")}
                className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => navigateToRoute("landing")}
                className="inline-flex items-center justify-center rounded-full border border-[#333] bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-blue-500/30 hover:bg-blue-500/10"
              >
                Back to home
              </button>
            </div>
          </nav>
        </header>

        <section className="mt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-blue-400">
            Legal
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-zinc-500">Last updated: 2026-04-25</p>

          <div
            role="note"
            className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/[0.06] p-5 text-sm leading-7 text-yellow-100"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-yellow-300">
              DRAFT — pending legal review before public launch
            </div>
            <p className="mt-2 text-yellow-100/90">
              This document is a working draft prepared for the Rada beta. It
              has not yet been reviewed by qualified privacy counsel.
              Founder to (1) confirm the data controller's registered name,
              address, and registry code; (2) confirm Sentry's regional plan
              actually maps to the EU data residency stated below; (3)
              confirm the data-processing agreement is in place with each
              processor; and (4) obtain legal review before this page is
              linked from public marketing surfaces or referenced in any
              signed contract.
            </p>
          </div>

          <div className="mt-10 space-y-10 text-sm leading-7 text-zinc-300">
            {sections.map((section) => (
              <article key={section.id} id={section.id}>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-2">{section.body}</div>
              </article>
            ))}

            <article id="contact">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                8. Contact
              </h2>
              <p className="mt-3">
                The data controller for personal data processed via the
                Service is Rada OÜ, Estonia. Privacy questions, GDPR rights
                requests, and data-processing agreement requests can be sent
                to{" "}
                <a
                  href="mailto:privacy@userada.dev"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  privacy@userada.dev
                </a>
                .
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
