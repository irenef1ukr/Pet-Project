import { addDaysIso, dayOfYear, toISODate } from '../lib/dateUtils';
import { isScheduled } from '../lib/habitUtils';
import type {
  CalendarEvent,
  DayMeta,
  FinanceCategory,
  FinanceTransaction,
  Goal,
  GoalCategory,
  Habit,
  HabitCategory,
  JournalEntry,
  JournalFolder,
  Lesson,
  LessonSubject,
  Recipe,
  RecipeCategory,
  ShoppingListItem,
  TodoCategory,
  TodoTask,
} from '../types';

export const NOW_TIME = '12:40';

export function getTodayDate(): Date {
  return new Date();
}

export function getTodayISO(): string {
  return toISODate(getTodayDate());
}

export const userName = 'Iryna';

export const QUOTES = [
  'small steps every day',
  'progress, not perfection',
  'done is better than perfect',
  'one task at a time',
  'consistency beats intensity',
  'you don’t have to see the whole staircase',
  'a little bit further than you think you can',
  'today is a good day to try',
  'discipline is choosing what you want most',
  'rest is productive too',
];

export function getDailyQuote(date: Date): string {
  return QUOTES[dayOfYear(date) % QUOTES.length];
}

export const moodOptions = ['🙂', '😁', '😐', '🙁', '😢'];
export const weatherOptions = ['☀️', '⛅', '🌧️', '❄️'];

const today0 = getTodayISO();

export const initialHabitCategories: HabitCategory[] = [
  { id: 'health', name: 'Health', emoji: '🩺' },
  { id: 'mindfulness', name: 'Mindfulness', emoji: '🧘' },
  { id: 'learning', name: 'Learning', emoji: '📚' },
  { id: 'home', name: 'Home', emoji: '🏠' },
];

function seedCompletions(
  frequencyType: Habit['frequencyType'],
  activeDays: number[],
  skip: (dayOffset: number) => boolean,
): Record<string, string> {
  const completions: Record<string, string> = {};
  for (let i = 0; i < 90; i++) {
    const dateIso = addDaysIso(today0, -i);
    if (isScheduled({ frequencyType, activeDays }, dateIso) && !skip(i)) completions[dateIso] = '';
  }
  return completions;
}

export const initialHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Drink water',
    categoryId: 'health',
    frequencyType: 'daily',
    activeDays: [],
    description: '8 glasses a day, tracked with a marked bottle.',
    archived: false,
    completions: seedCompletions('daily', [], (i) => i === 4 || i === 11),
  },
  {
    id: 'h2',
    title: 'Stretch',
    categoryId: 'health',
    frequencyType: 'custom',
    activeDays: [0, 2, 4],
    description: '',
    archived: false,
    completions: seedCompletions('custom', [0, 2, 4], (i) => i === 2),
  },
  {
    id: 'h3',
    title: 'Meditate',
    categoryId: 'mindfulness',
    frequencyType: 'daily',
    activeDays: [],
    description: '10 minutes, first thing in the morning.',
    archived: false,
    completions: seedCompletions('daily', [], (i) => i <= 2 || i % 4 === 0),
  },
  {
    id: 'h4',
    title: 'Journal before bed',
    categoryId: 'mindfulness',
    frequencyType: 'daily',
    activeDays: [],
    description: '',
    archived: false,
    completions: seedCompletions('daily', [], (i) => i === 0 || i % 5 === 0),
  },
  {
    id: 'h5',
    title: 'Read 20 minutes',
    categoryId: 'learning',
    frequencyType: 'daily',
    activeDays: [],
    description: 'Working through the Spanish grammar book.',
    archived: false,
    completions: seedCompletions('daily', [], (i) => i === 1 || i === 6 || i === 13),
  },
  {
    id: 'h6',
    title: 'Tidy kitchen',
    categoryId: 'home',
    frequencyType: 'custom',
    activeDays: [0, 1, 2, 3, 4],
    description: '',
    archived: false,
    completions: seedCompletions('custom', [0, 1, 2, 3, 4], (i) => i === 3),
  },
  {
    id: 'h7',
    title: 'Practice guitar',
    categoryId: 'learning',
    frequencyType: 'custom',
    activeDays: [1, 3, 5],
    description: 'Paused for the summer — picking back up in the fall.',
    archived: true,
    completions: seedCompletions('custom', [1, 3, 5], () => false),
  },
];

