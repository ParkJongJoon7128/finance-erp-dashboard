import { useQuery } from "@tanstack/react-query";
import { getLedgerSummary } from "@/entities/ledger-summary/api/getLedgerSummary";

export function useLedgerSummary(period: string) {
  return useQuery({
    queryKey: ["ledger-summary", "detail", { period }],
    queryFn: () => getLedgerSummary(period),
  });
}
