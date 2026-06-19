import type { CreateTransactionInput } from "@/shared/server/domain";
import { withApiLogging } from "@/shared/server/api-logger";
import { created, fail, ok, readJsonBody } from "@/shared/server/api-response";
import {
  isPossibleDuplicate,
  nextId,
  now,
  updateStore,
} from "@/shared/server/data-store";
import { requireCurrentAccount } from "@/shared/server/current-account";
import { validateCreateTransaction } from "@/shared/server/validation";

export const runtime = "nodejs";

async function getTransactions(request: Request) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search")?.trim().toLowerCase();
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const transactions = current.store.transactions
    .filter((transaction) => transaction.userId === current.account.id)
    .filter((transaction) => !type || transaction.type === type)
    .filter((transaction) => !category || transaction.category === category)
    .filter((transaction) => !startDate || transaction.date >= startDate)
    .filter((transaction) => !endDate || transaction.date <= endDate)
    .filter((transaction) => {
      if (!search) return true;
      return [transaction.merchant, transaction.memo, transaction.account].some(
        (value) => value?.toLowerCase().includes(search),
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return ok({ transactions });
}

async function createTransaction(request: Request) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const body = await readJsonBody<CreateTransactionInput>(request);
  const validation = validateCreateTransaction(body);

  if (!validation.ok) {
    return fail("VALIDATION_ERROR", "Transaction payload is invalid.", 422, {
      fields: validation.fields,
    });
  }

  const transaction = await updateStore((store) => {
    const userTransactions = store.transactions.filter(
      (item) => item.userId === current.account.id,
    );
    const duplicate = userTransactions.find((item) =>
      isPossibleDuplicate(validation.value, item),
    );
    const timestamp = now();
    const nextTransaction = {
      ...validation.value,
      id: nextId("tx"),
      userId: current.account.id,
      status: duplicate ? "review" : validation.value.status ?? "confirmed",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.transactions.push(nextTransaction);
    return { transaction: nextTransaction, duplicateOf: duplicate?.id ?? null };
  });

  return created(transaction);
}

export const GET = withApiLogging(getTransactions);
export const POST = withApiLogging(createTransaction);
