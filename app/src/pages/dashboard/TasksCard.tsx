import type { DashboardTask, TaskStatus } from '../../types';
import './TasksCard.css';

interface TasksCardProps {
  tasks: DashboardTask[];
  onCycleStatus: (id: string) => void;
  onNavigate: () => void;
  onAdd: () => void;
}

const STATUS_GLYPH: Record<TaskStatus, string> = {
  todo: '',
  in_progress: '',
  done: '✓',
};

function sortTasks(tasks: DashboardTask[]) {
  const rank = (t: DashboardTask) => (t.overdue && t.status !== 'done' ? 0 : 1);
  return [...tasks].sort((a, b) => rank(a) - rank(b));
}

export function TasksCard({ tasks, onCycleStatus, onNavigate, onAdd }: TasksCardProps) {
  const sorted = sortTasks(tasks);

  return (
    <div className="dash-card">
      <div className="dash-card__header">
        <span
          className="section-pill tasks-pill"
          onClick={onNavigate}
          role="button"
          tabIndex={0}
        >
          Today&apos;s tasks →
        </span>
        <button type="button" className="plus-button tasks-plus" onClick={onAdd}>
          +
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__title">🎉 Nothing due today</span>
          <span className="empty-state__hint">tap + to add a task</span>
        </div>
      ) : (
        <>
          {sorted.map((t) => (
            <div key={t.id} className="task-row">
              <button
                type="button"
                className={`task-icon task-icon--${t.status}`}
                onClick={() => onCycleStatus(t.id)}
                aria-label={`Cycle status for ${t.label}`}
              >
                {t.status === 'in_progress' ? <span className="task-icon__dot" /> : STATUS_GLYPH[t.status]}
              </button>
              <span className={`task-label${t.status === 'done' ? ' task-label--done' : ''}`}>
                {t.label}
              </span>
              {t.recurring && (
                <span className="task-recurring" title="Recurring">
                  ↻
                </span>
              )}
              {t.overdue && t.status !== 'done' && <span className="task-overdue-tag">overdue</span>}
            </div>
          ))}
          <span className="task-hint">click a status icon to cycle to-do → in progress → done</span>
        </>
      )}
    </div>
  );
}
