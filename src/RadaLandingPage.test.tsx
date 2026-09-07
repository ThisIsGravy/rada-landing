import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RadaLandingPage from "./RadaLandingPage";
import Terms from "./Terms";
import { PRICING_TIERS } from "./lib/pricing";

describe("RadaLandingPage", () => {
  it("renders the waitlist headline and CTA", () => {
    render(<RadaLandingPage />);

    expect(
      screen.getByText(/Your AI\. Your machine\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join the waitlist/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/early access/i).length).toBeGreaterThan(0);
  });

  it("renders the comparison table with competitor column", () => {
    render(<RadaLandingPage />);

    expect(screen.getByText(/how rada compares/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Cursor \/ Claude Code \/ Codex/i),
    ).toBeInTheDocument();
  });

  it("links Privacy and Terms with real hrefs in both the header and footer", () => {
    render(<RadaLandingPage />);

    const header = screen.getByRole("navigation", { name: /primary/i });
    expect(within(header).getByRole("link", { name: /^privacy$/i })).toHaveAttribute("href", "/privacy");
    expect(within(header).getByRole("link", { name: /^terms$/i })).toHaveAttribute("href", "/terms");
    expect(within(header).getByRole("link", { name: /^pricing$/i })).toHaveAttribute("href", "#pricing");

    const footer = screen.getByRole("navigation", { name: /footer/i });
    expect(within(footer).getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy");
    expect(within(footer).getByRole("link", { name: /terms of service/i })).toHaveAttribute("href", "/terms");
  });

  it("shows public pricing for every tier with USD and billing period", () => {
    render(<RadaLandingPage />);

    const pricing = screen.getByRole("region", { name: /^pricing$/i });
    expect(pricing).toHaveAttribute("id", "pricing");
    for (const plan of PRICING_TIERS) {
      const card = within(pricing).getByRole("article", { name: new RegExp(`^${plan.name}$`, "i") });
      expect(within(card).getByText(`$${plan.monthlyPriceUsd}`)).toBeInTheDocument();
      if (plan.monthlyPriceUsd > 0) {
        expect(within(card).getByText(/USD \/ month/)).toBeInTheDocument();
      }
      if (plan.annualPriceUsd != null) {
        expect(within(card).getByText(new RegExp(`\\$${plan.annualPriceUsd} USD / year`))).toBeInTheDocument();
      }
    }
    expect(within(pricing).getByText(/Creem\.io/)).toBeInTheDocument();
    expect(within(pricing).getByText(/exclusive of VAT and sales tax/i)).toBeInTheDocument();
    expect(within(pricing).getByRole("link", { name: /refund terms/i })).toHaveAttribute("href", "/terms#subscriptions");
  });

  it("does not offer a checkout on the site (checkout lives in the app)", () => {
    render(<RadaLandingPage />);
    expect(screen.queryByRole("button", { name: /buy|subscribe|checkout/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /buy|subscribe|checkout/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/available in the app/i).length).toBeGreaterThan(0);
  });

  it("publishes no Ultra Lifetime price (not a live product)", () => {
    render(<RadaLandingPage />);
    const pricing = screen.getByRole("region", { name: /^pricing$/i });
    expect(within(pricing).queryByText(/lifetime/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$550|\$650|\$750|\$1,000/)).not.toBeInTheDocument();
  });

  it("matches the prices stated in the Terms of Service §4", () => {
    const { container } = render(<Terms />);
    const text = container.textContent ?? "";
    const pro = PRICING_TIERS.find((t) => t.tier === "Pro")!;
    const ultra = PRICING_TIERS.find((t) => t.tier === "Ultra")!;
    expect(text).toContain(`Pro Monthly — $${pro.monthlyPriceUsd} per month`);
    expect(text).toContain(`Ultra Monthly — $${ultra.monthlyPriceUsd} per month`);
    expect(text).toContain(`Pro Annual — $${pro.annualPriceUsd} per year`);
    expect(text).toContain("Creem.io");
  });

  it("states the same 14-day refund window as the Terms, which also carry the withdrawal waiver", () => {
    render(<RadaLandingPage />);
    expect(screen.getByText(/within 14 days of the original charge/i)).toBeInTheDocument();

    const { container } = render(<Terms />);
    const terms = container.textContent ?? "";
    expect(terms).toContain("within fourteen (14) days of the original charge");
    expect(terms).toContain("after the 14-day window the Ultra Lifetime purchase is final");
    expect(terms).not.toMatch(/thirty \(30\) days of (the original charge|purchase)/);
    expect(terms).toContain("Right of withdrawal and its waiver");
    expect(terms).toContain("lose your statutory right of withdrawal");
  });
});
