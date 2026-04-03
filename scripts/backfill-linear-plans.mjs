import fs from "node:fs";
import path from "node:path";

const API = "https://api.linear.app/graphql";

function loadEnv() {
  const file = path.resolve(".env.local");
  const raw = fs.readFileSync(file, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const key = t.slice(0, i).trim();
    let value = t.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function gql(query, variables = {}) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.LINEAR_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors.map((e) => e.message).join("; "));
  return data.data;
}

const clean = (s = "") => (s ?? "").replace(/\r\n/g, "\n").trim();
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));

function issuePlan(issue) {
  const id = issue.identifier;
  const title = issue.title;
  const project = issue.project?.name ?? "";

  if (id === "GUI-65") {
    return {
      steps: [
        "Trace the tracker navigation state between Log, Mood, and Appointments to find where Appointments disappears.",
        "Refactor the section-switcher visibility rules so enabled tracker areas drive the nav instead of the last visited sub-page.",
        "Verify the fix across desktop, mobile, refresh, and back-navigation flows.",
        "Add a regression test or QA checklist so this navigation bug does not come back.",
      ],
      done: [
        "Appointments stays visible while moving between Log sub-pages.",
        "Tracker navigation remains consistent across mobile and desktop.",
        "The regression is covered by a repeatable check.",
      ],
    };
  }

  if (id === "GUI-15") {
    return {
      steps: [
        "Inventory the planning docs that are still active sources of truth and decide which ones belong in Linear.",
        "Create or update the matching Linear projects and issues so active work has scope and execution notes in one place.",
        "Link remaining reference docs back to the right Linear items and reduce duplicated planning guidance.",
        "Document a simple team rule that new planning work starts in Linear by default.",
      ],
      done: [
        "Active planning work is represented in Linear.",
        "Reference docs point back to the right Linear items.",
        "Future planning has a clearer default home.",
      ],
    };
  }

  if (project === "External Calendar Sync Plan" || project === "Calendar Visibility") {
    return {
      steps: [
        `Clarify the exact scope and success criteria for ${title.toLowerCase()} before building deeper integration behavior.`,
        "Implement the smallest safe change against the shared calendar event model and keep ownership between app-native and external events clear.",
        "Add the needed status, labeling, or controls so the behavior is understandable in the UI.",
        "Verify sync, visibility, and failure-path behavior with focused QA before moving to the next phase.",
      ],
      done: [
        "This calendar phase has a concrete execution path.",
        "App-native and external calendar behavior stay clearly differentiated.",
        "The phase is validated with repeatable QA.",
      ],
    };
  }

  const plans = {
    "Outsider App Fixes and Improvements": {
      steps: [
        `Define the exact outcome for ${title.toLowerCase()} in the outsider experience without drifting into tracker parity.`,
        "Implement the necessary data, UI, and permission-safe rendering changes on top of the shared outsider summary model.",
        "Keep empty states, mobile layouts, and mixed sharing states clear so the page remains easy to scan.",
        "Run regression QA across privacy boundaries, sharing combinations, and existing outsider flows.",
      ],
      done: [
        "The outsider change is implemented against permission-safe shared data.",
        "Privacy boundaries still hold across mixed sharing states.",
        "Desktop and mobile outsider flows remain usable.",
      ],
    },
    "Outsider Shared Planning": {
      steps: [
        `Define how ${title.toLowerCase()} fits into the shared planning rollout for outsider users.`,
        "Implement the needed backend or normalization work so outsider pages read from one permission-safe planning source.",
        "Update the relevant summary or support surfaces so they expose only approved shared planning information.",
        "Run regression QA across privacy, permissions, and mixed shared-category states.",
      ],
      done: [
        "The outsider planning change works end to end.",
        "Permissions are respected in data and UI layers.",
        "Sensitive details remain protected.",
      ],
    },
    "To-Do Deepening": {
      steps: [
        `Define the smallest data and UX changes needed for ${title.toLowerCase()} without making To-Do feel heavy.`,
        "Implement the required task model, form, and list updates while preserving existing task behavior.",
        "Propagate the new task state through overview and planning summaries where it adds value.",
        "Verify backward compatibility, cross-day behavior, and task edge cases before closing the issue.",
      ],
      done: [
        "The targeted To-Do improvement works in storage and UI.",
        "Existing task data continues to behave correctly.",
        "The change supports future task work instead of adding coupling.",
      ],
    },
    "Period Tracker Deepening": {
      steps: [
        `Define the privacy-safe product behavior for ${title.toLowerCase()} and keep labels understandable.`,
        "Implement the needed logging, storage, and history updates with careful defaults for repeated daily use.",
        "Surface the new detail in summaries or review flows only where it adds value without overclaiming certainty.",
        "Verify privacy boundaries, sparse-data handling, and mobile usability.",
      ],
      done: [
        "The period-tracking enhancement is usable in daily practice.",
        "Privacy boundaries remain intact.",
        "The new detail adds value without making the flow feel heavy.",
      ],
    },
    "Appointments Deepening": {
      steps: [
        `Define the smallest appointment-model and UX changes needed for ${title.toLowerCase()}.`,
        "Implement the new appointment inputs and editing behavior while keeping everything optional where appropriate.",
        "Surface the richer planning detail in cards, reminders, and summaries only where it improves scanability.",
        "Verify old appointments, partial metadata, and mobile layouts still behave cleanly.",
      ],
      done: [
        "Appointments support the targeted richer planning behavior cleanly.",
        "The experience stays lightweight rather than becoming a full calendar suite.",
        "Existing appointment data remains compatible.",
      ],
    },
    "Navigation Cleanup": {
      steps: [
        `Clarify how ${title.toLowerCase()} fits the calmer Log-hub and overview-first information architecture.`,
        "Implement the shell or in-page navigation changes needed to reduce clutter while preserving wayfinding.",
        "Align related tracker surfaces so navigation patterns stay consistent across breakpoints.",
        "Verify discoverability and reachability on desktop and mobile.",
      ],
      done: [
        "The navigation change is calmer and more coherent.",
        "Important destinations remain easy to reach.",
        "The cleanup supports the broader tracker IA direction.",
      ],
    },
    "Tracker Stabilization": {
      steps: [
        `Confirm the failure mode behind ${title.toLowerCase()} and reduce it to the smallest safe stabilization fix.`,
        "Implement the targeted correctness, privacy, or UI cleanup with minimal behavioral risk.",
        "Add regression coverage or a repeatable QA path around the failure-prone flow.",
        "Verify the change across the affected tracker and outsider surfaces before closing the issue.",
      ],
      done: [
        "The targeted stabilization problem is fixed or materially reduced.",
        "The risk of regression is lower than before.",
        "The affected surfaces behave consistently after the change.",
      ],
    },
    "Calendar Feature": {
      steps: [
        `Define the calendar outcome for ${title.toLowerCase()} on top of the shared event layer.`,
        "Implement the needed rendering, grouping, or summary behavior against normalized event data rather than one-off page logic.",
        "Tune labels, density, and hierarchy so mixed event types stay readable.",
        "Verify busy and sparse calendar states on mobile and desktop.",
      ],
      done: [
        "The calendar improvement adds clearer planning value.",
        "The work builds on normalized event data.",
        "The calendar remains readable across layouts.",
      ],
    },
  };

  return (
    plans[project] ?? {
      steps: [
        `Clarify the exact scope and success criteria for ${title.toLowerCase()}.`,
        "Break the work into the smallest safe data, UI, and policy changes needed for the outcome.",
        "Implement the change with attention to mobile behavior, empty states, and reliability.",
        "Run focused QA and capture any true out-of-scope follow-up work explicitly.",
      ],
      done: [
        "The issue has a concrete execution path.",
        "The targeted behavior is implemented and verified.",
        "Any remaining follow-up work is explicit.",
      ],
    }
  );
}

