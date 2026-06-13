import type { UpdateTransactionInput } from "@/shared/server/domain";
import { fail, noContent, ok, readJsonBody } from "@/shared/server/api-response";
import { now, updateStore } from "@/shared/server/data-store";
import { requireCurrentAccount } from "@/shared/server/current-account";
import { validateUpdateTransaction } from "@/shared/server/validation";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const { id } = await context.params;
  const transaction = current.store.transactions.find(
    (item) => item.userId === current.account.id && item.id === id,
  );

  if (!transaction) {
    return fail("TRANSACTION_NOT_FOUND", "Transaction was not found.", 404);
  }

  return ok(transaction);
}

export async function PATCH(request: Request, context: RouteContext) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const body = await readJsonBody<UpdateTransactionInput>(request);
  const validation = validateUpdateTransaction(body);

  if (!validation.ok) {
    return fail("VALIDATION_ERROR", "Transaction payload is invalid.", 422, {
      fields: validation.fields,
    });
  }

  const { id } = await context.params;
  const transaction = await updateStore((store) => {
    const existing = store.transactions.find(
      (item) => item.userId === current.account.id && item.id === id,
    );
    if (!existing) return null;

    Object.assign(existing, validation.value, { updatedAt: now() });
    return existing;
  });

  if (!transaction) {
    return fail("TRANSACTION_NOT_FOUND", "Transaction was not found.", 404);
  }

  return ok(transaction);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const { id } = await context.params;
  const deleted = await updateStore((store) => {
    const before = store.transactions.length;
    store.transactions = store.transactions.filter(
      (item) => !(item.userId === current.account.id && item.id === id),
    );
    return before !== store.transactions.length;
  });

  if (!deleted) {
    return fail("TRANSACTION_NOT_FOUND", "Transaction was not found.", 404);
  }

  return noContent();
}

