import type { LessonSubject } from '../../types';
import './LessonSubjectsScreen.css';

interface NewLessonSubjectDraft {
  emoji: string;
  name: string;
}

interface LessonSubjectsScreenProps {
  subjects: LessonSubject[];
  newSubject: NewLessonSubjectDraft;
  onBack: () => void;
  onEmojiChange: (id: string, emoji: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onNewSubjectChange: (patch: Partial<NewLessonSubjectDraft>) => void;
  onAddSubject: () => void;
}

export function LessonSubjectsScreen({
  subjects,
  newSubject,
  onBack,
  onEmojiChange,
  onNameChange,
  onDelete,
  onNewSubjectChange,
  onAddSubject,
}: LessonSubjectsScreenProps) {
  return (
    <div className="lesson-plan-screen-center">
      <div className="lesson-subjects-screen">
        <div className="lesson-subjects-screen__header">
          <span className="lesson-subjects-screen__back" onClick={onBack} role="button" tabIndex={0}>
            ‹ Back
          </span>
          <span className="lesson-subjects-screen__title">Manage Subjects</span>
        </div>

        <div className="lesson-subjects-screen__list">
          {subjects.map((s) => (
            <div key={s.id} className="lesson-subject-row">
              <input
                type="text"
                maxLength={2}
                value={s.emoji}
                onChange={(e) => onEmojiChange(s.id, e.target.value)}
                className="lesson-subject-row__emoji"
              />
              <input
                type="text"
                value={s.name}
                onChange={(e) => onNameChange(s.id, e.target.value)}
                className="lesson-subject-row__name"
              />
              <button
                type="button"
                className="lesson-subject-row__delete"
                onClick={() => onDelete(s.id)}
                aria-label={`Delete ${s.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="lesson-subjects-screen__add">
          <div className="lesson-subjects-screen__add-title">Add Subject</div>
          <div className="lesson-subjects-screen__add-row">
            <input
              type="text"
              maxLength={2}
              placeholder="📘"
              value={newSubject.emoji}
              onChange={(e) => onNewSubjectChange({ emoji: e.target.value })}
              className="lesson-subject-row__emoji"
            />
            <input
              type="text"
              placeholder="Subject name"
              value={newSubject.name}
              onChange={(e) => onNewSubjectChange({ name: e.target.value })}
              className="lesson-subject-row__name"
            />
            <button type="button" className="lesson-subjects-screen__add-btn" onClick={onAddSubject}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
