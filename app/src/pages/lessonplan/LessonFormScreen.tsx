import { LESSON_DAY_NAMES, LESSON_DURATION_OPTIONS, LESSON_TIME_OPTIONS } from '../../lib/lessonUtils';
import type { LessonDraft, LessonSubject } from '../../types';
import './LessonFormScreen.css';

interface LessonFormScreenProps {
  isEditing: boolean;
  subjects: LessonSubject[];
  draft: LessonDraft;
  error: string;
  onChange: (patch: Partial<LessonDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function LessonFormScreen({ isEditing, subjects, draft, error, onChange, onSave, onCancel }: LessonFormScreenProps) {
  return (
    <div className="lesson-form-screen">
      <div className="lesson-form-card">
        <span className="lesson-form-card__title">{isEditing ? 'Edit Lesson' : 'New Lesson'}</span>

        <label className="lesson-field">
          <span className="lesson-field__label">Objective / Topic</span>
          <input
            type="text"
            placeholder="e.g. Past tense verbs"
            value={draft.objective}
            autoFocus
            onChange={(e) => onChange({ objective: e.target.value })}
          />
        </label>

        <label className="lesson-field">
          <span className="lesson-field__label">Subject</span>
          <select value={draft.subjectId} onChange={(e) => onChange({ subjectId: e.target.value })}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} {s.name}
              </option>
            ))}
          </select>
        </label>

        <div className="lesson-field-row">
          <label className="lesson-field">
            <span className="lesson-field__label">Day</span>
            <select value={draft.day} onChange={(e) => onChange({ day: Number(e.target.value) })}>
              {LESSON_DAY_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="lesson-field">
            <span className="lesson-field__label">Start Time</span>
            <select value={draft.startTime} onChange={(e) => onChange({ startTime: e.target.value })}>
              {LESSON_TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="lesson-field">
            <span className="lesson-field__label">Duration</span>
            <select value={draft.durationMinutes} onChange={(e) => onChange({ durationMinutes: Number(e.target.value) })}>
              {LESSON_DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="lesson-field">
          <span className="lesson-field__label">Materials (comma separated, optional)</span>
          <input
            type="text"
            placeholder="e.g. Textbook, notebook"
            value={draft.materials}
            onChange={(e) => onChange({ materials: e.target.value })}
          />
        </label>

        <div className="lesson-field">
          <span className="lesson-field__label">Status</span>
          <div className="lesson-status-toggle">
            <button
              type="button"
              className={`lesson-status-toggle__btn${draft.status === 'planned' ? ' lesson-status-toggle__btn--active' : ''}`}
              onClick={() => onChange({ status: 'planned' })}
            >
              Planned
            </button>
            <button
              type="button"
              className={`lesson-status-toggle__btn${draft.status === 'done' ? ' lesson-status-toggle__btn--active' : ''}`}
              onClick={() => onChange({ status: 'done' })}
            >
              Done
            </button>
          </div>
        </div>

        <label className="lesson-field">
          <span className="lesson-field__label">Notes (optional)</span>
          <textarea
            placeholder="Anything to remember for this lesson?"
            value={draft.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </label>

        {error && <div className="lesson-form-error">{error}</div>}

        <div className="lesson-form-card__footer">
          <button type="button" className="lesson-form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="lesson-form-btn-save" onClick={onSave}>
            {isEditing ? 'Save Changes' : 'Create Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}
