import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { ingredientCountLabel, matchesRecipeSearch, recipeCategoryColors } from '../../lib/recipeUtils';
import { useAppData } from '../../store/AppDataContext';
import type { Recipe, RecipeDraft } from '../../types';
import { RecipeCategoriesScreen } from './RecipeCategoriesScreen';
import { RecipeDetailScreen } from './RecipeDetailScreen';
import { RecipeFormScreen } from './RecipeFormScreen';
import type { RecipeFormState } from './RecipeFormScreen';
import { ShoppingListScreen } from './ShoppingListScreen';
import './Recipes.css';

type Screen = 'main' | 'detail' | 'form' | 'categories' | 'shopping-list';
type CategoryFilter = 'all' | string;

const EMPTY_FORM: RecipeFormState = {
  title: '',
  categoryId: '',
  ingredients: [''],
  instructions: [''],
};

function toDraft(form: RecipeFormState): RecipeDraft {
  return {
    title: form.title,
    categoryId: form.categoryId,
    ingredients: form.ingredients.map((i) => i.trim()).filter(Boolean),
    instructions: form.instructions.map((i) => i.trim()).filter(Boolean),
  };
}

export function Recipes() {
  const {
    recipes,
    recipeCategories,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleRecipeFavorite,
    addRecipeCategory,
    renameRecipeCategory,
    changeRecipeCategoryEmoji,
    deleteRecipeCategory,
    shoppingList,
    addShoppingListItem,
    addRecipeIngredientsToShoppingList,
    updateShoppingListItem,
    removeShoppingListItem,
  } = useAppData();

  const [screen, setScreen] = useState<Screen>('main');
  const [search, setSearch] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecipeFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [newCategory, setNewCategory] = useState({ emoji: '🍽️', name: '' });

  const filteredByFavAndSearch = useMemo(
    () => recipes.filter((r) => (!favoritesOnly || r.favorite) && matchesRecipeSearch(r, search)),
    [recipes, favoritesOnly, search],
  );

  const categoryGroups = useMemo(
    () =>
      recipeCategories
        .map((c, idx) => ({
          id: c.id,
          name: c.name,
          emoji: c.emoji,
          colors: recipeCategoryColors(idx),
          recipes: filteredByFavAndSearch.filter((r) => r.categoryId === c.id),
        }))
        .filter((c) => (categoryFilter === 'all' || c.id === categoryFilter) && c.recipes.length > 0),
    [recipeCategories, filteredByFavAndSearch, categoryFilter],
  );

  const openDetail = (id: string) => {
    setDetailId(id);
    setScreen('detail');
  };

  const backFromDetail = () => {
    setDetailId(null);
    setScreen('main');
  };

  const openNewRecipe = () => {
    setEditingId(null);
    setFormError('');
    setForm({ ...EMPTY_FORM, categoryId: recipeCategories[0]?.id ?? '' });
    setScreen('form');
  };

  const openEditRecipe = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setFormError('');
    setForm({
      title: recipe.title,
      categoryId: recipe.categoryId,
      ingredients: recipe.ingredients.length ? recipe.ingredients : [''],
      instructions: recipe.instructions.length ? recipe.instructions : [''],
    });
    setScreen('form');
  };

  const saveRecipe = () => {
    const title = form.title.trim();
    if (!title) {
      setFormError('Please give this recipe a title.');
      return;
    }
    const draft = toDraft({ ...form, title });
    if (editingId) updateRecipe(editingId, draft);
    else addRecipe(draft);
    setScreen(detailId ? 'detail' : 'main');
  };

  const cancelForm = () => setScreen(detailId ? 'detail' : 'main');

  const confirmDeleteRecipe = () => {
    if (!detailId) return;
    deleteRecipe(detailId);
    setDetailId(null);
    setScreen('main');
  };

  const addNewCategory = () => {
    const name = newCategory.name.trim();
    if (!name) return;
    addRecipeCategory(name, newCategory.emoji || '🍽️');
    setNewCategory({ emoji: '🍽️', name: '' });
  };

  const detailRecipe = detailId ? recipes.find((r) => r.id === detailId) : undefined;
  const detailCategoryIndex = detailRecipe ? recipeCategories.findIndex((c) => c.id === detailRecipe.categoryId) : -1;

  return (
    <div className="page">
      <TopNav />
      <div className="recipes-main">
        {screen === 'main' && (
          <>
            <div className="recipes-header">
              <span className="recipes-title">Recipes</span>
              <div className="recipes-header__actions">
                <button type="button" className="recipes-btn recipes-btn--shopping" onClick={() => setScreen('shopping-list')}>
                  🛒 Shopping List
                </button>
                <button type="button" className="recipes-btn recipes-btn--manage" onClick={() => setScreen('categories')}>
                  Manage Categories
                </button>
                <button type="button" className="recipes-btn recipes-btn--new" onClick={openNewRecipe}>
                  + New Recipe
                </button>
              </div>
            </div>

            <div className="recipes-filters">
              <input
                type="text"
                className="recipes-search"
                placeholder="Search by title or ingredient…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                className={`recipes-chip${!favoritesOnly ? ' recipes-chip--active' : ''}`}
                onClick={() => setFavoritesOnly(false)}
              >
                All
              </button>
              <button
                type="button"
                className={`recipes-chip recipes-chip--favorites${favoritesOnly ? ' recipes-chip--active' : ''}`}
                onClick={() => setFavoritesOnly(true)}
              >
                ★ Favorites
              </button>
              {recipeCategories.map((c, idx) => {
                const colors = recipeCategoryColors(idx);
                const active = categoryFilter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className="recipes-chip"
                    style={active ? { background: colors.tagText, color: '#fff' } : { background: colors.tagBg, color: colors.tagText }}
                    onClick={() => setCategoryFilter(active ? 'all' : c.id)}
                  >
                    {c.emoji} {c.name}
                  </button>
                );
              })}
            </div>

            {recipes.length === 0 && (
              <div className="recipes-empty">
                <div className="recipes-empty__text">No recipes yet</div>
                <button type="button" className="recipes-btn recipes-btn--new" onClick={openNewRecipe}>
                  + New Recipe
                </button>
              </div>
            )}

            {recipes.length > 0 && categoryGroups.length === 0 && (
              <div className="recipes-empty">
                <div className="recipes-empty__text">No recipes match your filters.</div>
              </div>
            )}

            {categoryGroups.map((cat) => (
              <div key={cat.id} className="recipes-category-group">
                <span className="recipes-category-label" style={{ background: cat.colors.tagBg, color: cat.colors.tagText }}>
                  {cat.emoji} {cat.name.toUpperCase()}
                </span>
                <div className="recipes-card-grid">
                  {cat.recipes.map((r) => (
                    <div key={r.id} className="recipe-card" onClick={() => openDetail(r.id)} role="button" tabIndex={0}>
                      <div className="recipe-card__top">
                        <span className="recipe-card__title">{r.title}</span>
                        <span
                          className="recipe-card__favorite"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRecipeFavorite(r.id);
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          {r.favorite ? '★' : '☆'}
                        </span>
                      </div>
                      <span className="recipe-card__meta">{ingredientCountLabel(r)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {screen === 'detail' && detailRecipe && (
          <RecipeDetailScreen
            recipe={detailRecipe}
            category={recipeCategories.find((c) => c.id === detailRecipe.categoryId)}
            colors={recipeCategoryColors(Math.max(detailCategoryIndex, 0))}
            onBack={backFromDetail}
            onEdit={() => openEditRecipe(detailRecipe)}
            onDelete={confirmDeleteRecipe}
            onToggleFavorite={() => toggleRecipeFavorite(detailRecipe.id)}
            onAddIngredient={addShoppingListItem}
            onAddAllIngredients={() => addRecipeIngredientsToShoppingList(detailRecipe.id)}
          />
        )}

        {screen === 'form' && (
          <RecipeFormScreen
            isEditing={!!editingId}
            categories={recipeCategories}
            draft={form}
            error={formError}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            onSave={saveRecipe}
            onCancel={cancelForm}
          />
        )}

        {screen === 'categories' && (
          <RecipeCategoriesScreen
            categories={recipeCategories}
            newCategory={newCategory}
            onBack={() => setScreen('main')}
            onEmojiChange={changeRecipeCategoryEmoji}
            onNameChange={renameRecipeCategory}
            onDelete={deleteRecipeCategory}
            onNewCategoryChange={(patch) => setNewCategory((c) => ({ ...c, ...patch }))}
            onAddCategory={addNewCategory}
          />
        )}

        {screen === 'shopping-list' && (
          <ShoppingListScreen
            items={shoppingList}
            onBack={() => setScreen('main')}
            onUpdateItem={updateShoppingListItem}
            onRemoveItem={removeShoppingListItem}
          />
        )}
      </div>
    </div>
  );
}
