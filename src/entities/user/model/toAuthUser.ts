import type { User as SupabaseUser } from "@supabase/supabase-js";

import type { AuthUser } from "@/shared/api";

/**
 * Maps a Supabase Auth `User` (returned by `signUp`/`signInWithPassword`/
 * `getUser`) to the client-safe `AuthUser` contract. Password/token material
 * never appears on the Supabase `User` object in the first place, but this
 * mapper still keeps the API response shape decoupled from the Supabase SDK
 * type so `shared/api/auth` does not need to change if the SDK shape does.
 */
export function toAuthUser(user: SupabaseUser): AuthUser {
  // Password-based signup/login always sets `email`; Supabase types it as
  // optional to accommodate phone-only or anonymous users, which this app
  // does not use.
  if (!user.email) {
    throw new Error("Supabase user is missing an email address.");
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: new Date(user.created_at).toISOString(),
  };
}
