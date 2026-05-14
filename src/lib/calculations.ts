import type { Quest } from '../types';

const CURRENCY_FORMAT = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PERCENT_FORMAT = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function calculateAnnualDividends(
  amount: number,
  yieldPercent: number
): number {
  if (
    !isFinite(amount) ||
    !isFinite(yieldPercent) ||
    amount < 0 ||
    yieldPercent < 0
  ) {
    return 0;
  }
  return (amount * yieldPercent) / 100;
}

export function calculateTwentyYearProfit(
  annualDividends: number
): number {
  if (!isFinite(annualDividends) || annualDividends < 0) return 0;
  return annualDividends * 20;
}

export function calculateTotalCapital(quests: Quest[]): number {
  return quests.reduce((sum, quest) => sum + quest.amount, 0);
}

export function calculateTotalAnnualDividends(
  quests: Quest[]
): number {
  return quests.reduce(
    (sum, quest) =>
      sum +
      calculateAnnualDividends(quest.amount, quest.dividendYield),
    0
  );
}

export function formatCurrency(amount: number): string {
  if (!isFinite(amount)) return '0,00 €';
  return CURRENCY_FORMAT.format(amount);
}

export function formatPercent(value: number): string {
  if (!isFinite(value)) return '0,00 %';
  return `${PERCENT_FORMAT.format(value)} %`;
}
