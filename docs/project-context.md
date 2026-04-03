# Project Context

Use this file as the shared handoff note for any Codex thread working in this repo.

## Snapshot

- Project: tracker-app
- Purpose: Personal tracking app with tracker and outsider experiences, Supabase-backed data, mobile support via Capacitor, and local Linear planning support.
- Last updated: 2026-04-02
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
  - After finishing a meaningful piece of work, Codex should ask whether now is a good time to commit and give a recommendation about whether committing now makes sense.
  - Codex should read `docs/project-context.md` before making changes so parallel threads stay aligned.
  - The user does not have a coding background, so key technical terms should be explained in plain language when they matter.
  - If Codex notices a useful tool or integration that would help but is not available, Codex should tell the user and help set it up.
  - If the user says to remember something, Codex should add it to `docs/project-context.md` instead of relying on chat memory alone.

## Current Priorities

- Stabilize and polish recent tracker expansion work so the app stays shippable while features deepen.
- Continue current "Now" work from Linear around tracker navigation cleanup, to-do deepening, mobile cleanup, and responsive behavior.
- Prepare the outsider experience to catch up with newer shared tracker data: to-dos, appointments, period summaries, and permission-safe support actions.
- Keep privacy boundaries intact while shared calendar and outsider features expand.

## Active Work

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

- Active ownership note:
  - Area/files: outsider policy work for `GUI-42`
  - Goal: Add outsider read policies for appointments and period cycles.
  - Status: Claimed by another thread
  - Notes:
    - Treat Supabase policy files and related outsider permission work as reserved unless intentionally coordinating with that thread.

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
  - any Supabase migration or policy files related to outsider access while `GUI-42` is in progress
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
  - Added a shared `docs/project-context.md` file so multiple Codex threads can ground themselves in one current repo snapshot.
  - Updated this note after the clean commit `08fdaed` so the old "inferred" work items are now recorded as completed work.
  - Recorded that another thread wants to take `GUI-42`, so outsider policy/migration work is effectively reserved.
- What still needs attention:
  - Confirm the latest commit still builds and behaves correctly after the auth/settings/tracking cleanup.
  - Keep outsider follow-up work anchored to the current Linear sequence instead of reviving old ad hoc planning.
  - Coordinate carefully around `GUI-42` so app-side outsider work does not drift from the policy layer being built elsewhere.
- What should the next thread verify:
  - Whether the `useEffectEvent` refactor in `src/App.jsx` clears lint warnings without changing app behavior.
  - Whether tracker auth/settings forms still work correctly on desktop and mobile.
  - Whether tracker to-do and appointment UI changes in `src/pages/tracker/TrackingPage.jsx` behave correctly on narrow screens.
  - Whether the local Linear CLI and JSON exports should remain checked in or become a lighter workflow artifact.
  - Whether any outsider UI/data-loading work should wait on `GUI-42` or proceed behind safe assumptions.

## Linear Focus

- Current "Now" issues:
  - `GUI-58` Add overdue, skipped, and carry-forward task handling
  - `GUI-54` Build grouped Log picker with recent and pinned categories
  - `GUI-52` Add task priority and due time to To-Do items
  - `GUI-45` Load and normalize To-Do, Period, and Appointments for outsider views
  - `GUI-42` Add outsider read policies for appointments and period cycles
    - ownership note: another thread plans to work this now
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
  - `Calendar Visibility`

## Working Agreement

- Read this file before making changes.
- Update `Active Work` when starting something non-trivial.
- Add a short `Handoff Notes` entry before leaving a thread.
- Prefer new notes over rewriting history in chat.
