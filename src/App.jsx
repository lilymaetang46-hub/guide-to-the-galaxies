import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { useEffectEvent } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import {
  checkNativePushAvailability,
  registerForNativePush,
  unregisterFromNativePush,
} from "./pushNotifications";
import TrackerLayout from "./layouts/TrackerLayout";
import OutsiderLayout from "./layouts/OutsiderLayout";
import TrackerOverviewPage from "./pages/tracker/OverviewPage";
import TrackerTrackingPage from "./pages/tracker/TrackingPage";
import TrackerMoodPage from "./pages/tracker/MoodPage";
import TrackerGoalsPage from "./pages/tracker/GoalsPage";
import TrackerChartsPage from "./pages/tracker/ChartsPage";
import TrackerConnectionsPage from "./pages/tracker/ConnectionsPage";
import TrackerSettingsPage from "./pages/tracker/SettingsPage";
import TrackerSupportPage from "./pages/tracker/SupportPage";
import TrackerCalendarPage from "./pages/tracker/CalendarPage";
import OutsiderOverviewPage from "./pages/outsider/OverviewPage";
import OutsiderTrackerDataPage from "./pages/outsider/TrackerDataPage";
import OutsiderSupportPage from "./pages/outsider/SupportPage";
import OutsiderGoalsPage from "./pages/outsider/GoalsPage";
import {
  DEFAULT_CONNECTION_PERMISSIONS,
  TRACKING_AREA_OPTIONS,
} from "./app/constants";
import {
  buildInviteLink,
  buildCalendarEvents,
  buildRecentChartData,
  calculateSimpleDailyStreak,
  computeGoalProgress,
  getFeedbackTone,
  getInviteTokenFromUrl,
  getLatestEntriesByDate,
  getLocalDateKey,
  getNativePushEnvironment,
  getPublicAppUrl,
  getThemeLanguage,
  getThemeRewardCopy,
  getTrackingAreaOption,
  isTrackedAreasColumnError,
  normalizeConnectionPermissions,
  normalizeTrackedAreas,
} from "./app/utils";

const PENDING_SIGNUP_PROFILE_KEY = "pendingSignupProfile";
const PREFERRED_APP_EXPERIENCE_KEY = "preferredAppExperience";
const TRACKER_DARK_MODE_KEY = "trackerDarkMode";
const OUTSIDER_DARK_MODE_KEY = "outsiderDarkMode";
const TRACKER_TUTORIAL_SEEN_KEY = "trackerTutorialSeen";
const OUTSIDER_TUTORIAL_SEEN_KEY = "outsiderTutorialSeen";
const NATIVE_PUSH_TARGET_PAGE = "support";

