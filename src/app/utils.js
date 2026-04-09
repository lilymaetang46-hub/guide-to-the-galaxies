import {
  DEFAULT_CONNECTION_PERMISSIONS,
  DEFAULT_PUBLIC_APP_URL,
  DEFAULT_PUSH_ENVIRONMENT,
  TRACKING_AREA_OPTIONS,
} from "./constants.js";

export function getInviteTokenFromUrl(urlLike) {
  if (!urlLike) return "";

  const url = typeof urlLike === "string" ? new URL(urlLike) : urlLike;
  const segments = url.pathname.split("/").filter(Boolean);
  const connectIndex = segments.findIndex((segment) => segment === "connect");

  if (connectIndex >= 0 && segments[connectIndex + 1]) {
    return segments[connectIndex + 1];
  }

  const trailingSegment = segments[segments.length - 1];
  return trailingSegment && !trailingSegment.includes(".") ? trailingSegment : "";
}

export function buildInviteLink(token, baseUrl = getPublicAppUrl()) {
  if (!token) {
    return "";
  }

  return `${baseUrl}/connect/${token}`;
}

export function normalizeTrackedAreas(areas) {
  const validAreaIds = new Set(TRACKING_AREA_OPTIONS.map((area) => area.id));
  const normalizedAreas = Array.isArray(areas) ? areas : [];

  return [...new Set(normalizedAreas.map((area) => (area === "maintenance" ? "hygiene" : area)))]
    .filter((area) => validAreaIds.has(area));
}

export function getTrackingAreaOption(areaId) {
  return TRACKING_AREA_OPTIONS.find((area) => area.id === areaId) || null;
}

export function getNativePushEnvironment() {
  return import.meta.env.VITE_PUSH_ENVIRONMENT === "sandbox"
    ? "sandbox"
    : DEFAULT_PUSH_ENVIRONMENT;
}

