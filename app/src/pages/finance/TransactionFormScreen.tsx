import type { FinanceCategory, FinanceTransactionDraft } from '../../types';

interface TransactionFormScreenProps {
  isEditing: boolean;
  categories: FinanceCategory[];
  draft: FinanceTransactionDraft;
  error: string;
  onChange: (patch: Partial<FinanceTransactionDraft>) => void;
  onManageCategories: () => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function TransactionFormScreen({
  isEditing,
  categories,
  draft,
  error,
  onChange,
  onManageCategories,
  onSave,
  onDelete,
  onCancel,
}: TransactionFormScreenProps) {
  return (
    <div className="finance-screen-center">
      <div className="finance-form-card">
        <div className="finance-form-card__title">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</div>

        <label className="finance-field">
          <span className="finance-field__label">Date</span>
          <input type="date" value={draft.date} onChange={(e) => onChange({ date: e.target.value })} />
        </label>

        <label className="finance-field">
          <span className="finance-field__label">Description</span>
          <input
            type="text"
            placeholder="e.g. Grocery run"
            value={draft.desc}
            onChange={(e) => onChange({ desc: e.target.value })}
          />
        </label>

        <label className="finance-field">
          <span className="finance-field__label">Category</span>
          <select value={draft.categoryId} onChange={(e) => onChange({ categoryId: e.target.value })}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
          <span className="finance-field__link" onClick={onManageCategories} role="button" tabIndex={0}>
            Manage categories →
          </span>
        </label>

        <label className="finance-field">
          <span className="finance-field__label">Amount (₴)</span>
          <input
            type="number"
            placeholder="0"
            value={draft.amount}
            onChange={(e) => onChange({ amount: e.target.value })}
          />
        </label>

        {error && <div className="finance-form-error">{error}</div>}

        <div className="finance-form-card__footer">
          {isEditing && (
            <span className="finance-form-delete" onClick={onDelete} role="button" tabIndex={0}>
              Delete transaction
            </span>
          )}
          <div className="finance-form-card__buttons">
            <button type="button" className="finance-btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="finance-btn-primary" onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
