import { useEffect, useState } from "react";
import Enterprise from "./Enterprise";
import RadaLandingPage from "./RadaLandingPage";
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
  return <RadaLandingPage />;
}
