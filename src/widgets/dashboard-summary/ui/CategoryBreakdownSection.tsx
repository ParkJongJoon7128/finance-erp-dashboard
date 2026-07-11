import type { CategoryBreakdownItem } from "@/entities/ledger-summary";
import { formatCurrency } from "@/shared/lib";
import { Card, Skeleton } from "@/shared/ui";

interface CategoryBreakdownSectionProps {
  categoryBreakdown: CategoryBreakdownItem[] | undefined;
  currency: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function CategoryBreakdownSection({
  categoryBreakdown,
  currency,
  isLoading,
  isError,
}: CategoryBreakdownSectionProps) {
  return (
    <Card>
      <h2 className="text-sm font-medium text-muted-foreground">카테고리별 지출</h2>

      {isLoading && (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-destructive">카테고리 데이터를 불러오지 못했습니다.</p>
      )}

      {!isLoading &&
        !isError &&
        currency !== undefined &&
        categoryBreakdown !== undefined &&
        categoryBreakdown.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">이번 달 지출 카테고리가 없습니다.</p>
        )}

      {!isLoading &&
        !isError &&
        currency !== undefined &&
        categoryBreakdown !== undefined &&
        categoryBreakdown.length > 0 && (
          <ul className="mt-4 flex flex-col gap-3">
            {categoryBreakdown.map((item) => (
              <li key={item.categoryId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency({ amountMinor: item.amountMinor, currency })} (
                    {item.ratioPercent}%)
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${item.ratioPercent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
    </Card>
  );
}
