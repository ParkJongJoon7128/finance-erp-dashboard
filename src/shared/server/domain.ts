import type { UserAccount } from "@/entities/account/model/account";
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/entities/finance/model/dashboard";

export type StoredTransaction = Transaction & {
  userId: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionInput = {
  date: string;
  merchant: string;
  category: string;
  account: string;
  type: TransactionType;
  amount: number;
  status?: TransactionStatus;
  memo?: string;
};

export type UpdateTransactionInput = Partial<CreateTransactionInput>;

export type DataStore = {
  accounts: UserAccount[];
  transactions: StoredTransaction[];
};

