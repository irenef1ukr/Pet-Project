import { useState } from 'react';
import { formatShortDate } from '../../lib/todoUtils';
import { entryPreview } from '../../lib/journalUtils';
import type { JournalEntry } from '../../types';
import './JournalEntries.css';

interface JournalEntryCardProps {
  entry: JournalEntry;
  folderName: string;
  goalName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function JournalEntryCard({ entry, folderName, goalName, onEdit, onDelete }: JournalEntryCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="journal-card">
      <div className="journal-card__media">
        {entry.mediaUrl ? (
          entry.mediaType === 'video' ? (
            <video src={entry.mediaUrl} controls className="journal-card__media-el" />
          ) : (
            <img src={entry.mediaUrl} alt={entry.title || 'Journal entry attachment'} className="journal-card__media-el" />
          )
        ) : (
          <div className="journal-card__media-placeholder">No photo</div>
        )}
      </div>
      <div className="journal-card__body">
        <div className="journal-card__header">
          <span className="journal-card__date">{formatShortDate(entry.date)}</span>
          <span className="journal-row__mood-weather">
            {entry.mood}
            {entry.weather}
          </span>
        </div>
        <div className="journal-card__title">{entry.title}</div>
        <div className="journal-row__tags">
          <span className="journal-tag journal-tag--folder">📁 {folderName}</span>
          {goalName && <span className="journal-tag journal-tag--goal">🎯 {goalName}</span>}
        </div>
        <div className="journal-card__preview">{entryPreview(entry, 90)}</div>
        <div className="journal-card__footer">
          {confirming ? (
            <>
              <span className="journal-row__confirm-text">Delete?</span>
              <span className="journal-action journal-action--danger" onClick={onDelete} role="button" tabIndex={0}>
                Yes
              </span>
              <span className="journal-action" onClick={() => setConfirming(false)} role="button" tabIndex={0}>
                No
              </span>
            </>
          ) : (
            <>
              <span className="journal-action" onClick={onEdit} role="button" tabIndex={0}>
                Edit
              </span>
              <span
                className="journal-action journal-action--danger"
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
    </div>
  );
}
