// The only module allowed to combine entities/user (toAuthUser) with
// shared/lib/auth (the Supabase server client). Route Handlers under
// src/app/api/auth/** call only the functions exported here and never touch
// next/headers or the Supabase SDK directly.
//
// `import "server-only"` was requested but does not resolve without adding an
// unapproved dependency (see shared/lib/auth/assertServerOnly.ts). Unlike the
// entity layer, this module is not restricted to a narrow import list, so it
// uses that guard as a substitute.
import { assertServerOnly, createSupabaseServerClient } from "@/shared/lib/auth";

assertServerOnly("app/api/auth/_lib/authService");

import { toAuthUser } from "@/entities/user";

import { isStrongPassword } from "@/shared/api";
import type { AuthErrorCode, AuthErrorDetail, AuthUser, LoginRequest, SignupRequest } from "@/shared/api";

/** Thrown by signup/login for expected domain-rule failures; caught by the Route Handlers. */
export class AuthServiceError extends Error {
  readonly code: AuthErrorCode;
  readonly status: number;
  readonly details?: AuthErrorDetail[];

  constructor(code: AuthErrorCode, message: string, status: number, details?: AuthErrorDetail[]) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// GoTrue (Supabase Auth) error codes observed for "email already has an
// account" across confirm-email on/off configurations. Matched defensively
// against `error.code` first; `error.message` is a fallback since the exact
// code returned depends on GoTrue version/config and cannot be verified
// without a live Supabase project.
const EMAIL_TAKEN_ERROR_CODES = new Set([
  "user_already_exists",
  "email_exists",
  "identity_already_exists",
]);
const EMAIL_TAKEN_MESSAGE_PATTERN = /already (registered|exists)/i;

function isEmailTakenError(error: { code?: string; message: string }): boolean {
  return Boolean(error.code && EMAIL_TAKEN_ERROR_CODES.has(error.code)) || EMAIL_TAKEN_MESSAGE_PATTERN.test(error.message);
}

export async function signup(input: SignupRequest): Promise<AuthUser> {
  // Business-level password strength is enforced before ever calling
  // Supabase, so a policy violation is always reported as 422 WEAK_PASSWORD
  // regardless of Supabase's own (separately configurable) password policy.
  if (!isStrongPassword(input.password)) {
    throw new AuthServiceError(
      "WEAK_PASSWORD",
      "Password must be 8-128 characters and include both letters and digits.",
      422,
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (error) {
    if (isEmailTakenError(error)) {
      throw new AuthServiceError("EMAIL_TAKEN", "This email is already registered.", 409);
    }
    if (error.code === "weak_password") {
      throw new AuthServiceError(
        "WEAK_PASSWORD",
        "Password must be 8-128 characters and include both letters and digits.",
        422,
      );
    }
    throw error;
  }

  if (!data.user) {
    throw new Error("Supabase signUp returned no user and no error.");
  }

  // Intended project setup: email confirmation is DISABLED, so `signUp`
  // both creates the account and returns an active session, and
  // `createSupabaseServerClient`'s cookie adapter writes the resulting
  // `sb-*` cookies onto this response.
  //
  // Defensive branch: if confirmation is ever turned ON, `data.session` is
  // null here. The account still exists, but no cookies are set and the
  // caller is NOT logged in — this must not be reported or treated as an
  // authenticated response by anything downstream. We still return the
  // `AuthUser` (matching the stable 201 `{ user }` contract) since the
  // signup itself succeeded; only the "is now logged in via cookies" part
  // is conditional on confirmation being disabled.
  if (!data.session) {
    // No session/cookies were issued (email confirmation is ON). Falling
    // through intentionally: see comment above.
  }

  return toAuthUser(data.user);
}

export async function login(input: LoginRequest): Promise<AuthUser> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    throw new AuthServiceError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
  }

  return toAuthUser(data.user);
}

/**
 * Resolves the current user from the request's `sb-*` cookies via
 * `getUser()` (server-verified against the Supabase Auth server), or `null`
 * if there is no valid session. Deliberately does not use `getSession()`,
 * which trusts the cookie contents without verification.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return toAuthUser(data.user);
}

/** Signs out the current Supabase session, clearing the `sb-*` cookies via the adapter. Idempotent. */
export async function destroyCurrentSession(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
