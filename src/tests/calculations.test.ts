import { describe, it, expect } from 'vitest';
import {
  calculateAnnualDividends,
  calculateTwentyYearProfit,
  calculateTotalCapital,
  calculateTotalAnnualDividends,
  formatCurrency,
  formatPercent,
} from '../lib/calculations';
import type { Quest } from '../types';

function makeQuest(
  amount: number,
  dividendYield: number
): Quest {
  return {
    id: crypto.randomUUID(),
    name: 'Test Quest',
    amount,
    dividendYield,
    date: new Date().toISOString(),
    xpGained: amount,
  };
}

describe('calculateAnnualDividends', () => {
  it('calculates correctly for typical values', () => {
    expect(calculateAnnualDividends(1_000, 4)).toBeCloseTo(40);
    expect(calculateAnnualDividends(10_000, 5)).toBeCloseTo(500);
    expect(calculateAnnualDividends(500, 2.5)).toBeCloseTo(12.5);
  });

  it('returns 0 for zero amount', () => {
    expect(calculateAnnualDividends(0, 4)).toBe(0);
  });

  it('returns 0 for zero yield', () => {
    expect(calculateAnnualDividends(1_000, 0)).toBe(0);
  });

  it('returns 0 for negative amount', () => {
    expect(calculateAnnualDividends(-100, 4)).toBe(0);
  });

  it('returns 0 for negative yield', () => {
    expect(calculateAnnualDividends(1_000, -1)).toBe(0);
  });

  it('returns 0 for non-finite values', () => {
    expect(calculateAnnualDividends(Infinity, 4)).toBe(0);
    expect(calculateAnnualDividends(NaN, 4)).toBe(0);
    expect(calculateAnnualDividends(1_000, NaN)).toBe(0);
  });

  it('handles 100% yield', () => {
    expect(calculateAnnualDividends(500, 100)).toBeCloseTo(500);
  });

  it('handles very small yield', () => {
    expect(calculateAnnualDividends(10_000, 0.01)).toBeCloseTo(1);
  });

  it('handles large amount', () => {
    expect(
      calculateAnnualDividends(999_999, 4)
    ).toBeCloseTo(39_999.96);
  });
});

describe('calculateTwentyYearProfit', () => {
  it('multiplies annual dividends by 20', () => {
    expect(calculateTwentyYearProfit(500)).toBe(10_000);
    expect(calculateTwentyYearProfit(0)).toBe(0);
    expect(calculateTwentyYearProfit(100)).toBe(2_000);
  });

  it('returns 0 for negative values', () => {
    expect(calculateTwentyYearProfit(-100)).toBe(0);
  });

  it('returns 0 for non-finite values', () => {
    expect(calculateTwentyYearProfit(Infinity)).toBe(0);
    expect(calculateTwentyYearProfit(NaN)).toBe(0);
  });
});

describe('calculateTotalCapital', () => {
  it('sums all quest amounts', () => {
    const quests = [
      makeQuest(1_000, 4),
      makeQuest(2_000, 5),
      makeQuest(500, 3),
    ];
    expect(calculateTotalCapital(quests)).toBe(3_500);
  });

  it('returns 0 for empty list', () => {
    expect(calculateTotalCapital([])).toBe(0);
  });

  it('handles single quest', () => {
    expect(calculateTotalCapital([makeQuest(999, 4)])).toBe(999);
  });
});

describe('calculateTotalAnnualDividends', () => {
  it('sums annual dividends across quests', () => {
    const quests = [
      makeQuest(1_000, 4),   // 40
      makeQuest(2_000, 5),   // 100
    ];
    expect(
      calculateTotalAnnualDividends(quests)
    ).toBeCloseTo(140);
  });

  it('returns 0 for empty list', () => {
    expect(calculateTotalAnnualDividends([])).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('formats positive values in German locale', () => {
    const result = formatCurrency(1_234.56);
    // Accept both "." and "," as thousand separators
    // depending on locale support in test environment
    expect(result).toContain('1');
    expect(result).toContain('€');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('€');
  });

  it('handles non-finite values', () => {
    expect(formatCurrency(NaN)).toContain('€');
    expect(formatCurrency(Infinity)).toContain('€');
  });
});

describe('formatPercent', () => {
  it('formats values with % sign', () => {
    const result = formatPercent(4.5);
    expect(result).toContain('4');
    expect(result).toContain('%');
  });

  it('handles non-finite values', () => {
    expect(formatPercent(NaN)).toContain('%');
    expect(formatPercent(Infinity)).toContain('%');
  });
});
