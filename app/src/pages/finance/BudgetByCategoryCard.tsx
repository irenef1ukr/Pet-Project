import { categoryAccent } from '../../lib/financeUtils';
import './BudgetByCategoryCard.css';

interface BudgetRow {
  id: string;
  emoji: string;
  name: string;
  hue: number;
  pct: number;
  over: boolean;
  amountLabel: string;
}

interface BudgetByCategoryCardProps {
  rows: BudgetRow[];
  onAddBudget: () => void;
}

export function BudgetByCategoryCard({ rows, onAddBudget }: BudgetByCategoryCardProps) {
  return (
    <div className="finance-card budget-card">
      <div className="budget-card__header">
        <span className="finance-section-title">Budget by Category</span>
        <button type="button" className="finance-round-btn" onClick={onAddBudget} aria-label="Set category budget">
          +
        </button>
      </div>
      <div className="budget-card__rows">
        {rows.map((row) => (
          <div key={row.id} className="budget-row">
            <div className="budget-row__top">
              <span className="budget-row__name">
                {row.emoji} {row.name}
              </span>
              <span className={`budget-row__amount${row.over ? ' budget-row__amount--over' : ''}`}>
                {row.amountLabel}
              </span>
            </div>
            <div className="budget-row__track">
              <div
                className="budget-row__fill"
                style={{ width: `${row.pct}%`, background: row.over ? 'oklch(0.6 0.24 25)' : categoryAccent(row.hue) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
