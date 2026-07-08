import type { HabitWeekDay } from '../../lib/habitUtils';

export interface HabitListItem {
  id: string;
  title: string;
  frequencyLabel: string;
  streak: number;
  rateLabel: string;
  week: HabitWeekDay[];
  archived: boolean;
}
