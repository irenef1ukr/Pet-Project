import { entryPreview } from '../../lib/journalUtils';
import { formatShortDate } from '../../lib/todoUtils';
import type { JournalEntry } from '../../types';
import './JournalStrip.css';

interface JournalStripProps {
  entry: JournalEntry | null;
  onNavigate: () => void;
  onAdd: () => void;
}

export function JournalStrip({ entry, onNavigate, onAdd }: JournalStripProps) {
  return (
    <div className="dash-card journal-strip">
      <div className="journal-strip__row">
        <span
          className="section-pill journal-pill"
          onClick={onNavigate}
          role="button"
          tabIndex={0}
        >
          Journal →
        </span>
        {entry ? (
          <span className="journal-strip__preview">
            {formatShortDate(entry.date)} — &quot;{entryPreview(entry)}&quot;
          </span>
        ) : (
          <span className="journal-strip__empty">
            You haven&apos;t written today — capture a thought
          </span>
        )}
      </div>
      <div className="journal-strip__actions">
        <button type="button" className="plus-button journal-plus" onClick={onAdd}>
          +
        </button>
      </div>
    </div>
  );
}
