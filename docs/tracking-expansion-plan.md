# Tracking Expansion Plan

This document captures the current product plan for expanding the app into a broader life organization and tracking app.

It is meant to be easy to review before implementation work begins, and easy to revisit in future threads.

## Goal

Expand the app in a way that still feels calm, optional, and lightweight.

New tracking areas should:

- be optional
- be quick to use
- feel supportive instead of overwhelming
- fit into the existing tracker structure
- only grow into charts, goals, and sharing when that actually helps

## Recommended Feature Order

1. To-Do
2. Period Tracker
3. Appointments / Reminders
4. Calendar

## Why This Order

### 1. To-Do first

This is the best first addition because it immediately pushes the app toward life organization while still fitting the current tracker style.

Why it is first:

- useful for almost everyone
- easy to understand
- high daily value
- low privacy risk
- easiest to keep simple in a first version

### 2. Period Tracker second

This is a strong fit for the app, but it needs more care around privacy and data handling than To-Do does.

Why it is second:

- very valuable
- fits daily and recurring tracking well
- should be private by default
- needs stronger sharing and note rules

### 3. Appointments / Reminders third

This is a good organizational addition, but it is better after the app already has a task layer.

Why it is third:

- pairs well with To-Do
- useful for planning and structure
- easier to overcomplicate if added too early

### 4. Calendar fourth

Calendar should come after the app already has usable task, period, and appointment data.

Why it is fourth:

- it becomes more valuable when it can unify multiple tracking areas
- it should feel like a calm summary layer, not a full scheduling system
- it depends on clearer data shapes for cross-day tasks and event-based items
- it is the best place to connect planning and health context once the individual areas feel solid

## Phase 1: To-Do

### Main idea

Add a simple task area that helps the app feel more like a life organization tool without turning it into a heavy productivity app.

### Version 1 should include

- add a task
- mark a task complete
- view active tasks
- view completed tasks
- optional due date
- optional note

### Version 1 should not include

- subtasks
- repeating tasks
- tags
- project boards
- complex filters

### Design goal

It should feel like a gentle daily support list, not like a stressful productivity system.

### Most useful next additions

Once the simple version feels stable, the highest-value upgrades are:

- priority: low, medium, high
- due date plus optional time
- status beyond done/open, such as skipped or carried forward
- short notes for context
- simple categories like home, health, admin, work, personal
- today, upcoming, and overdue groupings
- carry forward unfinished tasks into the next day
- optional recurring tasks for repeated routines
- optional subtasks only for larger items that need a checklist

### Overview ideas

Once the basic page exists, overview can later show:

- open task count
- tasks due today
- a quick link into the To-Do page

### Longer-term direction

If the app grows into a calendar view, To-Do likely should move from `daily_entries.todo_items` into a dedicated table so tasks can support:

- cross-day scheduling
- overdue state
- recurrence
- better filtering
- cleaner calendar rendering
- stronger history and analytics

## Phase 2: Period Tracker

### Main idea

Add a private-by-default health tracking area that supports cycle awareness without exposing sensitive information.

### Version 1 should include

- mark period start
- mark period end
- flow level
- symptom tags
- optional private notes
- simple cycle history
- simple next-cycle estimate

### Version 1 should not include

- advanced fertility planning
- heavy predictive logic
- overly detailed charts at launch

### Privacy rules

- private by default
- outsider sharing off by default
- notes should stay especially protected
- notifications should be optional and gentle

### Most useful next additions

After the first version, the most useful improvements are:

- daily symptom logging during an active cycle
- pain level and energy level
- bleeding detail by day, including spotting
- symptom intensity rather than only symptom tags
- medication or relief methods used
- notes about what helped
- clearer cycle history with average cycle length and average period length
- irregular cycle flags or gentle pattern notes
- a quick "log today" flow while a cycle is active

### Caution areas

These should stay careful and clearly labeled if added later:

- fertility windows
- ovulation estimates
- prediction confidence
- any notification language that sounds more certain than the data really is

## Phase 3: Appointments / Reminders

### Main idea

Add a lightweight planning area that helps users remember upcoming events without trying to replace a full calendar app right away.

### Version 1 should include

- add appointment or reminder
- title
- date
- time
- optional location
- optional note

### Version 1 should not include

- Google Calendar sync
- Apple Calendar sync
- recurring rules
- full advanced calendar views unless they are clearly needed