export const initialGoalCategories: GoalCategory[] = [
  { id: 'health', name: 'Health', emoji: '🩺' },
  { id: 'learning', name: 'Learning', emoji: '📚' },
  { id: 'finance', name: 'Finance', emoji: '💰' },
  { id: 'personal', name: 'Personal', emoji: '🌱' },
];

export const initialGoals: Goal[] = [
  {
    id: '5k',
    title: 'Run a 5k',
    categoryId: 'health',
    status: 'in_progress',
    percent: 20,
    dueDate: addDaysIso(today0, 60),
    description: 'Build up from couch to 5k over 10 weeks.',
  },
  {
    id: 'guitar',
    title: 'Learn guitar basics',
    categoryId: 'health',
    status: 'not_started',
    percent: 10,
    dueDate: '',
    description: '',
  },
  {
    id: 'spanish',
    title: 'Learn Spanish',
    categoryId: 'learning',
    status: 'in_progress',
    percent: 60,
    dueDate: addDaysIso(today0, 150),
    description: 'Conversational level before the trip to Barcelona.',
  },
  {
    id: 'books',
    title: 'Read 12 books',
    categoryId: 'learning',
    status: 'in_progress',
    percent: 80,
    dueDate: addDaysIso(today0, 180),
    description: '',
  },
  {
    id: 'save',
    title: 'Save ₴50,000',
    categoryId: 'finance',
    status: 'on_hold',
    percent: 35,
    dueDate: addDaysIso(today0, 180),
    description: 'Paused while covering an unexpected car repair.',
  },
  {
    id: 'declutter',
    title: 'Declutter closet',
    categoryId: 'personal',
    status: 'in_progress',
    percent: 45,
    dueDate: '',
    description: '',
  },
];

export const financeCategories: FinanceCategory[] = [
  { id: 'food', name: 'Food', emoji: '🍔', hue: 230, budget: 800 },
  { id: 'transport', name: 'Transport', emoji: '🚗', hue: 60, budget: 300 },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', hue: 25, budget: 250 },
  { id: 'health', name: 'Health', emoji: '💊', hue: 165, budget: 200 },
  { id: 'other', name: 'Other', emoji: '📦', hue: 300, budget: 150 },
];

export const financeTransactions: FinanceTransaction[] = [
  { id: 'tx1', date: today0, desc: 'Grocery run', categoryId: 'food', amount: 420 },
  { id: 'tx2', date: today0, desc: 'Bus pass', categoryId: 'transport', amount: 180 },
  { id: 'tx3', date: addDaysIso(today0, -1), desc: 'Movie tickets', categoryId: 'entertainment', amount: 242 },
  { id: 'tx4', date: addDaysIso(today0, -1), desc: 'Coffee', categoryId: 'food', amount: 85 },
  { id: 'tx5', date: addDaysIso(today0, -2), desc: 'Pharmacy', categoryId: 'health', amount: 130 },
  { id: 'tx6', date: addDaysIso(today0, -3), desc: 'Taxi ride', categoryId: 'transport', amount: 95 },
  { id: 'tx7', date: addDaysIso(today0, -4), desc: 'Dinner out', categoryId: 'food', amount: 310 },
  { id: 'tx8', date: addDaysIso(today0, -5), desc: 'Streaming sub', categoryId: 'entertainment', amount: 149 },
  { id: 'tx9', date: addDaysIso(today0, -6), desc: 'Gym class', categoryId: 'health', amount: 120 },
  { id: 'tx10', date: addDaysIso(today0, -8), desc: 'Bookstore', categoryId: 'other', amount: 68 },
  { id: 'tx11', date: addDaysIso(today0, -10), desc: 'Groceries', categoryId: 'food', amount: 275 },
  { id: 'tx12', date: addDaysIso(today0, -12), desc: 'Fuel', categoryId: 'transport', amount: 210 },
];

