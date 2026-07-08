import { useState } from 'react';
import { formatLessonDateHeading, formatTime12h } from '../../lib/lessonUtils';
import type { LessonSubjectColors } from '../../lib/lessonUtils';
import type { Lesson, LessonSubject } from '../../types';
import './LessonDetailScreen.css';

interface LessonDetailScreenProps {
  lesson: Lesson;
  subject: LessonSubject | undefined;
  colors: LessonSubjectColors;
  dateIso: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function LessonDetailScreen({ lesson, subject, colors, dateIso, onBack, onEdit, onDelete }: LessonDetailScreenProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="lesson-detail-screen">
      <div className="lesson-detail-screen__inner">
        <span className="lesson-detail-screen__back" onClick={onBack} role="button" tabIndex={0}>
          ‹ Back
        </span>

        <div className="lesson-detail-card">
          <div className="lesson-detail-card__header">
            <span className="lesson-detail-card__title">{lesson.objective}</span>
            <span className={`lesson-detail-card__status${lesson.status === 'done' ? ' lesson-detail-card__status--done' : ''}`}>
              {lesson.status === 'done' ? 'Done' : 'Planned'}
            </span>
          </div>

          {subject && (
            <span className="lesson-detail-card__subject" style={{ background: colors.tagBg, color: colors.tagText }}>
              {subject.emoji} {subject.name}
            </span>
          )}

          <div className="lesson-detail-card__schedule">
            🗓️ {formatLessonDateHeading(dateIso)} · {formatTime12h(lesson.startTime)}
            <span className="lesson-detail-card__schedule-note"> · also appears on your Calendar</span>
          </div>

          {lesson.materials.length > 0 && (
            <div>
              <div className="lesson-detail-card__section-label">Materials</div>
              <div className="lesson-detail-card__tags">
                {lesson.materials.map((m) => (
                  <span key={m} className="lesson-detail-card__tag">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lesson.notes && (
            <div>
              <div className="lesson-detail-card__section-label">Notes</div>
              <div className="lesson-detail-card__notes">{lesson.notes}</div>
            </div>
          )}

          <div className="lesson-detail-card__footer">
            {confirmingDelete ? (
              <>
                <span className="lesson-detail-card__delete-confirm">Delete this lesson?</span>
                <div className="lesson-detail-card__delete-actions">
                  <button type="button" className="lesson-detail-card__link-btn lesson-detail-card__link-btn--danger" onClick={onDelete}>
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="lesson-detail-card__link-btn lesson-detail-card__link-btn--muted"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="button" className="lesson-detail-card__delete" onClick={() => setConfirmingDelete(true)}>
                  Delete
                </button>
                <button type="button" className="lesson-detail-card__edit" onClick={onEdit}>
                  Edit Lesson
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
