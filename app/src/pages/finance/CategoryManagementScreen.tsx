import { HUE_SWATCHES } from '../../lib/financeUtils';
import type { FinanceCategory, FinanceNewCategoryDraft } from '../../types';
import './CategoryManagementScreen.css';

interface CategoryManagementScreenProps {
  categories: FinanceCategory[];
  newCategory: FinanceNewCategoryDraft;
  onBack: () => void;
  onEmojiChange: (id: string, emoji: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onNewCategoryChange: (patch: Partial<FinanceNewCategoryDraft>) => void;
  onAddCategory: () => void;
}

export function CategoryManagementScreen({
  categories,
  newCategory,
  onBack,
  onEmojiChange,
  onNameChange,
  onDelete,
  onNewCategoryChange,
  onAddCategory,
}: CategoryManagementScreenProps) {
  return (
    <div className="finance-screen-center">
      <div className="category-screen">
        <div className="category-screen__header">
          <span className="category-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <div className="finance-form-card__title">Manage Categories</div>
        </div>

        <div className="finance-card category-screen__list">
          {categories.map((c) => (
            <div key={c.id} className="category-row">
              <input
                type="text"
                maxLength={2}
                value={c.emoji}
                onChange={(e) => onEmojiChange(c.id, e.target.value)}
                className="category-row__emoji"
              />
              <input
                type="text"
                value={c.name}
                onChange={(e) => onNameChange(c.id, e.target.value)}
                className="category-row__name"
              />
              <span className="category-row__delete" onClick={() => onDelete(c.id)} role="button" tabIndex={0}>
                ×
              </span>
            </div>
          ))}
        </div>

        <div className="finance-card category-screen__add">
          <div className="finance-section-title category-screen__add-title">Add Category</div>
          <div className="category-screen__add-row">
            <input
              type="text"
              maxLength={2}
              placeholder="🙂"
              value={newCategory.emoji}
              onChange={(e) => onNewCategoryChange({ emoji: e.target.value })}
              className="category-row__emoji"
            />
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => onNewCategoryChange({ name: e.target.value })}
              className="category-row__name"
            />
            <button type="button" className="finance-btn-primary category-screen__add-btn" onClick={onAddCategory}>
              Add
            </button>
          </div>
          <div className="category-screen__swatches">
            <span className="category-screen__swatch-label">Swatch:</span>
            {HUE_SWATCHES.map((hue) => (
              <div
                key={hue}
                className={`category-swatch${newCategory.hue === hue ? ' category-swatch--selected' : ''}`}
                style={{ background: `oklch(0.6 0.18 ${hue})` }}
                onClick={() => onNewCategoryChange({ hue })}
                role="button"
                tabIndex={0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
