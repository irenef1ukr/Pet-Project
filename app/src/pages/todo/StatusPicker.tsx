import type { TodoStatus } from '../../types';
import { STATUS_LABEL, STATUS_ORDER, statusVisual } from '../../lib/todoUtils';
import './StatusPicker.css';

interface StatusPickerProps {
  status: TodoStatus;
  onChange: (status: TodoStatus) => void;
}

export function StatusPicker({ status, onChange }: StatusPickerProps) {
  return (
    <div className="status-picker">
      {STATUS_ORDER.map((opt) => {
        const visual = statusVisual(opt);
        const isCurrent = opt === status;
        return (
          <button
            key={opt}
            type="button"
            className="status-picker__option"
            style={{
              background: visual.background,
              borderRadius: visual.borderRadius,
              border: isCurrent ? visual.border.replace('2px', '3px') : visual.border,
            }}
            onClick={() => onChange(opt)}
            title={STATUS_LABEL[opt]}
            aria-label={STATUS_LABEL[opt]}
          >
            {visual.showCheck && <span className="status-picker__check">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
