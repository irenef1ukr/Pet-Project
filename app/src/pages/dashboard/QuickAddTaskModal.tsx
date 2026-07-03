import { useState } from 'react';
import type { TaskCreateDraft } from '../../types';
import '../../components/modal-shared.css';

interface QuickAddTaskModalProps {
  today: string;
  onCreate: (draft: TaskCreateDraft) => void;
  onClose: () => void;
}

export function QuickAddTaskModal({ today, onCreate, onClose }: QuickAddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(today);
  const [titleError, setTitleError] = useState(false);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      return;
    }
    onCreate({
      title: trimmed,
      description,
      dueDate,
      priority: 'Medium',
      categoryId: '',
      recurring: 'none',
      subtasks: [],
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-card__header">
          <h2 className="modal-card__title">Add Task</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div className={`modal-field${titleError ? ' modal-field--error' : ''}`}>
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              autoFocus
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') onClose();
              }}
            />
            {titleError && <span className="modal-field__error-text">Title is required</span>}
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              placeholder="Add notes or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: 90, resize: 'none' }}
            />
          </div>

          <div className="modal-field">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-actions__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="modal-actions__primary" onClick={handleSave}>
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
