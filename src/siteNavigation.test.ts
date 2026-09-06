import { describe, expect, it } from "vitest";
import {
  PRERENDERED_ROUTES,
  ROUTE_META,
  getHashRoute,
  getPathRoute,
  resolveLegacyHash,
  routePath,
} from "./siteNavigation";

describe("path routing", () => {
  it("resolves real paths to routes", () => {
    expect(getPathRoute("/")).toBe("landing");
    expect(getPathRoute("/privacy")).toBe("privacy");
    expect(getPathRoute("/privacy/")).toBe("privacy");
    expect(getPathRoute("/terms")).toBe("terms");
    expect(getPathRoute("/enterprise")).toBe("enterprise");
    expect(getPathRoute("/checkout/success")).toBe("checkoutSuccess");
    expect(getPathRoute("/nope")).toBe("landing");
  });

  it("emits the crawlable path for every page route", () => {
    expect(routePath("privacy")).toBe("/privacy");
    expect(routePath("terms")).toBe("/terms");
    expect(routePath("enterprise")).toBe("/enterprise");
    expect(routePath("landing")).toBe("/");
  });

  it("prerenders the legal pages and has metadata for each", () => {
    expect(PRERENDERED_ROUTES).toEqual(
      expect.arrayContaining(["landing", "privacy", "terms", "enterprise"]),
    );
    expect(PRERENDERED_ROUTES).not.toContain("checkoutSuccess");
    for (const route of PRERENDERED_ROUTES) {
      expect(ROUTE_META[route].title).toMatch(/Rada/);
      expect(ROUTE_META[route].description.length).toBeGreaterThan(20);
    }
  });
});

describe("legacy hash redirects", () => {
  it("maps the old #/ routes", () => {
    expect(getHashRoute("#/privacy")).toBe("privacy");
    expect(getHashRoute("#/terms")).toBe("terms");
    expect(getHashRoute("#/enterprise")).toBe("enterprise");
    expect(getHashRoute("#/checkout/success?checkout_id=1")).toBe("checkoutSuccess");
    expect(getHashRoute("#/")).toBe("landing");
  });

  it("leaves in-page anchors alone", () => {
    expect(getHashRoute("#pricing")).toBeNull();
    expect(getHashRoute("#waitlist")).toBeNull();
    expect(getHashRoute("")).toBeNull();
    expect(resolveLegacyHash({ pathname: "/", hash: "#pricing", search: "" })).toBeNull();
  });

  it("rewrites /#/privacy to /privacy", () => {
    expect(resolveLegacyHash({ pathname: "/", hash: "#/privacy", search: "" })).toBe("/privacy");
    expect(resolveLegacyHash({ pathname: "/", hash: "#/terms", search: "" })).toBe("/terms");
  });

  it("carries the checkout query string out of the fragment", () => {
    expect(
      resolveLegacyHash({
        pathname: "/",
        hash: "#/checkout/success?checkout_id=ch_1&tier=Pro",
        search: "",
      }),
    ).toBe("/checkout/success?checkout_id=ch_1&tier=Pro");
  });

  it("is a no-op when already on the path form", () => {
    expect(resolveLegacyHash({ pathname: "/privacy", hash: "", search: "" })).toBeNull();
  });
});
