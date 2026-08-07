import { useState } from 'react';
import { formatShortDate } from '../../lib/todoUtils';
import { notePreview } from '../../lib/noteUtils';
import type { Note } from '../../types';
import './NoteEntries.css';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="note-card">
      <div className="note-card__header">
        <span className="note-card__title">{note.title || 'Untitled note'}</span>
        <span
          className={`note-pin-icon${note.pinned ? ' note-pin-icon--active' : ''}`}
          onClick={onTogglePin}
          role="button"
          tabIndex={0}
        >
          📌
        </span>
      </div>
      <div className="note-card__preview">{notePreview(note, 140)}</div>
      {note.tags.length > 0 && (
        <div className="note-card__tags">
          {note.tags.map((t) => (
            <span key={t} className="note-tag">
              #{t}
            </span>
          ))}
        </div>
      )}
      <div className="note-card__footer">
        <span className="note-card__updated">{formatShortDate(note.updatedAt)}</span>
        {confirming ? (
          <>
            <span className="note-row__confirm-text">Delete?</span>
            <span className="note-action note-action--danger" onClick={onDelete} role="button" tabIndex={0}>
              Yes
            </span>
            <span className="note-action" onClick={() => setConfirming(false)} role="button" tabIndex={0}>
              No
            </span>
          </>
        ) : (
          <>
            <span className="note-action" onClick={onEdit} role="button" tabIndex={0}>
              Edit
            </span>
            <span
              className="note-action note-action--danger"
              onClick={() => setConfirming(true)}
              role="button"
              tabIndex={0}
            >
              Delete
            </span>
          </>
        )}
      </div>
    </div>
  );
}
