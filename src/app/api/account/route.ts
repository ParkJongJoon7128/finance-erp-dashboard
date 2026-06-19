import type {
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/entities/account/model/account";
import { withApiLogging } from "@/shared/server/api-logger";
import { created, fail, noContent, ok, readJsonBody } from "@/shared/server/api-response";
import {
  getDefaultAccount,
  hashPassword,
  nextId,
  now,
  readStore,
  toPublicAccount,
  updateStore,
} from "@/shared/server/data-store";
import {
  validateCreateAccount,
  validateUpdateAccount,
} from "@/shared/server/validation";

export const runtime = "nodejs";

async function getAccount() {
  const store = await readStore();
  const account = getDefaultAccount(store);

  if (!account) {
    return fail("ACCOUNT_NOT_FOUND", "No account has been configured.", 404);
  }

  return ok(toPublicAccount(account));
}

async function createAccount(request: Request) {
  const body = await readJsonBody<CreateAccountPayload>(request);
  const validation = validateCreateAccount(body);

  if (!validation.ok) {
    return fail("VALIDATION_ERROR", "Account payload is invalid.", 422, {
      fields: validation.fields,
    });
  }

  const result = await updateStore((store) => {
    if (store.accounts.length > 0) return null;

    const timestamp = now();
    const account = {
      id: nextId("user"),
      email: validation.value.email,
      displayName: validation.value.displayName,
      passwordHash: hashPassword(validation.value.password),
      settings: {
        currency: validation.value.settings?.currency ?? "KRW",
        monthlyBudget: validation.value.settings?.monthlyBudget ?? 4000000,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.accounts.push(account);
    return toPublicAccount(account);
  });

  if (!result) {
    return fail("ACCOUNT_EXISTS", "A local owner account already exists.", 409);
  }

  return created(result);
}

async function updateAccount(request: Request) {
  const body = await readJsonBody<UpdateAccountPayload>(request);
  const validation = validateUpdateAccount(body);

  if (!validation.ok) {
    return fail("VALIDATION_ERROR", "Account payload is invalid.", 422, {
      fields: validation.fields,
    });
  }

  const result = await updateStore((store) => {
    const account = getDefaultAccount(store);
    if (!account) return null;

    const duplicateEmail = store.accounts.some(
      (item) => item.id !== account.id && item.email === validation.value.email,
    );
    if (duplicateEmail) return "duplicate-email";

    if (validation.value.email) account.email = validation.value.email;
    if (validation.value.displayName) {
      account.displayName = validation.value.displayName;
    }
    if (validation.value.password) {
      account.passwordHash = hashPassword(validation.value.password);
    }
    account.settings = {
      ...account.settings,
      ...validation.value.settings,
    };
    account.updatedAt = now();

    return toPublicAccount(account);
  });

  if (result === "duplicate-email") {
    return fail("EMAIL_EXISTS", "The email is already used.", 409);
  }
  if (!result) {
    return fail("ACCOUNT_NOT_FOUND", "No account has been configured.", 404);
  }

  return ok(result);
}

async function deleteAccount() {
  const deleted = await updateStore((store) => {
    const account = getDefaultAccount(store);
    if (!account) return false;

    store.accounts = store.accounts.filter((item) => item.id !== account.id);
    store.transactions = store.transactions.filter(
      (transaction) => transaction.userId !== account.id,
    );
    return true;
  });

  if (!deleted) {
    return fail("ACCOUNT_NOT_FOUND", "No account has been configured.", 404);
  }

  return noContent();
}

export const GET = withApiLogging(getAccount);
export const POST = withApiLogging(createAccount);
export const PATCH = withApiLogging(updateAccount);
export const DELETE = withApiLogging(deleteAccount);
