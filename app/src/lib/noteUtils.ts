import type { Note } from '../types';

export function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || '').trim();
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function notePreview(note: Note, max = 90): string {
  return truncate(stripHtml(note.bodyHtml), max);
}

/** Strips a leading '#' and normalizes case/whitespace so tags dedupe consistently. */
export function normalizeTag(raw: string): string {
  return raw.trim().replace(/^#/, '').toLowerCase();
}

/** Unique tags across all notes, most-used first. */
export function allTags(notes: Note[]): string[] {
  const tally: Record<string, number> = {};
  notes.forEach((n) => n.tags.forEach((t) => { tally[t] = (tally[t] || 0) + 1; }));
  return Object.keys(tally).sort((a, b) => tally[b] - tally[a] || a.localeCompare(b));
}

/** Most recently updated first. */
export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}
