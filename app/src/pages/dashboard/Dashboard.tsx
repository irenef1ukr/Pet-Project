import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../../components/TopNav';
import { HeroGreeting } from './HeroGreeting';
import { TasksCard } from './TasksCard';
import { EventsCard } from './EventsCard';
import { GoalsCard } from './GoalsCard';
import { HabitsCard } from './HabitsCard';
import { FinanceCard } from './FinanceCard';
import { JournalStrip } from './JournalStrip';
import {
  NOW_TIME,
  TODAY_ISO,
  allGoals,
  financeSummary,
  greetingDate,
  greetingQuote,
  initialHabits,
  latestJournalEntry,
  moodOptions,
  userName,
  weatherOptions,
} from '../../data/mockData';
import { isMyDay, isOverdue } from '../../lib/todoUtils';
import { useLocalStorageState } from '../../lib/useLocalStorageState';
import { useAppData } from '../../store/AppDataContext';
import type { CalendarEvent, DashboardEvent, DashboardTask, Habit, TodoTask } from '../../types';
import './dashboard-shared.css';
import './Dashboard.css';

function toDashboardTask(task: TodoTask): DashboardTask {
  return {
    id: task.id,
    label: task.title,
    status: task.status === 'complete' ? 'done' : task.status === 'in_progress' ? 'in_progress' : 'todo',
    overdue: isOverdue(task, TODAY_ISO),
    recurring: task.recurring !== 'none',
  };
}

function toDashboardEvent(event: CalendarEvent): DashboardEvent {
  const [hour, minute] = (event.startTime ?? '0:00').split(':');
  return {
    id: event.id,
    time: `${Number(hour)}:${minute}`,
    title: event.title,
    recurring: event.recurring,
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const { tasks: todoTasks, events, cycleTaskStatus } = useAppData();

  const [habits, setHabits] = useLocalStorageState<Habit[]>('hi-app:habits', initialHabits);
  const [moodIndex, setMoodIndex] = useLocalStorageState('hi-app:mood-index', 0);
  const [weatherIndex, setWeatherIndex] = useLocalStorageState('hi-app:weather-index', 0);
  const [loggedToday, setLoggedToday] = useLocalStorageState('hi-app:logged-today', false);

  const tasks = useMemo(
    () => todoTasks.filter((t) => isMyDay(t, TODAY_ISO)).map(toDashboardTask),
    [todoTasks],
  );

  const todaysEvents = useMemo(
    () => events.filter((e) => !e.allDay && e.date === TODAY_ISO).map(toDashboardEvent),
    [events],
  );

  const toggleHabit = (id: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  const cycleMood = () => {
    setMoodIndex((i) => (i + 1) % moodOptions.length);
    setLoggedToday(true);
  };

  const cycleWeather = () => {
    setWeatherIndex((i) => (i + 1) % weatherOptions.length);
    setLoggedToday(true);
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
          date={greetingDate}
          quote={greetingQuote}
          moodEmoji={moodOptions[moodIndex]}
          weatherEmoji={weatherOptions[weatherIndex]}
          loggedToday={loggedToday}
          onCycleMood={cycleMood}
          onCycleWeather={cycleWeather}
        />

        <span className="zone-label">Today</span>
        <div className="dashboard-grid dashboard-grid--today">
          <TasksCard
            tasks={tasks}
            onCycleStatus={cycleTaskStatus}
            onNavigate={() => navigate('/todo')}
            onAdd={() => navigate('/todo')}
          />
          <EventsCard
            events={todaysEvents}
            nowTime={NOW_TIME}
            onNavigate={() => navigate('/calendar')}
            onAdd={() => navigate('/calendar')}
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
            habits={habits}
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
    </div>
  );
}