function issueDescription(issue) {
  const plan = issuePlan(issue);
  const base = clean(issue.description || issue.title);
  return `${base}\n\nImplementation plan\n\n1. ${plan.steps[0]}\n2. ${plan.steps[1]}\n3. ${plan.steps[2]}\n4. ${plan.steps[3]}\n\nDefinition of done\n\n* ${plan.done[0]}\n* ${plan.done[1]}\n* ${plan.done[2]}`;
}

function projectContent(project) {
  const byName = {
    "To-Do Deepening": `Objective
Strengthen To-Do with the next highest-value improvements while keeping tasks calm, optional, and lightweight.

Scope

* priority and optional due time
* overdue, skipped, and carry-forward handling
* simple categories and lightweight grouping
* groundwork for moving tasks into dedicated storage

Execution plan

1. Stabilize the task model so priority, due-time, and cross-day state are reliable.
2. Add the highest-value task UX improvements without turning the feature into a heavy productivity tool.
3. Improve grouping and summaries so the extra metadata actually helps users scan their work.
4. Prepare the longer-term storage shift away from daily_entries where needed.
5. Validate backward compatibility, edge cases, and mobile task flows.

Definition of done

* The next wave of task improvements works end to end.
* Task state remains understandable for both simple and richer tasks.
* The implementation leaves To-Do easier to extend, not more coupled.`,
    "Period Tracker Deepening": `Objective
Expand period tracking with richer day-level detail, safer summaries, and a faster active-cycle experience.

Scope

* richer daily symptom and bleeding detail
* active-cycle quick logging
* improved cycle history and gentle pattern notes
* supportive notes about relief methods and what helped

Execution plan

1. Define the next period-tracking fields and summaries with privacy-first defaults.
2. Add compact logging flows for repeated active-cycle updates.
3. Expand history and review surfaces with richer but careful cycle context.
4. Verify that new detail stays private, understandable, and low-friction on mobile and desktop.
5. Keep copy and estimates conservative so the product does not overclaim certainty.

Definition of done

* Users can capture richer period detail without more friction.
* Summaries and history are more helpful while still privacy-safe.
* The feature remains supportive rather than clinical or overwhelming.`,
    "Appointments Deepening": `Objective
Deepen appointments and reminders with the next most useful planning details while preserving the app's lightweight feel.

Scope

* richer appointment metadata
* optional prep checklist and leave-by time
* follow-up task creation after appointments

Execution plan

1. Extend the appointment data model with the highest-value optional fields.
2. Update create and edit flows so richer details stay secondary to the core appointment form.
3. Surface the new metadata in cards, reminders, and summaries only where it improves planning value.
4. Connect appointments and follow-up tasks in a lightweight, low-noise way.
5. Verify that old appointments, partial metadata, and mobile layouts still behave cleanly.

Definition of done

* Appointments support the targeted richer planning details.
* The feature still feels lightweight rather than like a full calendar suite.
* Related reminders and follow-up flows remain easy to understand.`,
    "Navigation Cleanup": `Objective
Finish the tracker information architecture shift toward a calmer Log hub and a stronger Overview home surface.

Scope

* grouped Log picker improvements
* shell and top-level navigation cleanup
* stronger Overview hierarchy and home-surface behavior

Execution plan

1. Lock the desired tracker information architecture so shell, Overview, and Log all move in the same direction.
2. Reduce shell-level clutter and move category complexity into calmer in-page navigation patterns.
3. Build the grouped Log picker with recent and pinned access patterns where they add value.
4. Strengthen Overview as the resume and home surface for the tracker.
5. Validate discoverability, reachability, and consistency across desktop and mobile layouts.

Definition of done

* Tracker navigation is calmer and more coherent.
* Overview and Log each have a clearer role.
* New tracker areas can be added without recreating top-level clutter.`,
    "Outsider Shared Planning": `Objective
Bring outsider permissions, summaries, and support flows up to date with shared To-Do, Period, Appointments, and agenda data.

Scope

* backend read policies for shared planning categories
* normalized outsider data loading
* updated outsider overview and tracker data surfaces
* permission-aware support nudges and regression coverage

Execution plan

1. Tighten outsider read policies and tracker permission alignment for the newly shared planning categories.
2. Normalize shared planning data into one outsider-facing summary model.
3. Expand outsider overview and tracker data pages with permission-safe planning summaries.
4. Update support nudges and actions so they respect what is actually shared.
5. Run regression coverage across mixed sharing states, privacy constraints, and mobile layouts.

Definition of done

* Outsider experiences reflect shared planning data safely and clearly.
* Permission toggles are respected end to end.
* Sensitive details stay protected across data, UI, and support flows.`,
    "Tracker Stabilization": `Objective
Reduce delivery risk in the tracker and outsider product through focused stabilization work across privacy, responsiveness, UI cleanup, navigation, and architecture.

Scope

* privacy hardening
* mobile responsiveness and shell polish
* navigation regressions and UI cleanup
* test coverage and architecture risk reduction

Execution plan

1. Fix the highest-risk privacy and correctness regressions first.
2. Clean up responsive behavior and mobile UI issues across tracker and outsider surfaces.
3. Resolve navigation regressions and accumulated polish problems that make the product feel unstable.
4. Add targeted regression coverage around the most failure-prone areas.
5. Reduce shell-level architecture risk where oversized or tightly coupled code keeps creating fragility.

Definition of done

* The current tracker and outsider experience feels materially more stable.
* High-risk regressions are reduced or covered by repeatable checks.
* Future product work can land on a sturdier baseline.`,
    "Calendar Visibility": `Objective
Make calendar information easier to understand in the app first, then extend that clarity into Google Calendar visibility and simple sync behavior.

Scope

* stronger in-app calendar visibility
* Google Calendar events shown inside the app
* simple app-to-Google appointment sync
* optional dated To-Do syncing
* reliability and refresh polish

Execution plan

1. Strengthen the in-app calendar so users can understand app-native events at a glance.
2. Add clearly labeled Google Calendar visibility inside the app without blurring ownership.
3. Introduce safe, simple app-to-Google sync for supported appointments.
4. Add optional dated To-Do sync only after the core event path is stable.
5. Improve status visibility, refresh behavior, and reliability before calling the work complete.

Definition of done

* Calendar visibility is clearer inside the app and across Google integration surfaces.
* External events and app-native events remain distinguishable.
* Reliability and refresh behavior are good enough for daily use.`,
    "Calendar Feature": `Objective
Create and polish the broader calendar experience so it can unify planning data without becoming a heavy scheduler.

Scope

* stronger today and overview widgets
* improved weekly planning summaries
* calendar polish that builds on the shared event layer

Execution plan

1. Build the most valuable summary surfaces on top of the normalized calendar event layer.
2. Improve today and weekly planning views so they help users understand what matters next.
3. Refine labels, grouping, and hierarchy so mixed event types stay easy to scan.
4. Verify the calendar stays calm on mobile and desktop as more data types appear.
5. Keep the calendar focused on summary and planning value rather than full scheduling complexity.

Definition of done

* The calendar adds clearer planning value across the app.
* Summary widgets and weekly views share a common event model.
* The experience stays calm and readable as features expand.`,
  };
  return byName[project.name];
}

async function main() {
  loadEnv();

  const issues = readJson("linear-issues.json");
  const projects = readJson("linear-projects.json");

  const issuesToUpdate = issues.filter((issue) => !/Implementation plan/i.test(issue.description || ""));
  const projectsToUpdate = projects.filter((project) => !clean(project.content));

  const issueMutation = `
    mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) { success }
    }
  `;
  const projectMutation = `
    mutation ProjectUpdate($id: String!, $input: ProjectUpdateInput!) {
      projectUpdate(id: $id, input: $input) { success }
    }
  `;

  for (const issue of issuesToUpdate) {
    await gql(issueMutation, {
      id: issue.id,
      input: { description: issueDescription(issue) },
    });
    console.log(`Updated issue ${issue.identifier}`);
  }

  for (const project of projectsToUpdate) {
    const content = projectContent(project);
    if (!content) throw new Error(`No project template for ${project.name}`);
    await gql(projectMutation, {
      id: project.id,
      input: { content },
    });
    console.log(`Updated project ${project.name}`);
  }

  console.log(`Backfilled ${issuesToUpdate.length} issue plans and ${projectsToUpdate.length} project plans.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
