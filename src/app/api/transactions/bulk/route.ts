import type { CreateTransactionInput } from "@/shared/server/domain";
import { created, fail, readJsonBody } from "@/shared/server/api-response";
import {
  isPossibleDuplicate,
  nextId,
  now,
  updateStore,
} from "@/shared/server/data-store";
import { requireCurrentAccount } from "@/shared/server/current-account";
import { validateCreateTransaction } from "@/shared/server/validation";

export const runtime = "nodejs";

type BulkBody = {
  transactions: CreateTransactionInput[];
};

export async function POST(request: Request) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const body = await readJsonBody<BulkBody>(request);

  if (!body || !Array.isArray(body.transactions)) {
    return fail("VALIDATION_ERROR", "transactions array is required.", 422);
  }

  const validations = body.transactions.map(validateCreateTransaction);
  const errors = validations
    .map((validation, index) =>
      validation.ok ? null : { index, fields: validation.fields },
    )
    .filter(Boolean);

  if (errors.length > 0) {
    return fail("VALIDATION_ERROR", "One or more transactions are invalid.", 422, {
      items: errors,
    });
  }

  const saved = await updateStore((store) => {
    const userTransactions = store.transactions.filter(
      (item) => item.userId === current.account.id,
    );
    const timestamp = now();

    return validations.map((validation) => {
      if (!validation.ok) {
        throw new Error("Unexpected invalid transaction after validation.");
      }

      const duplicate = userTransactions.find((item) =>
        isPossibleDuplicate(validation.value, item),
      );
      const transaction = {
        ...validation.value,
        id: nextId("tx"),
        userId: current.account.id,
        status: duplicate ? "review" : validation.value.status ?? "auto-input",
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      store.transactions.push(transaction);
      userTransactions.push(transaction);

      return {
        transaction,
        duplicateOf: duplicate?.id ?? null,
      };
    });
  });

  return created({ saved });
}
