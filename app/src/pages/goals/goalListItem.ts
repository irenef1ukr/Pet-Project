import type { GoalStatus } from '../../types';

export interface GoalListItem {
  id: string;
  title: string;
  status: GoalStatus;
  percent: number;
  dueLabel: string;
  hasTasks: boolean;
  taskCountLabel: string;
  hasJournalLinks: boolean;
  journalCountLabel: string;
}
