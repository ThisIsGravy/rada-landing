import { openApp } from "./lib/appUrl";

// Landing-only routes. The desktop app handles "workspace", "signin",
// and "auth-callback" in its own build \u2014 calling navigateToRoute with
// those values on the landing redirects to the app URL.
export type SiteRoute = "landing" | "enterprise" | "workspace" | "signin" | "auth-callback";

export function getHashRoute(hash = window.location.hash): SiteRoute {
  if (hash.startsWith("#/enterprise")) return "enterprise";
  return "landing";
}

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

  const targetHash = route === "enterprise" ? "#/enterprise" : "#/";
  if (window.location.hash === targetHash) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.location.hash = targetHash;
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}
