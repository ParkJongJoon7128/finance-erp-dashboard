export interface CategoryBreakdownItem {
  categoryId: string;
  label: string;
  amountMinor: number;
  ratioPercent: number;
}

export interface LedgerSummary {
  period: string; // "2026-07"
  currency: string; // "KRW"
  totalBalanceMinor: number;
  monthIncomeMinor: number;
  monthExpenseMinor: number;
  /** 서버가 사전 계산한 이번 달 순액(수입-지출). 클라이언트는 이 값을 그대로 표시만 한다. */
  netIncomeMinor: number;
  categoryBreakdown: CategoryBreakdownItem[];
  reviewPendingCount: number;
}

export interface MonthlyTrendPoint {
  period: string; // "2026-07"
  incomeMinor: number;
  expenseMinor: number;
  /** 서버가 사전 계산한 해당 월 순액(수입-지출). 클라이언트는 이 값을 그대로 표시만 한다. */
  netIncomeMinor: number;
}

export interface LedgerTrend {
  currency: string; // "KRW"
  /** 오름차순(과거 -> 최근) 정렬, 요청한 개월 수만큼의 월별 추이 데이터 */
  months: MonthlyTrendPoint[];
}