function makeConnectionCode() {
  return `STAR-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function makeConnectionToken() {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

function buildChartsPreviewData(range = 7, todayKey) {
  const previewValues = [
    { mood: 2, focus: 3, energy: 2, mealsCount: 2, medsCount: 1, hygieneCount: 2, exerciseCount: 0 },
    { mood: 3, focus: 3, energy: 3, mealsCount: 3, medsCount: 1, hygieneCount: 2, exerciseCount: 1 },
    { mood: 4, focus: 2, energy: 4, mealsCount: 2, medsCount: 1, hygieneCount: 1, exerciseCount: 1 },
    { mood: 2, focus: 2, energy: 2, mealsCount: 1, medsCount: 1, hygieneCount: 2, exerciseCount: 0 },
    { mood: 1, focus: 1, energy: 1, mealsCount: 2, medsCount: 0, hygieneCount: 1, exerciseCount: 0 },
    { mood: 2, focus: 2, energy: 2, mealsCount: 2, medsCount: 1, hygieneCount: 2, exerciseCount: 1 },
    { mood: 3, focus: 4, energy: 3, mealsCount: 3, medsCount: 1, hygieneCount: 3, exerciseCount: 1 },
    { mood: 4, focus: 3, energy: 4, mealsCount: 2, medsCount: 1, hygieneCount: 2, exerciseCount: 0 },
    { mood: 5, focus: 4, energy: 4, mealsCount: 3, medsCount: 1, hygieneCount: 3, exerciseCount: 1 },
    { mood: 3, focus: 2, energy: 3, mealsCount: 2, medsCount: 1, hygieneCount: 2, exerciseCount: 1 },
    { mood: 2, focus: 3, energy: 2, mealsCount: 1, medsCount: 1, hygieneCount: 1, exerciseCount: 0 },
    { mood: 4, focus: 4, energy: 4, mealsCount: 3, medsCount: 1, hygieneCount: 3, exerciseCount: 1 },
    { mood: 5, focus: 3, energy: 4, mealsCount: 2, medsCount: 1, hygieneCount: 2, exerciseCount: 1 },
    { mood: 4, focus: 4, energy: 3, mealsCount: 3, medsCount: 1, hygieneCount: 3, exerciseCount: 0 },
  ];

  const anchorDate = todayKey ? new Date(`${todayKey}T12:00:00`) : new Date();
  const days = previewValues.slice(-Math.max(1, Math.min(range, previewValues.length)));

  return days.map((day, index) => {
    const date = new Date(anchorDate);
    date.setDate(anchorDate.getDate() - (days.length - index - 1));

    return {
      date: date.toISOString().slice(0, 10),
      ...day,
    };
  });
}

function makeGoalSuggestions(mode, isDarkVariant = false) {
  const solarWords = [
    "Sun",
    "Sunrise",
    "Sunburst",
    "Glow",
    "Radiant",
    "Golden",
    "Halo",
    "Flare",
    "Dawn",
    "Ember",
    "Light",
    "Aurora",
  ];
  const galaxyWords = [
    "Orbit",
    "Nova",
    "Constellation",
    "Comet",
    "Starlight",
    "Lunar",
    "Cosmic",
    "Nebula",
    "Eclipse",
    "Meteor",
    "Galaxy",
    "Celestial",
  ];
  const underwaterWords = [
    "Current",
    "Tidal",
    "Coral",
    "Deep",
    "Pearl",
    "Blue",
    "Drift",
    "Wave",
    "Harbor",
    "Reef",
    "Sea",
    "Lagoon",
  ];
  const forestWords = [
    "Grove",
    "Fern",
    "Moss",
    "Cedar",
    "Bloom",
    "Trail",
    "Canopy",
    "Meadow",
    "Wild",
    "Oak",
    "Leaf",
    "Thicket",
  ];
  const actionWords = [
    "Ritual",
    "Journey",
    "Streak",
    "Path",
    "Quest",
    "Drift",
    "Reset",
    "Bloom",
    "Rise",
    "Flow",
    "Boost",
    "Check-In",
  ];

  const themeWords =
    mode === "underwater"
      ? underwaterWords
      : mode === "forest"
      ? forestWords
      : isDarkVariant
      ? galaxyWords
      : solarWords;
  const suggestions = [];

  while (suggestions.length < 3) {
    const themeWord = themeWords[suggestions.length % themeWords.length];
    const actionWord = actionWords[(suggestions.length + themeWords.length) % actionWords.length];
    const candidate = `${themeWord} ${actionWord}`;

    if (!suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
  }

  return suggestions;
}

function makeRewardName(mode) {
  const galaxyRewards = ["Nova", "Celestial", "Lunar", "Comet", "Nebula", "Starlight"];
  const underwaterRewards = ["Coral", "Tidal", "Pearl", "Blue", "Deep", "Drift"];
  const forestRewards = ["Moss", "Fern", "Grove", "Cedar", "Meadow", "Wild"];
  const rewardType = getThemeRewardCopy(mode).singular;
  const baseWords =
    mode === "underwater"
      ? underwaterRewards
      : mode === "forest"
      ? forestRewards
      : galaxyRewards;

  return `${baseWords[0]} ${rewardType}`;
}

function createGoalId() {
  return crypto.randomUUID();
}

function getNativePushOptOutKey(userId) {
  return `nativePushDisabled:${userId}`;
}

function getTrackedAreasStorageKey(userId) {
  return `trackedAreas:${userId}`;
}

function getTrackerTutorialSeenKey(userId) {
  return `${TRACKER_TUTORIAL_SEEN_KEY}:${userId}`;
}

function getOutsiderTutorialSeenKey(userId) {
  return `${OUTSIDER_TUTORIAL_SEEN_KEY}:${userId}`;
}

function normalizePeriodCycles(rawCycles) {
  return (Array.isArray(rawCycles) ? rawCycles : [])
    .map((cycle) => ({
      id: cycle?.id,
      startDate: cycle?.start_date || "",
      endDate: cycle?.end_date || "",
      flowLevel: cycle?.flow_level || "medium",
      symptomTags: Array.isArray(cycle?.symptom_tags) ? cycle.symptom_tags : [],
      privateNotes: cycle?.private_notes || "",
      createdAt: cycle?.created_at || "",
      updatedAt: cycle?.updated_at || "",
    }))
    .sort((left, right) => {
      if (!left.endDate && right.endDate) return -1;
      if (left.endDate && !right.endDate) return 1;
      return new Date(right.startDate || 0) - new Date(left.startDate || 0);
    });
}

function normalizeAppointments(rawAppointments) {
  return (Array.isArray(rawAppointments) ? rawAppointments : [])
    .map((item) => ({
      id: item?.id,
      itemType: item?.item_type || "appointment",
      title: item?.title || "",
      eventDate: item?.event_date || "",
      eventTime: item?.event_time ? String(item.event_time).slice(0, 5) : "",
      location: item?.location || "",
      note: item?.note || "",
      createdAt: item?.created_at || "",
      updatedAt: item?.updated_at || "",
    }))
    .sort((left, right) => {
      const leftStamp = `${left.eventDate || ""} ${left.eventTime || ""}`;
      const rightStamp = `${right.eventDate || ""} ${right.eventTime || ""}`;
      return leftStamp.localeCompare(rightStamp);
    });
}

function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function App() {
  const today = getLocalDateKey(new Date());
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isChartsPreviewMode =
    currentPath === "/dev/charts-preview" || currentPath === "/dev/galaxy-charts-preview";
  const isOverviewPreviewMode =
    currentPath === "/dev/overview-preview" || currentPath === "/dev/galaxy-overview-preview";
  const isCardsPreviewMode =
    currentPath === "/dev/cards-preview" || currentPath === "/dev/galaxy-cards-preview";

  const [entryId, setEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [trackerDarkMode, setTrackerDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(TRACKER_DARK_MODE_KEY) ?? localStorage.getItem("darkMode");
    return savedTheme === null ? true : savedTheme === "true";
  });
  const [outsiderDarkMode, setOutsiderDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(OUTSIDER_DARK_MODE_KEY);
    if (savedTheme !== null) {
      return savedTheme === "true";
    }
    const legacyTrackerTheme = localStorage.getItem(TRACKER_DARK_MODE_KEY) ?? localStorage.getItem("darkMode");
    return legacyTrackerTheme === null ? true : legacyTrackerTheme === "true";
  });
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileSyncLoading, setProfileSyncLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(
    () => localStorage.getItem(PREFERRED_APP_EXPERIENCE_KEY) || "tracker"
  );
  const [appExperience, setAppExperience] = useState(
    () => localStorage.getItem(PREFERRED_APP_EXPERIENCE_KEY) || "tracker"
  );
  const darkMode = appExperience === "outsider" ? outsiderDarkMode : trackerDarkMode;
  const setDarkMode = (nextValue) => {
    const apply = (currentValue) =>
      typeof nextValue === "function" ? nextValue(currentValue) : nextValue;

    if (appExperience === "outsider") {
      setOutsiderDarkMode((currentValue) => apply(currentValue));
      return;
    }

    setTrackerDarkMode((currentValue) => apply(currentValue));
  };
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [signupStep, setSignupStep] = useState(1);
  const [themeFamily, setThemeFamily] = useState("galaxy");
  const [signupThemeFamily, setSignupThemeFamily] = useState("galaxy");
  const [signupMode, setSignupMode] = useState("dark");
  const [displayName, setDisplayName] = useState("");
  const [secondaryDisplayName, setSecondaryDisplayName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [profilePin, setProfilePin] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmNewPinInput, setConfirmNewPinInput] = useState("");
  const [resetPinPassword, setResetPinPassword] = useState("");
  const [resetNewPinInput, setResetNewPinInput] = useState("");
  const [resetConfirmNewPinInput, setResetConfirmNewPinInput] = useState("");
  const [activePage, setActivePage] = useState("mission");
  const [outsiderPage, setOutsiderPage] = useState("outsiderOverview");
  const [trackedAreas, setTrackedAreas] = useState([]);
  const [pendingTrackedAreas, setPendingTrackedAreas] = useState([]);
  const [showTrackingAreaPicker, setShowTrackingAreaPicker] = useState(false);
  const [trackingAreasMessage, setTrackingAreasMessage] = useState("");
  const [showAddTrackingAreaPicker, setShowAddTrackingAreaPicker] = useState(false);
  const [trackingAreaToAdd, setTrackingAreaToAdd] = useState("");
  const [showTrackerTutorial, setShowTrackerTutorial] = useState(false);
  const [trackerTutorialStepIndex, setTrackerTutorialStepIndex] = useState(0);
  const [showOutsiderTutorial, setShowOutsiderTutorial] = useState(false);
  const [outsiderTutorialStepIndex, setOutsiderTutorialStepIndex] = useState(0);
  const [showOutsiderChooser, setShowOutsiderChooser] = useState(false);
  const [selectedOutsiderId, setSelectedOutsiderId] = useState("aria");
  const [outsiderTrackers, setOutsiderTrackers] = useState([]);
  const [outsiderLoading, setOutsiderLoading] = useState(false);
  const [outsiderMessage, setOutsiderMessage] = useState("");
  const [outsiderCooldownUntil, setOutsiderCooldownUntil] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinLinkInput, setJoinLinkInput] = useState("");
  const [connectionsMessage, setConnectionsMessage] = useState("");
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connectedOutsiders, setConnectedOutsiders] = useState([]);
  const [supportInbox, setSupportInbox] = useState([]);
  const [supportInboxLoading, setSupportInboxLoading] = useState(false);
  const [supportInboxMessage, setSupportInboxMessage] = useState("");
  const [pinApprovalTarget, setPinApprovalTarget] = useState(null);
  const [approvalPinInput, setApprovalPinInput] = useState("");
  const [pushNotificationsSupported, setPushNotificationsSupported] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState("prompt");
  const [pushToken, setPushToken] = useState("");
  const [pushStatusMessage, setPushStatusMessage] = useState("");
  const [pushSyncing, setPushSyncing] = useState(false);
  const [pushRegistrationHandle, setPushRegistrationHandle] = useState(null);
  const [pushOptedOutLocally, setPushOptedOutLocally] = useState(false);

  const [medTaken, setMedTaken] = useState(false);
  const [medsTime, setMedsTime] = useState("");
  const [meds, setMeds] = useState([]);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medEntryTime, setMedEntryTime] = useState("");
  const [medSymptoms, setMedSymptoms] = useState("");
  const [medNotes, setMedNotes] = useState("");

  const [meals, setMeals] = useState([]);
  const [mealText, setMealText] = useState("");
  const [mealTime, setMealTime] = useState("");

  const [todoItems, setTodoItems] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [todoDueDate, setTodoDueDate] = useState("");
  const [todoNote, setTodoNote] = useState("");
  const [periodCycles, setPeriodCycles] = useState([]);
  const [periodStartDate, setPeriodStartDate] = useState(today);
  const [periodEndDate, setPeriodEndDate] = useState(today);
  const [periodFlowLevel, setPeriodFlowLevel] = useState("medium");
  const [periodSymptomTags, setPeriodSymptomTags] = useState([]);
  const [periodPrivateNotes, setPeriodPrivateNotes] = useState("");
  const [periodStatusMessage, setPeriodStatusMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [appointmentType, setAppointmentType] = useState("appointment");
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");
  const [appointmentStatusMessage, setAppointmentStatusMessage] = useState("");

  const [showered, setShowered] = useState(false);
  const [showeredTime, setShoweredTime] = useState("");

  const [brushedTeeth, setBrushedTeeth] = useState(false);
  const [brushedTeethTime, setBrushedTeethTime] = useState("");

  const [skincare, setSkincare] = useState(false);
  const [skincareTime, setSkincareTime] = useState("");

  const [laundryDone, setLaundryDone] = useState(false);
  const [laundryTime, setLaundryTime] = useState("");
  const [bedsheetsDone, setBedsheetsDone] = useState(false);
  const [bedsheetsTime, setBedsheetsTime] = useState("");
  const [roomCleaned, setRoomCleaned] = useState(false);
  const [roomCleanedTime, setRoomCleanedTime] = useState("");
  const [cleaningMinutes, setCleaningMinutes] = useState("");
  const [cleaningWorthIt, setCleaningWorthIt] = useState(3);

  const [exerciseDone, setExerciseDone] = useState(false);
  const [exerciseTime, setExerciseTime] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [exerciseFeeling, setExerciseFeeling] = useState("");
  const [extraWalk, setExtraWalk] = useState(false);
  const [afterExerciseState, setAfterExerciseState] = useState("");
  const [exerciseLogs, setExerciseLogs] = useState([]);

  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepRoutine, setSleepRoutine] = useState("");
  const [usedScreensBeforeBed, setUsedScreensBeforeBed] = useState(false);
  const [sleepQuality, setSleepQuality] = useState(3);

  const [mood, setMood] = useState(3);
  const [moodTags, setMoodTags] = useState([]);
  const [focus, setFocus] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [goals, setGoals] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalCategory, setGoalCategory] = useState("Food");
  const [goalCheckType, setGoalCheckType] = useState("daily");
  const [goalTargetAmount, setGoalTargetAmount] = useState("1");
  const [goalStreakLength, setGoalStreakLength] = useState("7");
  const [goalSuggestions, setGoalSuggestions] = useState([]);
  const [rewardPopup, setRewardPopup] = useState(null);

  const [lastAction, setLastAction] = useState("Nothing yet");
  const [historyData, setHistoryData] = useState([]);
  const [chartRange, setChartRange] = useState(7);

  const outsiderPeople = outsiderTrackers;
  const selectedOutsider =
    outsiderPeople.find((person) => person.id === selectedOutsiderId) || outsiderPeople[0];
  const baseTheme = getAppTheme(
    darkMode,
    appExperience === "outsider" ? selectedOutsider?.themeFamily || themeFamily : themeFamily
  );
  const trackerTheme =
    appExperience === "tracker" ? getTrackerExperienceTheme(baseTheme, darkMode) : baseTheme;
  const theme =
    appExperience === "outsider"
      ? getObserverExperienceTheme(baseTheme, darkMode)
      : trackerTheme;
  const moodTagGroups = [
    {
      label: "Positive",
      tags: ["Great", "Balling", "Good", "Happy", "Motivated"],
    },
    {
      label: "Neutral",
      tags: ["Chill", "Mid", "Fine", "Busy"],
    },
    {
      label: "Low",
      tags: ["Tired", "Dead", "Sleepy", "Mopey", "Bad", "Unhappy", "Unmotivated"],
    },
    {
      label: "Intense",
      tags: ["Pissed Off", "Crashing Out", "Tweaking", "Overwhelmed", "Anxious", "Irritable"],
    },
  ];
  const goalCategories = [
    "Meds",
    "Food",
    "Hygiene",
    "Sleep",
    "Cleaning",
    "Exercise",
    "To-Do",
  ];

  function applyIncomingUrl(incomingUrl) {
    if (!incomingUrl || typeof window === "undefined") return;

    let parsedUrl;

    try {
      parsedUrl = new URL(incomingUrl);
    } catch {
      return;
    }

    const nextLocation = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

    if (window.location.pathname + window.location.search + window.location.hash !== nextLocation) {
      window.history.replaceState({}, "", nextLocation);
    }

    const inviteToken = getInviteTokenFromUrl(parsedUrl);

    if (inviteToken) {
      const normalizedInviteLink = buildInviteLink(inviteToken);
      setSelectedExperience("outsider");
      setAppExperience("outsider");
      setOutsiderPage("outsiderOverview");
      setJoinLinkInput(normalizedInviteLink);
      setConnectionsMessage(
        "Invite link detected. Log in or create an outsider account, then tap Request by Link."
      );
    }
  }

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Profile load error:", error);
      return;
    }

    if (data) {
      let fallbackAreas = [];

      if (typeof window !== "undefined") {
        try {
          fallbackAreas = normalizeTrackedAreas(
            JSON.parse(localStorage.getItem(getTrackedAreasStorageKey(userId)) || "[]")
          );
        } catch {
          fallbackAreas = [];
        }
      }
      setDisplayName(data.display_name || "");
      setSecondaryDisplayName(data.secondary_display_name || "");
      setProfilePin(data.pin || "");
      setThemeFamily(data.tracker_theme_family || "galaxy");
      setTrackerDarkMode((data.tracker_mode || "dark") === "dark");
      const normalizedAreas = normalizeTrackedAreas(data.tracked_areas).length
        ? normalizeTrackedAreas(data.tracked_areas)
        : fallbackAreas;
      setTrackedAreas(normalizedAreas);
      setPendingTrackedAreas(normalizedAreas);
      setShowTrackingAreaPicker(normalizedAreas.length === 0);
    }
  }

  async function ensureProfileExists(authUser) {
    if (!authUser) {
      return { ok: false, error: "No authenticated user found." };
    }

    const { data: existingProfile, error: profileLookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileLookupError) {
      console.error("Profile lookup error:", profileLookupError);
      return { ok: false, error: "Could not check your profile yet." };
    }

    if (existingProfile) {
      localStorage.removeItem(PENDING_SIGNUP_PROFILE_KEY);
      return { ok: true, created: false };
    }

    let pendingProfile = null;

    try {
      pendingProfile = JSON.parse(localStorage.getItem(PENDING_SIGNUP_PROFILE_KEY) || "null");
    } catch {
      pendingProfile = null;
    }

    const profilePayload = {
      id: authUser.id,
      email: authUser.email,
      display_name:
        pendingProfile?.email === authUser.email
          ? pendingProfile.display_name
          : authUser.user_metadata?.display_name || "Stargazer",
      secondary_display_name:
        pendingProfile?.email === authUser.email
          ? pendingProfile.secondary_display_name || null
          : authUser.user_metadata?.secondary_display_name || null,
      tracker_theme_family:
        pendingProfile?.email === authUser.email
          ? pendingProfile.tracker_theme_family || "galaxy"
          : authUser.user_metadata?.tracker_theme_family || "galaxy",
      tracker_mode:
        pendingProfile?.email === authUser.email
          ? pendingProfile.tracker_mode || "dark"
          : authUser.user_metadata?.tracker_mode || "dark",
      pin:
        pendingProfile?.email === authUser.email
          ? pendingProfile.pin || "0000"
          : "0000",
      updated_at: new Date().toISOString(),
    };

    const { error: profileCreateError } = await supabase.from("profiles").upsert(profilePayload);

    if (profileCreateError) {
      console.error("Profile create error:", profileCreateError);
      return { ok: false, error: "Your account signed in, but profile setup needs another try." };
    }

    localStorage.removeItem(PENDING_SIGNUP_PROFILE_KEY);
    return { ok: true, created: true };
  }

  async function saveProfileSettings() {
    if (!user) return;

    if (!displayName.trim()) {
      setSettingsMessage("Display name is required.");
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      display_name: displayName.trim(),
      secondary_display_name: secondaryDisplayName.trim() || null,
      tracker_theme_family: themeFamily,
      tracker_mode: trackerDarkMode ? "dark" : "light",
      pin: profilePin,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload);

    if (error) {
      setSettingsMessage(error.message);
      return;
    }

    setSettingsMessage("Settings saved.");
  }

  async function saveTrackedAreas(nextAreas, successMessage) {
    if (!user) return false;

    const normalizedAreas = normalizeTrackedAreas(nextAreas);

    if (normalizedAreas.length === 0) {
      setTrackingAreasMessage("Choose at least one area to keep tracking simple but useful.");
      return false;
    }

    const payload = {
      id: user.id,
      email: user.email,
      display_name: displayName.trim() || "Stargazer",
      secondary_display_name: secondaryDisplayName.trim() || null,
      tracker_theme_family: themeFamily,
      tracker_mode: trackerDarkMode ? "dark" : "light",
      tracked_areas: normalizedAreas,
      pin: profilePin || "0000",
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("profiles").upsert(payload);

    if (error) {
      if (isTrackedAreasColumnError(error) && typeof window !== "undefined") {
        localStorage.setItem(getTrackedAreasStorageKey(user.id), JSON.stringify(normalizedAreas));
        setTrackedAreas(normalizedAreas);
        setPendingTrackedAreas(normalizedAreas);
        setTrackingAreasMessage(
          `${successMessage} This is saved locally on this device until the database migration is applied.`
        );
        return true;
      }

      console.error("Tracked areas save error:", error);
      setTrackingAreasMessage("Could not save your tracking areas yet.");
      return false;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(getTrackedAreasStorageKey(user.id), JSON.stringify(normalizedAreas));
    }
    setTrackedAreas(normalizedAreas);
    setPendingTrackedAreas(normalizedAreas);
    setTrackingAreasMessage(successMessage);
    return true;
  }

  function togglePendingTrackedArea(areaId) {
    setTrackingAreasMessage("");
    setPendingTrackedAreas((current) =>
      current.includes(areaId)
        ? current.filter((item) => item !== areaId)
        : [...current, areaId]
    );
  }

  async function completeTrackingAreaSetup() {
    const didSave = await saveTrackedAreas(
      pendingTrackedAreas,
      "Tracking areas saved. You can add more later from Settings."
    );

    if (!didSave) return;

    setShowTrackingAreaPicker(false);
  }

  async function addTrackedArea() {
    if (!trackingAreaToAdd) {
      setTrackingAreasMessage("Choose an area from the dropdown first.");
      return;
    }

    const didSave = await saveTrackedAreas(
      [...trackedAreas, trackingAreaToAdd],
      `${getTrackingAreaOption(trackingAreaToAdd)?.label || "Area"} added to your tracker.`
    );

    if (!didSave) return;

    setTrackingAreaToAdd("");
    setShowAddTrackingAreaPicker(false);
  }

  function startTrackerTutorial(startIndex = 0) {
    const boundedIndex = Math.min(
      Math.max(startIndex, 0),
      Math.max(trackerTutorialSteps.length - 1, 0)
    );
    const nextStep = trackerTutorialSteps[boundedIndex];

    setTrackerTutorialStepIndex(boundedIndex);
    setShowTrackerTutorial(true);
    setShowOutsiderTutorial(false);
    setAppExperience("tracker");

    if (nextStep?.pageKey) {
      setActivePage(nextStep.pageKey);
    }

    scrollTutorialStepIntoView(nextStep);
  }

  function closeTrackerTutorial(markSeen = true) {
    setShowTrackerTutorial(false);

    if (markSeen && user && typeof window !== "undefined") {
      localStorage.setItem(getTrackerTutorialSeenKey(user.id), "true");
    }
  }

  function goToTrackerTutorialStep(stepIndex) {
    const boundedIndex = Math.min(
      Math.max(stepIndex, 0),
      Math.max(trackerTutorialSteps.length - 1, 0)
    );
    const nextStep = trackerTutorialSteps[boundedIndex];

    setTrackerTutorialStepIndex(boundedIndex);

    if (nextStep?.pageKey) {
      setActivePage(nextStep.pageKey);
    }

    scrollTutorialStepIntoView(nextStep);
  }

  function goToNextTrackerTutorialStep() {
    if (trackerTutorialStepIndex >= trackerTutorialSteps.length - 1) {
      closeTrackerTutorial(true);
      return;
    }

    goToTrackerTutorialStep(trackerTutorialStepIndex + 1);
  }

  function goToPreviousTrackerTutorialStep() {
    goToTrackerTutorialStep(trackerTutorialStepIndex - 1);
  }

  function startOutsiderTutorial(startIndex = 0) {
    const boundedIndex = Math.min(
      Math.max(startIndex, 0),
      Math.max(outsiderTutorialSteps.length - 1, 0)
    );
    const nextStep = outsiderTutorialSteps[boundedIndex];

    setOutsiderTutorialStepIndex(boundedIndex);
    setShowOutsiderTutorial(true);
    setShowTrackerTutorial(false);
    setAppExperience("outsider");

    if (nextStep?.pageKey) {
      setOutsiderPage(nextStep.pageKey);
    }

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function closeOutsiderTutorial(markSeen = true) {
    setShowOutsiderTutorial(false);

    if (markSeen && user && typeof window !== "undefined") {
      localStorage.setItem(getOutsiderTutorialSeenKey(user.id), "true");
    }
  }

  function goToOutsiderTutorialStep(stepIndex) {
    const boundedIndex = Math.min(
      Math.max(stepIndex, 0),
      Math.max(outsiderTutorialSteps.length - 1, 0)
    );
    const nextStep = outsiderTutorialSteps[boundedIndex];

    setOutsiderTutorialStepIndex(boundedIndex);

    if (nextStep?.pageKey) {
      setOutsiderPage(nextStep.pageKey);
    }

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function goToNextOutsiderTutorialStep() {
    if (outsiderTutorialStepIndex >= outsiderTutorialSteps.length - 1) {
      closeOutsiderTutorial(true);
      return;
    }

    goToOutsiderTutorialStep(outsiderTutorialStepIndex + 1);
  }

  function goToPreviousOutsiderTutorialStep() {
    goToOutsiderTutorialStep(outsiderTutorialStepIndex - 1);
  }

  async function changePin() {
    if (!user) return;

    if (currentPinInput !== profilePin) {
      setSettingsMessage("Current PIN is incorrect.");
      return;
    }

    if (!/^\d{4,8}$/.test(newPinInput)) {
      setSettingsMessage("New PIN must be numbers only and 4 to 8 digits.");
      return;
    }

    if (newPinInput !== confirmNewPinInput) {
      setSettingsMessage("New PIN and confirm PIN must match.");
      return;
    }

    const nextPin = newPinInput;
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        display_name: displayName.trim() || "Stargazer",
        secondary_display_name: secondaryDisplayName.trim() || null,
        tracker_theme_family: themeFamily,
        tracker_mode: trackerDarkMode ? "dark" : "light",
        pin: nextPin,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setSettingsMessage(error.message);
      return;
    }

    setProfilePin(nextPin);
    setCurrentPinInput("");
    setNewPinInput("");
    setConfirmNewPinInput("");
    setSettingsMessage("PIN updated.");
  }

  async function resetPinWithPassword() {
    if (!user?.email) return;

    if (!resetPinPassword) {
      setSettingsMessage("Enter your account password to reset your PIN.");
      return;
    }

    if (!/^\d{4,8}$/.test(resetNewPinInput)) {
      setSettingsMessage("New PIN must be numbers only and 4 to 8 digits.");
      return;
    }

    if (resetNewPinInput !== resetConfirmNewPinInput) {
      setSettingsMessage("New PIN and confirm PIN must match.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: resetPinPassword,
    });

    if (error) {
      console.error("Reset PIN password verification error:", error);
      setSettingsMessage("Password verification failed.");
      return;
    }

    if (!data?.user || data.user.id !== user.id) {
      setSettingsMessage("Password verification failed.");
      return;
    }

    const nextPin = resetNewPinInput;
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      display_name: displayName.trim() || "Stargazer",
      secondary_display_name: secondaryDisplayName.trim() || null,
      tracker_theme_family: themeFamily,
      tracker_mode: trackerDarkMode ? "dark" : "light",
      pin: nextPin,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Reset PIN profile update error:", profileError);
      setSettingsMessage(profileError.message);
      return;
    }

    setProfilePin(nextPin);
    setResetPinPassword("");
    setResetNewPinInput("");
    setResetConfirmNewPinInput("");
    setSettingsMessage("PIN reset successfully.");
  }

  async function handleLogin() {
    setAuthMessage("");

    if (!authEmail || !authPassword) {
      setAuthMessage("Enter your email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    if (data?.user) {
      const profileSync = await ensureProfileExists(data.user);

      if (!profileSync.ok) {
        setAuthMessage(profileSync.error || "Could not finish setting up your profile.");
        return;
      }
    }

    setAppExperience(selectedExperience);
    setAuthPassword("");
    setAuthConfirmPassword("");
  }

  async function handleSignup() {
    setAuthMessage("");

    if (authPassword !== authConfirmPassword) {
      setAuthMessage("Password and confirm password must match.");
      return;
    }

    if (!/^\d{4,8}$/.test(pin)) {
      setAuthMessage("PIN must be numbers only and 4 to 8 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setAuthMessage("PIN and confirm PIN must match.");
      return;
    }

    if (!displayName.trim()) {
      setAuthMessage("Add a display name to continue.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: {
        emailRedirectTo: getPublicAppUrl(),
        data: {
          display_name: displayName.trim(),
          secondary_display_name: secondaryDisplayName.trim(),
          tracker_theme_family: signupThemeFamily,
          tracker_mode: signupMode,
        },
      },
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    localStorage.setItem(
      PENDING_SIGNUP_PROFILE_KEY,
      JSON.stringify({
        email: authEmail,
        display_name: displayName.trim(),
        secondary_display_name: secondaryDisplayName.trim() || null,
        tracker_theme_family: signupThemeFamily,
        tracker_mode: signupMode,
        pin,
      })
    );

    setThemeFamily(signupThemeFamily);
    setTrackerDarkMode(signupMode === "dark");
    setAuthMode("login");
    setSignupStep(1);
    setAuthPassword("");
    setAuthConfirmPassword("");
    setPin("");
    setConfirmPin("");
    setAuthMessage(
      data.session
        ? "Account created. Check your email to confirm it, then log in to finish setting up your profile."
        : "Confirmation email sent. Open the email, tap the link, then come back and log in."
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setAppExperience(selectedExperience);
    setOutsiderPage("outsiderOverview");
    setGoals([]);
    setRewards([]);
  }

  async function loadConnectionsData() {
    if (!user) return;

    setConnectionsLoading(true);

    const [{ data: inviteRow, error: inviteError }, { data: connectionRows, error: connectionError }] =
      await Promise.all([
        supabase
          .from("connection_invites")
          .select("*")
          .eq("tracker_id", user.id)
          .eq("active", true)
          .maybeSingle(),
        supabase
          .from("tracker_connections")
          .select(
            `
              id,
              tracker_id,
              outsider_id,
              status,
              name_visibility,
              notification_cap,
              cooldown_minutes,
              permissions,
              created_at,
              approved_at
            `
          )
          .eq("tracker_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

    if (inviteError) {
      console.error("Invite load error:", inviteError);
      setConnectionsMessage("Could not load invite details.");
    } else {
      setInviteCode(inviteRow?.invite_code || "");
      setInviteLink(
        inviteRow?.invite_token
          ? buildInviteLink(inviteRow.invite_token)
          : ""
      );
    }

    if (connectionError) {
      console.error("Connections load error:", connectionError);
      setConnectionsMessage("Could not load connections.");
    } else {
      const rows = connectionRows || [];
      const isApprovedConnection = (row) =>
        String(row.status || "").toLowerCase() === "approved" || Boolean(row.approved_at);
      const isPendingConnection = (row) => {
        const normalizedStatus = String(row.status || "").toLowerCase();
        return !isApprovedConnection(row) && normalizedStatus !== "rejected" && normalizedStatus !== "revoked";
      };
      const outsiderIds = [...new Set(rows.map((row) => row.outsider_id).filter(Boolean))];
      let outsiderProfilesById = new Map();

      if (outsiderIds.length > 0) {
        const { data: outsiderProfiles, error: outsiderProfilesError } = await supabase
          .from("profiles")
          .select("id, display_name, secondary_display_name, email")
          .in("id", outsiderIds);

        if (outsiderProfilesError) {
          console.error("Outsider profile load error:", outsiderProfilesError);
        } else {
          outsiderProfilesById = new Map(
            (outsiderProfiles || []).map((profile) => [profile.id, profile])
          );
        }
      }

      setPendingRequests(
        rows
          .filter(isPendingConnection)
          .map((row) => ({
            id: row.id,
            outsiderId: row.outsider_id,
            name:
              outsiderProfilesById.get(row.outsider_id)?.display_name ||
              outsiderProfilesById.get(row.outsider_id)?.secondary_display_name ||
              "Pending outsider",
            note: row.created_at
              ? `Requested connection on ${new Date(row.created_at).toLocaleDateString()}`
              : "Pending approval",
          }))
      );
      setConnectedOutsiders(
        rows
          .filter(isApprovedConnection)
          .map((row) => ({
            id: row.id,
            outsiderId: row.outsider_id,
            name:
              outsiderProfilesById.get(row.outsider_id)?.display_name ||
              outsiderProfilesById.get(row.outsider_id)?.secondary_display_name ||
              "Connected outsider",
            nameVisibility: row.name_visibility || "display",
            notificationCap: String(row.notification_cap ?? 3),
            cooldownLength: String(row.cooldown_minutes ?? 15),
            permissions: normalizeConnectionPermissions(row.permissions),
          }))
      );
    }

    setConnectionsLoading(false);
  }

  async function loadOutsiderTrackers() {
    if (!user) return;

    setOutsiderLoading(true);

    const { data, error } = await supabase
      .from("tracker_connections")
      .select(
        `
          id,
          tracker_id,
          name_visibility,
          notification_cap,
          cooldown_minutes,
          permissions,
          tracker:tracker_id (
            id,
            display_name,
            secondary_display_name,
            tracker_theme_family
          )
        `
      )
      .eq("outsider_id", user.id)
      .eq("status", "approved")
      .order("approved_at", { ascending: false });

    if (error) {
      console.error("Outsider tracker load error:", error);
      setOutsiderTrackers([]);
      setOutsiderLoading(false);
      return;
    }

    const trackerIds = (data || []).map((row) => row.tracker_id).filter(Boolean);
    let entryRows = [];

    if (trackerIds.length > 0) {
      const { data: outsiderEntries, error: outsiderEntriesError } = await supabase
        .from("daily_entries")
        .select(
          `
            user_id,
            entry_date,
            meds_taken,
            meds,
            meals,
            todo_items,
            showered,
            brushed_teeth,
            skincare,
            bed_time,
            wake_time,
            sleep_quality,
            exercise_done,
            exercise_logs,
            mood,
            focus,
            energy,
            goals,
            rewards
          `
        )
        .in("user_id", trackerIds)
        .order("entry_date", { ascending: false });

      if (outsiderEntriesError) {
        console.error("Outsider tracker entries load error:", outsiderEntriesError);
      } else {
        entryRows = outsiderEntries || [];
      }
    }

    const trackerEntriesMap = trackerIds.reduce((accumulator, trackerId) => {
      const dedupedEntries = getLatestEntriesByDate(
        entryRows.filter((row) => row.user_id === trackerId)
      );

      accumulator[trackerId] = dedupedEntries.slice(-14).reverse();
      return accumulator;
    }, {});

    const mappedTrackers = (data || []).map((row) => {
      const visibleName =
        row.name_visibility === "secondary"
          ? row.tracker?.secondary_display_name || row.tracker?.display_name || "Connected tracker"
          : row.tracker?.display_name || row.tracker?.secondary_display_name || "Connected tracker";

      const trackerThemeFamily = row.tracker?.tracker_theme_family || "galaxy";
      const trackerHistory = trackerEntriesMap[row.tracker_id] || [];
      const latestEntry = trackerHistory[0] || null;
      const hygieneCount =
        (latestEntry?.showered ? 1 : 0) +
        (latestEntry?.brushed_teeth ? 1 : 0) +
        (latestEntry?.skincare ? 1 : 0);
      const mealsCount = Array.isArray(latestEntry?.meals) ? latestEntry.meals.length : 0;
      const medsCount = Array.isArray(latestEntry?.meds) ? latestEntry.meds.length : 0;
      const exerciseCount = Array.isArray(latestEntry?.exercise_logs)
        ? latestEntry.exercise_logs.length
        : latestEntry?.exercise_done
        ? 1
        : 0;
      const trackerGoals = Array.isArray(latestEntry?.goals) ? latestEntry.goals : [];
      const trackerRewards = Array.isArray(latestEntry?.rewards) ? latestEntry.rewards : [];
      const activeGoals = trackerGoals.filter((goal) => !goal.completed).slice(0, 3);
      const completedGoals = trackerGoals.filter((goal) => goal.completed).slice(0, 3);
      const goalSummary =
        activeGoals.length > 0
          ? activeGoals.map((goal) => ({
              label: goal.name,
              summary: `${goal.currentStreakProgress}/${goal.streakLength} ${goal.checkType === "weekly" ? "weeks" : "days"}`,
            }))
          : [
              {
                label: "Connection status",
                summary: "Approved and active",
              },
            ];
      const recentMeals = trackerHistory.reduce(
        (count, entry) => count + (Array.isArray(entry.meals) ? entry.meals.length : 0),
        0
      );
      const recentExercise = trackerHistory.reduce(
        (count, entry) =>
          count +
          (Array.isArray(entry.exercise_logs)
            ? entry.exercise_logs.length
            : entry.exercise_done
            ? 1
            : 0),
        0
      );
      const recentMoodAverage =
        trackerHistory.filter((entry) => typeof entry.mood === "number").length > 0
          ? (
              trackerHistory
                .filter((entry) => typeof entry.mood === "number")
                .reduce((sum, entry) => sum + Number(entry.mood), 0) /
              trackerHistory.filter((entry) => typeof entry.mood === "number").length
            ).toFixed(1)
          : null;
      const statusText =
        latestEntry && (mealsCount > 0 || medsCount > 0 || exerciseCount > 0 || hygieneCount > 0)
          ? "All systems stable"
          : "Attention needed";
      const comparisonStats = [
        { label: "Meals / 14d", value: recentMeals },
        { label: "Movement / 14d", value: recentExercise },
        { label: "Mood avg", value: recentMoodAverage || "N/A" },
      ];

      return {
        id: row.id,
        trackerId: row.tracker_id,
        name: visibleName,
        themeFamily: trackerThemeFamily,
        status: statusText,
        moodScore: Number(latestEntry?.mood ?? 3),
        systems: [
          {
            label: "meds",
            value: latestEntry?.meds_taken || medsCount > 0 ? "logged" : "open",
            note: latestEntry ? `${medsCount} entries in latest check-in` : "No tracker data shared yet",
          },
          {
            label: "food",
            value: mealsCount > 0 ? "steady" : "open",
            note: latestEntry ? `${mealsCount} meals in latest check-in` : "No tracker data shared yet",
          },
          {
            label: "hygiene",
            value: hygieneCount > 0 ? "tracked" : "open",
            note: latestEntry ? `${hygieneCount}/3 hygiene habits logged` : "No tracker data shared yet",
          },
          {
            label: "sleep",
            value: latestEntry?.bed_time || latestEntry?.wake_time ? "logged" : "open",
            note:
              latestEntry?.sleep_quality != null
                ? `Sleep quality ${latestEntry.sleep_quality}/5`
                : "No sleep check recorded yet",
          },
          {
            label: "exercise",
            value: exerciseCount > 0 ? "moving" : "open",
            note: latestEntry ? `${exerciseCount} movement logs in latest check-in` : "No tracker data shared yet",
          },
        ],
        alignments: [
          ...goalSummary,
          {
            label: "Support settings",
            summary: `${row.notification_cap ?? 3} reminders, ${row.cooldown_minutes ?? 15} minute cooldown`,
          },
        ],
        activity: [
          latestEntry ? `Latest check-in: ${latestEntry.entry_date}` : "No shared tracker check-ins yet",
          latestEntry?.mood ? `Mood logged at ${latestEntry.mood}/5` : "Mood not shared in the latest check-in",
          mealsCount > 0 ? `${mealsCount} meals logged in the latest check-in` : "No meals logged in the latest check-in",
        ],
        rewards:
          trackerRewards.length > 0
            ? trackerRewards.slice(0, 3).map((reward) => reward.title || reward.rewardType || "Reward earned")
            : ["No shared rewards yet"],
        history: trackerHistory,
        latestEntry,
        activeGoals,
        completedGoals,
        comparisonStats,
        permissions: normalizeConnectionPermissions(row.permissions),
      };
    });

    setOutsiderTrackers(mappedTrackers);

    if (mappedTrackers.length > 0) {
      setSelectedOutsiderId((currentId) =>
        mappedTrackers.some((person) => person.id === currentId) ? currentId : mappedTrackers[0].id
      );
    } else {
      setSelectedOutsiderId("");
      setShowOutsiderChooser(false);
    }

    setOutsiderLoading(false);
  }

  async function loadSupportInbox() {
    if (!user) return;

    setSupportInboxLoading(true);

    const { data, error } = await supabase
      .from("support_messages")
      .select("id, outsider_name, message, created_at, read_at")
      .eq("tracker_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Support inbox load error:", error);
      setSupportInboxMessage("Could not load support messages.");
      setSupportInboxLoading(false);
      return;
    }

    setSupportInbox(
      (data || []).map((item) => ({
        id: item.id,
        outsiderName: item.outsider_name || "Connected outsider",
        message: item.message,
        createdAt: item.created_at,
        createdAtLabel: new Date(item.created_at).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        readAt: item.read_at || null,
      }))
    );
    setSupportInboxMessage("");
    setSupportInboxLoading(false);
  }

  async function markSupportMessageRead(messageId) {
    if (!user) return;

    const { error } = await supabase
      .from("support_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId)
      .eq("tracker_id", user.id);

    if (error) {
      console.error("Support inbox read error:", error);
      setSupportInboxMessage("Could not mark that message as read.");
      return;
    }

    setSupportInbox((current) =>
      current.map((item) =>
        item.id === messageId
          ? {
              ...item,
              readAt: new Date().toISOString(),
            }
          : item
      )
    );
    setSupportInboxMessage("Message marked as read.");
  }

  async function sendSupportMessage(message) {
    if (!user || !selectedOutsider) return;

    const outsiderName =
      displayName.trim() || secondaryDisplayName.trim() || "Connected outsider";
    const { data, error } = await supabase
      .from("support_messages")
      .insert({
        connection_id: selectedOutsider.id,
        tracker_id: selectedOutsider.trackerId,
        outsider_id: user.id,
        outsider_name: outsiderName,
        message,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Support message send error:", error);
      setOutsiderMessage("Could not send support message.");
      return;
    }

    if (data?.id) {
      const { error: pushError } = await supabase.functions.invoke(
        "send-support-message-push",
        {
          body: {
            supportMessageId: data.id,
          },
        }
      );

      if (pushError) {
        console.error("Support push trigger error:", pushError);
      }
    }

    setOutsiderMessage(message);
    const nextTime = new Date();
    nextTime.setMinutes(nextTime.getMinutes() + 15);
    setOutsiderCooldownUntil(
      nextTime.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  }

  async function generateInviteCode() {
    if (!user) return;

    const code = makeConnectionCode();
    const token = makeConnectionToken();
    const { error } = await supabase.from("connection_invites").upsert({
      tracker_id: user.id,
      invite_code: code,
      invite_token: token,
      active: true,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Invite code error:", error);
      setConnectionsMessage("Could not generate invite code.");
      return;
    }

    setInviteCode(code);
    setInviteLink(buildInviteLink(token));
    setConnectionsMessage("Invite code generated.");
  }

  async function generateInviteLink() {
    if (!user) return;

    const code = inviteCode || makeConnectionCode();
    const token = makeConnectionToken();
    const { error } = await supabase.from("connection_invites").upsert({
      tracker_id: user.id,
      invite_code: code,
      invite_token: token,
      active: true,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Invite link error:", error);
      setConnectionsMessage("Could not generate invite link.");
      return;
    }

    setInviteCode(code);
    setInviteLink(buildInviteLink(token));
    setConnectionsMessage("Invite link generated.");
  }

  async function createPendingConnectionFromInvite(invite, sourceLabel) {
    if (!user) return;

    if (!invite) {
      setConnectionsMessage(`That ${sourceLabel} could not be found.`);
      return;
    }

    console.log(`Invite lookup result for ${sourceLabel}:`, invite);

    if (invite.tracker_id === user.id) {
      setConnectionsMessage("You cannot connect to yourself.");
      return;
    }

    const { data: existingConnection, error: existingError } = await supabase
      .from("tracker_connections")
      .select("*")
      .eq("tracker_id", invite.tracker_id)
      .eq("outsider_id", user.id)
      .maybeSingle();

    if (existingError) {
      console.error(`Connection lookup error for ${sourceLabel}:`, existingError);
      setConnectionsMessage(`Could not process that ${sourceLabel}.`);
      return;
    }

    if (existingConnection?.status === "pending") {
      console.log(`Existing pending connection found for ${sourceLabel}:`, existingConnection);
      setConnectionsMessage("A pending request already exists.");
      await loadConnectionsData();
      return;
    }

    if (existingConnection?.status === "approved") {
      console.log(`Existing approved connection found for ${sourceLabel}:`, existingConnection);
      setConnectionsMessage("You are already connected.");
      await loadConnectionsData();
      return;
    }

    if (existingConnection) {
      const { data: revivedConnection, error: reviveError } = await supabase
        .from("tracker_connections")
        .update({
          status: "pending",
          approved_at: null,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .maybeSingle()
        .eq("id", existingConnection.id);

      if (reviveError) {
        console.error(`Connection revive error for ${sourceLabel}:`, reviveError);
        setConnectionsMessage("Could not send join request.");
        return;
      }

      if (!revivedConnection?.id) {
        console.error(`Connection revive affected no rows for ${sourceLabel}.`, existingConnection);
        setConnectionsMessage("Could not send join request.");
        return;
      }

      console.log(`Connection revived for ${sourceLabel}:`, existingConnection.id);
      setConnectionsMessage(`Join request sent for ${sourceLabel}.`);
      setJoinCodeInput("");
      setJoinLinkInput("");
      await loadConnectionsData();
      return;
    }

    const { error: insertError } = await supabase.from("tracker_connections").insert({
      tracker_id: invite.tracker_id,
      outsider_id: user.id,
      status: "pending",
      approved_at: null,
      created_at: new Date().toISOString(),
      name_visibility: "display",
      notification_cap: 3,
      cooldown_minutes: 15,
      permissions: DEFAULT_CONNECTION_PERMISSIONS,
    });

    if (insertError) {
      console.error(`Connection insert error for ${sourceLabel}:`, insertError);
      setConnectionsMessage("Could not send join request.");
      return;
    }

    console.log(`Connection insert result for ${sourceLabel}: success`);
    setConnectionsMessage(`Join request sent for ${sourceLabel}.`);
    setJoinCodeInput("");
    setJoinLinkInput("");
    await loadConnectionsData();
  }

  function requestApproval(requestId) {
    setPinApprovalTarget(requestId);
    setApprovalPinInput("");
    setConnectionsMessage("");
  }

  async function confirmApproveRequest() {
    if (approvalPinInput !== profilePin) {
      setConnectionsMessage("PIN confirmation failed.");
      return;
    }

    const approvedRequest = pendingRequests.find((request) => request.id === pinApprovalTarget);

    if (!approvedRequest) {
      setPinApprovalTarget(null);
      return;
    }

    const { error } = await supabase
      .from("tracker_connections")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", pinApprovalTarget)
      .eq("tracker_id", user.id);

    if (error) {
      console.error("Approve error:", error);
      setConnectionsMessage("Could not approve request.");
      return;
    }

    setPinApprovalTarget(null);
    setApprovalPinInput("");
    setConnectionsMessage(`${approvedRequest.name} approved.`);
    await loadConnectionsData();
  }

  async function rejectRequest(requestId) {
    const rejected = pendingRequests.find((request) => request.id === requestId);
    const { error } = await supabase
      .from("tracker_connections")
      .update({
        status: "rejected",
      })
      .eq("id", requestId)
      .eq("tracker_id", user.id);

    if (error) {
      console.error("Reject error:", error);
      setConnectionsMessage("Could not reject request.");
      return;
    }

    setConnectionsMessage(rejected ? `${rejected.name} rejected.` : "Request rejected.");
    await loadConnectionsData();
  }

  async function revokeOutsider(connectionId) {
    const outsider = connectedOutsiders.find((person) => person.id === connectionId);
    const { error } = await supabase
      .from("tracker_connections")
      .update({
        status: "revoked",
      })
      .eq("id", connectionId)
      .eq("tracker_id", user.id);

    if (error) {
      console.error("Revoke error:", error);
      setConnectionsMessage("Could not remove connection.");
      return;
    }

    setConnectionsMessage(outsider ? `${outsider.name} removed.` : "Connection removed.");
    await loadConnectionsData();
  }

  async function updateOutsiderSetting(connectionId, field, value) {
    const mappedField =
      field === "cooldownLength"
        ? "cooldown_minutes"
        : field === "notificationCap"
        ? "notification_cap"
        : "name_visibility";

    const nextValue =
      mappedField === "notification_cap" || mappedField === "cooldown_minutes"
        ? Number(value)
        : value;

    const { error } = await supabase
      .from("tracker_connections")
      .update({
        [mappedField]: nextValue,
      })
      .eq("id", connectionId)
      .eq("tracker_id", user.id);

    if (error) {
      console.error("Connection setting error:", error);
      setConnectionsMessage("Could not save connection settings.");
      return;
    }

    setConnectedOutsiders((current) =>
      current.map((person) =>
        person.id === connectionId
          ? {
              ...person,
              [field]: value,
            }
          : person
      )
    );
  }

  async function upsertPushDevice(pushTokenValue) {
    if (!user || !pushTokenValue) return;

    const { error } = await supabase.from("push_notification_devices").upsert(
      {
        user_id: user.id,
        token: pushTokenValue,
        platform: Capacitor.getPlatform(),
        app_id: "app.guidetothegalaxies",
        environment: getNativePushEnvironment(),
        enabled: true,
        last_registered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,token",
      }
    );

    if (error) {
      console.error("Push token sync error:", error);
      setPushStatusMessage("Push permission is on, but token sync failed.");
      return;
    }

    setPushStatusMessage("Native push notifications are ready on this device.");
  }

  async function removePushDevice(pushTokenValue) {
    if (!user || !pushTokenValue) return;

    const { error } = await supabase
      .from("push_notification_devices")
      .delete()
      .eq("user_id", user.id)
      .eq("token", pushTokenValue);

    if (error) {
      console.error("Push token delete error:", error);
    }
  }

  async function enableNativePushNotifications() {
    if (!user || !Capacitor.isNativePlatform()) {
      setPushStatusMessage("Native push is only available inside the Android or iPhone app shell.");
      return;
    }

    localStorage.removeItem(getNativePushOptOutKey(user.id));
    setPushOptedOutLocally(false);
    setPushSyncing(true);
    setPushStatusMessage("Requesting native push permission...");

    try {
      if (pushRegistrationHandle) {
        await pushRegistrationHandle();
      }

      const registrationResult = await registerForNativePush({
        onToken: async (registeredToken) => {
          setPushToken(registeredToken);
          await upsertPushDevice(registeredToken);
          setPushSyncing(false);
        },
        onRegistrationError: async (error) => {
          console.error("Push registration error:", error);
          setPushStatusMessage("Could not register this device for native push.");
          setPushSyncing(false);
        },
        onNotificationReceived: async (notification) => {
          if (notification?.data?.targetPage === NATIVE_PUSH_TARGET_PAGE) {
            await loadSupportInbox();
          }
        },
        onNotificationActionPerformed: async (notification) => {
          if (notification?.notification?.data?.targetPage === NATIVE_PUSH_TARGET_PAGE) {
            setAppExperience("tracker");
            setActivePage("support");
            await loadSupportInbox();
          }
        },
      });

      setPushRegistrationHandle(() => registrationResult.cleanup);
      setPushNotificationsSupported(registrationResult.supported);
      setPushPermissionStatus(registrationResult.permission);

      if (!registrationResult.supported) {
        setPushStatusMessage("Native push is only available inside the Android or iPhone app shell.");
        setPushSyncing(false);
        return;
      }

      if (registrationResult.permission !== "granted") {
        setPushStatusMessage("Push permission was not granted on this device.");
        setPushSyncing(false);
      }
    } catch (error) {
      console.error("Push enable error:", error);
      setPushStatusMessage("Could not turn on native push for this device.");
      setPushSyncing(false);
    }
  }

  async function disableNativePushNotifications() {
    if (!Capacitor.isNativePlatform()) {
      setPushStatusMessage("Native push is only available inside the Android or iPhone app shell.");
      return;
    }

    setPushSyncing(true);

    try {
      if (pushRegistrationHandle) {
        await pushRegistrationHandle();
        setPushRegistrationHandle(null);
      }

      await unregisterFromNativePush();
      await removePushDevice(pushToken);
      localStorage.setItem(getNativePushOptOutKey(user.id), "true");
      setPushOptedOutLocally(true);
      setPushToken("");
      setPushPermissionStatus("disabled");
      setPushStatusMessage("Native push notifications were turned off for this device.");
    } catch (error) {
      console.error("Push unregister error:", error);
      setPushStatusMessage("Could not turn off native push on this device.");
    } finally {
      setPushSyncing(false);
    }
  }

  async function updateOutsiderPermission(connectionId, permissionKey, enabled) {
    const connection = connectedOutsiders.find((person) => person.id === connectionId);
    const nextPermissions = normalizeConnectionPermissions({
      ...(connection?.permissions || {}),
      [permissionKey]: enabled,
    });

    const { error } = await supabase
      .from("tracker_connections")
      .update({
        permissions: nextPermissions,
      })
      .eq("id", connectionId)
      .eq("tracker_id", user.id);

    if (error) {
      console.error("Connection permission error:", error);
      setConnectionsMessage("Could not save permissions.");
      return;
    }

    setConnectedOutsiders((current) =>
      current.map((person) =>
        person.id === connectionId
          ? {
              ...person,
              permissions: nextPermissions,
            }
          : person
      )
    );
    setConnectionsMessage("Permissions saved.");
  }

  async function joinByCode() {
    if (!user) return;

    if (!joinCodeInput.trim()) {
      setConnectionsMessage("Enter a code to continue.");
      return;
    }

    const normalizedCode = joinCodeInput.trim().toUpperCase();
    const { data: invite, error: inviteError } = await supabase
      .from("connection_invites")
      .select("*")
      .eq("invite_code", normalizedCode)
      .eq("active", true)
      .maybeSingle();

    if (inviteError) {
      console.error("Join by code invite lookup error:", inviteError);
      setConnectionsMessage("Could not look up that invite code.");
      return;
    }

    console.log("Join by code invite lookup result:", invite);

    if (!invite) {
      setConnectionsMessage("Invite code not found.");
      return;
    }

    await createPendingConnectionFromInvite(invite, `code ${normalizedCode}`);
  }

  async function joinByLink() {
    if (!user) return;

    if (!joinLinkInput.trim()) {
      setConnectionsMessage("Paste a link to continue.");
      return;
    }

    let inviteToken = joinLinkInput.trim();

    try {
      const parsedUrl = new URL(joinLinkInput.trim());
      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      inviteToken = segments[segments.length - 1] || joinLinkInput.trim();
    } catch {
      const tokenMatch = joinLinkInput.trim().match(/connect\/([a-zA-Z0-9]+)/);
      inviteToken = tokenMatch ? tokenMatch[1] : joinLinkInput.trim();
    }

    const { data: invite, error: inviteError } = await supabase
      .from("connection_invites")
      .select("*")
      .eq("invite_token", inviteToken)
      .eq("active", true)
      .maybeSingle();

    if (inviteError) {
      console.error("Join by link invite lookup error:", inviteError);
      setConnectionsMessage("Could not look up that invite link.");
      return;
    }

    console.log("Join by link invite lookup result:", invite);

    if (!invite) {
      setConnectionsMessage("Invite link not found.");
      return;
    }

    await createPendingConnectionFromInvite(invite, "invite link");
  }

  function applyEntryRow(row) {
    setEntryId(row.id);
    setMedTaken(row.meds_taken ?? false);
    setMedsTime(row.meds_time ?? "");
    setMeds(Array.isArray(row.meds) ? row.meds : []);
    setMeals(Array.isArray(row.meals) ? normalizeMeals(row.meals) : []);
    setTodoItems(normalizeTodoItems(row.todo_items));
    setShowered(row.showered ?? false);
    setShoweredTime(row.showered_time ?? "");
    setBrushedTeeth(row.brushed_teeth ?? false);
    setBrushedTeethTime(row.brushed_teeth_time ?? "");
    setSkincare(row.skincare ?? false);
    setSkincareTime(row.skincare_time ?? "");
    setLaundryDone(row.laundry_done ?? false);
    setLaundryTime(row.laundry_time ?? "");
    setBedsheetsDone(row.bedsheets_done ?? false);
    setBedsheetsTime(row.bedsheets_time ?? "");
    setRoomCleaned(row.room_cleaned ?? false);
    setRoomCleanedTime(row.room_cleaned_time ?? "");
    setCleaningMinutes(row.cleaning_minutes ?? "");
    setCleaningWorthIt(row.cleaning_worth_it ?? 3);
    setExerciseDone(row.exercise_done ?? false);
    setExerciseTime(row.exercise_time ?? "");
    setExerciseType(row.exercise_type ?? "");
    setExerciseMinutes(row.exercise_minutes ?? "");
    setExerciseFeeling(row.exercise_feeling ?? "");
    setExtraWalk(row.extra_walk ?? false);
    setAfterExerciseState(row.after_exercise_state ?? "");
    setExerciseLogs(Array.isArray(row.exercise_logs) ? row.exercise_logs : []);
    setBedTime(row.bed_time ?? "");
    setWakeTime(row.wake_time ?? "");
    setSleepRoutine(row.sleep_routine ?? "");
    setUsedScreensBeforeBed(row.used_screens_before_bed ?? false);
    setSleepQuality(row.sleep_quality ?? 3);
    setMood(row.mood ?? 3);
    setMoodTags(Array.isArray(row.mood_tags) ? row.mood_tags : []);
    setFocus(row.focus ?? 3);
    setEnergy(row.energy ?? 3);
    setTodoText("");
    setTodoDueDate("");
    setTodoNote("");
    setAppointmentStatusMessage("");
  }

  async function loadEntry() {
    if (!user) return;

    const { data, error } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Load error:", error);
      setStatus("Error loading");
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      const row = data[0];

      applyEntryRow(row);
      setStatus("");
      await loadGoalCollections(row);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("daily_entries")
        .upsert([{ entry_date: today, user_id: user.id }], {
          onConflict: "user_id,entry_date",
        })
        .select()
        .single();

      if (insertError) {
        const { data: retryData, error: retryError } = await supabase
          .from("daily_entries")
          .select("*")
          .eq("user_id", user.id)
          .eq("entry_date", today)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .limit(1);

        if (!retryError && retryData && retryData.length > 0) {
          applyEntryRow(retryData[0]);
          setStatus("");
          await loadGoalCollections(retryData[0]);
        } else {
          console.error("Insert error:", insertError);
          if (retryError) {
            console.error("Retry load error:", retryError);
          }
          setStatus("Error loading today");
        }
      } else {
        applyEntryRow(inserted);
        setStatus("");
        await loadGoalCollections(inserted);
      }
    }

    setLoading(false);
  }

  async function loadGoalCollections(currentRow) {
    const hasCurrentGoals = Array.isArray(currentRow?.goals) && currentRow.goals.length > 0;
    const hasCurrentRewards = Array.isArray(currentRow?.rewards) && currentRow.rewards.length > 0;

    if (hasCurrentGoals || hasCurrentRewards) {
      setGoals(hasCurrentGoals ? currentRow.goals : []);
      setRewards(hasCurrentRewards ? currentRow.rewards : []);
      return;
    }

    const { data, error } = await supabase
      .from("daily_entries")
      .select("goals,rewards,entry_date")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .limit(60);

    if (error) {
      console.error("Goal load error:", error);
      return;
    }

    const latestWithGoals = (data || []).find(
      (row) => Array.isArray(row.goals) && row.goals.length > 0
    );
    const latestWithRewards = (data || []).find(
      (row) => Array.isArray(row.rewards) && row.rewards.length > 0
    );

    setGoals(latestWithGoals?.goals || []);
    setRewards(latestWithRewards?.rewards || []);
  }

  async function loadHistory() {
    if (!user) return;

    const { data, error } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("History load error:", error);
      return;
    }

    setHistoryData(getLatestEntriesByDate(data || []));
  }

  async function loadPeriodCycles() {
    if (!user) return;

    const { data, error } = await supabase
      .from("period_cycles")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Period cycle load error:", error);
      setPeriodStatusMessage("Could not load period history.");
      return;
    }

    setPeriodCycles(normalizePeriodCycles(data || []));
  }

  async function loadAppointments() {
    if (!user) return;

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Appointment load error:", error);
      setAppointmentStatusMessage("Could not load appointments.");
      return;
    }

    setAppointments(normalizeAppointments(data || []));
  }

  async function saveEntry(updated = {}) {
    if (!entryId || !user) return;

    const nextEntry = {
      meds_taken: medTaken,
      meds_time: medsTime,
      meds,
      meals,
      todo_items: todoItems,
      showered,
      showered_time: showeredTime,
      brushed_teeth: brushedTeeth,
      brushed_teeth_time: brushedTeethTime,
      skincare,
      skincare_time: skincareTime,
      laundry_done: laundryDone,
      laundry_time: laundryTime,
      bedsheets_done: bedsheetsDone,
      bedsheets_time: bedsheetsTime,
      room_cleaned: roomCleaned,
      room_cleaned_time: roomCleanedTime,
      cleaning_minutes: cleaningMinutes,
      cleaning_worth_it: cleaningWorthIt,
      exercise_done: exerciseDone,
      exercise_time: exerciseTime,
      exercise_type: exerciseType,
      exercise_minutes: exerciseMinutes,
      exercise_feeling: exerciseFeeling,
      extra_walk: extraWalk,
      after_exercise_state: afterExerciseState,
      exercise_logs: exerciseLogs,
      bed_time: bedTime,
      wake_time: wakeTime,
      sleep_routine: sleepRoutine,
      used_screens_before_bed: usedScreensBeforeBed,
      sleep_quality: sleepQuality,
      mood,
      mood_tags: moodTags,
      focus,
      energy,
      goals,
      rewards,
      ...updated,
    };

    const payload = {
      meds_taken: nextEntry.meds_taken,
      meds_time: nextEntry.meds_time,
      meds: nextEntry.meds,
      meals: nextEntry.meals,
      todo_items: nextEntry.todo_items,
      showered: nextEntry.showered,
      showered_time: nextEntry.showered_time,
      brushed_teeth: nextEntry.brushed_teeth,
      brushed_teeth_time: nextEntry.brushed_teeth_time,
      skincare: nextEntry.skincare,
      skincare_time: nextEntry.skincare_time,
      laundry_done: nextEntry.laundry_done,
      laundry_time: nextEntry.laundry_time,
      bedsheets_done: nextEntry.bedsheets_done,
      bedsheets_time: nextEntry.bedsheets_time,
      room_cleaned: nextEntry.room_cleaned,
      room_cleaned_time: nextEntry.room_cleaned_time,
      cleaning_minutes:
        nextEntry.cleaning_minutes === "" ? null : Number(nextEntry.cleaning_minutes),
      cleaning_worth_it: Number(nextEntry.cleaning_worth_it),
      exercise_done: nextEntry.exercise_done,
      exercise_time: nextEntry.exercise_time,
      exercise_type: nextEntry.exercise_type,
      exercise_minutes:
        nextEntry.exercise_minutes === "" ? null : Number(nextEntry.exercise_minutes),
      exercise_feeling: nextEntry.exercise_feeling,
      extra_walk: nextEntry.extra_walk,
      after_exercise_state: nextEntry.after_exercise_state,
      exercise_logs: nextEntry.exercise_logs,
      bed_time: nextEntry.bed_time,
      wake_time: nextEntry.wake_time,
      sleep_routine: nextEntry.sleep_routine,
      used_screens_before_bed: nextEntry.used_screens_before_bed,
      sleep_quality: Number(nextEntry.sleep_quality),
      mood: Number(nextEntry.mood),
      mood_tags: nextEntry.mood_tags,
      focus: Number(nextEntry.focus),
      energy: Number(nextEntry.energy),
      goals: nextEntry.goals,
      rewards: nextEntry.rewards,
      user_id: user.id,
    };

    const { error } = await supabase
      .from("daily_entries")
      .update(payload)
      .eq("id", entryId);

    if (error) {
      console.error("Save error:", error);
      setStatus("Error saving");
      return;
    }

    setStatus("Saved");
    loadHistory();
    setTimeout(() => setStatus(""), 1200);
  }

  function nowTimeInputValue() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  }

  function normalizeMeals(rawMeals) {
    return rawMeals.map((meal) => {
      if (typeof meal === "string") {
        return { text: meal, time: "Unknown time" };
      }
      return {
        text: meal.text ?? "Unnamed meal",
        time: meal.time ?? "Unknown time",
      };
    });
  }

  function normalizeTodoItems(rawTodoItems) {
    return (Array.isArray(rawTodoItems) ? rawTodoItems : []).map((item, index) => ({
      id: item?.id || `todo-${index}`,
      text: item?.text ?? item?.title ?? "Untitled task",
      dueDate: item?.dueDate ?? item?.due_date ?? "",
      note: item?.note ?? "",
      time: item?.time ?? "",
      completed: Boolean(item?.completed),
      completedAt: item?.completedAt ?? "",
    }));
  }

  const toggleMed = async () => {
    const value = !medTaken;
    const time = value ? medsTime || nowTimeInputValue() : "";
    setMedTaken(value);
    setMedsTime(time);
    setLastAction(value ? `Updated meds at ${time}` : "Marked meds as not taken");
    await saveEntry({ meds_taken: value, meds_time: time });
  };

  const handleMedsTimeChange = async (value) => {
    setMedsTime(value);
    setLastAction(`Updated meds time to ${value || "blank"}`);
    await saveEntry({ meds_time: value });
  };

  const addMedication = async () => {
    if (!medName.trim()) return;

    const time = medEntryTime || nowTimeInputValue();

    const newMed = {
      name: medName.trim(),
      dose: medDose.trim(),
      time,
      symptoms: medSymptoms.trim(),
      notes: medNotes.trim(),
    };

    const newMeds = [...meds, newMed];

    setMeds(newMeds);
    setMedName("");
    setMedDose("");
    setMedEntryTime("");
    setMedSymptoms("");
    setMedNotes("");
    setLastAction(`Added med at ${time}`);

    await saveEntry({ meds: newMeds });
  };

  const removeMedication = async (indexToRemove) => {
    const newMeds = meds.filter((_, index) => index !== indexToRemove);
    setMeds(newMeds);
    setLastAction("Removed a medication entry");
    await saveEntry({ meds: newMeds });
  };

  const toggleShowered = async () => {
    const value = !showered;
    const time = value ? showeredTime || nowTimeInputValue() : "";
    setShowered(value);
    setShoweredTime(time);
    setLastAction(value ? `Showered at ${time}` : "Unmarked shower");
    await saveEntry({ showered: value, showered_time: time });
  };

  const handleShoweredTimeChange = async (value) => {
    setShoweredTime(value);
    setLastAction(`Updated shower time to ${value || "blank"}`);
    await saveEntry({ showered_time: value });
  };

  const toggleBrushedTeeth = async () => {
    const value = !brushedTeeth;
    const time = value ? brushedTeethTime || nowTimeInputValue() : "";
    setBrushedTeeth(value);
    setBrushedTeethTime(time);
    setLastAction(value ? `Brushed teeth at ${time}` : "Unmarked brushed teeth");
    await saveEntry({ brushed_teeth: value, brushed_teeth_time: time });
  };

  const handleBrushedTeethTimeChange = async (value) => {
    setBrushedTeethTime(value);
    setLastAction(`Updated brush teeth time to ${value || "blank"}`);
    await saveEntry({ brushed_teeth_time: value });
  };

  const toggleSkincare = async () => {
    const value = !skincare;
    const time = value ? skincareTime || nowTimeInputValue() : "";
    setSkincare(value);
    setSkincareTime(time);
    setLastAction(value ? `Did skincare at ${time}` : "Unmarked skincare");
    await saveEntry({ skincare: value, skincare_time: time });
  };

  const handleSkincareTimeChange = async (value) => {
    setSkincareTime(value);
    setLastAction(`Updated skincare time to ${value || "blank"}`);
    await saveEntry({ skincare_time: value });
  };

  const toggleLaundry = async () => {
    const value = !laundryDone;
    const time = value ? laundryTime || nowTimeInputValue() : "";
    setLaundryDone(value);
    setLaundryTime(time);
    setLastAction(value ? `Finished laundry at ${time}` : "Unmarked laundry");
    await saveEntry({ laundry_done: value, laundry_time: time });
  };

  const handleLaundryTimeChange = async (value) => {
    setLaundryTime(value);
    setLastAction(`Updated laundry time to ${value || "blank"}`);
    await saveEntry({ laundry_time: value });
  };

  const toggleBedsheets = async () => {
    const value = !bedsheetsDone;
    const time = value ? bedsheetsTime || nowTimeInputValue() : "";
    setBedsheetsDone(value);
    setBedsheetsTime(time);
    setLastAction(value ? `Changed bedsheets at ${time}` : "Unmarked bedsheets");
    await saveEntry({ bedsheets_done: value, bedsheets_time: time });
  };

  const handleBedsheetsTimeChange = async (value) => {
    setBedsheetsTime(value);
    setLastAction(`Updated bedsheets time to ${value || "blank"}`);
    await saveEntry({ bedsheets_time: value });
  };

  const toggleRoomCleaned = async () => {
    const value = !roomCleaned;
    const time = value ? roomCleanedTime || nowTimeInputValue() : "";
    setRoomCleaned(value);
    setRoomCleanedTime(time);
    setLastAction(value ? `Cleaned room at ${time}` : "Unmarked room cleaned");
    await saveEntry({ room_cleaned: value, room_cleaned_time: time });
  };

  const handleRoomCleanedTimeChange = async (value) => {
    setRoomCleanedTime(value);
    setLastAction(`Updated room cleaned time to ${value || "blank"}`);
    await saveEntry({ room_cleaned_time: value });
  };

  const toggleExerciseDone = async () => {
    const value = !exerciseDone;
    const time = value ? exerciseTime || nowTimeInputValue() : "";
    setExerciseDone(value);
    setExerciseTime(time);
    setLastAction(value ? `Marked exercise done at ${time}` : "Unmarked exercise");
    await saveEntry({ exercise_done: value, exercise_time: time });
  };

  const toggleExtraWalk = async () => {
    const value = !extraWalk;
    setExtraWalk(value);
    setLastAction(value ? "Marked extra walk" : "Unmarked extra walk");
    await saveEntry({ extra_walk: value });
  };

  const addExerciseLog = async () => {
    if (
      !exerciseType.trim() &&
      !exerciseTime &&
      !exerciseMinutes &&
      !exerciseFeeling.trim() &&
      !extraWalk &&
      !afterExerciseState.trim()
    ) {
      return;
    }

    const logTime = exerciseTime || nowTimeInputValue();
    const newLog = {
      type: exerciseType.trim() || "Unnamed exercise",
      time: logTime,
      minutes: exerciseMinutes === "" ? "" : Number(exerciseMinutes),
      feeling: exerciseFeeling.trim(),
      extraWalk,
      afterState: afterExerciseState.trim(),
    };

    const newExerciseLogs = [...exerciseLogs, newLog];

    setExerciseLogs(newExerciseLogs);
    setExerciseTime("");
    setExerciseType("");
    setExerciseMinutes("");
    setExerciseFeeling("");
    setExtraWalk(false);
    setAfterExerciseState("");
    setLastAction(`Added exercise log at ${logTime}`);

    await saveEntry({
      exercise_logs: newExerciseLogs,
      exercise_time: "",
      exercise_type: "",
      exercise_minutes: null,
      exercise_feeling: "",
      extra_walk: false,
      after_exercise_state: "",
    });
  };

  const removeExerciseLog = async (indexToRemove) => {
    const newExerciseLogs = exerciseLogs.filter((_, index) => index !== indexToRemove);
    setExerciseLogs(newExerciseLogs);
    setLastAction("Removed an exercise log");
    await saveEntry({ exercise_logs: newExerciseLogs });
  };

  const addMeal = async () => {
    if (!mealText.trim()) return;

    const time = mealTime || nowTimeInputValue();

    const newMeal = {
      text: mealText.trim(),
      time,
    };

    const newMeals = [...meals, newMeal];
    setMeals(newMeals);
    setMealText("");
    setMealTime("");
    setLastAction(`Added meal at ${time}`);

    await saveEntry({ meals: newMeals });
  };

  const handleMealTimeChange = (value) => {
    setMealTime(value);
  };

  const removeMeal = async (indexToRemove) => {
    const newMeals = meals.filter((_, index) => index !== indexToRemove);
    setMeals(newMeals);
    setLastAction("Removed a meal");
    await saveEntry({ meals: newMeals });
  };

  const addTodoItem = async () => {
    if (!todoText.trim()) return;

    const trimmedText = todoText.trim();
    const trimmedNote = todoNote.trim();

    const nextTodoItems = [
      ...todoItems,
      {
        id: crypto.randomUUID(),
        text: trimmedText,
        dueDate: todoDueDate,
        note: trimmedNote,
        time: "",
        completed: false,
        completedAt: "",
      },
    ];

    setTodoItems(nextTodoItems);
    setTodoText("");
    setTodoDueDate("");
    setTodoNote("");
    setLastAction(`Added task: ${trimmedText}`);
    await saveEntry({ todo_items: nextTodoItems });
  };

  const toggleTodoItem = async (todoId) => {
    const nextTodoItems = todoItems.map((item) =>
      item.id === todoId
        ? {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? nowTimeInputValue() : "",
          }
        : item
    );
    const updatedItem = nextTodoItems.find((item) => item.id === todoId);

    setTodoItems(nextTodoItems);
    setLastAction(
      updatedItem?.completed
        ? `Completed task: ${updatedItem.text}`
        : `Reopened task: ${updatedItem?.text || "task"}`
    );
    await saveEntry({ todo_items: nextTodoItems });
  };

  const removeTodoItem = async (todoId) => {
    const removedItem = todoItems.find((item) => item.id === todoId);
    const nextTodoItems = todoItems.filter((item) => item.id !== todoId);

    setTodoItems(nextTodoItems);
    setLastAction(`Removed task: ${removedItem?.text || "task"}`);
    await saveEntry({ todo_items: nextTodoItems });
  };

  const togglePeriodSymptomTag = (tag) => {
    setPeriodSymptomTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  };

  const activePeriodCycle = periodCycles.find((cycle) => !cycle.endDate) || null;

  const startPeriodCycle = async () => {
    if (!user) return;

    if (activePeriodCycle) {
      setPeriodStatusMessage("Finish the current cycle before starting a new one.");
      return;
    }

    const startDate = periodStartDate || today;

    const { error } = await supabase.from("period_cycles").insert({
      user_id: user.id,
      start_date: startDate,
      flow_level: periodFlowLevel || "medium",
      symptom_tags: periodSymptomTags,
      private_notes: periodPrivateNotes.trim() || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Period start error:", error);
      setPeriodStatusMessage("Could not start the period entry.");
      return;
    }

    setLastAction(`Marked period started on ${startDate}`);
    setPeriodStatusMessage("Period start saved.");
    await loadPeriodCycles();
  };

  const saveActivePeriodCycle = async (updates = {}, successMessage = "Period details saved.") => {
    if (!user || !activePeriodCycle) return;

    const nextEndDate = Object.prototype.hasOwnProperty.call(updates, "end_date")
      ? updates.end_date
      : periodEndDate;

    if (nextEndDate && nextEndDate < activePeriodCycle.startDate) {
      setPeriodStatusMessage("End date cannot be earlier than the start date.");
      return;
    }

    const payload = {
      flow_level: periodFlowLevel || "medium",
      symptom_tags: periodSymptomTags,
      private_notes: periodPrivateNotes.trim() || null,
      updated_at: new Date().toISOString(),
      ...updates,
    };

    const { error } = await supabase
      .from("period_cycles")
      .update(payload)
      .eq("id", activePeriodCycle.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Period update error:", error);
      setPeriodStatusMessage("Could not save period details.");
      return;
    }

    setPeriodStatusMessage(successMessage);
    await loadPeriodCycles();
  };

  const endPeriodCycle = async () => {
    const endDate = periodEndDate || today;
    await saveActivePeriodCycle(
      { end_date: endDate },
      `Marked period ended on ${endDate}.`
    );
    setLastAction(`Marked period ended on ${endDate}`);
  };

  const savePeriodNotesAndSymptoms = async () => {
    await saveActivePeriodCycle();
    if (activePeriodCycle) {
      setLastAction("Updated period details");
    }
  };

  const addAppointment = async () => {
    if (!user) return;

    if (!appointmentTitle.trim()) {
      setAppointmentStatusMessage("Add a title to save this.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setAppointmentStatusMessage("Date and time are both required.");
      return;
    }

    const title = appointmentTitle.trim();
    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      item_type: appointmentType,
      title,
      event_date: appointmentDate,
      event_time: appointmentTime,
      location: appointmentLocation.trim() || null,
      note: appointmentNote.trim() || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Appointment add error:", error);
      setAppointmentStatusMessage("Could not save this item.");
      return;
    }

    setAppointmentType("appointment");
    setAppointmentTitle("");
    setAppointmentDate(today);
    setAppointmentTime("");
    setAppointmentLocation("");
    setAppointmentNote("");
    setAppointmentStatusMessage("Saved.");
    setLastAction(`Added ${appointmentType}: ${title}`);
    await loadAppointments();
  };

  const startEditingAppointment = (appointmentId) => {
    const target = appointments.find((item) => item.id === appointmentId);
    if (!target) return;

    setEditingAppointmentId(target.id);
    setAppointmentType(target.itemType || "appointment");
    setAppointmentTitle(target.title || "");
    setAppointmentDate(target.eventDate || today);
    setAppointmentTime(target.eventTime || "");
    setAppointmentLocation(target.location || "");
    setAppointmentNote(target.note || "");
    setAppointmentStatusMessage("Editing saved item.");
  };

  const cancelAppointmentEdit = () => {
    setEditingAppointmentId(null);
    setAppointmentType("appointment");
    setAppointmentTitle("");
    setAppointmentDate(today);
    setAppointmentTime("");
    setAppointmentLocation("");
    setAppointmentNote("");
    setAppointmentStatusMessage("");
  };

  const updateAppointment = async () => {
    if (!user || !editingAppointmentId) return;

    if (!appointmentTitle.trim()) {
      setAppointmentStatusMessage("Add a title to save this.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setAppointmentStatusMessage("Date and time are both required.");
      return;
    }

    const title = appointmentTitle.trim();
    const { error } = await supabase
      .from("appointments")
      .update({
        item_type: appointmentType,
        title,
        event_date: appointmentDate,
        event_time: appointmentTime,
        location: appointmentLocation.trim() || null,
        note: appointmentNote.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingAppointmentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Appointment update error:", error);
      setAppointmentStatusMessage("Could not update this item.");
      return;
    }

    setLastAction(`Updated ${appointmentType}: ${title}`);
    cancelAppointmentEdit();
    setAppointmentStatusMessage("Updated.");
    await loadAppointments();
  };

  const removeAppointment = async (appointmentId) => {
    if (!user) return;

    const removedItem = appointments.find((item) => item.id === appointmentId);
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Appointment remove error:", error);
      setAppointmentStatusMessage("Could not remove this item.");
      return;
    }

    if (editingAppointmentId === appointmentId) {
      cancelAppointmentEdit();
    }

    setAppointmentStatusMessage("Removed.");
    setLastAction(`Removed ${removedItem?.itemType || "appointment"}: ${removedItem?.title || "item"}`);
    await loadAppointments();
  };

  const handleBedTimeChange = async (value) => {
    setBedTime(value);
    setLastAction(`Set bedtime to ${value || "blank"}`);
    await saveEntry({ bed_time: value });
  };

  const handleWakeTimeChange = async (value) => {
    setWakeTime(value);
    setLastAction(`Set wake time to ${value || "blank"}`);
    await saveEntry({ wake_time: value });
  };

  const handleSleepRoutineChange = async (value) => {
    setSleepRoutine(value);
    setLastAction(`Updated sleep routine to ${value || "blank"}`);
    await saveEntry({ sleep_routine: value });
  };

  const toggleUsedScreensBeforeBed = async () => {
    const value = !usedScreensBeforeBed;
    setUsedScreensBeforeBed(value);
    setLastAction(value ? "Marked screens before bed" : "Unmarked screens before bed");
    await saveEntry({ used_screens_before_bed: value });
  };

  const handleSleepQualityChange = async (value) => {
    setSleepQuality(value);
    setLastAction(`Updated sleep quality to ${value}/5`);
    await saveEntry({ sleep_quality: Number(value) });
  };

  const handleMoodChange = async (value) => {
    setMood(value);
    setLastAction(`Updated mood to ${value}/5`);
    await saveEntry({ mood: Number(value) });
  };

  const toggleMoodTag = async (tag) => {
    const isSelected = moodTags.includes(tag);

    let nextTags = moodTags;

    if (isSelected) {
      nextTags = moodTags.filter((item) => item !== tag);
    } else if (moodTags.length < 3) {
      nextTags = [...moodTags, tag];
    } else {
      setLastAction("Mood tags are limited to 3");
      return;
    }

    setMoodTags(nextTags);
    setLastAction(
      isSelected ? `Removed mood tag: ${tag}` : `Added mood tag: ${tag}`
    );
    await saveEntry({ mood_tags: nextTags });
  };

  const refreshGoalSuggestions = () => {
    setGoalSuggestions(makeGoalSuggestions(themeFamily, darkMode));
  };

  const applyGoalSuggestion = (suggestion) => {
    setGoalName(suggestion);
  };

  const createGoal = async () => {
    const trimmedName = goalName.trim() || goalSuggestions[0] || "Celestial Goal";
    const nextGoal = {
      id: createGoalId(),
      name: trimmedName,
      category: goalCategory,
      checkType: goalCheckType,
      targetAmount: Number(goalTargetAmount),
      streakLength: Number(goalStreakLength),
      currentStreakProgress: 0,
      completed: false,
      rewardEarned: "",
      createdAt: today,
    };

    const updatedGoals = [...goals, nextGoal];
    setGoals(updatedGoals);
    setGoalName("");
    setGoalTargetAmount(goalCheckType === "weekly" ? "2" : "1");
    setGoalStreakLength(goalCheckType === "weekly" ? "4" : "7");
    setLastAction(`Created goal: ${trimmedName}`);
    refreshGoalSuggestions();
    await saveEntry({ goals: updatedGoals });
  };

  const removeGoal = async (goalId) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);
    setLastAction("Removed a goal");
    await saveEntry({ goals: updatedGoals });
  };

  const handleCleaningMinutesChange = async (value) => {
    setCleaningMinutes(value);
    setLastAction(`Updated cleaning minutes to ${value || "blank"}`);
    await saveEntry({
      cleaning_minutes: value === "" ? null : Number(value),
    });
  };

  const handleCleaningWorthItChange = async (value) => {
    setCleaningWorthIt(value);
    setLastAction(`Updated cleaning worth-it rating to ${value}/5`);
    await saveEntry({ cleaning_worth_it: Number(value) });
  };

  const handleExerciseTypeChange = async (value) => {
    setExerciseType(value);
    setLastAction(`Updated exercise type to ${value || "blank"}`);
    await saveEntry({ exercise_type: value });
  };

  const handleExerciseTimeChange = async (value) => {
    setExerciseTime(value);
    setLastAction(`Updated exercise time to ${value || "blank"}`);
    await saveEntry({ exercise_time: value });
  };

  const handleExerciseMinutesChange = async (value) => {
    setExerciseMinutes(value);
    setLastAction(`Updated exercise minutes to ${value || "blank"}`);
    await saveEntry({
      exercise_minutes: value === "" ? null : Number(value),
    });
  };

  const handleExerciseFeelingChange = async (value) => {
    setExerciseFeeling(value);
    setLastAction(`Updated exercise feeling to ${value || "blank"}`);
    await saveEntry({ exercise_feeling: value });
  };

  const handleAfterExerciseStateChange = async (value) => {
    setAfterExerciseState(value);
    setLastAction(`Updated after exercise state to ${value || "blank"}`);
    await saveEntry({ after_exercise_state: value });
  };

  const hydrateUserSession = useEffectEvent(async (nextUser) => {
    const profileSync = await ensureProfileExists(nextUser);

    if (!profileSync.ok) {
      setAuthMessage(profileSync.error || "Could not sync your profile.");
    }

    await loadProfile(nextUser.id);
    await loadEntry();
    await loadHistory();
    await loadPeriodCycles();
    await loadAppointments();
    setProfileSyncLoading(false);
  });

  const refreshProfileForEffect = useEffectEvent((userId) => {
    void loadProfile(userId);
  });

  const refreshConnectionsDataForEffect = useEffectEvent(() => {
    void loadConnectionsData();
  });

  const refreshOutsiderTrackersForEffect = useEffectEvent(() => {
    void loadOutsiderTrackers();
  });

  const refreshSupportInboxForEffect = useEffectEvent(() => {
    void loadSupportInbox();
  });

  const enableNativePushForEffect = useEffectEvent(() => {
    void enableNativePushNotifications();
  });

  const persistGoalRewardSnapshot = useEffectEvent((computedGoals, updatedRewards) => {
    void saveEntry({
      goals: computedGoals,
      rewards: updatedRewards,
    });
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    applyIncomingUrl(window.location.href);

    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    const listener = CapacitorApp.addListener("appUrlOpen", ({ url }) => {
      applyIncomingUrl(url);
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);

  useEffect(() => {
    let subscribed = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!subscribed) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setEntryId(null);
      setHistoryData([]);
      setTrackedAreas([]);
      setPendingTrackedAreas([]);
      setShowTrackingAreaPicker(false);
      setTrackingAreasMessage("");
      setShowAddTrackingAreaPicker(false);
      setTrackingAreaToAdd("");
      setPeriodCycles([]);
      setPeriodStartDate(today);
      setPeriodEndDate(today);
      setPeriodFlowLevel("medium");
      setPeriodSymptomTags([]);
      setPeriodPrivateNotes("");
      setPeriodStatusMessage("");
      setAppointments([]);
      setEditingAppointmentId(null);
      setAppointmentType("appointment");
      setAppointmentTitle("");
      setAppointmentDate(today);
      setAppointmentTime("");
      setAppointmentLocation("");
      setAppointmentNote("");
      setAppointmentStatusMessage("");
      setShowTrackerTutorial(false);
      setTrackerTutorialStepIndex(0);
      setShowOutsiderTutorial(false);
      setOutsiderTutorialStepIndex(0);
      setPushToken("");
      setPushStatusMessage("");
      setPushSyncing(false);
      return;
    }

    setLoading(true);
    setProfileSyncLoading(true);
    void hydrateUserSession(user);
  }, [user, today]);

  useEffect(() => {
    if (user || !pushRegistrationHandle) {
      return;
    }

    pushRegistrationHandle();
    setPushRegistrationHandle(null);
  }, [user, pushRegistrationHandle]);

  useEffect(() => {
    if (user && activePage === "settings") {
      refreshProfileForEffect(user.id);
    }
  }, [activePage, user]);

  useEffect(() => {
    if (activePage === "maintenance") {
      setActivePage("hygiene");
    }
  }, [activePage]);

  useEffect(() => {
    const selectedAreaPageKeys = normalizeTrackedAreas(trackedAreas)
      .map((areaId) => getTrackingAreaOption(areaId))
      .filter(Boolean)
      .map((area) => area.pageKey);
    const allowedPages = new Set([
      "mission",
      "dashboard",
      "calendar",
      "goals",
      "charts",
      "support",
      "connections",
      "settings",
      ...selectedAreaPageKeys,
    ]);

    if (!allowedPages.has(activePage)) {
      setActivePage("mission");
    }
  }, [activePage, trackedAreas]);

  useEffect(() => {
    if (activePeriodCycle) {
      setPeriodStartDate(activePeriodCycle.startDate || today);
      setPeriodEndDate(activePeriodCycle.endDate || today);
      setPeriodFlowLevel(activePeriodCycle.flowLevel || "medium");
      setPeriodSymptomTags(activePeriodCycle.symptomTags || []);
      setPeriodPrivateNotes(activePeriodCycle.privateNotes || "");
      return;
    }

    setPeriodStartDate(today);
    setPeriodEndDate(today);
    setPeriodFlowLevel("medium");
    setPeriodSymptomTags([]);
    setPeriodPrivateNotes("");
  }, [activePeriodCycle, today]);

  useEffect(() => {
    if (!user || typeof window === "undefined") {
      setPushOptedOutLocally(false);
      return;
    }

    setPushOptedOutLocally(localStorage.getItem(getNativePushOptOutKey(user.id)) === "true");
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (showTrackerTutorial || showOutsiderTutorial) {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [showTrackerTutorial, trackerTutorialStepIndex, showOutsiderTutorial, outsiderTutorialStepIndex]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setPushNotificationsSupported(false);
      setPushPermissionStatus("prompt");
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const pushAvailability = await checkNativePushAvailability();

        if (cancelled) return;

        setPushNotificationsSupported(pushAvailability.supported);
        setPushPermissionStatus(pushAvailability.permission);
      } catch (error) {
        console.error("Push availability error:", error);

        if (!cancelled) {
          setPushNotificationsSupported(false);
          setPushPermissionStatus("prompt");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    return () => {
      if (pushRegistrationHandle) {
        pushRegistrationHandle();
      }
    };
  }, [pushRegistrationHandle]);

  useEffect(() => {
    if (
      !user ||
      !pushNotificationsSupported ||
      pushPermissionStatus !== "granted" ||
      pushToken ||
      pushSyncing ||
      pushRegistrationHandle ||
      pushOptedOutLocally
    ) {
      return;
    }

    enableNativePushForEffect();
  }, [
    user,
    pushNotificationsSupported,
    pushPermissionStatus,
    pushToken,
    pushSyncing,
    pushRegistrationHandle,
    pushOptedOutLocally,
  ]);

  useEffect(() => {
    if (user) {
      refreshConnectionsDataForEffect();
      refreshOutsiderTrackersForEffect();
      refreshSupportInboxForEffect();
    }
  }, [user]);

  useEffect(() => {
    if (user && activePage === "connections") {
      refreshConnectionsDataForEffect();
    }
  }, [activePage, user]);

  useEffect(() => {
    if (user && (activePage === "support" || activePage === "mission" || activePage === "dashboard")) {
      refreshSupportInboxForEffect();
    }
  }, [activePage, user]);

  useEffect(() => {
    if (!user || activePage !== "connections") return undefined;

    const intervalId = window.setInterval(() => {
      refreshConnectionsDataForEffect();
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activePage, user]);

  useEffect(() => {
    if (user && appExperience === "outsider") {
      refreshOutsiderTrackersForEffect();
    }
  }, [appExperience, user]);

  useEffect(() => {
    localStorage.setItem(TRACKER_DARK_MODE_KEY, String(trackerDarkMode));
    localStorage.setItem("darkMode", String(trackerDarkMode));
  }, [trackerDarkMode]);

  useEffect(() => {
    localStorage.setItem(OUTSIDER_DARK_MODE_KEY, String(outsiderDarkMode));
  }, [outsiderDarkMode]);

  useEffect(() => {
    localStorage.setItem(PREFERRED_APP_EXPERIENCE_KEY, appExperience);
    setSelectedExperience(appExperience);
  }, [appExperience]);

  useEffect(() => {
    setGoalSuggestions(makeGoalSuggestions(themeFamily, darkMode));
  }, [darkMode, themeFamily]);

  useEffect(() => {
    if (!entryId || historyData.length === 0 || goals.length === 0) return;

    const computedGoals = goals.map((goal) => computeGoalProgress(goal, historyData, today));
    const updatedRewards = [...rewards];
    let hasGoalChanges = false;
    let hasRewardChanges = false;
    let latestPopup = null;

    computedGoals.forEach((goal, index) => {
      const previous = goals[index];
      const justCompleted = goal.completed && !previous.completed;

      if (
        goal.currentStreakProgress !== previous.currentStreakProgress ||
        goal.completed !== previous.completed
      ) {
        hasGoalChanges = true;
      }

      if (justCompleted) {
        const rewardMode = themeFamily;
        const rewardTitle = makeRewardName(rewardMode);
        const rewardType = getThemeRewardCopy(themeFamily).singular;

        goal.rewardEarned = rewardTitle;
        goal.completedAt = today;
        hasGoalChanges = true;

        const reward = {
          id: `${goal.id}-reward`,
          title: rewardTitle,
          goalName: goal.name,
          rewardType,
          earnedAt: today,
          mode: rewardMode,
        };

        updatedRewards.unshift(reward);
        hasRewardChanges = true;
        latestPopup = {
          message: `${goal.name} complete! You unlocked a ${rewardType}.`,
          reward,
        };
      }
    });

    if (hasGoalChanges) {
      setGoals(computedGoals);
    }

    if (hasRewardChanges) {
      setRewards(updatedRewards);
      setRewardPopup(latestPopup);
    }

    if (hasGoalChanges || hasRewardChanges) {
      persistGoalRewardSnapshot(computedGoals, updatedRewards);
    }
  }, [historyData, goals, rewards, entryId, today, themeFamily]);

  const chartRangeOptions = [7, 14];
  const recentChartData = useMemo(
    () => buildRecentChartData(historyData, chartRange, today),
    [historyData, chartRange, today]
  );
  const maxMeals = Math.max(...recentChartData.map((d) => d.mealsCount), 1);
  const maxHygiene = Math.max(...recentChartData.map((d) => d.hygieneCount), 1);
  const maxMeds = Math.max(...recentChartData.map((d) => d.medsCount), 1);
  const maxExercise = Math.max(...recentChartData.map((d) => d.exerciseCount), 1);
  const hygieneCount =
    (showered ? 1 : 0) + (brushedTeeth ? 1 : 0) + (skincare ? 1 : 0);
  const completedTodoCount = todoItems.filter((item) => item.completed).length;
  const openTodoCount = todoItems.length - completedTodoCount;
  const upcomingAppointments = appointments.filter((item) => item.eventDate >= today);
  const todayAppointments = upcomingAppointments.filter((item) => item.eventDate === today);
  const nextAppointment = upcomingAppointments[0] || null;
  const completedPeriodCycles = periodCycles.filter((cycle) => cycle.endDate);
  const latestCompletedPeriodCycle = completedPeriodCycles[0] || null;
  const cycleLengthSamples = periodCycles
    .slice(0, -1)
    .map((cycle, index) => {
      const nextCycle = periodCycles[index + 1];
      if (!cycle.startDate || !nextCycle?.startDate) return null;
      const currentDate = new Date(`${cycle.startDate}T12:00:00`);
      const nextDate = new Date(`${nextCycle.startDate}T12:00:00`);
      return Math.round((currentDate - nextDate) / 86400000);
    })
    .filter((value) => Number.isFinite(value) && value > 0);
  const averageCycleLengthDays =
    cycleLengthSamples.length > 0
      ? Math.round(
          cycleLengthSamples.reduce((sum, value) => sum + value, 0) / cycleLengthSamples.length
        )
      : 28;
  const nextCycleEstimateDate = periodCycles[0]?.startDate
    ? (() => {
        const nextDate = new Date(`${periodCycles[0].startDate}T12:00:00`);
        nextDate.setDate(nextDate.getDate() + averageCycleLengthDays);
        return getLocalDateKey(nextDate);
      })()
    : "";
  const calendarEvents = useMemo(
    () =>
      buildCalendarEvents({
        todoItems,
        appointments,
        periodCycles,
        nextCycleEstimateDate,
      }),
    [todoItems, appointments, periodCycles, nextCycleEstimateDate]
  );
  const activePeriodDayCount = activePeriodCycle?.startDate
    ? Math.max(
        1,
        Math.floor(
          (new Date(`${today}T12:00:00`) - new Date(`${activePeriodCycle.startDate}T12:00:00`)) /
            86400000
        ) + 1
      )
    : 0;
  const selectedTrackingAreaOptions = normalizeTrackedAreas(trackedAreas)
    .map((areaId) => getTrackingAreaOption(areaId))
    .filter(Boolean);
  const inactiveTrackingAreaOptions = TRACKING_AREA_OPTIONS.filter(
    (area) => !trackedAreas.includes(area.id)
  );
  const trackerNavItems = [
    { key: "mission", label: "Overview" },
    ...selectedTrackingAreaOptions.map((area) => ({
      key: area.pageKey,
      label: area.label,
    })),
    { key: "calendar", label: "Calendar" },
    { key: "goals", label: "Goals" },
    { key: "charts", label: "Charts" },
    { key: "support", label: "Support" },
    { key: "connections", label: "Connections" },
    { key: "settings", label: "Settings" },
  ];
  const trackerTutorialSteps = buildTrackerTutorialSteps(selectedTrackingAreaOptions);
  const trackerTutorialStep = trackerTutorialSteps[trackerTutorialStepIndex] || null;
  const outsiderTutorialSteps = buildOutsiderTutorialSteps(outsiderTrackers, selectedOutsider);
  const outsiderTutorialStep = outsiderTutorialSteps[outsiderTutorialStepIndex] || null;
  const tutorialIsMobile = isMobileTutorialViewport();
  const hideTrackerNavForTutorial =
    showTrackerTutorial && trackerTutorialStep?.spotlightRegion === "overview-orbit";
  const dashboardStats = [
    {
      key: "meds",
      label: "Meds logged",
      value: meds.length,
      note: medTaken ? `Marked at ${medsTime}` : "Not marked yet",
    },
    {
      key: "food",
      label: "Meals logged",
      value: meals.length,
      note: meals.length > 0 ? "Fuel recorded for today" : "No meals yet",
    },
    {
      key: "todo",
      label: "Tasks done",
      value: `${completedTodoCount}/${todoItems.length}`,
      note:
        todoItems.length > 0
          ? `${openTodoCount} open${todoItems.some((item) => item.dueDate === today && !item.completed) ? " · due today" : ""}`
          : "No tasks added yet",
    },
    {
      key: "appointments",
      label: "Appointments",
      value: todayAppointments.length > 0 ? `${todayAppointments.length} today` : upcomingAppointments.length,
      note: nextAppointment
        ? `${nextAppointment.title} · ${formatDisplayDate(nextAppointment.eventDate)} at ${nextAppointment.eventTime}`
        : "No upcoming plans yet",
    },
    {
      key: "period",
      label: "Cycle",
      value: activePeriodCycle ? `Day ${activePeriodDayCount}` : "Private",
      note: activePeriodCycle
        ? `${activePeriodCycle.flowLevel} flow`
        : nextCycleEstimateDate
        ? `Next estimate around ${formatDisplayDate(nextCycleEstimateDate)}`
        : "No cycle history yet",
    },
    {
      key: "hygiene",
      label: "Hygiene",
      value: `${hygieneCount}/3`,
      note: "Shower, teeth, skincare",
    },
    {
      key: "goals",
      label: "Goals active",
      value: goals.filter((goal) => !goal.completed).length,
      note: "Streaks update automatically",
    },
    {
      key: "exercise",
      label: "Exercise logs",
      value: exerciseLogs.length,
      note: exerciseDone ? "Movement marked today" : "No movement marked yet",
    },
    {
      key: "cleaning",
      label: "Cleaning minutes",
      value: cleaningMinutes || "0",
      note: "Small resets count too",
    },
    {
      key: "sleep",
      label: "Sleep quality",
      value: `${sleepQuality}/5`,
      note: `${bedTime || "No bed"} to ${wakeTime || "No wake"}`,
    },
  ].filter((item) => {
    if (item.key === "goals") return true;
    return trackedAreas.includes(item.key);
  });
  const energyFlowCards = [
    {
      key: "meds",
      label: "Meds",
      value: medTaken ? "Complete" : "Pending",
      note: medTaken ? `Marked ${medsTime || "today"}` : "No med check yet",
    },
    {
      key: "food",
      label: "Food",
      value: meals.length > 0 ? `${meals.length} logged` : "Pending",
      note: meals.length > 0 ? `${meals[meals.length - 1]?.text || "Meal"} added` : "No meals yet",
    },
    {
      key: "hygiene",
      label: "Hygiene",
      value: `${hygieneCount}/3`,
      note:
        hygieneCount > 0
          ? `${[showered && "shower", brushedTeeth && "teeth", skincare && "skincare"]
              .filter(Boolean)
              .join(", ")}`
          : "Nothing checked yet",
    },
    {
      key: "todo",
      label: "To-Do",
      value: completedTodoCount > 0 ? `${completedTodoCount} done` : "Open",
      note:
        todoItems.length > 0
          ? `${openTodoCount} task${openTodoCount === 1 ? "" : "s"} left${todoItems.some((item) => item.dueDate === today && !item.completed) ? " · due today" : ""}`
          : "No tasks added yet",
    },
    {
      key: "appointments",
      label: "Appointments",
      value: todayAppointments.length > 0 ? "Today" : upcomingAppointments.length > 0 ? "Planned" : "Open",
      note: nextAppointment
        ? `${nextAppointment.itemType === "reminder" ? "Reminder" : "Next up"} · ${nextAppointment.title}`
        : "No upcoming plans yet",
    },
    {
      key: "period",
      label: "Period",
      value: activePeriodCycle ? "Active" : "Idle",
      note: activePeriodCycle
        ? `Day ${activePeriodDayCount} · ${activePeriodCycle.flowLevel} flow`
        : nextCycleEstimateDate
        ? `Next estimate ${formatDisplayDate(nextCycleEstimateDate)}`
        : "No cycle recorded yet",
    },
    {
      key: "sleep",
      label: "Sleep",
      value: bedTime && wakeTime ? "Logged" : "Open",
      note: bedTime && wakeTime ? `${bedTime} to ${wakeTime}` : "Bedtime and wake time not both set",
    },
    {
      key: "exercise",
      label: "Exercise",
      value: exerciseDone || exerciseLogs.length > 0 ? "Complete" : "Pending",
      note:
        exerciseLogs.length > 0
          ? `${exerciseLogs.length} log${exerciseLogs.length === 1 ? "" : "s"} today`
          : exerciseDone
          ? "Movement marked today"
          : "No movement yet",
    },
  ].filter((item) => trackedAreas.includes(item.key));
  const recentMoodSummary =
    historyData
      .slice()
      .reverse()
      .find(
        (row) =>
          row.entry_date <= today &&
          (row.mood != null ||
            (Array.isArray(row.mood_tags) && row.mood_tags.length > 0))
      ) || null;
  const simpleAlignmentStreaks = [
    {
      name: "Nourishment Flow",
      progress: calculateSimpleDailyStreak(
        historyData,
        (row) => (Array.isArray(row.meals) ? row.meals.length : 0) > 0,
        today
      ),
      unit: "days",
    },
    {
      name: "Medicine Moon",
      progress: calculateSimpleDailyStreak(
        historyData,
        (row) => row.meds_taken || (Array.isArray(row.meds) ? row.meds.length : 0) > 0,
        today
      ),
      unit: "days",
    },
    {
      name: "Movement Orbit",
      progress: calculateSimpleDailyStreak(
        historyData,
        (row) =>
          row.exercise_done || (Array.isArray(row.exercise_logs) ? row.exercise_logs.length : 0) > 0,
        today
      ),
      unit: "days",
    },
    {
      name: "Task Orbit",
      progress: calculateSimpleDailyStreak(
        historyData,
        (row) =>
          (Array.isArray(row.todo_items) ? row.todo_items : []).some((item) => item?.completed),
        today
      ),
      unit: "days",
    },
    {
      name: "Plan Orbit",
      progress: todayAppointments.length,
      unit: "plans",
    },
  ].filter((item) => item.progress > 0);
  const nextRewardGoal =
    goals
      .filter((goal) => !goal.completed)
      .sort(
        (a, b) =>
          b.currentStreakProgress / b.streakLength -
          a.currentStreakProgress / a.streakLength
      )[0] || null;
  const recentActivityItems = [
    mood != null && {
      label: "Mood logged",
      detail: `${mood}/5${moodTags.length > 0 ? ` · ${moodTags.join(", ")}` : ""}`,
    },
    meals.length > 0 && {
      label: "Meal added",
      detail: `${meals[meals.length - 1].text} · ${meals[meals.length - 1].time}`,
    },
    todoItems.length > 0 && {
      label: "Task updated",
      detail: `${todoItems[todoItems.length - 1].text} · ${
        todoItems[todoItems.length - 1].completed
          ? "Completed"
          : todoItems[todoItems.length - 1].dueDate
          ? `Due ${formatDisplayDate(todoItems[todoItems.length - 1].dueDate)}`
          : "Open"
      }`,
    },
    nextAppointment && {
      label: nextAppointment.itemType === "reminder" ? "Reminder planned" : "Appointment planned",
      detail: `${nextAppointment.title} · ${formatDisplayDate(nextAppointment.eventDate)} at ${nextAppointment.eventTime}`,
    },
    periodCycles.length > 0 && {
      label: activePeriodCycle ? "Period active" : "Cycle saved",
      detail: activePeriodCycle
        ? `${formatDisplayDate(activePeriodCycle.startDate)} · ${activePeriodCycle.flowLevel} flow`
        : `${formatDisplayDate(latestCompletedPeriodCycle?.startDate) || "Recent"} to ${
            formatDisplayDate(latestCompletedPeriodCycle?.endDate) || "Open"
          }`,
    },
    meds.length > 0 && {
      label: "Medication logged",
      detail: `${meds[meds.length - 1].name}${meds[meds.length - 1].dose ? ` - ${meds[meds.length - 1].dose}` : ""}`,
    },
    showered && {
      label: "Shower checked",
      detail: showeredTime || "Marked today",
    },
    brushedTeeth && {
      label: "Teeth brushed",
      detail: brushedTeethTime || "Marked today",
    },
    skincare && {
      label: "Skincare done",
      detail: skincareTime || "Marked today",
    },
    (exerciseLogs.length > 0 || exerciseDone) && {
      label: "Exercise tracked",
      detail:
        exerciseLogs.length > 0
          ? `${exerciseLogs[exerciseLogs.length - 1].type || "Movement"} · ${exerciseLogs[exerciseLogs.length - 1].time || "Today"}`
          : exerciseTime || "Marked today",
    },
    (bedTime || wakeTime) && {
      label: "Sleep updated",
      detail: `${bedTime || "No bed time"} to ${wakeTime || "No wake time"}`,
    },
  ]
    .filter(Boolean)
    .slice(0, 5);
  const outsiderEnvironmentLabel =
    selectedOutsider?.themeFamily === "underwater"
      ? "Submarine view"
      : selectedOutsider?.themeFamily === "forest"
      ? "Cabin view"
      : "Spaceship view";
  const selectedOutsiderPermissions = normalizeConnectionPermissions(
    selectedOutsider?.permissions
  );
  const selectedOutsiderHistory = useMemo(
    () => selectedOutsider?.history || [],
    [selectedOutsider]
  );
  const unreadSupportCount = supportInbox.filter((item) => !item.readAt).length;
  const selectedOutsiderChartData = useMemo(
    () => buildRecentChartData(selectedOutsiderHistory, 7, today),
    [selectedOutsiderHistory, today]
  );
  const outsiderMoodLabel =
    selectedOutsider?.moodScore >= 4
      ? "good"
      : selectedOutsider?.moodScore >= 3
      ? "neutral"
      : "low";
  const trackerLabels = getThemeLanguage(themeFamily).tracker;
  const observerLabels = getThemeLanguage(selectedOutsider?.themeFamily || themeFamily).observer;
  const renderSectionHeader = (title, subtitle, solarAccent, galaxyAccent) => {
    if (isCelestialGalaxyTrackerTheme(theme)) {
      return (
        <div
          style={{
            paddingTop: "16px",
            paddingLeft: "28px",
            paddingRight: "18px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: theme.trackerAccent,
              fontFamily: theme.trackerHeadingFamily,
              fontStyle: "italic",
              fontSize: "clamp(1.28rem, 2.9vw, 1.82rem)",
              lineHeight: 1.02,
              textShadow: "0 0 18px rgba(255,240,195,0.16)",
              maxWidth: "min(100%, 360px)",
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              style={{
                margin: "10px 0 0",
                color: "rgba(216,185,255,0.62)",
                fontSize: "0.92rem",
                lineHeight: 1.55,
                maxWidth: "56ch",
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <div>
        <div style={cardHeaderRowStyle}>
          <div>
            <div style={{ ...emojiStyle, ...getAccentBadgeStyle(theme) }}>
              {getSectionAccentLabel(
                theme.themeFamily,
                darkMode ? galaxyAccent || solarAccent : solarAccent || galaxyAccent
              )}
            </div>
            <h2 style={sectionTitleStyle(theme)}>{title}</h2>
          </div>
        </div>
        {subtitle ? <p style={helperTextStyle(theme)}>{subtitle}</p> : null}
      </div>
    );
  };

  const sharedPageProps = {
    theme,
    darkMode,
    setDarkMode,
    today,
    renderSectionHeader,
    gridStyle,
    chartsPageStyle,
    chartStackStyle,
    chartCardStyle,
    chartToolbarStyle,
    chartRangeOptions,
    chartRange,
    setChartRange,
    rangeChipStyle,
    summaryCardStyle,
    summaryLabelStyle,
    summaryValueStyle,
    summaryNoteStyle,
    countTextStyle,
    rewardCardStyle,
    rewardTitleStyle,
    goalMetaStyle,
    smallInfoStyle,
    emptyTextStyle,
    primaryButtonStyle,
    softButtonStyle,
    successButtonStyle,
    quickJumpButtonStyle,
    quickLinkGridStyle,
    labelStyle,
    inputStyle,
    mealListStyle,
    mealItemStyle,
    smallRemoveButtonStyle,
    rowStyle,
    buttonWrapStyle,
    sleepGridStyle,
    rangeStyle,
    sliderValueStyle,
    tagGroupLabelStyle,
    moodTagGridStyle,
    goalFormGridStyle,
    goalSuggestionHeaderStyle,
    goalSuggestionButtonStyle,
    trackerSectionSwitcherButtonStyle,
    goalCardItemStyle,
    goalProgressTrackStyle,
    goalProgressFillStyle,
    rewardGridStyle,
    feedbackMessageStyle,
    renderFeedbackMessage,
    dashboardKickerStyle,
    dashboardHeadingStyle,
    subtitleStyle,
  };

  const trackerPageProps = {
    ...sharedPageProps,
    user,
    themeFamily,
    sectionCardStyle,
    trackerLabels,
    trackerNavItems,
    trackedAreas,
    selectedTrackingAreaOptions,
    inactiveTrackingAreaOptions,
    pendingTrackedAreas,
    togglePendingTrackedArea,
    showTrackingAreaPicker,
    setShowTrackingAreaPicker,
    completeTrackingAreaSetup,
    trackingAreasMessage,
    showAddTrackingAreaPicker,
    setShowAddTrackingAreaPicker,
    trackingAreaToAdd,
    setTrackingAreaToAdd,
    addTrackedArea,
    showTrackerTutorial,
    startTrackerTutorial,
    closeTrackerTutorial,
    mood,
    focus,
    energy,
    moodTags,
    moodTagGroups,
    moodTagButtonStyle,
    recentMoodSummary,
    energyFlowCards,
    simpleAlignmentStreaks,
    recentActivityItems,
    supportInbox,
    supportInboxLoading,
    supportInboxMessage,
    unreadSupportCount,
    loadSupportInbox,
    markSupportMessageRead,
    dashboardHeroStyle,
    dashboardPulseStyle,
    dashboardPulseRingStyle,
    dashboardPulseCoreStyle,
    dashboardStatsGridStyle,
    dashboardStats,
    setActivePage,
    goals,
    nextRewardGoal,
    rewards,
    recentChartData,
    maxMeals,
    maxMeds,
    maxHygiene,
    maxExercise,
    medTaken,
    medsTime,
    meds,
    medName,
    setMedName,
    medDose,
    setMedDose,
    medEntryTime,
    setMedEntryTime,
    medSymptoms,
    setMedSymptoms,
    medNotes,
    setMedNotes,
    toggleMed,
    handleMedsTimeChange,
    addMedication,
    removeMedication,
    mealText,
    setMealText,
    mealTime,
    handleMealTimeChange,
    addMeal,
    meals,
    removeMeal,
    todoItems,
    todoText,
    setTodoText,
    todoDueDate,
    setTodoDueDate,
    todoNote,
    setTodoNote,
    addTodoItem,
    toggleTodoItem,
    removeTodoItem,
    periodCycles,
    activePeriodCycle,
    periodStartDate,
    setPeriodStartDate,
    periodEndDate,
    setPeriodEndDate,
    periodFlowLevel,
    setPeriodFlowLevel,
    periodSymptomTags,
    periodPrivateNotes,
    setPeriodPrivateNotes,
    periodStatusMessage,
    startPeriodCycle,
    endPeriodCycle,
    savePeriodNotesAndSymptoms,
    togglePeriodSymptomTag,
    nextCycleEstimateDate,
    calendarEvents,
    averageCycleLengthDays,
    appointments,
    editingAppointmentId,
    appointmentType,
    setAppointmentType,
    appointmentTitle,
    setAppointmentTitle,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    appointmentLocation,
    setAppointmentLocation,
    appointmentNote,
    setAppointmentNote,
    appointmentStatusMessage,
    addAppointment,
    startEditingAppointment,
    cancelAppointmentEdit,
    updateAppointment,
    removeAppointment,
    bedTime,
    wakeTime,
    sleepRoutine,
    usedScreensBeforeBed,
    sleepQuality,
    handleBedTimeChange,
    handleWakeTimeChange,
    handleSleepRoutineChange,
    toggleUsedScreensBeforeBed,
    handleSleepQualityChange,
    showered,
    showeredTime,
    brushedTeeth,
    brushedTeethTime,
    skincare,
    skincareTime,
    toggleShowered,
    handleShoweredTimeChange,
    toggleBrushedTeeth,
    handleBrushedTeethTimeChange,
    toggleSkincare,
    handleSkincareTimeChange,
    laundryDone,
    laundryTime,
    bedsheetsDone,
    bedsheetsTime,
    roomCleaned,
    roomCleanedTime,
    cleaningMinutes,
    cleaningWorthIt,
    toggleLaundry,
    handleLaundryTimeChange,
    toggleBedsheets,
    handleBedsheetsTimeChange,
    toggleRoomCleaned,
    handleRoomCleanedTimeChange,
    handleCleaningMinutesChange,
    handleCleaningWorthItChange,
    exerciseDone,
    exerciseTime,
    exerciseType,
    exerciseMinutes,
    exerciseFeeling,
    extraWalk,
    afterExerciseState,
    exerciseLogs,
    toggleExerciseDone,
    toggleExtraWalk,
    handleExerciseTimeChange,
    handleExerciseTypeChange,
    handleExerciseMinutesChange,
    handleExerciseFeelingChange,
    handleAfterExerciseStateChange,
    addExerciseLog,
    removeExerciseLog,
    handleMoodChange,
    toggleMoodTag,
    goalName,
    setGoalName,
    goalCategory,
    setGoalCategory,
    goalCategories,
    goalCheckType,
    setGoalCheckType,
    goalTargetAmount,
    setGoalTargetAmount,
    goalStreakLength,
    setGoalStreakLength,
    goalSuggestions,
    refreshGoalSuggestions,
    applyGoalSuggestion,
    createGoal,
    removeGoal,
    connectionsLoading,
    connectionsMessage,
    generateInviteCode,
    generateInviteLink,
    loadConnectionsData,
    inviteCode,
    inviteLink,
    pendingRequests,
    requestApproval,
    rejectRequest,
    connectedOutsiders,
    updateOutsiderSetting,
    permissionsGridStyle,
    normalizeConnectionPermissions,
    permissionItemStyle,
    updateOutsiderPermission,
    revokeOutsider,
    joinCodeInput,
    setJoinCodeInput,
    joinByCode,
    joinLinkInput,
    setJoinLinkInput,
    joinByLink,
    displayName,
    setDisplayName,
    secondaryDisplayName,
    setSecondaryDisplayName,
    setThemeFamily,
    themeToggleStyle,
    saveProfileSettings,
    currentPinInput,
    setCurrentPinInput,
    newPinInput,
    setNewPinInput,
    confirmNewPinInput,
    setConfirmNewPinInput,
    changePin,
    settingsMessage,
    resetPinPassword,
    setResetPinPassword,
    resetNewPinInput,
    setResetNewPinInput,
    resetConfirmNewPinInput,
    setResetConfirmNewPinInput,
    resetPinWithPassword,
    pushNotificationsSupported,
    pushPermissionStatus,
    pushToken,
    pushStatusMessage,
    pushSyncing,
    enableNativePushNotifications,
    disableNativePushNotifications,
    handleLogout,
  };

  const outsiderPageProps = {
    ...sharedPageProps,
    observerSectionCardStyle,
    observerHeroStyle,
    observerLabels,
    outsiderTrackers,
    selectedOutsider,
    selectedOutsiderPermissions,
    selectedOutsiderHistory,
    selectedOutsiderChartData,
    outsiderEnvironmentLabel,
    outsiderMoodLabel,
    outsiderMessage,
    outsiderCooldownUntil,
    connectionsMessage,
    renderFeedbackMessage,
    goalFormGridStyle,
    labelStyle,
    inputStyle,
    joinCodeInput,
    setJoinCodeInput,
    joinByCode,
    joinLinkInput,
    setJoinLinkInput,
    joinByLink,
    sendSupportMessage,
    setSelectedOutsiderId,
    setOutsiderPage,
    setShowOutsiderChooser,
    showOutsiderTutorial,
    startOutsiderTutorial,
  };

  const outsiderPageContent = (() => {
    if (outsiderLoading) {
      return (
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
          {renderSectionHeader(
            observerLabels.dashboard,
            "Loading approved tracker connections.",
            "Overview",
            "Overview"
          )}
          <p style={smallInfoStyle(theme)}>Loading connected trackers...</p>
        </section>
      );
    }

    switch (outsiderPage) {
      case "outsiderData":
        return <OutsiderTrackerDataPage app={outsiderPageProps} />;
      case "outsiderSupport":
        return <OutsiderSupportPage app={outsiderPageProps} />;
      case "outsiderGoals":
        return <OutsiderGoalsPage app={outsiderPageProps} />;
      case "outsiderOverview":
      default:
        return <OutsiderOverviewPage app={outsiderPageProps} />;
    }
  })();

  const currentPageContent = (() => {
    switch (activePage) {
      case "mission":
      case "dashboard":
        return <TrackerOverviewPage app={trackerPageProps} />;
      case "mood":
        return <TrackerMoodPage app={trackerPageProps} />;
      case "meds":
      case "food":
      case "sleep":
      case "hygiene":
      case "cleaning":
      case "exercise":
      case "todo":
      case "period":
      case "appointments":
        return <TrackerTrackingPage app={trackerPageProps} pageKey={activePage} />;
      case "calendar":
        return <TrackerCalendarPage app={trackerPageProps} />;
      case "charts":
        return <TrackerChartsPage app={trackerPageProps} />;
      case "settings":
        return <TrackerSettingsPage app={trackerPageProps} />;
      case "goals":
        return <TrackerGoalsPage app={trackerPageProps} />;
      case "connections":
        return <TrackerConnectionsPage app={trackerPageProps} />;
      case "support":
        return <TrackerSupportPage app={trackerPageProps} />;
      default:
        return null;
    }
  })();

  const appShellStyles = `
    html, body, #root {
      margin: 0;
      min-height: 100%;
      width: 100%;
    }

    body {
      overflow-x: hidden;
    }

    .app-shell,
    .app-shell *,
    .app-shell *::before,
    .app-shell *::after {
      box-sizing: border-box;
      min-width: 0;
    }

    .galaxy-panel {
      transition: transform 180ms ease, box-shadow 220ms ease, filter 220ms ease;
      min-width: 0;
      width: 100%;
      max-width: 100%;
      position: relative;
    }

    .galaxy-panel:hover {
      transform: translateY(-2px);
      filter: brightness(1.015);
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }

    .orbital-scanlines {
      background:
        linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.11) 50%),
        linear-gradient(90deg, rgba(0, 230, 57, 0.015), rgba(255, 179, 0, 0.008), rgba(0, 230, 57, 0.015));
      background-size: 100% 3px, 3px 100%;
      pointer-events: none;
    }

    .orbital-crt-glow {
      box-shadow: inset 0 0 40px rgba(0, 230, 57, 0.08), 0 0 20px rgba(0, 230, 57, 0.05);
    }

    .orbital-mechanical-shadow {
      box-shadow: 2px 2px 0px #0c0e10, -1px -1px 0px #47464b;
    }

    .orbital-waveform-path {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: orbital-dash 5s linear infinite;
    }

    @keyframes orbital-dash {
      to {
        stroke-dashoffset: 0;
      }
    }

    .observatory-orbit-spin {
      animation: observatory-orbit-spin 60s linear infinite;
      transform-origin: center;
    }

    .observatory-orbit-counterspin {
      animation: observatory-orbit-counterspin 60s linear infinite;
      transform-origin: center;
    }

    @keyframes observatory-orbit-spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes observatory-orbit-counterspin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(-360deg);
      }
    }

    .reef-caustics {
      animation: reef-caustics 8s ease-in-out infinite;
      transform-origin: center;
    }

    .reef-float {
      animation: reef-float 6s ease-in-out infinite;
    }

    .reef-float-slow {
      animation: reef-float-slow 10s ease-in-out infinite;
    }

    .reef-sway {
      animation: reef-sway 4s ease-in-out infinite;
      transform-origin: center;
    }

    .reef-drift {
      animation: reef-drift 20s linear infinite;
    }

    .reef-pulse-soft {
      animation: reef-pulse-soft 4s ease-in-out infinite;
    }

    .reef-waveform-primary {
      stroke-dasharray: 900;
      stroke-dashoffset: 900;
      animation: reef-waveform-draw 5s linear infinite, reef-pulse-soft 4s ease-in-out infinite;
    }

    .reef-waveform-secondary {
      stroke-dasharray: 900;
      stroke-dashoffset: 900;
      animation: reef-waveform-draw 6.5s linear infinite;
    }

    @keyframes reef-float {
      0%, 100% {
        transform: translateY(0px);
      }

      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes reef-float-slow {
      0%, 100% {
        transform: translateY(0px);
      }

      50% {
        transform: translateY(-12px);
      }
    }

    @keyframes reef-sway {
      0%, 100% {
        transform: rotate(-2deg);
      }

      50% {
        transform: rotate(2deg);
      }
    }

    @keyframes reef-caustics {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1) translate(0, 0);
      }

      50% {
        opacity: 0.6;
        transform: scale(1.08) translate(2%, 2%);
      }
    }

    @keyframes reef-drift {
      0% {
        transform: translateX(-10%);
      }

      100% {
        transform: translateX(110%);
      }
    }

    @keyframes reef-pulse-soft {
      0%, 100% {
        opacity: 0.4;
      }

      50% {
        opacity: 0.7;
      }
    }

    @keyframes reef-waveform-draw {
      to {
        stroke-dashoffset: 0;
      }
    }

    .app-shell svg,
    .app-shell canvas,
    .app-shell img {
      max-width: 100%;
      height: auto;
    }

    button,
    input,
    textarea,
    select {
      transition: transform 160ms ease, box-shadow 200ms ease, filter 200ms ease, border-color 200ms ease, background 220ms ease;
      max-width: 100%;
    }

    button:hover {
      transform: translateY(-1px);
      filter: brightness(1.04);
    }

    button:active {
      transform: translateY(1px) scale(0.99);
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      filter: brightness(1.015);
    }

    @media (max-width: 639px) {
      .app-shell {
        overflow-x: hidden;
      }

      .app-shell button,
      .app-shell input,
      .app-shell textarea,
      .app-shell select {
        width: 100%;
      }
    }

    @media (min-width: 640px) {
      .galaxy-panel {
        width: auto;
      }
    }

    @media (min-width: 1024px) {
      .galaxy-panel:hover {
        transform: translateY(-2px);
      }
    }
  `;

  if (isChartsPreviewMode) {
    const previewTheme = getTrackerExperienceTheme(getAppTheme(true, "galaxy"), true);
    const previewChartData = buildChartsPreviewData(chartRange, today);
    const previewMaxMeals = Math.max(...previewChartData.map((entry) => entry.mealsCount), 1);
    const previewMaxMeds = Math.max(...previewChartData.map((entry) => entry.medsCount), 1);
    const previewMaxHygiene = Math.max(...previewChartData.map((entry) => entry.hygieneCount), 1);
    const previewMaxExercise = Math.max(...previewChartData.map((entry) => entry.exerciseCount), 1);
    const renderPreviewSectionHeader = (title, subtitle, solarAccent, galaxyAccent) => (
      <>
        <div style={cardHeaderRowStyle}>
          <div>
            <div style={{ ...emojiStyle, ...getAccentBadgeStyle(previewTheme) }}>
              {getSectionAccentLabel(previewTheme.themeFamily, galaxyAccent || solarAccent)}
            </div>
            <h2 style={sectionTitleStyle(previewTheme)}>{title}</h2>
          </div>
        </div>
        {subtitle ? <p style={helperTextStyle(previewTheme)}>{subtitle}</p> : null}
      </>
    );

    const previewTrackerPageProps = {
      theme: previewTheme,
      chartsPageStyle,
      sectionCardStyle,
      renderSectionHeader: renderPreviewSectionHeader,
      chartToolbarStyle,
      chartRangeOptions,
      rangeChipStyle,
      chartRange,
      setChartRange,
      recentChartData: previewChartData,
      emptyTextStyle,
      chartStackStyle,
      maxMeals: previewMaxMeals,
      maxMeds: previewMaxMeds,
      maxHygiene: previewMaxHygiene,
      maxExercise: previewMaxExercise,
      chartCardStyle,
    };

    return (
      <div className="app-shell" style={pageStyle(previewTheme)} data-testid="charts-preview-page">
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(previewTheme)}>
            <div style={{ display: "grid", gap: "10px" }}>
              <p style={tinyLabelStyle(previewTheme)}>Visual Preview</p>
              <h1 style={titleStyle(previewTheme)}>Galaxy Charts Sandbox</h1>
              <p style={subtitleStyle(previewTheme)}>
                Direct chart preview route for frame and spacing polish, without auth or saved data.
              </p>
              <p style={smallInfoStyle(previewTheme)}>
                Open <code>/dev/charts-preview</code> any time to jump straight into this screen.
              </p>
            </div>
          </div>

          <TrackerChartsPage app={previewTrackerPageProps} />
        </div>
      </div>
    );
  }

  if (isOverviewPreviewMode) {
    const previewTheme = getTrackerExperienceTheme(getAppTheme(true, "galaxy"), true);
    const previewTrackerLabels = getThemeLanguage("galaxy").tracker;
    const renderPreviewSectionHeader = (title, subtitle, solarAccent, galaxyAccent) => (
      <>
        <div style={cardHeaderRowStyle}>
          <div>
            <div style={{ ...emojiStyle, ...getAccentBadgeStyle(previewTheme) }}>
              {getSectionAccentLabel(previewTheme.themeFamily, galaxyAccent || solarAccent)}
            </div>
            <h2 style={sectionTitleStyle(previewTheme)}>{title}</h2>
          </div>
        </div>
        {subtitle ? <p style={helperTextStyle(previewTheme)}>{subtitle}</p> : null}
      </>
    );

    const previewGoals = [
      {
        id: "goal-1",
        name: "Celestial Ritual",
        currentStreakProgress: 4,
        streakLength: 7,
        checkType: "daily",
        completed: false,
      },
      {
        id: "goal-2",
        name: "Moonlight Meals",
        currentStreakProgress: 2,
        streakLength: 5,
        checkType: "daily",
        completed: false,
      },
    ];
    const previewRewards = [{ id: "reward-1", name: "Nova Reward" }];
    const previewDashboardStats = [
      { key: "meds", label: "Meds", value: "Taken", note: "Logged at 8:10 AM" },
      { key: "food", label: "Food", value: "2 meals", note: "Breakfast and lunch logged" },
      { key: "sleep", label: "Sleep", value: "7.5 hrs", note: "Better than yesterday" },
      { key: "mood", label: "Mood", value: "4/5", note: "Calm, focused, and steady" },
    ];
    const previewOverviewProps = {
      theme: previewTheme,
      chartsPageStyle,
      sectionCardStyle,
      renderSectionHeader: renderPreviewSectionHeader,
      dashboardHeroStyle,
      dashboardKickerStyle,
      dashboardHeadingStyle,
      subtitleStyle,
      dashboardPulseStyle,
      dashboardPulseRingStyle,
      dashboardPulseCoreStyle,
      mood: 4,
      dashboardStatsGridStyle,
      dashboardStats: previewDashboardStats,
      summaryCardStyle,
      summaryLabelStyle,
      summaryValueStyle,
      summaryNoteStyle,
      gridStyle,
      trackerLabels: previewTrackerLabels,
      recentMoodSummary: {
        mood: 4,
        focus: 4,
        energy: 3,
        mood_tags: ["steady", "hopeful"],
        entry_date: today,
      },
      smallInfoStyle,
      focus: 4,
      energy: 3,
      moodTags: ["steady", "hopeful"],
      today,
      setActivePage: () => {},
      goals: previewGoals,
      simpleAlignmentStreaks: [],
      emptyTextStyle,
      rewardCardStyle,
      rewardTitleStyle,
      goalMetaStyle,
      goalProgressTrackStyle,
      goalProgressFillStyle,
      rewards: previewRewards,
      nextRewardGoal: previewGoals[0],
      recentActivityItems: [
        { label: "Meals", detail: "Lunch logged at 12:20 PM" },
        { label: "Mood", detail: "Mood updated to 4/5" },
      ],
      supportInbox: [
        { id: "support-1", outsiderName: "Aria", message: "Proud of you for checking in today." },
      ],
      unreadSupportCount: 1,
      connectedOutsiders: [
        { id: "outsider-1", name: "Aria", notificationCap: 3, cooldownLength: 30 },
      ],
      trackedAreas: ["meds", "food", "sleep", "mood"],
      selectedTrackingAreaOptions: TRACKING_AREA_OPTIONS.filter((option) =>
        ["meds", "food", "sleep", "mood"].includes(option.id)
      ),
    };

    return (
      <div className="app-shell" style={pageStyle(previewTheme)} data-testid="overview-preview-page">
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(previewTheme)}>
            <div style={{ display: "grid", gap: "10px" }}>
              <p style={tinyLabelStyle(previewTheme)}>Visual Preview</p>
              <h1 style={titleStyle(previewTheme)}>Galaxy Overview Sandbox</h1>
              <p style={subtitleStyle(previewTheme)}>
                Direct dashboard preview route for the Galaxy tracker card system.
              </p>
              <p style={smallInfoStyle(previewTheme)}>
                Open <code>/dev/overview-preview</code> any time to inspect dashboard cards without auth.
              </p>
            </div>
          </div>

          <TrackerOverviewPage app={previewOverviewProps} />
        </div>
      </div>
    );
  }

  if (isCardsPreviewMode) {
    const previewTheme = getTrackerExperienceTheme(getAppTheme(true, "galaxy"), true);
    const previewTrackerLabels = getThemeLanguage("galaxy").tracker;
    const renderPreviewSectionHeader = (title, subtitle, solarAccent, galaxyAccent) => {
      if (isCelestialGalaxyTrackerTheme(previewTheme)) {
        return (
          <div
            style={{
              paddingTop: "16px",
              paddingLeft: "28px",
              paddingRight: "18px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: previewTheme.trackerAccent,
                fontFamily: previewTheme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: "clamp(1.28rem, 2.9vw, 1.82rem)",
                lineHeight: 1.02,
                textShadow: "0 0 18px rgba(255,240,195,0.16)",
                maxWidth: "min(100%, 360px)",
              }}
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(216,185,255,0.62)",
                  fontSize: "0.92rem",
                  lineHeight: 1.55,
                  maxWidth: "56ch",
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        );
      }

      return (
        <div>
          <div style={cardHeaderRowStyle}>
            <div>
              <div style={{ ...emojiStyle, ...getAccentBadgeStyle(previewTheme) }}>
                {getSectionAccentLabel(
                  previewTheme.themeFamily,
                  galaxyAccent || solarAccent
                )}
              </div>
              <h2 style={sectionTitleStyle(previewTheme)}>{title}</h2>
            </div>
          </div>
          {subtitle ? <p style={helperTextStyle(previewTheme)}>{subtitle}</p> : null}
        </div>
      );
    };

    const previewSharedApp = {
      theme: previewTheme,
      chartsPageStyle,
      sectionCardStyle,
      renderSectionHeader: renderPreviewSectionHeader,
      gridStyle,
      summaryCardStyle,
      summaryLabelStyle,
      summaryNoteStyle,
      summaryValueStyle,
      rewardCardStyle,
      rewardTitleStyle,
      goalMetaStyle,
      goalProgressTrackStyle,
      goalProgressFillStyle,
      goalCardItemStyle,
      mealItemStyle,
      mealListStyle,
      labelStyle,
      inputStyle,
      smallRemoveButtonStyle,
      primaryButtonStyle,
      softButtonStyle,
      successButtonStyle,
      emptyTextStyle,
      smallInfoStyle,
      trackerSectionSwitcherButtonStyle,
      rowStyle,
      sleepGridStyle,
      sliderValueStyle,
      rangeStyle,
      buttonWrapStyle,
      countTextStyle,
      dashboardStatsGridStyle,
      feedbackMessageStyle,
      renderFeedbackMessage: (message) => (message ? <div style={feedbackMessageStyle("info", previewTheme)}>{message}</div> : null),
      trackerLabels: previewTrackerLabels,
      goalFormGridStyle,
      goalSuggestionHeaderStyle,
      tagGroupLabelStyle,
      moodTagGridStyle,
      goalSuggestionButtonStyle,
      rewardGridStyle,
      permissionsGridStyle,
      permissionItemStyle,
    };

    const previewConnectionsApp = {
      ...previewSharedApp,
      connectionsLoading: false,
      connectionsMessage: "",
      generateInviteCode: () => {},
      generateInviteLink: () => {},
      loadConnectionsData: () => {},
      inviteCode: "STAR-ABC123",
      inviteLink: "https://example.com/invite/STAR-ABC123",
      pendingRequests: [{ id: "request-1", name: "Aria", note: "Would like access to your tracker." }],
      requestApproval: () => {},
      rejectRequest: () => {},
      connectedOutsiders: [
        {
          id: "outsider-1",
          name: "Aria",
          nameVisibility: "display",
          notificationCap: 3,
          cooldownLength: 30,
          permissions: { tracker_data: true, support: true },
        },
      ],
      normalizeConnectionPermissions,
      updateOutsiderSetting: () => {},
      updateOutsiderPermission: () => {},
      revokeOutsider: () => {},
      joinCodeInput: "STAR-ABC123",
      setJoinCodeInput: () => {},
      joinByCode: () => {},
      joinLinkInput: "https://example.com/invite/STAR-ABC123",
      setJoinLinkInput: () => {},
      joinByLink: () => {},
    };

    const previewGoalsApp = {
      ...previewSharedApp,
      goalName: "Celestial Ritual",
      setGoalName: () => {},
      goalCategory: "Meds",
      setGoalCategory: () => {},
      goalCategories,
      goalCheckType: "daily",
      setGoalCheckType: () => {},
      goalTargetAmount: "1",
      setGoalTargetAmount: () => {},
      goalStreakLength: "7",
      setGoalStreakLength: () => {},
      refreshGoalSuggestions: () => {},
      goalSuggestions: ["Celestial Ritual", "Moonlight Meals", "Orbit Reset"],
      applyGoalSuggestion: () => {},
      createGoal: () => {},
      goals: [
        {
          id: "goal-1",
          name: "Celestial Ritual",
          category: "Meds",
          checkType: "daily",
          targetAmount: 1,
          currentStreakProgress: 4,
          streakLength: 7,
          completed: false,
        },
        {
          id: "goal-2",
          name: "Moonlight Meals",
          category: "Food",
          checkType: "daily",
          targetAmount: 2,
          currentStreakProgress: 7,
          streakLength: 7,
          completed: true,
          rewardEarned: "Nova Reward",
        },
      ],
      rewards: [{ id: "reward-1", title: "Nova Reward", goalName: "Moonlight Meals", earnedAt: today }],
      removeGoal: () => {},
    };

    const previewTrackingApp = {
      ...previewSharedApp,
      today: "2026-03-25",
      trackerNavItems: [
        { key: "meds", label: "Meds" },
        { key: "food", label: "Food" },
        { key: "appointments", label: "Appointments" },
        { key: "period", label: "Period" },
        { key: "sleep", label: "Sleep" },
      ],
      setActivePage: () => {},
      medTaken: true,
      medsTime: "8:10 AM",
      toggleMed: () => {},
      meds: [{ name: "Vitamin D", dose: "1000 IU", time: "8:10 AM", symptoms: "", notes: "With breakfast" }],
      removeMedication: () => {},
      medName: "",
      setMedName: () => {},
      medDose: "",
      setMedDose: () => {},
      medEntryTime: "",
      setMedEntryTime: () => {},
      medSymptoms: "",
      setMedSymptoms: () => {},
      medNotes: "",
      setMedNotes: () => {},
      handleMedsTimeChange: () => {},
      addMedication: () => {},
      mealText: "",
      setMealText: () => {},
      mealTime: "",
      handleMealTimeChange: () => {},
      addMeal: () => {},
      meals: [{ text: "Bagel and fruit", time: "8:30 AM" }],
      removeMeal: () => {},
      periodCycles: [
        {
          id: "period-cycle-1",
          startDate: "2026-03-25",
          endDate: "",
          flowLevel: "medium",
          symptomTags: ["Cramps", "Fatigue"],
          privateNotes: "Heating pad helped in the evening.",
        },
        {
          id: "period-cycle-2",
          startDate: "2026-02-26",
          endDate: "2026-03-01",
          flowLevel: "light",
          symptomTags: ["Headache"],
          privateNotes: "",
        },
      ],
      activePeriodCycle: {
        id: "period-cycle-1",
        startDate: "2026-03-25",
        endDate: "",
        flowLevel: "medium",
        symptomTags: ["Cramps", "Fatigue"],
        privateNotes: "Heating pad helped in the evening.",
      },
      periodStartDate: "2026-03-25",
      setPeriodStartDate: () => {},
      periodEndDate: "2026-03-30",
      setPeriodEndDate: () => {},
      periodFlowLevel: "medium",
      setPeriodFlowLevel: () => {},
      periodSymptomTags: ["Cramps", "Fatigue"],
      periodPrivateNotes: "Heating pad helped in the evening.",
      setPeriodPrivateNotes: () => {},
      periodStatusMessage: "Period details saved.",
      startPeriodCycle: () => {},
      endPeriodCycle: () => {},
      savePeriodNotesAndSymptoms: () => {},
      togglePeriodSymptomTag: () => {},
      nextCycleEstimateDate: "2026-04-23",
      averageCycleLengthDays: 29,
      appointments: [
        {
          id: "appointment-1",
          itemType: "appointment",
          title: "Therapy session",
          eventDate: "2026-03-31",
          eventTime: "14:00",
          location: "Main Street Office",
          note: "Bring the week summary.",
        },
        {
          id: "appointment-2",
          itemType: "reminder",
          title: "Call pharmacy",
          eventDate: "2026-04-01",
          eventTime: "09:15",
          location: "",
          note: "",
        },
      ],
      editingAppointmentId: null,
      appointmentType: "appointment",
      setAppointmentType: () => {},
      appointmentTitle: "",
      setAppointmentTitle: () => {},
      appointmentDate: "2026-03-31",
      setAppointmentDate: () => {},
      appointmentTime: "14:00",
      setAppointmentTime: () => {},
      appointmentLocation: "",
      setAppointmentLocation: () => {},
      appointmentNote: "",
      setAppointmentNote: () => {},
      appointmentStatusMessage: "Saved.",
      addAppointment: () => {},
      startEditingAppointment: () => {},
      cancelAppointmentEdit: () => {},
      updateAppointment: () => {},
      removeAppointment: () => {},
      bedTime: "23:00",
      handleBedTimeChange: () => {},
      wakeTime: "07:00",
      handleWakeTimeChange: () => {},
      sleepRoutine: "Tea and low lights",
      handleSleepRoutineChange: () => {},
      usedScreensBeforeBed: false,
      toggleUsedScreensBeforeBed: () => {},
      sleepQuality: 4,
      handleSleepQualityChange: () => {},
      showered: true,
      toggleShowered: () => {},
      handleShoweredTimeChange: () => {},
      brushedTeeth: true,
      toggleBrushedTeeth: () => {},
      handleBrushedTeethTimeChange: () => {},
      skincare: false,
      toggleSkincare: () => {},
      handleSkincareTimeChange: () => {},
      showeredTime: "7:40 AM",
      brushedTeethTime: "7:50 AM",
      skincareTime: "",
      laundryDone: false,
      toggleLaundry: () => {},
      handleLaundryTimeChange: () => {},
      bedsheetsDone: false,
      toggleBedsheets: () => {},
      handleBedsheetsTimeChange: () => {},
      roomCleaned: true,
      toggleRoomCleaned: () => {},
      handleRoomCleanedTimeChange: () => {},
      laundryTime: "",
      bedsheetsTime: "",
      roomCleanedTime: "11:20 AM",
      cleaningMinutes: "15",
      handleCleaningMinutesChange: () => {},
      cleaningWorthIt: 4,
      handleCleaningWorthItChange: () => {},
      exerciseDone: true,
      toggleExerciseDone: () => {},
      extraWalk: true,
      toggleExtraWalk: () => {},
      exerciseTime: "6:30 PM",
      handleExerciseTimeChange: () => {},
      exerciseType: "Walk",
      handleExerciseTypeChange: () => {},
      exerciseMinutes: "25",
      handleExerciseMinutesChange: () => {},
      exerciseFeeling: "Looser",
      handleExerciseFeelingChange: () => {},
      afterExerciseState: "Calm",
      handleAfterExerciseStateChange: () => {},
      addExerciseLog: () => {},
      exerciseLogs: [{ type: "Walk", time: "6:30 PM", minutes: 25, feeling: "Looser", extraWalk: true, afterState: "Calm" }],
      removeExerciseLog: () => {},
    };
    previewTrackingApp.calendarEvents = buildCalendarEvents({
      appointments: previewTrackingApp.appointments,
      periodCycles: previewTrackingApp.periodCycles,
      nextCycleEstimateDate: previewTrackingApp.nextCycleEstimateDate,
    });

    const previewSupportApp = {
      ...previewSharedApp,
      supportInboxMessage: "",
      supportInboxLoading: false,
      loadSupportInbox: () => {},
      unreadSupportCount: 2,
      supportInbox: [
        {
          id: "support-msg-1",
          message: "Small steps still count",
          outsiderName: "Lily Mae",
          createdAtLabel: "Mar 22, 1:33 PM",
          readAt: "Mar 22, 1:40 PM",
        },
        {
          id: "support-msg-2",
          message: "Remind: Meds",
          outsiderName: "Lily Mae",
          createdAtLabel: "Mar 22, 1:32 PM",
          readAt: "Mar 22, 1:39 PM",
        },
      ],
      markSupportMessageRead: () => {},
    };

    return (
      <div className="app-shell" style={pageStyle(previewTheme)} data-testid="cards-preview-page">
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(previewTheme)}>
            <div style={{ display: "grid", gap: "10px" }}>
              <p style={tinyLabelStyle(previewTheme)}>Visual Preview</p>
              <h1 style={titleStyle(previewTheme)}>Galaxy Cards Sandbox</h1>
              <p style={subtitleStyle(previewTheme)}>
                Cross-page Galaxy tracker card preview for connections, goals, and tracking surfaces.
              </p>
              <p style={smallInfoStyle(previewTheme)}>
                Open <code>/dev/cards-preview</code> any time to inspect cards beyond the dashboard.
              </p>
            </div>
          </div>

          <TrackerConnectionsPage app={previewConnectionsApp} />
          <TrackerSupportPage app={previewSupportApp} />
          <TrackerGoalsPage app={previewGoalsApp} />
          <TrackerTrackingPage app={previewTrackingApp} pageKey="meds" />
          <TrackerTrackingPage app={previewTrackingApp} pageKey="food" />
          <TrackerTrackingPage app={previewTrackingApp} pageKey="period" />
          <TrackerCalendarPage app={previewTrackingApp} />
          <TrackerTrackingPage app={previewTrackingApp} pageKey="exercise" />
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="app-shell" style={pageStyle(theme)}>
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(theme)}>
            <h1 style={titleStyle(theme)}>Loading your stars...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (session && profileSyncLoading) {
    return (
      <div className="app-shell" style={pageStyle(theme)}>
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(theme)}>
            <h1 style={titleStyle(theme)}>Syncing your profile...</h1>
            <p style={subtitleStyle(theme)}>Making sure your account is ready before loading the tracker.</p>
          </div>
        </div>
      </div>
    );
  }

  if (session && showTrackingAreaPicker) {
    return (
      <div className="app-shell" style={pageStyle(theme)}>
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(theme)}>
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <p style={tinyLabelStyle(theme)}>Tracker Setup</p>
              <h1 style={titleStyle(theme)}>Choose what you actually want to track</h1>
              <p style={subtitleStyle(theme)}>
                Pick the areas that feel useful right now. This chooser only appears until you save it once, and you can add more later in Settings.
              </p>
            </div>
          </div>

          <section className="galaxy-panel" style={sectionCardStyle(theme, "jump")}>
            {renderSectionHeader("Tracking Areas", "Start lean and only keep the areas you want visible in the tracker.", "Areas", "Areas")}
            <div style={dashboardStatsGridStyle}>
              {TRACKING_AREA_OPTIONS.map((area) => {
                const selected = pendingTrackedAreas.includes(area.id);

                return (
                  <button
                    key={area.id}
                    style={{
                      ...summaryCardStyle(theme),
                      textAlign: "left",
                      cursor: "pointer",
                      border: selected ? `2px solid ${theme.primary}` : theme.border,
                      boxShadow: selected
                        ? `0 18px 34px ${theme.glow}, inset 0 0 0 1px rgba(255,255,255,0.06)`
                        : summaryCardStyle(theme).boxShadow,
                    }}
                    onClick={() => togglePendingTrackedArea(area.id)}
                  >
                    <div style={summaryLabelStyle(theme)}>{selected ? "Selected" : "Tap to add"}</div>
                    <div style={summaryValueStyle(theme)}>{area.label}</div>
                    <div style={summaryNoteStyle(theme)}>{area.description}</div>
                  </button>
                );
              })}
            </div>
            {renderFeedbackMessage(trackingAreasMessage, theme)}
            <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={primaryButtonStyle(theme)} onClick={completeTrackingAreaSetup}>
                Save My Tracker Areas
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!session) {
    const authTheme = getAppTheme(signupMode === "dark", signupThemeFamily);

    return (
      <div className="app-shell" style={pageStyle(authTheme)}>
        <style>{appShellStyles}</style>
        <div style={containerStyle}>
          <div style={heroCardStyle(authTheme)}>
            <div>
              <p style={tinyLabelStyle(authTheme)}>Guide to the Galaxies</p>
              <h1 style={titleStyle(authTheme)}>
                {authMode === "login" ? "Welcome back" : "Create your cosmos"}
              </h1>
              <p style={subtitleStyle(authTheme)}>
                {authMode === "login"
                  ? "Sign in to continue your tracker."
                  : "Choose your theme first, then finish your account in a few calm steps."}
              </p>
            </div>

            <div style={headerControlsStyle}>
              <button
                style={navButtonStyle(authMode === "login", authTheme)}
                onClick={() => {
                  setAuthMode("login");
                  setAuthMessage("");
                }}
              >
                Login
              </button>
              <button
                style={navButtonStyle(authMode === "signup", authTheme)}
                onClick={() => {
                  setAuthMode("signup");
                  setAuthMessage("");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

          <section className="galaxy-panel" style={sectionCardStyle(authTheme, "dashboard")}>
            <div style={{ display: "grid", gap: "12px", marginBottom: "18px" }}>
              <div>
                <label style={labelStyle(authTheme)}>Open after login</label>
                <div style={moodTagGridStyle}>
                  {[
                    { id: "tracker", label: "Tracker" },
                    { id: "outsider", label: "Outsider" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      style={moodTagButtonStyle(selectedExperience === option.id, authTheme)}
                      onClick={() => setSelectedExperience(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <p style={smallInfoStyle(authTheme)}>
                Tracker opens the full self-tracking app. Outsider opens the support-focused app.
              </p>
            </div>
            {authMode === "login" ? (
              <form
                style={goalFormGridStyle}
                onSubmit={(event) => {
                  event.preventDefault();
                  handleLogin();
                }}
              >
                <div>
                  <label htmlFor="auth-login-email" style={labelStyle(authTheme)}>Email</label>
                  <input
                    id="auth-login-email"
                    style={inputStyle(authTheme)}
                    type="email"
                    name="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="auth-login-password" style={labelStyle(authTheme)}>Password</label>
                  <input
                    id="auth-login-password"
                    style={inputStyle(authTheme)}
                    type="password"
                    name="current-password"
                    autoComplete="current-password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <button type="submit" style={primaryButtonStyle(authTheme)}>
                    Login
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "grid", gap: "18px" }}>
                {signupStep === 1 && (
                  <div style={{ display: "grid", gap: "18px" }}>
                    <div>
                      <label style={labelStyle(authTheme)}>Theme family</label>
                      <div style={moodTagGridStyle}>
                        {["galaxy", "underwater", "forest"].map((option) => (
                          <button
                            key={option}
                            style={moodTagButtonStyle(signupThemeFamily === option, authTheme)}
                            onClick={() => setSignupThemeFamily(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle(authTheme)}>Starting mode</label>
                      <div style={moodTagGridStyle}>
                        {["dark", "light"].map((option) => (
                          <button
                            key={option}
                            style={moodTagButtonStyle(signupMode === option, authTheme)}
                            onClick={() => setSignupMode(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button style={primaryButtonStyle(authTheme)} onClick={() => setSignupStep(2)}>
                      Continue to account
                    </button>
                  </div>
                )}

                {signupStep === 2 && (
                  <form
                    style={goalFormGridStyle}
                    onSubmit={(event) => {
                      event.preventDefault();
                      setSignupStep(3);
                    }}
                  >
                    <div>
                      <label htmlFor="auth-signup-email" style={labelStyle(authTheme)}>Email</label>
                      <input
                        id="auth-signup-email"
                        style={inputStyle(authTheme)}
                        type="email"
                        name="email"
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck="false"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="auth-signup-password" style={labelStyle(authTheme)}>Password</label>
                      <input
                        id="auth-signup-password"
                        style={inputStyle(authTheme)}
                        type="password"
                        name="new-password"
                        autoComplete="new-password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label htmlFor="auth-signup-confirm-password" style={labelStyle(authTheme)}>Confirm password</label>
                      <input
                        id="auth-signup-confirm-password"
                        style={inputStyle(authTheme)}
                        type="password"
                        name="confirm-password"
                        autoComplete="new-password"
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button type="button" style={softButtonStyle(authTheme)} onClick={() => setSignupStep(1)}>
                        Back
                      </button>
                      <button type="submit" style={primaryButtonStyle(authTheme)}>
                        Continue to profile
                      </button>
                    </div>
                  </form>
                )}

                {signupStep === 3 && (
                  <form
                    style={goalFormGridStyle}
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSignup();
                    }}
                  >
                    <div>
                      <label htmlFor="auth-signup-display-name" style={labelStyle(authTheme)}>Display name</label>
                      <input
                        id="auth-signup-display-name"
                        style={inputStyle(authTheme)}
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="auth-signup-secondary-display-name" style={labelStyle(authTheme)}>Secondary display name</label>
                      <input
                        id="auth-signup-secondary-display-name"
                        style={inputStyle(authTheme)}
                        type="text"
                        name="nickname"
                        autoComplete="nickname"
                        value={secondaryDisplayName}
                        onChange={(e) => setSecondaryDisplayName(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label htmlFor="auth-signup-pin" style={labelStyle(authTheme)}>PIN</label>
                      <input
                        id="auth-signup-pin"
                        style={inputStyle(authTheme)}
                        type="password"
                        name="account-pin"
                        autoComplete="off"
                        inputMode="numeric"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="4 to 8 digits"
                      />
                    </div>
                    <div>
                      <label htmlFor="auth-signup-confirm-pin" style={labelStyle(authTheme)}>Confirm PIN</label>
                      <input
                        id="auth-signup-confirm-pin"
                        style={inputStyle(authTheme)}
                        type="password"
                        name="account-pin-confirmation"
                        autoComplete="off"
                        inputMode="numeric"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="Confirm PIN"
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button type="button" style={softButtonStyle(authTheme)} onClick={() => setSignupStep(2)}>
                        Back
                      </button>
                      <button type="submit" style={primaryButtonStyle(authTheme)}>
                        Create account
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {renderFeedbackMessage(authMessage, authTheme)}
          </section>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-shell" style={pageStyle(theme)}>
        <div style={containerStyle}>
          <div style={heroCardStyle(theme)}>
            <h1 style={titleStyle(theme)}>Loading your tracker...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" style={pageStyle(theme)}>
      <style>{appShellStyles}</style>
      {rewardPopup ? (
        <div style={popupOverlayStyle}>
          <div style={popupCardStyle(theme)}>
            <p style={tinyLabelStyle(theme)}>
              {`${getThemeRewardCopy(themeFamily).singular} Unlocked`}
            </p>
            <h2 style={sectionTitleStyle(theme)}>{rewardPopup.message}</h2>
            <p style={subtitleStyle(theme)}>{rewardPopup.reward.title}</p>
            <p style={smallInfoStyle(theme)}>From goal: {rewardPopup.reward.goalName}</p>
            <div style={{ marginTop: "18px" }}>
              <button
                style={primaryButtonStyle(theme)}
                onClick={() => setRewardPopup(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {appExperience === "outsider" ? (
        <OutsiderLayout
          theme={theme}
          title="Outsider Support App"
          subtitle="A calmer support-focused experience for connected trackers."
          today={today}
          selectedTrackerName={selectedOutsider?.name || ""}
          outsiderPage={outsiderPage}
          setOutsiderPage={setOutsiderPage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          loadOutsiderTrackers={loadOutsiderTrackers}
          setAppExperience={setAppExperience}
          outsiderMessage={outsiderMessage}
          containerStyle={containerStyle}
          heroCardStyle={heroCardStyle}
          tinyLabelStyle={tinyLabelStyle}
          titleStyle={titleStyle}
          subtitleStyle={subtitleStyle}
          dateStyle={dateStyle}
          lastActionStyle={lastActionStyle}
          headerControlsStyle={headerControlsStyle}
          navButtonStyle={navButtonStyle}
          themeToggleStyle={themeToggleStyle}
          softButtonStyle={softButtonStyle}
          handleLogout={handleLogout}
          showOutsiderTutorial={showOutsiderTutorial}
          startOutsiderTutorial={startOutsiderTutorial}
        >
          {outsiderPageContent}
        </OutsiderLayout>
      ) : (
        <TrackerLayout
          theme={theme}
          title="Daily Navigation Console"
          subtitle={
            themeFamily === "underwater"
              ? "Fluid, calm, and built for steady progress."
              : themeFamily === "forest"
              ? "Grounded, gentle, and built for steady progress."
              : "Layered, calm, and built for gentle progress."
          }
          today={today}
          lastAction={lastAction}
          status={status}
          activePage={activePage}
          setActivePage={setActivePage}
          trackerNavItems={trackerNavItems}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setAppExperience={setAppExperience}
          containerStyle={containerStyle}
          heroCardStyle={heroCardStyle}
          tinyLabelStyle={tinyLabelStyle}
          titleStyle={titleStyle}
          subtitleStyle={subtitleStyle}
          dateStyle={dateStyle}
          lastActionStyle={lastActionStyle}
          headerControlsStyle={headerControlsStyle}
          navButtonStyle={navButtonStyle}
          themeToggleStyle={themeToggleStyle}
          softButtonStyle={softButtonStyle}
          statusBadgeStyle={statusBadgeStyle}
          tutorialActive={hideTrackerNavForTutorial}
        >
          {currentPageContent}
        </TrackerLayout>
      )}

      {session && appExperience === "tracker" && showTrackerTutorial && trackerTutorialStep ? (
        <div
          style={{
            ...popupOverlayStyle,
            background: tutorialIsMobile ? "rgba(6, 10, 18, 0.56)" : "rgba(4, 8, 18, 0.32)",
            zIndex: 41,
            alignItems: tutorialIsMobile ? "end" : undefined,
            padding: tutorialIsMobile ? "0" : popupOverlayStyle.padding,
          }}
        >
          <div style={getTutorialSpotlightStyle(trackerTutorialStep.spotlightRegion)} />
          {!tutorialIsMobile ? (
            <div style={getTutorialSpotlightBadgeStyle(trackerTutorialStep.spotlightRegion)}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 14px",
                  borderRadius: "999px",
                  background: "rgba(8, 12, 24, 0.94)",
                  color: "#ffffff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: theme.primary,
                    boxShadow: `0 0 18px ${theme.glow}`,
                  }}
                />
                Look Here
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "18px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "2px",
                    background:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 8px, rgba(255,255,255,0) 8px 14px)",
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45))",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.95)",
                    background: "rgba(255,255,255,0.12)",
                    boxShadow: `0 0 0 6px rgba(255,255,255,0.08), 0 0 18px ${theme.glow}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "3px",
                      borderRadius: "50%",
                      background: theme.primary,
                      boxShadow: `0 0 12px ${theme.glow}`,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderLeft: "12px solid rgba(255,255,255,0.95)",
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.35))",
                  }}
                />
              </div>
            </div>
          ) : null}
          <div
            style={{
              ...popupCardStyle(theme),
              textAlign: "left",
              width: tutorialIsMobile ? "calc(100vw - 16px)" : "min(560px, calc(100vw - 32px))",
              position: "fixed",
              zIndex: 42,
              margin: 0,
              padding: tutorialIsMobile ? "18px 16px 18px" : popupCardStyle(theme).padding,
              maxHeight:
                tutorialIsMobile ? "min(48vh, 420px)" : "calc(100vh - 48px)",
              overflowY: "auto",
              borderRadius: tutorialIsMobile ? "22px 22px 18px 18px" : popupCardStyle(theme).borderRadius,
              boxShadow: tutorialIsMobile
                ? "0 -18px 48px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                : popupCardStyle(theme).boxShadow,
              background: tutorialIsMobile
                ? darkModeSafe(
                    theme,
                    "linear-gradient(180deg, rgba(15, 18, 34, 0.98) 0%, rgba(10, 12, 24, 0.99) 100%)",
                    "linear-gradient(180deg, rgba(255, 247, 226, 0.985) 0%, rgba(245, 231, 196, 0.992) 100%)"
                  )
                : popupCardStyle(theme).background,
              border: tutorialIsMobile
                ? darkModeSafe(
                    theme,
                    "1px solid rgba(154, 167, 255, 0.16)",
                    "1px solid rgba(176, 122, 24, 0.18)"
                  )
                : popupCardStyle(theme).border,
              ...getTutorialCalloutPositionStyle(trackerTutorialStep.calloutPosition),
            }}
          >
            <p
              style={{
                ...tinyLabelStyle(theme),
                color: tutorialIsMobile ? theme.subtleText : tinyLabelStyle(theme).color,
                letterSpacing: tutorialIsMobile ? "0.16em" : tinyLabelStyle(theme).letterSpacing,
              }}
            >
              Tutorial Step {trackerTutorialStepIndex + 1} of {trackerTutorialSteps.length}
            </p>
            {tutorialIsMobile ? (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px 13px",
                  borderRadius: "14px",
                  background: darkModeSafe(
                    theme,
                    "rgba(255,255,255,0.05)",
                    "rgba(255,255,255,0.46)"
                  ),
                  border: darkModeSafe(
                    theme,
                    "1px solid rgba(255,255,255,0.06)",
                    "1px solid rgba(176, 122, 24, 0.12)"
                  ),
                  color: theme.subtleText,
                  fontSize: "0.84rem",
                  lineHeight: 1.5,
                }}
              >
                You can keep using the page normally while this walkthrough explains what matters here.
              </div>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                  color: theme.subtleText,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: theme.primary,
                    boxShadow: `0 0 16px ${theme.glow}`,
                  }}
                />
                Look at the highlighted area
              </div>
            )}
            <h2
              style={{
                ...sectionTitleStyle(theme),
                marginTop: tutorialIsMobile ? "14px" : "8px",
                fontSize: tutorialIsMobile ? "1.45rem" : sectionTitleStyle(theme).fontSize,
                lineHeight: tutorialIsMobile ? 1.1 : sectionTitleStyle(theme).lineHeight,
              }}
            >
              {trackerTutorialStep.title}
            </h2>
            <p
              style={{
                ...smallInfoStyle(theme),
                marginTop: tutorialIsMobile ? "12px" : "10px",
                lineHeight: tutorialIsMobile ? 1.62 : 1.7,
                fontSize: tutorialIsMobile ? "0.98rem" : smallInfoStyle(theme).fontSize,
              }}
            >
              {trackerTutorialStep.body}
            </p>
            <div
              style={{
                display: "flex",
                gap: tutorialIsMobile ? "10px" : "8px",
                flexWrap: tutorialIsMobile ? "nowrap" : "wrap",
                marginTop: tutorialIsMobile ? "16px" : "14px",
                overflowX: tutorialIsMobile ? "auto" : "visible",
                paddingBottom: tutorialIsMobile ? "6px" : 0,
              }}
            >
              {trackerTutorialSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToTrackerTutorialStep(index)}
                  style={{
                    border: theme.border,
                    background:
                      index === trackerTutorialStepIndex
                        ? theme.primary
                        : theme.softButtonBackground,
                    color:
                      index === trackerTutorialStepIndex
                        ? theme.primaryText
                        : theme.softButtonText,
                    borderRadius: "999px",
                    padding: tutorialIsMobile ? "8px 12px" : "8px 12px",
                    fontSize: tutorialIsMobile ? "0.78rem" : "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    minWidth: tutorialIsMobile ? "44px" : "auto",
                    flex: "0 0 auto",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div
              style={{
                ...summaryCardStyle(theme),
                marginTop: tutorialIsMobile ? "18px" : "16px",
                background: tutorialIsMobile
                  ? darkModeSafe(
                      theme,
                      "rgba(255,255,255,0.045)",
                      "rgba(255,255,255,0.42)"
                    )
                  : summaryCardStyle(theme).background,
                border: tutorialIsMobile
                  ? darkModeSafe(
                      theme,
                      "1px solid rgba(255,255,255,0.06)",
                      "1px solid rgba(176, 122, 24, 0.12)"
                    )
                  : summaryCardStyle(theme).border,
              }}
            >
              <div style={summaryLabelStyle(theme)}>{tutorialIsMobile ? "Tutorial page" : "Current page"}</div>
              <div style={summaryValueStyle(theme)}>
                {trackerNavItems.find((item) => item.key === trackerTutorialStep.pageKey)?.label ||
                  "Overview"}
              </div>
              <div style={summaryNoteStyle(theme)}>
                {tutorialIsMobile
                  ? "The tutorial will move between pages for you, but the page itself stays usable underneath."
                  : "The tutorial can move you between pages while you test it."}
              </div>
            </div>
            {Array.isArray(trackerTutorialStep.focusItems) &&
            trackerTutorialStep.focusItems.length > 0 ? (
              <div
                style={{
                  ...summaryCardStyle(theme),
                  marginTop: tutorialIsMobile ? "16px" : "14px",
                  background: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "rgba(255,255,255,0.045)",
                        "rgba(255,255,255,0.42)"
                      )
                    : summaryCardStyle(theme).background,
                  border: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "1px solid rgba(255,255,255,0.06)",
                        "1px solid rgba(176, 122, 24, 0.12)"
                      )
                    : summaryCardStyle(theme).border,
                }}
              >
                <div style={summaryLabelStyle(theme)}>
                  {trackerTutorialStep.focusLabel || "What to notice"}
                </div>
                <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                  {trackerTutorialStep.focusItems.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        color: theme.text,
                        lineHeight: 1.55,
                        fontSize: "0.95rem",
                      }}
                    >
                      <span style={{ color: theme.primary, fontWeight: 700 }}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {trackerTutorialStep.tip ? (
              <div
                style={{
                  marginTop: tutorialIsMobile ? "16px" : "14px",
                  padding: tutorialIsMobile ? "14px" : "14px 16px",
                  borderRadius: "18px",
                  background: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "rgba(255,255,255,0.045)",
                        "rgba(255,255,255,0.42)"
                      )
                    : theme.itemBackground,
                  border: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "1px solid rgba(255,255,255,0.06)",
                        "1px solid rgba(176, 122, 24, 0.12)"
                      )
                    : theme.border,
                  color: theme.subtleText,
                  lineHeight: 1.6,
                  fontSize: "0.92rem",
                }}
              >
                <strong style={{ color: theme.text }}>Tip:</strong> {trackerTutorialStep.tip}
              </div>
            ) : null}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: tutorialIsMobile ? "1fr 1fr" : "repeat(4, max-content)",
                gap: "10px",
                marginTop: tutorialIsMobile ? "20px" : "18px",
                justifyContent: tutorialIsMobile ? "stretch" : "start",
              }}
            >
              <button
                style={{ ...softButtonStyle(theme), width: tutorialIsMobile ? "100%" : softButtonStyle(theme).width }}
                onClick={() => setActivePage(trackerTutorialStep.pageKey || "mission")}
              >
                Open This Page Again
              </button>
              <button
                style={{ ...softButtonStyle(theme), width: tutorialIsMobile ? "100%" : softButtonStyle(theme).width }}
                onClick={goToPreviousTrackerTutorialStep}
                disabled={trackerTutorialStepIndex === 0}
              >
                Back
              </button>
              <button
                style={{ ...primaryButtonStyle(theme), width: tutorialIsMobile ? "100%" : primaryButtonStyle(theme).width }}
                onClick={goToNextTrackerTutorialStep}
              >
                {trackerTutorialStepIndex === trackerTutorialSteps.length - 1
                  ? "Finish Tutorial"
                  : "Next"}
              </button>
              <button
                style={{ ...smallRemoveButtonStyle(theme), width: tutorialIsMobile ? "100%" : smallRemoveButtonStyle(theme).width }}
                onClick={() => closeTrackerTutorial(false)}
              >
                Close For Now
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {session && appExperience === "outsider" && showOutsiderTutorial && outsiderTutorialStep ? (
        <div
          style={{
            ...popupOverlayStyle,
            background: tutorialIsMobile ? "rgba(6, 10, 18, 0.62)" : "rgba(6, 10, 18, 0.54)",
            zIndex: 41,
            alignItems: tutorialIsMobile ? "end" : "center",
            padding: tutorialIsMobile ? "0" : popupOverlayStyle.padding,
          }}
        >
          {!tutorialIsMobile ? (
            <>
              <div style={getTutorialSpotlightStyle(outsiderTutorialStep.spotlightRegion)} />
              <div style={getTutorialSpotlightBadgeStyle(outsiderTutorialStep.spotlightRegion)}>
                <div
                  style={{
                    background: darkModeSafe(
                      theme,
                      "rgba(7, 11, 18, 0.9)",
                      "rgba(255,255,255,0.92)"
                    ),
                    color: theme.text,
                    borderRadius: "999px",
                    padding: "10px 16px",
                    border: theme.border,
                    boxShadow: theme.heroShadow,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Outsider walkthrough
                </div>
              </div>
            </>
          ) : null}
          <div
            style={{
              ...popupCardStyle(theme),
              textAlign: "left",
              width: tutorialIsMobile ? "calc(100vw - 16px)" : "min(560px, calc(100vw - 32px))",
              position: "fixed",
              zIndex: 42,
              margin: 0,
              padding: tutorialIsMobile ? "18px 16px 18px" : popupCardStyle(theme).padding,
              maxHeight: tutorialIsMobile ? "min(54vh, 460px)" : "calc(100vh - 48px)",
              overflowY: "auto",
              borderRadius: tutorialIsMobile ? "22px 22px 18px 18px" : popupCardStyle(theme).borderRadius,
              boxShadow: tutorialIsMobile
                ? "0 -18px 48px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                : popupCardStyle(theme).boxShadow,
              background: tutorialIsMobile
                ? darkModeSafe(
                    theme,
                    "linear-gradient(180deg, rgba(13, 18, 27, 0.985) 0%, rgba(8, 12, 18, 0.995) 100%)",
                    "linear-gradient(180deg, rgba(250, 246, 236, 0.99) 0%, rgba(233, 227, 212, 0.995) 100%)"
                  )
                : popupCardStyle(theme).background,
              border: tutorialIsMobile
                ? darkModeSafe(
                    theme,
                    "1px solid rgba(103, 222, 185, 0.16)",
                    "1px solid rgba(98, 88, 66, 0.18)"
                  )
                : popupCardStyle(theme).border,
              ...getTutorialCalloutPositionStyle(outsiderTutorialStep.calloutPosition),
            }}
          >
            <p
              style={{
                ...tinyLabelStyle(theme),
                color: tutorialIsMobile ? theme.subtleText : tinyLabelStyle(theme).color,
                letterSpacing: tutorialIsMobile ? "0.16em" : tinyLabelStyle(theme).letterSpacing,
              }}
            >
              Outsider Tutorial Step {outsiderTutorialStepIndex + 1} of {outsiderTutorialSteps.length}
            </p>
            <div
              style={{
                marginTop: tutorialIsMobile ? "12px" : "8px",
                padding: tutorialIsMobile ? "12px 13px" : "12px 14px",
                borderRadius: "14px",
                background: darkModeSafe(
                  theme,
                  "rgba(255,255,255,0.05)",
                  "rgba(255,255,255,0.46)"
                ),
                border: darkModeSafe(
                  theme,
                  "1px solid rgba(255,255,255,0.06)",
                  "1px solid rgba(98, 88, 66, 0.12)"
                ),
                color: theme.subtleText,
                fontSize: tutorialIsMobile ? "0.84rem" : "0.9rem",
                lineHeight: 1.55,
              }}
            >
              This walkthrough will move between outsider pages so each support tool makes sense in context.
            </div>
            <h2
              style={{
                ...sectionTitleStyle(theme),
                marginTop: tutorialIsMobile ? "14px" : "8px",
                fontSize: tutorialIsMobile ? "1.45rem" : sectionTitleStyle(theme).fontSize,
                lineHeight: tutorialIsMobile ? 1.1 : sectionTitleStyle(theme).lineHeight,
              }}
            >
              {outsiderTutorialStep.title}
            </h2>
            <p
              style={{
                ...smallInfoStyle(theme),
                marginTop: tutorialIsMobile ? "12px" : "10px",
                lineHeight: tutorialIsMobile ? 1.62 : 1.7,
                fontSize: tutorialIsMobile ? "0.98rem" : smallInfoStyle(theme).fontSize,
              }}
            >
              {outsiderTutorialStep.body}
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: tutorialIsMobile ? "nowrap" : "wrap",
                marginTop: "16px",
                overflowX: tutorialIsMobile ? "auto" : "visible",
                paddingBottom: tutorialIsMobile ? "6px" : 0,
              }}
            >
              {outsiderTutorialSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToOutsiderTutorialStep(index)}
                  style={{
                    border: theme.border,
                    background:
                      index === outsiderTutorialStepIndex
                        ? theme.primary
                        : theme.softButtonBackground,
                    color:
                      index === outsiderTutorialStepIndex
                        ? theme.primaryText
                        : theme.softButtonText,
                    borderRadius: "999px",
                    padding: "8px 12px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    minWidth: tutorialIsMobile ? "44px" : "auto",
                    flex: "0 0 auto",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div
              style={{
                ...summaryCardStyle(theme),
                marginTop: "18px",
                background: tutorialIsMobile
                  ? darkModeSafe(
                      theme,
                      "rgba(255,255,255,0.045)",
                      "rgba(255,255,255,0.42)"
                    )
                  : summaryCardStyle(theme).background,
                border: tutorialIsMobile
                  ? darkModeSafe(
                      theme,
                      "1px solid rgba(255,255,255,0.06)",
                      "1px solid rgba(98, 88, 66, 0.12)"
                    )
                  : summaryCardStyle(theme).border,
              }}
            >
              <div style={summaryLabelStyle(theme)}>{tutorialIsMobile ? "Tutorial page" : "Current outsider page"}</div>
              <div style={summaryValueStyle(theme)}>
                {outsiderTutorialStep.pageLabel}
              </div>
              <div style={summaryNoteStyle(theme)}>
                {outsiderTutorialStep.pageNote}
              </div>
            </div>
            {Array.isArray(outsiderTutorialStep.focusItems) && outsiderTutorialStep.focusItems.length > 0 ? (
              <div
                style={{
                  ...summaryCardStyle(theme),
                  marginTop: "16px",
                  background: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "rgba(255,255,255,0.045)",
                        "rgba(255,255,255,0.42)"
                      )
                    : summaryCardStyle(theme).background,
                  border: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "1px solid rgba(255,255,255,0.06)",
                        "1px solid rgba(98, 88, 66, 0.12)"
                      )
                    : summaryCardStyle(theme).border,
                }}
              >
                <div style={summaryLabelStyle(theme)}>
                  {outsiderTutorialStep.focusLabel || "What to notice"}
                </div>
                <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                  {outsiderTutorialStep.focusItems.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        color: theme.text,
                        lineHeight: 1.55,
                        fontSize: "0.95rem",
                      }}
                    >
                      <span style={{ color: theme.primary, fontWeight: 700 }}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {outsiderTutorialStep.tip ? (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "18px",
                  background: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "rgba(255,255,255,0.045)",
                        "rgba(255,255,255,0.42)"
                      )
                    : theme.itemBackground,
                  border: tutorialIsMobile
                    ? darkModeSafe(
                        theme,
                        "1px solid rgba(255,255,255,0.06)",
                        "1px solid rgba(98, 88, 66, 0.12)"
                      )
                    : theme.border,
                  color: theme.subtleText,
                  lineHeight: 1.6,
                  fontSize: "0.92rem",
                }}
              >
                <strong style={{ color: theme.text }}>Tip:</strong> {outsiderTutorialStep.tip}
              </div>
            ) : null}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: tutorialIsMobile ? "1fr 1fr" : "repeat(4, max-content)",
                gap: "10px",
                marginTop: "20px",
                justifyContent: tutorialIsMobile ? "stretch" : "start",
              }}
            >
              <button
                style={{ ...softButtonStyle(theme), width: tutorialIsMobile ? "100%" : softButtonStyle(theme).width }}
                onClick={() => setOutsiderPage(outsiderTutorialStep.pageKey || "outsiderOverview")}
              >
                Open This Page Again
              </button>
              <button
                style={{ ...softButtonStyle(theme), width: tutorialIsMobile ? "100%" : softButtonStyle(theme).width }}
                onClick={goToPreviousOutsiderTutorialStep}
                disabled={outsiderTutorialStepIndex === 0}
              >
                Back
              </button>
              <button
                style={{ ...primaryButtonStyle(theme), width: tutorialIsMobile ? "100%" : primaryButtonStyle(theme).width }}
                onClick={goToNextOutsiderTutorialStep}
              >
                {outsiderTutorialStepIndex === outsiderTutorialSteps.length - 1
                  ? "Finish Tutorial"
                  : "Next"}
              </button>
              <button
                style={{ ...smallRemoveButtonStyle(theme), width: tutorialIsMobile ? "100%" : smallRemoveButtonStyle(theme).width }}
                onClick={() => closeOutsiderTutorial(false)}
              >
                Close For Now
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showOutsiderChooser && outsiderPeople.length > 0 ? (
        <div style={popupOverlayStyle}>
          <div style={popupCardStyle(theme)}>
            <p style={tinyLabelStyle(theme)}>Select Tracker</p>
            <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
              {outsiderPeople.map((person) => (
                <button
                  key={person.id}
                  style={person.id === selectedOutsiderId ? primaryButtonStyle(theme) : softButtonStyle(theme)}
                  onClick={() => {
                    setSelectedOutsiderId(person.id);
                    setShowOutsiderChooser(false);
                  }}
                >
                  {person.name}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "14px" }}>
              <button
                style={smallRemoveButtonStyle(theme)}
                onClick={() => setShowOutsiderChooser(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pinApprovalTarget ? (
        <div style={popupOverlayStyle}>
          <div style={popupCardStyle(theme)}>
            <p style={tinyLabelStyle(theme)}>PIN Confirmation</p>
            <p style={smallInfoStyle(theme)}>Enter your current PIN to approve this request.</p>
            <div style={{ marginTop: "14px" }}>
              <input
                style={inputStyle(theme)}
                type="password"
                inputMode="numeric"
                value={approvalPinInput}
                onChange={(e) => setApprovalPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Current PIN"
              />
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
              <button style={primaryButtonStyle(theme)} onClick={confirmApproveRequest}>
                Approve Request
              </button>
              <button
                style={softButtonStyle(theme)}
                onClick={() => {
                  setPinApprovalTarget(null);
                  setApprovalPinInput("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const mellowLightTheme = {
  modeName: "Solar",
  pageBackground:
    "radial-gradient(circle at 12% 18%, rgba(255,244,188,0.95) 0%, rgba(255,244,188,0) 22%), radial-gradient(circle at 82% 14%, rgba(255,214,163,0.82) 0%, rgba(255,214,163,0) 24%), radial-gradient(circle at 68% 72%, rgba(181,220,255,0.38) 0%, rgba(181,220,255,0) 28%), linear-gradient(180deg, #fff7df 0%, #ffe9cf 40%, #f8eadf 72%, #f4efe6 100%)",
  heroBackground:
    "linear-gradient(145deg, rgba(255,248,230,0.98) 0%, rgba(255,236,205,0.92) 55%, rgba(255,224,191,0.9) 100%)",
  cardBackground:
    "linear-gradient(180deg, rgba(255,252,244,0.94) 0%, rgba(255,242,224,0.9) 100%)",
  text: "#35281d",
  subtleText: "#675241",
  faintText: "#8a6f5d",
  inputBackground: "rgba(255,253,247,0.88)",
  inputBorder: "#e9cfa7",
  itemBackground: "rgba(255,245,230,0.82)",
  softButtonBackground: "linear-gradient(180deg, #f8e4bf 0%, #f2d4a5 100%)",
  softButtonText: "#503521",
  navInactive: "rgba(255,239,212,0.7)",
  navActive: "linear-gradient(135deg, #f6c76f 0%, #ee9c64 100%)",
  navText: "#4b2c13",
  toggleBackground: "linear-gradient(135deg, #ffdf84 0%, #f4a261 100%)",
  toggleText: "#4a2816",
  primary: "linear-gradient(135deg, #f7bf65 0%, #e89068 100%)",
  primaryText: "#fff9ef",
  success: "#d98f47",
  shadow: "0 22px 42px rgba(184,121,62,0.18)",
  heroShadow: "0 28px 60px rgba(200,131,70,0.2)",
  border: "1px solid rgba(191,134,78,0.18)",
  track: "#efd4b0",
  star: "rgba(255,255,255,0.7)",
  glow: "rgba(255,196,98,0.3)",
  chartGrid: "rgba(142,103,54,0.14)",
  chartLabel: "#6e5846",
  chartSurface: "rgba(255,250,241,0.72)",
  chartPalette: {
    mood: "#f4a261",
    focus: "#6ca6c9",
    energy: "#efb94d",
    meals: "#d8894f",
    meds: "#d66f66",
    hygiene: "#86a96b",
    exercise: "#9d7bd8",
  },
};

const mellowDarkTheme = {
  modeName: "Galaxy",
  pageBackground:
    "radial-gradient(circle at 18% 18%, rgba(108,81,255,0.28) 0%, rgba(108,81,255,0) 24%), radial-gradient(circle at 82% 20%, rgba(56,139,255,0.2) 0%, rgba(56,139,255,0) 22%), radial-gradient(circle at 60% 75%, rgba(204,91,255,0.14) 0%, rgba(204,91,255,0) 28%), linear-gradient(180deg, #0a1024 0%, #101834 42%, #131d3d 72%, #111831 100%)",
  heroBackground:
    "linear-gradient(145deg, rgba(20,28,56,0.96) 0%, rgba(30,39,77,0.93) 55%, rgba(39,47,93,0.9) 100%)",
  cardBackground:
    "linear-gradient(180deg, rgba(18,24,48,0.92) 0%, rgba(26,33,63,0.88) 100%)",
  text: "#eef1ff",
  subtleText: "#c5c9ea",
  faintText: "#98a3cf",
  inputBackground: "rgba(14,18,39,0.9)",
  inputBorder: "#33406f",
  itemBackground: "rgba(19,26,52,0.82)",
  softButtonBackground: "linear-gradient(180deg, #26315f 0%, #202951 100%)",
  softButtonText: "#eef1ff",
  navInactive: "rgba(36,46,91,0.72)",
  navActive: "linear-gradient(135deg, #6c63ff 0%, #4cc9f0 100%)",
  navText: "#eef2ff",
  toggleBackground: "linear-gradient(135deg, #7b6dff 0%, #4cc9f0 100%)",
  toggleText: "#091226",
  primary: "linear-gradient(135deg, #6c63ff 0%, #5ac8fa 100%)",
  primaryText: "#f7fbff",
  success: "#69c9b2",
  shadow: "0 24px 46px rgba(2,6,22,0.45)",
  heroShadow: "0 30px 70px rgba(0,0,0,0.42)",
  border: "1px solid rgba(154,171,255,0.12)",
  track: "#28335a",
  star: "rgba(255,255,255,0.8)",
  glow: "rgba(110,99,255,0.28)",
  chartGrid: "rgba(154,171,255,0.16)",
  chartLabel: "#bac5f1",
  chartSurface: "rgba(12,17,36,0.72)",
  chartPalette: {
    mood: "#f5a3ff",
    focus: "#72d0ff",
    energy: "#ffd166",
    meals: "#ff9f6e",
    meds: "#ff7b89",
    hygiene: "#76d39f",
    exercise: "#9d8cff",
  },
};

const themeFamilyOverrides = {
  galaxy: {
    light: {
      themeFamily: "galaxy",
      pageBackground:
        "radial-gradient(circle at 12% 18%, rgba(255,236,182,0.78) 0%, rgba(255,236,182,0) 18%), radial-gradient(circle at 78% 16%, rgba(191,210,255,0.46) 0%, rgba(191,210,255,0) 26%), radial-gradient(circle at 66% 72%, rgba(228,199,255,0.32) 0%, rgba(228,199,255,0) 28%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #fff8e7 0%, #f6effd 38%, #ece7fb 72%, #e6e1f6 100%)",
      heroBackground:
        "radial-gradient(circle at 80% 20%, rgba(255,235,173,0.24) 0%, rgba(255,235,173,0) 26%), linear-gradient(145deg, rgba(255,249,236,0.98) 0%, rgba(246,239,255,0.94) 55%, rgba(238,232,252,0.92) 100%)",
      cardBackground:
        "radial-gradient(circle at 14% 16%, rgba(255,224,154,0.18) 0%, rgba(255,224,154,0) 28%), linear-gradient(180deg, rgba(255,252,246,0.96) 0%, rgba(243,238,254,0.92) 100%)",
      navInactive: "rgba(246,240,255,0.78)",
      itemBackground: "rgba(249,244,255,0.82)",
      softButtonBackground: "linear-gradient(180deg, #f9ecff 0%, #eadbff 100%)",
      softButtonText: "#493766",
      border: "1px solid rgba(173,156,224,0.22)",
      shadow: "0 24px 40px rgba(151,120,214,0.16)",
      heroShadow: "0 30px 56px rgba(152,118,214,0.18)",
      glow: "rgba(178,144,255,0.24)",
      heroRadius: "32px 42px 34px 46px / 34px 30px 44px 38px",
      featureRadius: "28px 36px 30px 42px / 34px 28px 40px 32px",
      sectionRadius: "26px 34px 28px 36px / 32px 26px 34px 30px",
      featureClipPath: "none",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(247,244,255,0.98) 0%, rgba(236,232,248,0.94) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(249,247,255,0.96) 0%, rgba(238,233,248,0.92) 100%)",
      observerBorder: "1px solid rgba(159,145,214,0.2)",
      observerShadow: "0 18px 30px rgba(126,105,176,0.12)",
      observerRadius: "20px",
    },
    dark: {
      themeFamily: "galaxy",
      pageBackground:
        "radial-gradient(circle at 14% 16%, rgba(118,92,255,0.26) 0%, rgba(118,92,255,0) 20%), radial-gradient(circle at 84% 18%, rgba(74,165,255,0.18) 0%, rgba(74,165,255,0) 22%), radial-gradient(circle at 60% 76%, rgba(232,100,255,0.1) 0%, rgba(232,100,255,0) 26%), linear-gradient(180deg, #050913 0%, #0a1024 26%, #111733 58%, #141a39 100%)",
      heroBackground:
        "radial-gradient(circle at 82% 20%, rgba(115,102,255,0.18) 0%, rgba(115,102,255,0) 24%), linear-gradient(145deg, rgba(16,22,45,0.97) 0%, rgba(24,31,61,0.94) 55%, rgba(31,39,74,0.92) 100%)",
      cardBackground:
        "radial-gradient(circle at 18% 18%, rgba(109,96,255,0.12) 0%, rgba(109,96,255,0) 24%), linear-gradient(180deg, rgba(14,19,38,0.95) 0%, rgba(22,28,54,0.91) 100%)",
      heroRadius: "34px 42px 36px 46px / 36px 32px 42px 38px",
      featureRadius: "30px 38px 30px 42px / 34px 30px 40px 34px",
      sectionRadius: "28px 34px 28px 38px / 32px 28px 36px 30px",
      featureClipPath: "none",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(18,24,44,0.98) 0%, rgba(25,33,58,0.94) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(17,22,40,0.94) 0%, rgba(25,31,54,0.9) 100%)",
      observerBorder: "1px solid rgba(112,130,204,0.18)",
      observerShadow: "0 20px 34px rgba(4,8,25,0.32)",
      observerRadius: "20px",
    },
  },
  underwater: {
    light: {
      themeFamily: "underwater",
      pageBackground:
        "radial-gradient(circle at 18% 16%, rgba(255,140,148,0.18) 0%, rgba(255,140,148,0) 18%), radial-gradient(circle at 82% 18%, rgba(79,209,217,0.18) 0%, rgba(79,209,217,0) 22%), radial-gradient(circle at 50% 48%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 36%), linear-gradient(180deg, #007a7c 0%, #004d4f 42%, #001f21 100%)",
      heroBackground:
        "linear-gradient(135deg, rgba(79, 209, 217, 0.4) 0%, rgba(0, 77, 79, 0.8) 100%)",
      cardBackground:
        "linear-gradient(135deg, rgba(79, 209, 217, 0.4) 0%, rgba(0, 77, 79, 0.8) 100%)",
      text: "#ffffff",
      subtleText: "rgba(255,255,255,0.82)",
      faintText: "rgba(255,255,255,0.64)",
      inputBackground: "rgba(255,255,255,0.1)",
      inputBorder: "rgba(255,255,255,0.22)",
      itemBackground: "rgba(255,255,255,0.12)",
      softButtonBackground: "linear-gradient(135deg, rgba(255,140,148,0.5) 0%, rgba(179,27,37,0.7) 100%)",
      softButtonText: "#ffffff",
      navInactive: "rgba(255,255,255,0.12)",
      navActive: "linear-gradient(135deg, rgba(79,209,217,0.42) 0%, rgba(0,77,79,0.88) 100%)",
      navText: "#ffffff",
      toggleText: "#053436",
      primary: "linear-gradient(135deg, rgba(79,209,217,0.92) 0%, rgba(0,102,104,0.96) 100%)",
      primaryText: "#ffffff",
      toggleBackground: "linear-gradient(135deg, rgba(82,242,245,0.94) 0%, rgba(0,102,104,0.92) 100%)",
      border: "1px solid rgba(255,255,255,0.24)",
      shadow: "0 12px 40px -10px rgba(0, 43, 44, 0.6)",
      heroShadow: "0 12px 40px -10px rgba(0, 43, 44, 0.6)",
      glow: "rgba(79,209,217,0.32)",
      track: "rgba(255,255,255,0.16)",
      chartSurface: "rgba(0,0,0,0.18)",
      chartGrid: "rgba(255,255,255,0.18)",
      chartLabel: "rgba(255,255,255,0.72)",
      heroRadius: "38px 28px 40px 26px / 28px 38px 30px 42px",
      featureRadius: "36px 26px 38px 24px / 28px 40px 30px 42px",
      sectionRadius: "34px 24px 36px 24px / 26px 38px 28px 40px",
      featureClipPath: "none",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(234,249,252,0.98) 0%, rgba(218,241,247,0.94) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(241,252,255,0.96) 0%, rgba(223,242,248,0.92) 100%)",
      observerBorder: "1px solid rgba(113,178,197,0.18)",
      observerShadow: "0 18px 28px rgba(91,152,181,0.14)",
      observerRadius: "18px",
      trackerReef: true,
      trackerHeadingFamily: "'Epilogue', 'Segoe UI', sans-serif",
      trackerBodyFamily: "'Newsreader', serif",
      trackerUiFamily: "'Epilogue', 'Segoe UI', sans-serif",
      trackerAccent: "#4fd1d9",
      trackerAccentSoft: "#ff8c94",
      trackerError: "#ff8c94",
      trackerGlassBackground: "rgba(255,255,255,0.12)",
      trackerReefBackground:
        "radial-gradient(circle at center, #007a7c 0%, #004d4f 40%, #001f21 100%)",
      trackerReefCaustics:
        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
      trackerReefGlow:
        "radial-gradient(circle at 18% 78%, rgba(255,140,148,0.16) 0%, rgba(255,140,148,0) 28%), radial-gradient(circle at 78% 22%, rgba(79,209,217,0.18) 0%, rgba(79,209,217,0) 30%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 34%)",
      trackerReefPanelTeal:
        "linear-gradient(135deg, rgba(79, 209, 217, 0.4) 0%, rgba(0, 77, 79, 0.8) 100%)",
      trackerReefPanelPink:
        "linear-gradient(135deg, rgba(255, 140, 148, 0.5) 0%, rgba(179, 27, 37, 0.7) 100%)",
      trackerReefPanelPeach:
        "linear-gradient(135deg, rgba(255, 179, 138, 0.6) 0%, rgba(160, 58, 15, 0.8) 100%)",
      trackerReefPanelBorder: "rgba(255,255,255,0.28)",
      trackerReefMutedBorder: "rgba(255,255,255,0.16)",
      trackerReefChipText: "#ffffff",
      chartPalette: {
        mood: "#ff8c94",
        focus: "#4fd1d9",
        energy: "#ffb38a",
        meals: "#4fd1d9",
        meds: "#ff8c94",
        hygiene: "#ffffff",
        exercise: "#ffb38a",
      },
    },
    dark: {
      themeFamily: "underwater",
      pageBackground:
        "radial-gradient(circle at 50% 8%, rgba(4,42,50,0.54) 0%, rgba(4,42,50,0) 28%), radial-gradient(circle at 22% 20%, rgba(0,107,118,0.16) 0%, rgba(0,107,118,0) 26%), radial-gradient(circle at 82% 18%, rgba(217,70,239,0.08) 0%, rgba(217,70,239,0) 18%), linear-gradient(180deg, #02080a 0%, #041014 34%, #031116 66%, #02090b 100%)",
      heroBackground:
        "radial-gradient(circle at 84% 16%, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0) 22%), linear-gradient(145deg, rgba(3,16,19,0.98) 0%, rgba(4,22,28,0.94) 55%, rgba(6,30,38,0.92) 100%)",
      cardBackground:
        "radial-gradient(circle at 18% 18%, rgba(34,211,238,0.1) 0%, rgba(34,211,238,0) 22%), linear-gradient(180deg, rgba(3,18,22,0.92) 0%, rgba(3,21,26,0.88) 100%)",
      text: "#e2f8f9",
      subtleText: "rgba(226,248,249,0.72)",
      faintText: "rgba(226,248,249,0.38)",
      inputBackground: "rgba(2,18,22,0.72)",
      inputBorder: "rgba(34,211,238,0.18)",
      itemBackground: "rgba(1,15,18,0.54)",
      softButtonBackground: "linear-gradient(180deg, rgba(4,29,35,0.94) 0%, rgba(1,18,22,0.98) 100%)",
      softButtonText: "#e2f8f9",
      navInactive: "rgba(1,15,18,0.78)",
      navActive: "linear-gradient(135deg, rgba(34,211,238,0.16) 0%, rgba(0,77,82,0.62) 100%)",
      navText: "rgba(226,248,249,0.7)",
      primary: "linear-gradient(135deg, rgba(34,211,238,0.96) 0%, rgba(24,176,210,0.88) 100%)",
      primaryText: "#021114",
      toggleBackground: "linear-gradient(135deg, rgba(34,211,238,0.94) 0%, rgba(20,143,175,0.88) 100%)",
      toggleText: "#021114",
      border: "1px solid rgba(255,255,255,0.05)",
      shadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
      heroShadow: "0 20px 54px rgba(0,0,0,0.44)",
      glow: "rgba(34,211,238,0.24)",
      track: "rgba(0,77,82,0.48)",
      chartSurface: "rgba(1,15,18,0.64)",
      chartGrid: "rgba(34,211,238,0.14)",
      chartLabel: "rgba(226,248,249,0.62)",
      heroRadius: "40px 28px 42px 28px / 30px 42px 32px 44px",
      featureRadius: "36px 26px 40px 26px / 28px 40px 30px 42px",
      sectionRadius: "34px 24px 38px 24px / 26px 40px 30px 42px",
      featureClipPath: "none",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(10,31,43,0.98) 0%, rgba(16,43,57,0.94) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(10,28,39,0.95) 0%, rgba(17,40,52,0.9) 100%)",
      observerBorder: "1px solid rgba(82,149,170,0.16)",
      observerShadow: "0 18px 30px rgba(3,13,20,0.28)",
      observerRadius: "18px",
      trackerAbyss: true,
      trackerHeadingFamily: "'Newsreader', serif",
      trackerBodyFamily: "'Newsreader', serif",
      trackerUiFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
      trackerAccent: "#22d3ee",
      trackerAccentSoft: "#d946ef",
      trackerError: "#d946ef",
      trackerGlassBackground: "rgba(1, 15, 18, 0.4)",
      trackerAbyssBackground:
        "radial-gradient(circle at 50% 10%, #031c21 0%, #02080a 80%)",
      trackerAbyssRays:
        "linear-gradient(105deg, transparent 20%, rgba(34,211,238,0.03) 25%, transparent 30%, rgba(34,211,238,0.01) 40%, transparent 50%, rgba(34,211,238,0.04) 60%, transparent 70%)",
      trackerAbyssGlow:
        "radial-gradient(circle at 50% 44%, rgba(3,28,33,0.26) 0%, rgba(3,28,33,0) 52%), radial-gradient(circle at 78% 20%, rgba(34,211,238,0.08) 0%, rgba(34,211,238,0) 22%), radial-gradient(circle at 80% 72%, rgba(217,70,239,0.06) 0%, rgba(217,70,239,0) 20%)",
      trackerAbyssPanel: "rgba(1, 15, 18, 0.4)",
      trackerAbyssPanelStrong: "rgba(1, 15, 18, 0.58)",
      trackerAbyssPanelBorder: "rgba(255,255,255,0.05)",
      trackerAbyssMutedBorder: "rgba(34,211,238,0.14)",
      trackerAbyssDepthText: "rgba(226,248,249,0.26)",
      trackerAbyssTealDark: "#004d52",
      trackerAbyssSnow:
        "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.15) 0 1px, transparent 1.6px), radial-gradient(circle at 32% 62%, rgba(255,255,255,0.08) 0 1.1px, transparent 1.8px), radial-gradient(circle at 74% 26%, rgba(34,211,238,0.12) 0 1px, transparent 1.7px), radial-gradient(circle at 84% 72%, rgba(217,70,239,0.1) 0 1px, transparent 1.7px), radial-gradient(circle at 62% 84%, rgba(255,255,255,0.08) 0 1px, transparent 1.6px)",
      chartPalette: {
        mood: "#22d3ee",
        focus: "#7de8f5",
        energy: "#d946ef",
        meals: "#32d4ff",
        meds: "#d946ef",
        hygiene: "#88fff0",
        exercise: "#59e4d5",
      },
    },
  },
  forest: {
    light: {
      themeFamily: "forest",
      pageBackground:
        "radial-gradient(circle at 14% 20%, rgba(212,235,185,0.8) 0%, rgba(212,235,185,0) 22%), radial-gradient(circle at 82% 16%, rgba(187,221,180,0.42) 0%, rgba(187,221,180,0) 24%), radial-gradient(circle at 64% 76%, rgba(241,230,196,0.46) 0%, rgba(241,230,196,0) 28%), radial-gradient(circle at 40% 88%, rgba(208,226,183,0.22) 0%, rgba(208,226,183,0) 22%), linear-gradient(180deg, #f3f1e4 0%, #ebf2e5 36%, #e5eddc 68%, #f2efe5 100%)",
      heroBackground:
        "radial-gradient(circle at 18% 18%, rgba(240,231,190,0.24) 0%, rgba(240,231,190,0) 24%), linear-gradient(145deg, rgba(248,248,238,0.98) 0%, rgba(236,244,230,0.94) 55%, rgba(226,237,217,0.92) 100%)",
      cardBackground:
        "radial-gradient(circle at 82% 22%, rgba(197,222,174,0.22) 0%, rgba(197,222,174,0) 28%), linear-gradient(180deg, rgba(249,248,240,0.96) 0%, rgba(236,243,230,0.92) 100%)",
      text: "#2e3927",
      subtleText: "#55634d",
      faintText: "#77826d",
      inputBackground: "rgba(250,251,244,0.9)",
      inputBorder: "#cfd8bc",
      itemBackground: "rgba(240,246,234,0.84)",
      softButtonBackground: "linear-gradient(180deg, #e3efd9 0%, #d3e4c8 100%)",
      softButtonText: "#3d5135",
      navInactive: "rgba(236,244,228,0.76)",
      navActive: "linear-gradient(135deg, #8db26f 0%, #5f9b6a 100%)",
      navText: "#365135",
      toggleText: "#30492a",
      primary: "linear-gradient(135deg, #8db26f 0%, #5f9b6a 100%)",
      toggleBackground: "linear-gradient(135deg, #9cbc78 0%, #5f9b6a 100%)",
      border: "1px solid rgba(132,158,112,0.2)",
      shadow: "0 20px 36px rgba(118,138,95,0.16)",
      heroShadow: "0 28px 48px rgba(118,138,95,0.18)",
      glow: "rgba(111, 163, 106, 0.24)",
      track: "#d7e2c9",
      chartSurface: "rgba(247,249,241,0.8)",
      chartGrid: "rgba(106,126,83,0.13)",
      chartLabel: "#65785e",
      heroRadius: "30px 38px 28px 44px / 40px 28px 42px 30px",
      featureRadius: "28px 36px 24px 40px / 38px 28px 40px 30px",
      sectionRadius: "24px 34px 24px 38px / 34px 24px 38px 28px",
      featureClipPath: "none",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(247,248,239,0.98) 0%, rgba(235,240,226,0.94) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(248,249,242,0.96) 0%, rgba(232,239,224,0.92) 100%)",
      observerBorder: "1px solid rgba(133,154,110,0.2)",
      observerShadow: "0 18px 28px rgba(110,127,90,0.12)",
      observerRadius: "18px",
    },
    dark: {
      themeFamily: "forest",
      pageBackground:
        "radial-gradient(circle at 14% 18%, rgba(85,126,73,0.32) 0%, rgba(85,126,73,0) 22%), radial-gradient(circle at 82% 16%, rgba(124,100,59,0.2) 0%, rgba(124,100,59,0) 22%), radial-gradient(circle at 60% 76%, rgba(109,166,117,0.16) 0%, rgba(109,166,117,0) 26%), radial-gradient(circle at 30% 84%, rgba(172,138,85,0.08) 0%, rgba(172,138,85,0) 20%), linear-gradient(180deg, #11160f 0%, #182116 28%, #1d281a 56%, #243020 100%)",
      heroBackground:
        "radial-gradient(circle at 82% 20%, rgba(116,178,110,0.12) 0%, rgba(116,178,110,0) 22%), linear-gradient(145deg, rgba(25,34,23,0.96) 0%, rgba(30,43,29,0.93) 55%, rgba(40,53,35,0.9) 100%)",
      cardBackground:
        "radial-gradient(circle at 18% 18%, rgba(105,160,98,0.12) 0%, rgba(105,160,98,0) 24%), linear-gradient(180deg, rgba(24,33,21,0.94) 0%, rgba(31,42,27,0.9) 100%)",
      text: "#edf5e8",
      subtleText: "#c7d5c0",
      faintText: "#95a58f",
      inputBackground: "rgba(20,28,18,0.9)",
      inputBorder: "#42523f",
      itemBackground: "rgba(30,40,26,0.82)",
      softButtonBackground: "linear-gradient(180deg, #314a32 0%, #293d29 100%)",
      softButtonText: "#eef5ea",
      navInactive: "rgba(41,57,39,0.74)",
      navActive: "linear-gradient(135deg, #4f8b58 0%, #6dbb75 100%)",
      navText: "#eef4ea",
      primary: "linear-gradient(135deg, #4f8b58 0%, #6dbb75 100%)",
      toggleBackground: "linear-gradient(135deg, #4f8b58 0%, #6dbb75 100%)",
      toggleText: "#102113",
      border: "1px solid rgba(121,149,107,0.16)",
      shadow: "0 24px 42px rgba(10,14,8,0.42)",
      heroShadow: "0 30px 56px rgba(8,12,7,0.44)",
      glow: "rgba(109, 187, 117, 0.22)",
      track: "#344332",
      chartSurface: "rgba(20,27,18,0.78)",
      chartGrid: "rgba(132,161,119,0.14)",
      chartLabel: "#c3d3bc",
      heroRadius: "32px 40px 30px 44px / 42px 30px 44px 32px",
      featureRadius: "28px 38px 26px 42px / 38px 28px 40px 32px",
      sectionRadius: "24px 36px 24px 40px / 34px 24px 38px 28px",
      featureClipPath: "none",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(24,33,21,0.98) 0%, rgba(31,42,27,0.94) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(24,33,21,0.95) 0%, rgba(34,45,29,0.9) 100%)",
      observerBorder: "1px solid rgba(112,138,98,0.16)",
      observerShadow: "0 18px 30px rgba(8,12,7,0.26)",
      observerRadius: "18px",
    },
  },
};

function getAppTheme(isDarkMode, family = "galaxy") {
  const baseTheme = isDarkMode ? mellowDarkTheme : mellowLightTheme;
  const familyOverrides =
    themeFamilyOverrides[family]?.[isDarkMode ? "dark" : "light"] || {};

  return {
    ...baseTheme,
    ...familyOverrides,
    themeFamily: family,
  };
}

function getTrackerExperienceTheme(theme, isDarkMode) {
  if (theme.themeFamily !== "galaxy") {
    return {
      ...theme,
      trackerObservatory: false,
      trackerSolar: false,
    };
  }

  if (!isDarkMode) {
    return {
      ...theme,
      trackerObservatory: false,
      trackerSolar: true,
      pageBackground:
        "linear-gradient(180deg, #ffefbe 0%, #ffd884 34%, #f0a13e 100%)",
      heroBackground:
        "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,248,227,0.22) 100%)",
      cardBackground:
        "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,245,221,0.22) 100%)",
      itemBackground: "rgba(255,255,255,0.34)",
      inputBackground: "rgba(255,251,243,0.8)",
      inputBorder: "rgba(197, 142, 40, 0.34)",
      softButtonBackground: "rgba(255,255,255,0.38)",
      softButtonText: "#5a3b00",
      primary: "linear-gradient(180deg, #ffc107 0%, #f0a11c 100%)",
      primaryText: "#463600",
      navInactive: "rgba(255,255,255,0.26)",
      navActive: "rgba(230,126,34,0.2)",
      navText: "#5a3b00",
      text: "#2c2100",
      subtleText: "#6f5a2a",
      faintText: "rgba(92, 69, 22, 0.64)",
      border: "1px solid rgba(255, 193, 7, 0.24)",
      shadow: "0 10px 30px rgba(70, 35, 0, 0.12)",
      heroShadow: "0 16px 48px rgba(230, 126, 34, 0.14)",
      glow: "rgba(255, 193, 7, 0.26)",
      track: "rgba(139, 69, 19, 0.14)",
      chartSurface: "rgba(255,255,255,0.42)",
      chartGrid: "rgba(139, 69, 19, 0.14)",
      chartLabel: "#6f5a2a",
      chartPalette: {
        mood: "#e67e22",
        focus: "#ffc107",
        energy: "#b8860b",
        meals: "#f0a11c",
        meds: "#cc8b1d",
        hygiene: "#d08b3a",
        exercise: "#e67e22",
      },
      heroRadius: "28px",
      featureRadius: "28px",
      sectionRadius: "28px",
      trackerHeadingFamily: "'Newsreader', serif",
      trackerBodyFamily: "'Epilogue', 'Inter', 'Segoe UI', sans-serif",
      trackerAccent: "#2c2100",
      trackerAccentSoft: "#e67e22",
      trackerError: "#b92902",
      trackerGlassBackground: "rgba(255,255,255,0.28)",
      trackerSolarCanvas:
        "radial-gradient(circle at center, #fff4d6 0%, #ffebae 42%, #e67e22 100%)",
      trackerSolarVignette:
        "radial-gradient(circle at center, transparent 30%, rgba(139, 69, 19, 0.15) 70%, rgba(70, 35, 0, 0.4) 100%)",
      trackerSolarGlow:
        "radial-gradient(circle at 18% 14%, rgba(255, 193, 7, 0.38) 0%, rgba(255, 193, 7, 0) 48%), radial-gradient(circle at 82% 78%, rgba(255, 215, 128, 0.26) 0%, rgba(255, 215, 128, 0) 40%), radial-gradient(circle at 50% 44%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 34%)",
      trackerSolarGlass: "rgba(255,255,255,0.22)",
      trackerSolarCard: "rgba(255,255,255,0.35)",
    };
  }

  return {
    ...theme,
    trackerObservatory: true,
    trackerSolar: false,
    pageBackground:
      "linear-gradient(180deg, #020205 0%, #05060c 42%, #0d1019 100%)",
    heroBackground:
      "linear-gradient(180deg, rgba(4,4,10,0.82) 0%, rgba(8,8,18,0.78) 100%)",
    cardBackground:
      "linear-gradient(180deg, rgba(5,5,14,0.8) 0%, rgba(8,8,20,0.72) 100%)",
    itemBackground: "rgba(11, 11, 25, 0.76)",
    inputBackground: "rgba(7, 7, 16, 0.88)",
    inputBorder: "rgba(116, 115, 143, 0.38)",
    softButtonBackground: "rgba(216, 185, 255, 0.08)",
    softButtonText: "#d8b9ff",
    primary: "linear-gradient(180deg, #fff0c3 0%, #ebd481 100%)",
    primaryText: "#4c3e00",
    navInactive: "rgba(216, 185, 255, 0.08)",
    navActive: "rgba(255, 240, 195, 0.12)",
    navText: "#d8b9ff",
    text: "#e5e3ff",
    subtleText: "#aaa8c6",
    faintText: "rgba(216, 185, 255, 0.44)",
    border: "1px solid rgba(255,255,255,0.06)",
    shadow: "0 12px 48px -12px rgba(0, 0, 0, 0.8)",
    heroShadow: "0 24px 60px rgba(0, 0, 0, 0.65)",
    glow: "rgba(255, 240, 195, 0.22)",
    track: "rgba(255,255,255,0.1)",
    chartSurface: "rgba(13, 13, 25, 0.78)",
    chartGrid: "rgba(255,255,255,0.08)",
    chartLabel: "#aaa8c6",
    chartPalette: {
      mood: "#fd6f85",
      focus: "#d8b9ff",
      energy: "#fff0c3",
      meals: "#d8b9ff",
      meds: "#92baff",
      hygiene: "#a9c7ff",
      exercise: "#fff0c3",
    },
    heroRadius: "24px",
    featureRadius: "24px",
    sectionRadius: "24px",
    trackerHeadingFamily: "'Newsreader', serif",
    trackerBodyFamily: "'Inter', 'Segoe UI', sans-serif",
    trackerAccent: "#fff0c3",
    trackerAccentSoft: "#d8b9ff",
    trackerError: "#fd6f85",
    trackerGlassBackground: "rgba(4, 4, 10, 0.54)",
    trackerGlowImage:
      "radial-gradient(circle at 12% 16%, rgba(94, 28, 176, 0.82) 0%, rgba(94, 28, 176, 0.42) 16%, rgba(94, 28, 176, 0) 40%), radial-gradient(circle at 86% 84%, rgba(28, 44, 156, 0.76) 0%, rgba(28, 44, 156, 0.32) 18%, rgba(28, 44, 156, 0) 42%), radial-gradient(circle at 52% 56%, rgba(126, 44, 82, 0.44) 0%, rgba(126, 44, 82, 0.16) 18%, rgba(126, 44, 82, 0) 52%), radial-gradient(circle at 24% 78%, rgba(255, 216, 132, 0.22) 0%, rgba(255, 216, 132, 0) 26%), radial-gradient(circle at 74% 68%, rgba(96, 160, 255, 0.24) 0%, rgba(96, 160, 255, 0) 28%), radial-gradient(circle at 50% 100%, rgba(255, 240, 195, 0.08) 0%, rgba(255, 240, 195, 0) 22%), linear-gradient(180deg, rgba(1, 2, 5, 0.04) 0%, rgba(1, 2, 5, 0.48) 100%)",
  };
}

function getObserverExperienceTheme(theme, isDarkMode) {
  if (theme.themeFamily === "underwater") {
    return isDarkMode
      ? {
          ...theme,
          observerConsole: false,
          observerAbyssBridge: true,
          pageBackground:
            "linear-gradient(180deg, #01080a 0%, #020b0d 28%, #020305 100%)",
          heroBackground:
            "linear-gradient(180deg, rgba(32, 37, 42, 0.98) 0%, rgba(22, 25, 29, 0.98) 100%)",
          observerHeroBackground:
            "linear-gradient(180deg, rgba(30, 34, 38, 0.98) 0%, rgba(17, 20, 23, 0.99) 100%)",
          cardBackground:
            "linear-gradient(180deg, rgba(38, 43, 48, 0.98) 0%, rgba(25, 29, 33, 0.99) 100%)",
          observerCardBackground:
            "linear-gradient(180deg, rgba(38, 43, 48, 0.99) 0%, rgba(22, 25, 29, 0.995) 100%)",
          itemBackground: "rgba(42,45,49,0.96)",
          inputBackground: "rgba(1,2,3,0.96)",
          inputBorder: "#33373b",
          softButtonBackground: "linear-gradient(180deg, #35393e 0%, #1f2327 100%)",
          softButtonText: "#d5e5e7",
          primary: "linear-gradient(180deg, #22d3ee 0%, #008ba3 100%)",
          primaryText: "#021518",
          navInactive: "linear-gradient(180deg, rgba(43,46,50,0.98) 0%, rgba(24,27,30,0.98) 100%)",
          navActive: "linear-gradient(180deg, #22d3ee 0%, #008ba3 100%)",
          navText: "#dff7f8",
          text: "#e2f8f9",
          subtleText: "#95b0b4",
          faintText: "#607a7d",
          border: "1px solid rgba(61, 66, 71, 0.92)",
          observerBorder: "1px solid rgba(61, 66, 71, 0.98)",
          shadow: "10px 15px 40px rgba(0,0,0,0.85)",
          observerShadow:
            "inset 1px 1px 2px rgba(255,255,255,0.15), inset -1px -1px 3px rgba(0,0,0,0.6), 10px 15px 40px rgba(0,0,0,0.85)",
          glow: "rgba(34, 211, 238, 0.18)",
          track: "#151719",
          chartSurface: "rgba(1,2,3,0.94)",
          chartGrid: "rgba(96,122,125,0.2)",
          chartLabel: "#95b0b4",
          chartPalette: {
            mood: "#22d3ee",
            focus: "#ffd709",
            energy: "#ff716c",
            meals: "#7ce8f8",
            meds: "#ff51fa",
            hygiene: "#95b0b4",
            exercise: "#00f4fe",
          },
          observerRadius: "8px",
          heroRadius: "8px",
          featureRadius: "8px",
          sectionRadius: "8px",
          heroShadow: "10px 15px 40px rgba(0,0,0,0.85)",
          observerAccent: "#22d3ee",
          observerAccentAlt: "#ff51fa",
          observerAlert: "#ff716c",
          observerPanelFrame:
            "linear-gradient(180deg, rgba(42,45,49,0.98) 0%, rgba(18,20,22,0.995) 100%)",
          observerChrome:
            "linear-gradient(180deg, rgba(33,36,40,0.98) 0%, rgba(18,20,22,0.995) 100%)",
          observerChartMode: "stepped",
          observerFontFamily: "'Manrope', 'Segoe UI', sans-serif",
          observerHeadingFamily: "'Epilogue', 'Segoe UI', sans-serif",
          observerUiFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
          observerIndustrialPanel:
            "linear-gradient(170deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.3) 100%), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px), linear-gradient(180deg, #2a2d31 0%, #24272b 100%)",
          observerIndustrialPanelBase: "#2a2d31",
          observerIndustrialBorder: "#3d4247",
          observerIndustrialShadow:
            "inset 1px 1px 2px rgba(255,255,255,0.15), inset -1px -1px 3px rgba(0,0,0,0.6), 10px 15px 40px rgba(0,0,0,0.85)",
          observerIndustrialEdge: "#33373b",
          observerIndustrialBottomEdge: "#121416",
          observerIndustrialText: "#e2f8f9",
          observerIndustrialMuted: "#95b0b4",
          observerIndustrialRivet: "#8c9196",
          observerIndustrialRust: "rgba(101, 53, 15, 0.5)",
          observerIndustrialWell: "#010203",
          observerIndustrialBeam: "#2a2d31",
        }
      : {
          ...theme,
          observerConsole: false,
          observerAbyssBridge: true,
          pageBackground:
            "linear-gradient(180deg, #f7f0e6 0%, #e9e1d7 40%, #dbd3c8 100%)",
          heroBackground:
            "linear-gradient(180deg, rgba(233,225,215,0.98) 0%, rgba(219,211,200,0.98) 100%)",
          observerHeroBackground:
            "linear-gradient(180deg, rgba(238,231,221,0.99) 0%, rgba(219,211,200,0.99) 100%)",
          cardBackground:
            "linear-gradient(180deg, rgba(233,225,215,0.98) 0%, rgba(219,211,200,0.99) 100%)",
          observerCardBackground:
            "linear-gradient(180deg, rgba(238,231,221,0.99) 0%, rgba(219,211,200,0.995) 100%)",
          itemBackground: "rgba(233,225,215,0.96)",
          inputBackground: "rgba(255,255,255,0.92)",
          inputBorder: "#9d958b",
          softButtonBackground: "linear-gradient(180deg, #ebe3d8 0%, #cfc5b8 100%)",
          softButtonText: "#2f3436",
          primary: "linear-gradient(180deg, #4fd1d9 0%, #006668 100%)",
          primaryText: "#f4fffe",
          navInactive: "linear-gradient(180deg, rgba(239,233,225,0.98) 0%, rgba(217,208,198,0.98) 100%)",
          navActive: "linear-gradient(180deg, #4fd1d9 0%, #006668 100%)",
          navText: "#273537",
          text: "#312e28",
          subtleText: "#5f5b54",
          faintText: "#7b766f",
          border: "1px solid rgba(144, 137, 129, 0.7)",
          observerBorder: "1px solid rgba(144, 137, 129, 0.82)",
          shadow: "10px 15px 32px rgba(98,84,62,0.2)",
          observerShadow:
            "inset 1px 1px 2px rgba(255,255,255,0.46), inset -1px -1px 3px rgba(94,74,48,0.14), 10px 15px 32px rgba(98,84,62,0.2)",
          glow: "rgba(79, 209, 217, 0.14)",
          track: "#cfc5b8",
          chartSurface: "rgba(255,255,255,0.82)",
          chartGrid: "rgba(123,118,111,0.18)",
          chartLabel: "#5f5b54",
          chartPalette: {
            mood: "#006668",
            focus: "#a03a0f",
            energy: "#ff8c94",
            meals: "#4fd1d9",
            meds: "#a900a9",
            hygiene: "#7b766f",
            exercise: "#00675f",
          },
          observerRadius: "8px",
          heroRadius: "8px",
          featureRadius: "8px",
          sectionRadius: "8px",
          heroShadow: "10px 15px 32px rgba(98,84,62,0.2)",
          observerAccent: "#006668",
          observerAccentAlt: "#a900a9",
          observerAlert: "#b31b25",
          observerPanelFrame:
            "linear-gradient(180deg, rgba(233,225,215,0.98) 0%, rgba(214,204,194,0.995) 100%)",
          observerChrome:
            "linear-gradient(180deg, rgba(238,231,221,0.99) 0%, rgba(216,207,197,0.995) 100%)",
          observerChartMode: "stepped",
          observerFontFamily: "'Manrope', 'Segoe UI', sans-serif",
          observerHeadingFamily: "'Epilogue', 'Segoe UI', sans-serif",
          observerUiFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
          observerIndustrialPanel:
            "linear-gradient(170deg, rgba(255,255,255,0.28) 0%, transparent 40%, rgba(125,108,87,0.12) 100%), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(95,91,84,0.03) 2px, rgba(95,91,84,0.03) 4px), linear-gradient(180deg, #ece3d7 0%, #d7cbbd 100%)",
          observerIndustrialPanelBase: "#ece3d7",
          observerIndustrialBorder: "#b2aca4",
          observerIndustrialShadow:
            "inset 1px 1px 2px rgba(255,255,255,0.52), inset -1px -1px 3px rgba(120,98,71,0.14), 10px 15px 30px rgba(119,100,72,0.18)",
          observerIndustrialEdge: "#9d958b",
          observerIndustrialBottomEdge: "#bdb3a6",
          observerIndustrialText: "#312e28",
          observerIndustrialMuted: "#5f5b54",
          observerIndustrialRivet: "#a29c94",
          observerIndustrialRust: "rgba(160, 58, 15, 0.24)",
          observerIndustrialWell: "#f8f3ed",
          observerIndustrialBeam: "#d9cfc3",
        };
  }

  if (theme.themeFamily !== "galaxy") {
    return {
      ...theme,
      observerConsole: false,
    };
  }

  if (isDarkMode) {
    return {
      ...theme,
      observerConsole: true,
      pageBackground:
        "linear-gradient(180deg, rgba(3,7,16,0.98) 0%, rgba(8,12,24,0.98) 28%, rgba(12,18,32,0.98) 100%)",
      heroBackground:
        "linear-gradient(180deg, rgba(18,24,38,0.98) 0%, rgba(13,18,31,0.98) 100%)",
      observerHeroBackground:
        "linear-gradient(180deg, rgba(19,24,35,0.99) 0%, rgba(12,16,27,0.98) 100%)",
      cardBackground:
        "linear-gradient(180deg, rgba(15,20,34,0.96) 0%, rgba(10,14,24,0.95) 100%)",
      observerCardBackground:
        "linear-gradient(180deg, rgba(15,20,34,0.98) 0%, rgba(10,14,24,0.97) 100%)",
      itemBackground: "rgba(9,13,22,0.92)",
      inputBackground: "rgba(5,9,16,0.96)",
      inputBorder: "#2e4350",
      softButtonBackground: "linear-gradient(180deg, #1d2833 0%, #101821 100%)",
      softButtonText: "#d9f2ef",
      primary: "linear-gradient(180deg, #27d7a1 0%, #0e9c73 100%)",
      primaryText: "#03120d",
      navInactive: "linear-gradient(180deg, rgba(19,27,36,0.98) 0%, rgba(11,17,24,0.98) 100%)",
      navActive: "linear-gradient(180deg, #1fcf95 0%, #0f8d69 100%)",
      navText: "#d8ece8",
      text: "#e8f5f2",
      subtleText: "#a8c4c0",
      faintText: "#6f8b89",
      border: "1px solid rgba(93, 120, 126, 0.34)",
      observerBorder: "1px solid rgba(93, 120, 126, 0.4)",
      shadow: "0 18px 32px rgba(0,0,0,0.34)",
      observerShadow:
        "inset 0 2px 4px rgba(0,0,0,0.58), 0 18px 28px rgba(0,0,0,0.28)",
      glow: "rgba(39, 215, 161, 0.22)",
      track: "#17262c",
      chartSurface: "rgba(5,9,16,0.9)",
      chartGrid: "rgba(74, 106, 102, 0.28)",
      chartLabel: "#92b3ad",
      chartPalette: {
        mood: "#27d7a1",
        focus: "#ffbf47",
        energy: "#f56b4c",
        meals: "#7de7d4",
        meds: "#ff855e",
        hygiene: "#ffcf67",
        exercise: "#81f2a7",
      },
      observerRadius: "14px",
      heroRadius: "14px",
      featureRadius: "14px",
      sectionRadius: "14px",
      heroShadow: "0 20px 36px rgba(0,0,0,0.35)",
      observerAccent: "#27d7a1",
      observerAccentAlt: "#ffbf47",
      observerAlert: "#d85b57",
      observerPanelFrame:
        "linear-gradient(180deg, rgba(43,55,67,0.92) 0%, rgba(20,28,37,0.98) 100%)",
      observerChrome:
        "linear-gradient(180deg, rgba(30,38,49,0.98) 0%, rgba(14,18,25,0.98) 100%)",
      observerChartMode: "stepped",
      observerFontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Segoe UI', monospace",
      observerHeadingFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
    };
  }

  return {
    ...theme,
    observerConsole: true,
    pageBackground:
      "linear-gradient(180deg, rgba(218,222,224,0.98) 0%, rgba(198,204,208,0.98) 38%, rgba(182,189,194,0.98) 100%)",
    heroBackground:
      "linear-gradient(180deg, rgba(212,218,221,0.98) 0%, rgba(192,199,204,0.98) 100%)",
    observerHeroBackground:
      "linear-gradient(180deg, rgba(216,221,224,0.98) 0%, rgba(193,199,204,0.98) 100%)",
    cardBackground:
      "linear-gradient(180deg, rgba(206,212,216,0.96) 0%, rgba(184,191,196,0.95) 100%)",
    observerCardBackground:
      "linear-gradient(180deg, rgba(210,216,219,0.98) 0%, rgba(186,193,198,0.97) 100%)",
    itemBackground: "rgba(198,205,209,0.92)",
    inputBackground: "rgba(228,233,235,0.98)",
    inputBorder: "#74848b",
    softButtonBackground: "linear-gradient(180deg, #c6cfd4 0%, #aab6bc 100%)",
    softButtonText: "#22343a",
    primary: "linear-gradient(180deg, #f2b545 0%, #c97a12 100%)",
    primaryText: "#241506",
    navInactive: "linear-gradient(180deg, rgba(202,209,213,0.98) 0%, rgba(178,187,192,0.98) 100%)",
    navActive: "linear-gradient(180deg, #ffc54f 0%, #e09018 100%)",
    navText: "#20343a",
    text: "#152228",
    subtleText: "#35484f",
    faintText: "#55686f",
    border: "1px solid rgba(100, 115, 123, 0.42)",
    observerBorder: "1px solid rgba(100, 115, 123, 0.48)",
    shadow: "0 18px 30px rgba(68,79,88,0.14)",
    observerShadow:
      "inset 0 2px 4px rgba(100,111,119,0.22), 0 18px 28px rgba(68,79,88,0.12)",
    glow: "rgba(199, 123, 17, 0.18)",
    track: "#c6d0d3",
    chartSurface: "rgba(243,245,245,0.96)",
    chartGrid: "rgba(90, 105, 113, 0.2)",
    chartLabel: "#486067",
    chartPalette: {
      mood: "#ad6b0e",
      focus: "#176f5b",
      energy: "#a64633",
      meals: "#267f97",
      meds: "#c45735",
      hygiene: "#4f6ea8",
      exercise: "#456f2a",
    },
    observerRadius: "14px",
    heroRadius: "14px",
    featureRadius: "14px",
    sectionRadius: "14px",
    heroShadow: "0 18px 30px rgba(80,90,100,0.14)",
    observerAccent: "#c77b11",
    observerAccentAlt: "#176f5b",
    observerAlert: "#bf5544",
    observerPanelFrame:
      "linear-gradient(180deg, rgba(193,201,206,0.98) 0%, rgba(165,175,182,0.98) 100%)",
    observerChrome:
      "linear-gradient(180deg, rgba(209,215,219,0.98) 0%, rgba(180,189,195,0.98) 100%)",
    observerChartMode: "stepped",
    observerFontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Segoe UI', monospace",
    observerHeadingFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
  };
}

function isSpaceConsoleTheme(theme) {
  return Boolean(theme?.observerConsole && theme?.themeFamily === "galaxy");
}

function isObservatoryTrackerTheme(theme) {
  return Boolean(theme?.trackerObservatory && theme?.themeFamily === "galaxy");
}

function isCelestialGalaxyTrackerTheme(theme) {
  return Boolean(
    theme?.themeFamily === "galaxy" &&
      !theme?.observerConsole &&
      !theme?.trackerSolar &&
      !theme?.trackerReef &&
      !theme?.trackerAbyss
  );
}

function toCelestialAsset(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function getCelestialGalaxyOrnamentStyle(variant = "section") {
  const isLarge = variant === "chart" || variant === "section";
  const isStandardSection = variant === "section";
  const topCornerWidth = isLarge ? 118 : isStandardSection ? 92 : 74;
  const topCornerHeight = isLarge ? 84 : isStandardSection ? 64 : 52;
  const bottomCornerWidth = isLarge ? 122 : isStandardSection ? 98 : 78;
  const bottomCornerHeight = isLarge ? 96 : isStandardSection ? 72 : 58;
  const spineWidth = isLarge ? 34 : isStandardSection ? 26 : 22;
  const spineHeight = isLarge ? 222 : isStandardSection ? 156 : 132;
  const railWidth = isLarge ? 154 : isStandardSection ? 112 : 86;
  const railInset = isLarge ? 34 : isStandardSection ? 24 : 18;
  const edgeOffset = isLarge ? "18px" : isStandardSection ? "14px" : "12px";
  const topRailY = isLarge ? "18px" : "12px";
  const bottomRailY = isLarge ? "calc(100% - 18px)" : "calc(100% - 12px)";
  const leftSpineY = isLarge ? "68px" : isStandardSection ? "52px" : "42px";
  const rightSpineY = isLarge ? "68px" : isStandardSection ? "52px" : "42px";

  const topLeft = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 84" preserveAspectRatio="xMinYMin meet">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
      <path d="M10 46 Q10 12 46 12 H116" fill="none" stroke="url(#g)" stroke-width="1.8"/>
      <path d="M22 56 Q22 26 54 26 H98" fill="none" stroke="rgba(244,214,122,0.52)" stroke-width="1.1"/>
      <g transform="translate(12 12)">
        <polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="rgba(255,240,195,0.18)" stroke="#fff0c3" stroke-width="1.2"/>
        <polygon points="0,-6 2.5,-2.5 6,0 2.5,2.5 0,6 -2.5,2.5 -6,0 -2.5,-2.5" fill="rgba(244,214,122,0.22)" stroke="rgba(244,214,122,0.9)" stroke-width="0.8"/>
      </g>
    </svg>`);
  const topRight = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 84" preserveAspectRatio="xMaxYMin meet">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
      <path d="M108 46 Q108 12 72 12 H2" fill="none" stroke="url(#g)" stroke-width="1.8"/>
      <path d="M96 56 Q96 26 64 26 H20" fill="none" stroke="rgba(244,214,122,0.52)" stroke-width="1.1"/>
      <g transform="translate(106 12)">
        <polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="rgba(255,240,195,0.18)" stroke="#fff0c3" stroke-width="1.2"/>
        <polygon points="0,-6 2.5,-2.5 6,0 2.5,2.5 0,6 -2.5,2.5 -6,0 -2.5,-2.5" fill="rgba(244,214,122,0.22)" stroke="rgba(244,214,122,0.9)" stroke-width="0.8"/>
      </g>
    </svg>`);
  const bottomLeft = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 96" preserveAspectRatio="xMinYMax meet">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
      <path d="M10 48 Q10 84 48 84 H120" fill="none" stroke="url(#g)" stroke-width="1.7"/>
      <path d="M22 38 Q22 70 54 70 H98" fill="none" stroke="rgba(244,214,122,0.5)" stroke-width="1.05"/>
      <path d="M34 30 Q34 58 60 58 H82" fill="none" stroke="rgba(244,214,122,0.22)" stroke-width="0.9"/>
      <g transform="translate(12 84)">
        <polygon points="0,-8 3.5,-3.5 8,0 3.5,3.5 0,8 -3.5,3.5 -8,0 -3.5,-3.5" fill="rgba(255,240,195,0.16)" stroke="rgba(244,214,122,0.86)" stroke-width="1"/>
      </g>
    </svg>`);
  const bottomRight = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 96" preserveAspectRatio="xMaxYMax meet">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
      <path d="M112 48 Q112 84 74 84 H2" fill="none" stroke="url(#g)" stroke-width="1.7"/>
      <path d="M100 38 Q100 70 68 70 H24" fill="none" stroke="rgba(244,214,122,0.5)" stroke-width="1.05"/>
      <path d="M88 30 Q88 58 62 58 H40" fill="none" stroke="rgba(244,214,122,0.22)" stroke-width="0.9"/>
      <g transform="translate(110 84)">
        <polygon points="0,-8 3.5,-3.5 8,0 3.5,3.5 0,8 -3.5,3.5 -8,0 -3.5,-3.5" fill="rgba(255,240,195,0.16)" stroke="rgba(244,214,122,0.86)" stroke-width="1"/>
      </g>
    </svg>`);
  const leftSpine = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 222" preserveAspectRatio="xMinYMid meet">
      <path d="M24 8 C8 28, 8 56, 24 78 C40 100, 40 126, 24 148" fill="none" stroke="rgba(244,214,122,0.62)" stroke-width="1.7"/>
      <path d="M18 24 C6 42, 6 62, 18 78 C30 94, 30 114, 18 128" fill="none" stroke="rgba(244,214,122,0.3)" stroke-width="1"/>
    </svg>`);
  const rightSpine = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 222" preserveAspectRatio="xMaxYMid meet">
      <path d="M10 8 C26 28, 26 56, 10 78 C-6 100, -6 126, 10 148" fill="none" stroke="rgba(244,214,122,0.62)" stroke-width="1.7"/>
      <path d="M16 24 C28 42, 28 62, 16 78 C4 94, 4 114, 16 128" fill="none" stroke="rgba(244,214,122,0.3)" stroke-width="1"/>
    </svg>`);
  const topRail = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 18" preserveAspectRatio="none">
      <path d="M0 8 H154" fill="none" stroke="rgba(244,214,122,0.42)" stroke-width="1"/>
      <path d="M18 2 H136" fill="none" stroke="rgba(244,214,122,0.18)" stroke-width="0.85"/>
    </svg>`);
  const bottomRail = toCelestialAsset(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 18" preserveAspectRatio="none">
      <path d="M0 10 H154" fill="none" stroke="rgba(244,214,122,0.28)" stroke-width="1"/>
      <path d="M18 16 H136" fill="none" stroke="rgba(244,214,122,0.14)" stroke-width="0.85"/>
    </svg>`);

  return {
    backgroundImage: [
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      leftSpine,
      rightSpine,
      topRail,
      topRail,
      bottomRail,
      bottomRail,
    ].join(", "),
    backgroundSize: [
      `${topCornerWidth}px ${topCornerHeight}px`,
      `${topCornerWidth}px ${topCornerHeight}px`,
      `${bottomCornerWidth}px ${bottomCornerHeight}px`,
      `${bottomCornerWidth}px ${bottomCornerHeight}px`,
      `${spineWidth}px ${spineHeight}px`,
      `${spineWidth}px ${spineHeight}px`,
      `${railWidth}px 18px`,
      `${railWidth}px 18px`,
      `${railWidth}px 18px`,
      `${railWidth}px 18px`,
    ].join(", "),
    backgroundRepeat: "no-repeat",
    backgroundPosition: [
      `${edgeOffset} ${edgeOffset}`,
      `calc(100% - ${edgeOffset}) ${edgeOffset}`,
      `${edgeOffset} calc(100% - ${edgeOffset})`,
      `calc(100% - ${edgeOffset}) calc(100% - ${edgeOffset})`,
      `${edgeOffset} ${leftSpineY}`,
      `calc(100% - ${edgeOffset}) ${rightSpineY}`,
      `${railInset} ${topRailY}`,
      `calc(100% - ${railInset + railWidth}px) ${topRailY}`,
      `${railInset} ${bottomRailY}`,
      `calc(100% - ${railInset + railWidth}px) ${bottomRailY}`,
    ].join(", "),
  };
}

