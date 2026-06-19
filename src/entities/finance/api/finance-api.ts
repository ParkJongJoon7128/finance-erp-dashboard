import { apiClient } from "@/shared/api/client";
import type {
  CreateTransactionPayload,
  DashboardSummary,
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  UpdateTransactionPayload,
} from "../model/dashboard";

export type ApiData<T> = {
  data: T;
};

export async function getDashboardSummary(month?: string) {
  const response = await apiClient.get<ApiData<DashboardSummary>>("/dashboard", {
    params: { month },
  });

  return response.data.data;
}

export async function getTransactions(params: TransactionListParams = {}) {
  const response = await apiClient.get<ApiData<TransactionListResponse>>(
    "/transactions",
    { params },
  );

  return response.data.data.transactions;
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const response = await apiClient.post<
    ApiData<{ transaction: Transaction; duplicateOf: string | null }>
  >("/transactions", payload);

  return response.data.data;
}

export async function updateTransaction({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTransactionPayload;
}) {
  const response = await apiClient.patch<ApiData<Transaction>>(
    `/transactions/${id}`,
    payload,
  );

  return response.data.data;
}

export async function deleteTransaction(id: string) {
  await apiClient.delete(`/transactions/${id}`);
  return id;
}
