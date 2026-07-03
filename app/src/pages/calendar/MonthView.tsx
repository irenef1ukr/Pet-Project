import type { CalendarEvent, DayMeta } from '../../types';
import {
  CATEGORY_COLOR,
  EVENT_TYPE_ICON,
  WEEKDAY_LABELS,
  eventsOnDate,
  formatMonthYear,
  getMonthGridDays,
  isSameDay,
  toISODate,
} from './calendarUtils';
import './MonthView.css';

interface MonthViewProps {
  selectedDate: Date;
  today: Date;
  events: CalendarEvent[];
  dayMeta: Record<string, DayMeta>;
  onPrev: () => void;
  onNext: () => void;
  onSelectDay: (date: Date) => void;
}

export function MonthView({ selectedDate, today, events, dayMeta, onPrev, onNext, onSelectDay }: MonthViewProps) {
  const days = getMonthGridDays(selectedDate);

  return (
    <div className="calendar-panel">
      <div className="calendar-panel__header">
        <button type="button" className="calendar-panel__arrow" onClick={onPrev} aria-label="Previous month">
          ‹
        </button>
        <span className="calendar-panel__header-label">{formatMonthYear(selectedDate)}</span>
        <button type="button" className="calendar-panel__arrow" onClick={onNext} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="month-view__weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="month-view__weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="month-view__grid">
        {days.map(({ date, inCurrentMonth }) => {
          const iso = toISODate(date);
          const meta = dayMeta[iso];
          const dayEvents = eventsOnDate(events, date);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={iso}
              className={`month-view__cell${isToday ? ' month-view__cell--today' : ''}${
                inCurrentMonth ? '' : ' month-view__cell--outside'
              }`}
              onClick={() => onSelectDay(date)}
              role="button"
              tabIndex={0}
            >
              <div className="month-view__cell-top">
                <span className="month-view__day-number">{date.getDate()}</span>
                {meta && (
                  <span className="month-view__day-meta">
                    {meta.spend !== undefined ? `₴${meta.spend} ` : ''}
                    {meta.mood ?? ''}
                    {meta.weather ?? ''}
                  </span>
                )}
              </div>
              {dayEvents.length > 0 && (
                <div className="month-view__chips">
                  {dayEvents.map((e) => (
                    <span
                      key={e.id}
                      className="month-view__chip"
                      style={{ background: CATEGORY_COLOR[e.category] }}
                    >
                      {EVENT_TYPE_ICON[e.type]} {e.title}
                      {e.recurring ? ' ↻' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