function getCelestialGalaxyCardStyle(section = "dashboard", variant = "section") {
  const paletteBySection = {
    dashboard: {
      aura:
        "radial-gradient(circle at 16% 18%, rgba(140,126,255,0.14) 0%, rgba(140,126,255,0) 28%), radial-gradient(circle at 84% 18%, rgba(255,240,195,0.1) 0%, rgba(255,240,195,0) 22%), radial-gradient(circle at 50% 100%, rgba(160,148,255,0.08) 0%, rgba(160,148,255,0) 36%)",
      shadow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 26px 46px rgba(4,8,24,0.34), 0 0 26px rgba(244,214,122,0.08)",
    },
    signals: {
      aura:
        "radial-gradient(circle at 78% 18%, rgba(108,170,255,0.16) 0%, rgba(108,170,255,0) 26%), radial-gradient(circle at 14% 22%, rgba(255,240,195,0.09) 0%, rgba(255,240,195,0) 18%), radial-gradient(circle at 50% 100%, rgba(136,152,255,0.08) 0%, rgba(136,152,255,0) 34%)",
      shadow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 24px 42px rgba(4,8,24,0.32), 0 0 22px rgba(116,208,255,0.08)",
    },
    goals: {
      aura:
        "radial-gradient(circle at 18% 18%, rgba(166,150,255,0.16) 0%, rgba(166,150,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(255,240,195,0.1) 0%, rgba(255,240,195,0) 22%), radial-gradient(circle at 84% 82%, rgba(126,170,255,0.08) 0%, rgba(126,170,255,0) 32%)",
      shadow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 24px 42px rgba(4,8,24,0.32), 0 0 24px rgba(166,150,255,0.08)",
    },
    care: {
      aura:
        "radial-gradient(circle at 16% 18%, rgba(245,163,255,0.16) 0%, rgba(245,163,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(166,150,255,0.12) 0%, rgba(166,150,255,0) 22%), radial-gradient(circle at 50% 100%, rgba(255,209,102,0.08) 0%, rgba(255,209,102,0) 36%)",
      shadow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 26px 46px rgba(4,8,24,0.34), 0 0 26px rgba(244,214,122,0.08)",
    },
    charts: {
      aura:
        "radial-gradient(circle at 16% 18%, rgba(114,208,255,0.16) 0%, rgba(114,208,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(255,240,195,0.1) 0%, rgba(255,240,195,0) 22%), radial-gradient(circle at 50% 100%, rgba(160,148,255,0.08) 0%, rgba(160,148,255,0) 36%)",
      shadow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 26px 46px rgba(4,8,24,0.34), 0 0 26px rgba(244,214,122,0.08)",
    },
  };

  const palette = paletteBySection[section] || paletteBySection.dashboard;
  const radiusByVariant = {
    section: "30px",
    summary: "26px",
    reward: "24px",
    item: "22px",
    chart: "30px",
  };

  if (variant === "summary" || variant === "reward" || variant === "item") {
    return {
      ...getCelestialGalaxyOrnamentStyle(variant),
      backgroundColor: "rgba(12,16,30,0.92)",
      backgroundImage: `${getCelestialGalaxyOrnamentStyle(variant).backgroundImage}, ${palette.aura}, linear-gradient(180deg, rgba(12,16,30,0.92) 0%, rgba(16,21,40,0.88) 100%)`,
      backgroundSize: `${getCelestialGalaxyOrnamentStyle(variant).backgroundSize}, auto, auto`,
      backgroundRepeat: `${getCelestialGalaxyOrnamentStyle(variant).backgroundRepeat}, no-repeat, no-repeat`,
      backgroundPosition: `${getCelestialGalaxyOrnamentStyle(variant).backgroundPosition}, center, center`,
      border: "1px solid rgba(244,214,122,0.12)",
      borderRadius: radiusByVariant[variant],
      boxShadow: `0 14px 26px rgba(4,8,24,0.22), inset 0 0 0 1px rgba(255,245,214,0.05), inset 0 1px 0 rgba(255,255,255,0.04)`,
      clipPath: "none",
    };
  }

  return {
    ...getCelestialGalaxyOrnamentStyle(variant),
    backgroundColor: "rgba(12,16,30,0.94)",
    backgroundImage: `${getCelestialGalaxyOrnamentStyle(variant).backgroundImage}, ${palette.aura}, linear-gradient(180deg, rgba(12,16,30,0.94) 0%, rgba(16,21,40,0.9) 100%)`,
    backgroundSize: `${getCelestialGalaxyOrnamentStyle(variant).backgroundSize}, auto, auto`,
    backgroundRepeat: `${getCelestialGalaxyOrnamentStyle(variant).backgroundRepeat}, no-repeat, no-repeat`,
    backgroundPosition: `${getCelestialGalaxyOrnamentStyle(variant).backgroundPosition}, center, center`,
    border: "1px solid rgba(244,214,122,0.14)",
    borderRadius: radiusByVariant[variant] || "26px",
    boxShadow: `${palette.shadow}, inset 0 0 0 1px rgba(255,245,214,0.06), inset 0 1px 0 rgba(255,255,255,0.05)`,
    clipPath: "none",
  };
}

