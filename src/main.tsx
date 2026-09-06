import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import SiteRouter from "./SiteRouter";
import {
  PRERENDERED_ROUTES,
  getRouteFromLocation,
  resolveLegacyHash,
} from "./siteNavigation";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
  });
}

const container = document.getElementById("root") as HTMLElement;
const app = (
  <React.StrictMode>
    <SiteRouter />
  </React.StrictMode>
);

// Prerendered routes ship their markup in the HTML (scripts/prerender.mjs),
// so hydrate. Anything else — /checkout/success (SPA fallback serves the
// landing markup) or a legacy `#/route` hash on `/` — would mismatch, so
// wipe the shell and render from scratch instead.
const legacy = resolveLegacyHash();
if (legacy) window.history.replaceState(null, "", legacy);
const canHydrate =
  !legacy &&
  container.hasChildNodes() &&
  PRERENDERED_ROUTES.includes(getRouteFromLocation());

if (canHydrate) {
  ReactDOM.hydrateRoot(container, app);
} else {
  container.replaceChildren();
  ReactDOM.createRoot(container).render(app);
}
