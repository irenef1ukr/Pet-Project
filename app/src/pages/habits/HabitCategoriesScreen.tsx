import type { HabitCategory } from '../../types';
import './HabitCategoriesScreen.css';

interface NewHabitCategoryDraft {
  emoji: string;
  name: string;
}

interface HabitCategoriesScreenProps {
  categories: HabitCategory[];
  newCategory: NewHabitCategoryDraft;
  onBack: () => void;
  onEmojiChange: (id: string, emoji: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onNewCategoryChange: (patch: Partial<NewHabitCategoryDraft>) => void;
  onAddCategory: () => void;
}

export function HabitCategoriesScreen({
  categories,
  newCategory,
  onBack,
  onEmojiChange,
  onNameChange,
  onDelete,
  onNewCategoryChange,
  onAddCategory,
}: HabitCategoriesScreenProps) {
  return (
    <div className="habits-screen-center">
      <div className="habit-categories-screen">
        <div className="habit-categories-screen__header">
          <span className="habit-categories-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <span className="habit-categories-screen__title">Manage Categories</span>
        </div>

        <div className="habit-categories-screen__list">
          {categories.map((c) => (
            <div key={c.id} className="habit-category-row">
              <input
                type="text"
                maxLength={2}
                value={c.emoji}
                onChange={(e) => onEmojiChange(c.id, e.target.value)}
                className="habit-category-row__emoji"
              />
              <input
                type="text"
                value={c.name}
                onChange={(e) => onNameChange(c.id, e.target.value)}
                className="habit-category-row__name"
              />
              <button
                type="button"
                className="habit-category-row__delete"
                onClick={() => onDelete(c.id)}
                aria-label={`Delete ${c.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="habit-categories-screen__add">
          <div className="habit-categories-screen__add-title">Add Category</div>
          <div className="habit-categories-screen__add-row">
            <input
              type="text"
              maxLength={2}
              placeholder="🌱"
              value={newCategory.emoji}
              onChange={(e) => onNewCategoryChange({ emoji: e.target.value })}
              className="habit-category-row__emoji"
            />
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => onNewCategoryChange({ name: e.target.value })}
              className="habit-category-row__name"
            />
            <button type="button" className="habit-categories-screen__add-btn" onClick={onAddCategory}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