function getThemeCardClipPath() {
  return "none";
}

function getThemeCardOrnament(theme, variant = "feature") {
  if (isSpaceConsoleTheme(theme)) {
    return "linear-gradient(90deg, rgba(39,215,161,0.08) 0%, rgba(39,215,161,0) 26%), linear-gradient(180deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 6px)";
  }

  if (theme?.trackerReef) {
    return [
      "radial-gradient(circle at 14% 18%, rgba(255,255,255,0.18) 0 2px, transparent 2.8px)",
      "radial-gradient(circle at 82% 18%, rgba(79,209,217,0.22) 0 2px, transparent 2.8px)",
      "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%)",
      variant === "hero"
        ? "radial-gradient(120% 80% at 50% 100%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%)"
        : "radial-gradient(90% 70% at 50% 100%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%)",
    ].join(", ");
  }

  if (theme?.trackerAbyss) {
    return [
      "linear-gradient(90deg, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0) 28%)",
      "radial-gradient(circle at 86% 18%, rgba(34,211,238,0.14) 0 1.4px, transparent 2px)",
      "radial-gradient(circle at 12% 84%, rgba(217,70,239,0.14) 0 1.2px, transparent 1.8px)",
      "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 22%)",
    ].join(", ");
  }

  if (theme?.trackerSolar) {
    return [
      "radial-gradient(circle at 84% 18%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 22%)",
      "radial-gradient(circle at 16% 82%, rgba(255,193,7,0.16) 0%, rgba(255,193,7,0) 24%)",
      "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 28%)",
      variant === "hero"
        ? "conic-gradient(from 210deg at 88% 16%, rgba(255,255,255,0.18), rgba(255,255,255,0) 18%, rgba(255,255,255,0.14) 26%, rgba(255,255,255,0) 42%)"
        : "linear-gradient(90deg, rgba(230,126,34,0.12) 0%, rgba(230,126,34,0) 24%)",
    ].join(", ");
  }

  if (theme?.themeFamily === "underwater") {
    return [
      "radial-gradient(circle at 84% 18%, rgba(214,246,251,0.16) 0%, rgba(214,246,251,0) 22%)",
      "radial-gradient(circle at 16% 82%, rgba(112,168,232,0.12) 0%, rgba(112,168,232,0) 22%)",
      "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 26%)",
    ].join(", ");
  }

  if (theme?.themeFamily === "forest") {
    return [
      "radial-gradient(circle at 18% 18%, rgba(220,233,190,0.16) 0%, rgba(220,233,190,0) 22%)",
      "radial-gradient(circle at 84% 82%, rgba(179,154,106,0.1) 0%, rgba(179,154,106,0) 20%)",
      "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%)",
    ].join(", ");
  }

  return [
    "radial-gradient(circle at 16% 18%, rgba(166,150,255,0.16) 0%, rgba(166,150,255,0) 22%)",
    "radial-gradient(circle at 84% 18%, rgba(116,208,255,0.12) 0%, rgba(116,208,255,0) 20%)",
    "radial-gradient(circle at 80% 82%, rgba(255,214,102,0.08) 0%, rgba(255,214,102,0) 18%)",
  ].join(", ");
}

