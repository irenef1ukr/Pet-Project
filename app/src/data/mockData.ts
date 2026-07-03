import type {
  CalendarEvent,
  DayMeta,
  FinanceSummary,
  Goal,
  Habit,
  JournalEntry,
  TodoCategory,
  TodoTask,
} from '../types';

export const NOW_TIME = '12:40';

export const TODAY_ISO = '2026-07-01';
export const TODAY_DATE = new Date(2026, 6, 1);

export const userName = 'Iryna';
export const greetingDate = 'Monday, July 1';
export const greetingQuote = 'small steps every day';

export const moodOptions = ['🙂', '😁', '😐', '🙁', '😢'];
export const weatherOptions = ['☀️', '⛅', '🌧️', '❄️'];

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