export function isTrackedAreasColumnError(error) {
  const message = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`;
  return /tracked_areas/i.test(message);
}

export function getPublicAppUrl() {
  if (typeof window === "undefined") {
    return DEFAULT_PUBLIC_APP_URL;
  }

  const { origin, hostname } = window.location;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local")
  ) {
    return DEFAULT_PUBLIC_APP_URL;
  }

  return origin;
}

export function getFeedbackTone(message = "") {
  return /error|failed|could not|incorrect|not found/i.test(message) ? "error" : "success";
}

export function normalizeConnectionPermissions(permissions) {
  return {
    ...DEFAULT_CONNECTION_PERMISSIONS,
    ...(permissions && typeof permissions === "object" ? permissions : {}),
  };
}

function startOfWeek(date) {
  const value = parseDateKey(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);
  return value;
}

function formatDateKey(date) {
  return getLocalDateKey(date);
}

export function getLocalDateKey(dateInput) {
  const value = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  if (!dateKey) {
    return new Date();
  }

  const [year, month, day] = String(dateKey).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function compareEntryRecency(left, right) {
  const leftCreatedAt = left?.created_at ? new Date(left.created_at).getTime() : 0;
  const rightCreatedAt = right?.created_at ? new Date(right.created_at).getTime() : 0;

  if (leftCreatedAt !== rightCreatedAt) {
    return leftCreatedAt - rightCreatedAt;
  }

  return Number(left?.id ?? 0) - Number(right?.id ?? 0);
}

export function getLatestEntriesByDate(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const latestByDate = new Map();

  safeRows.forEach((row) => {
    if (!row?.entry_date) return;
    const existing = latestByDate.get(row.entry_date);

    if (!existing || compareEntryRecency(row, existing) > 0) {
      latestByDate.set(row.entry_date, row);
    }
  });

  return [...latestByDate.values()].sort(
    (a, b) => new Date(a.entry_date) - new Date(b.entry_date)
  );
}

function buildChartPoint(row, date) {
  return {
    date,
    mood: Number(row?.mood ?? 0),
    focus: Number(row?.focus ?? 0),
    energy: Number(row?.energy ?? 0),
    mealsCount: Array.isArray(row?.meals) ? row.meals.length : 0,
    medsTaken: row?.meds_taken ? 1 : 0,
    medsCount: Array.isArray(row?.meds) ? row.meds.length : 0,
    exerciseCount: Array.isArray(row?.exercise_logs)
      ? row.exercise_logs.length
      : row?.exercise_done
      ? 1
      : 0,
    cleaningMinutes: Number(row?.cleaning_minutes ?? 0),
    sleepQuality: Number(row?.sleep_quality ?? 0),
    hygieneCount:
      (row?.showered ? 1 : 0) +
      (row?.brushed_teeth ? 1 : 0) +
      (row?.skincare ? 1 : 0),
  };
}

export function buildRecentChartData(rows, days, today) {
  const safeToday = getLocalDateKey(today || new Date());
  const latestEntries = getLatestEntriesByDate(rows);
  const rowByDate = new Map(
    latestEntries
      .filter((row) => row?.entry_date && row.entry_date <= safeToday)
      .map((row) => [row.entry_date, row])
  );
  const safeDays = Math.max(1, Number(days) || 7);
  const startDate = parseDateKey(safeToday);
  startDate.setDate(startDate.getDate() - (safeDays - 1));

  return Array.from({ length: safeDays }, (_, index) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);
    const dateKey = formatDateKey(current);
    return buildChartPoint(rowByDate.get(dateKey), dateKey);
  });
}

function getGoalUnitValue(entry, category) {
  const mealsCount = Array.isArray(entry.meals) ? entry.meals.length : 0;
  const medsCount = Array.isArray(entry.meds) ? entry.meds.length : 0;
  const maintenanceValue =
    (entry.showered ? 1 : 0) +
    (entry.brushed_teeth ? 1 : 0) +
    (entry.skincare ? 1 : 0);
  const cleaningValue =
    (entry.laundry_done ? 1 : 0) +
    (entry.bedsheets_done ? 1 : 0) +
    (entry.room_cleaned ? 1 : 0) +
    ((entry.cleaning_minutes ?? 0) > 0 ? 1 : 0);
  const exerciseCount = Array.isArray(entry.exercise_logs)
    ? entry.exercise_logs.length
    : 0;
  const todoCompletedCount = (Array.isArray(entry.todo_items) ? entry.todo_items : []).filter(
    (item) => item?.completed
  ).length;

  switch (category) {
    case "Meds":
      return Math.max(medsCount, entry.meds_taken ? 1 : 0);
    case "Food":
      return mealsCount;
    case "Hygiene":
      return maintenanceValue;
    case "Sleep":
      return entry.bed_time && entry.wake_time ? 1 : 0;
    case "Cleaning":
      return cleaningValue;
    case "Exercise":
      return Math.max(exerciseCount, entry.exercise_done ? 1 : 0);
    case "To-Do":
      return todoCompletedCount;
    default:
      return 0;
  }
}

function buildDailyPeriods(goal, rows, today) {
  const rowMap = new Map(rows.map((row) => [row.entry_date, row]));
  const startDate = new Date(`${goal.createdAt || today}T00:00:00`);
  const endDate = new Date(`${today}T00:00:00`);
  const periods = [];

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    const key = formatDateKey(current);
    const entry = rowMap.get(key);
    periods.push({
      key,
      value: entry ? getGoalUnitValue(entry, goal.category) : 0,
    });
  }

  return periods;
}

function buildWeeklyPeriods(goal, rows, today) {
  const startWeek = startOfWeek(goal.createdAt || today);
  const endWeek = startOfWeek(today);
  const buckets = new Map();

  rows.forEach((row) => {
    const weekKey = formatDateKey(startOfWeek(row.entry_date));
    const currentValue = buckets.get(weekKey) || 0;
    buckets.set(weekKey, currentValue + getGoalUnitValue(row, goal.category));
  });

  const periods = [];

  for (
    let current = new Date(startWeek);
    current <= endWeek;
    current.setDate(current.getDate() + 7)
  ) {
    const key = formatDateKey(current);
    periods.push({
      key,
      value: buckets.get(key) || 0,
    });
  }

  return periods;
}

export function computeGoalProgress(goal, rows, today) {
  if (!goal || typeof goal !== "object") {
    return goal;
  }

  const safeRows = Array.isArray(rows) ? rows : [];
  const safeToday = getLocalDateKey(today || new Date());

  if (goal.completed) {
    return {
      ...goal,
      currentStreakProgress: goal.streakLength,
    };
  }

  const periods =
    goal.checkType === "weekly"
      ? buildWeeklyPeriods(goal, safeRows, safeToday)
      : buildDailyPeriods(goal, safeRows, safeToday);

  let currentStreak = 0;

  for (let index = periods.length - 1; index >= 0; index -= 1) {
    if (periods[index].value >= goal.targetAmount) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const completed = currentStreak >= goal.streakLength;

  return {
    ...goal,
    currentStreakProgress: Math.min(currentStreak, goal.streakLength),
    completed,
  };
}

export function calculateSimpleDailyStreak(rows, predicate, today) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeToday = getLocalDateKey(today || new Date());
  const safePredicate = typeof predicate === "function" ? predicate : () => false;
  const rowMap = new Map(safeRows.map((row) => [row.entry_date, row]));
  const cursor = new Date(`${safeToday}T00:00:00`);
  let streak = 0;

  while (true) {
    const key = formatDateKey(cursor);
    const entry = rowMap.get(key);

    if (!entry || !safePredicate(entry)) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function expandDateRange(startDateKey, endDateKey) {
  const startDate = parseDateKey(startDateKey);
  const endDate = parseDateKey(endDateKey || startDateKey);
  const safeEndDate = endDate >= startDate ? endDate : startDate;
  const dates = [];

  for (
    let cursor = new Date(startDate);
    cursor <= safeEndDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    dates.push(formatDateKey(cursor));
  }

  return dates;
}

function normalizeTodoPriority(priority) {
  return ["low", "medium", "high"].includes(priority) ? priority : "medium";
}

function getTodoPriorityLabel(priority) {
  switch (normalizeTodoPriority(priority)) {
    case "high":
      return "High priority";
    case "low":
      return "Low priority";
    default:
      return "Medium priority";
  }
}

export function buildCalendarEvents({
  todoItems = [],
  appointments = [],
  periodCycles = [],
  nextCycleEstimateDate = "",
  externalEvents = [],
}) {
  const events = [];

  (Array.isArray(todoItems) ? todoItems : []).forEach((item) => {
    if (!item?.dueDate) return;

    const priority = normalizeTodoPriority(item.priority);
    const detailParts = [];

    if (!item.completed && priority !== "medium") {
      detailParts.push(getTodoPriorityLabel(priority));
    }

    if (!item.completed) {
      detailParts.push(item.time ? `Due by ${item.time}` : "Task due");
    }

    events.push({
      id: `todo-${item.id || item.dueDate}-${item.text || "task"}`,
      kind: "todo",
      date: item.dueDate,
      time: item.time || "",
      priority,
      title: item.text || "Untitled task",
      detail: item.completed ? "Completed task" : detailParts.join(" · "),
      note: item.note || "",
      completed: Boolean(item.completed),
      sourcePageKey: "todo",
      sourceLabel: "To-Do",
      badgeLabel: item.completed ? "Task done" : "To-Do",
    });
  });

  (Array.isArray(appointments) ? appointments : []).forEach((item) => {
    if (!item?.eventDate) return;

    const itemType = item.itemType === "reminder" ? "Reminder" : "Appointment";
    const detailParts = [item.eventTime || "", item.location || ""].filter(Boolean);

    events.push({
      id: `appointment-${item.id || item.eventDate}-${item.title || "item"}`,
      kind: "appointment",
      date: item.eventDate,
      time: item.eventTime || "",
      title: item.title || itemType,
      detail: detailParts.join(" · "),
      note: item.note || "",
      sourcePageKey: "appointments",
      sourceLabel: "Appointments",
      badgeLabel: itemType,
    });
  });

  (Array.isArray(periodCycles) ? periodCycles : []).forEach((cycle, index) => {
    if (!cycle?.startDate) return;

    expandDateRange(cycle.startDate, cycle.endDate || cycle.startDate).forEach((dateKey, dayIndex) => {
      events.push({
        id: `period-${cycle.id || index}-${dateKey}`,
        kind: "period",
        date: dateKey,
        title: `Period day ${dayIndex + 1}`,
        detail: cycle.flowLevel ? `${cycle.flowLevel} flow` : "Period tracked",
        note: "",
        sourcePageKey: "period",
        sourceLabel: "Period",
        badgeLabel: "Period",
      });
    });
  });

  if (nextCycleEstimateDate) {
    expandDateRange(
      nextCycleEstimateDate,
      formatDateKey(addDays(parseDateKey(nextCycleEstimateDate), 4))
    ).forEach((dateKey, index) => {
      events.push({
        id: `period-estimate-${dateKey}`,
        kind: "period",
        date: dateKey,
        title: index === 0 ? "Next cycle estimate" : `Estimated cycle day ${index + 1}`,
        detail: "Predicted from recent cycle timing",
        note: "",
        estimated: true,
        sourcePageKey: "period",
        sourceLabel: "Period",
        badgeLabel: "Estimate",
      });
    });
  }

  (Array.isArray(externalEvents) ? externalEvents : []).forEach((item) => {
    if (!item?.date) return;

    const detailParts = [
      item.time ? `Google at ${item.time}` : "Google all-day",
      item.location || "",
    ].filter(Boolean);

    events.push({
      id: `google-${item.id || item.date}-${item.title || "event"}`,
      kind: "appointment",
      date: item.date,
      time: item.time || "",
      title: item.title || "Google Calendar event",
      detail: detailParts.join(" · "),
      note: item.note || "",
      external: true,
      sourcePageKey: "calendar",
      sourceLabel: "Google Calendar",
      badgeLabel: "Google",
    });
  });

  return events.sort((left, right) => {
    if (left.date !== right.date) return left.date.localeCompare(right.date);
    if ((left.time || "") !== (right.time || "")) {
      return (left.time || "").localeCompare(right.time || "");
    }
    return left.title.localeCompare(right.title);
  });
}

export function getThemeLanguage(family = "galaxy") {
  const tracker =
    family === "underwater"
      ? {
          dashboard: "Current Overview",
          actions: "Daily Currents",
          progress: "Flow",
          streaks: "Tides",
          rewards: "Reefs",
          activity: "Drift Log",
          status: "Waters Today",
          mood: "Depth",
          support: "Pings",
          greeting: "Welcome back",
          dashboardSubtitle: "A calm reading of today's waters.",
          dashboardKicker: "Today's current",
          dashboardBody: "Follow the flow a little at a time and keep the day feeling manageable.",
          emptyStreaks: "No active tides yet.",
          emptyActivity: "No drift log entries yet.",
          emptyRewards: "No reefs collected yet.",
          nextReward: "finish an active tide to grow another reef.",
          actionsSubtitle: "Open the spaces you may want to check first.",
          progressSubtitle: "A clear readout of what has been logged so far.",
          streaksSubtitle: "Current patterns stay visible here as a quiet source of momentum.",
          rewardsSubtitle: "Your reward collection grows as goals complete.",
          activitySubtitle: "A lightweight log to help you reorient.",
          moodSubtitle: "A quick emotional snapshot without opening the full mood page.",
        }
      : family === "forest"
      ? {
          dashboard: "Grove Overview",
          actions: "Daily Paths",
          progress: "Growth",
          streaks: "Trails",
          rewards: "Blooms",
          activity: "Path Log",
          status: "Conditions Today",
          mood: "Weather",
          support: "Calls",
          greeting: "Welcome back",
          dashboardSubtitle: "A gentle clearing for today's progress.",
          dashboardKicker: "Today's grove",
          dashboardBody: "Take one steady step at a time and let the day settle into place.",
          emptyStreaks: "No active trails yet.",
          emptyActivity: "No path log entries yet.",
          emptyRewards: "No blooms collected yet.",
          nextReward: "finish an active trail to open another bloom.",
          actionsSubtitle: "Open the tracker spaces you may want to visit first.",
          progressSubtitle: "A grounded readout of what has been logged so far.",
          streaksSubtitle: "Current patterns stay visible here as a quiet source of momentum.",
          rewardsSubtitle: "Your reward collection grows as goals complete.",
          activitySubtitle: "A lightweight log to help you reorient.",
          moodSubtitle: "A quick emotional snapshot without opening the full mood page.",
        }
      : {
          dashboard: "Cosmic Overview",
          actions: "Daily Rituals",
          progress: "Energy Flow",
          streaks: "Alignments",
          rewards: "Constellations",
          activity: "Signal Log",
          status: "Current State",
          mood: "Emotional Orbit",
          support: "Signals",
          greeting: "Welcome back, stargazer",
          dashboardSubtitle: "A gentle sky map for today.",
          dashboardKicker: "Today's sky",
          dashboardBody: "Take one soft step at a time and let the day unfold with a little more ease.",
          emptyStreaks: "No active alignments yet.",
          emptyActivity: "No signal log entries yet.",
          emptyRewards: "No constellations collected yet.",
          nextReward: "finish an active alignment to unlock another constellation.",
          actionsSubtitle: "Open the tracker spaces you may want to visit first.",
          progressSubtitle: "A gentle readout of what has been logged so far.",
          streaksSubtitle: "Current goal patterns stay visible here as a quiet source of momentum.",
          rewardsSubtitle: "Your reward collection grows as goals complete.",
          activitySubtitle: "A lightweight activity note to help you reorient.",
          moodSubtitle: "A quick emotional snapshot without opening the full mood page.",
        };

  const observer =
    family === "underwater"
      ? {
          dashboard: "Submarine Panel",
          status: "Systems Status",
          activity: "Dive Log",
          support: "Pings",
          mood: "Depth",
          streaks: "Tides",
          rewards: "Reefs",
          systems: "Systems Status",
          empty: "Approved tracker connections will appear here once available.",
          emptyBody: "No approved trackers are connected to this outsider account yet.",
        }
      : family === "forest"
      ? {
          dashboard: "Cabin Panel",
          status: "Conditions",
          activity: "Field Notes",
          support: "Calls",
          mood: "Weather",
          streaks: "Trails",
          rewards: "Blooms",
          systems: "Conditions",
          empty: "Approved tracker connections will appear here once available.",
          emptyBody: "No approved trackers are connected to this outsider account yet.",
        }
      : {
          dashboard: "Control Panel",
          status: "Systems Status",
          activity: "Activity Log",
          support: "Signals",
          mood: "Emotional Orbit",
          streaks: "Alignments",
          rewards: "Constellations",
          systems: "Systems Status",
          empty: "Approved tracker connections will appear here once available.",
          emptyBody: "No approved trackers are connected to this outsider account yet.",
        };

  return { tracker, observer };
}

export function getThemeRewardCopy(family = "galaxy") {
  if (family === "underwater") {
    return { singular: "Reef", plural: "Reefs" };
  }

  if (family === "forest") {
    return { singular: "Bloom", plural: "Blooms" };
  }

  return { singular: "Constellation", plural: "Constellations" };
}
