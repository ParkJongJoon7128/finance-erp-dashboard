export interface Account {
  id: string;
  label: string;
  /** 계좌번호 전체가 아닌 마스킹된 값만 다룬다. */
  maskedNumber: string;
  balanceMinor: number;
  currency: string;
}
