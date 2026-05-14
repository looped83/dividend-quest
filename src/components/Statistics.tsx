import type { Quest } from '../types';
import {
  calculateTotalCapital,
  calculateTotalAnnualDividends,
  calculateTwentyYearProfit,
  formatCurrency,
} from '../lib/calculations';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  accent?: 'green' | 'blue' | 'gold';
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${accent ?? 'green'}`}>
      <span className="stat-card__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}

interface StatisticsProps {
  quests: Quest[];
}

export function Statistics({ quests }: StatisticsProps) {
  const totalCapital = calculateTotalCapital(quests);
  const annualDividends = calculateTotalAnnualDividends(quests);
  const twentyYearProfit = calculateTwentyYearProfit(annualDividends);

  return (
    <section
      aria-labelledby="statistics-heading"
      className="statistics"
    >
      <h2 id="statistics-heading" className="sr-only">
        Portfolio-Statistiken
      </h2>

      <div className="statistics__grid">
        <StatCard
          icon="💰"
          label="Gesamt-Kapital"
          value={formatCurrency(totalCapital)}
          accent="green"
        />
        <StatCard
          icon="📈"
          label="Jahres-Dividenden"
          value={formatCurrency(annualDividends)}
          accent="blue"
        />
        <StatCard
          icon="🏦"
          label="20-Jahre-Gewinn"
          value={formatCurrency(twentyYearProfit)}
          accent="gold"
        />
      </div>
    </section>
  );
}