function getThemeEdgeHighlight(theme) {
  if (isSpaceConsoleTheme(theme)) {
    return `inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 2px 0 rgba(255,255,255,0.06)`;
  }

  if (theme?.trackerReef || theme?.trackerAbyss) {
    return `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)`;
  }

  if (theme?.trackerSolar) {
    return `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(255,255,255,0.16)`;
  }

  return `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)`;
}

const pageStyle = (theme) => ({
  minHeight: "100vh",
  background: isObservatoryTrackerTheme(theme)
    ? theme.pageBackground
    : isSpaceConsoleTheme(theme)
    ? [
        "linear-gradient(180deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 5px)",
        "linear-gradient(90deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 84px)",
        "radial-gradient(circle at 16% 18%, rgba(255,191,71,0.1) 0%, rgba(255,191,71,0) 18%)",
        "radial-gradient(circle at 84% 22%, rgba(39,215,161,0.09) 0%, rgba(39,215,161,0) 20%)",
        theme.pageBackground,
      ].join(", ")
    : `${theme.pageBackground}, radial-gradient(circle at 12% 12%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 18%), radial-gradient(circle at 88% 20%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 18%)`,
  padding: "clamp(12px, 4vw, 24px)",
  fontFamily: isObservatoryTrackerTheme(theme)
    ? theme.trackerBodyFamily
    : isSpaceConsoleTheme(theme)
    ? theme.observerFontFamily
    : "'Trebuchet MS', 'Segoe UI', sans-serif",
  color: theme.text,
  position: "relative",
  overflowX: "hidden",
});

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  width: "100%",
  minWidth: 0,
};

