import type { StoredTransaction } from "./domain";

function sameMonth(date: string, month: string) {
  return date.startsWith(month);
}

export function buildDashboardSummary(
  transactions: StoredTransaction[],
  monthlyBudget: number,
  month = new Date().toISOString().slice(0, 7),
) {
  const monthTransactions = transactions.filter((transaction) =>
    sameMonth(transaction.date, month),
  );
  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const netSavings = income - expense;
  const expenseRatio = income > 0 ? Math.round((expense / income) * 100) : 0;
  const budgetUsage =
    monthlyBudget > 0 ? Math.round((expense / monthlyBudget) * 100) : 0;
  const categoryExpense = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((categories, transaction) => {
      categories[transaction.category] =
        (categories[transaction.category] ?? 0) + transaction.amount;
      return categories;
    }, {});

  return {
    month,
    metrics: {
      income,
      expense,
      netSavings,
      expenseRatio,
      budgetUsage,
      transactionCount: monthTransactions.length,
    },
    categoryExpense,
    recentTransactions: [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10),
  };
}

