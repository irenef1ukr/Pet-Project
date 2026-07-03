import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Calendar } from './pages/calendar/Calendar';
import { Todo } from './pages/todo/Todo';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './components/navConfig';

const BUILT_PATHS = ['/', '/calendar', '/todo'];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/todo" element={<Todo />} />
      {NAV_ITEMS.filter((item) => !BUILT_PATHS.includes(item.path)).map((item) => (
        <Route
          key={item.path}
          path={item.path}
          element={<StubPage title={item.label} />}
        />
      ))}
    </Routes>
  );
}

export default App;