const heroCardStyle = (theme) => ({
  background: `${getThemeCardOrnament(theme, "hero")}, ${theme.heroBackground}`,
  borderRadius: isSpaceConsoleTheme(theme) ? theme.heroRadius || "14px" : theme.heroRadius || "28px",
  padding: "clamp(16px, 4vw, 24px)",
  boxShadow: theme.heroShadow,
  marginBottom: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "stretch",
  gap: "18px",
  flexWrap: "wrap",
  border: theme.border,
  position: "relative",
  overflow: "hidden",
  width: "100%",
  minWidth: 0,
  isolation: "isolate",
  clipPath: getThemeCardClipPath(theme, "hero"),
});

const featureCardStyle = (theme) => ({
  background: isSpaceConsoleTheme(theme)
    ? `${getThemeCardOrnament(theme, "feature")}, ${theme.observerPanelFrame}, ${theme.cardBackground}`
    : `${getThemeCardOrnament(theme, "feature")}, ${theme.cardBackground}`,
  borderRadius: isSpaceConsoleTheme(theme) ? theme.featureRadius || "14px" : theme.featureRadius || "24px",
  padding: "clamp(18px, 4vw, 24px)",
  boxShadow: isSpaceConsoleTheme(theme)
    ? `inset 0 2px 4px rgba(0,0,0,0.45), 0 18px 28px rgba(0,0,0,0.16), ${getThemeEdgeHighlight(theme)}`
    : `${theme.shadow}, ${getThemeEdgeHighlight(theme)}`,
  border: isSpaceConsoleTheme(theme) ? theme.observerBorder || theme.border : theme.border,
  clipPath: theme.featureClipPath || getThemeCardClipPath(theme, "feature"),
  position: "relative",
  overflow: "hidden",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  isolation: "isolate",
});

