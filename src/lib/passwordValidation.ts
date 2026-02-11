/**
 * Shared password validation: 8–16 chars, letters + numbers + special characters.
 * Used for Signup, ResetPassword, and My (change password).
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 16;

export const PASSWORD_RULE_MESSAGE =
  '비밀번호는 8~16자이며 영문, 숫자, 특수문자 중 2가지 이상을 조합해야 합니다.';

const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;
const HAS_SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/'`~]/;

export interface PasswordRuleFeedback {
  lengthOk: boolean;
  lengthLabel: string;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  valid: boolean;
}

/**
 * Returns rule feedback for live UI (length, letter, number, special).
 */
export function getPasswordRuleFeedback(password: string): PasswordRuleFeedback {
  const len = password.length;
  const lengthOk = len >= PASSWORD_MIN_LENGTH && len <= PASSWORD_MAX_LENGTH;
  const lengthLabel =
    len === 0
      ? `8~16자`
      : len < PASSWORD_MIN_LENGTH
        ? `${len}/${PASSWORD_MIN_LENGTH}자`
        : len > PASSWORD_MAX_LENGTH
          ? `16자 이하`
          : `${len}자`;
  const hasLetter = HAS_LETTER.test(password);
  const hasNumber = HAS_NUMBER.test(password);
  const hasSpecial = HAS_SPECIAL.test(password);
  const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  const valid =
    lengthOk && typeCount >= 2;
  return {
    lengthOk,
    lengthLabel,
    hasLetter,
    hasNumber,
    hasSpecial,
    valid,
  };
}

/**
 * Validates password; returns error message (Korean) when invalid.
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: '비밀번호를 입력해주세요.' };
  }
  const feedback = getPasswordRuleFeedback(password);
  if (!feedback.lengthOk) {
    return { valid: false, error: PASSWORD_RULE_MESSAGE };
  }
  const typeCount = [feedback.hasLetter, feedback.hasNumber, feedback.hasSpecial].filter(
    Boolean
  ).length;
  if (typeCount < 2) {
    return { valid: false, error: PASSWORD_RULE_MESSAGE };
  }
  return { valid: true };
}

/**
 * Returns confirm-password mismatch message when not matching.
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (!confirmPassword) {
    return { valid: false, error: '' }; // no message while empty
  }
  if (password !== confirmPassword) {
    return { valid: false, error: '비밀번호가 일치하지 않습니다.' };
  }
  return { valid: true };
}
