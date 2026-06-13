export type CurrencyCode = "KRW" | "USD";

export type AccountSettings = {
  currency: CurrencyCode;
  monthlyBudget: number;
};

export type UserAccount = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  settings: AccountSettings;
  createdAt: string;
  updatedAt: string;
};

export type PublicUserAccount = Omit<UserAccount, "passwordHash">;

export type CreateAccountPayload = {
  email: string;
  displayName: string;
  password: string;
  settings?: Partial<AccountSettings>;
};

export type UpdateAccountPayload = Partial<{
  email: string;
  displayName: string;
  password: string;
  settings: Partial<AccountSettings>;
}>;

export type LoginPayload = {
  email: string;
  password: string;
};