const sectionCardStyle = (theme, section, options = {}) => {
  const sectionThemes = {
    dashboard: {
      glow: darkModeSafe(theme, "rgba(155, 145, 255, 0.18)", "rgba(216, 176, 255, 0.16)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 16% 18%, rgba(140,126,255,0.12) 0%, rgba(140,126,255,0) 34%)",
        "radial-gradient(circle at 14% 16%, rgba(214,182,255,0.15) 0%, rgba(214,182,255,0) 32%)"
      ),
      tilt: "-0.35deg",
    },
    signals: {
      glow: darkModeSafe(theme, "rgba(128, 193, 255, 0.15)", "rgba(184, 176, 255, 0.14)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 78% 18%, rgba(108,170,255,0.12) 0%, rgba(108,170,255,0) 28%)",
        "radial-gradient(circle at 76% 18%, rgba(191,183,255,0.15) 0%, rgba(191,183,255,0) 28%)"
      ),
      tilt: "0.2deg",
    },
    jump: {
      glow: darkModeSafe(theme, "rgba(176, 145, 255, 0.16)", "rgba(214, 192, 255, 0.15)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 82% 72%, rgba(166,136,255,0.13) 0%, rgba(166,136,255,0) 30%)",
        "radial-gradient(circle at 84% 70%, rgba(201,188,255,0.14) 0%, rgba(201,188,255,0) 30%)"
      ),
      tilt: "-0.15deg",
    },
    meds: {
      glow: darkModeSafe(theme, "rgba(255, 123, 137, 0.18)", "rgba(239, 144, 104, 0.2)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 12% 20%, rgba(255,123,137,0.12) 0%, rgba(255,123,137,0) 28%)",
        "radial-gradient(circle at 12% 20%, rgba(248,162,97,0.16) 0%, rgba(248,162,97,0) 28%)"
      ),
      tilt: "-0.25deg",
    },
    food: {
      glow: darkModeSafe(theme, "rgba(255, 181, 103, 0.2)", "rgba(240, 182, 88, 0.2)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 82% 20%, rgba(255,175,93,0.12) 0%, rgba(255,175,93,0) 28%)",
        "radial-gradient(circle at 82% 20%, rgba(255,201,126,0.18) 0%, rgba(255,201,126,0) 28%)"
      ),
      tilt: "0.18deg",
    },
    sleep: {
      glow: darkModeSafe(theme, "rgba(114, 208, 255, 0.16)", "rgba(152, 196, 255, 0.16)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 20% 82%, rgba(114,208,255,0.14) 0%, rgba(114,208,255,0) 30%)",
        "radial-gradient(circle at 22% 80%, rgba(167,198,255,0.18) 0%, rgba(167,198,255,0) 30%)"
      ),
      tilt: "-0.18deg",
    },
    mood: {
      glow: darkModeSafe(theme, "rgba(245, 163, 255, 0.18)", "rgba(255, 177, 119, 0.2)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 18% 18%, rgba(245,163,255,0.13) 0%, rgba(245,163,255,0) 30%)",
        "radial-gradient(circle at 18% 18%, rgba(255,192,120,0.18) 0%, rgba(255,192,120,0) 30%)"
      ),
      tilt: "0.18deg",
    },
    goals: {
      glow: darkModeSafe(theme, "rgba(134, 168, 255, 0.16)", "rgba(200, 183, 255, 0.15)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 82% 20%, rgba(126,170,255,0.12) 0%, rgba(126,170,255,0) 30%)",
        "radial-gradient(circle at 82% 20%, rgba(205,189,255,0.14) 0%, rgba(205,189,255,0) 30%)"
      ),
      tilt: "-0.2deg",
    },
    maintenance: {
      glow: darkModeSafe(theme, "rgba(118, 211, 159, 0.16)", "rgba(158, 205, 132, 0.18)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 72% 20%, rgba(118,211,159,0.13) 0%, rgba(118,211,159,0) 28%)",
        "radial-gradient(circle at 72% 20%, rgba(160,209,127,0.16) 0%, rgba(160,209,127,0) 28%)"
      ),
      tilt: "0.14deg",
    },
    cleaning: {
      glow: darkModeSafe(theme, "rgba(255, 209, 102, 0.14)", "rgba(237, 172, 90, 0.18)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 80% 78%, rgba(255,209,102,0.12) 0%, rgba(255,209,102,0) 26%)",
        "radial-gradient(circle at 80% 78%, rgba(237,172,90,0.16) 0%, rgba(237,172,90,0) 26%)"
      ),
      tilt: "-0.12deg",
    },
    exercise: {
      glow: darkModeSafe(theme, "rgba(157, 140, 255, 0.18)", "rgba(214, 146, 234, 0.18)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 18% 18%, rgba(157,140,255,0.14) 0%, rgba(157,140,255,0) 28%)",
        "radial-gradient(circle at 18% 18%, rgba(219,159,235,0.16) 0%, rgba(219,159,235,0) 28%)"
      ),
      tilt: "0.24deg",
    },
    charts: {
      glow: darkModeSafe(theme, "rgba(114, 208, 255, 0.16)", "rgba(245, 184, 98, 0.18)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 16% 18%, rgba(114,208,255,0.12) 0%, rgba(114,208,255,0) 28%)",
        "radial-gradient(circle at 16% 18%, rgba(245,184,98,0.16) 0%, rgba(245,184,98,0) 28%)"
      ),
      tilt: "-0.1deg",
    },
    care: {
      glow: darkModeSafe(theme, "rgba(207, 150, 255, 0.15)", "rgba(198, 180, 255, 0.14)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 84% 18%, rgba(214,162,255,0.12) 0%, rgba(214,162,255,0) 28%)",
        "radial-gradient(circle at 84% 18%, rgba(205,190,255,0.14) 0%, rgba(205,190,255,0) 28%)"
      ),
      tilt: "0.12deg",
    },
  };

  const accent = sectionThemes[section] || sectionThemes.dashboard;
  const frame = getSectionFrameStyle(theme, section, false);
  if (theme.trackerReef) {
    const reefPanelBySection = {
      dashboard: theme.trackerReefPanelTeal,
      meds: theme.trackerReefPanelPink,
      food: theme.trackerReefPanelPeach,
      sleep: theme.trackerReefPanelTeal,
      mood: theme.trackerReefPanelPink,
      goals: theme.trackerReefPanelPeach,
      maintenance: theme.trackerReefPanelTeal,
      cleaning: theme.trackerReefPanelPeach,
      exercise: theme.trackerReefPanelPink,
      charts: theme.trackerReefPanelTeal,
      signals: theme.trackerReefPanelPink,
      care: theme.trackerReefPanelPeach,
      jump: theme.trackerReefPanelTeal,
    };
    const basePanel = reefPanelBySection[section] || theme.trackerReefPanelTeal || theme.cardBackground;

    return {
      ...featureCardStyle(theme),
      background: `${getThemeCardOrnament(theme, "feature")}, ${basePanel}`,
      boxShadow: `${theme.shadow}, ${frame.boxShadow}, 0 22px 40px rgba(5, 29, 38, 0.26), inset 0 1px 0 rgba(255,255,255,0.08)`,
      border: theme.border,
      borderRadius: theme.featureRadius || "24px",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
    };
  }

  if (theme.trackerAbyss) {
    return {
      ...featureCardStyle(theme),
      background: `${getThemeCardOrnament(theme, "feature")}, ${theme.trackerAbyssPanelStrong || theme.trackerAbyssPanel || theme.cardBackground}`,
      boxShadow: `${theme.shadow}, ${frame.boxShadow}, 0 22px 42px rgba(0, 11, 17, 0.42), inset 0 1px 0 rgba(255,255,255,0.03)`,
      border: theme.border,
      borderRadius: theme.featureRadius || "24px",
      backdropFilter: "blur(18px) saturate(150%)",
      WebkitBackdropFilter: "blur(18px) saturate(150%)",
    };
  }

  if (theme.trackerSolar) {
    return {
      ...featureCardStyle(theme),
      background: `${getThemeCardOrnament(theme, "feature")}, radial-gradient(circle at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 42%), ${theme.trackerSolarGlass || theme.cardBackground}`,
      boxShadow: `0 20px 36px rgba(124,72,16,0.16), inset 0 1px 0 rgba(255,255,255,0.26), ${frame.boxShadow}`,
      border: theme.border,
      borderRadius: theme.featureRadius || "24px",
      backdropFilter: "blur(24px) saturate(165%)",
      WebkitBackdropFilter: "blur(24px) saturate(165%)",
    };
  }

  if (theme.trackerObservatory) {
    return {
      ...featureCardStyle(theme),
      background: `${accent.tint}, linear-gradient(180deg, ${theme.trackerGlassBackground || "rgba(4, 4, 10, 0.54)"} 0%, rgba(8,8,20,0.72) 100%)`,
      boxShadow: `${theme.shadow}, ${frame.boxShadow}, 0 18px 34px ${accent.glow}`,
      border: theme.observerBorder || theme.border,
      borderRadius: theme.sectionRadius || theme.featureRadius || "24px",
      backdropFilter: "blur(22px) saturate(150%)",
      WebkitBackdropFilter: "blur(22px) saturate(150%)",
    };
  }

  if (isCelestialGalaxyTrackerTheme(theme) && !options.disableCelestialFrame) {
    return {
      ...featureCardStyle(theme),
      ...getCelestialGalaxyCardStyle(section, "section"),
      padding: "34px 30px 28px",
      backdropFilter: "blur(28px) saturate(155%)",
      WebkitBackdropFilter: "blur(28px) saturate(155%)",
    };
  }

  return {
    ...featureCardStyle(theme),
    background: `${frame.backgroundOverlay}, ${accent.tint}, ${theme.cardBackground}`,
    boxShadow: `${theme.shadow}, ${frame.boxShadow}, 0 18px 34px ${accent.glow}`,
    borderRadius: theme.sectionRadius || theme.featureRadius || "26px",
  };
};

const observerSectionCardStyle = (theme, section) => {
  if (isSpaceConsoleTheme(theme)) {
    const sectionAccents = {
      dashboard: "linear-gradient(90deg, rgba(39,215,161,0.16) 0%, rgba(39,215,161,0) 36%)",
      signals: "linear-gradient(90deg, rgba(255,191,71,0.16) 0%, rgba(255,191,71,0) 36%)",
      jump: "linear-gradient(90deg, rgba(129,242,167,0.14) 0%, rgba(129,242,167,0) 36%)",
      care: "linear-gradient(90deg, rgba(216,91,87,0.16) 0%, rgba(216,91,87,0) 36%)",
      goals: "linear-gradient(90deg, rgba(125,231,212,0.16) 0%, rgba(125,231,212,0) 36%)",
    };

    return {
      ...featureCardStyle(theme),
      background: `${sectionAccents[section] || sectionAccents.dashboard}, ${theme.observerCardBackground || theme.cardBackground}`,
      border: theme.observerBorder || theme.border,
      boxShadow: theme.observerShadow || theme.shadow,
      borderRadius: theme.observerRadius || "14px",
      clipPath: "none",
    };
  }

  const observerAccents = {
    dashboard: "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 26%)",
    signals: "radial-gradient(circle at 82% 18%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 24%)",
    jump: "radial-gradient(circle at 18% 82%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 24%)",
    care: "radial-gradient(circle at 76% 74%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 24%)",
    goals: "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 22%)",
  };
  const frame = getSectionFrameStyle(theme, section, true);

  return {
    ...featureCardStyle(theme),
    background: `${frame.backgroundOverlay}, ${observerAccents[section] || observerAccents.dashboard}, ${theme.observerCardBackground || theme.cardBackground}`,
    border: theme.observerBorder || theme.border,
    boxShadow: `${theme.observerShadow || theme.shadow}, ${frame.boxShadow}`,
    borderRadius: theme.observerRadius || "18px",
    clipPath: "none",
  };
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "20px",
};

const chartsPageStyle = {
  display: "grid",
  gap: "22px",
};

const titleStyle = (theme) => ({
  margin: 0,
  fontSize: "clamp(1.75rem, 5vw, 2.3rem)",
  color: theme.text,
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.08em" : "0.02em",
  fontFamily: isSpaceConsoleTheme(theme)
    ? theme.observerHeadingFamily
    : undefined,
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  overflowWrap: "anywhere",
});

const tinyLabelStyle = (theme) => ({
  margin: "0 0 6px 0",
  color: theme.faintText,
  textTransform: "uppercase",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.22em" : "0.16em",
  fontSize: "0.78rem",
  fontWeight: "bold",
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerFontFamily : undefined,
});

const subtitleStyle = (theme) => ({
  margin: "8px 0 6px 0",
  color: theme.subtleText,
  lineHeight: 1.5,
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerFontFamily : undefined,
});

const dateStyle = (theme) => ({
  margin: 0,
  color: theme.faintText,
  fontSize: "0.95rem",
  lineHeight: 1.45,
});

const lastActionStyle = (theme) => ({
  marginTop: "10px",
  color: theme.subtleText,
  fontSize: "0.95rem",
  lineHeight: 1.45,
});

const headerControlsStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "stretch",
  flexWrap: "wrap",
  width: "100%",
  minWidth: 0,
};

const cardHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  gap: "12px",
  flexWrap: "wrap",
};

const emojiStyle = {
  fontSize: "1.15rem",
  marginBottom: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: "bold",
  width: "fit-content",
};

const sectionTitleStyle = (theme) => ({
  marginTop: 0,
  marginBottom: "10px",
  color: theme.text,
  fontSize: "clamp(1.15rem, 4vw, 1.35rem)",
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerHeadingFamily : undefined,
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.06em" : "normal",
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  overflowWrap: "anywhere",
  lineHeight: 1.25,
});

const helperTextStyle = (theme) => ({
  marginTop: 0,
  color: theme.faintText,
  fontSize: "0.95rem",
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerFontFamily : undefined,
  overflowWrap: "anywhere",
  lineHeight: 1.55,
});

const countTextStyle = (theme) => ({
  color: theme.subtleText,
  fontWeight: "bold",
});

const emptyTextStyle = (theme) => ({
  color: theme.faintText,
  fontStyle: "italic",
});

const labelStyle = (theme) => ({
  display: "block",
  marginBottom: "10px",
  fontWeight: "bold",
  color: theme.subtleText,
});

const smallInfoStyle = (theme) => ({
  margin: "10px 0 0 0",
  color: theme.faintText,
  fontSize: "0.9rem",
  overflowWrap: "anywhere",
  lineHeight: 1.55,
});

const rowStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "stretch",
  flexWrap: "wrap",
  flexDirection: "column",
  width: "100%",
};

const buttonWrapStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "stretch",
  width: "100%",
};

const sleepGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
  gap: "16px",
};

function getControlRadius(theme, variant = "button") {
  if (isSpaceConsoleTheme(theme)) {
    return variant === "field" ? "10px" : variant === "chip" ? "999px" : "10px";
  }

  if (theme.trackerReef) {
    return variant === "field"
      ? "22px 14px 24px 16px / 18px 24px 16px 22px"
      : variant === "chip"
      ? "999px 999px 18px 999px"
      : "22px 14px 24px 16px / 18px 24px 16px 22px";
  }

  if (theme.trackerAbyss) {
    return variant === "field"
      ? "20px 14px 22px 14px / 18px 20px 16px 22px"
      : variant === "chip"
      ? "16px"
      : "18px 14px 20px 14px / 16px 18px 14px 20px";
  }

  if (theme.trackerSolar) {
    return variant === "field"
      ? "18px 24px 18px 26px / 24px 18px 24px 20px"
      : variant === "chip"
      ? "999px"
      : "999px";
  }

  if (theme.themeFamily === "underwater") {
    return variant === "field"
      ? "18px 14px 20px 14px / 14px 18px 16px 20px"
      : variant === "chip"
      ? "999px 999px 18px 999px"
      : "18px 14px 18px 14px / 14px 18px 14px 18px";
  }

  if (theme.themeFamily === "forest") {
    return variant === "field"
      ? "16px 20px 16px 22px / 20px 16px 22px 18px"
      : variant === "chip"
      ? "18px 999px 18px 999px"
      : "14px 18px 14px 18px / 18px 14px 18px 16px";
  }

  return variant === "field" ? "18px" : variant === "chip" ? "999px" : "999px";
}

function getControlFontFamily(theme) {
  return theme.trackerUiFamily || (isSpaceConsoleTheme(theme) ? theme.observerFontFamily : undefined);
}

function getFieldBackground(theme) {
  if (isSpaceConsoleTheme(theme)) {
    return "linear-gradient(180deg, rgba(12,18,28,0.96) 0%, rgba(7,12,18,0.98) 100%)";
  }

  if (theme.trackerReef) {
    return `radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 24%), linear-gradient(180deg, rgba(2,24,30,0.9) 0%, rgba(1,16,20,0.95) 100%)`;
  }

  if (theme.trackerAbyss) {
    return `radial-gradient(circle at 84% 18%, rgba(34,211,238,0.1) 0%, rgba(34,211,238,0) 22%), linear-gradient(180deg, rgba(1,16,20,0.96) 0%, rgba(2,11,14,0.98) 100%)`;
  }

  if (theme.trackerSolar) {
    return `radial-gradient(circle at 16% 18%, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0) 22%), linear-gradient(180deg, rgba(255,250,240,0.96) 0%, rgba(255,242,216,0.92) 100%)`;
  }

  if (theme.themeFamily === "underwater") {
    return `radial-gradient(circle at 82% 18%, rgba(221,248,252,0.34) 0%, rgba(221,248,252,0) 22%), ${theme.inputBackground}`;
  }

  if (theme.themeFamily === "forest") {
    return `radial-gradient(circle at 18% 18%, rgba(229,239,209,0.28) 0%, rgba(229,239,209,0) 22%), ${theme.inputBackground}`;
  }

  return `radial-gradient(circle at 14% 18%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 22%), ${theme.inputBackground}`;
}

function getSoftControlBackground(theme) {
  if (theme.trackerReef) {
    return theme.trackerReefPanelPink || theme.softButtonBackground;
  }

  if (theme.trackerAbyss) {
    return "linear-gradient(135deg, rgba(6,38,46,0.96) 0%, rgba(2,18,22,0.98) 100%)";
  }

  return theme.softButtonBackground;
}

function getSuccessControlBackground(theme) {
  if (isSpaceConsoleTheme(theme)) {
    return `linear-gradient(180deg, ${theme.observerAccent || "#27d7a1"} 0%, ${theme.observerAccentAlt || "#ffbf47"} 100%)`;
  }

  if (theme.trackerReef) {
    return theme.trackerReefPanelTeal || theme.primary;
  }

  if (theme.trackerAbyss) {
    return "linear-gradient(135deg, rgba(34,211,238,0.96) 0%, rgba(20,143,175,0.88) 100%)";
  }

  if (theme.trackerSolar) {
    return "linear-gradient(135deg, rgba(255,208,117,0.98) 0%, rgba(232,144,104,0.96) 100%)";
  }

  return `linear-gradient(135deg, ${theme.success} 0%, ${theme.success} 100%)`;
}

const inputStyle = (theme) => ({
  padding: theme.trackerSolar ? "14px 16px" : "13px 14px",
  borderRadius: getControlRadius(theme, "field"),
  border: `1px solid ${theme.inputBorder}`,
  color: theme.text,
  background: getFieldBackground(theme),
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem",
  boxShadow: isSpaceConsoleTheme(theme)
    ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(0,0,0,0.3)`
    : theme.trackerReef || theme.trackerAbyss
    ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 28px rgba(0,0,0,0.12)`
    : `inset 0 1px 0 ${theme.star}, 0 8px 18px ${theme.glow}`,
  minWidth: 0,
  lineHeight: 1.4,
  appearance: "none",
  WebkitAppearance: "none",
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.04em" : theme.trackerAbyss ? "0.02em" : "normal",
  accentColor: theme.trackerAccent || theme.success,
});

const primaryButtonStyle = (theme) => ({
  background: theme.primary,
  color: theme.primaryText,
  border: isSpaceConsoleTheme(theme)
    ? `1px solid ${theme.observerAccentAlt || theme.inputBorder}`
    : "none",
  borderRadius: getControlRadius(theme, "button"),
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: isSpaceConsoleTheme(theme)
    ? `inset 0 1px 0 rgba(255,255,255,0.16), 0 6px 0 rgba(0,0,0,0.3), 0 12px 22px ${theme.glow}`
    : theme.trackerReef || theme.trackerAbyss
    ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 14px 28px ${theme.glow}`
    : `0 10px 22px ${theme.glow}`,
  minHeight: "48px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.06em" : theme.trackerAbyss ? "0.03em" : "normal",
});

const softButtonStyle = (theme) => ({
  background: getSoftControlBackground(theme),
  color: theme.softButtonText,
  border: isSpaceConsoleTheme(theme)
    ? `1px solid ${theme.inputBorder}`
    : theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder}`
    : "none",
  borderRadius: getControlRadius(theme, "button"),
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  minHeight: "48px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
  boxShadow: isSpaceConsoleTheme(theme)
    ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 0 rgba(0,0,0,0.24)"
    : theme.trackerReef || theme.trackerAbyss
    ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.14)`
    : `0 8px 18px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : theme.trackerAbyss ? "0.03em" : "normal",
});

const successButtonStyle = (theme) => ({
  background: getSuccessControlBackground(theme),
  color: isSpaceConsoleTheme(theme)
    ? theme.primaryText
    : theme.trackerAbyss || theme.trackerSolar
    ? theme.primaryText
    : "#fffaf2",
  border: isSpaceConsoleTheme(theme)
    ? `1px solid ${theme.observerAccentAlt || theme.inputBorder}`
    : theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder}`
    : "none",
  borderRadius: getControlRadius(theme, "button"),
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  minHeight: "48px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
  boxShadow: isSpaceConsoleTheme(theme)
    ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 0 rgba(0,0,0,0.28), 0 12px 24px ${theme.glow}`
    : `0 12px 24px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.06em" : theme.trackerAbyss ? "0.03em" : "normal",
});

const smallRemoveButtonStyle = (theme) => ({
  background: getSoftControlBackground(theme),
  color: theme.softButtonText,
  border: isSpaceConsoleTheme(theme)
    ? `1px solid ${theme.inputBorder}`
    : theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder}`
    : "none",
  borderRadius: getControlRadius(theme, "chip"),
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: "bold",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  boxShadow: isSpaceConsoleTheme(theme)
    ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 0 rgba(0,0,0,0.22)"
    : `0 8px 18px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : "normal",
});

const navButtonStyle = (active, theme) => ({
  background: active ? theme.navActive : theme.navInactive,
  color: active ? theme.primaryText : theme.navText,
  border: isSpaceConsoleTheme(theme)
    ? `1px solid ${active ? theme.observerAccentAlt : theme.inputBorder}`
    : "none",
  borderRadius:
    theme.themeFamily === "underwater"
      ? "22px 18px 22px 18px / 18px 22px 18px 22px"
      : theme.themeFamily === "forest"
      ? "18px 24px 18px 22px / 22px 18px 22px 20px"
      : isSpaceConsoleTheme(theme)
      ? "10px"
      : "999px",
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: isSpaceConsoleTheme(theme)
    ? active
      ? `inset 0 1px 0 rgba(255,255,255,0.14), 0 5px 0 rgba(0,0,0,0.28), 0 12px 24px ${theme.glow}`
      : "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 0 rgba(0,0,0,0.18)"
    : active
    ? `0 12px 24px ${theme.glow}`
    : "none",
  minHeight: "42px",
  flex: "0 1 auto",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
  fontSize: "0.92rem",
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerFontFamily : undefined,
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : "normal",
});

const mealListStyle = {
  listStyle: "none",
  padding: 0,
  margin: "12px 0 0 0",
};

const mealItemStyle = (theme, options = {}) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap",
  ...(!options.disableCelestialFrame && isCelestialGalaxyTrackerTheme(theme)
    ? getCelestialGalaxyCardStyle("signals", "item")
    : {}),
  background: theme.trackerReef || theme.trackerAbyss
    ? `radial-gradient(circle at 82% 18%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 22%), ${theme.itemBackground}`
    : theme.themeFamily === "forest"
    ? `radial-gradient(circle at 16% 20%, rgba(228,238,205,0.16) 0%, rgba(228,238,205,0) 22%), ${theme.itemBackground}`
    : theme.themeFamily === "underwater"
    ? `radial-gradient(circle at 82% 20%, rgba(220,247,251,0.16) 0%, rgba(220,247,251,0) 22%), ${theme.itemBackground}`
    : `linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  padding: "14px",
  borderRadius: getControlRadius(theme, "field"),
  marginBottom: "10px",
  minWidth: 0,
  border: theme.border,
  boxShadow: `0 12px 24px ${theme.glow}`,
});

