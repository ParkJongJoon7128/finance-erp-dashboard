import { BarChart3 } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="분석 및 차트" />
      <EmptyState
        icon={BarChart3}
        title="표시할 분석 데이터가 없습니다"
        description="확정된 거래가 쌓이면 카테고리별 지출과 기간별 추이 차트를 이곳에서 확인할 수 있습니다."
      />
    </>
  );
}