### Most useful next additions

Once basic appointments are in place, the most helpful expansions are:

- end time
- provider, person, or host
- appointment category such as medical, personal, work, social
- confirmation status
- prep checklist
- travel or leave-by time
- follow-up task creation after the event
- richer reminder labeling without becoming a full external calendar replacement

## Phase 4: Calendar

### Main idea

Add a calm, unified calendar tab that lets users see period tracker details, to-dos, and appointments together in one place.

This should act as a summary and planning layer, not as a heavy calendar platform.

### Version 1 should include

- a new tracker `Calendar` tab
- a month view that works well on mobile
- a day agenda or selected-day detail view
- combined display of:
  - appointments and reminders
  - dated to-dos
  - active period days
  - simple next-cycle estimate markers
- filter chips for all, period, to-do, appointments
- tap-through from a calendar item into the source tab for editing

### Version 1 should not include

- external calendar sync
- drag-and-drop rescheduling
- complex recurrence rules
- advanced scheduling logic
- dense desktop-only calendar layouts

### Design goal

It should help users answer:

- what is happening today
- what is coming up next
- where does my period context overlap with my plans
- which tasks need attention

without feeling crowded or clinical.

### Technical direction

The calendar should be built as a unified view model that maps different sources into one shared event shape.

That event shape should be able to represent:

- appointments
- reminders
- tasks
- period spans
- predicted period dates

This shared event layer can also power overview summaries and future widgets.

### Suggested first calendar summaries

- today agenda
- upcoming this week
- cycle day or next estimate
- overdue tasks
- next appointment

## Future Expansion: External Calendar Sync

For the plain-English version of the shared app calendar and Google Calendar visibility plan, see `docs/calendar-visibility-plan.md`.

### Main idea

After the in-app calendar is stable, add optional sync with outside calendar systems so users can see tracker items in tools they already use.

This should be treated as a later expansion, not part of the first internal calendar release.

### Plain-English terms

- `Sync` means keeping information matched between this app and another system.
- `Two-way sync` means changes in either place can update the other place.
- `One-way sync` means this app sends information out, but edits made elsewhere do not fully come back.
- `OAuth` means the secure permission screen that lets a user approve calendar access without giving us their password.
- `API` means the official connection method a service provides so apps can read and write data.

### Recommendation

Build this in stages:

1. finish the in-app calendar first
2. add Google Calendar sync before Apple-specific sync
3. support Apple Calendar through export or subscription before attempting deeper iCloud-specific behavior

### Why this order

- Google Calendar has a clearer and more developer-friendly sync path
- Apple Calendar support is easier through standard calendar formats than through deep direct iCloud integration
- the internal calendar needs stable event shapes before outside sync becomes safe and predictable

### Scope decision to make before implementation

Before building, decide what sync should mean:

- app to calendar only
- calendar to app only
- full two-way sync

Recommended first version:

- app to calendar for appointments and reminders
- optional app to calendar for dated to-dos
- no write-back from external calendars into the app yet

That keeps the first release simpler, safer, and easier to debug.

### Suggested execution plan

#### Phase 1: Define the sync model

- decide which app items can become external calendar events
- define one shared calendar event shape for appointments, reminders, and dated to-dos
- decide which fields map to title, date, time, notes, reminders, recurrence, and status
- decide what should happen when a source item is edited, completed, or deleted

#### Phase 2: Prepare the data model

- add storage for connected calendar accounts
- add storage for user sync preferences
- add storage that links an internal item to an external calendar event ID
- store sync timestamps and last-known sync state for retries and troubleshooting

#### Phase 3: Build Google Calendar connection

- add Google OAuth connect and disconnect flow
- let the user choose which Google calendar to sync with
- build event create, update, and delete behavior through the Google Calendar API
- show clear connection status and error states in settings or connections

#### Phase 4: Add app-to-Google sync rules

- create external events when a linked app item is created
- update external events when title, date, time, or notes change
- remove or cancel external events when the source item is deleted, based on the product rule we choose
- prevent duplicate event creation during retries

#### Phase 5: Add Apple-friendly support

- support `.ics` event export for single items or batches
- optionally generate a calendar subscription feed for users who want ongoing Apple Calendar visibility
- make it clear that this first Apple-compatible version is not full deep two-way iCloud sync

#### Phase 6: Add controls and safeguards

