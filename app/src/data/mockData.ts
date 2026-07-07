import { addDaysIso, dayOfYear, toISODate } from '../lib/dateUtils';
import type {
  CalendarEvent,
  DayMeta,
  FinanceCategory,
  FinanceTransaction,
  Goal,
  Habit,
  JournalEntry,
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

export const allGoals: Goal[] = [
  { id: 'spanish', label: 'Learn Spanish', percent: 60, active: true },
  { id: 'save', label: 'Save $5,000', percent: 35, active: true },
  { id: '5k', label: 'Run a 5k', percent: 20, active: true },
  { id: 'books', label: 'Read 12 books', percent: 80, active: true },
  { id: 'declutter', label: 'Declutter closet', percent: 45, active: true },
  { id: 'guitar', label: 'Learn guitar basics', percent: 10, active: true },
];

export const financeCategories: FinanceCategory[] = [
  { id: 'food', name: 'Food', emoji: '🍔', hue: 230, budget: 800 },
  { id: 'transport', name: 'Transport', emoji: '🚗', hue: 60, budget: 300 },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', hue: 25, budget: 250 },
  { id: 'health', name: 'Health', emoji: '💊', hue: 165, budget: 200 },
  { id: 'other', name: 'Other', emoji: '📦', hue: 300, budget: 150 },
];

const today0 = getTodayISO();

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

export const latestJournalEntry: JournalEntry | null = {
  id: 'jun29',
  date: 'Jun 29',
  preview: 'Today was calm, finished the report draft and went for a walk…',
};

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
  },
];
