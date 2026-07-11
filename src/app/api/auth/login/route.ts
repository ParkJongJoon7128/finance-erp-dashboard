import { NextResponse } from "next/server";

import { authServiceErrorToResponse } from "@/app/api/auth/_lib/authErrorResponse";
import { login } from "@/app/api/auth/_lib/authService";
import { loginRequestSchema } from "@/shared/api";
import type { AuthErrorResponse, AuthSessionResponse } from "@/shared/api";

export async function POST(request: Request): Promise<NextResponse<AuthSessionResponse | AuthErrorResponse>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Request body must be valid JSON." } },
      { status: 400 },
    );
  }

  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid login request.",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            reason: issue.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  try {
    const user = await login(parsed.data);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return authServiceErrorToResponse(error);
  }
}
