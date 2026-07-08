import type { RecipeCategory } from '../../types';
import './RecipeCategoriesScreen.css';

interface NewRecipeCategoryDraft {
  emoji: string;
  name: string;
}

interface RecipeCategoriesScreenProps {
  categories: RecipeCategory[];
  newCategory: NewRecipeCategoryDraft;
  onBack: () => void;
  onEmojiChange: (id: string, emoji: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onNewCategoryChange: (patch: Partial<NewRecipeCategoryDraft>) => void;
  onAddCategory: () => void;
}

export function RecipeCategoriesScreen({
  categories,
  newCategory,
  onBack,
  onEmojiChange,
  onNameChange,
  onDelete,
  onNewCategoryChange,
  onAddCategory,
}: RecipeCategoriesScreenProps) {
  return (
    <div className="recipes-screen-center">
      <div className="recipe-categories-screen">
        <div className="recipe-categories-screen__header">
          <span className="recipe-categories-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <span className="recipe-categories-screen__title">Manage Categories</span>
        </div>

        <div className="recipe-categories-screen__list">
          {categories.map((c) => (
            <div key={c.id} className="recipe-category-row">
              <input
                type="text"
                maxLength={2}
                value={c.emoji}
                onChange={(e) => onEmojiChange(c.id, e.target.value)}
                className="recipe-category-row__emoji"
              />
              <input
                type="text"
                value={c.name}
                onChange={(e) => onNameChange(c.id, e.target.value)}
                className="recipe-category-row__name"
              />
              <button
                type="button"
                className="recipe-category-row__delete"
                onClick={() => onDelete(c.id)}
                aria-label={`Delete ${c.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="recipe-categories-screen__add">
          <div className="recipe-categories-screen__add-title">Add Category</div>
          <div className="recipe-categories-screen__add-row">
            <input
              type="text"
              maxLength={2}
              placeholder="🍽️"
              value={newCategory.emoji}
              onChange={(e) => onNewCategoryChange({ emoji: e.target.value })}
              className="recipe-category-row__emoji"
            />
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => onNewCategoryChange({ name: e.target.value })}
              className="recipe-category-row__name"
            />
            <button type="button" className="recipe-categories-screen__add-btn" onClick={onAddCategory}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
