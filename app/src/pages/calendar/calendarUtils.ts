import { addDaysIso, fromISODate, pad2, toISODate } from '../../lib/dateUtils';
import type { CalendarEvent, CalendarEventCategory, CalendarEventType } from '../../types';

export { addDaysIso, fromISODate, pad2, toISODate };

export const EVENT_TYPE_ICON: Record<CalendarEventType, string> = {
  event: '●',
  task: '☐',
  lesson: '🎓',
};

export const CATEGORY_COLOR: Record<CalendarEventCategory, string> = {
  work: 'oklch(0.64 0.22 280)',
  personal: 'oklch(0.68 0.25 20)',
  lesson: 'oklch(0.65 0.18 160)',
  task: 'oklch(0.5 0.08 0)',
};

export const COLOR_SWATCHES = [
  'oklch(0.64 0.22 280)',
  'oklch(0.68 0.25 20)',
  'oklch(0.65 0.18 160)',
  'oklch(0.6 0.2 230)',
  'oklch(0.65 0.2 100)',
  'oklch(0.6 0.22 340)',
];

export function eventColor(event: CalendarEvent): string {
  return event.colorOverride ?? CATEGORY_COLOR[event.category];
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

// Monday-start weekday index (0 = Monday .. 6 = Sunday)
export function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function startOfWeekMonday(date: Date) {
  return addDays(date, -mondayIndex(date));
}

export function getWeekDays(date: Date) {
  const start = startOfWeekMonday(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getMonthGridDays(date: Date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const gridStart = startOfWeekMonday(firstOfMonth);
  const gridEnd = addDays(startOfWeekMonday(lastOfMonth), 6);

  const days: { date: Date; inCurrentMonth: boolean }[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push({ date: d, inCurrentMonth: d.getMonth() === date.getMonth() });
  }
  return days;
}

export function formatMonthYear(date: Date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatWeekRange(days: Date[]) {
  const start = days[0];
  const end = days[days.length - 1];
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = `${MONTH_SHORT[start.getMonth()]} ${start.getDate()}`;
  const endLabel = sameMonth ? `${end.getDate()}` : `${MONTH_SHORT[end.getMonth()]} ${end.getDate()}`;
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`;
}

export function formatDayHeading(date: Date) {
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatShortDate(date: Date) {
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatHourLabel(hour: number) {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

export function eventsOnDate(events: CalendarEvent[], date: Date) {
  const iso = toISODate(date);
  return events.filter((e) => !e.allDay && e.date === iso);
}

export function allDayEventsInRange(events: CalendarEvent[], rangeStart: Date, rangeEnd: Date) {
  return events.filter((e) => {
    if (!e.allDay) return false;
    const start = e.date;
    const end = e.endDate ?? e.date;
    return start <= toISODate(rangeEnd) && end >= toISODate(rangeStart);
  });
}

export function getUpcomingEvents(events: CalendarEvent[], fromDate: Date, limit: number) {
  const fromIso = toISODate(fromDate);
  return [...events]
    .filter((e) => (e.endDate ?? e.date) >= fromIso)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      const aTime = a.startTime ?? '00:00';
      const bTime = b.startTime ?? '00:00';
      return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
    })
    .slice(0, limit);
}
