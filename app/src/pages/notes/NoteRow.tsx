import { useState } from 'react';
import { formatShortDate } from '../../lib/todoUtils';
import type { Note } from '../../types';
import './NoteEntries.css';

interface NoteRowProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function NoteRow({ note, onEdit, onDelete, onTogglePin }: NoteRowProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="note-row">
      <span
        className={`note-pin-icon${note.pinned ? ' note-pin-icon--active' : ''}`}
        onClick={onTogglePin}
        role="button"
        tabIndex={0}
      >
        📌
      </span>
      <div className="note-row__content">
        <div className="note-row__header">
          <span className="note-row__title">{note.title || 'Untitled note'}</span>
          <div className="note-row__actions">
            {confirming ? (
              <>
                <span className="note-row__confirm-text">Delete this note?</span>
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
        <div className="note-row__body" dangerouslySetInnerHTML={{ __html: note.bodyHtml }} />
        <div className="note-row__footer">
          {note.tags.length > 0 && (
            <div className="note-row__tags">
              {note.tags.map((t) => (
                <span key={t} className="note-tag">
                  #{t}
                </span>
              ))}
            </div>
          )}
          <span className="note-row__updated">Updated {formatShortDate(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
