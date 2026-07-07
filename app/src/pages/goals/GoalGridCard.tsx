import type { GoalListItem } from './goalListItem';
import { GOAL_STATUS_LABEL } from '../../lib/goalUtils';
import './GoalGridCard.css';

interface GoalGridCardProps {
  item: GoalListItem;
  onOpen: () => void;
}

export function GoalGridCard({ item, onOpen }: GoalGridCardProps) {
  return (
    <div className="goal-grid-card" onClick={onOpen} role="button" tabIndex={0}>
      <div className="goal-grid-card__top">
        <span className="goal-grid-card__title">{item.title}</span>
        <span className={`goal-status-badge goal-status-badge--${item.status}`}>
          {GOAL_STATUS_LABEL[item.status]}
        </span>
      </div>
      <div className="goal-progress-track">
        <div className="goal-progress-fill" style={{ width: `${item.percent}%` }} />
      </div>
      <div className="goal-grid-card__meta">
        <span>{item.percent}%</span>
        <span>{item.dueLabel}</span>
      </div>
      {(item.hasJournalLinks || item.hasTasks) && (
        <div className="goal-grid-card__links">
          {item.hasJournalLinks && (
            <span className="goal-grid-card__link goal-grid-card__link--journal">
              📔 {item.journalCountLabel}
            </span>
          )}
          {item.hasTasks && (
            <span className="goal-grid-card__link goal-grid-card__link--tasks">✅ {item.taskCountLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
