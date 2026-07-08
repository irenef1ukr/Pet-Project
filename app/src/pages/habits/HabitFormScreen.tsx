import { DAY_LETTERS } from '../../lib/habitUtils';
import type { HabitCategory, HabitDraft, HabitFrequencyType } from '../../types';
import './HabitFormScreen.css';

interface HabitFormScreenProps {
  isEditing: boolean;
  categories: HabitCategory[];
  draft: HabitDraft;
  error: string;
  onChange: (patch: Partial<HabitDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function HabitFormScreen({
  isEditing,
  categories,
  draft,
  error,
  onChange,
  onSave,
  onCancel,
}: HabitFormScreenProps) {
  const toggleDay = (idx: number) => {
    const has = draft.activeDays.includes(idx);
    const activeDays = has ? draft.activeDays.filter((d) => d !== idx) : [...draft.activeDays, idx];
    onChange({ activeDays });
  };

  return (
    <div className="habit-form-screen">
      <div className="habit-form-card">
        <span className="habit-form-card__title">{isEditing ? 'Edit Habit' : 'New Habit'}</span>

        <label className="habit-field">
          <span className="habit-field__label">Title</span>
          <input
            type="text"
            placeholder="e.g. Drink water"
            value={draft.title}
            autoFocus
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </label>

        <label className="habit-field">
          <span className="habit-field__label">Category</span>
          <select value={draft.categoryId} onChange={(e) => onChange({ categoryId: e.target.value })}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="habit-field">
          <span className="habit-field__label">Frequency</span>
          <div className="habit-freq-toggle">
            <button
              type="button"
              className={`habit-freq-toggle__btn${draft.frequencyType === 'daily' ? ' habit-freq-toggle__btn--active' : ''}`}
              onClick={() => onChange({ frequencyType: 'daily' as HabitFrequencyType })}
            >
              Every day
            </button>
            <button
              type="button"
              className={`habit-freq-toggle__btn${draft.frequencyType === 'custom' ? ' habit-freq-toggle__btn--active' : ''}`}
              onClick={() => onChange({ frequencyType: 'custom' as HabitFrequencyType })}
            >
              Specific days
            </button>
          </div>
          {draft.frequencyType === 'custom' && (
            <div className="habit-day-toggles">
              {DAY_LETTERS.map((letter, idx) => (
                <span
                  key={idx}
                  className={`habit-day-toggle${draft.activeDays.includes(idx) ? ' habit-day-toggle--active' : ''}`}
                  onClick={() => toggleDay(idx)}
                  role="button"
                  tabIndex={0}
                >
                  {letter}
                </span>
              ))}
            </div>
          )}
        </div>

        <label className="habit-field">
          <span className="habit-field__label">Description (optional)</span>
          <textarea
            placeholder="Why does this habit matter?"
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </label>

        {error && <div className="habit-form-error">{error}</div>}

        <div className="habit-form-card__footer">
          <button type="button" className="habit-form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="habit-form-btn-save" onClick={onSave}>
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </button>
        </div>
      </div>
    </div>
  );
}
