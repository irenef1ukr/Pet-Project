import { fromISODate } from '../../lib/dateUtils';
import { LESSON_DAY_SHORT, formatHourLabel, formatTime12h, lessonSubjectColors } from '../../lib/lessonUtils';
import type { Lesson, LessonSubject } from '../../types';
import './LessonWeekGrid.css';

interface LessonWeekGridProps {
  weekDays: string[];
  lessons: Lesson[];
  subjects: LessonSubject[];
  onSelectLesson: (id: string) => void;
}

const HOUR_START = 8;
const HOUR_END = 20;
const HOUR_HEIGHT = 56;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const GRID_HEIGHT = HOURS.length * HOUR_HEIGHT;

function offsetForTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const minutes = h * 60 + m - HOUR_START * 60;
  return Math.max(0, (minutes / 60) * HOUR_HEIGHT);
}

export function LessonWeekGrid({ weekDays, lessons, subjects, onSelectLesson }: LessonWeekGridProps) {
  return (
    <div className="lesson-week-grid">
      <div className="lesson-week-grid__header">
        <div className="lesson-week-grid__time-col" />
        {weekDays.map((iso, i) => (
          <div key={iso} className="lesson-week-grid__day-header">
            {LESSON_DAY_SHORT[i]} {fromISODate(iso).getDate()}
          </div>
        ))}
      </div>
      <div className="lesson-week-grid__body">
        <div className="lesson-week-grid__time-col" style={{ height: GRID_HEIGHT }}>
          {HOURS.map((hour) => (
            <div key={hour} className="lesson-week-grid__hour-label" style={{ height: HOUR_HEIGHT }}>
              {formatHourLabel(hour)}
            </div>
          ))}
        </div>
        {weekDays.map((iso, dayIdx) => {
          const dayLessons = lessons.filter((l) => l.day === dayIdx);
          return (
            <div key={iso} className="lesson-week-grid__day-col" style={{ height: GRID_HEIGHT }}>
              {HOURS.map((hour) => (
                <div key={hour} className="lesson-week-grid__hour-line" style={{ height: HOUR_HEIGHT }} />
              ))}
              {dayLessons.map((lesson) => {
                const subjectIndex = subjects.findIndex((s) => s.id === lesson.subjectId);
                const colors = lessonSubjectColors(Math.max(subjectIndex, 0));
                const top = offsetForTime(lesson.startTime);
                const height = Math.max(28, (lesson.durationMinutes / 60) * HOUR_HEIGHT);
                const isDone = lesson.status === 'done';
                return (
                  <div
                    key={lesson.id}
                    className={`lesson-week-grid__block${isDone ? ' lesson-week-grid__block--done' : ''}`}
                    style={{ top, height, background: colors.accentSoft, borderLeftColor: colors.accent, color: colors.tagText }}
                    onClick={() => onSelectLesson(lesson.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="lesson-week-grid__block-title">{lesson.objective}</span>
                    <span className="lesson-week-grid__block-time">{formatTime12h(lesson.startTime)}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
