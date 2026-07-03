import type { CalendarEvent } from '../../types';
import { EVENT_TYPE_ICON, eventColor, formatShortDate, fromISODate } from './calendarUtils';
import '../../components/modal-shared.css';
import './EventDetailModal.css';

const RECURRENCE_LABEL: Record<string, string> = {
  none: 'Does not repeat',
  daily: 'Repeats daily',
  weekly: 'Repeats weekly',
  monthly: 'Repeats monthly',
};

const REMINDER_LABEL: Record<number, string> = {
  15: '15 minutes before',
  60: '1 hour before',
  1440: '1 day before',
};

interface EventDetailModalProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EventDetailModal({ event, onEdit, onDelete, onClose }: EventDetailModalProps) {
  const dateLabel = event.allDay
    ? event.endDate && event.endDate !== event.date
      ? `${formatShortDate(fromISODate(event.date))} – ${formatShortDate(fromISODate(event.endDate))} (all day)`
      : `${formatShortDate(fromISODate(event.date))} (all day)`
    : `${formatShortDate(fromISODate(event.date))}${event.startTime ? ` · ${event.startTime}` : ''}${
        event.endTime ? `–${event.endTime}` : ''
      }`;

  return (
    <div className="modal-overlay">
      <div className="modal-card event-detail">
        <div className="modal-card__header">
          <h2 className="modal-card__title">
            <span className="event-detail__icon" style={{ background: eventColor(event) }}>
              {EVENT_TYPE_ICON[event.type]}
            </span>
            {event.title}
          </h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="event-detail__body">
          <div className="event-detail__row">
            <span className="event-detail__label">When</span>
            <span>
              {dateLabel}
              {event.recurring !== 'none' && ` · ↻ ${RECURRENCE_LABEL[event.recurring]}`}
            </span>
          </div>
          {event.reminders && event.reminders.length > 0 && (
            <div className="event-detail__row">
              <span className="event-detail__label">Reminders</span>
              <span>{event.reminders.map((m) => REMINDER_LABEL[m] ?? `${m} min before`).join(', ')}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="modal-actions__cancel" onClick={onDelete}>
              Delete
            </button>
            <button type="button" className="modal-actions__primary" onClick={onEdit}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
