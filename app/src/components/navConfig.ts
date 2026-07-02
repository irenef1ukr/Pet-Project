export interface NavItem {
  label: string;
  path: string;
  hue: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', hue: 240 },
  { label: 'Calendar', path: '/calendar', hue: 230 },
  { label: 'To-Do', path: '/todo', hue: 280 },
  { label: 'Lesson Plan', path: '/lesson-plan', hue: 190 },
  { label: 'Habits', path: '/habits', hue: 165 },
  { label: 'Goals', path: '/goals', hue: 190 },
  { label: 'Finance', path: '/finance', hue: 230 },
  { label: 'Journal', path: '/journal', hue: 300 },
  { label: 'Recipes', path: '/recipes', hue: 165 },
];
