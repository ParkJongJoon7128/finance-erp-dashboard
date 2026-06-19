export type TransactionType = "income" | "expense";

export type TransactionStatus = "confirmed" | "auto-input" | "review";

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  account: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
};

export type BudgetUsage = {
  category: string;
  used: number;
  limit: number;
};

export type DashboardMetrics = {
  income: number;
  expense: number;
  netSavings: number;
  expenseRatio: number;
  budgetUsage: number;
  transactionCount?: number;
  subscriptionTotal?: number;
};

export type DashboardSummary = {
  month: string;
  metrics: DashboardMetrics;
  categoryExpense: Record<string, number>;
  recentTransactions: Transaction[];
};

export type TransactionListParams = {
  type?: TransactionType;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type TransactionListResponse = {
  transactions: Transaction[];
};

export type ReviewCandidate = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: TransactionType;
  confidence: number;
  status: "needs-review" | "duplicate" | "approved";
};

export const dashboardMetrics = {
  income: 4820000,
  expense: 2865000,
  netSavings: 1955000,
  expenseRatio: 59,
  budgetUsage: 72,
  subscriptionTotal: 184000,
};

export const cashFlowSeries = [
  { month: "1월", income: 430, expense: 278 },
  { month: "2월", income: 452, expense: 292 },
  { month: "3월", income: 475, expense: 310 },
  { month: "4월", income: 468, expense: 284 },
  { month: "5월", income: 491, expense: 301 },
  { month: "6월", income: 482, expense: 286 },
];

export const categoryBudgets: BudgetUsage[] = [
  { category: "식비", used: 680000, limit: 820000 },
  { category: "교통", used: 218000, limit: 300000 },
  { category: "구독", used: 184000, limit: 220000 },
  { category: "쇼핑", used: 540000, limit: 500000 },
];

export const recentTransactions: Transaction[] = [
  {
    id: "tx-001",
    date: "2026-06-13",
    merchant: "급여",
    category: "근로소득",
    account: "주거래 계좌",
    type: "income",
    amount: 4200000,
    status: "confirmed",
  },
  {
    id: "tx-002",
    date: "2026-06-12",
    merchant: "이마트",
    category: "식비",
    account: "토스뱅크",
    type: "expense",
    amount: 86200,
    status: "auto-input",
  },
  {
    id: "tx-003",
    date: "2026-06-11",
    merchant: "넷플릭스",
    category: "구독",
    account: "신용카드",
    type: "expense",
    amount: 17000,
    status: "confirmed",
  },
  {
    id: "tx-004",
    date: "2026-06-10",
    merchant: "카카오택시",
    category: "교통",
    account: "체크카드",
    type: "expense",
    amount: 14200,
    status: "review",
  },
  {
    id: "tx-005",
    date: "2026-06-09",
    merchant: "쿠팡",
    category: "쇼핑",
    account: "신용카드",
    type: "expense",
    amount: 124500,
    status: "auto-input",
  },
];

export const reviewCandidates: ReviewCandidate[] = [
  {
    id: "candidate-001",
    date: "2026-06-12",
    merchant: "이마트 성수점",
    category: "식비",
    amount: 86200,
    type: "expense",
    confidence: 94,
    status: "approved",
  },
  {
    id: "candidate-002",
    date: "2026-06-11",
    merchant: "넷플릭스",
    category: "구독",
    amount: 17000,
    type: "expense",
    confidence: 88,
    status: "duplicate",
  },
  {
    id: "candidate-003",
    date: "2026-06-10",
    merchant: "카카오택시",
    category: "교통",
    amount: 14200,
    type: "expense",
    confidence: 73,
    status: "needs-review",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}
