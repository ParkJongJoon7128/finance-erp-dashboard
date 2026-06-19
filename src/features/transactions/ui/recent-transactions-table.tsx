import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import {
  formatCurrency,
  type Transaction,
} from "@/entities/finance/model/dashboard";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
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
  deletingId,
  onDelete,
  onEdit,
  transactions,
}: {
  deletingId?: string | null;
  onDelete?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  transactions: Transaction[];
}) {
  const hasActions = Boolean(onDelete || onEdit);

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
          {hasActions && <TableHead className="text-right">관리</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
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
              {hasActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(transaction)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        수정
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        disabled={deletingId === transaction.id}
                        onClick={() => onDelete(transaction)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              className="py-6 text-center text-muted"
              colSpan={hasActions ? 7 : 6}
            >
              표시할 거래 내역이 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
