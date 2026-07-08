import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Calendar } from './pages/calendar/Calendar';
import { Todo } from './pages/todo/Todo';
import { Finance } from './pages/finance/Finance';
import { Journal } from './pages/journal/Journal';
import { Goals } from './pages/goals/Goals';
import { Habits } from './pages/habits/Habits';
import { LessonPlan } from './pages/lessonplan/LessonPlan';
import { Recipes } from './pages/recipes/Recipes';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './components/navConfig';
import { ReminderBanner } from './components/ReminderBanner';
import { AppDataProvider } from './store/AppDataContext';

const BUILT_PATHS = ['/', '/calendar', '/todo', '/finance', '/journal', '/goals', '/habits', '/lesson-plan', '/recipes'];

function App() {
  return (
    <AppDataProvider>
      <ReminderBanner />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/lesson-plan" element={<LessonPlan />} />
        <Route path="/recipes" element={<Recipes />} />
        {NAV_ITEMS.filter((item) => !BUILT_PATHS.includes(item.path)).map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<StubPage title={item.label} />}
          />
        ))}
      </Routes>
    </AppDataProvider>
  );
}

export default App;
