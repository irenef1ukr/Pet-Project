import { useLayoutEffect, useRef, useState } from 'react';
import { normalizeTag, stripHtml } from '../../lib/noteUtils';
import type { Note, NoteDraft } from '../../types';
import './NoteEntries.css';
import './NoteComposer.css';

interface NoteComposerProps {
  editingNote?: Note;
  existingTags: string[];
  onSave: (draft: NoteDraft) => void;
  onCancelEdit?: () => void;
}

export function NoteComposer({ editingNote, existingTags, onSave, onCancelEdit }: NoteComposerProps) {
  const [title, setTitle] = useState(editingNote?.title ?? '');
  const [tags, setTags] = useState<string[]>(editingNote?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [pinned, setPinned] = useState(editingNote?.pinned ?? false);
  const [error, setError] = useState('');

  const bodyRef = useRef<HTMLDivElement>(null);

  // Composer remounts (via a `key` in the parent) whenever the edited note
  // changes, so this only needs to seed the contentEditable once per mount —
  // syncing it declaratively via dangerouslySetInnerHTML would wipe the
  // user's in-progress typing on every unrelated re-render.
  useLayoutEffect(() => {
    if (bodyRef.current) bodyRef.current.innerHTML = editingNote?.bodyHtml ?? '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusBody = () => bodyRef.current?.focus();
  const format = (command: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    focusBody();
    document.execCommand(command);
  };

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw);
    setTagInput('');
    if (!tag) return;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const suggestedTags = existingTags.filter((t) => !tags.includes(t));

  const handleSave = () => {
    const bodyHtml = bodyRef.current?.innerHTML ?? '';
    if (!title.trim() && !stripHtml(bodyHtml)) {
      setError('Please add a title or write something before saving.');
      return;
    }
    onSave({ title: title.trim(), bodyHtml, tags, pinned });
  };

  return (
    <div className="note-composer">
      <div className="note-composer__header">
        <span className="note-composer__title">{editingNote ? 'Edit Note' : 'New Note'}</span>
        <div className="note-composer__header-actions">
          <span
            className={`note-pin-toggle${pinned ? ' note-pin-toggle--active' : ''}`}
            onClick={() => setPinned((p) => !p)}
            role="button"
            tabIndex={0}
          >
            📌 {pinned ? 'Pinned' : 'Pin'}
          </span>
          {editingNote && onCancelEdit && (
            <span className="note-composer__cancel" onClick={onCancelEdit} role="button" tabIndex={0}>
              Cancel
            </span>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="note-composer__title-input"
      />

      <div className="note-composer__toolbar">
        <span onMouseDown={format('bold')} className="note-toolbar-btn note-toolbar-btn--bold">
          B
        </span>
        <span onMouseDown={format('italic')} className="note-toolbar-btn note-toolbar-btn--italic">
          I
        </span>
        <span onMouseDown={format('underline')} className="note-toolbar-btn note-toolbar-btn--underline">
          U
        </span>
        <span onMouseDown={format('insertUnorderedList')} className="note-toolbar-btn">
          ☰
        </span>
      </div>
      <div
        ref={bodyRef}
        className="note-body"
        contentEditable
        data-placeholder="Write your note…"
        suppressContentEditableWarning
      />

      <div className="note-composer__tags-row">
        <div className="note-composer__tag-chips">
          {tags.map((t) => (
            <span key={t} className="note-tag note-tag--editable">
              #{t}
              <span className="note-tag__remove" onClick={() => removeTag(t)} role="button" tabIndex={0}>
                ×
              </span>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => addTag(tagInput)}
            className="note-composer__tag-input"
          />
        </div>
        {suggestedTags.length > 0 && (
          <div className="note-composer__tag-suggestions">
            {suggestedTags.map((t) => (
              <span key={t} className="note-chip-btn" onClick={() => addTag(t)} role="button" tabIndex={0}>
                + #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <div className="note-composer__error">{error}</div>}

      <div className="note-composer__footer">
        <span className="note-btn-primary" onClick={handleSave} role="button" tabIndex={0}>
          {editingNote ? 'Save Changes' : 'Save Note'}
        </span>
      </div>
    </div>
  );
}
