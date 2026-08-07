import { useAppData } from '../../store/AppDataContext';
import './GoogleCalendarSync.css';

function formatSyncedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function GoogleCalendarSync() {
  const { googleCalendar } = useAppData();
  const { configured, connected, connecting, syncing, lastSyncedAt, error, connect, disconnect, syncNow } =
    googleCalendar;

  if (!configured) return null;

  return (
    <div className="google-sync">
      <div className="google-sync__header">
        <span className="google-sync__icon">📅</span>
        <span className="google-sync__title">Google Calendar</span>
      </div>

      {!connected ? (
        <button type="button" className="google-sync__connect-btn" onClick={() => void connect()} disabled={connecting}>
          {connecting ? 'Connecting…' : 'Connect Google Calendar'}
        </button>
      ) : (
        <div className="google-sync__status">
          <span className="google-sync__badge">✓ Connected</span>
          <span className="google-sync__meta">
            {syncing ? 'Syncing…' : lastSyncedAt ? `Last synced ${formatSyncedTime(lastSyncedAt)}` : 'Not yet synced'}
          </span>
          <div className="google-sync__actions">
            <button type="button" onClick={() => void syncNow()} disabled={syncing}>
              Sync now
            </button>
            <button type="button" className="google-sync__disconnect" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        </div>
      )}

      {error && <span className="google-sync__error">{error}</span>}
    </div>
  );
}
