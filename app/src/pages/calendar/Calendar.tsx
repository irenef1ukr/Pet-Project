import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../../components/TopNav';
import { NOW_TIME, dayMeta, getTodayDate, getTodayISO } from '../../data/mockData';
import { useAppData } from '../../store/AppDataContext';
import type { CalendarView } from '../../types';
import { DayView } from './DayView';
import { DeleteEventConfirmModal } from './DeleteEventConfirmModal';
import { EventDetailModal } from './EventDetailModal';
import { EventFormModal } from './EventFormModal';
import { MiniMonthPicker } from './MiniMonthPicker';
import { MonthView } from './MonthView';
import { UpcomingList } from './UpcomingList';
import { ViewSwitcher } from './ViewSwitcher';
import { WeekView } from './WeekView';
import { addDays, addMonths, getUpcomingEvents } from './calendarUtils';
import './Calendar.css';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'detail'; eventId: string }
  | { type: 'edit'; eventId: string }
  | { type: 'delete'; eventId: string };

export function Calendar() {
  const navigate = useNavigate();
  const { events, calendarEntries, createEvent, updateEvent, deleteEvent } = useAppData();
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const today = getTodayDate();
  const todayIso = getTodayISO();

  const goToDay = (date: Date) => {
    setSelectedDate(date);
    setView('day');
  };

  const goToPrev = () => {
    if (view === 'month') setSelectedDate((d) => addMonths(d, -1));
    else if (view === 'week') setSelectedDate((d) => addDays(d, -7));
    else setSelectedDate((d) => addDays(d, -1));
  };

  const goToNext = () => {
    if (view === 'month') setSelectedDate((d) => addMonths(d, 1));
    else if (view === 'week') setSelectedDate((d) => addDays(d, 7));
    else setSelectedDate((d) => addDays(d, 1));
  };

  const upcoming = useMemo(() => getUpcomingEvents(calendarEntries, today, 4), [calendarEntries, today]);

  const selectedEvent =
    (modal.type === 'detail' || modal.type === 'edit' || modal.type === 'delete') &&
    events.find((e) => e.id === modal.eventId);

  return (
    <div className="page">
      <TopNav />
      <div className="calendar-main">
        <div className="calendar-toolbar">
          <ViewSwitcher view={view} onChange={setView} />
          <button type="button" className="calendar-create-btn" onClick={() => setModal({ type: 'create' })}>
            + Create Event
          </button>
        </div>

        <div className="calendar-layout">
          {view === 'month' && (
            <MonthView
              selectedDate={selectedDate}
              today={today}
              events={calendarEntries}
              dayMeta={dayMeta}
              onPrev={goToPrev}
              onNext={goToNext}
              onSelectDay={goToDay}
              onSelectEvent={(e) => setModal({ type: 'detail', eventId: e.id })}
            />
          )}
          {view === 'week' && (
            <WeekView
              selectedDate={selectedDate}
              today={today}
              events={calendarEntries}
              onPrev={goToPrev}
              onNext={goToNext}
              onSelectDay={goToDay}
              onSelectEvent={(e) => setModal({ type: 'detail', eventId: e.id })}
            />
          )}
          {view === 'day' && (
            <DayView
              selectedDate={selectedDate}
              today={today}
              nowTime={NOW_TIME}
              events={calendarEntries}
              dayMeta={dayMeta}
              onPrev={goToPrev}
              onNext={goToNext}
              onSelectEvent={(e) => setModal({ type: 'detail', eventId: e.id })}
              onNavigateFinance={() => navigate('/finance')}
            />
          )}

          <div className="calendar-sidebar">
            {view === 'day' && <MiniMonthPicker selectedDate={selectedDate} onSelectDay={setSelectedDate} />}
            <UpcomingList events={upcoming} onSelectEvent={(e) => setModal({ type: 'detail', eventId: e.id })} />
          </div>
        </div>
      </div>

      {modal.type === 'create' && (
        <EventFormModal
          mode="create"
          today={todayIso}
          onSubmit={(draft) => {
            createEvent(draft);
            setModal({ type: 'none' });
          }}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'detail' && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onEdit={() => setModal({ type: 'edit', eventId: selectedEvent.id })}
          onDelete={() => setModal({ type: 'delete', eventId: selectedEvent.id })}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'edit' && selectedEvent && (
        <EventFormModal
          mode="edit"
          initial={selectedEvent}
          today={todayIso}
          onSubmit={(draft) => {
            updateEvent(selectedEvent.id, draft);
            setModal({ type: 'none' });
          }}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'delete' && selectedEvent && (
        <DeleteEventConfirmModal
          event={selectedEvent}
          onCancel={() => setModal({ type: 'none' })}
          onConfirm={() => {
            deleteEvent(selectedEvent.id);
            setModal({ type: 'none' });
          }}
        />
      )}
    </div>
  );
}
