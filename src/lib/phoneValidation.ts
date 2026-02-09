/**
 * Phone validation aligned with backend: Korean mobile format 010 + exactly 8 digits.
 * Backend pattern: /^010\d{8}$/
 */

export const PHONE_REGEX = /^010\d{8}$/;

/** User-facing error message (Korean) instead of raw regex. */
export const PHONE_ERROR_MESSAGE =
  '010으로 시작하는 11자리 휴대폰 번호를 입력해주세요. (숫자만 입력)';

/**
 * Strips all non-digit characters. Use for display/store so no spaces, dashes, or other chars.
 */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validates phone against backend rule: 010 + exactly 8 digits (11 digits total).
 * Use normalized (digits-only) value.
 */
export function validatePhone(value: string): { valid: boolean; error?: string } {
  const digits = normalizePhone(value);
  if (!digits) {
    return { valid: false, error: '휴대폰 번호를 입력해주세요.' };
  }
  if (!PHONE_REGEX.test(digits)) {
    return { valid: false, error: PHONE_ERROR_MESSAGE };
  }
  return { valid: true };
}

/**
 * Restricts input to digits only and max 11 characters (010 + 8 digits).
 * Use in onChange to keep field digits-only.
 */
export function formatPhoneInput(value: string): string {
  const digits = normalizePhone(value).slice(0, 11);
  return digits;
}
