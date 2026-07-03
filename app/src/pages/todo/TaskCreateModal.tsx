import { useState } from 'react';
import type { TaskCreateDraft, TodoCategory, TodoPriority, TodoRecurrence } from '../../types';
import { SubtasksEditor } from './SubtasksEditor';
import { generateId } from '../../lib/todoUtils';
import './modal-shared.css';
import './TaskCreateModal.css';

interface TaskCreateModalProps {
  categories: TodoCategory[];
  onCreate: (draft: TaskCreateDraft) => void;
  onClose: () => void;
}

const EMPTY_DRAFT: TaskCreateDraft = {
  title: '',
  priority: 'Medium',
  dueDate: '',
  categoryId: '',
  recurring: 'none',
  subtasks: [],
  description: '',
};

export function TaskCreateModal({ categories, onCreate, onClose }: TaskCreateModalProps) {
  const [draft, setDraft] = useState<TaskCreateDraft>(EMPTY_DRAFT);
  const patch = (fields: Partial<TaskCreateDraft>) => setDraft((d) => ({ ...d, ...fields }));

  const handleCreate = () => {
    const title = draft.title.trim();
    if (!title) return;
    onCreate({ ...draft, title });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card task-create">
        <div className="modal-card__header">
          <h2 className="modal-card__title">Create Task</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="task-create__body">
          <div className="modal-field">
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={draft.title}
              autoFocus
              onChange={(e) => patch({ title: e.target.value })}
            />
          </div>

          <div className="modal-row modal-row--2">
            <div className="modal-field">
              <label>Priority</label>
              <select value={draft.priority} onChange={(e) => patch({ priority: e.target.value as TodoPriority })}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Due Date</label>
              <input type="date" value={draft.dueDate} onChange={(e) => patch({ dueDate: e.target.value })} />
            </div>
          </div>

          <div className="modal-row modal-row--2">
            <div className="modal-field">
              <label>Category</label>
              <select value={draft.categoryId} onChange={(e) => patch({ categoryId: e.target.value })}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
            <button type="button" className="modal-actions__primary" onClick={handleCreate}>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
