import type { Account } from "@/entities/account/model/types";

export const mockAccounts: Account[] = [
  {
    id: "acc-shinhan-checking",
    label: "신한 입출금",
    maskedNumber: "신한 ***-**-1234",
    balanceMinor: 12_300_000,
    currency: "KRW",
  },
  {
    id: "acc-kb-savings",
    label: "국민 저축예금",
    maskedNumber: "국민 ***-**-5678",
    balanceMinor: 5_150_000,
    currency: "KRW",
  },
  {
    id: "acc-toss-checking",
    label: "토스뱅크 입출금통장",
    maskedNumber: "토스뱅크 ***-**-9012",
    balanceMinor: 1_000_000,
    currency: "KRW",
  },
];
