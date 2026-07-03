import { useState } from 'react';
import type { CalendarEventDraft, TodoRecurrence } from '../../types';
import '../../components/modal-shared.css';

interface QuickAddEventModalProps {
  today: string;
  onCreate: (draft: CalendarEventDraft) => void;
  onClose: () => void;
}

export function QuickAddEventModal({ today, onCreate, onClose }: QuickAddEventModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [recurring, setRecurring] = useState<TodoRecurrence>('none');
  const [titleError, setTitleError] = useState(false);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      return;
    }
    onCreate({
      title: trimmed,
      type: 'event',
      category: 'personal',
      date: today,
      allDay: !time,
      startTime: time || undefined,
      endTime: time || undefined,
      recurring,
      reminders: [],
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <div className="modal-card__header">
          <h2 className="modal-card__title">Add Event</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div className={`modal-field${titleError ? ' modal-field--error' : ''}`}>
            <label>Event Title *</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={title}
              autoFocus
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') onClose();
              }}
            />
            {titleError && <span className="modal-field__error-text">Title is required</span>}
          </div>

          <div className="modal-field">
            <label>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="modal-field">
            <label>Repeat</label>
            <select value={recurring} onChange={(e) => setRecurring(e.target.value as TodoRecurrence)}>
              <option value="none">Does not repeat</option>
              <option value="daily">🔁 Daily</option>
              <option value="weekly">🔁 Weekly</option>
              <option value="monthly">🔁 Monthly</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-actions__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="modal-actions__primary" onClick={handleSave}>
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
