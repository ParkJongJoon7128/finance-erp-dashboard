import type { Account } from "@/entities/account";
import { formatCurrency } from "@/shared/lib";
import { Card, Skeleton } from "@/shared/ui";

interface AccountBalanceSectionProps {
  accounts: Account[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function AccountBalanceSection({
  accounts,
  isLoading,
  isError,
}: AccountBalanceSectionProps) {
  return (
    <Card>
      <h2 className="text-sm font-medium text-muted-foreground">보유 계좌</h2>

      {isLoading && (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-destructive">계좌 정보를 불러오지 못했습니다.</p>
      )}

      {!isLoading && !isError && accounts !== undefined && accounts.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">등록된 계좌가 없습니다.</p>
      )}

      {!isLoading && !isError && accounts !== undefined && accounts.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{account.label}</p>
                <p className="text-xs text-muted-foreground">{account.maskedNumber}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency({ amountMinor: account.balanceMinor, currency: account.currency })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
