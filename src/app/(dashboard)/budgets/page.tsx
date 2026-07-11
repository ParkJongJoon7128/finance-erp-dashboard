import { Wallet } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="예산 관리" />
      <EmptyState
        icon={Wallet}
        title="설정된 예산이 없습니다"
        description="카테고리별 월 예산을 설정하면 지출 대비 예산 소진율을 이곳에서 추적할 수 있습니다."
      />
    </>
  );
}
