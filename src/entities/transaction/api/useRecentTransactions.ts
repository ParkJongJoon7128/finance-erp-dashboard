import { useQuery } from "@tanstack/react-query";
import { getRecentTransactions } from "@/entities/transaction/api/getRecentTransactions";

const DEFAULT_LIMIT = 5;

export function useRecentTransactions(limit: number = DEFAULT_LIMIT) {
  return useQuery({
    queryKey: ["transactions", "list", { limit }],
    queryFn: () => getRecentTransactions(limit),
  });
}
