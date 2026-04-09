# Project Context

Use this file as the shared handoff note for any Codex thread working in this repo.

## Snapshot

- Project: tracker-app
- Purpose: Personal tracking app with tracker and outsider experiences, Supabase-backed data, mobile support via Capacitor, and local Linear planning support.
- Last updated: 2026-04-08
- Latest repo commit: `08fdaed` - `Add Linear tooling and auth autofill fixes`
- Current product shape:
  - Tracker side is the main logged-in experience for daily tracking, goals, to-dos, appointments, period tracking, settings, and support flows.
  - Outsider side is a permission-limited, read-only sharing experience that still needs to catch up with newer tracker features.

## Memory

- Use this section for durable context that future threads should treat as "remembered" project guidance.
- Keep items short, concrete, and stable over time.
- Good fits:
  - user preferences about how Codex should work in this repo
  - naming decisions
  - recurring product rules
  - collaboration rules for parallel threads
- Avoid putting temporary task state here; use `Active Work` or `Handoff Notes` for that.
- Memory items:
  - `docs/project-context.md` is the shared source-of-truth file that new Codex threads should read before making changes.
  - Always update this file and Linear when completing a task to avoid confusion in future areas.
  - After finishing a meaningful piece of work, Codex should ask whether now is a good time to commit and give a recommendation about whether committing now makes sense.
  - Codex should read `docs/project-context.md` before making changes so parallel threads stay aligned.
  - The user does not have a coding background, so key technical terms should be explained in plain language when they matter.
  - If Codex notices a useful tool or integration that would help but is not available, Codex should tell the user and help set it up.
  - If the user says to remember something, Codex should add it to `docs/project-context.md` instead of relying on chat memory alone.
  - Please always immedietly update `docs/project-context.md` to say that you are working on whatever GUI you have chosen!
  - Codex can run helpful checks like build, lint, and tests without asking first.
  - Keep technical explanations short and plain by default.

## Product Background

- The app exists to help the user build enough day-to-day support, consistency, and visible progress to live more independently.
- The user built it in the context of severe ADHD and major depression, with family concern about whether living alone would be safe and manageable.
- A major product goal is to let the user share chosen stats with trusted people so they can see when things are going okay and quickly notice when support may be needed.
- Meds and emotions are especially important parts of the app because they connect directly to safety, wellbeing, and timely check-ins.
- The app is meant to feel like a life tracker or "pocket secretary": supportive, encouraging, caring, and helpful with reminders.
- The product should be useful not just for the user, but for other people with similar struggles.
- Privacy is a core product value:
  - sharing must be intentional and permission-based
  - people may have unsafe, tense, or deeply personal family situations
  - sensitive identity-related or personal information must be protected carefully
- Accessibility and trust matter more than monetization:
  - the user wants the app to be free
  - free should not mean lower-quality care or support
- When making product decisions, favor:
  - privacy
  - emotional safety
  - supportive tone
  - practical usefulness in everyday life

## Current Priorities

- Stabilize and polish recent tracker expansion work so the app stays shippable while features deepen.
- Continue current "Now" work from Linear around tracker navigation cleanup, to-do deepening, mobile cleanup, and responsive behavior.
- Prepare the outsider experience to catch up with newer shared tracker data: to-dos, appointments, period summaries, and permission-safe support actions.
- Keep privacy boundaries intact while shared calendar and outsider features expand.

## Active Work

