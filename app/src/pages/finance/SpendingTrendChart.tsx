import { formatCurrency } from '../../lib/financeUtils';
import './SpendingTrendChart.css';

interface TrendMonth {
  label: string;
  total: number;
  isCurrent: boolean;
}

interface SpendingTrendChartProps {
  months: TrendMonth[];
  maxAmount: number;
}

export function SpendingTrendChart({ months, maxAmount }: SpendingTrendChartProps) {
  return (
    <div className="finance-card trend-card">
      <div className="finance-section-title trend-card__title">Spending Trend — Last 6 Months</div>
      <div className="trend-card__bars">
        {months.map((m) => (
          <div key={m.label} className="trend-bar">
            <span className="trend-bar__value">{m.total ? formatCurrency(m.total) : ''}</span>
            <div
              className={`trend-bar__fill${m.isCurrent ? ' trend-bar__fill--current' : ''}`}
              style={{ height: `${Math.max(4, (m.total / maxAmount) * 100)}px` }}
              title={formatCurrency(m.total)}
            />
            <span className={`trend-bar__label${m.isCurrent ? ' trend-bar__label--current' : ''}`}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