export const initialJournalFolders: JournalFolder[] = [
  { id: 'general', name: 'General' },
  { id: 'work', name: 'Work' },
  { id: 'personal', name: 'Personal' },
];

function yearsAgoIso(iso: string, years: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y - years}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'jentry-1',
    date: today0,
    title: 'Finished the finance module',
    bodyHtml: 'Shipped the budget tracker with pagination and CSV export. Felt good to close it out before the weekend.',
    mood: '🙂',
    weather: '☀️',
    folderId: 'work',
    goalId: '',
    mediaUrl: '',
    mediaType: '',
  },
  {
    id: 'jentry-2',
    date: addDaysIso(today0, -2),
    title: 'Slow start',
    bodyHtml: "Didn't sleep great. Took a long walk at lunch and it helped clear my head a bit.",
    mood: '😐',
    weather: '⛅',
    folderId: 'personal',
    goalId: '',
    mediaUrl: '',
    mediaType: '',
  },
  {
    id: 'jentry-3',
    date: addDaysIso(today0, -6),
    title: 'New month, fresh start',
    bodyHtml: '<b>Goals for this month:</b><ul><li>Read more</li><li>Cook at home</li></ul>',
    mood: '😁',
    weather: '☀️',
    folderId: 'general',
    goalId: 'spanish',
    mediaUrl: '',
    mediaType: '',
  },
  {
    id: 'jentry-4',
    date: yearsAgoIso(today0, 1),
    title: 'A year ago today',
    bodyHtml: 'Started planning the "hi" app for the first time. Little did I know where it would go.',
    mood: '😁',
    weather: '☀️',
    folderId: 'general',
    goalId: '',
    mediaUrl: '',
    mediaType: '',
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'sync',
    title: 'Team sync',
    date: '2026-07-01',
    startTime: '09:00',
    endTime: '10:00',
    type: 'event',
    category: 'work',
    recurring: 'none',
  },
  {
    id: 'piano-1',
    title: 'Piano lesson',
    date: '2026-07-01',
    startTime: '11:30',
    endTime: '12:15',
    type: 'lesson',
    category: 'lesson',
    recurring: 'weekly',
  },
  {
    id: 'dentist',
    title: 'Dentist',
    date: '2026-07-01',
    startTime: '13:00',
    endTime: '14:00',
    type: 'event',
    category: 'personal',
    recurring: 'none',
  },
  {
    id: 'mom',
    title: 'Call with mom',
    date: '2026-07-01',
    startTime: '18:00',
    endTime: '18:30',
    type: 'event',
    category: 'personal',
    recurring: 'none',
  },
  {
    id: 'piano-2',
    title: 'Piano lesson',
    date: '2026-07-03',
    startTime: '11:30',
    endTime: '12:15',
    type: 'lesson',
    category: 'lesson',
    recurring: 'weekly',
  },
  {
    id: 'trip',
    title: 'Trip to coast',
    date: '2026-07-06',
    endDate: '2026-07-08',
    allDay: true,
    type: 'event',
    category: 'personal',
    recurring: 'none',
  },
  {
    id: 'piano-3',
    title: 'Piano lesson',
    date: '2026-07-10',
    startTime: '11:30',
    endTime: '12:15',
    type: 'lesson',
    category: 'lesson',
    recurring: 'weekly',
  },
];

export const dayMeta: Record<string, DayMeta> = {
  '2026-07-01': { mood: '🙂', weather: '☀️' },
  '2026-07-03': { mood: '😐', weather: '🌧️' },
};

export const todoCategories: TodoCategory[] = [
  { id: 'work', name: 'Work' },
  { id: 'personal', name: 'Personal' },
  { id: 'health', name: 'Health' },
];