- Active ownership note:
  - Area/files: `supabase/functions/google-calendar-auth/index.ts`, `docs/project-context.md` touched by `Google Calendar OAuth Debug`
  - Goal: Debug why Google OAuth reaches the app callback but `calendar_sync_connections` does not transition into a connected ready state.
  - Status: In progress in this thread on 2026-04-08
  - Notes:
    - Investigating whether the callback succeeds at Google token exchange but fails while saving OAuth state, token rows, or the final `ready` connection update.
    - Hardened the Edge Function so DB write failures are no longer silent and now return a visible callback error instead of a false success redirect.
    - Added and pushed `20260408213000_reconcile_google_calendar_sync_schema.sql` after the live project reported `status` missing from `calendar_sync_connections`; remote migration history was ahead, but the remote table was missing several expected connection columns.
    - Added and pushed `20260408214500_add_calendar_sync_connection_uniqueness.sql` after the live project reported no matching unique or exclusion constraint for `ON CONFLICT (user_id, provider)`.
    - Updated Settings Google Calendar fields to controlled values to avoid stale `defaultValue` rendering after OAuth callback reloads.
    - Removed confusing legacy scaffold buttons (`Save Setup Base`, `Mark Ready For OAuth`) and replaced with a status-aware `Pause Sync`/`Resume Sync` action.
    - Updated `google-calendar-auth` default scope to include `openid email` in addition to calendar scope so `external_account_email` can populate reliably.
    - Confirmed the current product slice is outbound app-to-Google sync setup, not Google-to-app event import.
    - Updated `list-calendars` to refresh saved Google connection metadata so email and selected calendar details persist better across reloads.
    - Added a Settings-page auto-refresh for Google calendar choices when a ready connection loads without cached calendar options, fixing the reload bug where the destination calendar field temporarily fell back into the wrong text-input state until the user clicked `Refresh Calendars`.

