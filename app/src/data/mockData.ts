import type {
  CalendarEvent,
  DashboardEvent,
  DashboardTask,
  DayMeta,
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

export const CALENDAR_TODAY = new Date(2026, 6, 1);

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'sync',
    title: 'Team sync',
    date: '2026-07-01',
    startTime: '09:00',
    endTime: '10:00',
    type: 'event',
    category: 'work',
  },
  {
    id: 'piano-1',
    title: 'Piano lesson',
    date: '2026-07-01',
    startTime: '11:30',
    endTime: '12:15',
    type: 'lesson',
    category: 'lesson',
    recurring: true,
  },
  {
    id: 'dentist',
    title: 'Dentist',
    date: '2026-07-01',
    startTime: '13:00',
    endTime: '14:00',
    type: 'event',
    category: 'personal',
  },
  {
    id: 'mom',
    title: 'Call with mom',
    date: '2026-07-01',
    startTime: '18:00',
    endTime: '18:30',
    type: 'event',
    category: 'personal',
  },
  {
    id: 'report',
    title: 'Finish report',
    date: '2026-07-01',
    type: 'task',
    category: 'task',
  },
  {
    id: 'proposal',
    title: 'Draft proposal',
    date: '2026-07-02',
    type: 'task',
    category: 'task',
  },
  {
    id: 'piano-2',
    title: 'Piano lesson',
    date: '2026-07-03',
    startTime: '11:30',
    endTime: '12:15',
    type: 'lesson',
    category: 'lesson',
    recurring: true,
  },
  {
    id: 'trip',
    title: 'Trip to coast',
    date: '2026-07-06',
    endDate: '2026-07-08',
    allDay: true,
    type: 'event',
    category: 'personal',
  },
  {
    id: 'piano-3',
    title: 'Piano lesson',
    date: '2026-07-10',
    startTime: '11:30',
    endTime: '12:15',
    type: 'lesson',
    category: 'lesson',
    recurring: true,
  },
  {
    id: 'report-due',
    title: 'Report due',
    date: '2026-07-09',
    type: 'task',
    category: 'task',
  },
  {
    id: 'grocery',
    title: 'Grocery shopping',
    date: '2026-07-15',
    type: 'task',
    category: 'task',
  },
];

export const dayMeta: Record<string, DayMeta> = {
  '2026-07-01': { spend: 42, mood: '🙂', weather: '☀️' },
  '2026-07-02': { spend: 18 },
  '2026-07-03': { mood: '😐', weather: '🌧️' },
};
