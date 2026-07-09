import { formatCurrency } from '../../lib/financeUtils';
import type { FinanceTransaction } from '../../types';
import '../../components/modal-shared.css';
import './DeleteTransactionConfirmModal.css';

interface DeleteTransactionConfirmModalProps {
  transaction: FinanceTransaction;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTransactionConfirmModal({
  transaction,
  onCancel,
  onConfirm,
}: DeleteTransactionConfirmModalProps) {
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-card delete-tx-confirm">
        <h3 className="delete-tx-confirm__title">Delete transaction?</h3>
        <p className="delete-tx-confirm__body">
          &ldquo;{transaction.desc}&rdquo; ({formatCurrency(transaction.amount)}) will be permanently deleted.
        </p>
        <div className="modal-actions">
          <button type="button" className="modal-actions__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="delete-tx-confirm__delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