- let users turn sync on or off
- let users choose which tracker categories sync out
- add per-user timezone handling
- handle revoked permissions, expired tokens, and failed sync retries gracefully
- log sync errors clearly enough that they can be debugged later

#### Phase 7: Test and release carefully

- test with real Google accounts on web and mobile
- test Apple Calendar import or subscription behavior on iPhone and Mac
- verify duplicate prevention, timezone behavior, delete behavior, and edit propagation
- release Google first, then Apple-compatible support

### Version 1 should include

- Google account connect flow
- choose a destination Google calendar
- app-to-Google sync for appointments and reminders
- optional app-to-Google sync for dated to-dos
- event update support
- event delete or cancel behavior based on product rules
- clear user controls and connection status

### Version 1 should not include

- full two-way sync from Google back into the app
- deep direct iCloud calendar integration
- complex recurring sync rules on day one
- automatic sync for every tracker type
- silent background behavior that users cannot understand or control

### Technical direction

This should be built on top of the shared normalized event layer used by the in-app calendar.

The sync system should treat external calendars as destinations connected to that normalized event layer, rather than letting each tracker type talk to Google or Apple separately.

That keeps the system easier to expand later and reduces duplicate logic.

### Best starting point if this becomes an active build thread

1. finalize the normalized internal calendar event shape
2. decide the Version 1 sync scope and item types
3. add database tables for sync connections and linked external event IDs
4. build Google OAuth and calendar selection
5. implement app-to-Google create, update, and delete flows
6. test heavily before adding Apple-compatible export or subscription support

## Product Guardrails

These should guide all future expansion work:

- start with the smallest useful version
- do not overcrowd the tracker nav
- do not force every new feature into the same exact data shape
- keep sensitive data private by default
- only add charts, goals, and outsider sharing when the feature truly benefits from them
- keep the calendar informative before making it interactive
- make predictions and estimates clearly look like estimates

## Navigation Cleanup Plan

As more tracker categories are added, the app should not keep promoting every category into the main navigation.

That creates too many equal-weight destinations and makes the tracker feel crowded, harder to scan, and less calm than the product goal.

### Main navigation goal

The tracker should keep a small set of stable top-level destinations:

- Overview
- Log
- Goals
- Charts
- Support
- Connections
- Settings

Individual tracking categories like Meds, Food, Sleep, Hygiene, Cleaning, Exercise, To-Do, Period, and Appointments should live inside `Log` instead of appearing as separate top-level navigation items.

### Why this matters

- it reduces decision fatigue
- it keeps the app feeling organized as more categories are added
- it makes the interface easier to learn
- it lets the overview page act more like a calm home screen
- it prevents the navigation from growing linearly with feature count

### Recommended structure

#### 1. Keep category switching inside the logging experience

The main tracker nav should take the user to `Log`, and the user should switch between categories from within that area.

That category switcher should support:

- pinned categories
- recent categories
- category search if needed
- clear grouping

Instead of showing a long horizontal or wrapped string of category buttons, the first version of `Log` should use a calmer category picker.

Recommended first approach:

- show a compact dropdown or select-style picker at the top of the `Log` page
- label it clearly, such as `Choose a tracker area`
- open the selected category below the picker
- remember the last-used category so returning to `Log` feels fast

This is a better default than rendering every category as equal-weight text buttons, especially as the tracker grows.

### Log page behavior recommendation

When a user taps `Log`, they should land on a simple logging hub instead of immediately seeing a large wall of category labels.

That hub can include:

- a dropdown for all available tracker areas
- a short `Recent` row for the last few categories used
- an optional `Pinned` row for favorites
- the selected category content underneath

This keeps the entry point calm while still making every tracker area easy to reach.

Suggested groups:

- Daily Care: Meds, Food, Sleep, Hygiene
- Health: Mood, Period, Exercise
- Planning: To-Do, Appointments, Calendar
- Home: Cleaning

### 2. Make Overview the launch surface

Overview should become the place that helps the user decide what to do next without showing every option at once.

Overview should prioritize:

- continue where you left off
- today's priorities
- quick links to the most-used categories
- a `More categories` entry point when needed

### 3. Use progressive disclosure inside category pages

Each tracker category should open with the quickest useful action first.

Then it can progressively reveal:

- optional extra details
- history or previous entries
- deeper analysis only when it helps

This keeps each page lighter even when the feature itself grows.

