import { useState, useRef, type FormEvent } from 'react';
import type { QuestFormData, FormErrors } from '../types';
import {
  validateQuestForm,
  hasErrors,
  parseDecimalInput,
} from '../lib/validation';

interface QuestFormProps {
  onSubmit: (
    name: string,
    amount: number,
    dividendYield: number
  ) => { xpGained: number };
}

const EMPTY_FORM: QuestFormData = {
  name: '',
  amount: '',
  dividendYield: '',
};

export function QuestForm({ onSubmit }: QuestFormProps) {
  const [formData, setFormData] = useState<QuestFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const firstErrorRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    field: keyof QuestFormData,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validateQuestForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      // Focus the first invalid field for accessibility
      setTimeout(() => firstErrorRef.current?.focus(), 0);
      return;
    }

    const amount = parseDecimalInput(formData.amount);
    const dividendYield = parseDecimalInput(formData.dividendYield);
    const result = onSubmit(formData.name, amount, dividendYield);

    setFormData(EMPTY_FORM);
    setErrors({});

    const message = `+${result.xpGained.toLocaleString('de-DE')} XP erhalten!`;
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }

  const amountError = errors.amount;
  const yieldError = errors.dividendYield;
  const nameError = errors.name;
  const firstErrorField = amountError
    ? 'amount'
    : yieldError
      ? 'dividendYield'
      : null;

  return (
    <section
      className="card quest-form"
      aria-labelledby="quest-form-heading"
    >
      <h2 id="quest-form-heading" className="card__title">
        <span aria-hidden="true">⚔️</span> Neue Quest
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="quest-name" className="form-label">
            Quest-Name{' '}
            <span className="form-label__optional">(optional)</span>
          </label>
          <input
            type="text"
            id="quest-name"
            className="form-input"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="z. B. MacBook Pro vermieden..."
            maxLength={50}
            aria-describedby={
              nameError ? 'quest-name-error' : undefined
            }
            aria-invalid={nameError ? 'true' : undefined}
          />
          {nameError && (
            <p
              id="quest-name-error"
              className="form-error"
              role="alert"
            >
              {nameError}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quest-amount" className="form-label">
              Kaufbetrag (€){' '}
              <span aria-hidden="true" className="form-label__required">
                *
              </span>
            </label>
            <input
              type="text"
              id="quest-amount"
              className={`form-input${amountError ? ' form-input--error' : ''}`}
              value={formData.amount}
              onChange={(e) =>
                handleChange('amount', e.target.value)
              }
              placeholder="z. B. 1200"
              inputMode="decimal"
              required
              aria-required="true"
              aria-describedby={
                amountError ? 'quest-amount-error' : undefined
              }
              aria-invalid={amountError ? 'true' : undefined}
              ref={
                firstErrorField === 'amount' ? firstErrorRef : null
              }
            />
            {amountError && (
              <p
                id="quest-amount-error"
                className="form-error"
                role="alert"
              >
                {amountError}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="quest-yield" className="form-label">
              Dividendenrendite (%){' '}
              <span aria-hidden="true" className="form-label__required">
                *
              </span>
            </label>
            <input
              type="text"
              id="quest-yield"
              className={`form-input${yieldError ? ' form-input--error' : ''}`}
              value={formData.dividendYield}
              onChange={(e) =>
                handleChange('dividendYield', e.target.value)
              }
              placeholder="z. B. 4,5"
              inputMode="decimal"
              required
              aria-required="true"
              aria-describedby={
                yieldError ? 'quest-yield-error' : undefined
              }
              aria-invalid={yieldError ? 'true' : undefined}
              ref={
                firstErrorField === 'dividendYield'
                  ? firstErrorRef
                  : null
              }
            />
            {yieldError && (
              <p
                id="quest-yield-error"
                className="form-error"
                role="alert"
              >
                {yieldError}
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Quest starten
        </button>
      </form>

      {toast && (
        <div
          className="toast toast--success"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span aria-hidden="true">✨</span> {toast}
        </div>
      )}
    </section>
  );
}
