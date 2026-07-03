import type { CalendarEvent } from '../../types';
import '../../components/modal-shared.css';
import './DeleteEventConfirmModal.css';

interface DeleteEventConfirmModalProps {
  event: CalendarEvent;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteEventConfirmModal({ event, onCancel, onConfirm }: DeleteEventConfirmModalProps) {
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-card delete-event-confirm">
        <h3 className="delete-event-confirm__title">Delete event?</h3>
        <p className="delete-event-confirm__body">&ldquo;{event.title}&rdquo; will be permanently deleted.</p>
        <div className="modal-actions">
          <button type="button" className="modal-actions__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="delete-event-confirm__delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
