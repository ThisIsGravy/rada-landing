import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Supabase env vars are required at module-load time. Tests don't hit
// real Supabase \u2014 fill with throwaway placeholders so the client can
// be constructed without reaching for a real .env.local.
vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "sb_publishable_test");
