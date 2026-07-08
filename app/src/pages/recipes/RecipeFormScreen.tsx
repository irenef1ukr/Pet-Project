import type { RecipeCategory } from '../../types';
import './RecipeFormScreen.css';

export interface RecipeFormState {
  title: string;
  categoryId: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeFormScreenProps {
  isEditing: boolean;
  categories: RecipeCategory[];
  draft: RecipeFormState;
  error: string;
  onChange: (patch: Partial<RecipeFormState>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function RecipeFormScreen({ isEditing, categories, draft, error, onChange, onSave, onCancel }: RecipeFormScreenProps) {
  const updateIngredient = (idx: number, value: string) => {
    const next = draft.ingredients.slice();
    next[idx] = value;
    onChange({ ingredients: next });
  };

  const removeIngredient = (idx: number) => {
    onChange({ ingredients: draft.ingredients.filter((_, i) => i !== idx) });
  };

  const updateStep = (idx: number, value: string) => {
    const next = draft.instructions.slice();
    next[idx] = value;
    onChange({ instructions: next });
  };

  const removeStep = (idx: number) => {
    onChange({ instructions: draft.instructions.filter((_, i) => i !== idx) });
  };

  return (
    <div className="recipe-form-screen">
      <div className="recipe-form-card">
        <span className="recipe-form-card__title">{isEditing ? 'Edit Recipe' : 'New Recipe'}</span>

        <label className="recipe-field">
          <span className="recipe-field__label">Title</span>
          <input
            type="text"
            placeholder="e.g. Banana Bread"
            value={draft.title}
            autoFocus
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </label>

        <label className="recipe-field">
          <span className="recipe-field__label">Category</span>
          <select value={draft.categoryId} onChange={(e) => onChange({ categoryId: e.target.value })}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="recipe-field">
          <span className="recipe-field__label">Ingredients</span>
          {draft.ingredients.map((ing, idx) => (
            <div key={idx} className="recipe-form-row">
              <input
                type="text"
                placeholder="e.g. 2 cups flour"
                value={ing}
                onChange={(e) => updateIngredient(idx, e.target.value)}
              />
              <button type="button" className="recipe-form-row__remove" onClick={() => removeIngredient(idx)} aria-label="Remove ingredient">
                ×
              </button>
            </div>
          ))}
          <button type="button" className="recipe-form-add-link" onClick={() => onChange({ ingredients: [...draft.ingredients, ''] })}>
            + Add Ingredient
          </button>
        </div>

        <div className="recipe-field">
          <span className="recipe-field__label">Instructions</span>
          {draft.instructions.map((step, idx) => (
            <div key={idx} className="recipe-form-row recipe-form-row--step">
              <span className="recipe-form-row__number">{idx + 1}</span>
              <textarea placeholder="Describe this step" value={step} onChange={(e) => updateStep(idx, e.target.value)} />
              <button type="button" className="recipe-form-row__remove" onClick={() => removeStep(idx)} aria-label="Remove step">
                ×
              </button>
            </div>
          ))}
          <button type="button" className="recipe-form-add-link" onClick={() => onChange({ instructions: [...draft.instructions, ''] })}>
            + Add Step
          </button>
        </div>

        {error && <div className="recipe-form-error">{error}</div>}

        <div className="recipe-form-card__footer">
          <button type="button" className="recipe-form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="recipe-form-btn-save" onClick={onSave}>
            {isEditing ? 'Save Changes' : 'Create Recipe'}
          </button>
        </div>
      </div>
    </div>
  );
}
