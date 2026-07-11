import { updateSession } from "@/shared/lib/auth";

import type { NextRequest } from "next/server";

/**
 * Refreshes Supabase `sb-*` session cookies on every matched request so
 * Server Components/Route Handlers downstream always see a fresh access
 * token (see `shared/lib/auth/updateSession.ts` for why this must call
 * `getUser()` rather than `getSession()`).
 */
export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, and common static asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
