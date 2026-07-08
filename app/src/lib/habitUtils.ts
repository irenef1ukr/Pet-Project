import { addDaysIso, fromISODate } from './dateUtils';
import { formatShortDate } from './todoUtils';
import type { Habit } from '../types';

export const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const GRACE_PERIOD_DAYS = 2;

export interface HabitCategoryColors {
  tagBg: string;
  tagText: string;
  accent: string;
  accentSoft: string;
}

const HABIT_CATEGORY_PALETTE: HabitCategoryColors[] = [
  { tagBg: 'oklch(0.94 0.06 25)', tagText: 'oklch(0.48 0.18 25)', accent: 'oklch(0.62 0.19 27)', accentSoft: 'oklch(0.85 0.09 27 / 0.6)' },
  { tagBg: 'oklch(0.93 0.09 90)', tagText: 'oklch(0.44 0.12 80)', accent: 'oklch(0.75 0.16 88)', accentSoft: 'oklch(0.9 0.09 88 / 0.6)' },
  { tagBg: 'oklch(0.92 0.07 150)', tagText: 'oklch(0.42 0.13 150)', accent: 'oklch(0.66 0.16 150)', accentSoft: 'oklch(0.87 0.09 150 / 0.6)' },
  { tagBg: 'oklch(0.92 0.05 235)', tagText: 'oklch(0.44 0.12 235)', accent: 'oklch(0.62 0.14 235)', accentSoft: 'oklch(0.85 0.07 235 / 0.6)' },
  { tagBg: 'oklch(0.92 0.07 320)', tagText: 'oklch(0.44 0.13 320)', accent: 'oklch(0.6 0.16 320)', accentSoft: 'oklch(0.86 0.08 320 / 0.6)' },
];

export function habitCategoryColors(index: number): HabitCategoryColors {
  return HABIT_CATEGORY_PALETTE[index % HABIT_CATEGORY_PALETTE.length];
}

/** Mon-first day index: 0=Mon .. 6=Sun (Date#getDay is 0=Sun..6=Sat). */
export function monFirstDay(iso: string): number {
  return (fromISODate(iso).getDay() + 6) % 7;
}

export function mondayOfIso(iso: string): string {
  return addDaysIso(iso, -monFirstDay(iso));
}

export function isScheduled(habit: Pick<Habit, 'frequencyType' | 'activeDays'>, dateIso: string): boolean {
  if (habit.frequencyType === 'daily') return true;
  return habit.activeDays.includes(monFirstDay(dateIso));
}

/**
 * Counts back from today, allowing up to GRACE_PERIOD_DAYS consecutive missed
 * scheduled days before the streak is considered broken. Today itself is never
 * treated as "missed" since the day isn't over yet.
 */
export function computeStreak(habit: Habit, todayIso: string, graceDays = GRACE_PERIOD_DAYS): number {
  let streak = 0;
  let missedRun = 0;
  let d = todayIso;
  for (let i = 0; i < 400; i++) {
    if (isScheduled(habit, d)) {
      if (d in habit.completions) {
        streak++;
        missedRun = 0;
      } else if (d !== todayIso) {
        missedRun++;
        if (missedRun > graceDays) break;
      }
    }
    d = addDaysIso(d, -1);
  }
  return streak;
}

export function completionRate(habit: Habit, todayIso: string, days: number): number {
  let scheduled = 0;
  let done = 0;
  let d = todayIso;
  for (let i = 0; i < days; i++) {
    if (isScheduled(habit, d)) {
      scheduled++;
      if (d in habit.completions) done++;
    }
    d = addDaysIso(d, -1);
  }
  return scheduled ? Math.round((done / scheduled) * 100) : 0;
}

export function frequencyLabel(habit: Pick<Habit, 'frequencyType' | 'activeDays'>): string {
  if (habit.frequencyType === 'daily') return 'Every day';
  if (habit.activeDays.length === 0) return 'No days set';
  return habit.activeDays
    .slice()
    .sort((a, b) => a - b)
    .map((i) => DAY_NAMES[i])
    .join(', ');
}

export interface HabitWeekDay {
  iso: string;
  letter: string;
  scheduled: boolean;
  done: boolean;
  future: boolean;
  clickable: boolean;
}

export function buildWeekDays(habit: Habit, todayIso: string): HabitWeekDay[] {
  const monday = mondayOfIso(todayIso);
  return Array.from({ length: 7 }, (_, i) => {
    const iso = addDaysIso(monday, i);
    const scheduled = isScheduled(habit, iso);
    const future = iso > todayIso;
    return {
      iso,
      letter: DAY_LETTERS[i],
      scheduled,
      done: iso in habit.completions,
      future,
      clickable: scheduled && !future,
    };
  });
}

export interface HabitHeatmapCell {
  iso: string;
  label: string;
  scheduled: boolean;
  done: boolean;
}

export function buildHeatmapCells(habit: Habit, todayIso: string, days = 63): HabitHeatmapCell[] {
  const cells: HabitHeatmapCell[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const iso = addDaysIso(todayIso, -i);
    cells.push({
      iso,
      label: formatShortDate(iso),
      scheduled: isScheduled(habit, iso),
      done: iso in habit.completions,
    });
  }
  return cells;
}

export interface HabitHistoryEntry {
  iso: string;
  label: string;
  done: boolean;
  note: string;
}

export function buildHistory(habit: Habit, todayIso: string, days = 30): HabitHistoryEntry[] {
  const entries: HabitHistoryEntry[] = [];
  let d = todayIso;
  for (let i = 0; i < days; i++) {
    if (isScheduled(habit, d)) {
      entries.push({
        iso: d,
        label: formatShortDate(d),
        done: d in habit.completions,
        note: habit.completions[d] ?? '',
      });
    }
    d = addDaysIso(d, -1);
  }
  return entries;
}
