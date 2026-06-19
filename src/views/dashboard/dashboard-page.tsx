"use client";

import {
  BarChart3,
  CreditCard,
  FileSearch,
  Settings,
  WalletCards,
} from "lucide-react";
import {
  categoryBudgets,
  cashFlowSeries,
  dashboardMetrics,
  formatCurrency,
} from "@/entities/finance/model/dashboard";
import { AccountSettingsPanel } from "@/features/account/ui/account-settings-panel";
import { CandidateReviewPanel } from "@/features/auto-input/ui/candidate-review-panel";
import { useTransactionsQuery } from "@/features/transactions/model/transaction-queries";
import { RecentTransactionsTable } from "@/features/transactions/ui/recent-transactions-table";
import { useUiStore, type AppSection } from "@/shared/store/use-ui-store";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { AppShell } from "@/widgets/app-shell/app-shell";
import { DashboardOverview } from "@/widgets/dashboard-overview/dashboard-overview";

const sectionDescriptions: Record<AppSection, string> = {
  dashboard: "이번 달 재무 흐름과 자동 입력 검수 상태를 한 화면에서 확인합니다.",
  transactions: "확정된 거래와 자동 입력 거래를 검색, 필터링, 검토합니다.",
  autoInput: "토스와 은행 거래계좌내역서 파일을 업로드하고 후보 거래를 검수합니다.",
  analytics: "수입과 지출 추이, 카테고리별 소비 흐름을 분석합니다.",
  budget: "카테고리별 예산 사용률과 초과 위험을 관리합니다.",
  subscriptions: "반복 결제와 월 구독 총액, 다음 결제일을 확인합니다.",
  reports: "월간 요약과 다음 달 관리 포인트를 정리합니다.",
  settings: "테마, 통화 단위, 카테고리 같은 개인 설정을 관리합니다.",
};

export function DashboardPage() {
  const activeSection = useUiStore((state) => state.activeSection);

  return (
    <AppShell>
      <div className="space-y-5">
        <SectionIntro section={activeSection} />
        {renderSection(activeSection)}
      </div>
    </AppShell>
  );
}

function SectionIntro({ section }: { section: AppSection }) {
  if (section === "dashboard") {
    return null;
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-tds-6 text-muted">{sectionDescriptions[section]}</p>
        <Badge variant="info">기본 화면</Badge>
      </CardContent>
    </Card>
  );
}

function renderSection(section: AppSection) {
  switch (section) {
    case "dashboard":
      return <DashboardOverview />;
    case "transactions":
      return <TransactionsSection />;
    case "autoInput":
      return <AutoInputSection />;
    case "analytics":
      return <AnalyticsSection />;
    case "budget":
      return <BudgetSection />;
    case "subscriptions":
      return <SubscriptionsSection />;
    case "reports":
      return <ReportsSection />;
    case "settings":
      return <SettingsSection />;
  }
}

function TransactionsSection() {
  const transactionsQuery = useTransactionsQuery();
  const transactions = transactionsQuery.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle>거래 내역 관리</CardTitle>
          <p className="mt-1 text-tds-6 text-muted">
            로컬 거래 API의 확정 거래와 자동 입력 거래를 확인합니다.
          </p>
        </div>
        <Badge
          className="w-fit shrink-0"
          variant={transactionsQuery.isError ? "danger" : "success"}
        >
          {transactionsQuery.isLoading
            ? "불러오는 중"
            : transactionsQuery.isError
              ? "조회 실패"
              : `${transactions.length}건`}
        </Badge>
      </CardHeader>
      <CardContent>
        {transactionsQuery.isError ? (
          <p className="rounded-lg border border-border bg-surface-muted p-4 text-tds-6 text-muted">
            거래 내역을 불러오지 못했습니다. 계정 설정 또는 로컬 데이터 상태를
            확인하세요.
          </p>
        ) : transactionsQuery.isLoading ? (
          <p className="rounded-lg border border-border bg-surface-muted p-4 text-tds-6 text-muted">
            거래 내역을 불러오는 중입니다.
          </p>
        ) : (
          <RecentTransactionsTable transactions={transactions} />
        )}
      </CardContent>
    </Card>
  );
}

function AutoInputSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>자동 입력 검수</CardTitle>
        <p className="mt-1 text-tds-6 text-muted">
          분석 결과는 바로 저장하지 않고 사용자가 수정, 제외, 승인한 뒤 반영합니다.
        </p>
      </CardHeader>
      <CardContent>
        <CandidateReviewPanel />
      </CardContent>
    </Card>
  );
}

function AnalyticsSection() {
  const maxCashFlow = Math.max(
    ...cashFlowSeries.flatMap((item) => [item.income, item.expense]),
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle>분석 및 차트</CardTitle>
          <p className="mt-1 text-tds-6 text-muted">
            월별 수입/지출 추이와 지출 비중을 비교합니다.
          </p>
        </div>
        <BarChart3 className="hidden h-5 w-5 shrink-0 text-muted sm:block" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="flex h-80 items-end gap-2 overflow-hidden rounded-lg border border-border bg-surface-muted p-3 sm:gap-3 sm:p-4">
          {cashFlowSeries.map((item) => (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <div className="flex min-w-0 flex-1 items-end justify-center gap-1 sm:gap-1.5">
                <div
                  className="w-full max-w-10 rounded-t bg-toss-green-500"
                  style={{ height: `${(item.income / maxCashFlow) * 100}%` }}
                  title={`${item.month} 수입 ${item.income}만원`}
                />
                <div
                  className="w-full max-w-10 rounded-t bg-toss-red-500"
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
      </CardContent>
    </Card>
  );
}

function BudgetSection() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle>예산 관리</CardTitle>
          <p className="mt-1 text-tds-6 text-muted">
            카테고리 예산 대비 사용 금액과 초과 상태를 확인합니다.
          </p>
        </div>
        <WalletCards className="hidden h-5 w-5 shrink-0 text-muted sm:block" aria-hidden="true" />
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
  );
}

function SubscriptionsSection() {
  const subscriptions = [
    { name: "넷플릭스", amount: 17000, nextPayment: "2026-06-21" },
    { name: "유튜브 프리미엄", amount: 14900, nextPayment: "2026-06-24" },
    { name: "Notion", amount: 12000, nextPayment: "2026-07-02" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle>구독 관리</CardTitle>
          <p className="mt-1 text-tds-6 text-muted">
            활성 구독의 월 환산 비용과 다음 결제일을 확인합니다.
          </p>
        </div>
        <CreditCard className="hidden h-5 w-5 shrink-0 text-muted sm:block" aria-hidden="true" />
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.name}
            className="rounded-lg border border-border bg-surface-muted p-4"
          >
            <p className="text-tds-6 font-semibold">{subscription.name}</p>
            <p className="mt-2 text-tds-4 font-semibold">
              {formatCurrency(subscription.amount)}
            </p>
            <p className="mt-1 text-tds-7 text-muted">
              다음 결제일 {subscription.nextPayment}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReportsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle>월간 보고서</CardTitle>
          <p className="mt-1 text-tds-6 text-muted">
            이번 달 수입, 지출, 순저축과 관리 포인트를 요약합니다.
          </p>
        </div>
        <FileSearch className="hidden h-5 w-5 shrink-0 text-muted sm:block" aria-hidden="true" />
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <ReportItem
          label="월간 순저축"
          value={formatCurrency(dashboardMetrics.netSavings)}
        />
        <ReportItem
          label="지출 비율"
          value={`${dashboardMetrics.expenseRatio}%`}
        />
        <ReportItem label="예산 사용률" value={`${dashboardMetrics.budgetUsage}%`} />
      </CardContent>
    </Card>
  );
}

function ReportItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4">
      <p className="text-tds-7 text-muted">{label}</p>
      <p className="mt-2 text-tds-4 font-semibold">{value}</p>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle>설정</CardTitle>
            <p className="mt-1 text-tds-6 text-muted">
              프로필, 로그인 세션, 통화 단위, 월 예산을 관리합니다.
            </p>
          </div>
          <Settings className="hidden h-5 w-5 shrink-0 text-muted sm:block" aria-hidden="true" />
        </CardHeader>
      </Card>
      <AccountSettingsPanel />
    </div>
  );
}
