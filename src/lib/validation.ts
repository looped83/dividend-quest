import type { QuestFormData, FormErrors } from '../types';

const MAX_AMOUNT = 999_999;
const MAX_YIELD = 100;
const MAX_NAME_LENGTH = 50;

// Number() rejects partial parses like "12abc", parseFloat would not
function parseDecimal(value: string): number {
  return Number(value.trim().replace(',', '.'));
}

export function validateAmount(value: string): string | null {
  if (!value.trim()) {
    return 'Bitte einen Betrag eingeben';
  }
  const num = parseDecimal(value);
  if (isNaN(num)) {
    return 'Bitte eine gültige Zahl eingeben';
  }
  if (num <= 0) {
    return 'Betrag muss größer als 0 € sein';
  }
  if (num > MAX_AMOUNT) {
    return `Betrag darf ${MAX_AMOUNT.toLocaleString('de-DE')} € nicht überschreiten`;
  }
  return null;
}

export function validateDividendYield(value: string): string | null {
  if (!value.trim()) {
    return 'Bitte eine Dividendenrendite eingeben';
  }
  const num = parseDecimal(value);
  if (isNaN(num)) {
    return 'Bitte eine gültige Zahl eingeben';
  }
  if (num <= 0) {
    return 'Rendite muss größer als 0 % sein';
  }
  if (num > MAX_YIELD) {
    return 'Rendite darf 100 % nicht überschreiten';
  }
  return null;
}

export function validateQuestName(value: string): string | null {
  if (value.length > MAX_NAME_LENGTH) {
    return `Name darf maximal ${MAX_NAME_LENGTH} Zeichen lang sein`;
  }
  return null;
}

export function validateQuestForm(data: QuestFormData): FormErrors {
  const errors: FormErrors = {};

  const nameError = validateQuestName(data.name);
  if (nameError) errors.name = nameError;

  const amountError = validateAmount(data.amount);
  if (amountError) errors.amount = amountError;

  const yieldError = validateDividendYield(data.dividendYield);
  if (yieldError) errors.dividendYield = yieldError;

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function parseDecimalInput(value: string): number {
  return parseDecimal(value);
}
