import './StatCards.css';

interface StatCardsProps {
  spentMonthLabel: string;
  spentMonthTitle: string;
  showPeriodStat: boolean;
  periodStatLabel: string;
  periodStatValue: string;
}

export function StatCards({
  spentMonthLabel,
  spentMonthTitle,
  showPeriodStat,
  periodStatLabel,
  periodStatValue,
}: StatCardsProps) {
  return (
    <div className="stat-cards">
      <div className="finance-card stat-card">
        <div className="stat-card__label">{spentMonthTitle}</div>
        <div className="stat-card__value stat-card__value--accent">{spentMonthLabel}</div>
      </div>
      {showPeriodStat && (
        <div className="finance-card stat-card">
          <div className="stat-card__label">{periodStatLabel}</div>
          <div className="stat-card__value">{periodStatValue}</div>
        </div>
      )}
    </div>
  );
}
