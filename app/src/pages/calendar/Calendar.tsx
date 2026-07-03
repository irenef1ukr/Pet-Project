import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { CALENDAR_TODAY, NOW_TIME, calendarEvents, dayMeta } from '../../data/mockData';
import type { CalendarView } from '../../types';
import { DayView } from './DayView';
import { MiniMonthPicker } from './MiniMonthPicker';
import { MonthView } from './MonthView';
import { UpcomingList } from './UpcomingList';
import { ViewSwitcher } from './ViewSwitcher';
import { WeekView } from './WeekView';
import { addDays, addMonths, getUpcomingEvents } from './calendarUtils';
import './Calendar.css';

export function Calendar() {
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState(CALENDAR_TODAY);

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

  const upcoming = useMemo(() => getUpcomingEvents(calendarEvents, CALENDAR_TODAY, 4), []);

  return (
    <div className="page">
      <TopNav />
      <div className="calendar-main">
        <ViewSwitcher view={view} onChange={setView} />

        <div className="calendar-layout">
          {view === 'month' && (
            <MonthView
              selectedDate={selectedDate}
              today={CALENDAR_TODAY}
              events={calendarEvents}
              dayMeta={dayMeta}
              onPrev={goToPrev}
              onNext={goToNext}
              onSelectDay={goToDay}
            />
          )}
          {view === 'week' && (
            <WeekView
              selectedDate={selectedDate}
              today={CALENDAR_TODAY}
              events={calendarEvents}
              onPrev={goToPrev}
              onNext={goToNext}
              onSelectDay={goToDay}
            />
          )}
          {view === 'day' && (
            <DayView
              selectedDate={selectedDate}
              today={CALENDAR_TODAY}
              nowTime={NOW_TIME}
              events={calendarEvents}
              dayMeta={dayMeta}
              onPrev={goToPrev}
              onNext={goToNext}
            />
          )}

          <div className="calendar-sidebar">
            {view === 'day' && <MiniMonthPicker selectedDate={selectedDate} onSelectDay={setSelectedDate} />}
            <UpcomingList events={upcoming} />
          </div>
        </div>
      </div>
    </div>
  );
}
