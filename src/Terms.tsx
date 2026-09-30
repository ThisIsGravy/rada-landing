import { routePath } from "./siteNavigation";
import RadaLogoMark from "./components/RadaLogoMark";
import RadaWordmark from "./components/RadaWordmark";
import {
  ALLOWANCE_PLAN_LABELS,
  CREDIT_WEIGHTS,
  DAILY_CREDITS,
  FAIR_USE_CEILINGS,
  LIFETIME_PHASES,
  LIFETIME_SEAT_CAP,
  MODEL_CLASSES,
  PRO_RATA_MIN_TERM_YEARS,
  TERMS_VERSION,
  creditCost,
  formatUsd,
  proRataRefundUsd,
  type AllowancePlan,
} from "./lib/pricing";

// DRAFT FOR COUNSEL REVIEW (branch terms-lifetime). Every plan figure in
// these Terms is read from the pending-decisions block in src/lib/pricing.ts
// — change a number there, never in the prose below.

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
];

/** House style for counts in these Terms: "three (3)". */
function spelled(n: number): string {
  return Number.isInteger(n) && n >= 0 && n < NUMBER_WORDS.length ? `${NUMBER_WORDS[n]} (${n})` : String(n);
}

function credits(n: number): string {
  return `${n} credit${n === 1 ? "" : "s"}`;
}

const seatCap = LIFETIME_SEAT_CAP.toLocaleString("en-US");
const minTermMonths = PRO_RATA_MIN_TERM_YEARS * 12;
const allowancePlans: AllowancePlan[] = ["Pro", "ProAnnual", "Ultra", "Lifetime"];
const lifetimeCeilings = FAIR_USE_CEILINGS.Lifetime;

// Worked examples, derived so they can never disagree with the constants.
const ultraDaily = DAILY_CREDITS.Ultra;
const ultraFastRequests = Math.floor(ultraDaily / creditCost("Fast"));
const ultraFrontierRequests = Math.floor(ultraDaily / creditCost("Frontier"));
const ultraAutorouterRequests = Math.floor(ultraDaily / creditCost("Fast", true));
const exampleEntryPrice = LIFETIME_PHASES[0].priceUsd;
const exampleMonthsElapsed = 12;
const exampleMonthsRemaining = minTermMonths - exampleMonthsElapsed;
const exampleRefund = proRataRefundUsd(exampleEntryPrice, exampleMonthsElapsed);

