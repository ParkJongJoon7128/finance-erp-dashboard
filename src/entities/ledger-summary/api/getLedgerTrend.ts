import { mockLedgerTrend } from "@/entities/ledger-summary/model/mockData";
import type { LedgerTrend } from "@/entities/ledger-summary/model/types";

const MOCK_LATENCY_MS = 400;

/**
 * FE-only mock 데이터 소스. 실제 Route Handler가 준비되면 이 함수 내부만
 * axiosClient 호출로 교체하면 된다(호출부 계약은 유지).
 * period 기준 이전(포함) 월들 중 최근 months개를 오름차순으로 반환한다.
 */
export async function getLedgerTrend(period: string, months = 3): Promise<LedgerTrend> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  const monthsUpToPeriod = mockLedgerTrend.months.filter((point) => point.period <= period);
  const recentMonths = monthsUpToPeriod.slice(-months);

  return {
    ...mockLedgerTrend,
    months: recentMonths,
  };
}
