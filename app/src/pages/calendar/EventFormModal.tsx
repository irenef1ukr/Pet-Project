import { useState } from 'react';
import type { CalendarEvent, CalendarEventCategory, CalendarEventDraft, CalendarEventType, TodoRecurrence } from '../../types';
import { COLOR_SWATCHES } from './calendarUtils';
import '../../components/modal-shared.css';
import './EventFormModal.css';

interface TypeOption {
  key: string;
  label: string;
  type: CalendarEventType;
  category: CalendarEventCategory;
}

const TYPE_OPTIONS: TypeOption[] = [
  { key: 'work', label: 'Work event', type: 'event', category: 'work' },
  { key: 'personal', label: 'Personal event', type: 'event', category: 'personal' },
  { key: 'lesson', label: 'Lesson', type: 'lesson', category: 'lesson' },
];

const REMINDER_OPTIONS = [
  { minutes: 15, label: '15 minutes before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 1440, label: '1 day before' },
];

interface FormState {
  title: string;
  typeKey: string;
  date: string;
  allDay: boolean;
  endDate: string;
  startTime: string;
  endTime: string;
  recurring: TodoRecurrence;
  colorOverride: string;
  reminders: number[];
}

function toFormState(initial: CalendarEvent | undefined, today: string): FormState {
  if (!initial) {
    return {
      title: '',
      typeKey: '',
      date: today,
      allDay: false,
      endDate: '',
      startTime: '',
      endTime: '',
      recurring: 'none',
      colorOverride: '',
      reminders: [],
    };
  }
  const match = TYPE_OPTIONS.find((o) => o.type === initial.type && o.category === initial.category);
  return {
    title: initial.title,
    typeKey: match?.key ?? '',
    date: initial.date,
    allDay: Boolean(initial.allDay),
    endDate: initial.endDate ?? '',
    startTime: initial.startTime ?? '',
    endTime: initial.endTime ?? '',
    recurring: initial.recurring,
    colorOverride: initial.colorOverride ?? '',
    reminders: initial.reminders ?? [],
  };
}

interface EventFormModalProps {
  mode: 'create' | 'edit';
  initial?: CalendarEvent;
  today: string;
  onSubmit: (draft: CalendarEventDraft) => void;
  onClose: () => void;
}

export function EventFormModal({ mode, initial, today, onSubmit, onClose }: EventFormModalProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial, today));
  const [titleError, setTitleError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [dateError, setDateError] = useState('');

  const patch = (fields: Partial<FormState>) => setForm((f) => ({ ...f, ...fields }));

  const toggleReminder = (minutes: number) => {
    setForm((f) => ({
      ...f,
      reminders: f.reminders.includes(minutes)
        ? f.reminders.filter((m) => m !== minutes)
        : [...f.reminders, minutes],
    }));
  };

  const handleSubmit = () => {
    const trimmedTitle = form.title.trim();
    const typeOpt = TYPE_OPTIONS.find((o) => o.key === form.typeKey);

    const hasTitle = Boolean(trimmedTitle);
    const hasType = Boolean(typeOpt);
    setTitleError(!hasTitle);
    setTypeError(!hasType);

    if (!hasTitle || !hasType) return;

    if (form.date < today) {
      setDateError(mode === 'create' ? 'Cannot create events in the past' : 'Cannot move events to the past');
      return;
    }
    setDateError('');

    onSubmit({
      title: trimmedTitle,
      type: typeOpt!.type,
      category: typeOpt!.category,
      date: form.date,
      endDate: form.allDay && form.endDate ? form.endDate : undefined,
      allDay: form.allDay,
      startTime: form.allDay ? undefined : form.startTime || undefined,
      endTime: form.allDay ? undefined : form.endTime || undefined,
      recurring: form.recurring,
      colorOverride: form.colorOverride || undefined,
      reminders: form.reminders,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card event-form">
        <div className="modal-card__header">
          <h2 className="modal-card__title">{mode === 'create' ? 'Create Event' : 'Edit Event'}</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="event-form__body">
          {(titleError || typeError) && (
            <span className="modal-field__error-text">Title and Type are required</span>
          )}

          <div className={`modal-field${titleError ? ' modal-field--error' : ''}`}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Event title"
              value={form.title}
              autoFocus
              onChange={(e) => {
                patch({ title: e.target.value });
                if (titleError) setTitleError(false);
              }}
            />
          </div>

          <div className="modal-field">
            <label>Type</label>
            <select
              value={form.typeKey}
              onChange={(e) => {
                patch({ typeKey: e.target.value });
                if (typeError) setTypeError(false);
              }}
              style={typeError ? { borderColor: 'oklch(0.6 0.28 25)' } : undefined}
            >
              <option value="">Select type</option>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-row modal-row--2">
            <div className="modal-field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => {
                  patch({ date: e.target.value });
                  setDateError('');
                }}
              />
            </div>
            {form.allDay && (
              <div className="modal-field">
                <label>End Date (optional)</label>
                <input type="date" value={form.endDate} onChange={(e) => patch({ endDate: e.target.value })} />
              </div>
            )}
          </div>
          {dateError && <span className="modal-field__error-text">{dateError}</span>}

          <label className="modal-checkbox-row">
            <input type="checkbox" checked={form.allDay} onChange={(e) => patch({ allDay: e.target.checked })} />
            All-day
          </label>

          {!form.allDay && (
            <div className="modal-row modal-row--2">
              <div className="modal-field">
                <label>Start Time</label>
                <input type="time" value={form.startTime} onChange={(e) => patch({ startTime: e.target.value })} />
              </div>
              <div className="modal-field">
                <label>End Time</label>
                <input type="time" value={form.endTime} onChange={(e) => patch({ endTime: e.target.value })} />
              </div>
            </div>
          )}

          <div className="modal-field">
            <label>Recurrence</label>
            <select value={form.recurring} onChange={(e) => patch({ recurring: e.target.value as TodoRecurrence })}>
              <option value="none">Does not repeat</option>
              <option value="daily">🔁 Daily</option>
              <option value="weekly">🔁 Weekly</option>
              <option value="monthly">🔁 Monthly</option>
            </select>
          </div>

          <div className="modal-field">
            <label>Color</label>
            <div className="modal-swatch-row">
              <button
                type="button"
                className={`modal-swatch modal-swatch--auto${form.colorOverride === '' ? ' modal-swatch--selected' : ''}`}
                onClick={() => patch({ colorOverride: '' })}
                title="Use default color for type"
                aria-label="Use default color for type"
              />
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`modal-swatch${form.colorOverride === color ? ' modal-swatch--selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => patch({ colorOverride: color })}
                  aria-label={`Use color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="modal-field">
            <label>Reminders</label>
            <div className="event-form__reminders">
              {REMINDER_OPTIONS.map((opt) => (
                <label key={opt.minutes} className="modal-checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.reminders.includes(opt.minutes)}
                    onChange={() => toggleReminder(opt.minutes)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-actions__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="modal-actions__primary" onClick={handleSubmit}>
              {mode === 'create' ? 'Create Event' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
