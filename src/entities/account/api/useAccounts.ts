import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/entities/account/api/getAccounts";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts", "list"],
    queryFn: getAccounts,
  });
}
