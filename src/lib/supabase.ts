import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Publishable values — safe to ship to the browser. RLS + rate
// limits enforce security on the Supabase side. The service_role
// key lives only in Supabase Edge Functions.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env missing \u2014 set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local",
  );
}

// Web build: sessions persist in localStorage, and we let Supabase
// detect returning OAuth / magic-link hashes on the URL. The full
// sign-in flow still lives in the desktop app; this client only
// hydrates an existing session if one is already in the browser.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