- Active ownership note:
  - Area/files: `src/App.jsx`, `src/pages/tracker/ConnectionsPage.jsx`, `supabase/migrations/20260408170000_add_google_calendar_sync_tables.sql` touched by `GUI-33`
  - Goal: Start Google Calendar sync by adding durable connection storage, sync-link storage, and a tracker-side setup panel before wiring live OAuth and event push behavior.
  - Status: Started in this thread on 2026-04-08
  - Notes:
    - Added Supabase tables for per-user Google Calendar connection metadata and external event-link bookkeeping.
    - Wired `src/App.jsx` to load, summarize, and save Google Calendar sync settings alongside existing tracker connection data.
    - Added a new Google Calendar Sync section to the tracker Connections page with destination calendar fields, sync toggles, status, and sync counters.
    - Appointment and reminder create, update, and delete flows now queue pending Google sync-link records when the Google connection is marked ready.
    - Marking the Google connection ready now backfills existing appointments and reminders into the sync queue.
    - Added a `google-calendar-auth` Supabase Edge Function plus OAuth state and token storage so Google connect can happen server-side instead of exposing client secrets in the browser.
    - Deployed the OAuth migration and Edge Function to the linked Supabase project, then set `PUBLIC_APP_URL`.
    - Remaining blocker: the Supabase project still needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` secrets before the Connect Google button can complete successfully.
    - Verified with `npm run build`.

- Active ownership note:
  - Area/files: `docs/project-context.md`, `src/pages/tracker/OverviewPage.jsx`, `src/pages/tracker/CalendarPage.jsx` touched by `Calendar Feature`
  - Goal: Begin the Calendar Feature project by strengthening tracker summary surfaces on top of the shared normalized calendar event layer.
  - Status: Done in this thread on 2026-04-08
  - Notes:
    - Focused first on the project description's execution steps around today and weekly planning summaries rather than deeper external sync work.
    - Avoiding the current `src/App.jsx` worktree change unless integration pressure makes that necessary.
    - Added a shared `Calendar Pulse` overview section plus a grouped `Week Ahead` calendar section.
    - Followed up after QA feedback to render `Calendar Pulse` across all tracker overview theme variants instead of only the default layout.
    - Verified with `npm run build`.

- Active ownership note:
  - Area/files: `src/App.jsx`, `src/pages/tracker/TrackingPage.jsx`, `src/app/utils.js`, `src/pages/tracker/CalendarPage.jsx` touched by `GUI-52`
  - Goal: Add task priority and optional due time to tracker To-Do items while keeping the flow lightweight and backward-compatible with existing task data.
  - Status: Done in this thread on 2026-04-02
  - Notes:
    - Added tracker-side To-Do form support for priority and due time, while keeping existing saved tasks working through normalization defaults.
    - Updated task summaries and calendar event shaping so priority and due-time context shows up in overview-style surfaces where it helps.
    - Verified with `npm run build`.

- Active ownership note:
  - Area/files: tracker period logging flow touched by `GUI-56`
  - Goal: Add a quicker active-cycle daily logging flow for period tracking so updates feel lightweight during an ongoing cycle.
  - Status: Done in this thread on 2026-04-02
  - Notes:
    - Chosen because it was a narrower tracker issue than the currently busy outsider and mobile lanes, and it avoided the reserved issues the user excluded.
    - Updated `src/pages/tracker/TrackingPage.jsx` so active cycles now open into a compact "Today's update" flow with quick flow buttons, symptom toggles, lighter notes entry, and a separate collapsible details area for fuller controls.
    - Exposed `activePeriodDayCount` from `src/App.jsx` so the period UI can show clearer day-of-cycle status.
    - Verified with `npm run build` and `npm run lint`.

- Active ownership note:
  - Area/files: tracker Log picker and related navigation surfaces touched by `GUI-54`
  - Goal: Build a calmer grouped Log picker with recent and pinned categories while keeping tracker navigation easy to reach on desktop and mobile.
  - Status: Implemented locally in this thread on 2026-04-02 after avoiding `GUI-28` and `GUI-52` because those issues are already taken
  - Notes:
    - Chosen because it is a current `Now` issue with a narrower UX scope than the broader outsider/mobile lanes and less collision risk than the taken task work.
    - Replaced the flat in-page category row with a calmer grouped picker inside `src/pages/tracker/TrackingPage.jsx`.
    - Added lightweight per-user recent and pinned Log category memory in `src/App.jsx` so frequent categories stay easier to reach across sessions.
    - Verified with `npm run build` and `npm run lint`.

- Active ownership note:
  - Area/files: `src/layouts/TrackerLayout.jsx`, `src/layouts/OutsiderLayout.jsx`, responsive helpers touched by `GUI-28`
  - Goal: Make responsive layout handling reactive across tracker and outsider screens instead of reading `window.innerWidth` directly during render.
  - Status: Done in this thread on 2026-04-02
  - Notes:
    - Added `src/app/useResponsiveViewport.js` so viewport width and coarse-pointer state react to resize, rotation, and pointer-mode changes.
    - Updated `src/layouts/TrackerLayout.jsx` and `src/layouts/OutsiderLayout.jsx` to use the shared hook and re-sync sidebar openness when crossing desktop/mobile breakpoints.
    - Updated outsider pages still using direct render-time viewport reads: `src/pages/outsider/OverviewPage.jsx`, `src/pages/outsider/SupportPage.jsx`, `src/pages/outsider/GoalsPage.jsx`, and `src/pages/outsider/TrackerDataPage.jsx`.
    - Verified with `npm run build` and `npm run lint`.

- Active ownership note:
  - Area/files: tracker navigation regression for `GUI-65`
  - Goal: Fix the tracker nav bug where Appointments disappears after switching from Log to Mood.
  - Status: Done in this thread on 2026-04-02
  - Notes:
    - Chosen because it is a focused tracker bug with a narrower write scope than the larger `Now` issues.
    - Avoids the reserved outsider policy lane and should be safer around the current dirty worktree than broader app-wide tasks.
    - Fixed in `src/pages/tracker/MoodPage.jsx` by keeping Appointments in the Mood page section switcher list.
    - Verified with `npm run build`.

- Active ownership note:
  - Area/files: tracker polish cleanup for `GUI-22`
  - Goal: Restore clean lint/build baseline and remove recent tracker UI polish regressions after expansion work.
  - Status: Done in this thread on 2026-04-02
  - Notes:
    - Chosen because it is a current `Now` issue in Tracker Stabilization, aligns with the latest cleanup handoff notes, and avoids the reserved outsider policy work around `GUI-42`.
    - Removed unused `rowStyle` plumbing from `src/App.jsx`, normalized tracker punctuation in `src/pages/tracker/TrackingPage.jsx`, and re-verified `npm run lint` plus `npm run build`.

- Confirmed finished work in latest commit:
  - Area/files: `src/App.jsx`, `src/pages/tracker/SettingsPage.jsx`, `src/pages/tracker/TrackingPage.jsx`
  - Goal: Shell cleanup, form behavior cleanup, and tracker responsiveness/polish.
  - Status: Done in `08fdaed`
  - Notes:
    - `src/App.jsx` now uses React 19 `useEffectEvent` wrappers around effect-triggered async work to reduce stale closure and exhaustive-deps friction.
    - Auth flows now use real form submission with labels, ids, and browser autofill/autocomplete hints.
    - `src/pages/tracker/SettingsPage.jsx` now treats PIN change and PIN reset as proper forms.
    - `src/pages/tracker/TrackingPage.jsx` cleaned up dead UI code, improved narrow-screen layout behavior, and tightened appointment draft detection.

- Confirmed finished work in latest commit:
  - Area/files: `package.json`, `scripts/linear-cli.mjs`, `scripts/backfill-linear-plans.mjs`, `linear-projects.json`, `linear-projects-after.json`, `linear-issues.json`, `linear-issues-after.json`, `docs/tracking-expansion-plan.md`
  - Goal: Move planning context into Linear and make local Linear workflows available from the repo.
  - Status: Done in `08fdaed`
  - Notes:
    - Adds `npm run linear`, `npm run linear:teams`, and `npm run linear:create`.
    - `scripts/linear-cli.mjs` loads `LINEAR_API_KEY` from `.env.local` and supports listing and creating/updating Linear projects and issues.
    - `scripts/backfill-linear-plans.mjs` exists to help move planning docs into Linear.
    - Local JSON exports are present as snapshots of current Linear projects and issues before and after the planning migration work.
    - `docs/tracking-expansion-plan.md` now includes an outsider implementation checklist and a cross-reference to calendar visibility planning.

- Current working-tree completion:
  - Area/files: `src/App.jsx`, `supabase/migrations/20260402214500_add_outsider_access_for_appointments_and_period_cycles.sql`
  - Goal: Finish `GUI-42` by adding outsider read access for appointments and period cycles without exposing private period notes.
  - Status: Implemented locally, not committed yet
  - Notes:
    - Outsider row-level access is added for `appointments` and `period_cycles` using approved connection permissions.
    - Period `private_notes` were moved into a new tracker-only table so outsiders cannot read them through `period_cycles`.
    - Tracker-side period loading now reads private notes from the new table and writes them separately.

## Recent Decisions

- Decision: Use Linear as the main planning system for new work instead of relying only on long docs.
  - Why: The repo already has a lot of planning context, and active work is easier to track as discrete issues and projects.
  - Date: 2026-04-02

- Decision: Keep outsider sharing read-only and summary-first rather than trying to mirror the full tracker UI.
  - Why: This lowers privacy risk and keeps the outsider experience focused on support, awareness, and lightweight context.
  - Date: 2026-04-02

- Decision: The in-app calendar/shared event layer comes before deeper external calendar sync.
  - Why: Google Calendar and other external sync work should build on a stable internal event model, not separate one-off feature logic.
  - Date: 2026-04-02

- Decision: Private period notes must never appear in shared or normalized calendar surfaces.
  - Why: Period sharing is one of the highest-risk privacy areas in the app.
  - Date: 2026-04-02
  - Status: Already completed in Linear as `GUI-23`

## Known Gotchas

- `src/App.jsx` is the biggest coordination hotspot in the repo. It mixes auth, tracker state, outsider state, support inbox work, connections, and calendar normalization.
- Avoid overlapping edits in these files while active threads are running:
  - coordinate before touching `src/App.jsx` because it remains the main integration hotspot
- The outsider experience is still behind the tracker feature set. Current data loading relies heavily on `daily_entries` history and needs a better unified summary model before outsider parity gets much better.
- To-do data still lives inside `daily_entries.todo_items`, which makes richer scheduling and cross-day behavior harder. Longer-term Linear work already exists to move this into dedicated storage.
- Period sharing is extra sensitive:
  - never expose `private_notes`
  - keep estimates clearly labeled as estimates
  - avoid giving outsider pages tracker-level detail
- Mobile and responsive work is still active. Some current Linear work is specifically about making layout mode reactive instead of relying on direct viewport reads.
- Local Linear commands depend on `LINEAR_API_KEY` being present in `.env.local`.

## Useful Commands

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run linear:teams`
- `npm run linear -- issues --team GUI`
- `npm run linear -- projects-detailed`