export const todoTasks: TodoTask[] = [
  {
    id: 't1',
    title: 'Finish project proposal',
    categoryId: 'work',
    priority: 'High',
    dueDate: '2026-07-01',
    status: 'in_progress',
    recurring: 'none',
    subtasks: [{ id: 's1', title: 'Write intro', completed: false }],
    description: '',
    goalId: '',
  },
  {
    id: 't2',
    title: 'Schedule meeting with client',
    categoryId: 'work',
    priority: 'High',
    dueDate: '2026-06-29',
    status: 'not_started',
    recurring: 'none',
    subtasks: [],
    description: '',
    goalId: '',
  },
  {
    id: 't3',
    title: 'Review team feedback',
    categoryId: 'personal',
    priority: 'Medium',
    dueDate: '2026-07-01',
    status: 'complete',
    recurring: 'none',
    subtasks: [{ id: 's2', title: 'Check email', completed: true }],
    description: '',
    goalId: '',
  },
  {
    id: 't4',
    title: 'Update documentation',
    categoryId: 'work',
    priority: 'Low',
    dueDate: '2026-07-05',
    status: 'not_started',
    recurring: 'none',
    subtasks: [],
    description: '',
    goalId: '',
  },
  {
    id: 't5',
    title: 'Buy groceries',
    categoryId: 'personal',
    priority: 'Medium',
    dueDate: '2026-07-03',
    status: 'in_progress',
    recurring: 'weekly',
    subtasks: [],
    description: '',
    goalId: '',
  },
  {
    id: 't6',
    title: 'Gym session',
    categoryId: 'health',
    priority: 'High',
    dueDate: '2026-07-03',
    status: 'complete',
    recurring: 'daily',
    subtasks: [],
    description: '',
    goalId: '5k',
  },
  {
    id: 't7',
    title: 'Buy running shoes',
    categoryId: 'health',
    priority: 'Medium',
    dueDate: addDaysIso(today0, 8),
    status: 'not_started',
    recurring: 'none',
    subtasks: [],
    description: '',
    goalId: '5k',
  },
  {
    id: 't8',
    title: 'Book conversation tutor',
    categoryId: 'personal',
    priority: 'Medium',
    dueDate: addDaysIso(today0, 13),
    status: 'not_started',
    recurring: 'none',
    subtasks: [],
    description: '',
    goalId: 'spanish',
  },
];

export const initialLessonSubjects: LessonSubject[] = [
  { id: 'spanish', name: 'Spanish', emoji: '🗣️' },
  { id: 'guitar', name: 'Guitar', emoji: '🎸' },
  { id: 'data-science', name: 'Data Science', emoji: '💻' },
  { id: 'watercolor', name: 'Watercolor', emoji: '🎨' },
];

export const initialLessons: Lesson[] = [
  {
    id: 'lesson-1',
    objective: 'Past tense verbs',
    subjectId: 'spanish',
    day: 0,
    startTime: '09:00',
    durationMinutes: 45,
    materials: ['Textbook', 'notebook'],
    status: 'planned',
    notes: 'Review irregular verbs from last week first.',
  },
  {
    id: 'lesson-2',
    objective: 'Barre chords',
    subjectId: 'guitar',
    day: 0,
    startTime: '18:00',
    durationMinutes: 45,
    materials: [],
    status: 'done',
    notes: '',
  },
  {
    id: 'lesson-3',
    objective: 'Intro to pandas',
    subjectId: 'data-science',
    day: 1,
    startTime: '11:00',
    durationMinutes: 90,
    materials: [],
    status: 'planned',
    notes: '',
  },
  {
    id: 'lesson-4',
    objective: 'Conversation practice',
    subjectId: 'spanish',
    day: 2,
    startTime: '09:00',
    durationMinutes: 45,
    materials: [],
    status: 'planned',
    notes: '',
  },
  {
    id: 'lesson-5',
    objective: 'Wet-on-wet skies',
    subjectId: 'watercolor',
    day: 2,
    startTime: '16:00',
    durationMinutes: 90,
    materials: [],
    status: 'planned',
    notes: '',
  },
  {
    id: 'lesson-6',
    objective: 'Linear regression basics',
    subjectId: 'data-science',
    day: 3,
    startTime: '11:00',
    durationMinutes: 45,
    materials: [],
    status: 'done',
    notes: '',
  },
  {
    id: 'lesson-7',
    objective: 'New song: fingerpicking',
    subjectId: 'guitar',
    day: 4,
    startTime: '17:00',
    durationMinutes: 30,
    materials: [],
    status: 'planned',
    notes: '',
  },
];

