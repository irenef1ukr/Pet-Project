import { useLayoutEffect, useRef, useState } from 'react';
import { moodOptions, weatherOptions } from '../../data/mockData';
import { JOURNAL_PROMPTS, stripHtml } from '../../lib/journalUtils';
import type { Goal, JournalEntry, JournalEntryDraft, JournalFolder, JournalMediaType } from '../../types';
import { MediaSlot } from './MediaSlot';
import './JournalComposer.css';

interface JournalComposerProps {
  today: string;
  editingEntry?: JournalEntry;
  folders: JournalFolder[];
  goals: Goal[];
  onSave: (draft: JournalEntryDraft) => void;
  onCancelEdit?: () => void;
  onOpenFolders: () => void;
  onCreateGoal: (label: string) => Goal;
}

export function JournalComposer({
  today,
  editingEntry,
  folders,
  goals,
  onSave,
  onCancelEdit,
  onOpenFolders,
  onCreateGoal,
}: JournalComposerProps) {
  const [title, setTitle] = useState(editingEntry?.title ?? '');
  const [date, setDate] = useState(editingEntry?.date ?? today);
  const [folderId, setFolderId] = useState(editingEntry?.folderId ?? folders[0]?.id ?? 'general');
  const [goalId, setGoalId] = useState(editingEntry?.goalId ?? '');
  const [mood, setMood] = useState(editingEntry?.mood ?? '');
  const [weather, setWeather] = useState(editingEntry?.weather ?? '');
  const [mediaUrl, setMediaUrl] = useState(editingEntry?.mediaUrl ?? '');
  const [mediaType, setMediaType] = useState<JournalMediaType>(editingEntry?.mediaType ?? '');
  const [newGoalName, setNewGoalName] = useState('');
  const [promptIndex, setPromptIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const bodyRef = useRef<HTMLDivElement>(null);

  // Composer remounts (via a `key` in the parent) whenever the edited entry
  // changes, so this only needs to seed the contentEditable once per mount —
  // syncing it declaratively via dangerouslySetInnerHTML would wipe the
  // user's in-progress typing on every unrelated re-render.
  useLayoutEffect(() => {
    if (bodyRef.current) bodyRef.current.innerHTML = editingEntry?.bodyHtml ?? '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusBody = () => bodyRef.current?.focus();
  const format = (command: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    focusBody();
    document.execCommand(command);
  };

  const insertPrompt = () => {
    if (!bodyRef.current || promptIndex === null) return;
    bodyRef.current.focus();
    const hasText = Boolean(bodyRef.current.textContent);
    document.execCommand('insertText', false, `${hasText ? ' ' : ''}${JOURNAL_PROMPTS[promptIndex]} `);
  };

  const createGoal = () => {
    const name = newGoalName.trim();
    if (!name) return;
    const goal = onCreateGoal(name);
    setGoalId(goal.id);
    setNewGoalName('');
  };

  const handleSave = () => {
    const bodyHtml = bodyRef.current?.innerHTML ?? '';
    if (!stripHtml(bodyHtml)) {
      setError('Please write something before saving.');
      return;
    }
    onSave({
      title: title.trim(),
      date: date || today,
      bodyHtml,
      mood,
      weather,
      folderId: folderId || 'general',
      goalId,
      mediaUrl,
      mediaType,
    });
  };

  return (
    <div className="journal-composer">
      <div className="journal-composer__header">
        <span className="journal-composer__title">{editingEntry ? 'Edit Entry' : 'New Entry'}</span>
        <div className="journal-composer__header-actions">
          <span
            className="journal-chip-btn"
            onClick={() => setPromptIndex((i) => (i === null ? 0 : (i + 1) % JOURNAL_PROMPTS.length))}
            role="button"
            tabIndex={0}
          >
            ✨ Try a prompt
          </span>
          {editingEntry && onCancelEdit && (
            <span className="journal-composer__cancel" onClick={onCancelEdit} role="button" tabIndex={0}>
              Cancel
            </span>
          )}
        </div>
      </div>

      {promptIndex !== null && (
        <div className="journal-composer__prompt" onClick={insertPrompt} role="button" tabIndex={0}>
          &quot;{JOURNAL_PROMPTS[promptIndex]}&quot;
        </div>
      )}

      <div className="journal-composer__row">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="journal-composer__title-input"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="journal-composer__date-input" />
      </div>

      <div className="journal-composer__row">
        <select value={folderId} onChange={(e) => setFolderId(e.target.value)} className="journal-composer__select">
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              📁 {f.name}
            </option>
          ))}
        </select>
        <span className="journal-composer__link" onClick={onOpenFolders} role="button" tabIndex={0}>
          Manage folders →
        </span>
      </div>

      <div className="journal-composer__row">
        <select value={goalId} onChange={(e) => setGoalId(e.target.value)} className="journal-composer__select">
          <option value="">No linked goal</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              🎯 {g.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New goal name"
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          className="journal-composer__goal-input"
        />
        <span className="journal-chip-btn journal-chip-btn--goal" onClick={createGoal} role="button" tabIndex={0}>
          + Goal
        </span>
      </div>

      <div className="journal-composer__toolbar">
        <span onMouseDown={format('bold')} className="journal-toolbar-btn journal-toolbar-btn--bold">
          B
        </span>
        <span onMouseDown={format('italic')} className="journal-toolbar-btn journal-toolbar-btn--italic">
          I
        </span>
        <span onMouseDown={format('underline')} className="journal-toolbar-btn journal-toolbar-btn--underline">
          U
        </span>
        <span onMouseDown={format('insertUnorderedList')} className="journal-toolbar-btn">
          ☰
        </span>
      </div>
      <div
        ref={bodyRef}
        className="journal-body"
        contentEditable
        data-placeholder="Write what's on your mind…"
        suppressContentEditableWarning
      />

      <div className="journal-composer__mood-row">
        <div className="journal-composer__picker">
          {moodOptions.map((m) => (
            <span
              key={m}
              className={`journal-emoji-btn${mood === m ? ' journal-emoji-btn--selected' : ''}`}
              onClick={() => setMood((cur) => (cur === m ? '' : m))}
              role="button"
              tabIndex={0}
            >
              {m}
            </span>
          ))}
        </div>
        <div className="journal-composer__divider" />
        <div className="journal-composer__picker">
          {weatherOptions.map((w) => (
            <span
              key={w}
              className={`journal-emoji-btn${weather === w ? ' journal-emoji-btn--selected' : ''}`}
              onClick={() => setWeather((cur) => (cur === w ? '' : w))}
              role="button"
              tabIndex={0}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <MediaSlot mediaUrl={mediaUrl} mediaType={mediaType} onChange={(url, type) => { setMediaUrl(url); setMediaType(type); }} />

      {error && <div className="journal-composer__error">{error}</div>}

      <div className="journal-composer__footer">
        <span className="journal-btn-primary" onClick={handleSave} role="button" tabIndex={0}>
          {editingEntry ? 'Save Changes' : 'Save Entry'}
        </span>
      </div>
    </div>
  );
}
