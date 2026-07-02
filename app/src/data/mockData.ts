import type {
  DashboardEvent,
  DashboardTask,
  FinanceSummary,
  Goal,
  Habit,
  JournalEntry,
} from '../types';

export const NOW_TIME = '12:40';

export const userName = 'Iryna';
export const greetingDate = 'Monday, July 1';
export const greetingQuote = 'small steps every day';

export const moodOptions = ['🙂', '😁', '😐', '🙁', '😢'];
export const weatherOptions = ['☀️', '⛅', '🌧️', '❄️'];

export const initialTasks: DashboardTask[] = [
  { id: 'report', label: 'Finish report', status: 'todo', overdue: true },
  { id: 'proposal', label: 'Draft proposal', status: 'in_progress' },
  { id: 'grocery', label: 'Grocery shopping', status: 'todo' },
  { id: 'email', label: 'Reply to emails', status: 'done', recurring: true },
];

export const todaysEvents: DashboardEvent[] = [
  { id: 'sync', time: '9:00', title: 'Team sync' },
  { id: 'piano', time: '11:30', title: 'Piano lesson', recurring: true },
  { id: 'dentist', time: '13:00', title: 'Dentist' },
  { id: 'mom', time: '18:00', title: 'Call with mom' },
];

export const initialHabits: Habit[] = [
  { id: 'read', label: 'read', done: true },
  { id: 'workout', label: 'workout', done: false },
  { id: 'water', label: 'water', done: true },
  { id: 'meditate', label: 'meditate', done: false },
];

export const allGoals: Goal[] = [
  { id: 'spanish', label: 'Learn Spanish', percent: 60, active: true },
  { id: 'save', label: 'Save $5,000', percent: 35, active: true },
  { id: '5k', label: 'Run a 5k', percent: 20, active: true },
  { id: 'books', label: 'Read 12 books', percent: 80, active: true },
  { id: 'declutter', label: 'Declutter closet', percent: 45, active: true },
  { id: 'guitar', label: 'Learn guitar basics', percent: 10, active: true },
];

export const financeSummary: FinanceSummary = {
  spentThisMonth: 860,
  spentYesterday: 42,
};

export const latestJournalEntry: JournalEntry | null = {
  id: 'jun29',
  date: 'Jun 29',
  preview: 'Today was calm, finished the report draft and went for a walk…',
};
