import { FileText } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="보고서" />
      <EmptyState
        icon={FileText}
        title="생성된 보고서가 없습니다"
        description="주간·월별 가계부와 거래 원장을 기반으로 한 재무 보고서를 이곳에서 확인하고 내보낼 수 있습니다."
      />
    </>
  );
}
