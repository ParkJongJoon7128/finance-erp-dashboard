import { AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/ui";

interface ReviewPendingBadgeProps {
  reviewPendingCount: number;
}

/**
 * AI 추출 결과는 사용자 검수 전까지 확정 거래가 아니다.
 * 이 배지는 검수 대기 건수와 함께 "확정 거래 아님"이 드러나도록 문구를 명시한다.
 */
export function ReviewPendingBadge({ reviewPendingCount }: ReviewPendingBadgeProps) {
  if (reviewPendingCount <= 0) {
    return null;
  }

  return (
    <Badge variant="warning" className="items-center">
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
      {reviewPendingCount}건 검수 대기 — 확정 거래 아님
    </Badge>
  );
}
