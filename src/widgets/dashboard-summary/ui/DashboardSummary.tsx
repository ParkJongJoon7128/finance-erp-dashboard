"use client";

import { useAccounts } from "@/entities/account";
import { useLedgerSummary, useLedgerTrend } from "@/entities/ledger-summary";
import { useRecentTransactions } from "@/entities/transaction";
import { AccountBalanceSection } from "@/widgets/dashboard-summary/ui/AccountBalanceSection";
import { CategoryBreakdownSection } from "@/widgets/dashboard-summary/ui/CategoryBreakdownSection";
import { MonthlySummarySection } from "@/widgets/dashboard-summary/ui/MonthlySummarySection";
import { MonthlyTrendChartSection } from "@/widgets/dashboard-summary/ui/MonthlyTrendChartSection";
import { RecentTransactionsSection } from "@/widgets/dashboard-summary/ui/RecentTransactionsSection";
import { ReviewPendingBadge } from "@/widgets/dashboard-summary/ui/ReviewPendingBadge";

const CURRENT_PERIOD = "2026-07";
const TREND_MONTHS = 3;
const RECENT_TRANSACTIONS_LIMIT = 5;

export function DashboardSummary() {
  const ledgerSummaryQuery = useLedgerSummary(CURRENT_PERIOD);
  const ledgerTrendQuery = useLedgerTrend(CURRENT_PERIOD, TREND_MONTHS);
  const accountsQuery = useAccounts();
  const recentTransactionsQuery = useRecentTransactions(RECENT_TRANSACTIONS_LIMIT);

  return (
    <div className="flex flex-col gap-6">
      {ledgerSummaryQuery.data !== undefined && (
        <ReviewPendingBadge reviewPendingCount={ledgerSummaryQuery.data.reviewPendingCount} />
      )}

      <MonthlyTrendChartSection
        trend={ledgerTrendQuery.data}
        isLoading={ledgerTrendQuery.isLoading}
        isError={ledgerTrendQuery.isError}
      />

      <MonthlySummarySection
        summary={ledgerSummaryQuery.data}
        isLoading={ledgerSummaryQuery.isLoading}
        isError={ledgerSummaryQuery.isError}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AccountBalanceSection
          accounts={accountsQuery.data?.items}
          isLoading={accountsQuery.isLoading}
          isError={accountsQuery.isError}
        />
        <CategoryBreakdownSection
          categoryBreakdown={ledgerSummaryQuery.data?.categoryBreakdown}
          currency={ledgerSummaryQuery.data?.currency}
          isLoading={ledgerSummaryQuery.isLoading}
          isError={ledgerSummaryQuery.isError}
        />
      </div>

      <RecentTransactionsSection
        transactions={recentTransactionsQuery.data?.items}
        isLoading={recentTransactionsQuery.isLoading}
        isError={recentTransactionsQuery.isError}
      />
    </div>
  );
}
