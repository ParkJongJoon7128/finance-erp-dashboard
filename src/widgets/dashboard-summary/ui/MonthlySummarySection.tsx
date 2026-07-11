import type { LedgerSummary } from "@/entities/ledger-summary";
import { formatCurrency } from "@/shared/lib";
import { Card, Skeleton } from "@/shared/ui";

interface MonthlySummarySectionProps {
  summary: LedgerSummary | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function MonthlySummarySection({
  summary,
  isLoading,
  isError,
}: MonthlySummarySectionProps) {
  return (
    <Card>
      <h2 className="text-sm font-medium text-muted-foreground">이번 달 요약</h2>

      {isLoading && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-destructive">이번 달 요약을 불러오지 못했습니다.</p>
      )}

      {!isLoading && !isError && summary === undefined && (
        <p className="mt-4 text-sm text-muted-foreground">표시할 요약 데이터가 없습니다.</p>
      )}

      {!isLoading && !isError && summary !== undefined && (
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">총 잔액</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency({
                amountMinor: summary.totalBalanceMinor,
                currency: summary.currency,
              })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">이번 달 수입</dt>
            <dd className="mt-1 text-lg font-semibold text-success">
              {formatCurrency({
                amountMinor: summary.monthIncomeMinor,
                currency: summary.currency,
              })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">이번 달 지출</dt>
            <dd className="mt-1 text-lg font-semibold text-destructive">
              {formatCurrency({
                amountMinor: summary.monthExpenseMinor,
                currency: summary.currency,
              })}
            </dd>
          </div>
          <div className="sm:col-span-3">
            <dt className="text-xs text-muted-foreground">이번 달 순액</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency({
                amountMinor: summary.netIncomeMinor,
                currency: summary.currency,
              })}
            </dd>
          </div>
        </dl>
      )}
    </Card>
  );
}
