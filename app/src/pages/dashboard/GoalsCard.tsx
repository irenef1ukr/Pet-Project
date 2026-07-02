import type { Goal } from '../../types';
import './GoalsCard.css';

interface GoalsCardProps {
  goals: Goal[];
  onNavigate: () => void;
  onAdd: () => void;
}

const VISIBLE_LIMIT = 4;

export function GoalsCard({ goals, onNavigate, onAdd }: GoalsCardProps) {
  const active = goals.filter((g) => g.active);
  const visible = active.slice(0, VISIBLE_LIMIT);
  const remaining = active.length - visible.length;

  return (
    <div className="dash-card">
      <div className="dash-card__header">
        <span
          className="section-pill goals-pill"
          onClick={onNavigate}
          role="button"
          tabIndex={0}
        >
          Active goals →
        </span>
        <button type="button" className="plus-button goals-plus" onClick={onAdd}>
          +
        </button>
      </div>

      {active.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__title">No active goals yet</span>
          <span className="empty-state__hint">tap + to set one</span>
        </div>
      ) : (
        <>
          {visible.map((g) => (
            <div key={g.id} className="goal-row">
              <div className="goal-row__labels">
                <span>{g.label}</span>
                <span>{g.percent}%</span>
              </div>
              <div className="goal-row__track">
                <div className="goal-row__fill" style={{ width: `${g.percent}%` }} />
              </div>
            </div>
          ))}
          {remaining > 0 && (
            <span className="goals-more-link" onClick={onNavigate} role="button" tabIndex={0}>
              +{remaining} more →
            </span>
          )}
        </>
      )}
    </div>
  );
}
