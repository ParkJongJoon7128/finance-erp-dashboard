import { mockLedgerSummary } from "@/entities/ledger-summary/model/mockData";
import type { LedgerSummary } from "@/entities/ledger-summary/model/types";

const MOCK_LATENCY_MS = 400;

/**
 * FE-only mock 데이터 소스. 실제 Route Handler가 준비되면 이 함수 내부만
 * axiosClient 호출로 교체하면 된다(호출부 계약은 유지).
 */
export async function getLedgerSummary(period: string): Promise<LedgerSummary> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  return {
    ...mockLedgerSummary,
    period,
  };
}
