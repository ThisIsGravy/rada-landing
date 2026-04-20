// Single source of truth for the Rada app URL. Used by landing CTAs
// ("Start Building", "Sign in", pricing buttons) that leave the
// marketing site and drop the visitor into the desktop app flow.
//
// Set VITE_APP_URL in .env.local (or the deploy environment) once
// the production URL is chosen. Placeholder keeps the landing page
// functional in the meantime.
export const APP_URL = import.meta.env.VITE_APP_URL ?? "https://app.example.com";

export function openApp(path = "") {
  const target = `${APP_URL.replace(/\/$/, "")}${path}`;
  window.location.href = target;
}
