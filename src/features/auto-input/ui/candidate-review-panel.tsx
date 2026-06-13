"use client";

import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { useState } from "react";
import {
  formatCurrency,
  reviewCandidates,
  type ReviewCandidate,
} from "@/entities/finance/model/dashboard";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

const statusMeta: Record<
  ReviewCandidate["status"],
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  approved: { label: "승인 가능", variant: "success" },
  duplicate: { label: "중복 의심", variant: "danger" },
  "needs-review": { label: "검수 필요", variant: "warning" },
};

export function CandidateReviewPanel() {
  const [selectedId, setSelectedId] = useState(reviewCandidates[0]?.id);
  const selectedCandidate = reviewCandidates.find(
    (candidate) => candidate.id === selectedId,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-lg border border-dashed border-toss-grey-300 bg-surface-muted p-4 dark:border-toss-grey-600">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface text-foreground shadow-sm">
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-tds-6 font-semibold">거래계좌내역서 업로드</h3>
            <p className="mt-1 text-tds-6 text-muted">
              토스 캡처, 은행 거래내역 PDF, Excel, CSV 파일을 분석 대기열에
              추가합니다.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-tds-7 text-muted">
          <div className="rounded-md border border-border bg-surface p-3">
            분석 상태
            <strong className="mt-1 block text-tds-6 text-foreground">
              3건 검수 대기
            </strong>
          </div>
          <div className="rounded-md border border-border bg-surface p-3">
            저장 규칙
            <strong className="mt-1 block text-tds-6 text-foreground">
              승인 항목만 반영
            </strong>
          </div>
        </div>
        <Button className="mt-4 w-full" type="button">
          <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
          파일 선택
        </Button>
      </div>

      <div className="space-y-3">
        {reviewCandidates.map((candidate) => (
          <button
            key={candidate.id}
            className="w-full rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:bg-toss-grey-50 dark:hover:bg-toss-grey-800"
            onClick={() => setSelectedId(candidate.id)}
            type="button"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-tds-6 font-medium">{candidate.merchant}</p>
                <p className="mt-1 text-tds-7 text-muted">
                  {candidate.date} · {candidate.category} · 신뢰도{" "}
                  {candidate.confidence}%
                </p>
              </div>
              <Badge variant={statusMeta[candidate.status].variant}>
                {statusMeta[candidate.status].label}
              </Badge>
            </div>
            <p className="mt-2 text-tds-6 font-semibold">
              {formatCurrency(candidate.amount)}
            </p>
          </button>
        ))}
      </div>

      {selectedCandidate && (
        <div className="lg:col-span-2">
          <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-5">
            <label className="space-y-1 text-tds-7 font-medium text-muted">
              날짜
              <input
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground"
                defaultValue={selectedCandidate.date}
              />
            </label>
            <label className="space-y-1 text-tds-7 font-medium text-muted sm:col-span-2">
              거래명
              <input
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground"
                defaultValue={selectedCandidate.merchant}
              />
            </label>
            <label className="space-y-1 text-tds-7 font-medium text-muted">
              카테고리
              <input
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground"
                defaultValue={selectedCandidate.category}
              />
            </label>
            <label className="space-y-1 text-tds-7 font-medium text-muted">
              금액
              <input
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground"
                defaultValue={selectedCandidate.amount}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
