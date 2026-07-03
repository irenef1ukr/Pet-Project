import type { CalendarView } from '../../types';
import './ViewSwitcher.css';

interface ViewSwitcherProps {
  view: CalendarView;
  onChange: (view: CalendarView) => void;
}

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
];

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <div className="view-switcher">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          type="button"
          className={`view-switcher__pill${view === v.key ? ' view-switcher__pill--active' : ''}`}
          onClick={() => onChange(v.key)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
