import { StrictMode, act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SiteRouter, { renderRoute } from "./SiteRouter";
import { PRERENDERED_ROUTES, ROUTE_PATHS } from "./siteNavigation";

// Guards the prerender contract: the markup scripts/prerender.mjs writes
// for each route must hydrate cleanly in the browser (src/main.tsx uses
// hydrateRoot on those pages). A mismatch here means React would throw
// away the server HTML and re-render client-side.
describe("prerender hydration parity", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  for (const route of PRERENDERED_ROUTES) {
    it(`hydrates ${route} (${ROUTE_PATHS[route]}) without a mismatch`, async () => {
      window.history.replaceState(null, "", ROUTE_PATHS[route]);
      const html = renderToString(<StrictMode>{renderRoute(route)}</StrictMode>);
      expect(html.length).toBeGreaterThan(1000);

      const container = document.createElement("div");
      container.innerHTML = html;
      document.body.appendChild(container);

      const problems: string[] = [];
      const errorSpy = vi.spyOn(console, "error").mockImplementation((...args) => {
        problems.push(args.map(String).join(" "));
      });
      await act(async () => {
        hydrateRoot(container, <StrictMode><SiteRouter /></StrictMode>, {
          onRecoverableError: (err) => problems.push(`recoverable: ${String(err)}`),
        });
      });
      errorSpy.mockRestore();
      container.remove();

      expect(problems).toEqual([]);
    });
  }
});
