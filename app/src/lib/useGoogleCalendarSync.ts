import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { CalendarEvent, CalendarEventDraft } from '../types';
import { addDaysIso, toISODate } from './dateUtils';
import {
  GOOGLE_CLIENT_ID,
  deleteGoogleEvent,
  disconnectGoogle as revokeGoogle,
  fromGoogleEvent,
  getValidStoredAccessToken,
  insertGoogleEvent,
  listGoogleEvents,
  requestAccessToken,
  updateGoogleEvent,
  wasPreviouslyConnected,
  type GoogleCalendarEvent,
} from './googleCalendar';

const SYNC_WINDOW_PAST_DAYS = 90;
const SYNC_WINDOW_FUTURE_DAYS = 180;
const AUTO_SYNC_INTERVAL_MS = 5 * 60 * 1000;

function reconcileEvents(prev: CalendarEvent[], remote: GoogleCalendarEvent[]): CalendarEvent[] {
  const remoteById = new Map(remote.map((g) => [g.id, g]));
  const consumed = new Set<string>();
  const result: CalendarEvent[] = [];

  for (const e of prev) {
    if (!e.googleEventId) {
      result.push(e);
      continue;
    }
    const g = remoteById.get(e.googleEventId);
    const isMirror = e.id.startsWith('google-');
    if (g) {
      consumed.add(e.googleEventId);
      if (isMirror) {
        result.push({ ...fromGoogleEvent(g), id: e.id });
      } else {
        const refreshed = fromGoogleEvent(g);
        result.push({
          ...e,
          title: refreshed.title,
          date: refreshed.date,
          endDate: refreshed.endDate,
          startTime: refreshed.startTime,
          endTime: refreshed.endTime,
          allDay: refreshed.allDay,
          googleSyncStatus: 'synced',
        });
      }
    } else if (!isMirror) {
      // Deleted on Google's side — keep the local record, just unlink it.
      result.push({ ...e, googleEventId: undefined, source: undefined, googleSyncStatus: undefined });
    }
    // else: mirror whose remote copy is gone — drop it.
  }

  for (const g of remote) {
    if (consumed.has(g.id)) continue;
    result.push(fromGoogleEvent(g));
  }

  // Safety net: a create can land on Google just as an auto-sync pull is in flight, briefly
  // producing both the local-origin record and a freshly pulled mirror for the same Google
  // event. Keep the first occurrence (local-origin records are appended before mirrors above).
  const seenGoogleIds = new Set<string>();
  return result.filter((e) => {
    if (!e.googleEventId) return true;
    if (seenGoogleIds.has(e.googleEventId)) return false;
    seenGoogleIds.add(e.googleEventId);
    return true;
  });
}

export interface GoogleCalendarSync {
  configured: boolean;
  connected: boolean;
  connecting: boolean;
  syncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  syncNow: () => Promise<void>;
  pushCreate: (event: CalendarEvent) => void;
  pushUpdate: (event: CalendarEvent, draft: CalendarEventDraft) => void;
  pushDelete: (event: CalendarEvent) => void;
}

export function useGoogleCalendarSync(
  events: CalendarEvent[],
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>,
): GoogleCalendarSync {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  const pull = useCallback(
    async (accessToken: string) => {
      setSyncing(true);
      setError(null);
      try {
        const today = toISODate(new Date());
        const timeMin = addDaysIso(today, -SYNC_WINDOW_PAST_DAYS);
        const timeMax = addDaysIso(today, SYNC_WINDOW_FUTURE_DAYS);
        const remote = await listGoogleEvents(accessToken, timeMin, timeMax);
        setEvents((prev) => reconcileEvents(prev, remote));
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sync with Google Calendar');
      } finally {
        setSyncing(false);
      }
    },
    [setEvents],
  );

  const getToken = useCallback(async (interactive: boolean): Promise<string> => {
    const cached = getValidStoredAccessToken();
    if (cached) return cached;
    return requestAccessToken(interactive);
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = await requestAccessToken(true);
      setConnected(true);
      await pull(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect to Google Calendar');
    } finally {
      setConnecting(false);
    }
  }, [pull]);

  const disconnect = useCallback(() => {
    revokeGoogle();
    setConnected(false);
    setLastSyncedAt(null);
    // Drop mirrored Google events and unlink local ones — keep the local data itself.
    setEvents((prev) =>
      prev
        .filter((e) => !e.id.startsWith('google-'))
        .map((e) => (e.googleEventId ? { ...e, googleEventId: undefined, source: undefined, googleSyncStatus: undefined } : e)),
    );
  }, [setEvents]);

  const syncNow = useCallback(async () => {
    try {
      const token = await getToken(true);
      setConnected(true);
      await pull(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sync with Google Calendar');
    }
  }, [getToken, pull]);

  // Attempt a silent reconnect on load if the user connected before in this browser.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !wasPreviouslyConnected()) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken(false);
        if (cancelled) return;
        setConnected(true);
        await pull(token);
      } catch {
        // Silent renewal failed (session expired, cookies cleared, etc.) — user can click Connect again.
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic background pull while connected.
  useEffect(() => {
    if (!connected) return;
    const id = window.setInterval(() => {
      getToken(false)
        .then(pull)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to sync with Google Calendar'));
    }, AUTO_SYNC_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [connected, getToken, pull]);

  const pushCreate = useCallback(
    (event: CalendarEvent) => {
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, googleSyncStatus: 'pending' } : e)));
      getToken(true)
        .then((token) => insertGoogleEvent(token, event))
        .then((googleEventId) => {
          setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, googleEventId, source: 'google', googleSyncStatus: 'synced' } : e)),
          );
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to create event in Google Calendar');
          setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, googleSyncStatus: 'error' } : e)));
        });
    },
    [getToken, setEvents],
  );

  const pushUpdate = useCallback(
    (event: CalendarEvent, draft: CalendarEventDraft) => {
      if (!event.googleEventId) return;
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, googleSyncStatus: 'pending' } : e)));
      getToken(true)
        .then((token) => updateGoogleEvent(token, event.googleEventId!, draft))
        .then(() => {
          setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, googleSyncStatus: 'synced' } : e)));
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to update event in Google Calendar');
          setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, googleSyncStatus: 'error' } : e)));
        });
    },
    [getToken, setEvents],
  );

  const pushDelete = useCallback(
    (event: CalendarEvent) => {
      if (!event.googleEventId) return;
      getToken(true)
        .then((token) => deleteGoogleEvent(token, event.googleEventId!))
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to delete event in Google Calendar'));
    },
    [getToken],
  );

  return {
    configured: Boolean(GOOGLE_CLIENT_ID),
    connected,
    connecting,
    syncing,
    lastSyncedAt,
    error,
    connect,
    disconnect,
    syncNow,
    pushCreate,
    pushUpdate,
    pushDelete,
  };
}
