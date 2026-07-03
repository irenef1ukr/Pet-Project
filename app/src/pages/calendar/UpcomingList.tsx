import type { CalendarEvent } from '../../types';
import { EVENT_TYPE_ICON, eventColor, formatShortDate, fromISODate } from './calendarUtils';
import './UpcomingList.css';

interface UpcomingListProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function UpcomingList({ events, onSelectEvent }: UpcomingListProps) {
  return (
    <div className="upcoming-list">
      <span className="upcoming-list__title">Upcoming</span>
      {events.length === 0 ? (
        <span className="upcoming-list__empty">Nothing coming up</span>
      ) : (
        <div className="upcoming-list__rows">
          {events.map((e) => {
            const isRealEvent = !e.id.startsWith('task-');
            return (
              <div
                key={e.id}
                className={`upcoming-list__row${isRealEvent ? ' upcoming-list__row--clickable' : ''}`}
                onClick={isRealEvent ? () => onSelectEvent(e) : undefined}
              >
                <span className="upcoming-list__badge" style={{ background: eventColor(e) }}>
                  {EVENT_TYPE_ICON[e.type]}
                </span>
                <span className="upcoming-list__label">
                  {formatShortDate(fromISODate(e.date))} · {e.title}
                  {e.recurring !== 'none' ? ' ↻' : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
