import { useState } from 'react';
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
  allGoals,
  financeSummary,
  greetingDate,
  greetingQuote,
  initialHabits,
  initialTasks,
  latestJournalEntry,
  moodOptions,
  todaysEvents,
  userName,
  weatherOptions,
} from '../../data/mockData';
import type { DashboardTask, Habit, TaskStatus } from '../../types';
import './dashboard-shared.css';
import './Dashboard.css';

const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'done'];

export function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<DashboardTask[]>(initialTasks);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [moodIndex, setMoodIndex] = useState(0);
  const [weatherIndex, setWeatherIndex] = useState(0);
  const [loggedToday, setLoggedToday] = useState(false);

  const cycleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: STATUS_ORDER[(STATUS_ORDER.indexOf(t.status) + 1) % STATUS_ORDER.length] }
          : t,
      ),
    );
  };

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
