import type { HabitCategoryColors } from '../../lib/habitUtils';
import type { HabitListItem } from './habitListItem';
import './habits-shared.css';
import './HabitRow.css';

interface HabitRowProps {
  item: HabitListItem;
  colors: HabitCategoryColors;
  onOpen: () => void;
  onToggleDay: (dateIso: string) => void;
}

export function HabitRow({ item, colors, onOpen, onToggleDay }: HabitRowProps) {
  return (
    <div className="habit-row">
      <div className="habit-row__title-group" onClick={onOpen} role="button" tabIndex={0}>
        <span className="habit-row__title">{item.title}</span>
        <span className="habit-row__frequency">{item.frequencyLabel}</span>
      </div>
      <div className="habit-row__week">
        {item.week.map((d) => (
          <span
            key={d.iso}
            className={`habit-day${d.done ? ' habit-day--done' : ''}${!d.scheduled ? ' habit-day--unscheduled' : ''}${d.future ? ' habit-day--future' : ''}`}
            style={d.done ? { background: colors.accent } : undefined}
            onClick={d.clickable ? () => onToggleDay(d.iso) : undefined}
            role={d.clickable ? 'button' : undefined}
            tabIndex={d.clickable ? 0 : undefined}
          >
            {d.letter}
          </span>
        ))}
      </div>
      <span className="habit-row__streak">🔥 {item.streak}</span>
      <span className="habit-row__rate">{item.rateLabel}</span>
    </div>
  );
}
