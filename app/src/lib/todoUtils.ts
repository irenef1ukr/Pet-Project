import type { TodoPriority, TodoStatus, TodoTask } from '../types';

export const PRIORITY_COLOR: Record<TodoPriority, string> = {
  High: 'oklch(0.65 0.28 25)',
  Medium: 'oklch(0.65 0.28 60)',
  Low: 'oklch(0.65 0.28 120)',
};

export const PRIORITY_RANK: Record<TodoPriority, number> = { High: 0, Medium: 1, Low: 2 };

export const STATUS_PURPLE = 'oklch(0.55 0.2 290)';

export const STATUS_ORDER: TodoStatus[] = ['not_started', 'in_progress', 'complete'];

export const STATUS_LABEL: Record<TodoStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
};

export function nextStatus(status: TodoStatus): TodoStatus {
  return STATUS_ORDER[(STATUS_ORDER.indexOf(status) + 1) % STATUS_ORDER.length];
}

export function isOverdue(task: TodoTask, today: string) {
  return Boolean(task.dueDate) && task.dueDate < today && task.status !== 'complete';
}

export function isMyDay(task: TodoTask, today: string) {
  return task.dueDate === today || isOverdue(task, today) || task.status === 'in_progress';
}

export function formatShortDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function dueLabel(task: TodoTask, today: string) {
  if (!task.dueDate) return 'No due date';
  if (isOverdue(task, today)) return 'Overdue';
  if (task.dueDate === today) return 'Today';
  return formatShortDate(task.dueDate);
}

export function dueColor(task: TodoTask, today: string) {
  return isOverdue(task, today) ? 'oklch(0.6 0.28 25)' : 'oklch(0.5 0.05 240)';
}

export function sortTasks(tasks: TodoTask[], sortBy: 'dueDate' | 'priority') {
  const arr = [...tasks];
  if (sortBy === 'dueDate') {
    arr.sort((a, b) => (a.dueDate || '9999-99-99').localeCompare(b.dueDate || '9999-99-99'));
  } else {
    arr.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  }
  return arr;
}

export interface StatusVisual {
  background: string;
  border: string;
  borderRadius: string;
  showCheck: boolean;
}

export function statusVisual(status: TodoStatus): StatusVisual {
  if (status === 'complete') {
    return { background: STATUS_PURPLE, border: `2px solid ${STATUS_PURPLE}`, borderRadius: '6px', showCheck: true };
  }
  if (status === 'in_progress') {
    return {
      background: `conic-gradient(${STATUS_PURPLE} 0deg 180deg, #fff 180deg 360deg)`,
      border: `2px solid ${STATUS_PURPLE}`,
      borderRadius: '50%',
      showCheck: false,
    };
  }
  return { background: '#fff', border: '2px solid oklch(0.75 0.03 240)', borderRadius: '6px', showCheck: false };
}

let nextId = 1;
export function generateId(prefix: string) {
  nextId += 1;
  return `${prefix}-${Date.now()}-${nextId}`;
}
