import { useState } from 'react';
import type { TodoCategory, TodoPriority, TodoTask } from '../../types';
import { StatusIcon } from './StatusIcon';
import { PRIORITY_COLOR, dueColor, dueLabel } from './todoUtils';
import './TaskRow.css';

interface TaskRowProps {
  task: TodoTask;
  categories: TodoCategory[];
  today: string;
  onCycleStatus: (id: string) => void;
  onRenameTitle: (id: string, title: string) => void;
  onChangePriority: (id: string, priority: TodoPriority) => void;
  onChangeCategory: (id: string, categoryId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskRow({
  task,
  categories,
  today,
  onCycleStatus,
  onRenameTitle,
  onChangePriority,
  onChangeCategory,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const isCompleted = task.status === 'complete';

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== task.title) onRenameTitle(task.id, trimmed);
    else setTitleDraft(task.title);
    setIsEditingTitle(false);
  };

  return (
    <div className={`task-row${isCompleted ? ' task-row--completed' : ''}`}>
      <StatusIcon status={task.status} onClick={() => onCycleStatus(task.id)} />

      <div className="task-row__title-wrap">
        {isEditingTitle ? (
          <input
            type="text"
            className="task-row__title-input"
            value={titleDraft}
            autoFocus
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle();
              if (e.key === 'Escape') {
                setTitleDraft(task.title);
                setIsEditingTitle(false);
              }
            }}
          />
        ) : (
          <span
            className={`task-row__title${isCompleted ? ' task-row__title--completed' : ''}`}
            onClick={() => setIsEditingTitle(true)}
            title="Click to edit"
          >
            {task.title}
          </span>
        )}
        {task.recurring !== 'none' && (
          <span className="task-row__recurring" title="Recurring task">
            🔁
          </span>
        )}
      </div>

      <div className="task-row__controls">
        <select
          className="task-row__select"
          style={{ borderColor: PRIORITY_COLOR[task.priority], color: PRIORITY_COLOR[task.priority] }}
          value={task.priority}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChangePriority(task.id, e.target.value as TodoPriority)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          className="task-row__select task-row__select--category"
          value={task.categoryId}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChangeCategory(task.id, e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <span className="task-row__due" style={{ color: dueColor(task, today) }}>
          {dueLabel(task, today)}
        </span>

        <button type="button" className="task-row__edit" onClick={() => onEdit(task.id)}>
          Edit
        </button>
        <button
          type="button"
          className="task-row__delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          ×
        </button>
      </div>
    </div>
  );
}
