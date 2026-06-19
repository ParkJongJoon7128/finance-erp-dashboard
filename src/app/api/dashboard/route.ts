import { withApiLogging } from "@/shared/server/api-logger";
import { ok } from "@/shared/server/api-response";
import { buildDashboardSummary } from "@/shared/server/dashboard";
import { requireCurrentAccount } from "@/shared/server/current-account";

export const runtime = "nodejs";

async function getDashboard(request: Request) {
  const current = await requireCurrentAccount();
  if (!current.ok) return current.response;

  const month =
    new URL(request.url).searchParams.get("month") ??
    new Date().toISOString().slice(0, 7);
  const transactions = current.store.transactions.filter(
    (transaction) => transaction.userId === current.account.id,
  );

  return ok(
    buildDashboardSummary(
      transactions,
      current.account.settings.monthlyBudget,
      month,
    ),
  );
}

export const GET = withApiLogging(getDashboard);
