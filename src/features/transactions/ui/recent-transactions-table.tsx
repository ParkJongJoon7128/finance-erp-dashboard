import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import {
  formatCurrency,
  type Transaction,
} from "@/entities/finance/model/dashboard";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

const statusLabels: Record<Transaction["status"], string> = {
  confirmed: "확정",
  "auto-input": "자동 입력",
  review: "검토",
};

export function RecentTransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>일자</TableHead>
          <TableHead>거래처</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>계좌</TableHead>
          <TableHead className="text-right">금액</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="text-muted">
              {transaction.date}
            </TableCell>
            <TableCell>
              <div className="flex min-w-44 items-center gap-2 font-medium">
                {transaction.type === "income" ? (
                  <ArrowDownLeft
                    className="h-4 w-4 text-toss-green-600 dark:text-toss-green-300"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowUpRight
                    className="h-4 w-4 text-toss-red-600 dark:text-toss-red-300"
                    aria-hidden="true"
                  />
                )}
                <span className="truncate">{transaction.merchant}</span>
              </div>
            </TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell className="text-muted">
              {transaction.account}
            </TableCell>
            <TableCell
              className={
                transaction.type === "income"
                  ? "text-right font-semibold text-toss-green-600 dark:text-toss-green-300"
                  : "text-right font-semibold text-foreground"
              }
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  transaction.status === "review"
                    ? "warning"
                    : transaction.status === "auto-input"
                      ? "info"
                      : "success"
                }
              >
                {statusLabels[transaction.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
