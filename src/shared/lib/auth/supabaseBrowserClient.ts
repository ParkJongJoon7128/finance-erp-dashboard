import { createBrowserClient } from "@supabase/ssr";

import type { SupabaseClient } from "@supabase/supabase-js";

function requiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Creates a browser-side Supabase client for use from client components.
 * Reads/writes the `sb-*` auth cookies via `document.cookie` so the session
 * stays in sync with the server-rendered Route Handlers.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  return createBrowserClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
