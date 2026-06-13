import "server-only";

import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import type { PublicUserAccount } from "@/entities/account/model/account";
import type { DataStore, StoredTransaction } from "./domain";

const dataDirectory = path.join(process.cwd(), ".local-data");
const dataFilePath = path.join(dataDirectory, "finance-erp-store.json");

function now() {
  return new Date().toISOString();
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return createHash("sha256").update(password).digest("hex") === storedHash;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function toPublicAccount(account: DataStore["accounts"][number]) {
  const publicAccount: PublicUserAccount = {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    settings: account.settings,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };

  return publicAccount;
}

function seedStore(): DataStore {
  const userId = "user-local-owner";
  const timestamp = now();

  return {
    accounts: [
      {
        id: userId,
        email: "admin",
        displayName: "관리자",
        passwordHash: hashPassword("admin"),
        settings: {
          currency: "KRW",
          monthlyBudget: 4000000,
        },
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    transactions: [
      {
        id: "tx-001",
        userId,
        date: "2026-06-13",
        merchant: "급여",
        category: "근로소득",
        account: "주거래 계좌",
        type: "income",
        amount: 4200000,
        status: "confirmed",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "tx-002",
        userId,
        date: "2026-06-12",
        merchant: "이마트",
        category: "식비",
        account: "토스뱅크",
        type: "expense",
        amount: 86200,
        status: "auto-input",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "tx-003",
        userId,
        date: "2026-06-11",
        merchant: "넷플릭스",
        category: "구독",
        account: "신용카드",
        type: "expense",
        amount: 17000,
        status: "confirmed",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
  };
}

async function ensureStoreFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    await writeStore(seedStore());
  }
}

export async function readStore(): Promise<DataStore> {
  await ensureStoreFile();

  const file = await readFile(dataFilePath, "utf8");
  return JSON.parse(file) as DataStore;
}

export async function writeStore(store: DataStore) {
  await mkdir(dataDirectory, { recursive: true });

  const tempPath = `${dataFilePath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(tempPath, dataFilePath);
}

export async function updateStore<T>(
  updater: (store: DataStore) => T | Promise<T>,
) {
  const store = await readStore();
  const result = await updater(store);
  await writeStore(store);
  return result;
}

export function getDefaultAccount(store: DataStore) {
  return store.accounts[0] ?? null;
}

export function nextId(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

export function isPossibleDuplicate(
  candidate: Pick<StoredTransaction, "date" | "amount" | "merchant" | "type">,
  existing: Pick<StoredTransaction, "date" | "amount" | "merchant" | "type">,
) {
  const candidateDate = new Date(candidate.date).getTime();
  const existingDate = new Date(existing.date).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const dateMatches = Math.abs(candidateDate - existingDate) <= oneDay;
  const amountMatches = candidate.amount === existing.amount;
  const typeMatches = candidate.type === existing.type;
  const merchantMatches =
    candidate.merchant.includes(existing.merchant) ||
    existing.merchant.includes(candidate.merchant);

  return [dateMatches, amountMatches, typeMatches, merchantMatches].filter(Boolean)
    .length >= 3;
}

export { now };
