import { useState } from 'react';
import type { TaskEditPatch, TodoCategory, TodoPriority, TodoRecurrence, TodoTask } from '../../types';
import { StatusPicker } from './StatusPicker';
import { SubtasksEditor } from './SubtasksEditor';
import { PRIORITY_COLOR, generateId } from '../../lib/todoUtils';
import '../../components/modal-shared.css';
import './TaskDetailModal.css';

interface TaskDetailModalProps {
  task: TodoTask;
  categories: TodoCategory[];
  onSave: (id: string, patch: TaskEditPatch) => void;
  onClose: () => void;
}

export function TaskDetailModal({ task, categories, onSave, onClose }: TaskDetailModalProps) {
  const [draft, setDraft] = useState<TaskEditPatch>({
    status: task.status,
    priority: task.priority,
    categoryId: task.categoryId,
    dueDate: task.dueDate,
    recurring: task.recurring,
    description: task.description,
    subtasks: task.subtasks,
  });

  const patch = (fields: Partial<TaskEditPatch>) => setDraft((d) => ({ ...d, ...fields }));

  return (
    <div className="modal-overlay">
      <div className="modal-card task-detail">
        <div className="modal-card__header">
          <h2 className="modal-card__title">{task.title}</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="task-detail__body">
          <div className="modal-row modal-row--3">
            <div className="modal-field">
              <label>Status</label>
              <StatusPicker status={draft.status} onChange={(status) => patch({ status })} />
            </div>
            <div className="modal-field">
              <label>Priority</label>
              <select
                value={draft.priority}
                style={{ borderColor: PRIORITY_COLOR[draft.priority], color: PRIORITY_COLOR[draft.priority] }}
                onChange={(e) => patch({ priority: e.target.value as TodoPriority })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Category</label>
              <select value={draft.categoryId} onChange={(e) => patch({ categoryId: e.target.value })}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row modal-row--2">
            <div className="modal-field">
              <label>Due Date</label>
              <input type="date" value={draft.dueDate} onChange={(e) => patch({ dueDate: e.target.value })} />
            </div>
            <div className="modal-field">
              <label>Repeat</label>
              <select
                value={draft.recurring}
                onChange={(e) => patch({ recurring: e.target.value as TodoRecurrence })}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">🔁 Daily</option>
                <option value="weekly">🔁 Weekly</option>
                <option value="monthly">🔁 Monthly</option>
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              placeholder="Add notes or details..."
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
              className="task-detail__description"
            />
          </div>

          <SubtasksEditor
            subtasks={draft.subtasks}
            onToggle={(id) =>
              patch({ subtasks: draft.subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)) })
            }
            onRename={(id, title) => patch({ subtasks: draft.subtasks.map((s) => (s.id === id ? { ...s, title } : s)) })}
            onDelete={(id) => patch({ subtasks: draft.subtasks.filter((s) => s.id !== id) })}
            onAdd={(title) =>
              patch({ subtasks: [...draft.subtasks, { id: generateId('sub'), title, completed: false }] })
            }
          />

          <div className="modal-actions">
            <button type="button" className="modal-actions__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="modal-actions__primary" onClick={() => onSave(task.id, draft)}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
