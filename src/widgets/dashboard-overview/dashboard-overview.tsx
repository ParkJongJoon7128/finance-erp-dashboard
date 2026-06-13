import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Percent,
  PiggyBank,
  Wallet,
} from "lucide-react";
import {
  cashFlowSeries,
  categoryBudgets,
  dashboardMetrics,
  formatCurrency,
  recentTransactions,
} from "@/entities/finance/model/dashboard";
import { CandidateReviewPanel } from "@/features/auto-input/ui/candidate-review-panel";
import { RecentTransactionsTable } from "@/features/transactions/ui/recent-transactions-table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { MetricCard } from "./metric-card";

export function DashboardOverview() {
  const maxCashFlow = Math.max(
    ...cashFlowSeries.flatMap((item) => [item.income, item.expense]),
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          change="전월 대비 +3.1%"
          icon={ArrowDownLeft}
          title="이번 달 수입"
          tone="success"
          value={formatCurrency(dashboardMetrics.income)}
        />
        <MetricCard
          change="예산 대비 72% 사용"
          icon={ArrowUpRight}
          title="이번 달 지출"
          tone="warning"
          value={formatCurrency(dashboardMetrics.expense)}
        />
        <MetricCard
          change={`지출 비율 ${dashboardMetrics.expenseRatio}%`}
          icon={PiggyBank}
          title="월간 순저축"
          tone="success"
          value={formatCurrency(dashboardMetrics.netSavings)}
        />
        <MetricCard
          change={`월 구독 ${formatCurrency(dashboardMetrics.subscriptionTotal)}`}
          icon={Percent}
          title="예산 사용률"
          value={`${dashboardMetrics.budgetUsage}%`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle>월별 현금 흐름</CardTitle>
              <p className="mt-1 text-tds-6 text-muted">
                수입과 지출 흐름을 월 단위로 비교합니다.
              </p>
            </div>
            <Badge className="w-fit shrink-0" variant="info">6개월</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-2 overflow-hidden rounded-lg border border-border bg-surface-muted p-3 sm:gap-3 sm:p-4">
              {cashFlowSeries.map((item) => (
                <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div className="flex min-w-0 flex-1 items-end justify-center gap-1 sm:gap-1.5">
                    <div
                      className="w-full max-w-8 rounded-t bg-toss-green-500"
                      style={{ height: `${(item.income / maxCashFlow) * 100}%` }}
                      title={`${item.month} 수입 ${item.income}만원`}
                    />
                    <div
                      className="w-full max-w-8 rounded-t bg-toss-red-500"
                      style={{ height: `${(item.expense / maxCashFlow) * 100}%` }}
                      title={`${item.month} 지출 ${item.expense}만원`}
                    />
                  </div>
                  <span className="text-center text-tds-7 text-muted">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-tds-7 text-muted">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-toss-green-500" />
                수입
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-toss-red-500" />
                지출
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>카테고리별 예산</CardTitle>
            <p className="mt-1 text-tds-6 text-muted">
              초과 가능성이 높은 항목을 먼저 확인합니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBudgets.map((budget) => {
              const usage = Math.round((budget.used / budget.limit) * 100);
              return (
                <div key={budget.category} className="space-y-2">
                  <div className="flex flex-col gap-1 text-tds-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-muted sm:text-right">
                      {formatCurrency(budget.used)} / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <Progress
                    indicatorClassName={
                      usage >= 100
                        ? "bg-toss-red-500"
                        : usage >= 70
                          ? "bg-toss-orange-500"
                          : "bg-toss-green-500"
                    }
                    value={usage}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle>최근 거래</CardTitle>
              <p className="mt-1 text-tds-6 text-muted">
                자동 입력 항목과 검토 상태를 함께 확인합니다.
              </p>
            </div>
            <Button className="w-fit shrink-0" size="sm" type="button" variant="secondary">
              전체 보기
            </Button>
          </CardHeader>
          <CardContent>
            <RecentTransactionsTable transactions={recentTransactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle>자동 입력 검수</CardTitle>
              <p className="mt-1 text-tds-6 text-muted">
                추출된 거래 후보를 수정한 뒤 승인 항목만 저장합니다.
              </p>
            </div>
            <Badge className="w-fit shrink-0" variant="warning">검수 필요</Badge>
          </CardHeader>
          <CardContent>
            <CandidateReviewPanel />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Landmark className="mt-0.5 h-5 w-5 text-muted" aria-hidden="true" />
            <div>
              <p className="text-tds-6 font-semibold">주거래 계좌</p>
              <p className="mt-1 text-tds-6 text-muted">
                입출금 변동은 대시보드 지표에 즉시 반영되는 구조로 확장됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Wallet className="mt-0.5 h-5 w-5 text-muted" aria-hidden="true" />
            <div>
              <p className="text-tds-6 font-semibold">예산 경보</p>
              <p className="mt-1 text-tds-6 text-muted">
                쇼핑 예산은 이미 100%를 넘어 다음 지출 전 조정이 필요합니다.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Percent className="mt-0.5 h-5 w-5 text-muted" aria-hidden="true" />
            <div>
              <p className="text-tds-6 font-semibold">보고서 포인트</p>
              <p className="mt-1 text-tds-6 text-muted">
                고정비 비중과 카테고리별 증가율을 월간 보고서에 연결합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
