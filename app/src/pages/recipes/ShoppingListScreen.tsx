import { useState } from 'react';
import type { ShoppingListItem } from '../../types';
import './ShoppingListScreen.css';

interface ShoppingListScreenProps {
  items: ShoppingListItem[];
  onBack: () => void;
  onUpdateItem: (id: string, text: string) => void;
  onRemoveItem: (id: string) => void;
}

export function ShoppingListScreen({ items, onBack, onUpdateItem, onRemoveItem }: ShoppingListScreenProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState('');

  const startEditing = (item: ShoppingListItem) => {
    setEditingId(item.id);
    setDraftText(item.text);
  };

  const saveEdit = () => {
    if (editingId) {
      const trimmed = draftText.trim();
      if (trimmed) onUpdateItem(editingId, trimmed);
    }
    setEditingId(null);
  };

  return (
    <div className="shopping-list-screen">
      <div className="shopping-list-screen__inner">
        <div className="shopping-list-screen__header">
          <span className="shopping-list-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <span className="shopping-list-screen__title">🛒 Shopping List</span>
        </div>

        <div className="shopping-list-card">
          {items.length === 0 ? (
            <div className="shopping-list-empty">Your list is empty — add ingredients from a recipe's detail page.</div>
          ) : (
            items.map((item) =>
              editingId === item.id ? (
                <div key={item.id} className="shopping-list-row shopping-list-row--editing">
                  <input
                    type="text"
                    autoFocus
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  />
                </div>
              ) : (
                <div key={item.id} className="shopping-list-row">
                  <span className="shopping-list-row__text" onClick={() => startEditing(item)} role="button" tabIndex={0}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    className="shopping-list-row__remove"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.text}`}
                  >
                    ×
                  </button>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
}
