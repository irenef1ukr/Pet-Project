import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { getTodayISO } from '../../data/mockData';
import { addDaysIso, formatDateRange } from '../../lib/dateUtils';
import { mondayOfIso } from '../../lib/habitUtils';
import { lessonSubjectColors, subjectProgress } from '../../lib/lessonUtils';
import { useAppData } from '../../store/AppDataContext';
import type { Lesson, LessonDraft } from '../../types';
import { LessonDetailScreen } from './LessonDetailScreen';
import { LessonFormScreen } from './LessonFormScreen';
import { LessonSubjectsScreen } from './LessonSubjectsScreen';
import { LessonWeekGrid } from './LessonWeekGrid';
import './LessonPlan.css';

type Screen = 'main' | 'detail' | 'form' | 'subjects';

const EMPTY_FORM: LessonDraft = {
  objective: '',
  subjectId: '',
  day: 0,
  startTime: '09:00',
  durationMinutes: 60,
  materials: '',
  status: 'planned',
  notes: '',
};

export function LessonPlan() {
  const {
    lessons,
    lessonSubjects,
    addLesson,
    updateLesson,
    deleteLesson,
    addLessonSubject,
    renameLessonSubject,
    changeLessonSubjectEmoji,
    deleteLessonSubject,
  } = useAppData();

  const todayIso = getTodayISO();
  const [screen, setScreen] = useState<Screen>('main');
  const [weekMonday, setWeekMonday] = useState(() => mondayOfIso(todayIso));
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonDraft>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [newSubject, setNewSubject] = useState({ emoji: '📘', name: '' });

  const weekDays = useMemo(() => Array.from({ length: 5 }, (_, i) => addDaysIso(weekMonday, i)), [weekMonday]);
  const weekRangeLabel = formatDateRange(weekDays[0], weekDays[4]);

  const filteredLessons = useMemo(
    () => (subjectFilter === 'all' ? lessons : lessons.filter((l) => l.subjectId === subjectFilter)),
    [lessons, subjectFilter],
  );

  const openDetail = (id: string) => {
    setDetailId(id);
    setScreen('detail');
  };

  const backFromDetail = () => {
    setDetailId(null);
    setScreen('main');
  };

  const openNewLesson = () => {
    setEditingId(null);
    setFormError('');
    setForm({ ...EMPTY_FORM, subjectId: lessonSubjects[0]?.id ?? '' });
    setScreen('form');
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormError('');
    setForm({
      objective: lesson.objective,
      subjectId: lesson.subjectId,
      day: lesson.day,
      startTime: lesson.startTime,
      durationMinutes: lesson.durationMinutes,
      materials: lesson.materials.join(', '),
      status: lesson.status,
      notes: lesson.notes,
    });
    setScreen('form');
  };

  const saveLesson = () => {
    const objective = form.objective.trim();
    if (!objective) {
      setFormError('Please give this lesson an objective.');
      return;
    }
    const draft = { ...form, objective };
    if (editingId) updateLesson(editingId, draft);
    else addLesson(draft);
    setScreen(detailId ? 'detail' : 'main');
  };

  const cancelForm = () => setScreen(detailId ? 'detail' : 'main');

  const confirmDeleteLesson = () => {
    if (!detailId) return;
    deleteLesson(detailId);
    setDetailId(null);
    setScreen('main');
  };

  const addNewSubject = () => {
    const name = newSubject.name.trim();
    if (!name) return;
    addLessonSubject(name, newSubject.emoji || '📘');
    setNewSubject({ emoji: '📘', name: '' });
  };

  const detailLesson = detailId ? lessons.find((l) => l.id === detailId) : undefined;
  const detailSubjectIndex = detailLesson ? lessonSubjects.findIndex((s) => s.id === detailLesson.subjectId) : -1;
  const detailDateIso = detailLesson ? addDaysIso(mondayOfIso(todayIso), detailLesson.day) : '';

  return (
    <div className="page">
      <TopNav />
      <div className="lesson-plan-main">
        {screen === 'main' && (
          <>
            <div className="lesson-plan-header">
              <span className="lesson-plan-title">Lesson Plan</span>
              <div className="lesson-plan-header__actions">
                <button type="button" className="lesson-plan-btn lesson-plan-btn--manage" onClick={() => setScreen('subjects')}>
                  Manage Subjects
                </button>
                <button type="button" className="lesson-plan-btn lesson-plan-btn--new" onClick={openNewLesson}>
                  + New Lesson
                </button>
              </div>
            </div>

            {lessonSubjects.length > 0 && (
              <div className="lesson-plan-progress-grid">
                {lessonSubjects.map((s, idx) => {
                  const colors = lessonSubjectColors(idx);
                  const progress = subjectProgress(lessons, s.id);
                  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
                  return (
                    <div
                      key={s.id}
                      className="lesson-plan-progress-card"
                      onClick={() => setSubjectFilter(s.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="lesson-plan-progress-card__top">
                        <span className="lesson-plan-progress-card__label">
                          {s.emoji} {s.name}
                        </span>
                        <span className="lesson-plan-progress-card__count">
                          {progress.done}/{progress.total} done
                        </span>
                      </div>
                      <div className="lesson-plan-progress-bar">
                        <div
                          className="lesson-plan-progress-bar__fill"
                          style={{ width: `${pct}%`, background: colors.accent }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="lesson-plan-chips">
              <button
                type="button"
                className={`lesson-plan-chip${subjectFilter === 'all' ? ' lesson-plan-chip--active' : ''}`}
                onClick={() => setSubjectFilter('all')}
              >
                All
              </button>
              {lessonSubjects.map((s, idx) => {
                const colors = lessonSubjectColors(idx);
                const active = subjectFilter === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="lesson-plan-chip"
                    style={active ? { background: colors.accent, color: '#fff' } : { background: colors.tagBg, color: colors.tagText }}
                    onClick={() => setSubjectFilter(s.id)}
                  >
                    {s.emoji} {s.name}
                  </button>
                );
              })}
            </div>

            <div className="lesson-plan-week-nav">
              <button
                type="button"
                className="lesson-plan-week-nav__arrow"
                onClick={() => setWeekMonday((w) => addDaysIso(w, -7))}
                aria-label="Previous week"
              >
                ‹
              </button>
              <span className="lesson-plan-week-nav__label">{weekRangeLabel}</span>
              <button
                type="button"
                className="lesson-plan-week-nav__arrow"
                onClick={() => setWeekMonday((w) => addDaysIso(w, 7))}
                aria-label="Next week"
              >
                ›
              </button>
            </div>

            {lessonSubjects.length === 0 ? (
              <div className="lesson-plan-empty">
                No subjects yet — click "Manage Subjects" above to add one before creating lessons.
              </div>
            ) : (
              <LessonWeekGrid weekDays={weekDays} lessons={filteredLessons} subjects={lessonSubjects} onSelectLesson={openDetail} />
            )}
          </>
        )}

        {screen === 'detail' && detailLesson && (
          <LessonDetailScreen
            lesson={detailLesson}
            subject={lessonSubjects.find((s) => s.id === detailLesson.subjectId)}
            colors={lessonSubjectColors(Math.max(detailSubjectIndex, 0))}
            dateIso={detailDateIso}
            onBack={backFromDetail}
            onEdit={() => openEditLesson(detailLesson)}
            onDelete={confirmDeleteLesson}
          />
        )}

        {screen === 'form' && (
          <LessonFormScreen
            isEditing={!!editingId}
            subjects={lessonSubjects}
            draft={form}
            error={formError}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            onSave={saveLesson}
            onCancel={cancelForm}
          />
        )}

        {screen === 'subjects' && (
          <LessonSubjectsScreen
            subjects={lessonSubjects}
            newSubject={newSubject}
            onBack={() => setScreen('main')}
            onEmojiChange={changeLessonSubjectEmoji}
            onNameChange={renameLessonSubject}
            onDelete={deleteLessonSubject}
            onNewSubjectChange={(patch) => setNewSubject((s) => ({ ...s, ...patch }))}
            onAddSubject={addNewSubject}
          />
        )}
      </div>
    </div>
  );
}
