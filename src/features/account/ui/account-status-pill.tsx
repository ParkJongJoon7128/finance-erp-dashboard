"use client";

import { CircleUserRound, LockKeyhole, WifiOff } from "lucide-react";
import { useSessionQuery } from "@/features/account/model/account-queries";
import { Badge } from "@/shared/ui/badge";

export function AccountStatusPill() {
  const { data, isError, isLoading } = useSessionQuery();

  if (isLoading) {
    return (
      <div className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-tds-7 text-muted sm:flex">
        <CircleUserRound className="h-4 w-4" aria-hidden="true" />
        계정 확인 중
      </div>
    );
  }

  if (isError) {
    return (
      <div className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-tds-7 text-muted sm:flex">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        계정 연결 실패
      </div>
    );
  }

  return (
    <div className="hidden min-w-0 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 sm:flex">
      <LockKeyhole className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <span className="max-w-32 truncate text-tds-7 font-medium">
        {data?.account?.displayName ?? "비로그인"}
      </span>
      <Badge variant={data?.authenticated ? "success" : "warning"}>
        {data?.authenticated ? "세션" : "로컬"}
      </Badge>
    </div>
  );
}

