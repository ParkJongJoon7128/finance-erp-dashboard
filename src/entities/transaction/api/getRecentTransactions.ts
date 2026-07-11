import { mockRecentTransactions } from "@/entities/transaction/model/mockData";
import type { Transaction } from "@/entities/transaction/model/types";
import type { Paginated } from "@/shared/types";

const MOCK_LATENCY_MS = 400;

export async function getRecentTransactions(limit: number): Promise<Paginated<Transaction>> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  return {
    items: mockRecentTransactions.slice(0, limit),
    nextCursor: null,
  };
}
