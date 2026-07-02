# Handoff: "hi" — Personal Life Dashboard App (Dashboard, Calendar, To-Do)

## Overview
"hi" is a personal life-management app combining a home dashboard, calendar, to-do list, journal, habits, goals, and finance tracking. This handoff covers the three modules designed and validated so far: **Dashboard (Home)**, **Calendar**, and **To-Do**. Additional modules referenced in the top nav (Lesson Plan, Recipes, Journal, Habits, Goals, Finance as standalone pages) are NOT yet designed beyond their Dashboard card — treat those nav items as placeholders for future work.

## About the Design Files
The files in this bundle (`Dashboard.html`, `Calendar.html`, `To-Do.html`) are **design references built in HTML** — interactive prototypes showing intended look, layout, and behavior. They are NOT production code to copy directly into an app codebase. The task is to **recreate these designs in the target codebase's existing environment** (React Native, React web, SwiftUI, Flutter, etc.) using that codebase's established component patterns, state management, and data layer — or, if no environment exists yet, to choose the most appropriate framework and implement the designs there.

The HTML files use a template-binding syntax (`{{ }}`, `<sc-for>`, `<sc-if>`) specific to the prototyping tool used to build them. Ignore this syntax mechanically — read it as "this value is dynamic" / "this list repeats" / "this block is conditional," and reimplement using the target framework's own idioms.

