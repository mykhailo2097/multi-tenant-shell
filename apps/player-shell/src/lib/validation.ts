const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_LIMITS = {
  minPasswordLength: 6,
  maxAmount: 10000,
} as const;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required.';
  if (value.length < VALIDATION_LIMITS.minPasswordLength) {
    return `Password must be at least ${VALIDATION_LIMITS.minPasswordLength} characters.`;
  }
  return null;
}

export function validateAmount(value: string): { cents: number } | { error: string } {
  const trimmed = value.trim();
  if (!trimmed) return { error: 'Amount is required.' };
  if (!/^(\d+|\d*\.\d{1,2})$/.test(trimmed)) {
    return { error: 'Enter a valid amount with at most two decimal places.' };
  }
  const amount = Number(trimmed);
  if (amount <= 0) return { error: 'Amount must be greater than zero.' };
  if (amount > VALIDATION_LIMITS.maxAmount) {
    return { error: `Amount cannot exceed ${VALIDATION_LIMITS.maxAmount.toLocaleString()}.` };
  }
  return { cents: Math.round(amount * 100) };
}

export function formatMoney(cents: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}
