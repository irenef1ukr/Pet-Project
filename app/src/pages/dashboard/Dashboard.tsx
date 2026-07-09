import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../../components/TopNav';
import { HeroGreeting } from './HeroGreeting';
import { TasksCard } from './TasksCard';
import { EventsCard } from './EventsCard';
import { GoalsCard } from './GoalsCard';
import { HabitsCard, type HabitView } from './HabitsCard';
import { FinanceCard } from './FinanceCard';
import { JournalStrip } from './JournalStrip';
import { QuickAddTaskModal } from './QuickAddTaskModal';
import { QuickAddEventModal } from './QuickAddEventModal';
import { getDailyQuote, getTodayDate, getTodayISO, moodOptions, userName, weatherOptions } from '../../data/mockData';
import { formatFullDate, getGreetingPrefix } from '../../lib/dateUtils';
import { computeFinanceSummary } from '../../lib/financeUtils';
import { computeStreak } from '../../lib/habitUtils';
import { isMyDay, isOverdue } from '../../lib/todoUtils';
import { useAppData } from '../../store/AppDataContext';
import type { CalendarEvent, DashboardEvent, DashboardTask, TodoTask } from '../../types';
import './dashboard-shared.css';
import './Dashboard.css';

function toDashboardTask(task: TodoTask, today: string): DashboardTask {
  return {
    id: task.id,
    label: task.title,
    status: task.status === 'complete' ? 'done' : task.status === 'in_progress' ? 'in_progress' : 'todo',
    overdue: isOverdue(task, today),
    recurring: task.recurring !== 'none',
  };
}

function toDashboardEvent(event: CalendarEvent): DashboardEvent {
  const [hour, minute] = (event.startTime ?? '0:00').split(':');
  return {
    id: event.id,
    time: `${Number(hour)}:${minute}`,
    title: event.title,
    recurring: event.recurring !== 'none',
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks: todoTasks,
    calendarEntries,
    financeTransactions,
    goals,
    habits,
    toggleHabitCompletion,
    journalEntries,
    cycleTaskStatus,
    createTask,
    createEvent,
    dayMeta,
    setDayMood,
    setDayWeather,
  } = useAppData();

  const today = getTodayDate();
  const todayIso = getTodayISO();

  const financeSummary = useMemo(
    () => computeFinanceSummary(financeTransactions, todayIso),
    [financeTransactions, todayIso],
  );

  const moodEmoji = dayMeta[todayIso]?.mood ?? null;
  const weatherEmoji = dayMeta[todayIso]?.weather ?? null;
  const [quickAddModal, setQuickAddModal] = useState<'none' | 'task' | 'event'>('none');

  const tasks = useMemo(
    () => todoTasks.filter((t) => isMyDay(t, todayIso)).map((t) => toDashboardTask(t, todayIso)),
    [todoTasks, todayIso],
  );

  const todaysEvents = useMemo(
    () =>
      calendarEntries
        .filter((e) => !e.allDay && e.date === todayIso && !e.id.startsWith('task-'))
        .map(toDashboardEvent),
    [calendarEntries, todayIso],
  );

  const latestJournalEntry = useMemo(
    () =>
      journalEntries.length === 0
        ? null
        : [...journalEntries].sort((a, b) => (a.date < b.date ? 1 : -1))[0],
    [journalEntries],
  );

  const habitViews = useMemo<HabitView[]>(
    () =>
      habits
        .filter((h) => !h.archived)
        .map((h) => ({
          id: h.id,
          label: h.title,
          done: todayIso in h.completions,
          streakCount: computeStreak(h, todayIso),
        })),
    [habits, todayIso],
  );

  return (
    <div className="page">
      <TopNav />

      <div className="dashboard-main">
        <div className="dashboard-main__header">
          <span className="zone-label">Home</span>
        </div>

        <HeroGreeting
          userName={userName}
          greeting={getGreetingPrefix(today)}
          date={formatFullDate(today)}
          quote={getDailyQuote(today)}
          moodEmoji={moodEmoji}
          weatherEmoji={weatherEmoji}
          moodOptions={moodOptions}
          weatherOptions={weatherOptions}
          onSelectMood={(emoji) => setDayMood(todayIso, emoji)}
          onSelectWeather={(emoji) => setDayWeather(todayIso, emoji)}
        />

        <span className="zone-label">Today</span>
        <div className="dashboard-grid dashboard-grid--today">
          <TasksCard
            tasks={tasks}
            onCycleStatus={cycleTaskStatus}
            onNavigate={() => navigate('/todo')}
            onAdd={() => setQuickAddModal('task')}
          />
          <EventsCard
            events={todaysEvents}
            nowTime={`${today.getHours()}:${today.getMinutes().toString().padStart(2, '0')}`}
            onNavigate={() => navigate('/calendar')}
            onAdd={() => setQuickAddModal('event')}
          />
        </div>

        <span className="zone-label">Progress</span>
        <div className="dashboard-grid dashboard-grid--progress">
          <GoalsCard
            goals={goals}
            onNavigate={() => navigate('/goals')}
            onAdd={() => navigate('/goals')}
          />
          <HabitsCard
            habits={habitViews}
            onToggle={(id) => toggleHabitCompletion(id, todayIso)}
            onNavigate={() => navigate('/habits')}
            onAdd={() => navigate('/habits')}
          />
          <FinanceCard summary={financeSummary} onNavigate={() => navigate('/finance')} />
        </div>

        <JournalStrip
          entry={latestJournalEntry}
          onNavigate={() => navigate('/journal')}
          onAdd={() => navigate('/journal')}
        />
      </div>

      {quickAddModal === 'task' && (
        <QuickAddTaskModal
          today={todayIso}
          onCreate={(draft) => {
            createTask(draft);
            setQuickAddModal('none');
          }}
          onClose={() => setQuickAddModal('none')}
        />
      )}

      {quickAddModal === 'event' && (
        <QuickAddEventModal
          today={todayIso}
          onCreate={(draft) => {
            createEvent(draft);
            setQuickAddModal('none');
          }}
          onClose={() => setQuickAddModal('none')}
        />
      )}
    </div>
  );
}
