import { apiClient } from "@/shared/api/client";
import type {
  CreateAccountPayload,
  LoginPayload,
  PublicUserAccount,
  UpdateAccountPayload,
} from "../model/account";

export type ApiData<T> = {
  data: T;
};

export type SessionState = {
  authenticated: boolean;
  account: PublicUserAccount | null;
};

export async function getAccount() {
  const response = await apiClient.get<ApiData<PublicUserAccount>>("/account");
  return response.data.data;
}

export async function createAccount(payload: CreateAccountPayload) {
  const response = await apiClient.post<ApiData<PublicUserAccount>>(
    "/account",
    payload,
  );
  return response.data.data;
}

export async function updateAccount(payload: UpdateAccountPayload) {
  const response = await apiClient.patch<ApiData<PublicUserAccount>>(
    "/account",
    payload,
  );
  return response.data.data;
}

export async function deleteAccount() {
  await apiClient.delete("/account");
}

export async function getSession() {
  const response = await apiClient.get<ApiData<SessionState>>("/session");
  return response.data.data;
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<ApiData<SessionState>>(
    "/session",
    payload,
  );
  return response.data.data;
}

export async function logout() {
  const response = await apiClient.delete<ApiData<SessionState>>("/session");
  return response.data.data;
}

