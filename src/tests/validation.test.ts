import { describe, it, expect } from 'vitest';
import {
  validateAmount,
  validateDividendYield,
  validateQuestName,
  validateQuestForm,
  hasErrors,
  parseDecimalInput,
} from '../lib/validation';

describe('validateAmount', () => {
  it('returns null for valid amounts', () => {
    expect(validateAmount('100')).toBeNull();
    expect(validateAmount('1200')).toBeNull();
    expect(validateAmount('0.01')).toBeNull();
    expect(validateAmount('0,01')).toBeNull();
    expect(validateAmount('999999')).toBeNull();
    expect(validateAmount('  500  ')).toBeNull();
  });

  it('returns error for empty input', () => {
    expect(validateAmount('')).not.toBeNull();
    expect(validateAmount('  ')).not.toBeNull();
  });

  it('returns error for non-numeric input', () => {
    expect(validateAmount('abc')).not.toBeNull();
    expect(validateAmount('12abc')).not.toBeNull();
    expect(validateAmount('--5')).not.toBeNull();
  });

  it('returns error for zero', () => {
    expect(validateAmount('0')).not.toBeNull();
  });

  it('returns error for negative amounts', () => {
    expect(validateAmount('-1')).not.toBeNull();
    expect(validateAmount('-100')).not.toBeNull();
  });

  it('returns error for amounts exceeding 999999', () => {
    expect(validateAmount('1000000')).not.toBeNull();
    expect(validateAmount('9999999')).not.toBeNull();
  });

  it('accepts exactly 999999', () => {
    expect(validateAmount('999999')).toBeNull();
  });

  it('accepts comma as decimal separator', () => {
    expect(validateAmount('1200,50')).toBeNull();
    expect(validateAmount('0,5')).toBeNull();
  });
});

describe('validateDividendYield', () => {
  it('returns null for valid yields', () => {
    expect(validateDividendYield('4')).toBeNull();
    expect(validateDividendYield('4.5')).toBeNull();
    expect(validateDividendYield('4,5')).toBeNull();
    expect(validateDividendYield('0.01')).toBeNull();
    expect(validateDividendYield('100')).toBeNull();
  });

  it('returns error for empty input', () => {
    expect(validateDividendYield('')).not.toBeNull();
    expect(validateDividendYield('   ')).not.toBeNull();
  });

  it('returns error for non-numeric input', () => {
    expect(validateDividendYield('abc')).not.toBeNull();
  });

  it('returns error for zero', () => {
    expect(validateDividendYield('0')).not.toBeNull();
  });

  it('returns error for negative values', () => {
    expect(validateDividendYield('-1')).not.toBeNull();
  });

  it('returns error for values above 100', () => {
    expect(validateDividendYield('101')).not.toBeNull();
    expect(validateDividendYield('200')).not.toBeNull();
  });

  it('accepts exactly 100', () => {
    expect(validateDividendYield('100')).toBeNull();
  });
});

describe('validateQuestName', () => {
  it('returns null for empty name (optional field)', () => {
    expect(validateQuestName('')).toBeNull();
  });

  it('returns null for valid names', () => {
    expect(validateQuestName('MacBook Pro')).toBeNull();
    expect(validateQuestName('A'.repeat(50))).toBeNull();
  });

  it('returns error for names exceeding 50 characters', () => {
    expect(validateQuestName('A'.repeat(51))).not.toBeNull();
    expect(validateQuestName('A'.repeat(100))).not.toBeNull();
  });
});

describe('validateQuestForm', () => {
  it('returns empty object for valid form data', () => {
    const errors = validateQuestForm({
      name: 'Test Quest',
      amount: '1200',
      dividendYield: '4.5',
    });
    expect(hasErrors(errors)).toBe(false);
  });

  it('returns errors for all invalid fields', () => {
    const errors = validateQuestForm({
      name: 'A'.repeat(51),
      amount: '',
      dividendYield: '',
    });
    expect(errors.name).toBeDefined();
    expect(errors.amount).toBeDefined();
    expect(errors.dividendYield).toBeDefined();
  });

  it('returns only amount error when only amount is invalid', () => {
    const errors = validateQuestForm({
      name: '',
      amount: '-5',
      dividendYield: '4',
    });
    expect(errors.amount).toBeDefined();
    expect(errors.dividendYield).toBeUndefined();
    expect(errors.name).toBeUndefined();
  });

  it('accepts empty name (optional)', () => {
    const errors = validateQuestForm({
      name: '',
      amount: '100',
      dividendYield: '4',
    });
    expect(errors.name).toBeUndefined();
    expect(hasErrors(errors)).toBe(false);
  });
});

describe('hasErrors', () => {
  it('returns false for empty errors object', () => {
    expect(hasErrors({})).toBe(false);
  });

  it('returns true when errors exist', () => {
    expect(hasErrors({ amount: 'Fehler' })).toBe(true);
    expect(hasErrors({ amount: 'a', dividendYield: 'b' })).toBe(
      true
    );
  });
});

describe('parseDecimalInput', () => {
  it('parses integers', () => {
    expect(parseDecimalInput('100')).toBe(100);
    expect(parseDecimalInput('0')).toBe(0);
  });

  it('parses dot-decimal numbers', () => {
    expect(parseDecimalInput('4.5')).toBeCloseTo(4.5);
    expect(parseDecimalInput('1200.99')).toBeCloseTo(1200.99);
  });

  it('parses comma-decimal numbers', () => {
    expect(parseDecimalInput('4,5')).toBeCloseTo(4.5);
    expect(parseDecimalInput('1.200,50')).toBeNaN();
  });

  it('trims whitespace', () => {
    expect(parseDecimalInput('  100  ')).toBe(100);
  });

  it('returns NaN for non-numeric strings', () => {
    expect(parseDecimalInput('abc')).toBeNaN();
  });
});
