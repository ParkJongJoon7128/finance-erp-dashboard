import type {
  CreateAccountPayload,
  LoginPayload,
  UpdateAccountPayload,
} from "@/entities/account/model/account";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "./domain";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; fields: Record<string, string> };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginIdPattern = /^[a-z0-9._-]{3,40}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const transactionTypes = new Set(["income", "expense"]);
const transactionStatuses = new Set(["confirmed", "auto-input", "review"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function positiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isValidLoginId(value: string) {
  return emailPattern.test(value) || loginIdPattern.test(value);
}

export function validateCreateAccount(
  body: unknown,
): ValidationResult<CreateAccountPayload> {
  const fields: Record<string, string> = {};

  if (!isRecord(body)) {
    return { ok: false, fields: { body: "JSON object is required." } };
  }

  const email = text(body.email).toLowerCase();
  const displayName = text(body.displayName);
  const password = text(body.password);

  if (!isValidLoginId(email)) {
    fields.email = "Valid email or login ID is required.";
  }
  if (displayName.length < 2) {
    fields.displayName = "Display name must be at least 2 characters.";
  }
  if (password.length < 4) {
    fields.password = "Password must be at least 4 characters.";
  }

  const settings = isRecord(body.settings) ? body.settings : undefined;
  const monthlyBudget = settings?.monthlyBudget;
  if (monthlyBudget !== undefined && !positiveNumber(monthlyBudget)) {
    fields["settings.monthlyBudget"] = "Monthly budget must be positive.";
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  return {
    ok: true,
    value: {
      email,
      displayName,
      password,
      settings: {
        currency: settings?.currency === "USD" ? "USD" : "KRW",
        monthlyBudget:
          typeof monthlyBudget === "number" ? monthlyBudget : 4000000,
      },
    },
  };
}

export function validateUpdateAccount(
  body: unknown,
): ValidationResult<UpdateAccountPayload> {
  const fields: Record<string, string> = {};

  if (!isRecord(body)) {
    return { ok: false, fields: { body: "JSON object is required." } };
  }

  const payload: UpdateAccountPayload = {};

  if ("email" in body) {
    const email = text(body.email).toLowerCase();
    if (!isValidLoginId(email)) {
      fields.email = "Valid email or login ID is required.";
    }
    payload.email = email;
  }

  if ("displayName" in body) {
    const displayName = text(body.displayName);
    if (displayName.length < 2) {
      fields.displayName = "Display name must be at least 2 characters.";
    }
    payload.displayName = displayName;
  }

  if ("password" in body) {
    const password = text(body.password);
    if (password.length < 4) {
      fields.password = "Password must be at least 4 characters.";
    }
    payload.password = password;
  }

  if ("settings" in body) {
    if (!isRecord(body.settings)) {
      fields.settings = "Settings must be an object.";
    } else {
      const settings: UpdateAccountPayload["settings"] = {};
      if ("currency" in body.settings) {
        if (body.settings.currency !== "KRW" && body.settings.currency !== "USD") {
          fields["settings.currency"] = "Currency must be KRW or USD.";
        } else {
          settings.currency = body.settings.currency;
        }
      }
      if ("monthlyBudget" in body.settings) {
        if (!positiveNumber(body.settings.monthlyBudget)) {
          fields["settings.monthlyBudget"] = "Monthly budget must be positive.";
        } else {
          settings.monthlyBudget = body.settings.monthlyBudget;
        }
      }
      payload.settings = settings;
    }
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: payload };
}

export function validateLogin(body: unknown): ValidationResult<LoginPayload> {
  if (!isRecord(body)) {
    return { ok: false, fields: { body: "JSON object is required." } };
  }

  const email = text(body.email).toLowerCase();
  const password = text(body.password);
  const fields: Record<string, string> = {};

  if (!isValidLoginId(email)) {
    fields.email = "Valid email or login ID is required.";
  }
  if (!password) fields.password = "Password is required.";

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: { email, password } };
}

export function validateCreateTransaction(
  body: unknown,
): ValidationResult<CreateTransactionInput> {
  const fields: Record<string, string> = {};

  if (!isRecord(body)) {
    return { ok: false, fields: { body: "JSON object is required." } };
  }

  const date = text(body.date);
  const merchant = text(body.merchant);
  const category = text(body.category);
  const account = text(body.account);
  const type = text(body.type);
  const status = text(body.status);

  if (!datePattern.test(date)) fields.date = "Date must be YYYY-MM-DD.";
  if (!merchant) fields.merchant = "Merchant is required.";
  if (!category) fields.category = "Category is required.";
  if (!account) fields.account = "Account is required.";
  if (!transactionTypes.has(type)) fields.type = "Type must be income or expense.";
  if (!positiveNumber(body.amount)) fields.amount = "Amount must be positive.";
  if (status && !transactionStatuses.has(status)) {
    fields.status = "Status is invalid.";
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  return {
    ok: true,
    value: {
      date,
      merchant,
      category,
      account,
      type: type as CreateTransactionInput["type"],
      amount: body.amount as number,
      status: (status || "confirmed") as CreateTransactionInput["status"],
      memo: text(body.memo) || undefined,
    },
  };
}

export function validateUpdateTransaction(
  body: unknown,
): ValidationResult<UpdateTransactionInput> {
  if (!isRecord(body)) {
    return { ok: false, fields: { body: "JSON object is required." } };
  }

  const fields: Record<string, string> = {};
  const payload: UpdateTransactionInput = {};

  if ("date" in body) {
    const date = text(body.date);
    if (!datePattern.test(date)) fields.date = "Date must be YYYY-MM-DD.";
    payload.date = date;
  }
  if ("merchant" in body) {
    const merchant = text(body.merchant);
    if (!merchant) fields.merchant = "Merchant is required.";
    payload.merchant = merchant;
  }
  if ("category" in body) {
    const category = text(body.category);
    if (!category) fields.category = "Category is required.";
    payload.category = category;
  }
  if ("account" in body) {
    const account = text(body.account);
    if (!account) fields.account = "Account is required.";
    payload.account = account;
  }
  if ("type" in body) {
    const type = text(body.type);
    if (!transactionTypes.has(type)) fields.type = "Type must be income or expense.";
    payload.type = type as UpdateTransactionInput["type"];
  }
  if ("amount" in body) {
    if (!positiveNumber(body.amount)) fields.amount = "Amount must be positive.";
    payload.amount = body.amount as number;
  }
  if ("status" in body) {
    const status = text(body.status);
    if (!transactionStatuses.has(status)) fields.status = "Status is invalid.";
    payload.status = status as UpdateTransactionInput["status"];
  }
  if ("memo" in body) {
    payload.memo = text(body.memo) || undefined;
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: payload };
}
