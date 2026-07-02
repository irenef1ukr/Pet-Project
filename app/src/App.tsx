import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard/Dashboard';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './components/navConfig';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {NAV_ITEMS.filter((item) => item.path !== '/').map((item) => (
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
