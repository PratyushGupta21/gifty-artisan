import { createClient } from "@supabase/supabase-js";

const url = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const anonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined;

if (!url || !anonKey) {
  console.warn(
    "[The Little Box] Missing Supabase environment variables.\n" +
      "Copy .env.example → .env and fill in your project credentials.\n" +
      "  VITE_SUPABASE_URL      — your Supabase project URL\n" +
      "  VITE_SUPABASE_ANON_KEY — your Supabase anon/public key",
  );
}

export const MEMORY_BUCKET = "gift-memories";

/**
 * `true` when both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 * Components can check this before making Supabase calls to avoid runtime
 * errors during local development without a configured backend.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: { persistSession: true, autoRefreshToken: true },
});
