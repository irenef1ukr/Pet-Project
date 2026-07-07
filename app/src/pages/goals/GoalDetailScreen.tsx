import { useState } from 'react';
import type { Goal, GoalCategory, GoalTaskDraft, JournalEntry, TodoPriority, TodoTask } from '../../types';
import { StatusIcon } from '../todo/StatusIcon';
import { PRIORITY_COLOR, formatShortDate } from '../../lib/todoUtils';
import { entryPreview } from '../../lib/journalUtils';
import { GOAL_STATUS_LABEL, goalDueLabel } from '../../lib/goalUtils';
import './GoalDetailScreen.css';

const EMPTY_NEW_TASK: GoalTaskDraft = { title: '', priority: 'Medium', dueDate: '' };

interface GoalDetailScreenProps {
  goal: Goal;
  category: GoalCategory | undefined;
  linkedTasks: TodoTask[];
  linkedJournalEntries: JournalEntry[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCycleTaskStatus: (id: string) => void;
  onUnlinkTask: (id: string) => void;
  onAddTask: (draft: GoalTaskDraft) => void;
  onOpenJournal: () => void;
}

export function GoalDetailScreen({
  goal,
  category,
  linkedTasks,
  linkedJournalEntries,
  onBack,
  onEdit,
  onDelete,
  onCycleTaskStatus,
  onUnlinkTask,
  onAddTask,
  onOpenJournal,
}: GoalDetailScreenProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [newTask, setNewTask] = useState<GoalTaskDraft>(EMPTY_NEW_TASK);

  const handleAddTask = () => {
    const title = newTask.title.trim();
    if (!title) return;
    onAddTask({ ...newTask, title });
    setNewTask(EMPTY_NEW_TASK);
  };

  return (
    <div className="goal-detail-screen">
      <div className="goal-detail-screen__inner">
        <span className="goal-detail-screen__back" onClick={onBack} role="button" tabIndex={0}>
          ‹ Back
        </span>

        <div className="goal-detail-card">
          <div className="goal-detail-card__header">
            <span className="goal-detail-card__title">{goal.title}</span>
            <span className={`goal-status-badge goal-status-badge--${goal.status}`}>
              {GOAL_STATUS_LABEL[goal.status]}
            </span>
          </div>
          {category && (
            <span className="goal-detail-card__category">
              {category.emoji} {category.name}
            </span>
          )}
          <div className="goal-progress-track goal-detail-card__progress-track">
            <div className="goal-progress-fill" style={{ width: `${goal.percent}%` }} />
          </div>
          <div className="goal-detail-card__progress-labels">
            <span>{goal.percent}% complete</span>
            <span>{goalDueLabel(goal)}</span>
          </div>
          {goal.description && <div className="goal-detail-card__description">{goal.description}</div>}

          <div className="goal-detail-card__footer">
            {confirmingDelete ? (
              <>
                <span className="goal-detail-card__delete-confirm">Delete this goal?</span>
                <div className="goal-detail-card__delete-actions">
                  <button type="button" className="goal-detail-card__link-btn goal-detail-card__link-btn--danger" onClick={onDelete}>
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="goal-detail-card__link-btn goal-detail-card__link-btn--muted"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="button" className="goal-detail-card__delete" onClick={() => setConfirmingDelete(true)}>
                  Delete
                </button>
                <button type="button" className="goal-detail-card__edit" onClick={onEdit}>
                  Edit Goal
                </button>
              </>
            )}
          </div>
        </div>

        <div className="goal-detail-section">
          <span className="goal-detail-section__title">📔 Linked Journal Entries</span>
          {linkedJournalEntries.length === 0 ? (
            <span className="goal-detail-section__empty">
              No journal entries linked yet — link this goal next time you write an entry.
            </span>
          ) : (
            linkedJournalEntries.map((entry) => (
              <div key={entry.id} className="goal-journal-entry" onClick={onOpenJournal} role="button" tabIndex={0}>
                <span className="goal-journal-entry__date">{formatShortDate(entry.date)}</span> —{' '}
                {entryPreview(entry)}
              </div>
            ))
          )}
        </div>

        <div className="goal-detail-section">
          <span className="goal-detail-section__title">✅ Tasks for this Goal</span>
          {linkedTasks.length === 0 ? (
            <span className="goal-detail-section__empty">
              No tasks yet — add one below and it will also show up in To-Do.
            </span>
          ) : (
            linkedTasks.map((task) => (
              <div key={task.id} className="goal-task-row">
                <StatusIcon status={task.status} onClick={() => onCycleTaskStatus(task.id)} />
                <span
                  className={`goal-task-row__title${task.status === 'complete' ? ' goal-task-row__title--completed' : ''}`}
                >
                  {task.title}
                </span>
                <span className="goal-task-row__priority" style={{ color: PRIORITY_COLOR[task.priority] }}>
                  {task.priority}
                </span>
                <span className="goal-task-row__due">
                  {task.dueDate ? formatShortDate(task.dueDate) : 'No due date'}
                </span>
                <button
                  type="button"
                  className="goal-task-row__unlink"
                  onClick={() => onUnlinkTask(task.id)}
                  aria-label={`Remove ${task.title} from this goal`}
                >
                  ×
                </button>
              </div>
            ))
          )}

          <div className="goal-add-task">
            <input
              type="text"
              placeholder="New task title"
              value={newTask.title}
              onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask((t) => ({ ...t, priority: e.target.value as TodoPriority }))}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask((t) => ({ ...t, dueDate: e.target.value }))}
            />
            <button type="button" className="goal-add-task__btn" onClick={handleAddTask}>
              + Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
