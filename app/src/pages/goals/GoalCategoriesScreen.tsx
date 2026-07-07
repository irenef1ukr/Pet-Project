import type { GoalCategory } from '../../types';
import './GoalCategoriesScreen.css';

interface NewGoalCategoryDraft {
  emoji: string;
  name: string;
}

interface GoalCategoriesScreenProps {
  categories: GoalCategory[];
  newCategory: NewGoalCategoryDraft;
  onBack: () => void;
  onEmojiChange: (id: string, emoji: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onNewCategoryChange: (patch: Partial<NewGoalCategoryDraft>) => void;
  onAddCategory: () => void;
}

export function GoalCategoriesScreen({
  categories,
  newCategory,
  onBack,
  onEmojiChange,
  onNameChange,
  onDelete,
  onNewCategoryChange,
  onAddCategory,
}: GoalCategoriesScreenProps) {
  return (
    <div className="goals-screen-center">
      <div className="goal-categories-screen">
        <div className="goal-categories-screen__header">
          <span className="goal-categories-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <span className="goal-categories-screen__title">Manage Categories</span>
        </div>

        <div className="goal-categories-screen__list">
          {categories.map((c) => (
            <div key={c.id} className="goal-category-row">
              <input
                type="text"
                maxLength={2}
                value={c.emoji}
                onChange={(e) => onEmojiChange(c.id, e.target.value)}
                className="goal-category-row__emoji"
              />
              <input
                type="text"
                value={c.name}
                onChange={(e) => onNameChange(c.id, e.target.value)}
                className="goal-category-row__name"
              />
              <button
                type="button"
                className="goal-category-row__delete"
                onClick={() => onDelete(c.id)}
                aria-label={`Delete ${c.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="goal-categories-screen__add">
          <div className="goal-categories-screen__add-title">Add Category</div>
          <div className="goal-categories-screen__add-row">
            <input
              type="text"
              maxLength={2}
              placeholder="🎯"
              value={newCategory.emoji}
              onChange={(e) => onNewCategoryChange({ emoji: e.target.value })}
              className="goal-category-row__emoji"
            />
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => onNewCategoryChange({ name: e.target.value })}
              className="goal-category-row__name"
            />
            <button type="button" className="goal-categories-screen__add-btn" onClick={onAddCategory}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
