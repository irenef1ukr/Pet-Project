import type { CalendarEvent } from '../../types';
import {
  CATEGORY_COLOR,
  EVENT_TYPE_ICON,
  WEEKDAY_LABELS,
  allDayEventsInRange,
  eventsOnDate,
  formatHourLabel,
  formatWeekRange,
  getWeekDays,
  isSameDay,
  mondayIndex,
  timeToMinutes,
  toISODate,
} from './calendarUtils';
import './WeekView.css';

interface WeekViewProps {
  selectedDate: Date;
  today: Date;
  events: CalendarEvent[];
  onPrev: () => void;
  onNext: () => void;
  onSelectDay: (date: Date) => void;
}

const HOUR_START = 8;
const HOUR_END = 20;
const HOUR_HEIGHT = 48;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const GRID_HEIGHT = HOURS.length * HOUR_HEIGHT;

function offsetForTime(time: string) {
  const minutes = timeToMinutes(time) - HOUR_START * 60;
  return Math.max(0, (minutes / 60) * HOUR_HEIGHT);
}

export function WeekView({ selectedDate, today, events, onPrev, onNext, onSelectDay }: WeekViewProps) {
  const days = getWeekDays(selectedDate);
  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];
  const allDayEvents = allDayEventsInRange(events, rangeStart, rangeEnd);

  return (
    <div className="calendar-panel">
      <div className="calendar-panel__header">
        <button type="button" className="calendar-panel__arrow" onClick={onPrev} aria-label="Previous week">
          ‹
        </button>
        <span className="calendar-panel__header-label">{formatWeekRange(days)}</span>
        <button type="button" className="calendar-panel__arrow" onClick={onNext} aria-label="Next week">
          ›
        </button>
      </div>

      <div className="week-view__row week-view__row--headers">
        <div className="week-view__time-col" />
        {days.map((day) => (
          <button
            key={toISODate(day)}
            type="button"
            className={`week-view__day-header${isSameDay(day, today) ? ' week-view__day-header--today' : ''}`}
            onClick={() => onSelectDay(day)}
          >
            {WEEKDAY_LABELS[mondayIndex(day)]} {day.getDate()}
          </button>
        ))}
      </div>

      <div className="week-view__row week-view__row--allday">
        <div className="week-view__time-col week-view__time-col--label">all day</div>
        {days.map((day) => {
          const iso = toISODate(day);
          const dayAllDay = allDayEvents.filter((e) => e.date <= iso && (e.endDate ?? e.date) >= iso);
          return (
            <div key={iso} className="week-view__allday-cell">
              {dayAllDay.map((e) => (
                <span
                  key={e.id}
                  className="week-view__chip"
                  style={{ background: CATEGORY_COLOR[e.category] }}
                >
                  {EVENT_TYPE_ICON[e.type]} {e.title}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      <div className="week-view__row week-view__row--body">
        <div className="week-view__time-col" style={{ height: GRID_HEIGHT }}>
          {HOURS.map((hour) => (
            <div key={hour} className="week-view__hour-label" style={{ height: HOUR_HEIGHT }}>
              {formatHourLabel(hour)}
            </div>
          ))}
        </div>
        {days.map((day) => {
          const dayEvents = eventsOnDate(events, day);
          return (
            <div
              key={toISODate(day)}
              className={`week-view__day-col${isSameDay(day, today) ? ' week-view__day-col--today' : ''}`}
              style={{ height: GRID_HEIGHT }}
            >
              {HOURS.map((hour) => (
                <div key={hour} className="week-view__hour-line" style={{ height: HOUR_HEIGHT }} />
              ))}
              {dayEvents.map((e) => {
                if (!e.startTime) return null;
                const top = offsetForTime(e.startTime);
                const height = e.endTime ? Math.max(20, offsetForTime(e.endTime) - top) : 24;
                return (
                  <div
                    key={e.id}
                    className="week-view__event"
                    style={{ top, height, background: CATEGORY_COLOR[e.category] }}
                  >
                    {EVENT_TYPE_ICON[e.type]} {e.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
