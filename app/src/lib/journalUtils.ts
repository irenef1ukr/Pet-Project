import { addDaysIso, fromISODate } from './dateUtils';
import type { JournalEntry } from '../types';

export const JOURNAL_PROMPTS = [
  'What made you smile today?',
  'What are you grateful for right now?',
  "What's one thing you'd like to let go of?",
  'Describe a small win from today.',
  "What's on your mind that you haven't said out loud?",
];

export function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || '').trim();
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function entryPreview(entry: JournalEntry, max = 60): string {
  return truncate(stripHtml(entry.bodyHtml), max);
}

export function computeStreak(entries: JournalEntry[], todayIso: string): number {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  let cursor = todayIso;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDaysIso(cursor, -1);
  }
  return streak;
}

export function monthEntryCount(entries: JournalEntry[], todayIso: string): number {
  const monthPrefix = todayIso.slice(0, 7);
  return entries.filter((e) => e.date.startsWith(monthPrefix)).length;
}

export function topMood(entries: JournalEntry[]): string | null {
  const tally: Record<string, number> = {};
  entries.forEach((e) => {
    if (e.mood) tally[e.mood] = (tally[e.mood] || 0) + 1;
  });
  const moods = Object.keys(tally);
  if (!moods.length) return null;
  return moods.sort((a, b) => tally[b] - tally[a])[0];
}

export function onThisDayEntries(entries: JournalEntry[], today: Date): JournalEntry[] {
  return entries
    .filter((e) => {
      const d = fromISODate(e.date);
      return (
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate() &&
        d.getFullYear() !== today.getFullYear()
      );
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
