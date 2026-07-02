import type { DashboardEvent } from '../../types';
import './EventsCard.css';

interface EventsCardProps {
  events: DashboardEvent[];
  nowTime: string;
  onNavigate: () => void;
  onAdd: () => void;
}

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function EventsCard({ events, nowTime, onNavigate, onAdd }: EventsCardProps) {
  const nowMinutes = toMinutes(nowTime);
  const sorted = [...events].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  const pastEvents = sorted.filter((e) => toMinutes(e.time) < nowMinutes);
  const upcomingEvents = sorted.filter((e) => toMinutes(e.time) >= nowMinutes);

  return (
    <div className="dash-card">
      <div className="dash-card__header">
        <span
          className="section-pill events-pill"
          onClick={onNavigate}
          role="button"
          tabIndex={0}
        >
          Today&apos;s events →
        </span>
        <button type="button" className="plus-button events-plus" onClick={onAdd}>
          +
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__title">🌤️ Nothing scheduled today</span>
          <span className="empty-state__hint">tap + to add an event</span>
        </div>
      ) : (
        <>
          {pastEvents.map((e) => (
            <div key={e.id} className="event-row event-row--past">
              <span className="event-time event-time--past">{e.time}</span>
              <span className="event-title event-title--past">{e.title}</span>
              {e.recurring && (
                <span className="task-recurring" title="Recurring">
                  ↻
                </span>
              )}
            </div>
          ))}

          {pastEvents.length > 0 && upcomingEvents.length > 0 && (
            <div className="event-now-divider">
              <div className="event-now-divider__line" />
              <span className="event-now-divider__label">now · {nowTime}</span>
              <div className="event-now-divider__line" />
            </div>
          )}

          {upcomingEvents.map((e) => (
            <div key={e.id} className="event-row">
              <span className="event-time">{e.time}</span>
              <span className="event-title">{e.title}</span>
              {e.recurring && (
                <span className="task-recurring" title="Recurring">
                  ↻
                </span>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
