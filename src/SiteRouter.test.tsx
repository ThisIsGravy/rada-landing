import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SiteRouter, { renderRoute } from "./SiteRouter";

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("SiteRouter", () => {
  it("renders the Privacy Policy at /privacy", () => {
    window.history.replaceState(null, "", "/privacy");
    render(<SiteRouter />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
    expect(document.title).toMatch(/Privacy Policy/);
  });

  it("renders the Terms of Service at /terms", () => {
    window.history.replaceState(null, "", "/terms");
    render(<SiteRouter />);
    expect(screen.getByRole("heading", { level: 1, name: /terms of service/i })).toBeInTheDocument();
    expect(document.title).toMatch(/Terms of Service/);
  });

  it("renderRoute (used by the prerender entry) renders each legal page without a window URL", () => {
    render(renderRoute("terms"));
    expect(screen.getByRole("heading", { level: 1, name: /terms of service/i })).toBeInTheDocument();
    render(renderRoute("privacy"));
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
  });

  it("redirects a legacy #/privacy hash to /privacy in place", () => {
    window.history.replaceState(null, "", "/#/privacy");
    render(<SiteRouter />);
    expect(window.location.pathname).toBe("/privacy");
    expect(window.location.hash).toBe("");
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
  });

  it("legal pages link to each other with real hrefs", () => {
    window.history.replaceState(null, "", "/terms");
    render(<SiteRouter />);
    expect(screen.getByRole("link", { name: /^privacy$/i })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
  });
});
