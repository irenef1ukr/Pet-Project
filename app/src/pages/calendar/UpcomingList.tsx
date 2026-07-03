import type { CalendarEvent } from '../../types';
import { CATEGORY_COLOR, EVENT_TYPE_ICON, formatShortDate, fromISODate } from './calendarUtils';
import './UpcomingList.css';

interface UpcomingListProps {
  events: CalendarEvent[];
}

export function UpcomingList({ events }: UpcomingListProps) {
  return (
    <div className="upcoming-list">
      <span className="upcoming-list__title">Upcoming</span>
      {events.length === 0 ? (
        <span className="upcoming-list__empty">Nothing coming up</span>
      ) : (
        <div className="upcoming-list__rows">
          {events.map((e) => (
            <div key={e.id} className="upcoming-list__row">
              <span className="upcoming-list__badge" style={{ background: CATEGORY_COLOR[e.category] }}>
                {EVENT_TYPE_ICON[e.type]}
              </span>
              <span className="upcoming-list__label">
                {formatShortDate(fromISODate(e.date))} · {e.title}
                {e.recurring ? ' ↻' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
