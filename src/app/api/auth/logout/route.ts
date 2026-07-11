import { NextResponse } from "next/server";

import { destroyCurrentSession } from "@/app/api/auth/_lib/authService";
import type { AuthErrorResponse } from "@/shared/api";

export async function POST(): Promise<NextResponse<AuthErrorResponse | null>> {
  try {
    await destroyCurrentSession();
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unexpected error during logout." } },
      { status: 500 },
    );
  }
}
