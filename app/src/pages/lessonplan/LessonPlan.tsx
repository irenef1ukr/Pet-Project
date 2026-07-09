import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { getTodayISO } from '../../data/mockData';
import { addDaysIso, formatDateRange } from '../../lib/dateUtils';
import { monFirstDay, mondayOfIso } from '../../lib/habitUtils';
import { lessonSubjectColors, resolvedLessonStatus, subjectProgress } from '../../lib/lessonUtils';
import { useAppData } from '../../store/AppDataContext';
import type { Lesson, LessonDraft, LessonStatus } from '../../types';
import { LessonDetailScreen } from './LessonDetailScreen';
import { LessonFormScreen } from './LessonFormScreen';
import { LessonStatusScopeModal } from './LessonStatusScopeModal';
import { LessonSubjectsScreen } from './LessonSubjectsScreen';
import { LessonWeekGrid } from './LessonWeekGrid';
import './LessonPlan.css';

type Screen = 'main' | 'detail' | 'form' | 'subjects';

interface PendingStatusChoice {
  lessonId: string;
  dateIso: string;
  status: LessonStatus;
  restDraft: LessonDraft;
}

const EMPTY_FORM: LessonDraft = {
  objective: '',
  subjectId: '',
  recurring: true,
  day: 0,
  date: '',
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
    setLessonStatus,
    setLessonOccurrenceStatus,
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
  const [detailDateIso, setDetailDateIso] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonDraft>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [newSubject, setNewSubject] = useState({ emoji: '📘', name: '' });
  const [pendingStatusChoice, setPendingStatusChoice] = useState<PendingStatusChoice | null>(null);

  const weekDays = useMemo(() => Array.from({ length: 5 }, (_, i) => addDaysIso(weekMonday, i)), [weekMonday]);
  const weekRangeLabel = formatDateRange(weekDays[0], weekDays[4]);

  const filteredLessons = useMemo(
    () => (subjectFilter === 'all' ? lessons : lessons.filter((l) => l.subjectId === subjectFilter)),
    [lessons, subjectFilter],
  );

  const openDetail = (id: string, dateIso: string) => {
    setDetailId(id);
    setDetailDateIso(dateIso);
    setScreen('detail');
  };

  const backFromDetail = () => {
    setDetailId(null);
    setScreen('main');
  };

  const openNewLesson = () => {
    setEditingId(null);
    setFormError('');
    setForm({ ...EMPTY_FORM, subjectId: lessonSubjects[0]?.id ?? '', date: todayIso });
    setScreen('form');
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormError('');
    const occurrenceDate = lesson.recurring ? detailDateIso || todayIso : (lesson.date ?? detailDateIso ?? todayIso);
    setForm({
      objective: lesson.objective,
      subjectId: lesson.subjectId,
      recurring: lesson.recurring,
      day: lesson.recurring ? lesson.day : monFirstDay(occurrenceDate),
      date: occurrenceDate,
      startTime: lesson.startTime,
      durationMinutes: lesson.durationMinutes,
      materials: lesson.materials.join(', '),
      status: resolvedLessonStatus(lesson, occurrenceDate),
      notes: lesson.notes,
    });
    setScreen('form');
  };

  const toggleLessonDone = (id: string, dateIso: string) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;
    const next: LessonStatus = resolvedLessonStatus(lesson, dateIso) === 'done' ? 'planned' : 'done';
    if (lesson.recurring) setLessonOccurrenceStatus(id, dateIso, next);
    else setLessonStatus(id, next);
  };

  const saveLesson = () => {
    const objective = form.objective.trim();
    if (!objective) {
      setFormError('Please give this lesson an objective.');
      return;
    }
    if (!form.recurring && !form.date) {
      setFormError('Please choose a date.');
      return;
    }
    const draft = { ...form, objective };
    if (editingId) {
      const original = lessons.find((l) => l.id === editingId);
      if (original?.recurring && draft.recurring && draft.status !== resolvedLessonStatus(original, detailDateIso)) {
        setPendingStatusChoice({ lessonId: editingId, dateIso: detailDateIso, status: draft.status, restDraft: draft });
        return;
      }
      updateLesson(editingId, draft);
    } else {
      addLesson(draft);
    }
    setScreen(detailId ? 'detail' : 'main');
  };

  const applyStatusToOne = () => {
    if (!pendingStatusChoice) return;
    const { lessonId, dateIso, status, restDraft } = pendingStatusChoice;
    const original = lessons.find((l) => l.id === lessonId);
    updateLesson(lessonId, { ...restDraft, status: original?.status ?? restDraft.status });
    setLessonOccurrenceStatus(lessonId, dateIso, status);
    setPendingStatusChoice(null);
    setScreen(detailId ? 'detail' : 'main');
  };

  const applyStatusToAll = () => {
    if (!pendingStatusChoice) return;
    const { lessonId, restDraft } = pendingStatusChoice;
    updateLesson(lessonId, restDraft);
    setLessonStatus(lessonId, restDraft.status);
    setPendingStatusChoice(null);
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
              <LessonWeekGrid
                weekDays={weekDays}
                lessons={filteredLessons}
                subjects={lessonSubjects}
                onSelectLesson={openDetail}
                onToggleDone={toggleLessonDone}
              />
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
            onToggleDone={() => toggleLessonDone(detailLesson.id, detailDateIso)}
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

      {pendingStatusChoice && (
        <LessonStatusScopeModal
          lessonObjective={lessons.find((l) => l.id === pendingStatusChoice.lessonId)?.objective ?? ''}
          status={pendingStatusChoice.status}
          onApplyOne={applyStatusToOne}
          onApplyAll={applyStatusToAll}
          onCancel={() => setPendingStatusChoice(null)}
        />
      )}
    </div>
  );
}
