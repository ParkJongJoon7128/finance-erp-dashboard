import { ArrowLeftRight } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="거래 내역 관리" />
      <EmptyState
        icon={ArrowLeftRight}
        title="아직 거래 내역이 없습니다"
        description="은행 거래 내역서를 업로드하고 AI 추출을 실행하면 검수 대상 거래가 이곳에 표시됩니다."
      />
    </>
  );
}
