"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/entities/finance/api/finance-api";
import type { TransactionListParams } from "@/entities/finance/model/dashboard";

export const transactionQueryKeys = {
  list: (params: TransactionListParams = {}) =>
    ["transactions", "list", params] as const,
};

export function useTransactionsQuery(params: TransactionListParams = {}) {
  return useQuery({
    queryKey: transactionQueryKeys.list(params),
    queryFn: () => getTransactions(params),
  });
}