const rangeStyle = (theme) => ({
  width: "100%",
  accentColor: theme.trackerAccent || theme.success,
  cursor: "pointer",
  minHeight: "22px",
  borderRadius: getControlRadius(theme, "chip"),
  background: theme.track,
});

const sliderValueStyle = (theme) => ({
  color: theme.subtleText,
  fontWeight: "bold",
  marginBottom: "10px",
});

const themeToggleStyle = (theme) => ({
  background: theme.toggleBackground,
  color: theme.toggleText,
  border: "none",
  borderRadius:
    theme.themeFamily === "underwater"
      ? "22px 18px 22px 18px / 18px 22px 18px 22px"
      : theme.themeFamily === "forest"
      ? "18px 24px 18px 22px / 22px 18px 22px 20px"
      : "999px",
  padding: "12px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 12px 24px ${theme.glow}`,
  minHeight: "48px",
  flex: "1 1 160px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
});

const statusBadgeStyle = (status, theme) => ({
  padding: "12px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  backgroundColor:
    status === "Saved"
      ? "rgba(105,201,178,0.24)"
      : status.includes("Error")
      ? "rgba(201,107,107,0.22)"
      : theme.itemBackground,
  color: theme.text,
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
  lineHeight: 1.4,
});

const feedbackMessageStyle = (tone, theme) => ({
  marginTop: "14px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: theme.border,
  backgroundColor:
    tone === "error"
      ? "rgba(201,107,107,0.16)"
      : tone === "info"
      ? theme.itemBackground
      : "rgba(105,201,178,0.16)",
  color: theme.text,
  fontSize: "0.95rem",
  lineHeight: 1.45,
});

const dashboardHeroStyle = (theme) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "stretch",
  flexDirection: "column",
  gap: "22px",
  padding: "20px",
  borderRadius: isSpaceConsoleTheme(theme) ? "12px" : "22px",
  background: `${getThemeCardOrnament(theme, "summary")}, linear-gradient(145deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  marginBottom: "20px",
  flexWrap: "wrap",
  boxShadow: `inset 0 1px 0 ${theme.star}, 0 14px 28px ${theme.glow}, ${getThemeEdgeHighlight(theme)}`,
  border: theme.border,
  clipPath: getThemeCardClipPath(theme, "summary"),
});

const observerHeroStyle = (theme) => ({
  ...dashboardHeroStyle(theme),
  background: theme.observerHeroBackground || theme.heroBackground,
  border: theme.observerBorder || theme.border,
  borderRadius: theme.observerRadius || "18px",
  boxShadow: theme.observerShadow || theme.shadow,
  position: "relative",
  overflow: "hidden",
});

const dashboardKickerStyle = (theme) => ({
  margin: "0 0 8px 0",
  color: theme.faintText,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontSize: "0.75rem",
  fontWeight: "bold",
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerFontFamily : undefined,
});

const dashboardHeadingStyle = (theme) => ({
  margin: 0,
  fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
  color: theme.text,
  fontFamily: isSpaceConsoleTheme(theme) ? theme.observerHeadingFamily : undefined,
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.06em" : "normal",
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  overflowWrap: "anywhere",
});

const dashboardPulseStyle = () => ({
  position: "relative",
  width: "clamp(88px, 28vw, 112px)",
  aspectRatio: "1 / 1",
  display: "grid",
  placeItems: "center",
  alignSelf: "center",
});

const dashboardPulseRingStyle = (theme) => ({
  position: "absolute",
  inset: "8px",
  borderRadius: "50%",
  border: `1px solid ${theme.star}`,
  boxShadow: `0 0 24px ${theme.glow}`,
});

const dashboardPulseCoreStyle = (theme) => ({
  width: "clamp(56px, 18vw, 68px)",
  aspectRatio: "1 / 1",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontWeight: "bold",
  fontSize: "1.1rem",
  color: theme.text,
  background: theme.primary,
  boxShadow: `0 0 22px ${theme.glow}`,
});

const dashboardStatsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
  gap: "16px",
};

const summaryCardStyle = (theme, options = {}) => ({
  background: isSpaceConsoleTheme(theme)
    ? `${getThemeCardOrnament(theme, "summary")}, linear-gradient(180deg, rgba(8,12,20,0.9) 0%, rgba(14,18,29,0.95) 100%)`
    : theme.themeFamily === "underwater"
      ? `${getThemeCardOrnament(theme, "summary")}, linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`
      : theme.themeFamily === "forest"
      ? `${getThemeCardOrnament(theme, "summary")}, linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`
      : `${getThemeCardOrnament(theme, "summary")}, linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  borderRadius: isSpaceConsoleTheme(theme) ? "12px" : "22px",
  padding: "18px",
  border: isSpaceConsoleTheme(theme) ? theme.observerBorder || theme.border : theme.border,
  boxShadow: isSpaceConsoleTheme(theme)
    ? `inset 0 2px 4px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.18), ${getThemeEdgeHighlight(theme)}`
    : `0 16px 32px ${theme.glow}, ${getThemeEdgeHighlight(theme)}`,
  clipPath: getThemeCardClipPath(theme, "summary"),
  ...(!options.disableCelestialFrame && isCelestialGalaxyTrackerTheme(theme)
    ? getCelestialGalaxyCardStyle("signals", "summary")
    : {}),
});

const summaryLabelStyle = (theme) => ({
  color: theme.faintText,
  fontSize: "0.82rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: "bold",
});

const summaryValueStyle = (theme) => ({
  color: theme.text,
  fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
  fontWeight: "bold",
  marginTop: "8px",
  overflowWrap: "anywhere",
});

const summaryNoteStyle = (theme) => ({
  color: theme.subtleText,
  fontSize: "0.9rem",
  marginTop: "10px",
  overflowWrap: "anywhere",
  lineHeight: 1.5,
});

const quickLinkGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(110px, max-content))",
  gap: "10px",
  justifyContent: "start",
};

const goalFormGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
  gap: "16px",
};

const goalSuggestionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const permissionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))",
  gap: "10px",
};

const permissionItemStyle = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 12px",
  borderRadius: getControlRadius(theme, "field"),
  background: theme.trackerReef || theme.trackerAbyss
    ? `linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`
    : theme.itemBackground,
  color: theme.text,
  fontSize: "0.92rem",
  border: theme.border,
  boxShadow: `0 8px 18px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
});

const moodTagGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
};

const tagGroupLabelStyle = (theme) => ({
  margin: "0 0 8px 0",
  color: theme.faintText,
  fontSize: "0.82rem",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  fontWeight: "bold",
});

const moodTagButtonStyle = (selected, theme) => ({
  background: selected ? theme.primary : getSoftControlBackground(theme),
  color: selected ? theme.primaryText : theme.softButtonText,
  border: selected
    ? isSpaceConsoleTheme(theme)
      ? `1px solid ${theme.observerAccentAlt || theme.inputBorder}`
      : "none"
    : isSpaceConsoleTheme(theme) || theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder || theme.observerAccentAlt}`
    : "none",
  borderRadius: getControlRadius(theme, "chip"),
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: selected ? `0 12px 26px ${theme.glow}` : `0 8px 18px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : theme.trackerAbyss ? "0.02em" : "normal",
});

const goalSuggestionButtonStyle = (theme) => ({
  background: getSoftControlBackground(theme),
  color: theme.softButtonText,
  border: isSpaceConsoleTheme(theme) || theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder || theme.observerAccentAlt}`
    : "none",
  borderRadius: getControlRadius(theme, "chip"),
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 8px 18px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : "normal",
});

const quickJumpButtonStyle = (theme) => ({
  background: getSoftControlBackground(theme),
  color: theme.softButtonText,
  border: isSpaceConsoleTheme(theme)
    ? `1px solid ${theme.inputBorder}`
    : theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder}`
    : "none",
  borderRadius: getControlRadius(theme, "field"),
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: isSpaceConsoleTheme(theme)
    ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 0 rgba(0,0,0,0.22)"
    : theme.trackerReef || theme.trackerAbyss
    ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 24px rgba(0,0,0,0.14)`
    : `0 10px 20px ${theme.glow}`,
  minHeight: "42px",
  width: "auto",
  minWidth: "110px",
  maxWidth: "160px",
  lineHeight: 1.35,
  textAlign: "center",
  justifySelf: "start",
  fontSize: "0.92rem",
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : theme.trackerAbyss ? "0.03em" : "normal",
});

const chartToolbarStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const rangeChipStyle = (active, theme) => ({
  background: active ? theme.primary : getSoftControlBackground(theme),
  color: active ? theme.primaryText : theme.softButtonText,
  border: active
    ? "none"
    : isSpaceConsoleTheme(theme) || theme.trackerReef || theme.trackerAbyss
    ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder || theme.observerAccentAlt}`
    : "none",
  borderRadius: getControlRadius(theme, "chip"),
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: active ? `0 10px 22px ${theme.glow}` : `0 8px 18px ${theme.glow}`,
  fontFamily: getControlFontFamily(theme),
  textTransform: isSpaceConsoleTheme(theme) ? "uppercase" : "none",
  letterSpacing: isSpaceConsoleTheme(theme) ? "0.05em" : "normal",
});

const trackerSectionSwitcherButtonStyle = (active, theme) => ({
  ...quickJumpButtonStyle(theme),
  minWidth: "unset",
  maxWidth: "100%",
  background: active ? theme.primary : getSoftControlBackground(theme),
  color: active ? theme.primaryText : theme.softButtonText,
  border: active
    ? isSpaceConsoleTheme(theme)
      ? `1px solid ${theme.observerAccentAlt || theme.inputBorder}`
      : theme.trackerReef || theme.trackerAbyss
      ? `1px solid ${theme.trackerReefPanelBorder || theme.trackerAbyssMutedBorder || theme.inputBorder}`
      : "none"
    : quickJumpButtonStyle(theme).border,
  boxShadow: active
    ? isSpaceConsoleTheme(theme)
      ? `inset 0 1px 0 rgba(255,255,255,0.16), 0 6px 0 rgba(0,0,0,0.28), 0 12px 24px ${theme.glow}`
      : `0 12px 24px ${theme.glow}`
    : quickJumpButtonStyle(theme).boxShadow,
});

const chartStackStyle = {
  display: "grid",
  gap: "20px",
};

const chartCardStyle = (theme) => ({
  ...(isCelestialGalaxyTrackerTheme(theme) ? getCelestialGalaxyCardStyle("charts", "chart") : {}),
  background: isSpaceConsoleTheme(theme)
    ? theme.modeName === "Solar"
      ? `${getThemeCardOrnament(theme, "chart")}, linear-gradient(180deg, rgba(245, 239, 227, 0.98) 0%, rgba(225, 217, 203, 0.995) 100%)`
      : `${getThemeCardOrnament(theme, "chart")}, linear-gradient(180deg, rgba(7,10,17,0.95) 0%, rgba(13,18,28,0.98) 100%)`
    : `${getThemeCardOrnament(theme, "chart")}, linear-gradient(160deg, ${theme.chartSurface} 0%, rgba(255,255,255,0.03) 100%)`,
  borderRadius: isSpaceConsoleTheme(theme) ? "12px" : "22px",
  padding: "18px",
  border: isSpaceConsoleTheme(theme) ? theme.observerBorder || theme.border : theme.border,
  boxShadow: isSpaceConsoleTheme(theme)
    ? theme.modeName === "Solar"
      ? `inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 24px rgba(116,100,78,0.12), ${getThemeEdgeHighlight(theme)}`
      : `inset 0 2px 4px rgba(0,0,0,0.52), 0 12px 24px rgba(0,0,0,0.18), ${getThemeEdgeHighlight(theme)}`
    : `${theme.shadow}, 0 16px 30px ${theme.glow}, ${getThemeEdgeHighlight(theme)}`,
  clipPath: getThemeCardClipPath(theme, "feature"),
});

const goalCardItemStyle = (theme, options = {}) => ({
  ...mealItemStyle(theme, options),
  alignItems: "stretch",
});

const goalMetaStyle = (theme) => ({
  color: theme.subtleText,
  fontSize: "0.88rem",
  marginTop: "6px",
  overflowWrap: "anywhere",
});

const goalProgressTrackStyle = (theme) => ({
  width: "100%",
  height: "12px",
  borderRadius: "999px",
  background: theme.track,
  marginTop: "10px",
  overflow: "hidden",
});

const goalProgressFillStyle = (theme) => ({
  height: "100%",
  borderRadius: "999px",
  background: theme.primary,
  boxShadow: `0 0 16px ${theme.glow}`,
});

const rewardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
  gap: "14px",
};

const rewardCardStyle = (theme, options = {}) => ({
  ...(!options.disableCelestialFrame && isCelestialGalaxyTrackerTheme(theme)
    ? getCelestialGalaxyCardStyle("goals", "reward")
    : {}),
  background: isSpaceConsoleTheme(theme)
    ? `${getThemeCardOrnament(theme, "reward")}, linear-gradient(180deg, rgba(9,13,21,0.95) 0%, rgba(15,20,31,0.98) 100%)`
    : theme.themeFamily === "underwater"
      ? `${getThemeCardOrnament(theme, "reward")}, linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`
      : theme.themeFamily === "forest"
      ? `${getThemeCardOrnament(theme, "reward")}, linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`
      : `${getThemeCardOrnament(theme, "reward")}, linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`,
  borderRadius: isSpaceConsoleTheme(theme) ? "12px" : "20px",
  padding: "16px",
  border: isSpaceConsoleTheme(theme) ? theme.observerBorder || theme.border : theme.border,
  boxShadow: isSpaceConsoleTheme(theme)
    ? `inset 0 2px 4px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.18), ${getThemeEdgeHighlight(theme)}`
    : `0 14px 28px ${theme.glow}, ${getThemeEdgeHighlight(theme)}`,
  clipPath: getThemeCardClipPath(theme, "reward"),
});

const rewardTitleStyle = (theme) => ({
  color: theme.text,
  fontWeight: "bold",
  marginBottom: "6px",
  overflowWrap: "anywhere",
});

const popupOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(8, 10, 20, 0.38)",
  display: "grid",
  placeItems: "center",
  padding: "20px",
  zIndex: 40,
};

const popupCardStyle = (theme) => ({
  width: "min(460px, 100%)",
  background: theme.heroBackground,
  borderRadius: theme.observerRadius || theme.heroRadius || "24px",
  padding: "22px",
  border: theme.border,
  boxShadow: theme.heroShadow,
  textAlign: "center",
});

function darkModeSafe(theme, galaxyValue, solarValue) {
  return theme.modeName === "Galaxy" ? galaxyValue : solarValue;
}

function buildTrackerTutorialSteps(selectedTrackingAreaOptions) {
  const categorySummary =
    selectedTrackingAreaOptions.length > 0
      ? selectedTrackingAreaOptions.map((area) => area.label).join(", ")
      : "Meds, Food, Hygiene, Sleep, Cleaning, Exercise, To-Do, and Mood";
  const firstCategory = selectedTrackingAreaOptions[0];
  const hasMoodCategory = selectedTrackingAreaOptions.some((area) => area.pageKey === "mood");
  const secondCategory = selectedTrackingAreaOptions[1] || null;

  return [
    {
      id: "overview",
      pageKey: "mission",
      title: "This is your main overview",
      body:
        "Start here when you want to get oriented. This screen gives you a quick read on today and lets you jump into the areas you picked.",
      calloutPosition: "bottom-right",
      spotlightRegion: "overview-orbit",
      focusLabel: "What to notice here",
      focusItems: [
        "The overview is the fastest way to reorient if the app feels busy.",
        "Most cards here are shortcuts, so tapping them should move you to the matching section.",
      ],
      tip: "If someone is unsure where to start, the overview is the safest first stop.",
    },
    {
      id: "categories",
      pageKey: firstCategory?.pageKey || "mission",
      title: "Your tracker categories are personalized",
      body: `Right now your visible categories are ${categorySummary}. The app only shows the sections you chose so the tracker feels lighter.`,
      calloutPosition: "top-right",
      spotlightRegion: "tracker-nav",
      focusLabel: "Why this matters",
      focusItems: [
        "People may think categories are missing when they were simply never added.",
        "The tracker nav changes based on these choices, so two users may not see the same layout.",
      ],
      tip: "This is one of the main ideas the tutorial should teach clearly.",
    },
    ...(firstCategory
      ? [
          {
            id: "category-log",
            pageKey: firstCategory.pageKey,
            title: `Open ${firstCategory.label} to log details`,
            body: `Each category page is its own logging space. ${firstCategory.description} On smaller screens, these pages are grouped under the main Log area.`,
            calloutPosition: "top-right",
            spotlightRegion: "tracking-form-upper",
            focusLabel: "Try this mentally",
            focusItems: [
              `A user opens ${firstCategory.label} when they want to log something specific, not when they want a summary.`,
              "The chips near the top let people switch between visible categories without going all the way back.",
            ],
            tip: "This step is especially important on mobile because Log can hide the category names at first glance.",
          },
        ]
      : []),
    ...(secondCategory
      ? [
          {
            id: "category-switching",
            pageKey: secondCategory.pageKey,
            title: "Switching categories should feel easy",
            body: `Here is a second example with ${secondCategory.label}. The goal is for users to understand that categories are sibling spaces, not separate apps.`,
            calloutPosition: "bottom-right",
            spotlightRegion: "tracking-form-upper",
            focusLabel: "What to test",
            focusItems: [
              "See whether it feels obvious that you can move from one category to another.",
              "Notice whether the category labels are easy to identify in your current theme.",
            ],
            tip: "If this still feels confusing, we can add stronger labels or a persistent category legend next.",
          },
        ]
      : []),
    ...(hasMoodCategory
      ? [
          {
            id: "mood",
            pageKey: "mood",
            title: "Mood is its own check-in",
            body:
              "Mood is separate from the other logs. You can set the slider and add a few words so the app captures how the day feels, not just what got done.",
            calloutPosition: "top-right",
            spotlightRegion: "mood-checkin",
            focusLabel: "Potential confusion point",
            focusItems: [
              "Mood can feel different from task categories because it is a feeling check-in, not a completion log.",
              "Users should leave this step understanding that Mood still belongs in the tracker flow.",
            ],
            tip: "This is a good place to teach that emotional state is part of the app, not an extra feature.",
          },
        ]
      : []),
    {
      id: "goals",
      pageKey: "goals",
      title: "Goals turn your logs into streaks",
      body:
        "Goals read from your tracker automatically. Once a category is being logged consistently, you can build a simple streak around it here.",
      calloutPosition: "bottom-right",
      spotlightRegion: "goals-builder",
      focusLabel: "What goals depend on",
      focusItems: [
        "Goals make more sense after users understand categories.",
        "This page explains why logging in the right category matters later.",
      ],
      tip: "If a user asks why goals are not moving, category logging is the first thing to check.",
    },
    {
      id: "connections",
      pageKey: "connections",
      title: "Connections is where outsider access lives",
      body:
        "Use this area to create invite links, approve requests, and control what connected outsiders can see.",
      calloutPosition: "top-right",
      spotlightRegion: "connections-actions",
      focusLabel: "What this page is not",
      focusItems: [
        "Connections is not part of daily self-tracking.",
        "It is more like setup and permissions for support people.",
      ],
      tip: "Keeping this distinction clear should reduce navigation confusion.",
    },
    {
      id: "settings",
      pageKey: "settings",
      title: "Settings lets you change your visible categories later",
      body:
        "If a category feels missing, come back here. You can add more tracker areas without logging out or repeating the full account setup.",
      calloutPosition: "top-right",
      spotlightRegion: "settings-management",
      focusLabel: "Most important recovery path",
      focusItems: [
        "If someone says a category disappeared, send them here first.",
        "The Start Tutorial button here is also your safe test area while we keep iterating.",
      ],
      tip: "This is the fallback step that explains how to recover from most category confusion.",
    },
  ];
}

function buildOutsiderTutorialSteps(outsiderTrackers, selectedOutsider) {
  const trackerCount = outsiderTrackers.length;
  const selectedTrackerName = selectedOutsider?.name || "your selected tracker";

  return [
    {
      id: "outsider-overview",
      pageKey: "outsiderOverview",
      pageLabel: "Overview",
      calloutPosition: "bottom-right",
      spotlightRegion: "center",
      pageNote:
        trackerCount > 0
          ? "This page lists your approved trackers and the entry points into the rest of the outsider app."
          : "This page is where connection requests begin before approved trackers show up.",
      title: "Overview is your outsider home base",
      body:
        trackerCount > 0
          ? "Start here when you want to orient yourself quickly. Overview shows which trackers you can access and gives you the fastest jump into data, support, or goals."
          : "Start here when you need to connect to someone. This is where invite codes and links are used, and approved trackers will appear here automatically later.",
      focusLabel: "What this page is for",
      focusItems: [
        "Overview is the setup and launch page for the outsider experience.",
        "You can connect to trackers here and jump into the right support area from here.",
      ],
      tip: "If someone is unsure where to begin in the outsider app, send them to Overview first.",
    },
    {
      id: "outsider-data",
      pageKey: "outsiderData",
      pageLabel: "Telemetry",
      calloutPosition: "top-right",
      spotlightRegion: "center",
      pageNote: `Telemetry is the shared trend view for ${selectedTrackerName}.`,
      title: "Telemetry is for calm pattern-reading",
      body:
        "This page is the outsider read-only dashboard. It gives high-level trend context like mood, routines, sleep, and medication summaries without exposing private journal-style details.",
      focusLabel: "What to notice",
      focusItems: [
        "Telemetry is about patterns over time, not one-off nudges.",
        "If you need context before reaching out, this is usually the best page to visit first.",
      ],
      tip: "Use Telemetry before sending support when you want your message to match the current pattern instead of guessing.",
    },
    {
      id: "outsider-support",
      pageKey: "outsiderSupport",
      pageLabel: "Comms",
      calloutPosition: "bottom-right",
      spotlightRegion: "center",
      pageNote: "Comms is where outsider support messages and nudges are sent.",
      title: "Comms is the action page",
      body:
        "This page is where encouragement happens. Use the quick support buttons and approved category nudges when you want to send a lightweight reminder or a supportive check-in.",
      focusLabel: "What this page is not",
      focusItems: [
        "Comms is not for reviewing long-term patterns.",
        "It is for sending simple supportive actions in the moment.",
      ],
      tip: "When deciding between Telemetry and Comms: Telemetry helps you understand, Comms helps you act.",
    },
    {
      id: "outsider-goals",
      pageKey: "outsiderGoals",
      pageLabel: "Goals",
      calloutPosition: "top-right",
      spotlightRegion: "center",
      pageNote: "Goals shows only the approved streak and reward summary view.",
      title: "Goals keeps progress visible without extra detail",
      body:
        "This page gives outsiders a lightweight view of current streaks, goals, and rewards that the tracker has chosen to share. It is meant for encouragement, not deep analysis.",
      focusLabel: "What to use this for",
      focusItems: [
        "Use Goals when you want to notice momentum and celebrate progress.",
        "This page is especially useful when you want to support consistency, not just crisis moments.",
      ],
      tip: "Goals is a good place to find positive reinforcement opportunities before sending a nudge.",
    },
  ];
}

const TUTORIAL_CALLOUT_POSITIONS = {
  "top-left": { top: "24px", left: "24px" },
  "top-right": { top: "24px", right: "24px" },
  "bottom-left": { bottom: "24px", left: "24px" },
  "bottom-right": { bottom: "24px", right: "24px" },
};

const MOBILE_TUTORIAL_CALLOUT_POSITION = {
  left: "12px",
  right: "12px",
  bottom: "12px",
};

const TUTORIAL_SPOTLIGHT_REGIONS = {
  "overview-orbit": {
    top: "480px",
    left: "max(240px, 32.5vw)",
    width: "min(760px, 66vw)",
    height: "580px",
    borderRadius: "36px",
  },
  "tracker-nav": {
    left: "16px",
    right: "16px",
    bottom: "8px",
    height: "124px",
    borderRadius: "32px",
  },
  "tracking-form-upper": {
    top: "190px",
    left: "max(18px, 9vw)",
    right: "max(18px, 9vw)",
    height: "290px",
  },
  "mood-checkin": {
    top: "132px",
    left: "max(18px, 10vw)",
    right: "max(18px, 10vw)",
    bottom: "120px",
  },
  "goals-builder": {
    top: "112px",
    left: "max(18px, 8vw)",
    right: "max(18px, 8vw)",
    height: "330px",
  },
  "connections-actions": {
    top: "112px",
    left: "max(18px, 8vw)",
    right: "max(18px, 8vw)",
    height: "290px",
  },
  "settings-management": {
    top: "430px",
    left: "220px",
    right: "430px",
    height: "460px",
  },
  top: {
    top: "18px",
    left: "20px",
    right: "20px",
    height: "96px",
  },
  bottom: {
    left: "16px",
    right: "16px",
    bottom: "12px",
    height: "108px",
  },
  left: {
    top: "110px",
    left: "18px",
    width: "280px",
    bottom: "96px",
  },
  right: {
    top: "110px",
    right: "18px",
    width: "280px",
    bottom: "96px",
  },
  center: {
    top: "108px",
    left: "max(18px, 8vw)",
    right: "max(18px, 8vw)",
    bottom: "96px",
  },
};

const MOBILE_TUTORIAL_SPOTLIGHT_REGIONS = {
  "overview-orbit": {
    top: "112px",
    left: "10px",
    right: "10px",
    height: "min(46vh, 320px)",
    borderRadius: "24px",
  },
  "tracker-nav": {
    left: "10px",
    right: "10px",
    bottom: "10px",
    height: "90px",
    borderRadius: "24px",
  },
  "tracking-form-upper": {
    top: "112px",
    left: "10px",
    right: "10px",
    height: "min(40vh, 280px)",
    borderRadius: "24px",
  },
  "mood-checkin": {
    top: "112px",
    left: "10px",
    right: "10px",
    bottom: "128px",
    borderRadius: "24px",
  },
  "goals-builder": {
    top: "112px",
    left: "10px",
    right: "10px",
    height: "min(38vh, 260px)",
    borderRadius: "24px",
  },
  "connections-actions": {
    top: "112px",
    left: "10px",
    right: "10px",
    height: "min(34vh, 240px)",
    borderRadius: "24px",
  },
  "settings-management": {
    top: "212px",
    left: "10px",
    right: "10px",
    bottom: "128px",
    borderRadius: "24px",
  },
  top: {
    top: "100px",
    left: "10px",
    right: "10px",
    height: "88px",
    borderRadius: "24px",
  },
  bottom: {
    left: "10px",
    right: "10px",
    bottom: "10px",
    height: "90px",
    borderRadius: "24px",
  },
  left: {
    top: "112px",
    left: "10px",
    right: "10px",
    height: "min(34vh, 240px)",
    borderRadius: "24px",
  },
  right: {
    top: "112px",
    left: "10px",
    right: "10px",
    height: "min(34vh, 240px)",
    borderRadius: "24px",
  },
  center: {
    top: "112px",
    left: "10px",
    right: "10px",
    bottom: "128px",
    borderRadius: "24px",
  },
};

const TUTORIAL_BADGE_POSITIONS = {
  "overview-orbit": { top: "454px", left: "max(250px, 32.5vw)" },
  "tracker-nav": { bottom: "148px", left: "24px" },
  "tracking-form-upper": { top: "166px", left: "max(24px, 9vw)" },
  "mood-checkin": { top: "140px", left: "max(24px, 10vw)" },
  "goals-builder": { top: "120px", left: "max(24px, 8vw)" },
  "connections-actions": { top: "120px", left: "max(24px, 8vw)" },
  "settings-management": { top: "406px", left: "max(24px, 8vw)" },
  center: { top: "116px", left: "max(24px, 8vw)" },
};

const MOBILE_TUTORIAL_BADGE_POSITIONS = {
  "overview-orbit": { top: "100px", left: "16px" },
  "tracker-nav": { bottom: "108px", left: "16px" },
  "tracking-form-upper": { top: "100px", left: "16px" },
  "mood-checkin": { top: "100px", left: "16px" },
  "goals-builder": { top: "100px", left: "16px" },
  "connections-actions": { top: "100px", left: "16px" },
  "settings-management": { top: "196px", left: "16px" },
  center: { top: "100px", left: "16px" },
};

function isMobileTutorialViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function getTutorialCalloutPositionStyle(position = "bottom-right") {
  if (isMobileTutorialViewport()) {
    return MOBILE_TUTORIAL_CALLOUT_POSITION;
  }

  return TUTORIAL_CALLOUT_POSITIONS[position] || TUTORIAL_CALLOUT_POSITIONS["bottom-right"];
}

function getTutorialSpotlightStyle(region = "center") {
  const mobile = isMobileTutorialViewport();

  if (mobile) {
    return {
      display: "none",
    };
  }

  const baseStyle = {
    position: "fixed",
    zIndex: 41,
    pointerEvents: "none",
    borderRadius: "28px",
    border: "3px solid rgba(255,255,255,0.88)",
    boxShadow:
      "0 0 0 9999px rgba(4, 8, 18, 0.74), 0 0 0 1px rgba(255,255,255,0.45), 0 18px 40px rgba(0,0,0,0.34), 0 0 32px rgba(255,255,255,0.24), inset 0 0 0 999px rgba(255,255,255,0.02)",
  };
  return {
    ...baseStyle,
    ...(TUTORIAL_SPOTLIGHT_REGIONS[region] || TUTORIAL_SPOTLIGHT_REGIONS.center),
  };
}

function getTutorialSpotlightBadgeStyle(region = "center") {
  const baseStyle = {
    position: "fixed",
    zIndex: 42,
    pointerEvents: "none",
    display: "grid",
    gap: "8px",
  };
  return {
    ...baseStyle,
    ...(isMobileTutorialViewport()
      ? MOBILE_TUTORIAL_BADGE_POSITIONS[region] || MOBILE_TUTORIAL_BADGE_POSITIONS.center
      : TUTORIAL_BADGE_POSITIONS[region] || TUTORIAL_BADGE_POSITIONS.center),
  };
}

function getMobileTutorialScrollTop(region = "center") {
  switch (region) {
    case "overview-orbit":
      return 0;
    case "tracking-form-upper":
      return 80;
    case "mood-checkin":
      return 72;
    case "goals-builder":
      return 60;
    case "connections-actions":
      return 60;
    case "settings-management":
      return 260;
    case "tracker-nav":
      return 0;
    default:
      return 0;
  }
}

function scrollTutorialStepIntoView(step) {
  if (typeof window === "undefined" || !isMobileTutorialViewport()) {
    return;
  }

  const targetTop = getMobileTutorialScrollTop(step?.spotlightRegion);

  const scrollToTarget = () => {
    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(scrollToTarget);
  });
}

function renderFeedbackMessage(message, theme) {
  if (!message) return null;

  return <div style={feedbackMessageStyle(getFeedbackTone(message), theme)}>{message}</div>;
}

function getSectionAccentLabel(family = "galaxy", token = "Overview") {
  const tokenGroups = {
    dashboard: ["Overview", "Halo", "Starlight", "Sun", "Dawn"],
    orbit: ["Moon", "Orbit", "Nova", "Mood", "Status"],
    signal: ["Signal", "Spark", "Aurora", "Activity", "Requests"],
    mission: ["Mission", "Quest", "Join", "Tracker", "Support", "Cooldown", "Connected"],
    cluster: ["Bloom", "Constellation", "Nebula", "Cluster", "Rewards", "Glow", "Comet"],
  };

  const underwaterLabels = {
    dashboard: "Current",
    orbit: "Depth",
    signal: "Drift",
    mission: "Tide",
    cluster: "Reef",
  };

  const forestLabels = {
    dashboard: "Grove",
    orbit: "Canopy",
    signal: "Trail",
    mission: "Root",
    cluster: "Clearing",
  };

  const galaxyLabels = {
    dashboard: "Overview",
    orbit: "Orbit",
    signal: "Signal",
    mission: "Mission",
    cluster: "Cluster",
  };

  const groupKey =
    Object.entries(tokenGroups).find(([, values]) => values.includes(token))?.[0] || "dashboard";

  if (family === "underwater") return underwaterLabels[groupKey];
  if (family === "forest") return forestLabels[groupKey];
  return galaxyLabels[groupKey];
}

function getSectionFrameStyle(theme, section, observer = false) {
  const family = theme.themeFamily || "galaxy";

  const familyFrames = {
    galaxy: observer
      ? {
          insetGlow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(138,158,255,0.08)",
          edge: "0 0 0 1px rgba(120,140,220,0.14)",
          overlay:
            "radial-gradient(circle at 18% 18%, rgba(144,130,255,0.08) 0%, rgba(144,130,255,0) 24%), radial-gradient(circle at 82% 16%, rgba(90,190,255,0.07) 0%, rgba(90,190,255,0) 24%)",
        }
      : {
          insetGlow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(173,156,224,0.08)",
          edge: "0 0 0 1px rgba(157,138,222,0.16)",
          overlay:
            "radial-gradient(circle at 12% 14%, rgba(255,228,155,0.09) 0%, rgba(255,228,155,0) 22%), radial-gradient(circle at 84% 18%, rgba(155,138,255,0.08) 0%, rgba(155,138,255,0) 24%), radial-gradient(circle at 62% 78%, rgba(114,208,255,0.06) 0%, rgba(114,208,255,0) 24%)",
        },
    underwater: observer
      ? {
          insetGlow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(124,216,228,0.08)",
          edge: "0 0 0 1px rgba(90,182,203,0.12)",
          overlay:
            "radial-gradient(circle at 18% 20%, rgba(175,241,245,0.08) 0%, rgba(175,241,245,0) 22%), radial-gradient(circle at 80% 74%, rgba(90,182,228,0.07) 0%, rgba(90,182,228,0) 22%)",
        }
      : {
          insetGlow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(111,204,215,0.08)",
          edge: "0 0 0 1px rgba(101,186,208,0.14)",
          overlay:
            "radial-gradient(circle at 14% 18%, rgba(198,245,251,0.1) 0%, rgba(198,245,251,0) 24%), radial-gradient(circle at 86% 24%, rgba(119,214,224,0.08) 0%, rgba(119,214,224,0) 22%), radial-gradient(circle at 70% 80%, rgba(112,168,232,0.07) 0%, rgba(112,168,232,0) 22%)",
        },
    forest: observer
      ? {
          insetGlow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px rgba(146,175,120,0.06)",
          edge: "0 0 0 1px rgba(122,149,101,0.12)",
          overlay:
            "radial-gradient(circle at 18% 18%, rgba(185,210,149,0.07) 0%, rgba(185,210,149,0) 22%), radial-gradient(circle at 80% 76%, rgba(156,128,92,0.06) 0%, rgba(156,128,92,0) 22%)",
        }
      : {
          insetGlow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(145,168,118,0.08)",
          edge: "0 0 0 1px rgba(133,154,110,0.14)",
          overlay:
            "radial-gradient(circle at 14% 18%, rgba(215,229,181,0.1) 0%, rgba(215,229,181,0) 24%), radial-gradient(circle at 86% 20%, rgba(171,207,141,0.08) 0%, rgba(171,207,141,0) 24%), radial-gradient(circle at 70% 82%, rgba(179,154,106,0.06) 0%, rgba(179,154,106,0) 22%)",
        },
  };

  const frame = familyFrames[family] || familyFrames.galaxy;
  const accentScale =
    section === "dashboard"
      ? 1.08
      : section === "goals" || section === "care"
      ? 1.03
      : 1;

  return {
    backgroundOverlay: frame.overlay,
    boxShadow: `${frame.edge}, ${frame.insetGlow}`,
    borderWidth: accentScale,
  };
}

function getAccentBadgeStyle(theme) {
  const family = theme.themeFamily || "galaxy";

  if (isSpaceConsoleTheme(theme)) {
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.42rem 0.78rem",
      borderRadius: "999px",
      background:
        "linear-gradient(180deg, rgba(13,25,24,0.98) 0%, rgba(6,14,13,0.98) 100%)",
      border: `1px solid ${theme.observerAccent || "#27d7a1"}`,
      boxShadow: `0 0 0 1px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 16px ${theme.glow}`,
      color: theme.observerAccent || theme.text,
      fontFamily: theme.observerFontFamily,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    };
  }

  if (family === "underwater") {
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.38rem 0.78rem",
      borderRadius: "999px 999px 18px 999px",
      background:
        "linear-gradient(135deg, rgba(198,244,250,0.92) 0%, rgba(174,231,241,0.82) 100%)",
      border: "1px solid rgba(99,178,198,0.24)",
      boxShadow: "0 10px 20px rgba(84,164,183,0.12)",
      color: theme.softButtonText,
    };
  }

  if (family === "forest") {
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.38rem 0.78rem",
      borderRadius: "18px 999px 18px 999px",
      background:
        "linear-gradient(135deg, rgba(228,239,214,0.94) 0%, rgba(206,226,189,0.84) 100%)",
      border: "1px solid rgba(129,156,109,0.24)",
      boxShadow: "0 10px 18px rgba(109,127,87,0.12)",
      color: theme.softButtonText,
    };
  }

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.38rem 0.78rem",
    borderRadius: "999px",
    background:
      theme.modeName === "Galaxy"
        ? "linear-gradient(135deg, rgba(82,101,201,0.44) 0%, rgba(122,103,255,0.3) 100%)"
        : "linear-gradient(135deg, rgba(255,236,177,0.88) 0%, rgba(237,213,255,0.68) 100%)",
    border:
      theme.modeName === "Galaxy"
        ? "1px solid rgba(128,148,255,0.18)"
        : "1px solid rgba(198,168,234,0.22)",
    boxShadow:
      theme.modeName === "Galaxy"
        ? "0 10px 24px rgba(88,106,212,0.16)"
        : "0 10px 18px rgba(193,163,232,0.14)",
    color: theme.modeName === "Galaxy" ? "#eef2ff" : theme.softButtonText,
  };
}

export default App;
