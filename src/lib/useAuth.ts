import { useCallback, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type UseAuthReturn = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

// Landing-site auth hook. Read-only relative to the desktop app:
// it surfaces whatever session already lives in the browser (so the
// header pill can say "signed in as X") and offers signOut. The
// actual sign-in flow \u2014 OAuth deep-link, magic-link \u2014 runs inside
// the Tauri app and is intentionally not duplicated here.
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  const refresh = useCallback(async () => {
    const { data, error: err } = await supabase.auth.getSession();
    if (err) setError(err.message);
    setSession(data.session);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    unsubRef.current = () => sub.subscription.unsubscribe();

    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [refresh]);

  const signOut = useCallback(async () => {
    setError(null);
    const { error: err } = await supabase.auth.signOut();
    if (err) throw new Error(err.message);
  }, []);

  return {
    user: session?.user ?? null,
    session,
    loading,
    error,
    signOut,
    refresh,
  };
}
