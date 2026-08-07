import type { CalendarEvent, CalendarEventDraft } from '../types';
import { addDaysIso } from './dateUtils';

// Client ID is not a secret — it's safe to ship in frontend code (see Google's own docs).
// Set VITE_GOOGLE_CLIENT_ID in app/.env (or Vercel project env vars) to override.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

// Scoped to events only (not calendar settings/list) — least privilege for what this app needs.
const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const TOKEN_STORAGE_KEY = 'hi-app:google-token';
const EVER_CONNECTED_KEY = 'hi-app:google-ever-connected';

interface StoredToken {
  accessToken: string;
  expiresAt: number; // epoch ms
}

interface GoogleTokenClient {
  requestAccessToken: (opts?: { prompt?: string }) => void;
}

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: GoogleTokenResponse) => void;
            error_callback?: (err: { type?: string }) => void;
          }) => GoogleTokenClient;
          revoke: (token: string, done?: () => void) => void;
        };
      };
    };
  }
}

let gisLoadPromise: Promise<void> | null = null;

function loadGisScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve, reject) => {
    // index.html already loads the GIS script (async); it may have finished loading before this
    // code runs (missing the 'load' event) or still be in flight, so poll as a safety net either way.
    const started = Date.now();
    const poll = window.setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        window.clearInterval(poll);
        resolve();
      } else if (Date.now() - started > 10_000) {
        window.clearInterval(poll);
        reject(new Error('Failed to load Google Identity Services script'));
      }
    }, 100);

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.src = GIS_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
  return gisLoadPromise;
}

function readStoredToken(): StoredToken | null {
  try {
    const raw = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredToken;
  } catch {
    return null;
  }
}

function writeStoredToken(token: StoredToken | null) {
  try {
    if (token) window.sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
    else window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable — token just won't survive a reload
  }
}

function hasEverConnected(): boolean {
  return window.localStorage.getItem(EVER_CONNECTED_KEY) === '1';
}

function markEverConnected(value: boolean) {
  try {
    if (value) window.localStorage.setItem(EVER_CONNECTED_KEY, '1');
    else window.localStorage.removeItem(EVER_CONNECTED_KEY);
  } catch {
    // ignore
  }
}

function isValid(token: StoredToken | null): token is StoredToken {
  // Treat as expired 60s early to leave headroom for the request itself.
  return Boolean(token && token.expiresAt - 60_000 > Date.now());
}

export function getValidStoredAccessToken(): string | null {
  const token = readStoredToken();
  return isValid(token) ? token.accessToken : null;
}

export function wasPreviouslyConnected(): boolean {
  return hasEverConnected();
}

/**
 * Requests an access token. `interactive: true` may show the Google consent popup;
 * `interactive: false` attempts a silent (no-UI) renewal and rejects if that isn't possible.
 */
export async function requestAccessToken(interactive: boolean): Promise<string> {
  await loadGisScript();
  if (!window.google?.accounts?.oauth2) throw new Error('Google Identity Services failed to load');
  if (!GOOGLE_CLIENT_ID) throw new Error('VITE_GOOGLE_CLIENT_ID is not configured');

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_CALENDAR_SCOPE,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error || 'No access token returned'));
          return;
        }
        const token: StoredToken = {
          accessToken: resp.access_token,
          expiresAt: Date.now() + (resp.expires_in ?? 3600) * 1000,
        };
        writeStoredToken(token);
        markEverConnected(true);
        resolve(resp.access_token);
      },
      error_callback: (err) => {
        reject(new Error(err?.type || 'Google sign-in failed or was cancelled'));
      },
    });
    client.requestAccessToken({ prompt: interactive ? 'consent' : '' });
  });
}

export function disconnectGoogle() {
  const token = readStoredToken();
  writeStoredToken(null);
  markEverConnected(false);
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token.accessToken);
  }
}

// ---------------------------------------------------------------------------
// Calendar API v3 — thin REST wrapper (uses fetch directly, no client library)
// ---------------------------------------------------------------------------

