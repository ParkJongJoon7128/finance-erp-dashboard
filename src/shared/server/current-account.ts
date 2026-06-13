import "server-only";

import { cookies } from "next/headers";
import { fail } from "./api-response";
import { getDefaultAccount, readStore } from "./data-store";

const sessionCookieName = "finance_erp_session";

export { sessionCookieName };

export async function getCurrentAccount() {
  const store = await readStore();
  const sessionUserId = (await cookies()).get(sessionCookieName)?.value;
  const account =
    store.accounts.find((item) => item.id === sessionUserId) ??
    getDefaultAccount(store);

  return { account, store };
}

export async function requireCurrentAccount() {
  const { account, store } = await getCurrentAccount();

  if (!account) {
    return {
      ok: false as const,
      response: fail("ACCOUNT_REQUIRED", "Account setup is required.", 401),
    };
  }

  return { ok: true as const, account, store };
}

