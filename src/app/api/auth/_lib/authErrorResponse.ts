import { NextResponse } from "next/server";

import { AuthServiceError } from "@/app/api/auth/_lib/authService";
import type { AuthErrorResponse } from "@/shared/api";

/** Maps an authService failure to the shared `{ error: { code, message } }` response shape. */
export function authServiceErrorToResponse(error: unknown): NextResponse<AuthErrorResponse> {
  if (error instanceof AuthServiceError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Unexpected server error." } },
    { status: 500 },
  );
}
