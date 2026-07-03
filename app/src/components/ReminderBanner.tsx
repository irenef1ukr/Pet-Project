import { useEffect, useState } from 'react';
import { useAppData } from '../store/AppDataContext';
import type { CalendarEvent } from '../types';
import './ReminderBanner.css';

function eventStartDateTime(event: CalendarEvent): Date | null {
  const [y, m, d] = event.date.split('-').map(Number);
  if (event.allDay) return new Date(y, m - 1, d, 0, 0);
  if (!event.startTime) return null;
  const [h, min] = event.startTime.split(':').map(Number);
  return new Date(y, m - 1, d, h, min);
}

interface DueReminder {
  key: string;
  title: string;
  start: Date;
}

export function ReminderBanner() {
  const { events } = useAppData();
  const [now, setNow] = useState(() => new Date());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const due: DueReminder[] = events.flatMap((event) => {
    if (!event.reminders || event.reminders.length === 0) return [];
    const start = eventStartDateTime(event);
    if (!start) return [];
    return event.reminders
      .filter((minutes) => {
        const key = `${event.id}-${minutes}`;
        if (dismissed.has(key)) return false;
        const trigger = new Date(start.getTime() - minutes * 60000);
        return now >= trigger && now < start;
      })
      .map((minutes) => ({ key: `${event.id}-${minutes}`, title: event.title, start }));
  });

  if (due.length === 0) return null;

  return (
    <div className="reminder-stack">
      {due.map(({ key, title, start }) => (
        <div key={key} className="reminder-banner">
          <span className="reminder-banner__text">
            🔔 {title} at {start.getHours()}:{String(start.getMinutes()).padStart(2, '0')}
          </span>
          <button
            type="button"
            className="reminder-banner__dismiss"
            onClick={() => setDismissed((prev) => new Set(prev).add(key))}
            aria-label="Dismiss reminder"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