## Handoff Notes

- What changed:
  - Started `GUI-33` by adding Google Calendar sync foundation storage in Supabase plus a tracker-side setup panel in `src/pages/tracker/ConnectionsPage.jsx`.
  - Added `calendar_sync_connections` and `calendar_sync_event_links` tables in `supabase/migrations/20260408170000_add_google_calendar_sync_tables.sql`.
  - Updated `src/App.jsx` to load Google sync metadata, expose save actions, and summarize queued/synced/failed external link records for the new panel.
  - Began `GUI-37` locally by queueing appointment and reminder create, update, and delete changes into `calendar_sync_event_links` whenever Google sync is ready.
  - Added a ready-state backfill so existing appointments and reminders are queued when Google Calendar sync is first marked ready.
  - Added `supabase/functions/google-calendar-auth/index.ts` plus `supabase/migrations/20260408190000_add_google_oauth_state_and_tokens.sql` to start real Google OAuth and server-side token handling.
  - Deployed the new migration and Edge Function to the linked Supabase project, and fixed the previously missing `period_cycle_private_notes` migration in production.
  - Began `Calendar Feature` execution work by adding tracker-side summary surfaces powered by the shared normalized calendar event layer.
  - Added a `Calendar Pulse` section to `src/pages/tracker/OverviewPage.jsx` with today agenda, upcoming week, overdue task, and cycle outlook cards plus short upcoming items.
  - Added a grouped `Week Ahead` section to `src/pages/tracker/CalendarPage.jsx` so the next seven days are easier to scan by date.
  - Fixed the first pass so `Calendar Pulse` now renders in all tracker overview theme variants, not just the default overview layout.
  - Updated `GUI-40` in Linear with the implementation progress note for this slice.
  - Completed `GUI-56` by turning active period cycles into a lighter daily update flow with quick flow selection, symptom toggles, compact notes, and a collapsible full-controls section for date changes and ending the cycle.
  - Completed `GUI-54` locally by replacing the flat Log category row with a grouped picker that shows the current category, recent categories, pinned categories, and a browsable full category grid.
  - Added per-user local persistence for pinned and recent Log categories in `src/App.jsx` so the picker can stay calmer while still surfacing frequent destinations quickly.
  - Completed `GUI-52` by adding To-Do priority and due-time support in tracker state, the tracker To-Do form/list UI, and tracker calendar task surfaces, then verified with `npm run build`.
  - Completed `GUI-28` by adding a shared reactive viewport hook and replacing direct render-time viewport reads in tracker and outsider layouts plus outsider overview, support, goals, and tracker-data pages.
  - Fixed `GUI-65` locally by restoring the Appointments button in the Mood page section switcher and verified the app still builds.
  - Completed `GUI-22` by removing unused `rowStyle` plumbing from `src/App.jsx`, normalizing tracker punctuation in `src/pages/tracker/TrackingPage.jsx`, and updating the Linear issue with a dated progress note.
  - Added a shared `docs/project-context.md` file so multiple Codex threads can ground themselves in one current repo snapshot.
  - Updated this note after the clean commit `08fdaed` so the old "inferred" work items are now recorded as completed work.
  - Added the shared-memory rule to keep this file and Linear updated after task completion.
  - Implemented `GUI-42` locally by adding outsider read policies for appointments and period cycles, while moving period `private_notes` into a tracker-only table.
