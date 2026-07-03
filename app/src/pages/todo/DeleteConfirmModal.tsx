import type { TodoTask } from '../../types';
import './modal-shared.css';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  task: TodoTask;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ task, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-card delete-confirm">
        <h3 className="delete-confirm__title">Delete task?</h3>
        <p className="delete-confirm__body">&ldquo;{task.title}&rdquo; will be permanently deleted.</p>
        <div className="modal-actions">
          <button type="button" className="modal-actions__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="delete-confirm__delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
