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
