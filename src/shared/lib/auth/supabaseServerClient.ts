import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { SupabaseClient } from "@supabase/supabase-js";

import { assertServerOnly } from "@/shared/lib/auth/assertServerOnly";

/**
 * Server-only singleton factory. Never import this module from client
 * components: it reads/writes cookies via `next/headers` and talks to
 * Supabase Auth with the request's session.
 */
assertServerOnly("shared/lib/auth/supabaseServerClient");

function requiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Creates a request-scoped Supabase client backed by the Next.js
 * `next/headers` cookie jar (the `sb-*` auth cookies). Only call this from a
 * Route Handler / Server Action, where `cookies()` supports writes — reading
 * it from a Server Component render will silently no-op cookie writes
 * (session refresh in that context is handled by `src/middleware.ts`).
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Thrown when called from a context where `cookies()` is
            // read-only (e.g. a Server Component render). Safe to ignore
            // here since `src/middleware.ts` refreshes the session cookies
            // on every request.
          }
        },
      },
    },
  );
}
