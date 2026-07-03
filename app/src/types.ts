export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface DashboardTask {
  id: string;
  label: string;
  status: TaskStatus;
  overdue?: boolean;
  recurring?: boolean;
}

export interface DashboardEvent {
  id: string;
  time: string;
  title: string;
  recurring?: boolean;
}

export interface Habit {
  id: string;
  label: string;
  done: boolean;
}

export interface Goal {
  id: string;
  label: string;
  percent: number;
  active: boolean;
}

export interface FinanceSummary {
  spentThisMonth: number;
  spentYesterday: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  preview: string;
}

export type CalendarView = 'month' | 'week' | 'day';

export type CalendarEventType = 'event' | 'task' | 'lesson';

export type CalendarEventCategory = 'work' | 'personal' | 'lesson' | 'task';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  type: CalendarEventType;
  category: CalendarEventCategory;
  recurring?: boolean;
}

export interface DayMeta {
  spend?: number;
  mood?: string;
  weather?: string;
}

export type TodoStatus = 'not_started' | 'in_progress' | 'complete';

export type TodoPriority = 'High' | 'Medium' | 'Low';

export type TodoRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TodoCategory {
  id: string;
  name: string;
}

export interface TodoSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoTask {
  id: string;
  title: string;
  categoryId: string;
  priority: TodoPriority;
  dueDate: string;
  status: TodoStatus;
  recurring: TodoRecurrence;
  subtasks: TodoSubtask[];
  description: string;
}
