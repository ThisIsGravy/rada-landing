import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RadaLandingPage from "./RadaLandingPage";

describe("RadaLandingPage", () => {
  it("renders the waitlist headline and CTA", () => {
    render(<RadaLandingPage />);

    expect(
      screen.getByText(/Rada remembers what/i),
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
});
