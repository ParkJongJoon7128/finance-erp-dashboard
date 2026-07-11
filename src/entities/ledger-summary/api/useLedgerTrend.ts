import { useQuery } from "@tanstack/react-query";
import { getLedgerTrend } from "@/entities/ledger-summary/api/getLedgerTrend";

export function useLedgerTrend(period: string, months = 3) {
  return useQuery({
    queryKey: ["ledger-summary", "trend", { period, months }],
    queryFn: () => getLedgerTrend(period, months),
  });
}
