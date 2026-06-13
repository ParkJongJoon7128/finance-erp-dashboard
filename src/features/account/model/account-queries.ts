"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccount,
  getSession,
  login,
  logout,
  updateAccount,
} from "@/entities/account/api/account-api";

export const accountQueryKeys = {
  account: ["account"] as const,
  session: ["session"] as const,
};

export function useAccountQuery() {
  return useQuery({
    queryKey: accountQueryKeys.account,
    queryFn: getAccount,
  });
}

export function useSessionQuery() {
  return useQuery({
    queryKey: accountQueryKeys.session,
    queryFn: getSession,
  });
}

export function useUpdateAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onSuccess(account) {
      queryClient.setQueryData(accountQueryKeys.account, account);
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.session });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess(session) {
      queryClient.setQueryData(accountQueryKeys.session, session);
      if (session.account) {
        queryClient.setQueryData(accountQueryKeys.account, session.account);
      }
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess(session) {
      queryClient.setQueryData(accountQueryKeys.session, session);
    },
  });
}