export const initialRecipeCategories: RecipeCategory[] = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🍳' },
  { id: 'dinner', name: 'Dinner', emoji: '🍝' },
  { id: 'dessert', name: 'Dessert', emoji: '🍰' },
  { id: 'salads', name: 'Salads', emoji: '🥗' },
];

export const initialRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Overnight Oats',
    categoryId: 'breakfast',
    ingredients: ['1/2 cup rolled oats', '1/2 cup milk', '1/4 cup yogurt', '1 tbsp chia seeds', '1 tsp honey', 'Handful of berries'],
    instructions: [
      'Combine oats, milk, yogurt, chia seeds and honey in a jar.',
      'Stir well and cover.',
      'Refrigerate overnight.',
      'Top with berries before serving.',
    ],
    favorite: true,
  },
  {
    id: 'recipe-2',
    title: 'Veggie Omelette',
    categoryId: 'breakfast',
    ingredients: ['3 eggs', '2 tbsp milk', '1/4 cup bell pepper', '1/4 cup onion', '1/4 cup shredded cheese'],
    instructions: [
      'Whisk eggs with milk.',
      'Sauté bell pepper and onion until soft.',
      'Pour egg mixture into the pan.',
      'Fold in cheese and serve.',
    ],
    favorite: false,
  },
  {
    id: 'recipe-3',
    title: 'Chicken Stir-Fry',
    categoryId: 'dinner',
    ingredients: ['1 lb chicken breast', '2 cups broccoli', '1 bell pepper', '2 tbsp soy sauce', '2 cloves garlic', '1 tsp ginger'],
    instructions: [
      'Slice chicken and vegetables.',
      'Stir-fry chicken until cooked through.',
      'Add vegetables, garlic, ginger and soy sauce.',
      'Serve over rice.',
    ],
    favorite: true,
  },
  {
    id: 'recipe-4',
    title: 'Spaghetti Bolognese',
    categoryId: 'dinner',
    ingredients: [
      '8 oz spaghetti',
      '1/2 lb ground beef',
      '1 cup tomato sauce',
      '1/2 onion',
      '2 cloves garlic',
      '1 tbsp olive oil',
      '2 tbsp parmesan',
    ],
    instructions: [
      'Cook spaghetti according to package instructions.',
      'Brown ground beef with onion and garlic in olive oil.',
      'Add tomato sauce and simmer for 15 minutes.',
      'Toss pasta with sauce and top with parmesan.',
    ],
    favorite: false,
  },
  {
    id: 'recipe-5',
    title: 'Banana Bread',
    categoryId: 'dessert',
    ingredients: [
      '3 ripe bananas',
      '1 1/2 cups flour',
      '3/4 cup sugar',
      '1/3 cup melted butter',
      '1 egg',
      '1 tsp baking soda',
      '1 tsp vanilla extract',
    ],
    instructions: [
      'Preheat oven to 350°F.',
      'Mash bananas and mix with butter and sugar.',
      'Add egg and vanilla extract.',
      'Fold in flour and baking soda.',
      'Bake for 55-60 minutes.',
    ],
    favorite: false,
  },
  {
    id: 'recipe-6',
    title: 'Greek Salad',
    categoryId: 'salads',
    ingredients: [
      '1 cucumber',
      '2 tomatoes',
      '1/4 red onion',
      '1/2 cup feta cheese',
      '1/4 cup kalamata olives',
      '2 tbsp olive oil',
      '1 tsp oregano',
    ],
    instructions: [
      'Chop cucumber, tomatoes and onion.',
      'Combine in a bowl with olives.',
      'Top with feta cheese.',
      'Drizzle with olive oil and oregano.',
    ],
    favorite: true,
  },
];

export const initialShoppingList: ShoppingListItem[] = [];
