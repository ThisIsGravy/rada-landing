import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Terms from "./Terms";
import {
  ALLOWANCE_PLAN_LABELS,
  CREDIT_WEIGHTS,
  DAILY_CREDITS,
  FAIR_USE_CEILINGS,
  LIFETIME_LADDER,
  LIFETIME_PHASES,
  LIFETIME_SEAT_CAP,
  MODEL_CLASSES,
  PRO_RATA_MIN_TERM_YEARS,
  TERMS_VERSION,
  creditCost,
  formatUsd,
  type AllowancePlan,
} from "./lib/pricing";

// The Terms must render every plan figure from the pending-decisions block
// in src/lib/pricing.ts, so a founder decision is a one-line change there.
function termsText() {
  const { container } = render(<Terms />);
  return (container.textContent ?? "").replace(/\s+/g, " ");
}

describe("Terms of Service", () => {
  it("shows the version and a matching last-updated date", () => {
    render(<Terms />);
    expect(screen.getByTestId("terms-version")).toHaveTextContent(
      `Version ${TERMS_VERSION} · Last updated: ${TERMS_VERSION}`,
    );
    expect(TERMS_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("renders the lifetime ladder from LIFETIME_LADDER", () => {
    render(<Terms />);
    const table = screen.getByTestId("lifetime-ladder");
    const rows = within(table).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(LIFETIME_LADDER.length);
    LIFETIME_PHASES.forEach((phase, i) => {
      const row = rows[i];
      expect(row).toHaveTextContent(`Phase ${phase.phase}`);
      expect(row).toHaveTextContent(
        `${phase.firstSeat.toLocaleString("en-US")}–${phase.lastSeat.toLocaleString("en-US")}`,
      );
      expect(row).toHaveTextContent(formatUsd(phase.priceUsd));
    });
    expect(LIFETIME_PHASES[LIFETIME_PHASES.length - 1].lastSeat).toBe(LIFETIME_SEAT_CAP);

    const text = termsText();
    expect(text).toContain(`capped at ${LIFETIME_SEAT_CAP.toLocaleString("en-US")} seats in total`);
    expect(text).toContain(`No more than ${LIFETIME_SEAT_CAP.toLocaleString("en-US")} Ultra Lifetime seats`);
    expect(text).toContain("The price that applies to you is the price shown when your checkout is created.");
    // Retired figures from the previous version (unless re-adopted in the ladder).
    expect(text).not.toContain("1,430");
    const current = new Set(LIFETIME_LADDER.map((p) => p.priceUsd));
    for (const retired of [550, 650, 750].filter((p) => !current.has(p))) {
      expect(text).not.toContain(formatUsd(retired));
    }
  });

  it("defines lifetime by the managed cloud service and offers the pro-rata refund", () => {
    const text = termsText();
    expect(text).toContain("for as long as Rada operates its managed cloud service");
    expect(text).not.toMatch(/forever/i);
    expect(text).toMatch(new RegExp(`within (\\w+ \\()?${PRO_RATA_MIN_TERM_YEARS}\\)? years of your purchase date`));
    expect(text).toContain(`÷ ${PRO_RATA_MIN_TERM_YEARS * 12}`);
    expect(text).toContain('(the "Minimum Term")');
  });

  it("has a Plans, allowances and fair use section driven by the constants", () => {
    render(<Terms />);
    expect(screen.getByRole("heading", { name: /plans, allowances and fair use/i })).toBeInTheDocument();

    const table = screen.getByTestId("plan-allowances");
    const plans: AllowancePlan[] = ["Pro", "ProAnnual", "Ultra", "Lifetime"];
    const rows = within(table).getAllByRole("row").slice(1);
    plans.forEach((plan, i) => {
      expect(rows[i]).toHaveTextContent(ALLOWANCE_PLAN_LABELS[plan]);
      const cells = within(rows[i]).getAllByRole("cell").map((c) => c.textContent);
      expect(cells).toEqual([
        ALLOWANCE_PLAN_LABELS[plan],
        String(DAILY_CREDITS[plan]),
        formatUsd(FAIR_USE_CEILINGS[plan].softUsd),
        formatUsd(FAIR_USE_CEILINGS[plan].hardUsd),
      ]);
    });

    const text = termsText();
    for (const c of MODEL_CLASSES) {
      expect(text).toMatch(new RegExp(`${c} — ${CREDIT_WEIGHTS[c]} credits? per request \\(${creditCost(c, true)} credits? through the Autorouter\\)`));
    }
    expect(text).toContain("only Fast models remain available on Rada's key");
    expect(text).toContain("cloud requests on Rada's key stop until 00:00 UTC on the 1st of the next month");
    expect(text).toContain("local models and cloud requests with your own API key keep working");
    expect(text).toContain("We may add, remove, or substitute models within a class");
  });

  it("drops the one-sided clauses the lifetime review flagged", () => {
    const text = termsText();
    expect(text).not.toContain("with or without prior notice");
    expect(text).not.toMatch(/non-refundable under any circumstances/i);
    expect(text).not.toMatch(/including any future discontinuation/i);
    expect(text).not.toMatch(/suspected fraud/i);
    expect(text).not.toContain("at any time at our sole discretion");
    expect(text).toContain("at least thirty (30) days before it takes effect");
    expect(text).toContain("never on suspicion alone");
    expect(text).toContain("give you at least fourteen (14) days to remedy it");
    expect(text).toMatch(/IF YOU HOLD AN ULTRA LIFETIME SEAT, THE AMOUNT YOU PAID FOR THAT SEAT/);
    expect(text).toContain("Premium and Frontier models are not available on an Ultra Lifetime seat");
  });

  it("keeps the company-detail placeholders untouched", () => {
    const text = termsText();
    expect(text).toContain("Registry code (registrikood): 111111111");
    expect(text).toContain("VAT (KMKR) number: [VAT NUMBER — to be confirmed]");
    expect(text).toContain("Registered office: [REGISTERED OFFICE ADDRESS], Tallinn, Estonia");
  });
});
