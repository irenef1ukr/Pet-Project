import type { GoalCategory, GoalDraft } from '../../types';
import { GOAL_STATUS_ORDER, GOAL_STATUS_LABEL } from '../../lib/goalUtils';
import './GoalFormScreen.css';

interface GoalFormScreenProps {
  isEditing: boolean;
  categories: GoalCategory[];
  draft: GoalDraft;
  error: string;
  onChange: (patch: Partial<GoalDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function GoalFormScreen({
  isEditing,
  categories,
  draft,
  error,
  onChange,
  onSave,
  onCancel,
}: GoalFormScreenProps) {
  return (
    <div className="goal-form-screen">
      <div className="goal-form-card">
        <span className="goal-form-card__title">{isEditing ? 'Edit Goal' : 'New Goal'}</span>

        <label className="goal-field">
          <span className="goal-field__label">Title</span>
          <input
            type="text"
            placeholder="e.g. Learn Spanish"
            value={draft.title}
            autoFocus
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </label>

        <div className="goal-field--row">
          <label className="goal-field">
            <span className="goal-field__label">Category</span>
            <select value={draft.categoryId} onChange={(e) => onChange({ categoryId: e.target.value })}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="goal-field">
            <span className="goal-field__label">Status</span>
            <select
              value={draft.status}
              onChange={(e) => onChange({ status: e.target.value as GoalDraft['status'] })}
            >
              {GOAL_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {GOAL_STATUS_LABEL[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="goal-field--row">
          <label className="goal-field">
            <span className="goal-field__label">Progress ({draft.percent}%)</span>
            <input
              type="range"
              min={0}
              max={100}
              value={draft.percent}
              onChange={(e) => onChange({ percent: parseInt(e.target.value, 10) || 0 })}
            />
          </label>
          <label className="goal-field">
            <span className="goal-field__label">Due date (optional)</span>
            <input type="date" value={draft.dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} />
          </label>
        </div>

        <label className="goal-field">
          <span className="goal-field__label">Description (optional)</span>
          <textarea
            placeholder="What does success look like?"
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </label>

        {error && <div className="goal-form-error">{error}</div>}

        <div className="goal-form-card__footer">
          <button type="button" className="goal-form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="goal-form-btn-save" onClick={onSave}>
            {isEditing ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </div>
    </div>
  );
}
