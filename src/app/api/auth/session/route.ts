import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/api/auth/_lib/authService";
import type { AuthErrorResponse, AuthSessionResponse } from "@/shared/api";

export async function GET(): Promise<NextResponse<AuthSessionResponse | AuthErrorResponse>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHENTICATED", message: "No active session." } },
        { status: 401 },
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unexpected error while resolving the current session." } },
      { status: 500 },
    );
  }
}
