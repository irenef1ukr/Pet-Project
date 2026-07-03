import './HabitsCard.css';

export interface HabitView {
  id: string;
  label: string;
  done: boolean;
  streakCount: number;
}

interface HabitsCardProps {
  habits: HabitView[];
  onToggle: (id: string) => void;
  onNavigate: () => void;
  onAdd: () => void;
}

export function HabitsCard({ habits, onToggle, onNavigate, onAdd }: HabitsCardProps) {
  return (
    <div className="dash-card">
      <div className="dash-card__header">
        <span
          className="section-pill habits-pill"
          onClick={onNavigate}
          role="button"
          tabIndex={0}
        >
          Habits →
        </span>
        <button type="button" className="plus-button habits-plus" onClick={onAdd}>
          +
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__title">No habits tracked yet</span>
          <span className="empty-state__hint">tap + to start one</span>
        </div>
      ) : (
        <>
          <div className="habits-row">
            {habits.map((h) => (
              <span
                key={h.id}
                className={`habit-chip${h.done ? ' habit-chip--done' : ''}`}
                onClick={() => onToggle(h.id)}
                role="button"
                tabIndex={0}
              >
                {h.done && <span>✓</span>}
                {h.label}
                {h.streakCount > 0 && <span className="habit-chip__streak">{h.streakCount}d</span>}
              </span>
            ))}
          </div>
          <span className="habits-hint">click a habit to check it off</span>
        </>
      )}
    </div>
  );
}
