import { useState } from 'react';
import type { TodoCategory } from '../../types';
import '../../components/modal-shared.css';
import './CategoryManagerModal.css';

interface CategoryManagerModalProps {
  categories: TodoCategory[];
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAdd: (name: string) => void;
  onClose: () => void;
}

export function CategoryManagerModal({ categories, onRename, onDelete, onAdd, onClose }: CategoryManagerModalProps) {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card category-manager">
        <div className="modal-card__header">
          <h2 className="modal-card__title">Manage Categories</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="category-manager__list">
          {categories.map((cat) => (
            <div key={cat.id} className="category-manager__row">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => onRename(cat.id, e.target.value)}
                className="category-manager__input"
              />
              <button type="button" className="category-manager__delete" onClick={() => onDelete(cat.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="category-manager__add-row">
          <input
            type="text"
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="category-manager__new-input"
          />
          <button type="button" className="category-manager__add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>

        <button type="button" className="category-manager__done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
