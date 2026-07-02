import type { FinanceSummary } from '../../types';
import './FinanceCard.css';

interface FinanceCardProps {
  summary: FinanceSummary | null;
  onNavigate: () => void;
}

export function FinanceCard({ summary, onNavigate }: FinanceCardProps) {
  return (
    <div className="dash-card">
      <span
        className="section-pill finance-pill"
        onClick={onNavigate}
        role="button"
        tabIndex={0}
      >
        Finance →
      </span>

      {!summary ? (
        <div className="empty-state">
          <span className="empty-state__title">No spending logged</span>
          <span className="empty-state__hint">this month yet</span>
        </div>
      ) : (
        <>
          <div className="finance-stat">
            <span className="finance-stat__label">Spent this month</span>
            <span className="finance-stat__value finance-stat__value--month">
              ${summary.spentThisMonth}
            </span>
          </div>
          <div className="finance-stat">
            <span className="finance-stat__label">Spent yesterday</span>
            <span className="finance-stat__value finance-stat__value--yesterday">
              ${summary.spentYesterday}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
