import type { FinancePeriod } from '../../types';
import './PeriodBar.css';

interface PeriodBarProps {
  filter: FinancePeriod;
  onFilterChange: (filter: FinancePeriod) => void;
  periodLabel: string;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const FILTERS: { key: FinancePeriod; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

export function PeriodBar({ filter, onFilterChange, periodLabel, canGoNext, onPrev, onNext }: PeriodBarProps) {
  return (
    <div className="period-bar">
      <div className="period-bar__filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`period-bar__filter${filter === f.key ? ' period-bar__filter--active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="period-bar__nav">
        <button type="button" className="period-bar__arrow" onClick={onPrev} aria-label="Previous period">
          ‹
        </button>
        <span className="period-bar__label">{periodLabel}</span>
        <button
          type="button"
          className="period-bar__arrow"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Next period"
        >
          ›
        </button>
      </div>
      <div />
    </div>
  );
}
