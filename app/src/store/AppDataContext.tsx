import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  calendarEvents,
  financeCategories,
  financeTransactions,
  initialGoals,
  initialJournalEntries,
  initialJournalFolders,
  todoCategories,
  todoTasks,
} from '../data/mockData';
import { generateId, nextStatus } from '../lib/todoUtils';
import { useLocalStorageState } from '../lib/useLocalStorageState';
import type {
  CalendarEvent,
  CalendarEventDraft,
  FinanceCategory,
  FinanceTransaction,
  Goal,
  JournalEntry,
  JournalEntryDraft,
  JournalFolder,
  TaskCreateDraft,
  TaskEditPatch,
  TodoCategory,
  TodoPriority,
  TodoTask,
} from '../types';

interface AppDataContextValue {
  tasks: TodoTask[];
  categories: TodoCategory[];
  events: CalendarEvent[];
  calendarEntries: CalendarEvent[];
  cycleTaskStatus: (id: string) => void;
  renameTaskTitle: (id: string, title: string) => void;
  changeTaskPriority: (id: string, priority: TodoPriority) => void;
  changeTaskCategory: (id: string, categoryId: string) => void;
  saveTaskEdits: (id: string, patch: TaskEditPatch) => void;
  createTask: (draft: TaskCreateDraft) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  createEvent: (draft: CalendarEventDraft) => void;
  updateEvent: (id: string, draft: CalendarEventDraft) => void;
  deleteEvent: (id: string) => void;
  financeCategories: FinanceCategory[];
  financeTransactions: FinanceTransaction[];
  addTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Omit<FinanceTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addFinanceCategory: (category: Omit<FinanceCategory, 'id'>) => void;
  renameFinanceCategory: (id: string, name: string) => void;
  changeFinanceCategoryEmoji: (id: string, emoji: string) => void;
  deleteFinanceCategory: (id: string) => void;
  setCategoryBudget: (id: string, budget: number) => void;
  goals: Goal[];
  addGoal: (label: string) => Goal;
  journalFolders: JournalFolder[];
  addJournalFolder: (name: string) => void;
  renameJournalFolder: (id: string, name: string) => void;
  deleteJournalFolder: (id: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (draft: JournalEntryDraft) => void;
  updateJournalEntry: (id: string, draft: JournalEntryDraft) => void;
  deleteJournalEntry: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function taskToCalendarEvent(task: TodoTask): CalendarEvent | null {
  if (!task.dueDate) return null;
  return {
    id: `task-${task.id}`,
    title: task.title,
    date: task.dueDate,
    type: 'task',
    category: 'task',
    recurring: task.recurring,
  };
}

function draftToEvent(id: string, draft: CalendarEventDraft): CalendarEvent {
  return {
    id,
    title: draft.title,
    date: draft.date,
    endDate: draft.allDay ? draft.endDate : undefined,
    startTime: draft.allDay ? undefined : draft.startTime,
    endTime: draft.allDay ? undefined : draft.endTime,
    allDay: draft.allDay,
    type: draft.type,
    category: draft.category,
    recurring: draft.recurring,
    colorOverride: draft.colorOverride,
    reminders: draft.reminders,
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorageState<TodoTask[]>('hi-app:tasks', todoTasks);
  const [categories, setCategories] = useLocalStorageState<TodoCategory[]>('hi-app:categories', todoCategories);
  const [events, setEvents] = useLocalStorageState<CalendarEvent[]>('hi-app:events', calendarEvents);
  const [financeCats, setFinanceCats] = useLocalStorageState<FinanceCategory[]>(
    'hi-app:finance-categories',
    financeCategories,
  );
  const [financeTxs, setFinanceTxs] = useLocalStorageState<FinanceTransaction[]>(
    'hi-app:finance-transactions',
    financeTransactions,
  );
  const [goals, setGoals] = useLocalStorageState<Goal[]>('hi-app:goals', initialGoals);
  const [journalFolders, setJournalFolders] = useLocalStorageState<JournalFolder[]>(
    'hi-app:journal-folders',
    initialJournalFolders,
  );
  const [journalEntries, setJournalEntries] = useLocalStorageState<JournalEntry[]>(
    'hi-app:journal-entries',
    initialJournalEntries,
  );

  const value = useMemo<AppDataContextValue>(() => {
    const calendarEntries = [...events, ...tasks.map(taskToCalendarEvent).filter((e): e is CalendarEvent => e !== null)];

    return {
      tasks,
      categories,
      events,
      calendarEntries,
      cycleTaskStatus: (id) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t))),
      renameTaskTitle: (id, title) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t))),
      changeTaskPriority: (id, priority) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t))),
      changeTaskCategory: (id, categoryId) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, categoryId } : t))),
      saveTaskEdits: (id, patch) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      createTask: (draft) =>
        setTasks((prev) => [
          ...prev,
          {
            id: generateId('task'),
            title: draft.title,
            categoryId: draft.categoryId || categories[0]?.id || '',
            priority: draft.priority,
            dueDate: draft.dueDate,
            status: 'not_started',
            recurring: draft.recurring,
            subtasks: draft.subtasks,
            description: draft.description,
          },
        ]),
      deleteTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
      addCategory: (name) => setCategories((prev) => [...prev, { id: generateId('cat'), name }]),
      renameCategory: (id, name) => setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      deleteCategory: (id) => setCategories((prev) => prev.filter((c) => c.id !== id)),
      createEvent: (draft) => setEvents((prev) => [...prev, draftToEvent(generateId('event'), draft)]),
      updateEvent: (id, draft) =>
        setEvents((prev) => prev.map((e) => (e.id === id ? draftToEvent(id, draft) : e))),
      deleteEvent: (id) => setEvents((prev) => prev.filter((e) => e.id !== id)),
      financeCategories: financeCats,
      financeTransactions: financeTxs,
      addTransaction: (tx) => setFinanceTxs((prev) => [...prev, { ...tx, id: generateId('tx') }]),
      updateTransaction: (id, patch) =>
        setFinanceTxs((prev) => prev.map((t) => (t.id === id ? { ...patch, id } : t))),
      deleteTransaction: (id) => setFinanceTxs((prev) => prev.filter((t) => t.id !== id)),
      addFinanceCategory: (category) =>
        setFinanceCats((prev) => [...prev, { ...category, id: generateId('fcat') }]),
      renameFinanceCategory: (id, name) =>
        setFinanceCats((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))),
      changeFinanceCategoryEmoji: (id, emoji) =>
        setFinanceCats((prev) => prev.map((c) => (c.id === id ? { ...c, emoji } : c))),
      deleteFinanceCategory: (id) => setFinanceCats((prev) => prev.filter((c) => c.id !== id)),
      setCategoryBudget: (id, budget) =>
        setFinanceCats((prev) => prev.map((c) => (c.id === id ? { ...c, budget } : c))),
      goals,
      addGoal: (label) => {
        const goal: Goal = { id: generateId('goal'), label, percent: 0, active: true };
        setGoals((prev) => [...prev, goal]);
        return goal;
      },
      journalFolders,
      addJournalFolder: (name) => setJournalFolders((prev) => [...prev, { id: generateId('folder'), name }]),
      renameJournalFolder: (id, name) =>
        setJournalFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f))),
      deleteJournalFolder: (id) => {
        setJournalFolders((prev) => prev.filter((f) => f.id !== id));
        setJournalEntries((prev) => prev.map((e) => (e.folderId === id ? { ...e, folderId: 'general' } : e)));
      },
      journalEntries,
      addJournalEntry: (draft) => setJournalEntries((prev) => [{ ...draft, id: generateId('jentry') }, ...prev]),
      updateJournalEntry: (id, draft) =>
        setJournalEntries((prev) => prev.map((e) => (e.id === id ? { ...draft, id } : e))),
      deleteJournalEntry: (id) => setJournalEntries((prev) => prev.filter((e) => e.id !== id)),
    };
  }, [
    tasks,
    categories,
    events,
    financeCats,
    financeTxs,
    goals,
    journalFolders,
    journalEntries,
    setTasks,
    setCategories,
    setEvents,
    setFinanceCats,
    setFinanceTxs,
    setGoals,
    setJournalFolders,
    setJournalEntries,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
