import { cookies } from "next/headers";
import type { LoginPayload } from "@/entities/account/model/account";
import { withApiLogging } from "@/shared/server/api-logger";
import { fail, ok, readJsonBody } from "@/shared/server/api-response";
import { readStore, toPublicAccount, verifyPassword } from "@/shared/server/data-store";
import { sessionCookieName } from "@/shared/server/current-account";
import { validateLogin } from "@/shared/server/validation";

export const runtime = "nodejs";

async function getSession() {
  const store = await readStore();
  const userId = (await cookies()).get(sessionCookieName)?.value;
  const account = store.accounts.find((item) => item.id === userId);

  return ok({
    authenticated: Boolean(account),
    account: account ? toPublicAccount(account) : null,
  });
}

async function loginSession(request: Request) {
  const body = await readJsonBody<LoginPayload>(request);
  const validation = validateLogin(body);

  if (!validation.ok) {
    return fail("VALIDATION_ERROR", "Login payload is invalid.", 422, {
      fields: validation.fields,
    });
  }

  const store = await readStore();
  const account = store.accounts.find(
    (item) => item.email === validation.value.email,
  );

  if (!account || !verifyPassword(validation.value.password, account.passwordHash)) {
    return fail("INVALID_CREDENTIALS", "Email or password is incorrect.", 401);
  }

  (await cookies()).set(sessionCookieName, account.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return ok({ authenticated: true, account: toPublicAccount(account) });
}

async function deleteSession() {
  (await cookies()).delete(sessionCookieName);
  return ok({ authenticated: false, account: null });
}

export const GET = withApiLogging(getSession);
export const POST = withApiLogging(loginSession);
export const DELETE = withApiLogging(deleteSession);
