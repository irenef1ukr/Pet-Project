import type { LessonStatus } from '../../types';
import '../../components/modal-shared.css';
import './LessonStatusScopeModal.css';

interface LessonStatusScopeModalProps {
  lessonObjective: string;
  status: LessonStatus;
  onApplyOne: () => void;
  onApplyAll: () => void;
  onCancel: () => void;
}

export function LessonStatusScopeModal({
  lessonObjective,
  status,
  onApplyOne,
  onApplyAll,
  onCancel,
}: LessonStatusScopeModalProps) {
  const label = status === 'done' ? 'Done' : 'Planned';
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-card lesson-status-scope">
        <h3 className="lesson-status-scope__title">Mark as {label}?</h3>
        <p className="lesson-status-scope__body">
          &ldquo;{lessonObjective}&rdquo; repeats weekly. Apply this status change to just this lesson, or to every
          lesson in the series?
        </p>
        <div className="lesson-status-scope__actions">
          <button type="button" className="lesson-status-scope__btn" onClick={onApplyOne}>
            Just this lesson
          </button>
          <button type="button" className="lesson-status-scope__btn lesson-status-scope__btn--primary" onClick={onApplyAll}>
            All lessons in series
          </button>
        </div>
        <span className="lesson-status-scope__cancel" onClick={onCancel} role="button" tabIndex={0}>
          Cancel
        </span>
      </div>
    </div>
  );
}
