import { openApp } from "./lib/appUrl";

// Landing-only routes. The desktop app handles "workspace", "signin",
// and "auth-callback" in its own build — calling navigateToRoute with
// those values on the landing redirects to the app URL.
export type SiteRoute =
  | "landing"
  | "enterprise"
  | "terms"
  | "privacy"
  | "checkoutSuccess"
  | "workspace"
  | "signin"
  | "auth-callback";

// Routes that live on the marketing site itself (everything else is
// handed off to the desktop app URL).
export type SitePageRoute = Exclude<SiteRoute, "workspace" | "signin" | "auth-callback">;

// ── Path routing ──────────────────────────────────────────────────────
// The site uses real paths (/privacy, /terms, /enterprise) so each page
// is a distinct, crawlable URL that Vercel serves as prerendered HTML
// (see scripts/prerender.mjs + vercel.json). The old hash form
// (#/privacy, #/terms, …) is still accepted: fragments never reach the
// server, so the redirect has to happen client-side — SiteRouter/main
// call resolveLegacyHash() on load and history.replaceState() to the
// path form so links shared before the switch keep working.

export const ROUTE_PATHS: Record<SitePageRoute, string> = {
  landing: "/",
  enterprise: "/enterprise",
  terms: "/terms",
  privacy: "/privacy",
  checkoutSuccess: "/checkout/success",
};

// Per-route document metadata. Used by the prerender step to fill the
// <title>/description/canonical tags in each emitted HTML file, and by
// SiteRouter to keep document.title in sync on client-side navigation
// (WCAG 2.4.2 Page Titled).
export const ROUTE_META: Record<SitePageRoute, { title: string; description: string }> = {
  landing: {
    title: "Rada — Local-First AI Coding Workspace",
    description:
      "AI coding workspace that runs local models by default and routes to cloud when you need it. Stop paying for cloud AI on tasks your own machine can handle.",
  },
  enterprise: {
    title: "Rada Enterprise — Local-First AI Coding for Teams",
    description:
      "Pooled compute limits, zero-data-retention cloud routing, and local AI models that run on your own machines by default.",
  },
  terms: {
    title: "Terms of Service — Rada",
    description:
      "Rada Terms of Service: beta status, subscriptions, pricing, billing, refunds, acceptable use, and governing law.",
  },
  privacy: {
    title: "Privacy Policy — Rada",
    description:
      "Rada Privacy Policy: what we collect, what we never collect, sub-processors, retention, and your GDPR rights.",
  },
  checkoutSuccess: {
    title: "Checkout complete — Rada",
    description: "Your Rada subscription is active. Return to the desktop app to continue.",
  },
};

// Routes emitted as static HTML at build time. checkoutSuccess is
// excluded on purpose: it reads the Creem query string at render time.
export const PRERENDERED_ROUTES: SitePageRoute[] = ["landing", "enterprise", "terms", "privacy"];

export function routePath(route: SitePageRoute): string {
  return ROUTE_PATHS[route];
}

export function getPathRoute(pathname: string): SitePageRoute {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/enterprise") return "enterprise";
  if (clean === "/terms") return "terms";
  if (clean === "/privacy") return "privacy";
  if (clean === "/checkout/success") return "checkoutSuccess";
  return "landing";
}

/**
 * Legacy hash → route. Returns null when the hash is not one of the old
 * `#/…` routes (a plain in-page anchor like `#pricing` is left alone).
 */
export function getHashRoute(hash: string): SitePageRoute | null {
  if (hash.startsWith("#/enterprise")) return "enterprise";
  if (hash.startsWith("#/terms")) return "terms";
  if (hash.startsWith("#/privacy")) return "privacy";
  if (hash.startsWith("#/checkout/success")) return "checkoutSuccess";
  if (hash === "#/" || hash === "#") return "landing";
  return null;
}

/**
 * If the current URL carries a legacy `#/route` hash, return the path
 * URL it should be replaced with (query string preserved, so
 * `#/checkout/success?checkout_id=…` becomes `/checkout/success?checkout_id=…`).
 */
export function resolveLegacyHash(
  loc: { pathname: string; hash: string; search: string } = window.location,
): string | null {
  const route = getHashRoute(loc.hash);
  if (route === null) return null;
  const qIndex = loc.hash.indexOf("?");
  const hashQuery = qIndex >= 0 ? loc.hash.slice(qIndex) : "";
  const target = routePath(route) + (loc.search && loc.search.length > 1 ? loc.search : hashQuery);
  return target === loc.pathname + loc.search ? null : target;
}

export function getRouteFromLocation(loc: { pathname: string } = window.location): SitePageRoute {
  return getPathRoute(loc.pathname);
}

// Fired after navigateToRoute() pushes a new history entry so SiteRouter
// can re-read the location (popstate only fires for back/forward).
export const NAVIGATE_EVENT = "rada:navigate";

export function navigateToRoute(route: SiteRoute) {
  if (route === "workspace") {
    openApp();
    return;
  }
  if (route === "signin") {
    openApp("/signin");
    return;
  }
  if (route === "auth-callback") {
    openApp("/auth/callback");
    return;
  }

  const target = routePath(route);
  if (window.location.pathname === target) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.history.pushState(null, "", target);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}
