import { Settings } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="설정" />
      <EmptyState
        icon={Settings}
        title="설정을 준비 중입니다"
        description="계좌, 카테고리, 표시 통화, 기간 기준 등 대시보드 환경을 이곳에서 관리합니다. 설정 항목이 순차적으로 추가됩니다."
      />
    </>
  );
}
