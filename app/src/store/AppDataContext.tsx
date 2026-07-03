import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { calendarEvents, todoCategories, todoTasks } from '../data/mockData';
import { generateId, nextStatus } from '../lib/todoUtils';
import type {
  CalendarEvent,
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
    recurring: task.recurring !== 'none',
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TodoTask[]>(todoTasks);
  const [categories, setCategories] = useState<TodoCategory[]>(todoCategories);
  const [events] = useState<CalendarEvent[]>(calendarEvents);

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
    };
  }, [tasks, categories, events]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
