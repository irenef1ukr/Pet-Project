import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Calendar } from './pages/calendar/Calendar';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './components/navConfig';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      {NAV_ITEMS.filter((item) => item.path !== '/' && item.path !== '/calendar').map((item) => (
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
