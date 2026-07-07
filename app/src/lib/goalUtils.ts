import type { Goal, GoalStatus, TodoTask } from '../types';
import { formatShortDate } from './todoUtils';

export const GOAL_STATUS_ORDER: GoalStatus[] = ['not_started', 'in_progress', 'completed', 'on_hold'];

export const GOAL_STATUS_LABEL: Record<GoalStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
};

export function goalDueLabel(goal: Pick<Goal, 'dueDate'>) {
  return goal.dueDate ? `Due ${formatShortDate(goal.dueDate)}` : 'No due date';
}

export function goalTasks(tasks: TodoTask[], goalId: string) {
  return tasks.filter((t) => t.goalId === goalId);
}

export function goalTaskCountLabel(tasks: TodoTask[], goalId: string) {
  const linked = goalTasks(tasks, goalId);
  const remaining = linked.filter((t) => t.status !== 'complete').length;
  return `${remaining}/${linked.length} tasks`;
}
