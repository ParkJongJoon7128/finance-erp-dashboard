import type { TransactionDirection } from "@/shared/types";

export interface Transaction {
  id: string;
  /** ISO 8601 UTC 문자열 */
  occurredAt: string;
  description: string;
  amountMinor: number;
  currency: string;
  direction: TransactionDirection;
  categoryLabel: string;
  /**
   * AI 추출 결과는 사용자 확정 전까지 'pending'으로 취급한다.
   * 'confirmed'만 확정 거래 원장 데이터로 간주한다.
   */
  reviewStatus: "confirmed" | "pending";
}