- What still needs attention:
  - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Supabase secrets, then configure the Google OAuth redirect URI to the deployed Edge Function callback.
  - Once Google secrets are present, test the full connect flow and confirm calendar list loading from the tracker Connections page.
  - Build the next post-OAuth slice that turns queued `calendar_sync_event_links` rows into real Google Calendar event create, update, and delete calls.
  - Confirm the latest commit still builds and behaves correctly after the auth/settings/tracking cleanup.
  - Keep outsider follow-up work anchored to the current Linear sequence instead of reviving old ad hoc planning.
  - Apply the new Supabase migration in the linked environment before starting outsider data-loading work that depends on these policies.
- What should the next thread verify:
  - Whether the deployed `google-calendar-auth` function behaves correctly once real Google OAuth secrets are added.
  - Whether Google callback success should automatically pull and store the selected calendar list, or keep that as a user-triggered refresh step.
  - Whether the new Google Calendar sync panel should keep saving fields on blur or move to an explicit save form once OAuth lands.
  - How Google OAuth and token refresh should be handled safely, likely through Supabase Edge Functions plus environment secrets.
  - Whether the `useEffectEvent` refactor in `src/App.jsx` clears lint warnings without changing app behavior.
  - Whether tracker auth/settings forms still work correctly on desktop and mobile.
  - Whether tracker to-do and appointment UI changes in `src/pages/tracker/TrackingPage.jsx` behave correctly on narrow screens.
  - Whether the local Linear CLI and JSON exports should remain checked in or become a lighter workflow artifact.
  - Whether outsider app-side loading for appointments and period summaries should now proceed as `GUI-45`.