const subhead = "mt-4 text-white";
const tableWrap = "mt-3 overflow-x-auto rounded-xl border border-[#333]";
const tableClass = "w-full min-w-[30rem] border-collapse text-left text-sm";
const th = "border-b border-[#333] bg-white/[0.03] px-3 py-2 font-medium text-white";
const td = "border-b border-[#222] px-3 py-2 align-top";

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
    title: "2. Beta Status, Service Changes & Availability",
    body: (
      <>
        <p className={subhead}>(a) Beta status.</p>
        <p>
          Rada is currently offered as a closed beta. The Service is provided
          "as is" and may contain defects, incomplete features, or behavior
          that changes between releases. We do not guarantee any service-level
          availability, uptime, response time, or support response window
          during the beta period. You are responsible for maintaining your own
          copies of any work product generated with assistance from the
          Service.
        </p>

        <p className={subhead}>(b) Changes to the Service and these Terms.</p>
        <p>
          We may change the Service and these Terms. If a change is materially
          adverse to you — for example, it reduces your plan's daily credits,
          lowers its monthly fair-use ceilings, removes a model class from your
          plan, or discontinues the managed cloud service — we will tell you by
          email at least thirty (30) days before it takes effect. We may make
          such a change with shorter notice, or none, only where it is
          necessary to respond to an urgent security threat or to comply with
          a legal obligation or an order of a court or public authority; we
          will then tell you as soon as reasonably practicable and explain
          why. Bug fixes, new features, and changes that are not materially
          adverse to you, including model changes permitted by Section 5(d),
          may be made at any time.
        </p>
        <p className="mt-3">
          If you do not accept a materially adverse change, you may cancel
          before it takes effect and we will refund the unused part of any
          prepaid subscription period. If you hold Ultra Lifetime and the
          change takes effect within the Minimum Term, you may instead end your
          Ultra Lifetime seat and receive the pro-rata refund described in
          Section 4(f)(v).
        </p>

        <p className={subhead}>(c) Versions of these Terms.</p>
        <p>
          Each version of these Terms is identified by the version shown at the
          top of this page. We keep copies of earlier versions and will send
          you any of them on request to legal@userada.dev. When you buy Ultra
          Lifetime, we record the version of these Terms you accepted.
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
          You must redeem a valid beta invite code to create an account. We may
          decline an invitation, or withdraw beta access from an account that
          has no paid plan, at our discretion. We will suspend or end access
          for an account with a paid plan, including an Ultra Lifetime seat,
          only as described in Section 9. An Ultra Lifetime seat remains valid
          when the Service leaves beta.
        </p>
        <p className="mt-3">
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
            <span className="text-white">Ultra Lifetime</span> — a one-time
            payment for Ultra-level managed cloud access for as long as Rada
            operates its managed cloud service, at the phase price set out in
            Section 4(f) and capped at {seatCap} seats in total.
          </li>
        </ul>
        <p className="mt-3">
          The daily credits and monthly fair-use ceilings of each plan are set
          out in Section 5.
        </p>

        <p className={subhead}>(a) Auto-renewal.</p>
        <p>
          Monthly and annual subscriptions renew automatically at the start of
          each new term using the payment method on file, unless cancelled at
          least one (1) calendar day before the renewal date. Ultra Lifetime
          does not renew.
        </p>

        <p className={subhead}>(b) Refunds.</p>
        <p>
          Pro Monthly, Ultra Monthly, and Pro Annual purchases may be refunded
          within fourteen (14) days of the original charge by emailing
          billing@userada.dev. An Ultra Lifetime purchase may be refunded in
          full within fourteen (14) days of purchase in the same way.{" "}
          <span className="text-white">
            During those first fourteen (14) days, Premium and Frontier models
            are not available on an Ultra Lifetime seat
          </span>{" "}
          (the Autorouter uses only Fast and Standard models); they become
          available automatically once the fourteen (14) days have passed.
          After the 14-day window, an Ultra Lifetime purchase is not
          refundable on request, but you keep the pro-rata refund in Section
          4(f)(v) if we discontinue the managed cloud service within the
          Minimum Term, and any refund that applicable law requires. Refunds
          are issued by Creem to the original payment method.
        </p>

        <p className={subhead}>(c) Merchant of Record.</p>
        <p>
          Payments are processed by Creem.io, who acts as the merchant of
          record for all Rada purchases. Creem is responsible for collecting
          and remitting applicable VAT, sales tax, and other transactional
          taxes. Receipts and tax invoices are issued by Creem.
        </p>

        <p className={subhead}>(d) Price changes.</p>
        <p>
          We may change pricing for new subscriptions at any time. Price
          changes affecting an existing renewing subscription will be
          communicated by email at least thirty (30) days before they take
          effect. The price of new Ultra Lifetime seats changes only as set out
          in Section 4(f)(ii). Once you have paid for an Ultra Lifetime seat,
          its price is fixed and you will not be charged again for it.
        </p>

        <p className={subhead}>(e) Right of withdrawal and its waiver.</p>
        <p>
          If you are a consumer in the European Economic Area or the United
          Kingdom, you may have a statutory right to withdraw from a contract
          for digital services within fourteen (14) days without giving a
          reason. The Service is a digital service that begins immediately
          upon purchase. <span className="text-white">By completing checkout
          you expressly request that we begin providing the Service
          immediately, and you acknowledge that you thereby lose your
          statutory right of withdrawal once performance has begun.</span>{" "}
          You confirm this by ticking the acknowledgement box on the Creem
          checkout page; the purchase cannot be completed without it. This
          waiver does not affect the voluntary 14-day refund window in
          Section 4(b), which we offer in addition to, and independently of,
          any statutory right.
        </p>

        <p id="ultra-lifetime" className={`${subhead} scroll-mt-24`}>
          (f) Ultra Lifetime.
        </p>
        <p>
          <span className="text-white">(i) What "lifetime" means.</span> Ultra
          Lifetime is a one-time payment that gives one Rada account the
          features of the Ultra plan, with the Ultra Lifetime daily credits and
          monthly fair-use ceilings in Section 5,{" "}
          <span className="text-white">
            for as long as Rada operates its managed cloud service
          </span>
          . In these Terms, "lifetime" means the lifetime of Rada's managed
          cloud service. It does not mean your lifetime, the life of any
          device, or any fixed period. Temporary unavailability, maintenance,
          reaching a fair-use ceiling, and model changes under Section 5(d) do
          not end the managed cloud service. Ending managed cloud access for
          Ultra Lifetime seats while continuing it for other plans counts as
          discontinuing it for the purposes of Section 4(f)(v).
        </p>
        <p className="mt-3">
          <span className="text-white">(ii) Phase price.</span> Seats are sold
          in phases. Which phase applies depends on how many Ultra Lifetime
          seats have been sold in total, including seats that were later
          refunded, so the price never goes down from one buyer to the next:
        </p>
        <div className={tableWrap}>
          <table className={tableClass} data-testid="lifetime-ladder">
            <thead>
              <tr>
                <th className={th} scope="col">Phase</th>
                <th className={th} scope="col">Seats</th>
                <th className={th} scope="col">Price (USD, one-time)</th>
              </tr>
            </thead>
            <tbody>
              {LIFETIME_PHASES.map((p) => (
                <tr key={p.phase}>
                  <td className={td}>{`Phase ${p.phase}`}</td>
                  <td className={td}>
                    {`${p.firstSeat.toLocaleString("en-US")}–${p.lastSeat.toLocaleString("en-US")}`}
                  </td>
                  <td className={td}>{formatUsd(p.priceUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          <span className="text-white">
            The price that applies to you is the price shown when your checkout
            is created.
          </span>{" "}
          If you complete that checkout, you pay that price and receive a seat,
          even if the phase changes before your payment completes. VAT or sales
          tax is added by Creem at checkout where applicable. We may release
          the seats of a phase in smaller batches, and may pause or stop
          selling Ultra Lifetime seats at any time; this does not affect seats
          already sold.
        </p>
        <p className="mt-3">
          <span className="text-white">(iii) Seat cap.</span> No more than{" "}
          {seatCap} Ultra Lifetime seats will be sold across all phases. A seat
          that is refunded may be offered again at the phase price then
          applicable. If a payment completes after the cap has been reached, we
          will refund it in full and no seat is created.
        </p>
        <p className="mt-3">
          <span className="text-white">(iv) Allowance and ceilings.</span> An
          Ultra Lifetime seat includes {DAILY_CREDITS.Lifetime} daily credits,
          a soft ceiling of {formatUsd(lifetimeCeilings.softUsd)} per month and
          a hard ceiling of {formatUsd(lifetimeCeilings.hardUsd)} per month, as
          described in Section 5. These ceilings differ from those of Ultra
          Monthly.
        </p>
        <p className="mt-3">
          <span className="text-white">
            (v) If we discontinue the managed cloud service.
          </span>{" "}
          If we decide to stop operating the managed cloud service, we will
          tell Ultra Lifetime holders by email at least thirty (30) days before
          it ends. If it ends within {spelled(PRO_RATA_MIN_TERM_YEARS)} years
          of your purchase date (the "Minimum Term"), we will refund part of
          the price you paid, in proportion to the whole months of the Minimum
          Term that remain: price paid × months remaining ÷ {minTermMonths}.
          For example, if you paid {formatUsd(exampleEntryPrice)} and the
          service ends {exampleMonthsElapsed} months after your purchase, you
          receive {formatUsd(exampleEntryPrice)} × {exampleMonthsRemaining} ÷{" "}
          {minTermMonths} = {formatUsd(exampleRefund)}. We will pay the refund
          within thirty (30) days after the service ends, through Creem to
          your original payment method where possible and otherwise by bank
          transfer. If the managed cloud service ends after the Minimum Term,
          Ultra Lifetime ends with it and no refund is due.
        </p>
        <p className="mt-3">
          <span className="text-white">(vi) Personal to your account.</span> An
          Ultra Lifetime seat belongs to the Rada account that bought it. It
          cannot be transferred, resold, or shared, and it ends only as
          described in this Section 4(f) or in Section 9.
        </p>
        <p className="mt-3">
          <span className="text-white">(vii) Existing subscriptions.</span> If
          you buy Ultra Lifetime while you have an active Pro or Ultra
          subscription, that subscription is cancelled when your purchase
          completes.
        </p>
      </>
    ),
  },
  {
    id: "fair-use",
    title: "5. Plans, Allowances and Fair Use",
    body: (
      <>
        <p>
          Paid plans include managed cloud access: Rada sends your cloud
          requests to AI models through Rada's own provider accounts ("Rada's
          key"). This section sets out how much managed cloud access each plan
          includes. Local models, and cloud requests made with your own API
          key, do not use credits and are not limited by this section. The Free
          plan does not include managed cloud access.
        </p>

        <p className={subhead}>(a) Daily credits.</p>
        <p>
          Each plan includes a number of cloud credits per day, shown in the
          app as your Daily Cloud Burst. Credits reset at 00:00 UTC each day,
          and unused credits do not carry over. From time to time we may add
          temporary extra credits (for example, on Burst Day); these are
          promotional and may end at any time.
        </p>
        <div className={tableWrap}>
          <table className={tableClass} data-testid="plan-allowances">
            <thead>
              <tr>
                <th className={th} scope="col">Plan</th>
                <th className={th} scope="col">Daily credits</th>
                <th className={th} scope="col">Soft ceiling (per month)</th>
                <th className={th} scope="col">Hard ceiling (per month)</th>
              </tr>
            </thead>
            <tbody>
              {allowancePlans.map((plan) => (
                <tr key={plan}>
                  <td className={td}>{ALLOWANCE_PLAN_LABELS[plan]}</td>
                  <td className={td}>{DAILY_CREDITS[plan]}</td>
                  <td className={td}>{formatUsd(FAIR_USE_CEILINGS[plan].softUsd)}</td>
                  <td className={td}>{formatUsd(FAIR_USE_CEILINGS[plan].hardUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={subhead}>(b) What a request costs.</p>
        <p>
          Every model on Rada's key belongs to one of four classes. A request
          costs the credits for the class of the model that serves it. When
          the Autorouter chooses the model for you, the request costs half as
          much:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          {MODEL_CLASSES.map((c) => (
            <li key={c}>
              <span className="text-white">{c}</span>
              {` — ${credits(CREDIT_WEIGHTS[c])} per request (${credits(creditCost(c, true))} through the Autorouter)`}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          For example, Ultra's {ultraDaily} daily credits cover{" "}
          {ultraFastRequests} Fast requests, or {ultraFrontierRequests}{" "}
          Frontier requests, or up to {ultraAutorouterRequests} requests
          through the Autorouter when it uses Fast models. The app shows each
          model's class and credit cost before you send a request, and shows
          which classes your plan includes. On an Ultra Lifetime seat, Premium
          and Frontier models are not available during the first fourteen (14)
          days (Section 4(b)).
        </p>

        <p className={subhead}>(c) Monthly fair-use ceilings.</p>
        <p>
          Daily credits limit how many requests you can send; the monthly
          ceilings limit what those requests cost. For each plan we measure the
          actual amount that model providers charge Rada for your requests on
          Rada's key during each calendar month (UTC), and apply two ceilings
          (see the table in Section 5(a)):
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="text-white">Soft ceiling.</span> When your cost
            for the month reaches the soft ceiling, only Fast models remain
            available on Rada's key, whether you choose them or the Autorouter
            does. Standard, Premium, and Frontier models are paused until 00:00
            UTC on the 1st of the next month.
          </li>
          <li>
            <span className="text-white">Hard ceiling.</span> When your cost
            for the month reaches the hard ceiling, cloud requests on Rada's
            key stop until 00:00 UTC on the 1st of the next month.
          </li>
        </ul>
        <p className="mt-3">
          Under either ceiling, local models and cloud requests with your own
          API key keep working. Reaching a ceiling is not a breach of these
          Terms, does not change your price, and is not by itself a reason to
          suspend or end your account. The app tells you when a ceiling applies
          and when it lifts.
        </p>

        <p className={subhead}>(d) Choice of models.</p>
        <p>
          We choose which models are offered in each class and which provider
          serves them, and we do not promise that any particular model or
          provider will remain available. We may add, remove, or substitute
          models within a class — for example, when a provider retires a model
          or changes its price, or a better model becomes available — and may
          move a model to a different class when its price or capability
          changes, which changes its credit cost. The app always shows a
          model's current class and credit cost before you send a request. As
          long as each class included in your plan still offers at least one
          model, these changes are not materially adverse changes under
          Section 2(b).
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable Use",
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
            Service, including bypassing rate limits, daily credits, fair-use
            ceilings, model-class restrictions, or routing controls;
          </li>
          <li>
            resell, sublicense, or share account access with any individual who
            does not hold their own paid Rada plan.
          </li>
        </ul>
        <p className="mt-3">
          If we reasonably believe an account is violating this section, we may
          take the steps described in Section 9, which also sets out the
          protections that apply to paid plans and Ultra Lifetime seats.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "7. Disclaimer of Warranties",
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
    title: "8. Limitation of Liability",
    body: (
      <>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
          RADA, ITS AFFILIATES, OR ITS SUPPLIERS BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY
          LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITY ARISING OUT
          OF OR RELATED TO THESE TERMS OR THE SERVICE. OUR TOTAL AGGREGATE
          LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS WILL NOT EXCEED
          THE GREATEST OF (A) THE AMOUNT YOU PAID FOR THE SERVICE, INCLUDING
          THROUGH OUR MERCHANT OF RECORD, IN THE TWELVE (12) MONTHS PRECEDING
          THE EVENT GIVING RISE TO THE CLAIM, (B) IF YOU HOLD AN ULTRA LIFETIME
          SEAT, THE AMOUNT YOU PAID FOR THAT SEAT, OR (C) ONE HUNDRED EUROS
          (€100).
        </p>
        <p className="mt-3">
          This limit does not reduce any refund owed to you under Sections
          2(b), 4(b), or 4(f)(v).
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
    title: "9. Suspension & Termination",
    body: (
      <>
        <p className={subhead}>(a) By you.</p>
        <p>
          You may cancel your subscription at any time from your account
          settings or by contacting billing@userada.dev. You may also close
          your account at any time. Closing an account that holds an Ultra
          Lifetime seat ends the seat, with a refund only within the 14-day
          window in Section 4(b).
        </p>

        <p className={subhead}>(b) Suspension by us.</p>
        <p>
          We may temporarily suspend your access without prior notice only
          where this is reasonably necessary to stop an ongoing security
          threat, fraud, or activity that is harming the Service or other
          users, or to comply with law. We will tell you the reason promptly,
          unless the law prevents us, and restore access as soon as the cause
          is resolved. While a payment dispute (chargeback) on an Ultra
          Lifetime purchase is open, cloud access on that seat is paused; if
          the dispute ends with the payment returned to you, the seat ends, and
          otherwise access resumes.
        </p>

        <p className={subhead}>(c) Ending a Free account or a subscription.</p>
        <p>
          We may end a Free account, or a monthly or annual subscription, if
          you breach these Terms, commit fraud or abuse, or put the integrity
          or security of the Service at risk.
        </p>

        <p className={subhead}>(d) Ending an Ultra Lifetime seat.</p>
        <p>
          <span className="text-white">
            We will end an Ultra Lifetime seat only for a material breach of
            these Terms by you, and never on suspicion alone.
          </span>{" "}
          Before we do, we will send you a written notice by email that
          describes the breach and, where it can be remedied, give you at
          least fourteen (14) days to remedy it. We will consider any response
          you send to legal@userada.dev before deciding. Examples of a
          material breach are reselling or sharing the seat, deliberately
          circumventing daily credits or fair-use ceilings, and using the
          Service unlawfully. Where a breach cannot be remedied, such as
          payment fraud, we may end the seat on written notice giving our
          reasons. A seat ended under this paragraph is not refunded, except
          where applicable law requires.
        </p>

        <p className={subhead}>(e) Effect of termination.</p>
        <p>
          When your access ends, your right to use the Service ends. Sections
          2(b), 4(b), 4(e), 4(f)(v), 7, 8, and 10 survive termination.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "10. Governing Law & Jurisdiction",
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
    <main className="relative min-h-[100dvh] bg-[#0e0e0e] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col px-6 pb-20 pt-6 sm:px-8 lg:px-10">
        <header className="sticky top-0 z-20 rounded-full border border-[#333] bg-[#0e0e0e]/80 px-4 py-3 backdrop-blur-xl">
          <nav className="flex items-center justify-between gap-4">
            <a
              href={routePath("landing")}
              aria-label="Rada home"
              className="flex items-center gap-3 border-0 bg-transparent p-0 text-left no-underline"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#333] bg-white/[0.03]">
                <RadaLogoMark className="h-9 w-9 object-contain select-none" />
              </div>
              <RadaWordmark
                className="h-14 w-[188px] object-contain select-none max-sm:hidden sm:w-[208px]"
                showMark={false}
              />
            </a>

            <div className="flex items-center gap-3">
              <a
                href={routePath("privacy")}
                className="hidden text-sm text-zinc-400 no-underline transition hover:text-white sm:inline-flex"
              >
                Privacy
              </a>
              <a
                href={routePath("landing")}
                className="inline-flex items-center justify-center rounded-full border border-[#333] bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-100 no-underline transition hover:border-blue-500/30 hover:bg-blue-500/10"
              >
                Back to home
              </a>
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
          <p className="mt-4 text-sm text-zinc-500" data-testid="terms-version">
            {`Version ${TERMS_VERSION} · Last updated: ${TERMS_VERSION}`}
          </p>

          <div
            role="note"
            className="mt-8 rounded-2xl border border-[#333] bg-white/[0.03] p-5 text-sm leading-7 text-zinc-300"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
              Company details
            </div>
            <p className="mt-2">
              <strong className="text-white">Rada OÜ</strong> — a private
              limited company (osaühing) registered in the Republic of Estonia.
            </p>
            <ul className="mt-2 space-y-1 text-zinc-400">
              <li>Registry code (registrikood): 111111111</li>
              <li>VAT (KMKR) number: [VAT NUMBER — to be confirmed]</li>
              <li>Registered office: [REGISTERED OFFICE ADDRESS], Tallinn, Estonia</li>
              <li>
                Legal contact:{" "}
                <a
                  href="mailto:legal@userada.dev"
                  className="text-blue-300 underline-offset-4 hover:underline"
                >
                  legal@userada.dev
                </a>
              </li>
            </ul>
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
                11. Contact
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
