import test from "node:test";
import assert from "node:assert/strict";

import { buildCalendarEvents } from "../src/app/utils.js";

test("period calendar events never expose private notes", () => {
  const events = buildCalendarEvents({
    periodCycles: [
      {
        id: "cycle-1",
        startDate: "2026-04-01",
        endDate: "2026-04-02",
        flowLevel: "medium",
        symptomTags: ["Cramps", "Fatigue"],
        privateNotes: "Heating pad helped before bed.",
      },
    ],
  });

  const periodEvents = events.filter((event) => event.kind === "period" && !event.estimated);

  assert.equal(periodEvents.length, 2);
  assert.deepEqual(
    periodEvents.map((event) => event.note),
    ["", ""]
  );
  assert.deepEqual(
    periodEvents.map((event) => event.detail),
    ["medium flow", "medium flow"]
  );
});

test("estimated period events stay explicitly labeled as estimates", () => {
  const events = buildCalendarEvents({
    nextCycleEstimateDate: "2026-04-10",
  });

  const estimatedEvents = events.filter((event) => event.estimated);

  assert.equal(estimatedEvents.length, 5);
  assert.equal(estimatedEvents[0].title, "Next cycle estimate");
  assert.equal(estimatedEvents[0].badgeLabel, "Estimate");
  assert.equal(estimatedEvents[0].detail, "Predicted from recent cycle timing");
  assert.ok(estimatedEvents.every((event) => event.note === ""));
});
