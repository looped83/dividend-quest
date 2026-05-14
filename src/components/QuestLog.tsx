import { useState, useMemo } from 'react';
import type { Quest, SortField, SortDirection } from '../types';
import {
  calculateAnnualDividends,
  formatCurrency,
  formatPercent,
} from '../lib/calculations';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface QuestLogProps {
  quests: Quest[];
}

function sortQuests(
  quests: Quest[],
  sort: SortState
): Quest[] {
  return [...quests].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'de');
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'dividendYield':
        comparison = a.dividendYield - b.dividendYield;
        break;
      case 'date':
        comparison =
          new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));
}

interface SortButtonProps {
  label: string;
  field: SortField;
  current: SortState;
  onSort: (field: SortField) => void;
}

function SortButton({ label, field, current, onSort }: SortButtonProps) {
  const isActive = current.field === field;
  const direction = isActive ? current.direction : null;
  const ariaSort = isActive
    ? direction === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`quest-log__th${isActive ? ' quest-log__th--active' : ''}`}
    >
      <button
        type="button"
        className="quest-log__sort-btn"
        onClick={() => onSort(field)}
        aria-label={`Nach ${label} sortieren${isActive ? `, aktuell ${direction === 'asc' ? 'aufsteigend' : 'absteigend'}` : ''}`}
      >
        {label}
        <span aria-hidden="true" className="quest-log__sort-icon">
          {isActive
            ? direction === 'asc'
              ? ' ↑'
              : ' ↓'
            : ' ↕'}
        </span>
      </button>
    </th>
  );
}

export function QuestLog({ quests }: QuestLogProps) {
  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'desc',
  });

  const sortedQuests = useMemo(
    () => sortQuests(quests, sort),
    [quests, sort]
  );

  function handleSort(field: SortField) {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  }

  return (
    <section
      className="card quest-log"
      aria-labelledby="quest-log-heading"
    >
      <h2 id="quest-log-heading" className="card__title">
        <span aria-hidden="true">📜</span> Quest-Log
        <span
          className="quest-log__count"
          aria-label={`${quests.length} Einträge`}
        >
          {quests.length}
        </span>
      </h2>

      {quests.length === 0 ? (
        <p className="quest-log__empty">
          Noch keine Quests – beginne jetzt deine Reise!
        </p>
      ) : (
        <div className="quest-log__scroll" role="region" aria-label="Quest-Log Tabelle" tabIndex={0}>
          <table className="quest-log__table">
            <thead>
              <tr>
                <SortButton
                  label="Name"
                  field="name"
                  current={sort}
                  onSort={handleSort}
                />
                <SortButton
                  label="Betrag"
                  field="amount"
                  current={sort}
                  onSort={handleSort}
                />
                <SortButton
                  label="Rendite"
                  field="dividendYield"
                  current={sort}
                  onSort={handleSort}
                />
                <th scope="col" className="quest-log__th">
                  Jahresertrag
                </th>
                <SortButton
                  label="Datum"
                  field="date"
                  current={sort}
                  onSort={handleSort}
                />
                <th scope="col" className="quest-log__th">
                  XP
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuests.map((quest) => (
                <tr key={quest.id} className="quest-log__row">
                  <td
                    className="quest-log__td quest-log__td--name"
                    title={quest.name}
                  >
                    {quest.name}
                  </td>
                  <td className="quest-log__td quest-log__td--number">
                    {formatCurrency(quest.amount)}
                  </td>
                  <td className="quest-log__td quest-log__td--number">
                    {formatPercent(quest.dividendYield)}
                  </td>
                  <td className="quest-log__td quest-log__td--number quest-log__td--green">
                    {formatCurrency(
                      calculateAnnualDividends(
                        quest.amount,
                        quest.dividendYield
                      )
                    )}
                  </td>
                  <td className="quest-log__td">
                    {formatDate(quest.date)}
                  </td>
                  <td className="quest-log__td quest-log__td--xp">
                    +{quest.xpGained.toLocaleString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