interface GoogleEventDateTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: GoogleEventDateTime;
  end?: GoogleEventDateTime;
  recurringEventId?: string;
  status?: string;
}

async function apiRequest<T>(accessToken: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CALENDAR_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Google Calendar API ${init?.method ?? 'GET'} ${path} failed: ${res.status} ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = (h * 60 + m + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Maps a local event/draft to a Google Calendar event body.
 * Note: this app's own "recurring" field is a display-only badge (it doesn't expand into
 * multiple occurrences locally), so we intentionally push recurring events as single
 * (non-repeating) Google events rather than mapping to an RRULE — that keeps the local
 * record and its single mirrored Google event in a clean 1:1 relationship.
 */
export function toGoogleEventBody(event: CalendarEvent | CalendarEventDraft): Record<string, unknown> {
  if (event.allDay) {
    const endDate = addDaysIso(event.endDate ?? event.date, 1); // Google's all-day end.date is exclusive
    return {
      summary: event.title,
      start: { date: event.date },
      end: { date: endDate },
    };
  }
  const startTime = event.startTime ?? '09:00';
  const endTime = event.endTime && event.endTime !== startTime ? event.endTime : addMinutesToTime(startTime, 30);
  return {
    summary: event.title,
    start: { dateTime: `${event.date}T${startTime}:00`, timeZone },
    end: { dateTime: `${event.date}T${endTime}:00`, timeZone },
  };
}

export function fromGoogleEvent(gEvent: GoogleCalendarEvent): CalendarEvent {
  const allDay = Boolean(gEvent.start?.date);
  const date = gEvent.start?.date ?? gEvent.start?.dateTime?.slice(0, 10) ?? '';
  const endDateRaw = gEvent.end?.date;
  return {
    id: `google-${gEvent.id}`,
    title: gEvent.summary || '(untitled event)',
    date,
    endDate: allDay && endDateRaw ? addDaysIso(endDateRaw, -1) : undefined,
    startTime: allDay ? undefined : gEvent.start?.dateTime?.slice(11, 16),
    endTime: allDay ? undefined : gEvent.end?.dateTime?.slice(11, 16),
    allDay,
    type: 'event',
    category: 'personal',
    recurring: 'none',
    source: 'google',
    googleEventId: gEvent.id,
    googleSyncStatus: 'synced',
  };
}

export async function listGoogleEvents(
  accessToken: string,
  timeMinIso: string,
  timeMaxIso: string,
): Promise<GoogleCalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: new Date(`${timeMinIso}T00:00:00`).toISOString(),
    timeMax: new Date(`${timeMaxIso}T23:59:59`).toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });
  const data = await apiRequest<{ items: GoogleCalendarEvent[] }>(accessToken, `/calendars/primary/events?${params}`);
  return (data.items ?? []).filter((e) => e.status !== 'cancelled');
}

export async function insertGoogleEvent(accessToken: string, event: CalendarEvent | CalendarEventDraft): Promise<string> {
  const created = await apiRequest<GoogleCalendarEvent>(accessToken, '/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify(toGoogleEventBody(event)),
  });
  return created.id;
}

export async function updateGoogleEvent(
  accessToken: string,
  googleEventId: string,
  event: CalendarEvent | CalendarEventDraft,
): Promise<void> {
  await apiRequest<GoogleCalendarEvent>(accessToken, `/calendars/primary/events/${googleEventId}`, {
    method: 'PATCH',
    body: JSON.stringify(toGoogleEventBody(event)),
  });
}

export async function deleteGoogleEvent(accessToken: string, googleEventId: string): Promise<void> {
  try {
    await apiRequest<void>(accessToken, `/calendars/primary/events/${googleEventId}`, { method: 'DELETE' });
  } catch (err) {
    // Already gone on Google's side is fine — nothing left to reconcile.
    if (err instanceof Error && err.message.includes('410')) return;
    throw err;
  }
}
