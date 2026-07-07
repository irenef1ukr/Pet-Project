import type { GoalListItem } from './goalListItem';
import { GOAL_STATUS_LABEL } from '../../lib/goalUtils';
import './GoalListRow.css';

interface GoalListRowProps {
  item: GoalListItem;
  onOpen: () => void;
}

export function GoalListRow({ item, onOpen }: GoalListRowProps) {
  return (
    <div className="goal-list-row" onClick={onOpen} role="button" tabIndex={0}>
      <div className="goal-list-row__main">
        <div className="goal-list-row__top">
          <span className="goal-list-row__title">{item.title}</span>
          <span className={`goal-status-badge goal-status-badge--${item.status}`}>
            {GOAL_STATUS_LABEL[item.status]}
          </span>
        </div>
        <div className="goal-progress-track goal-list-row__track">
          <div className="goal-progress-fill" style={{ width: `${item.percent}%` }} />
        </div>
      </div>
      <span className="goal-list-row__percent">{item.percent}%</span>
      <span className="goal-list-row__due">{item.dueLabel}</span>
    </div>
  );
}
