import { WEEKDAY_INITIALS, formatMonthYear, getMonthGridDays, isSameDay } from './calendarUtils';
import './MiniMonthPicker.css';

interface MiniMonthPickerProps {
  selectedDate: Date;
  onSelectDay: (date: Date) => void;
}

export function MiniMonthPicker({ selectedDate, onSelectDay }: MiniMonthPickerProps) {
  const days = getMonthGridDays(selectedDate);

  return (
    <div className="mini-picker">
      <span className="mini-picker__title">{formatMonthYear(selectedDate)}</span>
      <div className="mini-picker__grid">
        {WEEKDAY_INITIALS.map((label, i) => (
          <span key={`${label}-${i}`} className="mini-picker__weekday">
            {label}
          </span>
        ))}
        {days.map(({ date, inCurrentMonth }) => (
          <button
            key={date.toISOString()}
            type="button"
            className={`mini-picker__day${isSameDay(date, selectedDate) ? ' mini-picker__day--selected' : ''}${
              inCurrentMonth ? '' : ' mini-picker__day--outside'
            }`}
            onClick={() => onSelectDay(date)}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
