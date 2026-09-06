# Rada Landing

Public marketing site for [Rada](https://github.com/ThisIsGravy/rada-app) — the AI coding workspace that routes between local models and cloud compute.

React + Vite + Tailwind v4. Deployed as a static site; auth state is read from Supabase if the visitor already has a session, but the sign-in flow itself lives inside the desktop app.

## Development

```bash
cp .env.example .env.local   # fill in Supabase URL/anon key and app URL
npm install
npm run dev                  # http://localhost:5173
```

## Build

```bash
npm run build                # client build + SSR build + prerender → ./dist
npm run build:client         # client bundle only (no prerendered sub-pages)
npm run preview              # serve the built output locally
npm test                     # routing, pricing parity, and page smoke tests
```

## Routing & prerendering

Pages live at real paths — `/`, `/privacy`, `/terms`, `/enterprise`,
`/checkout/success` — handled by `src/siteNavigation.ts` +
`src/SiteRouter.tsx` with `history.pushState`. The old hash form
(`/#/privacy`) is still accepted and rewritten client-side to the path
form; fragments never reach the server, so this cannot be a Vercel redirect.

`npm run build` runs three steps: the normal client build, a `vite build
--ssr` of `src/prerender/entry.tsx`, and `scripts/prerender.mjs`, which
renders every route in `PRERENDERED_ROUTES` with `react-dom/server` and
writes `dist/<path>/index.html` (with per-route `<title>`, description and
canonical). The result: the full Privacy Policy / Terms of Service text is
present in the server-delivered HTML with JavaScript disabled, which is what
payment-provider and search crawlers need. `src/main.tsx` hydrates those
pages and falls back to a client render for anything else.

`vercel.json` maps `/privacy`, `/terms`, `/enterprise` to their prerendered
files, sends every other path to the SPA shell, redirects `/pricing` to
`/#pricing`, and normalises trailing slashes. `public/sitemap.xml` lists the
four crawlable URLs.

## Pricing

The public price list on the landing page comes from `src/lib/pricing.ts`,
which mirrors `fluxcode-app/src/lib/subscription.ts` → `TIER_CONFIG`.
`src/lib/pricing.test.ts` reads the app file when the app repo is checked
out next to this one and fails if the two drift. Checkout itself happens in
the desktop app (Creem.io is the merchant of record); the site never
initiates a checkout.

## Environment

| Var | Purpose |
|-----|---------|
| `VITE_SUPABASE_URL` | Supabase project URL (publishable, safe to ship) |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key (RLS-gated on the backend) |
| `VITE_APP_URL` | Production URL of the Rada desktop app; "Start Building" / "Sign in" CTAs point here |
| `VITE_SENTRY_DSN` | Optional — Sentry DSN for frontend error reporting |
