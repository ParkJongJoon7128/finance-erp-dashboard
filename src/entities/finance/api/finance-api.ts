import { apiClient } from "@/shared/api/client";
import type {
  DashboardSummary,
  TransactionListParams,
  TransactionListResponse,
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