### 4. Reduce visual competition in navigation

Navigation should feel quieter and easier to scan.

That means:

- fewer primary nav items
- shorter labels where possible
- clearer separation between primary navigation and utility actions
- less emphasis on lower-frequency destinations like Settings
- one dominant navigation pattern per screen instead of multiple competing ones

### 5. Add category metadata so the UI can organize itself

Tracking areas should eventually include more structure than a flat label list.

Useful metadata:

- group
- priority
- pinned eligibility
- icon
- optional sort order

This will make it easier to build cleaner grouped navigation and better overview shortcuts without hardcoding the UI each time a new category is added.

## Navigation Rollout

### Phase A: Simplify top-level nav

- replace category-level top nav items with a single `Log` destination
- keep `Overview`, `Goals`, `Charts`, `Support`, `Connections`, and `Settings` as stable top-level destinations
- route category selection through the logging surface

### Phase B: Improve in-page category navigation

- group categories into clearer sections
- replace long category button rows with a dropdown or compact picker at the top of `Log`
- support pinned and recent categories
- make the switcher easier to scan on mobile

### Phase C: Strengthen Overview as a home screen

- add resume flow or continue-last-category actions
- surface today-focused quick actions
- show only the most relevant shortcuts instead of every category equally

### Phase D: Visual polish

- simplify labels
- tighten spacing and hierarchy
- reduce the feeling of clutter in sidebars, drawers, and mobile nav

## Planning Priority

This navigation cleanup should happen alongside future tracker expansion work, not after it.

If new categories keep getting added before the information architecture is simplified, each expansion will make the UI feel heavier.

Recommended order:

1. simplify tracker navigation
2. improve the in-page logging switcher
3. strengthen overview as the calm launch surface
4. continue adding or deepening tracking areas within that cleaner structure

## Technical Direction

The app already has a pattern for optional tracking areas through profile-level tracked area selection.

That pattern should continue, but not every new feature should be forced into the same daily-entry structure.

Recommended direction:

- keep `tracked_areas` as the feature toggle
- use dedicated storage for features that have multi-item or multi-day behavior
- summarize important information back into overview, charts, or goals only where it makes sense
- build a shared normalized event layer for anything that will appear on calendar surfaces

This matters especially for:

- To-Do, because tasks are collections rather than one daily check-in
- Period Tracker, because cycles span multiple days or weeks
- Appointments, because reminders are event-based rather than check-in based
- Calendar, because it needs to unify different sources without forcing them into one database table

## Implementation Roadmap

When implementation starts, a practical order is:

1. keep the current lightweight task, period, and appointment flows working
2. improve To-Do so items can support due dates, priority, and cross-day planning
3. deepen Period Tracker with more useful daily detail and better history
4. enrich Appointments with the extra fields that improve planning value
5. add a Calendar tab that reads from all three sources
6. add overview widgets such as today agenda, next appointment, overdue tasks, and cycle status

## Suggested Build Order

When implementation starts, the easiest breakdown is:

1. define the smallest useful scope
2. add the area as an optional tracker module
3. build the main page for that area
4. add a small overview summary
5. decide later whether charts, goals, or sharing are worth adding

## Current Recommendation

If implementation begins in a new thread, start with:

1. Phase 1: To-Do
2. make sure tasks support due dates and better usefulness before overbuilding the UI
3. move to Period Tracker next with privacy-first defaults and more helpful daily detail
4. deepen Appointments enough that they are genuinely useful on a shared schedule
5. add Calendar after those three sources are strong enough to unify well

## Highest-Value Additions

If the goal is to make the app meaningfully more useful without turning it into a heavy planner, prioritize these first:

- due dates and priority for To-Do
- carry-forward and overdue task handling
- daily symptom and pain logging for Period Tracker
- a unified today agenda in Calendar
- appointment follow-up tasks
- next-cycle estimate and active-cycle visibility inside Calendar and Overview

## Outsider View Implementation Checklist

This checklist is specifically for bringing the outsider experience up to date with the tracker changes that have already been added.

The goal is not to mirror the full tracker UI.

The goal is to give outsiders a clean, privacy-aware read-only view of the newer shared data and support actions.

### Scope decision

