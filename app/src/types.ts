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
  streakCount: number;
  lastCompletedDate: string | null;
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

export type FinancePeriod = 'day' | 'week' | 'month';

export interface FinanceCategory {
  id: string;
  name: string;
  emoji: string;
  hue: number;
  budget: number;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  desc: string;
  categoryId: string;
  amount: number;
}

export interface FinanceTransactionDraft {
  date: string;
  desc: string;
  categoryId: string;
  amount: string;
}

export interface FinanceBudgetDraft {
  categoryId: string;
  amount: string;
}

export interface FinanceNewCategoryDraft {
  emoji: string;
  name: string;
  hue: number;
}

export interface JournalFolder {
  id: string;
  name: string;
}

export type JournalMediaType = 'image' | 'video' | '';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  bodyHtml: string;
  mood: string;
  weather: string;
  folderId: string;
  goalId: string;
  mediaUrl: string;
  mediaType: JournalMediaType;
}

export interface JournalEntryDraft {
  title: string;
  date: string;
  bodyHtml: string;
  mood: string;
  weather: string;
  folderId: string;
  goalId: string;
  mediaUrl: string;
  mediaType: JournalMediaType;
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
  recurring: TodoRecurrence;
  colorOverride?: string;
  /** Minutes before the event start to show an in-app reminder banner. */
  reminders?: number[];
}

export interface CalendarEventDraft {
  title: string;
  type: CalendarEventType;
  category: CalendarEventCategory;
  date: string;
  endDate?: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  recurring: TodoRecurrence;
  colorOverride?: string;
  reminders: number[];
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

export interface TaskEditPatch {
  status: TodoStatus;
  priority: TodoPriority;
  categoryId: string;
  dueDate: string;
  recurring: TodoRecurrence;
  description: string;
  subtasks: TodoSubtask[];
}

export interface TaskCreateDraft {
  title: string;
  priority: TodoPriority;
  dueDate: string;
  categoryId: string;
  recurring: TodoRecurrence;
  subtasks: TodoSubtask[];
  description: string;
}
