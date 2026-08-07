# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Google Calendar integration

The Calendar page can sync events two-way with a user's Google Calendar. This is entirely
client-side (no backend) — it uses [Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/overview)
to get a short-lived OAuth access token in the browser and calls the Calendar API v3 directly.

**How it works:**
- Click **Connect Google Calendar** in the Calendar page sidebar to grant access (scope:
  `calendar.events` — read/write access to events only, not calendar settings).
- On connect, events from ~3 months in the past to ~6 months ahead are pulled in and merged
  into the app's calendar view.
- Creating/editing/deleting an event in this app pushes the change to Google (toggle the
  "Sync to Google Calendar" checkbox when creating an event to opt out per-event).
- Editing/deleting an event on the Google side is picked up on the next sync (manual "Sync now",
  or automatically every 5 minutes while connected).
- The access token lives only in `sessionStorage` (cleared when the tab closes) — there's no
  refresh token/backend, so re-connecting is sometimes needed after the token expires (~1 hour),
  though a silent reconnect is attempted automatically first.
- Recurring events (`daily`/`weekly`/`monthly`) created in this app are pushed to Google as a
  single, non-repeating event — this app's own recurrence is just a display badge and doesn't
  expand into multiple dates, so this keeps a clean 1:1 mapping between a local event and its
  Google counterpart. Recurring events pulled *from* Google (which Google expands into individual
  occurrences) show up correctly as separate entries on each date.

**One-time setup (per Google Cloud project):**
1. In [Google Cloud Console](https://console.cloud.google.com/), create/select a project and
   enable the **Google Calendar API**.
2. Configure the OAuth consent screen (External, Testing mode is fine for personal use — add
   your Google account as a test user).
3. Under **Credentials**, create an **OAuth 2.0 Client ID** (Application type: **Web application**),
   and add every origin you'll run the app from under **Authorized JavaScript origins**
   (e.g. `http://localhost:5173` for local dev, plus your deployed URL). No redirect URI is
   needed — this uses the token flow, not the authorization-code flow.
4. Set `VITE_GOOGLE_CLIENT_ID` in `app/.env` (or your hosting provider's env vars) to that
   Client ID. It's a public identifier, not a secret.

If `VITE_GOOGLE_CLIENT_ID` isn't set, the Google Calendar widget hides itself and the rest of
the app works exactly as before.
