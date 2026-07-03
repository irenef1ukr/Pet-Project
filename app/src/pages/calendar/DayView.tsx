import type { CalendarEvent, DayMeta } from '../../types';
import {
  EVENT_TYPE_ICON,
  allDayEventsInRange,
  eventColor,
  eventsOnDate,
  formatDayHeading,
  isSameDay,
  timeToMinutes,
  toISODate,
} from './calendarUtils';
import './DayView.css';

interface DayViewProps {
  selectedDate: Date;
  today: Date;
  nowTime: string;
  events: CalendarEvent[];
  dayMeta: Record<string, DayMeta>;
  onPrev: () => void;
  onNext: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onNavigateFinance: () => void;
}

export function DayView({
  selectedDate,
  today,
  nowTime,
  events,
  dayMeta,
  onPrev,
  onNext,
  onSelectEvent,
  onNavigateFinance,
}: DayViewProps) {
  const iso = toISODate(selectedDate);
  const meta = dayMeta[iso];
  const allDay = allDayEventsInRange(events, selectedDate, selectedDate);
  const timed = eventsOnDate(events, selectedDate).sort((a, b) => {
    const aTime = a.startTime ?? '99:99';
    const bTime = b.startTime ?? '99:99';
    return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
  });

  const isToday = isSameDay(selectedDate, today);
  const isPastDay = selectedDate < today && !isToday;
  const nowMinutes = timeToMinutes(nowTime);

  return (
    <div className="calendar-panel">
      <div className="calendar-panel__header">
        <button type="button" className="calendar-panel__arrow" onClick={onPrev} aria-label="Previous day">
          ‹
        </button>
        <span className="calendar-panel__header-label">{formatDayHeading(selectedDate)}</span>
        <button type="button" className="calendar-panel__arrow" onClick={onNext} aria-label="Next day">
          ›
        </button>
      </div>

      <div className="day-view__meta">
        {meta?.mood || meta?.weather ? (
          <span>
            {meta.mood ?? ''}
            {meta.weather ?? ''}
          </span>
        ) : (
          <span className="day-view__meta--empty">No mood or weather logged</span>
        )}
      </div>

      <div className="day-view__section day-view__finance" onClick={onNavigateFinance} role="button" tabIndex={0}>
        <span className="day-view__section-label">Finance</span>
        {meta?.spend !== undefined ? (
          <span className="day-view__finance-amount">Spent today: ₴{meta.spend}</span>
        ) : (
          <span className="day-view__empty">No spending logged</span>
        )}
        <span className="day-view__finance-link">View in Finance →</span>
      </div>

      <div className="day-view__section">
        <span className="day-view__section-label">all day</span>
        {allDay.length === 0 ? (
          <span className="day-view__empty">No all-day events</span>
        ) : (
          <div className="day-view__allday-list">
            {allDay.map((e) => (
              <span
                key={e.id}
                className="day-view__allday-chip"
                style={{ background: eventColor(e) }}
                onClick={() => onSelectEvent(e)}
              >
                {EVENT_TYPE_ICON[e.type]} {e.title}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="day-view__section">
        <span className="day-view__section-label">Timed events</span>
        {timed.length === 0 ? (
          <span className="day-view__empty">Nothing scheduled</span>
        ) : (
          <div className="day-view__timed-list">
            {timed.map((e) => {
              const isPast = isPastDay || (isToday && !!e.startTime && timeToMinutes(e.startTime) < nowMinutes);
              const isRealEvent = !e.id.startsWith('task-');
              return (
                <div key={e.id} className={`day-view__timed-row${isPast ? ' day-view__timed-row--past' : ''}`}>
                  <span className="day-view__timed-time">{e.startTime ?? '—'}</span>
                  <div
                    className="day-view__timed-bar"
                    style={{ background: eventColor(e) }}
                    onClick={isRealEvent ? () => onSelectEvent(e) : undefined}
                  >
                    {EVENT_TYPE_ICON[e.type]} {e.title}
                    {e.recurring !== 'none' ? ' ↻' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
