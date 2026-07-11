import { Repeat } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="구독 관리" />
      <EmptyState
        icon={Repeat}
        title="구독 관리 기능을 준비 중입니다"
        description="반복 결제로 인식된 거래를 구독으로 묶어 관리하는 기능입니다. 핵심 도메인 확정 이후 제공될 예정입니다."
      />
    </>
  );
}
