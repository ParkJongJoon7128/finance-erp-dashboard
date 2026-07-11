import { z } from "zod";

/**
 * Normalizes email input (trim + lowercase) before format validation so that
 * storage and comparison always use a canonical form.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "Invalid email format." }));

/**
 * Shape-level validation only (1-128 chars). Business-level password strength
 * (8-128 chars, letters + digits) is enforced separately so that a shape
 * violation (400 VALIDATION_ERROR) can be distinguished from a policy
 * violation (422 WEAK_PASSWORD).
 */
export const passwordSchema = z.string().min(1).max(128);

export const signupRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const MIN_STRONG_PASSWORD_LENGTH = 8;
const HAS_LETTER = /[A-Za-z]/;
const HAS_DIGIT = /[0-9]/;

/**
 * Password strength policy: 8-128 characters, containing at least one letter
 * and one digit. Length upper bound (128) is already guaranteed by
 * `passwordSchema` before this runs.
 */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MIN_STRONG_PASSWORD_LENGTH &&
    HAS_LETTER.test(password) &&
    HAS_DIGIT.test(password)
  );
}