## Fidelity
**High-fidelity.** All three modules have final colors (as OKLCH values — convert to your codebase's color format, e.g. hex/HSL, but preserve the exact hues/lightness/chroma), typography, spacing, icons-as-CSS-shapes, and interaction behavior. Recreate pixel-close, not just structurally.

## Design System Summary

### Colors (OKLCH values used throughout)
- **Background (app canvas):** `oklch(0.97 0.01 240)` — very light cool grey
- **Top nav bar:** `oklch(0.24 0.015 240)` — near-black navy
- **Card background:** `oklch(0.995 0.004 240)` — near-white
- **Card shadow:** `0 2px 10px oklch(0.3 0.02 240 / .06)`
- **Text primary:** `oklch(0.24 0.015 240)` / `oklch(0.3 0.02 240)`
- **Text secondary/muted:** `oklch(0.55 0.015 240)` / `oklch(0.6 0.015 240)`
- **Section pill accents** (one hue per module, all at ~`0.4-0.55 L / 0.1-0.14 C`, paired with a `0.91 L / 0.04 C` light background of the same hue for badges):
  - To-Do / Tasks: hue 280 (purple)
  - Calendar / Events: hue 230 (blue)
  - Lesson Plan: hue 190 (teal)
  - Habits: hue 165 (green)
  - Goals: hue 190 (teal, shared with Lesson Plan in nav but distinct card accent)
  - Finance: hue 230 (blue)
  - Journal: hue 300 (magenta/pink)
  - Recipes: hue 165 (green)
- **Priority colors (To-Do, bolder/more saturated variant):** High `oklch(0.65 0.28 25)` (red-orange), Medium `oklch(0.65 0.28 60)` (amber), Low `oklch(0.65 0.28 120)` (green)
- **Status indicator purple (To-Do):** `oklch(0.55 0.2 290)`
- **Overdue red:** `oklch(0.6 0.28 25)` (To-Do) / `oklch(0.55 0.16 20)` on `oklch(0.91 0.045 20)` bg (Dashboard tag)

### Typography
- **Display / headings / nav labels:** Fredoka (weights 500/600/700), via Google Fonts
- **Body / UI text:** Nunito (weights 400/600/700/800), via Google Fonts
- Card section labels: 12px, uppercase, letter-spacing 0.3–0.4px, weight 700–800
- Card titles/values: 14–30px depending on prominence (greeting is largest at 30px Fredoka)
- Never below 11px anywhere (calendar mini-picker), general UI floor ~12-13px

### Shape & Elevation
- Card border-radius: 18px (dashboard cards), 12–16px (calendar panels/modals), 8px (buttons/inputs), 999px (pills/chips/badges — fully rounded)
- Card shadow: soft, low-opacity, `0 2px 10px` or `0 1px 4px` in black at ~4-8% opacity
- Borders: 1.5–2px solid, light grey/tinted (`oklch(0.88 0.04 240)` typical)

## Screens / Views

### 1. Dashboard (Home)
**Purpose:** Landing page. At-a-glance status across all modules; quick actions to add items; mood/weather check-in.

**Layout:** 1440px canvas (design width), top nav (72px height) + main content area with 36px/52px/48px padding (top/sides/bottom), 22px vertical gap between zones.

**Top Nav:** Full-width dark bar (`oklch(0.24 0.015 240)`), 72px tall. Logo "hi" (Fredoka 700, 20px, light) on the left, then a horizontal row of pill-shaped nav links, each colored by its module hue (see Colors above) at low opacity, with the **active page shown as a solid light pill with dark text**. Nav order: Home, Calendar, To-Do, Lesson Plan, Habits, Goals, Finance, Journal, Recipes. **This exact nav bar must be identical and shared across all module pages.**

**Greeting/Hero band:** Centered card, 78% width, pink-tinted background (`oklch(0.93 0.03 330)`), rounded 24px, padding 26px/32px. Three-column flex: empty spacer (left) — greeting text centered ("Good morning, {name}" in Fredoka 30px + date/quote subtitle) — mood/weather emoji pair (right), each a 48px circular button. **Clicking an emoji cycles through a fixed option list** (mood: 🙂😁😐🙁😢; weather: ☀️⛅🌧️❄️) and adds a colored ring shadow + "✓ logged today" helper text once interacted with.

**"Today" zone** (2-column grid, 20px gap):
- **Today's Tasks card:** pill header "Today's tasks →" (clickable → navigates to To-Do module) + circular "+" button (top right, opens task creation). Task rows: clickable **status icon** (hollow square = to-do, half-filled circle = in progress, filled square with ✓ = done — click cycles through the 3 states), title (strikethrough+grey when done), recurring icon (↻) if applicable, red "overdue" pill tag if overdue and not done. Overdue/in-progress tasks sort to top.
- **Today's Events card:** pill header "Today's events →" + "+" button. Chronological list, each row = time + title. **Past events are shown at 45% opacity with strikethrough** on both time and title. A "now · {time}" divider separates past from upcoming.

**"Progress" zone** (3-column grid, ratio 1.3:1:1, 20px gap):
- **Active Goals card:** pill header "Active goals →" + "+". Shows up to 4 active (in-progress) goals as label + percentage + horizontal progress bar (8px tall, rounded, teal fill). A "+2 more →" link at the bottom if more exist.
- **Habits card:** pill header "Habits →" + "+". Habits shown as clickable chips/pills that wrap in a flex row — done habits are solid green-filled with a ✓, undone habits are outlined/light. Click toggles done state.
- **Finance card:** pill header "Finance →" (no + button — read-only summary). Two stacked stat blocks: "Spent this month" (large 22px Fredoka number, accent color) and "Spent yesterday" (same size, muted grey) — **both numbers must render at the same font size** (do not vary size between the two).

**Journal strip:** Full-width card, single row: pill header "Journal →", then either the latest entry preview (date + truncated text) or an empty-state prompt, with a circular "+" button in the bottom-right of the card to add a new entry.

**Empty states:** A toggle ("With data" / "Empty state") in the top-right of the content area (dev/demo only — likely not needed in production, or could map to a real "no data yet" condition) swaps every card's content for a friendly empty message + prompt to use the "+" button.

**Section click-through:** Clicking a section's pill header (e.g. "Today's tasks →") should navigate to that module's dedicated page — except the greeting hero, which has no destination.

### 2. Calendar
**Purpose:** Month/Week/Day views of scheduled events and tasks, tied visually to the same app shell.

**Layout:** Same 1440px canvas + identical top nav (Calendar tab active). Below nav: a centered pill-group view switcher (Month / Week / Day — active = solid dark pill, inactive = tinted-blue pill), then the view content, using the same left-content + 280px-right-sidebar two-column layout across all three views.

**Month view:** Calendar grid, **weeks start Monday**, full month (no truncation to 2 weeks — expands to however many rows July needs, including a few leading/trailing days from adjacent months in muted grey). Header row: day-of-week labels on a blue-grey band (`oklch(0.55 0.05 240)`). Each day cell (90px min row height): day number top-left, per-day metadata top-right (spend amount, mood emoji, weather emoji — in that left-to-right order, tight together), and up to N event chips stacked below, each colored by event type. **Clicking any day cell navigates straight to Day view for that date** (no separate "pick a date" step).

**Week view:** Same header/switcher, but center panel shows a 7-day time grid: an "all day" row for all-day events (e.g. multi-day trips), then hourly rows (48px each) from 9am onward with event blocks placed in the correct day column, colored by event type.

**Day view:** Header bar **must match Month/Week's header treatment** — centered date label with **prev/next arrow buttons on either side** (‹ Day Name, Date ›), positioned in the same horizontal band as the other views' month/week-range label (not just centered in the whole page — centered within the left/content column specifically). Below that: per-day metadata line (spend + mood + weather, same order as month cells, no "spent" word — just the number with a currency glyph), then an all-day events section, then a "Timed events" section with each event as a colored horizontal bar (time label + title), past events dimmed to ~50% opacity.

**Right sidebar (Day view only):** Mini month-picker (7-column grid of day numbers, Monday-start, current selection highlighted) sitting above an "Upcoming" agenda list (same list shown in Month/Week sidebars) — so navigating dates doesn't require leaving Day view.

**Event/task type icons:** Distinguish calendar entries at a glance via a small icon+color pill: generic event = "●" (solid dot) colored by category; a task-derived entry = "☐" (empty checkbox glyph); a lesson/class-type entry = "🎓" (graduation cap — was chosen over a generic icon per explicit request, use a study/notebook icon if 🎓 doesn't fit the target icon set). Recurring entries get a trailing "↻" glyph.

**Currency:** Use the ₴ (hryvnia) sign for all monetary figures, not $.

### 3. To-Do
**Purpose:** Full task management — list, filter, sort, search, categorize, prioritize, and manage subtasks and recurrence.

**Layout:** Same shared top nav (this module uses full-width content rather than the 1440px fixed canvas — max-width 1200px centered, but should be reconciled with the Dashboard/Calendar 1440px canvas convention when implemented for real — pick one consistent page-width strategy).

**Filter/toolbar row** (wraps on small widths): free-text search box, priority filter dropdown, category filter dropdown, due-date range (from/to date pickers), a sort dropdown (Due Date | Priority), a "Show completed" checkbox, a "Manage Categories" button, and a primary "+ Add Task" button (right-aligned).

**"My Day" section:** Tasks due today, overdue, or in-progress — same row layout as "All Tasks" below, just pre-filtered.

**"All Tasks" section:** Every task, respecting active filters/search/sort/show-completed. Each row: 
- **Status icon** (hollow square / half-filled circle / filled square+✓ — same 3-state model as Dashboard, purple accent `oklch(0.55 0.2 290)`), click **cycles** through states in the list row; in the detail modal it's a **3-icon segmented picker** (click any icon to jump straight to that state, current selection gets a thicker border).
- **Title** (click to rename inline), with a 🔁 icon next to it if the task recurs.
– **Priority** dropdown (inline-editable, color-coded border+text: red/amber/green for High/Medium/Low).
- **Category** dropdown (inline-editable).
- **Due label**: "Today" / "Overdue" (red text) / formatted date (e.g. "Jul 5") — computed, not a raw date input.
- **Edit** button (opens full detail modal) and **delete (×)** button (opens a confirmation dialog before removing).
- **Completed rows**: background tinted light grey, title strikethrough + muted grey.
- **Empty states**: "Nothing on your plate today 🎉" (My Day) / "No tasks found" (All Tasks) when filtered list is empty.

**Task Detail modal:** Title header, then a 3-column row (Status segmented-icon-picker / Priority dropdown / Category dropdown), a 2-column row (Due Date / Repeat — None, Daily, Weekly, Monthly), a Description textarea, a **Subtasks** section (checkbox + editable text + delete per subtask, plus an "add subtask" row), and Cancel/Save actions.

**Task Creation modal:** Same fields as detail EXCEPT no status (defaults to not-started) — Title, Priority, Due Date, Category, Repeat, Subtasks (add-only, no existing list), Description, Cancel/Create actions.

**Category Manager modal:** List of existing categories, each with an inline-editable name field and a Delete button; an "add new category" input + Add button at the bottom.

**Delete confirmation modal:** "Delete task?" + task title + Cancel/Delete buttons — required before any task is removed.

## Interactions & Behavior Summary
- Status icons everywhere (Dashboard + To-Do) follow the same 3-state cycle: Not Started → In Progress → Complete → (back to Not Started). Clicking cycles in list contexts; explicit picker in form contexts.
- Mood/weather emoji on Dashboard: click cycles through a fixed emoji array per type; visual feedback via a colored ring shadow once changed "today."
- Habits: click a chip to toggle done/not-done.
- Calendar day cells: click navigates to Day view for that date, no intermediate confirmation.
- All inline dropdowns (priority/category/due-date in To-Do rows) commit immediately on change — no separate "save" step at the row level (only the detail modal needs an explicit Save).
- Sections with a "+" button on Dashboard open the corresponding creation flow for that module (task, event, goal, habit, journal entry).
- Clicking a Dashboard section's pill header navigates to that module's own page (except the greeting/hero, which has no navigation).
- Deleting a To-Do task always requires confirmation (no silent/instant delete).

## State Management
Representative state shapes (adapt field names/types to your data layer):

```
Task {
  id, title, category, priority: 'High'|'Medium'|'Low',
  dueDate: ISO date string, status: 'not_started'|'in_progress'|'complete',
  completed: boolean (derived from status === 'complete'),
  isMyDay: boolean (derived: dueDate === today || overdue || status === 'in_progress'),
  recurring: 'none'|'daily'|'weekly'|'monthly',
  subtasks: [{ id, title, completed }],
  description: string
}

Category { id, name }

Habit { id, label, done: boolean } — done likely resets daily server-side

Goal { id, label, percent: number (0-100), active: boolean }

CalendarEvent { id, title, date, startTime?, endTime?, allDay: boolean,
  type: 'event'|'task'|'lesson', colorCategory, recurring: boolean }

Dashboard-only ephemeral UI state: moodIndex, weatherIndex, loggedToday (boolean),
viewMode ('data'|'empty' — demo-only toggle, likely omit in production)
```

Filtering/sorting logic (To-Do) to reimplement: text search on title (case-insensitive substring), sort by dueDate (ascending) or by priority rank (High=0, Medium=1, Low=2), "show completed" toggle hides completed tasks by default.

Overdue logic: `dueDate < today && status !== 'complete'`.

## Design Tokens
See "Design System Summary" above for full color/typography/shape tokens. Key numeric scale:
- Spacing: 8, 10, 12, 14, 16, 18, 20, 22, 24, 32, 36, 48px
- Border radius: 6, 7, 8, 10, 12, 16, 18, 24px, and 999px (pill/fully-rounded)
- Font sizes: 11, 12, 12.5, 13, 14, 15, 20, 22, 28, 30px

## Assets
No external images/icons — all icons are either Unicode/emoji glyphs (🙂☀️✓☐🎓↻🔁🎉) or CSS-drawn shapes (squares, circles, conic-gradient half-fills for "in progress" status). Fonts are Google Fonts: **Fredoka** (500/600/700) and **Nunito** (400/600/700/800), loaded via `<link>` in each file's `<head>`.

## Files
- `Dashboard.html` — Home/Dashboard module (data + empty state toggle included as a demo affordance)
- `Calendar.html` — Calendar module (Month/Week/Day views)
- `To-Do.html` — To-Do module (list, filters, detail/create/category modals)

Open each directly in a browser to interact with the prototype. Use browser dev tools to inspect exact computed styles if a measurement isn't covered above.
