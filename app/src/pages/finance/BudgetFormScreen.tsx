import type { FinanceBudgetDraft, FinanceCategory } from '../../types';

interface BudgetFormScreenProps {
  categories: FinanceCategory[];
  draft: FinanceBudgetDraft;
  error: string;
  onChange: (patch: Partial<FinanceBudgetDraft>) => void;
  onManageCategories: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function BudgetFormScreen({
  categories,
  draft,
  error,
  onChange,
  onManageCategories,
  onSave,
  onCancel,
}: BudgetFormScreenProps) {
  return (
    <div className="finance-screen-center">
      <div className="finance-form-card" style={{ width: 480 }}>
        <div className="finance-form-card__title">Set Category Budget</div>

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
          <span className="finance-field__label">Monthly budget (₴)</span>
          <input
            type="number"
            placeholder="0"
            value={draft.amount}
            onChange={(e) => onChange({ amount: e.target.value })}
          />
        </label>

        {error && <div className="finance-form-error">{error}</div>}

        <div className="finance-form-card__footer">
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
