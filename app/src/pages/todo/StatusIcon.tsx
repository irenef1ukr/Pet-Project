import type { TodoStatus } from '../../types';
import { STATUS_LABEL, statusVisual } from '../../lib/todoUtils';
import './StatusIcon.css';

interface StatusIconProps {
  status: TodoStatus;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function StatusIcon({ status, onClick, size = 'sm' }: StatusIconProps) {
  const visual = statusVisual(status);
  return (
    <button
      type="button"
      className={`status-icon status-icon--${size}`}
      style={{ background: visual.background, border: visual.border, borderRadius: visual.borderRadius }}
      onClick={onClick}
      title={`${STATUS_LABEL[status]} — click to change`}
      aria-label={`Status: ${STATUS_LABEL[status]}`}
    >
      {visual.showCheck && <span className="status-icon__check">✓</span>}
    </button>
  );
}
