"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/entities/finance/api/finance-api";

export const dashboardQueryKeys = {
  summary: (month?: string) =>
    ["dashboard", "summary", month ?? "current"] as const,
};

export function useDashboardSummaryQuery(month?: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(month),
    queryFn: () => getDashboardSummary(month),
  });
}
