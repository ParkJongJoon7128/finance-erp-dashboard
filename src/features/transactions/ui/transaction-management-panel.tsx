"use client";

import { AxiosError } from "axios";
import { Plus, RotateCcw, Save } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionListParams,
  TransactionStatus,
  TransactionType,
} from "@/entities/finance/model/dashboard";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/features/transactions/model/transaction-queries";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { RecentTransactionsTable } from "./recent-transactions-table";

type FilterState = {
  search: string;
  type: "" | TransactionType;
  category: string;
  startDate: string;
  endDate: string;
};

type FormState = {
  id: string | null;
  date: string;
  merchant: string;
  category: string;
  account: string;
  type: TransactionType;
  amount: string;
  status: TransactionStatus;
  memo: string;
};

const defaultFormState: FormState = {
  id: null,
  date: new Date().toISOString().slice(0, 10),
  merchant: "",
  category: "",
  account: "주거래 계좌",
  type: "expense",
  amount: "",
  status: "confirmed",
  memo: "",
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

function toPayload(form: FormState): CreateTransactionPayload {
  return {
    date: form.date,
    merchant: form.merchant,
    category: form.category,
    account: form.account,
    type: form.type,
    amount: Number(form.amount),
    status: form.status,
    memo: form.memo || undefined,
  };
}

export function TransactionManagementPanel() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [message, setMessage] = useState<string | null>(null);

  const queryParams = useMemo<TransactionListParams>(
    () => ({
      search: filters.search || undefined,
      type: filters.type || undefined,
      category: filters.category || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    }),
    [filters],
  );
  const transactionsQuery = useTransactionsQuery(queryParams);
  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();
  const deleteMutation = useDeleteTransactionMutation();
  const transactions = transactionsQuery.data ?? [];
  const error =
    transactionsQuery.error ??
    createMutation.error ??
    updateMutation.error ??
    deleteMutation.error;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  function updateFilter<K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(defaultFormState);
    setMessage(null);
  }

  function handleEdit(transaction: Transaction) {
    setForm({
      id: transaction.id,
      date: transaction.date,
      merchant: transaction.merchant,
      category: transaction.category,
      account: transaction.account,
      type: transaction.type,
      amount: String(transaction.amount),
      status: transaction.status,
      memo: "",
    });
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      if (form.id) {
        await updateMutation.mutateAsync({
          id: form.id,
          payload: toPayload(form),
        });
        setMessage("거래 내역을 수정했습니다.");
      } else {
        const result = await createMutation.mutateAsync(toPayload(form));
        setMessage(
          result.duplicateOf
            ? "거래를 저장했고 중복 의심 항목으로 표시했습니다."
            : "거래를 저장했습니다.",
        );
      }
      resetForm();
    } catch {
      setMessage(null);
    }
  }

  async function handleDelete(transaction: Transaction) {
    setMessage(null);

    try {
      await deleteMutation.mutateAsync(transaction.id);
      if (form.id === transaction.id) resetForm();
      setMessage("거래 내역을 삭제했습니다.");
    } catch {
      setMessage(null);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{form.id ? "거래 수정" : "거래 추가"}</CardTitle>
            <p className="mt-1 text-tds-6 text-muted">
              저장 후 대시보드 지표가 함께 갱신됩니다.
            </p>
          </div>
          <Plus className="h-5 w-5 text-muted" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="일자">
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) => updateForm("date", event.target.value)}
                  required
                  type="date"
                  value={form.date}
                />
              </Field>
              <Field label="유형">
                <select
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) =>
                    updateForm("type", event.target.value as TransactionType)
                  }
                  value={form.type}
                >
                  <option value="expense">지출</option>
                  <option value="income">수입</option>
                </select>
              </Field>
              <Field label="거래처">
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) =>
                    updateForm("merchant", event.target.value)
                  }
                  required
                  value={form.merchant}
                />
              </Field>
              <Field label="카테고리">
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  required
                  value={form.category}
                />
              </Field>
              <Field label="계좌">
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) => updateForm("account", event.target.value)}
                  required
                  value={form.account}
                />
              </Field>
              <Field label="금액">
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  min={1}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  required
                  type="number"
                  value={form.amount}
                />
              </Field>
              <Field label="상태">
                <select
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) =>
                    updateForm("status", event.target.value as TransactionStatus)
                  }
                  value={form.status}
                >
                  <option value="confirmed">확정</option>
                  <option value="auto-input">자동 입력</option>
                  <option value="review">검토</option>
                </select>
              </Field>
              <Field label="메모">
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
                  onChange={(event) => updateForm("memo", event.target.value)}
                  value={form.memo}
                />
              </Field>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button disabled={isSaving} type="submit">
                <Save className="h-4 w-4" aria-hidden="true" />
                {form.id ? "수정 저장" : "거래 저장"}
              </Button>
              <Button onClick={resetForm} type="button" variant="secondary">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />새 입력
              </Button>
            </div>
            {message && <p className="text-tds-6 text-muted">{message}</p>}
            {error && (
              <p className="text-tds-6 text-toss-red-600 dark:text-toss-red-300">
                {getErrorMessage(error)}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>거래 목록</CardTitle>
          <div className="mt-3 grid gap-2 md:grid-cols-5">
            <input
              className="h-10 rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary md:col-span-2"
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="검색"
              value={filters.search}
            />
            <select
              className="h-10 rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
              onChange={(event) =>
                updateFilter("type", event.target.value as FilterState["type"])
              }
              value={filters.type}
            >
              <option value="">전체 유형</option>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
            <input
              className="h-10 rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
              onChange={(event) => updateFilter("category", event.target.value)}
              placeholder="카테고리"
              value={filters.category}
            />
            <Button
              onClick={() =>
                setFilters({
                  search: "",
                  type: "",
                  category: "",
                  startDate: "",
                  endDate: "",
                })
              }
              type="button"
              variant="secondary"
            >
              초기화
            </Button>
            <input
              className="h-10 rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
              onChange={(event) => updateFilter("startDate", event.target.value)}
              type="date"
              value={filters.startDate}
            />
            <input
              className="h-10 rounded-md border border-border bg-surface px-3 text-tds-6 outline-none focus:border-primary"
              onChange={(event) => updateFilter("endDate", event.target.value)}
              type="date"
              value={filters.endDate}
            />
          </div>
        </CardHeader>
        <CardContent>
          {transactionsQuery.isLoading ? (
            <p className="rounded-lg border border-border bg-surface-muted p-4 text-tds-6 text-muted">
              거래 내역을 불러오는 중입니다.
            </p>
          ) : transactionsQuery.isError ? (
            <p className="rounded-lg border border-border bg-surface-muted p-4 text-tds-6 text-muted">
              거래 내역을 불러오지 못했습니다.
            </p>
          ) : (
            <RecentTransactionsTable
              deletingId={deleteMutation.variables ?? null}
              onDelete={handleDelete}
              onEdit={handleEdit}
              transactions={transactions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="space-y-1 text-tds-7 font-medium text-muted">
      {label}
      {children}
    </label>
  );
}
