"use client";

import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Percent,
  PiggyBank,
  Wallet,
} from "lucide-react";
import {
  formatCurrency,
} from "@/entities/finance/model/dashboard";
import { CandidateReviewPanel } from "@/features/auto-input/ui/candidate-review-panel";
import { useDashboardSummaryQuery } from "@/features/dashboard/model/dashboard-queries";
import { RecentTransactionsTable } from "@/features/transactions/ui/recent-transactions-table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { MetricCard } from "./metric-card";

export function DashboardOverview() {
  const dashboardQuery = useDashboardSummaryQuery();

  if (dashboardQuery.isLoading) {
    return <DashboardLoadingState />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <DashboardErrorState
        onRetry={() => void dashboardQuery.refetch()}
      />
    );
  }

  const summary = dashboardQuery.data;
  const metrics = summary.metrics;
  const categoryExpenseItems = Object.entries(summary.categoryExpense)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxCashFlow = Math.max(metrics.income, metrics.expense, 1);
  const monthLabel = summary.month.replace("-", "년 ") + "월";
  const hasCategoryExpense = categoryExpenseItems.length > 0;

  const flowItems = [
    { label: "수입", amount: metrics.income, className: "bg-toss-green-500" },
    { label: "지출", amount: metrics.expense, className: "bg-toss-red-500" },
  ];

  const reviewCount = summary.recentTransactions.filter(
    (transaction) => transaction.status === "review",
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          change={`${monthLabel} 기준`}
          icon={ArrowDownLeft}
          title="이번 달 수입"
          tone="success"
          value={formatCurrency(metrics.income)}
        />
        <MetricCard
          change={`거래 ${metrics.transactionCount ?? 0}건 집계`}
          icon={ArrowUpRight}
          title="이번 달 지출"
          tone="warning"
          value={formatCurrency(metrics.expense)}
        />
        <MetricCard
          change={`지출 비율 ${metrics.expenseRatio}%`}
          icon={PiggyBank}
          title="월간 순저축"
          tone={metrics.netSavings >= 0 ? "success" : "warning"}
          value={formatCurrency(metrics.netSavings)}
        />
        <MetricCard
          change={`월 예산 대비 ${metrics.budgetUsage}%`}
          icon={Percent}
          title="예산 사용률"
          tone={metrics.budgetUsage >= 100 ? "warning" : "default"}
          value={`${metrics.budgetUsage}%`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle>이번 달 현금 흐름</CardTitle>
              <p className="mt-1 text-tds-6 text-muted">
                실제 거래 데이터를 기준으로 수입과 지출을 비교합니다.
              </p>
            </div>
            <Badge className="w-fit shrink-0" variant="info">{summary.month}</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid h-72 gap-4 rounded-lg border border-border bg-surface-muted p-4 sm:grid-cols-2">
              {flowItems.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-col justify-end gap-3">
                  <div className="flex flex-1 items-end justify-center">
                    <div
                      className={`w-full max-w-24 rounded-t ${item.className}`}
                      style={{ height: `${(item.amount / maxCashFlow) * 100}%` }}
                      title={`${item.label} ${formatCurrency(item.amount)}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-tds-7 text-muted">{item.label}</p>
                    <p className="mt-1 text-tds-6 font-semibold">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
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
            <CardTitle>카테고리별 지출</CardTitle>
            <p className="mt-1 text-tds-6 text-muted">
              실제 거래에서 집계한 지출 비중을 확인합니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasCategoryExpense ? (
              categoryExpenseItems.map(([category, amount]) => {
                const usage =
                  metrics.expense > 0 ? Math.round((amount / metrics.expense) * 100) : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex flex-col gap-1 text-tds-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted sm:text-right">
                        {formatCurrency(amount)} · {usage}%
                      </span>
                    </div>
                    <Progress
                      indicatorClassName={
                        usage >= 40
                          ? "bg-toss-red-500"
                          : usage >= 20
                            ? "bg-toss-orange-500"
                            : "bg-toss-green-500"
                      }
                      value={usage}
                    />
                  </div>
                );
              })
            ) : (
              <p className="rounded-lg border border-border bg-surface-muted p-4 text-tds-6 text-muted">
                이번 달 지출 거래가 아직 없습니다.
              </p>
            )}
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
            <RecentTransactionsTable transactions={summary.recentTransactions} />
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
            {reviewCount.length > 0 && (
              <Badge className="w-fit shrink-0" variant="danger">
                실제 거래 {reviewCount.length}건
              </Badge>
            )}
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
                입출금 변동은 API를 통해 대시보드 지표에 반영됩니다.
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
                현재 월 예산 사용률은 {metrics.budgetUsage}%입니다.
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
                최근 거래 {summary.recentTransactions.length}건을 월간 보고서에 연결합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["수입", "지출", "순저축", "예산"].map((label) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="h-4 w-20 rounded bg-surface-muted" />
              <div className="mt-4 h-8 w-32 rounded bg-surface-muted" />
              <div className="mt-4 h-3 w-24 rounded bg-surface-muted" />
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardContent className="p-5 text-tds-6 text-muted">
          대시보드 데이터를 불러오는 중입니다.
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-toss-red-500" aria-hidden="true" />
          <div>
            <p className="text-tds-6 font-semibold">
              대시보드 데이터를 불러오지 못했습니다.
            </p>
            <p className="mt-1 text-tds-6 text-muted">
              계정 설정 또는 로컬 데이터 파일 상태를 확인한 뒤 다시 시도하세요.
            </p>
          </div>
        </div>
        <Button className="w-fit shrink-0" onClick={onRetry} type="button" variant="secondary">
          다시 시도
        </Button>
      </CardContent>
    </Card>
  );
}
