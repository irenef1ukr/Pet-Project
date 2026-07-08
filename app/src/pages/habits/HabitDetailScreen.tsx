import { useState } from 'react';
import { buildHeatmapCells, buildHistory, buildWeekDays, completionRate, computeStreak, frequencyLabel } from '../../lib/habitUtils';
import type { HabitCategoryColors } from '../../lib/habitUtils';
import type { Habit, HabitCategory } from '../../types';
import './habits-shared.css';
import './HabitDetailScreen.css';

interface HabitDetailScreenProps {
  habit: Habit;
  category: HabitCategory | undefined;
  colors: HabitCategoryColors;
  todayIso: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleArchive: () => void;
  onToggleDay: (dateIso: string) => void;
  onSaveNote: (dateIso: string, note: string) => void;
}

export function HabitDetailScreen({
  habit,
  category,
  colors,
  todayIso,
  onBack,
  onEdit,
  onDelete,
  onToggleArchive,
  onToggleDay,
  onSaveNote,
}: HabitDetailScreenProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingNoteIso, setEditingNoteIso] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const streak = computeStreak(habit, todayIso);
  const rate = completionRate(habit, todayIso, 30);
  const week = buildWeekDays(habit, todayIso);
  const heatmap = buildHeatmapCells(habit, todayIso);
  const history = buildHistory(habit, todayIso, 30);

  const startEditingNote = (dateIso: string, currentNote: string) => {
    setEditingNoteIso(dateIso);
    setNoteDraft(currentNote);
  };

  const saveNote = () => {
    if (editingNoteIso) onSaveNote(editingNoteIso, noteDraft.trim());
    setEditingNoteIso(null);
  };

  return (
    <div className="habit-detail-screen">
      <div className="habit-detail-screen__inner">
        <span className="habit-detail-screen__back" onClick={onBack} role="button" tabIndex={0}>
          ‹ Back
        </span>

        <div className="habit-detail-card">
          <div className="habit-detail-card__header">
            <span className="habit-detail-card__title">{habit.title}</span>
            <span className="habit-detail-card__streak">🔥 {streak}</span>
          </div>
          {category && (
            <span
              className="habit-detail-card__category"
              style={{ background: colors.tagBg, color: colors.tagText }}
            >
              {category.emoji} {category.name}
            </span>
          )}
          {habit.archived && <span className="habit-detail-card__archived-badge">Archived</span>}

          <div className="habit-detail-card__week">
            {week.map((d) => (
              <span
                key={d.iso}
                className={`habit-day habit-day--big${d.done ? ' habit-day--done' : ''}${!d.scheduled ? ' habit-day--unscheduled' : ''}${d.future ? ' habit-day--future' : ''}`}
                style={d.done ? { background: colors.accent } : undefined}
                onClick={d.clickable ? () => onToggleDay(d.iso) : undefined}
                role={d.clickable ? 'button' : undefined}
                tabIndex={d.clickable ? 0 : undefined}
              >
                {d.letter}
              </span>
            ))}
          </div>

          <div className="habit-detail-card__stats">
            <span>{frequencyLabel(habit)}</span>
            <span>{rate}% last 30 days</span>
          </div>

          {habit.description && <div className="habit-detail-card__description">{habit.description}</div>}

          <div className="habit-detail-card__footer">
            {confirmingDelete ? (
              <>
                <span className="habit-detail-card__delete-confirm">Delete this habit?</span>
                <div className="habit-detail-card__delete-actions">
                  <button type="button" className="habit-detail-card__link-btn habit-detail-card__link-btn--danger" onClick={onDelete}>
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="habit-detail-card__link-btn habit-detail-card__link-btn--muted"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="habit-detail-card__footer-left">
                  <button type="button" className="habit-detail-card__delete" onClick={() => setConfirmingDelete(true)}>
                    Delete
                  </button>
                  <button type="button" className="habit-detail-card__archive" onClick={onToggleArchive}>
                    {habit.archived ? 'Unarchive' : 'Archive'}
                  </button>
                </div>
                <button type="button" className="habit-detail-card__edit" onClick={onEdit}>
                  Edit Habit
                </button>
              </>
            )}
          </div>
        </div>

        <div className="habit-detail-section">
          <span className="habit-detail-section__title">Last 9 Weeks</span>
          <div className="habit-heatmap">
            {heatmap.map((cell) => (
              <span
                key={cell.iso}
                title={`${cell.label} — ${!cell.scheduled ? 'not scheduled' : cell.done ? 'done' : 'missed'}`}
                className={`habit-heatmap__cell${!cell.scheduled ? ' habit-heatmap__cell--unscheduled' : ''}${cell.scheduled && !cell.done ? ' habit-heatmap__cell--missed' : ''}`}
                style={cell.done ? { background: colors.accent } : undefined}
              />
            ))}
          </div>
          <div className="habit-heatmap__legend">
            <span>Less</span>
            <span className="habit-heatmap__legend-swatch" style={{ background: 'oklch(0.93 0.015 240)' }} />
            <span className="habit-heatmap__legend-swatch" style={{ background: colors.accentSoft }} />
            <span className="habit-heatmap__legend-swatch" style={{ background: colors.accent }} />
            <span>More</span>
          </div>
        </div>

        <div className="habit-detail-section">
          <span className="habit-detail-section__title">History</span>
          {history.length === 0 ? (
            <span className="habit-detail-section__empty">No scheduled days yet.</span>
          ) : (
            <div className="habit-history-list">
              {history.map((entry) => (
                <div key={entry.iso} className="habit-history-row">
                  <span className={`habit-history-row__status${entry.done ? ' habit-history-row__status--done' : ''}`}>
                    {entry.done ? '✓' : '—'}
                  </span>
                  <span className="habit-history-row__date">{entry.label}</span>
                  {entry.done && editingNoteIso === entry.iso ? (
                    <div className="habit-history-row__note-editor">
                      <textarea
                        autoFocus
                        placeholder="Add a note…"
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                      />
                      <div className="habit-history-row__note-actions">
                        <button type="button" onClick={() => setEditingNoteIso(null)}>
                          Cancel
                        </button>
                        <button type="button" className="habit-history-row__note-save" onClick={saveNote}>
                          Save
                        </button>
                      </div>
                    </div>
                  ) : entry.done ? (
                    <span
                      className="habit-history-row__note"
                      onClick={() => startEditingNote(entry.iso, entry.note)}
                      role="button"
                      tabIndex={0}
                    >
                      {entry.note || 'Add a note…'}
                    </span>
                  ) : (
                    <span className="habit-history-row__note habit-history-row__note--disabled">missed</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
