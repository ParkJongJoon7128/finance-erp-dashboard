import { NextResponse } from "next/server";

import { authServiceErrorToResponse } from "@/app/api/auth/_lib/authErrorResponse";
import { signup } from "@/app/api/auth/_lib/authService";
import { signupRequestSchema } from "@/shared/api";
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

  const parsed = signupRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid signup request.",
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
    const user = await signup(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return authServiceErrorToResponse(error);
  }
}
