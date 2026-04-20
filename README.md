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
npm run build                # emits ./dist
npm run preview              # serve the built output locally
npm test                     # smoke tests
```

## Environment

| Var | Purpose |
|-----|---------|
| `VITE_SUPABASE_URL` | Supabase project URL (publishable, safe to ship) |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key (RLS-gated on the backend) |
| `VITE_APP_URL` | Production URL of the Rada desktop app; "Start Building" / "Sign in" CTAs point here |
| `VITE_SENTRY_DSN` | Optional — Sentry DSN for frontend error reporting |
