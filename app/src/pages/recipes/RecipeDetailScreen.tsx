import { useState } from 'react';
import type { RecipeCategoryColors } from '../../lib/recipeUtils';
import type { Recipe, RecipeCategory } from '../../types';
import './RecipeDetailScreen.css';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  category: RecipeCategory | undefined;
  colors: RecipeCategoryColors;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onAddIngredient: (text: string) => void;
  onAddAllIngredients: () => void;
}

export function RecipeDetailScreen({
  recipe,
  category,
  colors,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddIngredient,
  onAddAllIngredients,
}: RecipeDetailScreenProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="recipe-detail-screen">
      <div className="recipe-detail-screen__inner">
        <span className="recipe-detail-screen__back" onClick={onBack} role="button" tabIndex={0}>
          ‹ Back
        </span>

        <div className="recipe-detail-card">
          <div className="recipe-detail-card__header">
            <span className="recipe-detail-card__title">{recipe.title}</span>
            <span
              className="recipe-detail-card__favorite"
              onClick={onToggleFavorite}
              role="button"
              tabIndex={0}
              aria-label={recipe.favorite ? 'Unfavorite' : 'Favorite'}
            >
              {recipe.favorite ? '★' : '☆'}
            </span>
          </div>

          {category && (
            <span className="recipe-detail-card__category" style={{ background: colors.tagBg, color: colors.tagText }}>
              {category.emoji} {category.name}
            </span>
          )}

          <div className="recipe-detail-card__footer">
            {confirmingDelete ? (
              <>
                <span className="recipe-detail-card__delete-confirm">Delete this recipe?</span>
                <div className="recipe-detail-card__delete-actions">
                  <button type="button" className="recipe-detail-card__link-btn recipe-detail-card__link-btn--danger" onClick={onDelete}>
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="recipe-detail-card__link-btn recipe-detail-card__link-btn--muted"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="button" className="recipe-detail-card__delete" onClick={() => setConfirmingDelete(true)}>
                  Delete
                </button>
                <button type="button" className="recipe-detail-card__edit" onClick={onEdit}>
                  Edit Recipe
                </button>
              </>
            )}
          </div>
        </div>

        <div className="recipe-detail-section">
          <div className="recipe-detail-section__header">
            <span className="recipe-detail-section__title">🥘 Ingredients</span>
            <button type="button" className="recipe-detail-section__add-all" onClick={onAddAllIngredients}>
              Add All to List
            </button>
          </div>
          {recipe.ingredients.map((ing, idx) => (
            <div key={idx} className="recipe-ingredient-row">
              <span>{ing}</span>
              <button
                type="button"
                className="recipe-ingredient-row__add"
                onClick={() => onAddIngredient(ing)}
                aria-label={`Add ${ing} to shopping list`}
              >
                +
              </button>
            </div>
          ))}
        </div>

        <div className="recipe-detail-section">
          <span className="recipe-detail-section__title">📝 Instructions</span>
          <ol className="recipe-instructions-list">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="recipe-instructions-list__item">
                <span className="recipe-instructions-list__number">{idx + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
