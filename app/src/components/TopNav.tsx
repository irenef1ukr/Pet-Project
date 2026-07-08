import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navConfig';
import './TopNav.css';

export function TopNav() {
  return (
    <div className="top-nav">
      <span className="top-nav__logo">MyHub</span>
      <div className="top-nav__links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-pill${isActive ? ' nav-pill--active' : ''}`
            }
            style={{ '--hue': item.hue } as React.CSSProperties}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
