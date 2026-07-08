import { addDaysIso, fromISODate } from './dateUtils';
import { mondayOfIso } from './habitUtils';
import type { CalendarEvent, Lesson, LessonSubject } from '../types';

export const LESSON_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const LESSON_DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatLessonDateHeading(iso: string): string {
  const d = fromISODate(iso);
  return `${WEEKDAY_FULL[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

export interface LessonSubjectColors {
  tagBg: string;
  tagText: string;
  accent: string;
  accentSoft: string;
}

const LESSON_SUBJECT_PALETTE: LessonSubjectColors[] = [
  { tagBg: 'oklch(0.93 0.04 235)', tagText: 'oklch(0.42 0.12 235)', accent: 'oklch(0.6 0.14 235)', accentSoft: 'oklch(0.88 0.05 235 / 0.6)' },
  { tagBg: 'oklch(0.92 0.06 300)', tagText: 'oklch(0.42 0.14 300)', accent: 'oklch(0.58 0.18 300)', accentSoft: 'oklch(0.87 0.08 300 / 0.6)' },
  { tagBg: 'oklch(0.92 0.08 80)', tagText: 'oklch(0.44 0.1 55)', accent: 'oklch(0.62 0.13 65)', accentSoft: 'oklch(0.88 0.09 80 / 0.6)' },
  { tagBg: 'oklch(0.93 0.05 210)', tagText: 'oklch(0.44 0.1 220)', accent: 'oklch(0.68 0.1 210)', accentSoft: 'oklch(0.9 0.05 210 / 0.6)' },
];

export function lessonSubjectColors(index: number): LessonSubjectColors {
  return LESSON_SUBJECT_PALETTE[index % LESSON_SUBJECT_PALETTE.length];
}

export function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

export function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

export const LESSON_TIME_OPTIONS = Array.from({ length: 23 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 30;
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  const time = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  return { value: time, label: formatTime12h(time) };
});

export const LESSON_DURATION_OPTIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function subjectProgress(lessons: Lesson[], subjectId: string) {
  const forSubject = lessons.filter((l) => l.subjectId === subjectId);
  const done = forSubject.filter((l) => l.status === 'done').length;
  return { done, total: forSubject.length };
}

const LESSON_SYNC_WEEKS_BACK = 8;
const LESSON_SYNC_WEEKS_FORWARD = 26;

/** Projects each weekly-recurring lesson onto real calendar dates so it can be synced into the Calendar module. */
export function lessonsToCalendarEvents(lessons: Lesson[], subjects: LessonSubject[], todayIso: string): CalendarEvent[] {
  const monday = mondayOfIso(todayIso);
  const events: CalendarEvent[] = [];
  for (const lesson of lessons) {
    const subjectIndex = subjects.findIndex((s) => s.id === lesson.subjectId);
    const color = lessonSubjectColors(Math.max(subjectIndex, 0)).accent;
    for (let w = -LESSON_SYNC_WEEKS_BACK; w <= LESSON_SYNC_WEEKS_FORWARD; w++) {
      const weekMonday = addDaysIso(monday, w * 7);
      const date = addDaysIso(weekMonday, lesson.day);
      events.push({
        id: `lesson-${lesson.id}-${date}`,
        title: lesson.objective,
        date,
        startTime: lesson.startTime,
        endTime: addMinutesToTime(lesson.startTime, lesson.durationMinutes),
        type: 'lesson',
        category: 'lesson',
        recurring: 'weekly',
        colorOverride: color,
      });
    }
  }
  return events;
}
