import { mockAccounts } from "@/entities/account/model/mockData";
import type { Account } from "@/entities/account/model/types";
import type { Paginated } from "@/shared/types";

const MOCK_LATENCY_MS = 400;

export async function getAccounts(): Promise<Paginated<Account>> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  return {
    items: mockAccounts,
    nextCursor: null,
  };
}
