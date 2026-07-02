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
