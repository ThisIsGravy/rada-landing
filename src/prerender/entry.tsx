// Build-time entry for scripts/prerender.mjs. Bundled by
// `vite build --ssr` into dist-ssr/entry.js; never shipped to browsers.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { renderRoute } from "../SiteRouter";
import {
  PRERENDERED_ROUTES,
  ROUTE_META,
  ROUTE_PATHS,
  type SitePageRoute,
} from "../siteNavigation";

export { PRERENDERED_ROUTES, ROUTE_META, ROUTE_PATHS };

export function render(route: SitePageRoute): string {
  return renderToString(<StrictMode>{renderRoute(route)}</StrictMode>);
}
