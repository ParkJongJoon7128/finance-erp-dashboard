import type { z } from "zod";

import type { loginRequestSchema, signupRequestSchema } from "@/shared/api/auth/schemas";

export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export interface AuthUser {
  id: string;
  email: string;
  /** ISO 8601 UTC string. */
  createdAt: string;
}

export interface AuthSessionResponse {
  user: AuthUser;
}

export type AuthErrorCode =
  | "VALIDATION_ERROR"
  | "EMAIL_TAKEN"
  | "WEAK_PASSWORD"
  | "INVALID_CREDENTIALS"
  | "UNAUTHENTICATED"
  | "INTERNAL_ERROR";

export interface AuthErrorDetail {
  field: string;
  reason: string;
}

export interface AuthErrorResponse {
  error: {
    code: AuthErrorCode;
    message: string;
    details?: AuthErrorDetail[];
  };
}
