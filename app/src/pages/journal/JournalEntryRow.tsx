import { useState } from 'react';
import { formatShortDate } from '../../lib/todoUtils';
import type { JournalEntry } from '../../types';
import './JournalEntries.css';

interface JournalEntryRowProps {
  entry: JournalEntry;
  folderName: string;
  goalName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function JournalEntryRow({ entry, folderName, goalName, onEdit, onDelete }: JournalEntryRowProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="journal-row">
      <div className="journal-row__date">
        <span className="journal-row__date-label">{formatShortDate(entry.date)}</span>
        <span className="journal-row__mood-weather">
          {entry.mood}
          {entry.weather}
        </span>
      </div>
      <div className="journal-row__content">
        <div className="journal-row__header">
          <span className="journal-row__title">{entry.title}</span>
          <div className="journal-row__actions">
            {confirming ? (
              <>
                <span className="journal-row__confirm-text">Delete this entry?</span>
                <span className="journal-action journal-action--danger" onClick={onDelete} role="button" tabIndex={0}>
                  Yes
                </span>
                <span
                  className="journal-action"
                  onClick={() => setConfirming(false)}
                  role="button"
                  tabIndex={0}
                >
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
        <div className="journal-row__body" dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
        <div className="journal-row__tags">
          <span className="journal-tag journal-tag--folder">📁 {folderName}</span>
          {goalName && <span className="journal-tag journal-tag--goal">🎯 {goalName}</span>}
        </div>
        {entry.mediaUrl && (
          <div className="journal-row__media">
            {entry.mediaType === 'video' ? (
              <video src={entry.mediaUrl} controls className="journal-row__media-el" />
            ) : (
              <img src={entry.mediaUrl} alt={entry.title || 'Journal entry attachment'} className="journal-row__media-el" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
