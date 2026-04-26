import { navigateToRoute } from "./siteNavigation";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: (
      <>
        <p>
          These Terms of Service (the "Terms") form a binding agreement between
          you and Rada OÜ, a private limited company organized under the laws of
          the Republic of Estonia ("Rada", "we", "us"). By creating a Rada
          account, installing the Rada desktop application, or otherwise using
          the Service, you confirm that you have read, understood, and agreed
          to be bound by these Terms and our Privacy Policy.
        </p>
        <p className="mt-3">
          If you do not agree with any part of these Terms, you must not use
          the Service.
        </p>
      </>
    ),
  },
  {
    id: "beta",
    title: "2. Beta Status & Service Availability",
    body: (
      <>
        <p>
          Rada is currently offered as a closed beta. The Service is provided
          "as is" and may contain defects, incomplete features, or behavior
          that changes between releases without notice. We may modify, suspend,
          or discontinue any part of the Service at any time, with or without
          prior notice, while the Service remains in beta.
        </p>
        <p className="mt-3">
          We do not guarantee any service-level availability, uptime, response
          time, or support response window during the beta period. You are
          responsible for maintaining your own copies of any work product
          generated with assistance from the Service.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "3. Eligibility & Access",
    body: (
      <>
        <p>
          Access to the Service during the closed beta is by invitation only.
          You must redeem a valid beta invite code to create an account, and we
          reserve the right to revoke access at any time at our sole discretion.
          You must be at least 18 years of age and legally able to enter into a
          binding contract in your jurisdiction to use the Service.
        </p>
        <p className="mt-3">
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activity that occurs under your
          account. You must promptly notify us of any unauthorized access.
        </p>
      </>
    ),
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions, Pricing & Billing",
    body: (
      <>
        <p>
          Rada is offered through the following paid tiers, billed in U.S.
          dollars and processed by our merchant of record (see Section 4(c)):
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="text-white">Pro Monthly</span> — $19 per month,
            billed monthly until cancelled.
          </li>
          <li>
            <span className="text-white">Ultra Monthly</span> — $55 per month,
            billed monthly until cancelled.
          </li>
          <li>
            <span className="text-white">Pro Annual</span> — $149 per year,
            billed once per twelve-month term.
          </li>
          <li>
            <span className="text-white">Ultra Lifetime</span> — one-time payment,
            phased pricing ($550 / $650 / $750 / $1,000 depending on phase),
            capped at 1,430 lifetime seats total across all phases. Once the
            cap is reached, no further lifetime seats will be sold under these
            Terms.
          </li>
        </ul>

        <p className="mt-4 text-white">(a) Auto-renewal.</p>
        <p>
          Monthly and annual subscriptions renew automatically at the start of
          each new term using the payment method on file, unless cancelled at
          least one (1) calendar day before the renewal date.
        </p>

        <p className="mt-4 text-white">(b) Refunds.</p>
        <p>
          Pro Monthly, Ultra Monthly, and Pro Annual purchases may be refunded
          within thirty (30) days of the original charge by emailing
          billing@userada.dev. The Ultra Lifetime tier may be refunded within
          thirty (30) days of purchase; <span className="text-white">after
          the 30-day window the Ultra Lifetime purchase is final and
          non-refundable</span> under any circumstances, including any future
          discontinuation of the Service.
        </p>

        <p className="mt-4 text-white">(c) Merchant of Record.</p>
        <p>
          Payments are processed by Creem.io, who acts as the merchant of
          record for all Rada purchases. Creem is responsible for collecting
          and remitting applicable VAT, sales tax, and other transactional
          taxes. Receipts and tax invoices are issued by Creem.
        </p>

        <p className="mt-4 text-white">(d) Price changes.</p>
        <p>
          We may change pricing for new subscriptions at any time. Price
          changes affecting an existing renewing subscription will be
          communicated by email at least thirty (30) days before they take
          effect.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "5. Acceptable Use",
    body: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>violate any applicable law, regulation, or third-party right;</li>
          <li>
            generate, store, or distribute material that is unlawful,
            defamatory, infringing, or abusive;
          </li>
          <li>
            attempt to reverse-engineer, decompile, or otherwise derive the
            source code of any non-open component of the Service;
          </li>
          <li>
            interfere with the integrity, performance, or security of the
            Service, including bypassing rate limits, quota caps, or routing
            controls;
          </li>
          <li>
            resell, sublicense, or share account access with any individual who
            does not hold their own valid Rada subscription.
          </li>
        </ul>
        <p className="mt-3">
          We may suspend or terminate accounts that we believe, in our
          reasonable judgement, are violating this section.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "6. Disclaimer of Warranties",
    body: (
      <>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
          OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, NON-INFRINGEMENT, OR THAT THE SERVICE WILL BE UNINTERRUPTED,
          ERROR-FREE, OR SECURE. AI-GENERATED OUTPUT MAY BE INACCURATE OR
          INAPPROPRIATE FOR YOUR USE CASE; YOU REMAIN SOLELY RESPONSIBLE FOR
          REVIEWING ALL OUTPUT BEFORE RELYING ON IT.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    body: (
      <>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
          RADA, ITS AFFILIATES, OR ITS SUPPLIERS BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY
          LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITY ARISING OUT
          OF OR RELATED TO THESE TERMS OR THE SERVICE. OUR TOTAL AGGREGATE
          LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS WILL NOT EXCEED
          THE GREATER OF (A) THE AMOUNT YOU PAID TO RADA IN THE TWELVE (12)
          MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE
          HUNDRED EUROS (€100).
        </p>
        <p className="mt-3">
          Nothing in these Terms limits liability that cannot be limited under
          applicable law, including liability for death, personal injury caused
          by negligence, or fraud.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "8. Termination",
    body: (
      <>
        <p>
          You may cancel your subscription at any time from your account
          settings or by contacting billing@userada.dev. We may suspend or
          terminate your access to the Service at any time for breach of these
          Terms, suspected fraud or abuse, or risk to the integrity of the
          Service.
        </p>
        <p className="mt-3">
          Upon termination, your right to access the Service ends immediately.
          Sections 4(b), 6, 7, and 9 survive termination.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "9. Governing Law & Jurisdiction",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the Republic of Estonia,
          without regard to its conflict-of-laws principles. Any dispute
          arising out of or relating to these Terms or the Service will be
          resolved exclusively by the courts of Harju County, Estonia, except
          that nothing in this section restricts your rights as a consumer
          under the mandatory laws of your country of residence.
        </p>
      </>
    ),
  },
];

export default function Terms() {
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
                onClick={() => navigateToRoute("privacy")}
                className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
              >
                Privacy
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
            Terms of Service
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
              has not yet been reviewed by qualified counsel in Estonia or any
              other jurisdiction. Founder to swap placeholder business details
              (registered address, registry code, VAT number, contact details
              for the data controller) and obtain legal review before this
              page is linked from public marketing surfaces or referenced in
              any signed contract.
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
                10. Contact
              </h2>
              <p className="mt-3">
                Questions about these Terms can be sent to{" "}
                <a
                  href="mailto:legal@userada.dev"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  legal@userada.dev
                </a>
                . Billing and refund requests should be sent to{" "}
                <a
                  href="mailto:billing@userada.dev"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  billing@userada.dev
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
