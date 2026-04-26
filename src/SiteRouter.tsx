import { useEffect, useState } from "react";
import CheckoutSuccess from "./CheckoutSuccess";
import Enterprise from "./Enterprise";
import Privacy from "./Privacy";
import RadaLandingPage from "./RadaLandingPage";
import Terms from "./Terms";
import { getHashRoute, type SiteRoute } from "./siteNavigation";

export default function SiteRouter() {
  const [route, setRoute] = useState<SiteRoute>(() => getHashRoute());

  useEffect(() => {
    const handleHashChange = () => setRoute(getHashRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  if (route === "enterprise") return <Enterprise />;
  if (route === "terms") return <Terms />;
  if (route === "privacy") return <Privacy />;
  if (route === "checkoutSuccess") return <CheckoutSuccess />;
  return <RadaLandingPage />;
}
