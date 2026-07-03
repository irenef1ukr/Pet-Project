import { useState } from 'react';
import type { TodoSubtask } from '../../types';
import './SubtasksEditor.css';

interface SubtasksEditorProps {
  subtasks: TodoSubtask[];
  onToggle: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string) => void;
}

export function SubtasksEditor({ subtasks, onToggle, onRename, onDelete, onAdd }: SubtasksEditorProps) {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewTitle('');
  };

  return (
    <div>
      <div className="subtasks-editor__header">
        <label>Subtasks</label>
      </div>
      <div className="subtasks-editor__box">
        {subtasks.map((sub) => (
          <div key={sub.id} className="subtasks-editor__row">
            <input
              type="checkbox"
              checked={sub.completed}
              onChange={() => onToggle(sub.id)}
              className="subtasks-editor__checkbox"
            />
            <input
              type="text"
              value={sub.title}
              onChange={(e) => onRename(sub.id, e.target.value)}
              className="subtasks-editor__title-input"
            />
            <button type="button" className="subtasks-editor__delete" onClick={() => onDelete(sub.id)}>
              ×
            </button>
          </div>
        ))}
        <div className="subtasks-editor__add-row">
          <input
            type="text"
            placeholder="New subtask..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="subtasks-editor__new-input"
          />
          <button type="button" className="subtasks-editor__add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
