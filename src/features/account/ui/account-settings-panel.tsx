"use client";

import { AxiosError } from "axios";
import { KeyRound, LogIn, LogOut, Save, UserRound } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type {
  PublicUserAccount,
  UpdateAccountPayload,
} from "@/entities/account/model/account";
import {
  useAccountQuery,
  useLoginMutation,
  useLogoutMutation,
  useSessionQuery,
  useUpdateAccountMutation,
} from "@/features/account/model/account-queries";
import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type FormState = {
  email: string;
  displayName: string;
  currency: "KRW" | "USD";
  monthlyBudget: string;
  password: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.error?.message ??
      error.response?.data?.error?.code ??
      error.message
    );
  }

  return "요청을 처리하지 못했습니다.";
}

export function AccountSettingsPanel() {
  const accountQuery = useAccountQuery();

  if (accountQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-5 text-tds-6 text-muted">
          계정 정보를 불러오는 중입니다.
        </CardContent>
      </Card>
    );
  }

  if (accountQuery.isError || !accountQuery.data) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-tds-6 font-semibold">계정 정보를 불러오지 못했습니다.</p>
          <p className="mt-1 text-tds-6 text-muted">
            {getErrorMessage(accountQuery.error)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <AccountSettingsForm
      account={accountQuery.data}
      key={accountQuery.data.updatedAt}
    />
  );
}

function AccountSettingsForm({ account }: { account: PublicUserAccount }) {
  const sessionQuery = useSessionQuery();
  const updateMutation = useUpdateAccountMutation();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const [form, setForm] = useState<FormState>({
    email: account.email,
    displayName: account.displayName,
    currency: account.settings.currency,
    monthlyBudget: String(account.settings.monthlyBudget),
    password: "",
  });
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const isBusy =
    updateMutation.isPending || loginMutation.isPending || logoutMutation.isPending;
  const errorMessage = useMemo(
    () =>
      updateMutation.error ?? loginMutation.error ?? logoutMutation.error
        ? getErrorMessage(
            updateMutation.error ?? loginMutation.error ?? logoutMutation.error,
          )
        : null,
    [loginMutation.error, logoutMutation.error, updateMutation.error],
  );

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const monthlyBudget = Number(form.monthlyBudget);
    const payload: UpdateAccountPayload = {
      email: form.email,
      displayName: form.displayName,
      settings: {
        currency: form.currency,
        monthlyBudget,
      },
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      await updateMutation.mutateAsync(payload);
      setForm((current) => ({ ...current, password: "" }));
      setMessage("계정 설정을 저장했습니다.");
    } catch {
      setMessage(null);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      await loginMutation.mutateAsync({
        email: form.email,
        password: loginPassword,
      });
      setLoginPassword("");
      setMessage("로그인 세션을 생성했습니다.");
    } catch {
      setMessage(null);
    }
  }

  async function handleLogout() {
    setMessage(null);
    try {
      await logoutMutation.mutateAsync();
      setMessage("로그아웃했습니다.");
    } catch {
      setMessage(null);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>계정 설정</CardTitle>
            <p className="mt-1 text-tds-6 text-muted">
              로컬 소유자 계정과 재무 기본값을 관리합니다.
            </p>
          </div>
          <UserRound className="h-5 w-5 text-muted" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
            <Field label="아이디" className="md:col-span-2">
              <input
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground outline-none focus:border-primary"
                onChange={(event) => updateForm("email", event.target.value)}
                autoCapitalize="none"
                type="text"
                value={form.email}
              />
            </Field>
            <Field label="표시 이름">
              <input
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground outline-none focus:border-primary"
                onChange={(event) =>
                  updateForm("displayName", event.target.value)
                }
                value={form.displayName}
              />
            </Field>
            <Field label="통화">
              <select
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground outline-none focus:border-primary"
                onChange={(event) =>
                  updateForm("currency", event.target.value as "KRW" | "USD")
                }
                value={form.currency}
              >
                <option value="KRW">KRW</option>
                <option value="USD">USD</option>
              </select>
            </Field>
            <Field label="월 예산">
              <input
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground outline-none focus:border-primary"
                min={1}
                onChange={(event) =>
                  updateForm("monthlyBudget", event.target.value)
                }
                type="number"
                value={form.monthlyBudget}
              />
            </Field>
            <Field label="새 비밀번호">
              <input
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground outline-none focus:border-primary"
                minLength={4}
                onChange={(event) => updateForm("password", event.target.value)}
                placeholder="변경 시에만 입력"
                type="password"
                value={form.password}
              />
            </Field>
            <div className="md:col-span-2">
              <Button disabled={isBusy} type="submit">
                <Save className="h-4 w-4" aria-hidden="true" />
                저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>세션</CardTitle>
              <p className="mt-1 text-tds-6 text-muted">
                브라우저 쿠키 기반 로그인 상태를 확인합니다.
              </p>
            </div>
            <Badge
              variant={sessionQuery.data?.authenticated ? "success" : "warning"}
            >
              {sessionQuery.data?.authenticated ? "로그인됨" : "로컬 접근"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-muted p-4">
              <p className="text-tds-7 text-muted">현재 계정</p>
              <p className="mt-1 truncate text-tds-6 font-semibold">
                {account.displayName}
              </p>
              <p className="mt-1 truncate text-tds-7 text-muted">
                {account.email}
              </p>
            </div>

            {sessionQuery.data?.authenticated ? (
              <Button
                disabled={isBusy}
                onClick={handleLogout}
                type="button"
                variant="secondary"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                로그아웃
              </Button>
            ) : (
              <form className="space-y-3" onSubmit={handleLogin}>
                <Field label="비밀번호">
                  <input
                    className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 text-foreground outline-none focus:border-primary"
                    onChange={(event) => setLoginPassword(event.target.value)}
                    type="password"
                    value={loginPassword}
                  />
                </Field>
                <Button disabled={isBusy} type="submit">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  로그인
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <KeyRound className="mt-0.5 h-5 w-5 text-muted" aria-hidden="true" />
            <div>
              <p className="text-tds-6 font-semibold">저장 경계</p>
              <p className="mt-1 text-tds-6 text-muted">
                계정과 거래 데이터는 Next.js API를 통해 `.local-data`에 저장되고
                원본 금융 파일은 저장하지 않습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {(message || errorMessage) && (
          <div
            className={cn(
              "rounded-lg border p-4 text-tds-6",
              errorMessage
                ? "border-toss-red-200 bg-toss-red-50 text-toss-red-700"
                : "border-toss-green-100 bg-toss-green-50 text-toss-green-600",
            )}
          >
            {errorMessage ?? message}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={cn("space-y-1 text-tds-7 font-medium text-muted", className)}>
      {label}
      {children}
    </label>
  );
}