- [ ] confirm outsider view should show summary-level access, not full tracker-page parity
- [ ] keep outsider sharing read-only
- [ ] treat period sharing as extra-sensitive even when enabled
- [ ] confirm `private_notes` from period tracking must never appear in outsider view
- [ ] confirm whether symptom tags should stay hidden in the first outsider version

### Data access and policy updates

- [ ] review current outsider read policies for `daily_entries` and `profiles`
- [ ] add outsider read policy for `appointments` tied to approved tracker connections
- [ ] add outsider read policy for `period_cycles` tied to approved tracker connections
- [ ] ensure outsider access respects per-connection permissions, especially `todo`, `appointments`, and `period`
- [ ] verify no protected fields are exposed by policy changes beyond the intended shared summary data

### Outsider data loading

- [ ] update outsider data loading in `src/App.jsx`
- [ ] keep loading `daily_entries` for existing shared summaries and chart history
- [ ] include `todo_items` from `daily_entries` in the outsider data shape
- [ ] load `appointments` for connected trackers
- [ ] load `period_cycles` for connected trackers if period sharing is allowed
- [ ] normalize these sources into one outsider-facing tracker summary object
- [ ] avoid relying only on `latestEntry` for newer tracker features

### Outsider data model additions

- [ ] add shared to-do summary fields such as open count, completed count, and due today count
- [ ] add shared appointment summary fields such as next appointment, next reminder, and upcoming count
- [ ] add shared period summary fields such as cycle active, latest cycle, and next estimate
- [ ] add a shared agenda/event list shape that can combine to-do, appointments, and period items
- [ ] reuse the calendar event builder pattern where it helps keep tracker and outsider logic aligned

### Outsider Overview page

- [ ] update outsider overview to surface the new tracker categories at a summary level
- [ ] add a to-do summary block
- [ ] add an appointments summary block
- [ ] add a period summary block
- [ ] keep the page focused on triage and quick support, not deep detail
- [ ] ensure empty states still work when a tracker has partial sharing enabled

### Outsider Tracker Data page

- [ ] expand the outsider tracker data page beyond the older chart-only model
- [ ] add a read-only to-do section
- [ ] add a read-only appointments section
- [ ] add a read-only period section
- [ ] add a shared agenda section if it improves usability
- [ ] keep charts and newer data blocks consistent with existing outsider themes
- [ ] ensure sections only render when the corresponding sharing permission is enabled

### Outsider navigation

- [ ] decide whether a shared agenda belongs inside the existing data page or needs a dedicated outsider calendar page
- [ ] prefer starting inside the existing data page unless the content becomes too crowded
- [ ] only add a new outsider nav destination if the information no longer fits cleanly in the current structure

### Outsider Support page

- [ ] review existing outsider support shortcuts
- [ ] add support nudges for `todo` if that permission is enabled
- [ ] add support nudges for `appointments` if that permission is enabled
- [ ] decide whether period-related nudges should exist at all
- [ ] keep support language simple and non-invasive for sensitive categories

### Tracker connection settings

- [ ] verify tracker-side permission toggles already cover `todo`, `period`, and `appointments`
- [ ] confirm outsider UI actually honors those toggles end to end
- [ ] confirm disabled categories disappear from outsider summaries, detail sections, and support shortcuts
- [ ] confirm connection updates still work without breaking older outsider flows

### Privacy and content rules

- [ ] never show tracker-only editing controls in outsider pages
- [ ] never expose private notes or protected freeform fields in outsider summaries
- [ ] avoid language that makes period predictions sound certain
- [ ] keep period sharing off by default unless intentionally enabled
- [ ] make empty or unavailable states explicit instead of silently implying missing data

### QA and regression checks

- [ ] test outsider with only legacy sharing enabled
- [ ] test outsider with `todo` enabled
- [ ] test outsider with `appointments` enabled
- [ ] test outsider with `period` disabled
- [ ] test outsider with `period` enabled
- [ ] verify period private notes never appear
- [ ] verify shared agenda ordering is correct across mixed event types
- [ ] verify existing outsider charts and support flows still work after the data-loading changes
- [ ] verify mobile layouts still hold up for the expanded outsider pages

### Recommended implementation order

- [ ] step 1: add backend access and permission-safe policies
- [ ] step 2: refactor outsider data loading and normalization
- [ ] step 3: update outsider overview summaries
- [ ] step 4: expand outsider tracker data sections
- [ ] step 5: update outsider support shortcuts
- [ ] step 6: run regression checks and UI polish
