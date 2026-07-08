import type { Recipe } from '../types';

export interface RecipeCategoryColors {
  tagBg: string;
  tagText: string;
}

const RECIPE_CATEGORY_PALETTE: RecipeCategoryColors[] = [
  { tagBg: 'oklch(0.93 0.07 25)', tagText: 'oklch(0.48 0.18 25)' },
  { tagBg: 'oklch(0.92 0.08 150)', tagText: 'oklch(0.42 0.13 150)' },
  { tagBg: 'oklch(0.93 0.08 70)', tagText: 'oklch(0.46 0.14 50)' },
  { tagBg: 'oklch(0.92 0.07 330)', tagText: 'oklch(0.44 0.15 330)' },
];

export function recipeCategoryColors(index: number): RecipeCategoryColors {
  return RECIPE_CATEGORY_PALETTE[index % RECIPE_CATEGORY_PALETTE.length];
}

export function matchesRecipeSearch(recipe: Recipe, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (recipe.title.toLowerCase().includes(q)) return true;
  return recipe.ingredients.some((ing) => ing.toLowerCase().includes(q));
}

export function ingredientCountLabel(recipe: Recipe): string {
  return `${recipe.ingredients.length} ingredient${recipe.ingredients.length === 1 ? '' : 's'} · ${recipe.instructions.length} step${recipe.instructions.length === 1 ? '' : 's'}`;
}
