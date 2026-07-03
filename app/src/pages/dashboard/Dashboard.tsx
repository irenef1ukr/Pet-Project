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
import {
  allGoals,
  financeSummary,
  getDailyQuote,
  getTodayDate,
  getTodayISO,
  initialHabits,
  latestJournalEntry,
  moodOptions,
  userName,
  weatherOptions,
} from '../../data/mockData';
import { addDaysIso, formatFullDate, getGreetingPrefix } from '../../lib/dateUtils';
import { isMyDay, isOverdue } from '../../lib/todoUtils';
import { useLocalStorageState } from '../../lib/useLocalStorageState';
import { useAppData } from '../../store/AppDataContext';
import type { CalendarEvent, DashboardEvent, DashboardTask, Habit, TodoTask } from '../../types';
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
  const { tasks: todoTasks, events, cycleTaskStatus, createTask, createEvent } = useAppData();

  const today = getTodayDate();
  const todayIso = getTodayISO();

  const [habits, setHabits] = useLocalStorageState<Habit[]>('hi-app:habits', initialHabits);
  const [moodEmoji, setMoodEmoji] = useLocalStorageState<string | null>('hi-app:mood', null);
  const [weatherEmoji, setWeatherEmoji] = useLocalStorageState<string | null>('hi-app:weather', null);
  const [quickAddModal, setQuickAddModal] = useState<'none' | 'task' | 'event'>('none');

  const tasks = useMemo(
    () => todoTasks.filter((t) => isMyDay(t, todayIso)).map((t) => toDashboardTask(t, todayIso)),
    [todoTasks, todayIso],
  );

  const todaysEvents = useMemo(
    () => events.filter((e) => !e.allDay && e.date === todayIso).map(toDashboardEvent),
    [events, todayIso],
  );

  const habitViews = useMemo<HabitView[]>(
    () =>
      habits.map((h) => ({
        id: h.id,
        label: h.label,
        done: h.lastCompletedDate === todayIso,
        streakCount: h.streakCount,
      })),
    [habits, todayIso],
  );

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const doneToday = h.lastCompletedDate === todayIso;
        if (doneToday) {
          return { ...h, lastCompletedDate: null, streakCount: Math.max(0, h.streakCount - 1) };
        }
        const continuing = h.lastCompletedDate === addDaysIso(todayIso, -1);
        return { ...h, lastCompletedDate: todayIso, streakCount: continuing ? h.streakCount + 1 : 1 };
      }),
    );
  };

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
          onSelectMood={setMoodEmoji}
          onSelectWeather={setWeatherEmoji}
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
            goals={allGoals}
            onNavigate={() => navigate('/goals')}
            onAdd={() => navigate('/goals')}
          />
          <HabitsCard
            habits={habitViews}
            onToggle={toggleHabit}
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
