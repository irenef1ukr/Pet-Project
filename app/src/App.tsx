import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Calendar } from './pages/calendar/Calendar';
import { Todo } from './pages/todo/Todo';
import { Finance } from './pages/finance/Finance';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './components/navConfig';
import { ReminderBanner } from './components/ReminderBanner';
import { AppDataProvider } from './store/AppDataContext';

const BUILT_PATHS = ['/', '/calendar', '/todo', '/finance'];

function App() {
  return (
    <AppDataProvider>
      <ReminderBanner />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/finance" element={<Finance />} />
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
