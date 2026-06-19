"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/entities/finance/api/finance-api";
import type { TransactionListParams } from "@/entities/finance/model/dashboard";
import { dashboardQueryKeys } from "@/features/dashboard/model/dashboard-queries";

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

function useInvalidateTransactionData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
  };
}

export function useCreateTransactionMutation() {
  const invalidate = useInvalidateTransactionData();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: invalidate,
  });
}

export function useUpdateTransactionMutation() {
  const invalidate = useInvalidateTransactionData();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: invalidate,
  });
}

export function useDeleteTransactionMutation() {
  const invalidate = useInvalidateTransactionData();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: invalidate,
  });
}
