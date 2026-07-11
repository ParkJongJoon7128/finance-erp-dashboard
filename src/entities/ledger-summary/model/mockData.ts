import type { LedgerSummary, LedgerTrend } from "@/entities/ledger-summary/model/types";

/**
 * 이미 계산이 끝난 완성값이다. 화면은 이 값을 그대로 표시하며 재계산하지 않는다.
 * amountMinor 계열 필드는 통화 최소 단위 정수값이다. KRW는 소수 단위가 없으므로
 * 최소 단위 = 원화 정수값 그대로다.
 * monthIncomeMinor(3,200,000) - monthExpenseMinor(2,150,000) = netIncomeMinor(1,050,000)
 * categoryBreakdown의 ratioPercent 합계는 100이다.
 */
export const mockLedgerSummary: LedgerSummary = {
  period: "2026-07",
  currency: "KRW",
  totalBalanceMinor: 18_450_000,
  monthIncomeMinor: 3_200_000,
  monthExpenseMinor: 2_150_000,
  netIncomeMinor: 1_050_000,
  categoryBreakdown: [
    { categoryId: "cat-food", label: "식비", amountMinor: 645_000, ratioPercent: 30 },
    { categoryId: "cat-housing", label: "주거/공과금", amountMinor: 537_500, ratioPercent: 25 },
    { categoryId: "cat-transport", label: "교통", amountMinor: 322_500, ratioPercent: 15 },
    { categoryId: "cat-shopping", label: "쇼핑", amountMinor: 258_000, ratioPercent: 12 },
    { categoryId: "cat-etc", label: "기타", amountMinor: 387_000, ratioPercent: 18 },
  ],
  reviewPendingCount: 4,
};

/**
 * 이미 계산이 끝난 완성값이다. 화면은 이 값을 그대로 표시하며 재계산하지 않는다.
 * months는 오름차순(과거 -> 최근)이며, 각 point는
 * incomeMinor - expenseMinor = netIncomeMinor로 내부 정합성을 지킨다.
 * 최신 월(2026-07)은 mockLedgerSummary와 동일하게
 * income 3,200,000 / expense 2,150,000 / net 1,050,000으로 맞춘다.
 */
export const mockLedgerTrend: LedgerTrend = {
  currency: "KRW",
  months: [
    {
      period: "2026-05",
      incomeMinor: 2_950_000,
      expenseMinor: 2_320_000,
      netIncomeMinor: 630_000,
    },
    {
      period: "2026-06",
      incomeMinor: 3_050_000,
      expenseMinor: 2_480_000,
      netIncomeMinor: 570_000,
    },
    {
      period: "2026-07",
      incomeMinor: 3_200_000,
      expenseMinor: 2_150_000,
      netIncomeMinor: 1_050_000,
    },
  ],
};
