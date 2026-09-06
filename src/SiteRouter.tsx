import { useEffect, useState } from "react";
import CheckoutSuccess from "./CheckoutSuccess";
import Enterprise from "./Enterprise";
import Privacy from "./Privacy";
import RadaLandingPage from "./RadaLandingPage";
import Terms from "./Terms";
import {
  NAVIGATE_EVENT,
  ROUTE_META,
  getRouteFromLocation,
  resolveLegacyHash,
  type SitePageRoute,
} from "./siteNavigation";

export function renderRoute(route: SitePageRoute) {
  if (route === "enterprise") return <Enterprise />;
  if (route === "terms") return <Terms />;
  if (route === "privacy") return <Privacy />;
  if (route === "checkoutSuccess") return <CheckoutSuccess />;
  return <RadaLandingPage />;
}

/**
 * Path-based router. `initialRoute` is supplied by the prerender entry
 * (no window on the server); in the browser it falls back to the URL.
 */
export default function SiteRouter({ initialRoute }: { initialRoute?: SitePageRoute }) {
  const [route, setRoute] = useState<SitePageRoute>(
    () => initialRoute ?? getRouteFromLocation(),
  );

  useEffect(() => {
    // Legacy `#/privacy`-style links: rewrite to the path form in place.
    const legacy = resolveLegacyHash();
    if (legacy) window.history.replaceState(null, "", legacy);

    const sync = () => setRoute(getRouteFromLocation());
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener(NAVIGATE_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAVIGATE_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    document.title = ROUTE_META[route].title;
    // In-page anchors (#pricing, #waitlist) keep the browser's native
    // scroll-to-fragment; only reset for route changes without one.
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  return renderRoute(route);
}
