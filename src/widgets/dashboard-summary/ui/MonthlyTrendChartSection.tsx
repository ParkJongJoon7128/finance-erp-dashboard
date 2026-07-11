import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { LedgerTrend } from "@/entities/ledger-summary";
import { formatCurrency, formatMonthLabel } from "@/shared/lib";
import {
  Card,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
  type ChartConfig,
} from "@/shared/ui";

interface MonthlyTrendChartSectionProps {
  trend: LedgerTrend | undefined;
  isLoading: boolean;
  isError: boolean;
}

const chartConfig = {
  incomeMinor: {
    label: "수입",
    color: "var(--chart-1)",
  },
  expenseMinor: {
    label: "지출",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

/**
 * 서버(mock)가 사전 계산한 월별 수입/지출/순액을 표시만 한다.
 * period("2026-07") -> 월 라벨("7월") 변환은 formatMonthLabel로, 금액 포맷은
 * formatCurrency로만 처리하며 합계/차액을 클라이언트에서 재계산하지 않는다.
 */
export function MonthlyTrendChartSection({
  trend,
  isLoading,
  isError,
}: MonthlyTrendChartSectionProps) {
  const chartData = trend?.months.map((point) => ({
    monthLabel: formatMonthLabel(point.period),
    incomeMinor: point.incomeMinor,
    expenseMinor: point.expenseMinor,
    netIncomeMinor: point.netIncomeMinor,
  }));

  return (
    <Card>
      <h2 className="text-sm font-medium text-muted-foreground">최근 3개월 추이</h2>

      {isLoading && (
        <div className="mt-4">
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-destructive">최근 3개월 추이를 불러오지 못했습니다.</p>
      )}

      {!isLoading && !isError && trend !== undefined && chartData !== undefined && (
        <>
          {chartData.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">표시할 추이 데이터가 없습니다.</p>
          ) : (
            <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-64 w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={88}
                  tickFormatter={(value: number) =>
                    formatCurrency({ amountMinor: value, currency: trend.currency })
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const key = String(name) as keyof typeof chartConfig;
                        const label = chartConfig[key]?.label ?? String(name);

                        return (
                          <div className="flex w-full items-center justify-between gap-4">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-mono font-medium text-foreground">
                              {formatCurrency({
                                amountMinor: Number(value),
                                currency: trend.currency,
                              })}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="incomeMinor" fill="var(--color-incomeMinor)" radius={4} />
                <Bar dataKey="expenseMinor" fill="var(--color-expenseMinor)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </>
      )}
    </Card>
  );
}
