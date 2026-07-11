import type { Transaction } from "@/entities/transaction";
import { cn, formatCurrency, formatDate } from "@/shared/lib";
import { Badge, Card, Skeleton } from "@/shared/ui";

interface RecentTransactionsSectionProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function RecentTransactionsSection({
  transactions,
  isLoading,
  isError,
}: RecentTransactionsSectionProps) {
  return (
    <Card>
      <h2 className="text-sm font-medium text-muted-foreground">최근 거래</h2>

      {isLoading && (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-destructive">최근 거래를 불러오지 못했습니다.</p>
      )}

      {!isLoading && !isError && transactions !== undefined && transactions.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">최근 거래 내역이 없습니다.</p>
      )}

      {!isLoading && !isError && transactions !== undefined && transactions.length > 0 && (
        <ul className="mt-4 flex flex-col divide-y divide-border">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {transaction.description}
                  </p>
                  {transaction.reviewStatus === "pending" && (
                    <Badge variant="warning">검수 대기</Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(transaction.occurredAt)} · {transaction.categoryLabel}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 text-sm font-semibold",
                  transaction.direction === "in" ? "text-success" : "text-foreground"
                )}
              >
                {transaction.direction === "in" ? "+" : "-"}
                {formatCurrency({
                  amountMinor: transaction.amountMinor,
                  currency: transaction.currency,
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
