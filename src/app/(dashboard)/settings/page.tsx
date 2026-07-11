import { Settings } from "lucide-react";
import { Card, EmptyState, PageHeader, ThemeSelector } from "@/shared/ui";

export default function Page() {
  return (
    <>
      <PageHeader title="설정" />

      <Card className="mb-6">
        <h2 className="text-base font-semibold text-foreground">화면 테마</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          라이트, 다크, 시스템 설정 중 원하는 화면 테마를 선택하세요.
        </p>
        <div className="mt-4">
          <ThemeSelector />
        </div>
      </Card>

      <EmptyState
        icon={Settings}
        title="다른 설정을 준비 중입니다"
        description="계좌, 카테고리, 표시 통화, 기간 기준 등 대시보드 환경을 이곳에서 관리합니다. 설정 항목이 순차적으로 추가됩니다."
      />
    </>
  );
}
