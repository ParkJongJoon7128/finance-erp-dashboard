/**
 * Fallback guard for the `import "server-only"` requirement.
 *
 * The `server-only` package does not resolve in this project's current
 * dependency set (Next 16.2.9 here does not ship it as a resolvable module,
 * and adding it as a new dependency is outside the approved dependency list
 * for this task: @supabase/supabase-js, @supabase/ssr, zod).
 *
 * As a substitute, modules that must never run in a browser bundle call this
 * function at import time so an accidental client import fails fast instead
 * of silently shipping Node-only code (the Supabase server client,
 * next/headers cookies) to the browser.
 */
export function assertServerOnly(moduleId: string): void {
  if (typeof window !== "undefined") {
    throw new Error(`${moduleId} is a server-only module and must not be imported from client code.`);
  }
}
