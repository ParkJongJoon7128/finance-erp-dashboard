import { PageHeader } from "@/shared/ui";
import { DashboardSummary } from "@/widgets/dashboard-summary";

export default function Page() {
  return (
    <>
      <PageHeader
        title="가계부"
        description="계좌, 이번 달 수입/지출, 카테고리별 지출, 최근 거래를 한눈에 확인하세요."
      />
      <DashboardSummary />
    </>
  );
}
