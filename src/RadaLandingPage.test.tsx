import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RadaLandingPage from "./RadaLandingPage";

describe("RadaLandingPage", () => {
  it("renders the launch headline and pricing section", () => {
    render(<RadaLandingPage />);

    expect(
      screen.getByText("Tell us what to build. The AI workspace for the next million founders."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Pricing").length).toBeGreaterThan(0);
    expect(screen.getByText("Rada Pro")).toBeInTheDocument();
  });
});