## Linear Focus

- Current "Now" issues:
  - `GUI-58` Add overdue, skipped, and carry-forward task handling
  - `GUI-37` Phase 4: Add app-to-Google sync rules
  - `GUI-33` Phase 3: Build Google Calendar connection
  - `GUI-54` Build grouped Log picker with recent and pinned categories
  - `GUI-52` Add task priority and due time to To-Do items
  - `GUI-45` Load and normalize To-Do, Period, and Appointments for outsider views
  - `GUI-21` Phase 4: Add optional dated to-do syncing
  - `GUI-19` Phase 2: Show Google Calendar events inside the app calendar
  - `GUI-18` Phase 3: Sync app appointments into Google Calendar
  - `GUI-28` Make responsive layout handling reactive across tracker and outsider screens
  - `GUI-26` Clean up mobile UI across tracker and outsider flows
  - `GUI-22` Clean up tracking UI polish regressions from expansion work

- Current "Next" themes:
  - outsider summaries and telemetry upgrades: `GUI-64`, `GUI-63`, `GUI-62`, `GUI-61`, `GUI-60`, `GUI-59`
  - period deepening: `GUI-57`, `GUI-56`
  - appointments deepening: `GUI-48`

- High-level active projects:
  - `Tracker Stabilization`
  - `To-Do Deepening`
  - `Navigation Cleanup`
  - `Outsider App Fixes and Improvements`
  - `Period Tracker Deepening`
  - `Appointments Deepening`
  - `External Calendar Sync Plan`
  - `Calendar Visibility`

## Working Agreement

- Read this file before making changes.
- Update `Active Work` when starting something non-trivial.
- Add a short `Handoff Notes` entry before leaving a thread.
- Prefer new notes over rewriting history in chat.
