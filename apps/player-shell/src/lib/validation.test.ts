import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateAmount, formatMoney } from './validation';

describe('validateEmail', () => {
  it('requires a value', () => {
    expect(validateEmail('   ')).toMatch(/required/i);
  });
  it('rejects malformed addresses', () => {
    expect(validateEmail('nope')).toMatch(/valid/i);
    expect(validateEmail('a@b')).toMatch(/valid/i);
  });
  it('accepts a valid address', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('requires a value', () => {
    expect(validatePassword('')).toMatch(/required/i);
  });
  it('enforces the minimum length', () => {
    expect(validatePassword('123')).toMatch(/at least 6/i);
  });
  it('accepts a long-enough password', () => {
    expect(validatePassword('secret1')).toBeNull();
  });
});

describe('validateAmount', () => {
  it('rejects empty / non-numeric / non-positive input', () => {
    expect(validateAmount('')).toHaveProperty('error');
    expect(validateAmount('abc')).toHaveProperty('error');
    expect(validateAmount('0')).toHaveProperty('error');
    expect(validateAmount('-5')).toHaveProperty('error');
  });
  it('rejects amounts over the max', () => {
    expect(validateAmount('100000')).toHaveProperty('error');
  });
  it('rejects more than two decimal places', () => {
    expect(validateAmount('1.999')).toHaveProperty('error');
  });
  it('rejects non-decimal numeric forms (scientific / hex)', () => {
    expect(validateAmount('1e3')).toHaveProperty('error');
    expect(validateAmount('0x10')).toHaveProperty('error');
  });
  it('parses a valid amount into cents', () => {
    expect(validateAmount('12.34')).toEqual({ cents: 1234 });
    expect(validateAmount('  5 ')).toEqual({ cents: 500 });
  });
  // Regression: floating-point `amount * 100` used to falsely reject these.
  it('accepts 2-decimal amounts that are not float-exact', () => {
    expect(validateAmount('19.99')).toEqual({ cents: 1999 });
    expect(validateAmount('1.10')).toEqual({ cents: 110 });
    expect(validateAmount('2.30')).toEqual({ cents: 230 });
  });
  it('accepts leading-dot amounts but rejects a lone/trailing dot', () => {
    expect(validateAmount('.5')).toEqual({ cents: 50 });
    expect(validateAmount('.05')).toEqual({ cents: 5 });
    expect(validateAmount('.')).toHaveProperty('error');
    expect(validateAmount('5.')).toHaveProperty('error');
  });
});

describe('formatMoney', () => {
  it('formats cents using locale + currency', () => {
    expect(formatMoney(4999, 'en-US', 'USD')).toBe('$49.99');
  });
});
