import { addDaysIso, dayOfYear, toISODate } from '../lib/dateUtils';
import type {
  CalendarEvent,
  DayMeta,
  FinanceCategory,
  FinanceTransaction,
  Goal,
  GoalCategory,
  Habit,
  JournalEntry,
  JournalFolder,
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

export const initialHabits: Habit[] = [
  { id: 'read', label: 'read', streakCount: 5, lastCompletedDate: getTodayISO() },
  { id: 'workout', label: 'workout', streakCount: 0, lastCompletedDate: null },
  { id: 'water', label: 'water', streakCount: 3, lastCompletedDate: getTodayISO() },
  { id: 'meditate', label: 'meditate', streakCount: 0, lastCompletedDate: null },
];

const today0 = getTodayISO();

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
  '2026-07-01': { spend: 42, mood: '🙂', weather: '☀️' },
  '2026-07-02': { spend: 18 },
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
