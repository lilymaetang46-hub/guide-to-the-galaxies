import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
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
import OutsiderOverviewPage from "./pages/outsider/OverviewPage";
import OutsiderTrackerDataPage from "./pages/outsider/TrackerDataPage";
import OutsiderSupportPage from "./pages/outsider/SupportPage";
import OutsiderGoalsPage from "./pages/outsider/GoalsPage";

/* eslint-disable react-hooks/exhaustive-deps */

const PENDING_SIGNUP_PROFILE_KEY = "pendingSignupProfile";
const PREFERRED_APP_EXPERIENCE_KEY = "preferredAppExperience";
const DEFAULT_PUBLIC_APP_URL = "https://guide-to-the-galaxies.app";
const NATIVE_PUSH_TARGET_PAGE = "support";
const DEFAULT_CONNECTION_PERMISSIONS = {
  meds: true,
  food: true,
  hygiene: true,
  sleep: true,
  exercise: true,
  mood: true,
  streaks: true,
  rewards: true,
  activity: true,
  alerts: true,
};
const TRACKING_AREA_OPTIONS = [
  {
    id: "meds",
    label: "Meds",
    description: "Medication, doses, and symptom notes.",
    pageKey: "meds",
  },
  {
    id: "food",
    label: "Food",
    description: "Meals, snacks, and quick fuel check-ins.",
    pageKey: "food",
  },
  {
    id: "hygiene",
    label: "Hygiene",
    description: "Shower, teeth, skincare, and care basics.",
    pageKey: "hygiene",
  },
  {
    id: "sleep",
    label: "Sleep",
    description: "Bedtime, wake time, and sleep quality.",
    pageKey: "sleep",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    description: "Laundry, room resets, and cleaning effort.",
    pageKey: "cleaning",
  },
  {
    id: "exercise",
    label: "Exercise",
    description: "Exercise, walks, and energy after moving.",
    pageKey: "exercise",
  },
  {
    id: "mood",
    label: "Mood",
    description: "Mood tags, focus, and energy snapshots.",
    pageKey: "mood",
  },
];

function makeConnectionCode() {
  return `STAR-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function makeConnectionToken() {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
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

function getInviteTokenFromUrl(urlLike) {
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

function normalizeTrackedAreas(areas) {
  const validAreaIds = new Set(TRACKING_AREA_OPTIONS.map((area) => area.id));
  const normalizedAreas = Array.isArray(areas) ? areas : [];

  return [...new Set(normalizedAreas.map((area) => (area === "maintenance" ? "hygiene" : area)))]
    .filter((area) => validAreaIds.has(area));
}

function getTrackingAreaOption(areaId) {
  return TRACKING_AREA_OPTIONS.find((area) => area.id === areaId) || null;
}

function getNativePushOptOutKey(userId) {
  return `nativePushDisabled:${userId}`;
}

function getTrackedAreasStorageKey(userId) {
  return `trackedAreas:${userId}`;
}

function isTrackedAreasColumnError(error) {
  const message = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`;
  return /tracked_areas/i.test(message);
}

function App() {
  const today = getLocalDateKey(new Date());

  const [entryId, setEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === null ? true : savedTheme === "true";
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
  const [medSymptoms, setMedSymptoms] = useState("");
  const [medNotes, setMedNotes] = useState("");

  const [meals, setMeals] = useState([]);
  const [mealText, setMealText] = useState("");

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
  const theme = getAppTheme(
    darkMode,
    appExperience === "outsider" ? selectedOutsider?.themeFamily || themeFamily : themeFamily
  );
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
      const normalizedInviteLink = `${DEFAULT_PUBLIC_APP_URL}/connect/${inviteToken}`;
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
      setDarkMode((data.tracker_mode || "dark") === "dark");
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
      tracker_mode: darkMode ? "dark" : "light",
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
      tracker_mode: darkMode ? "dark" : "light",
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
        tracker_mode: darkMode ? "dark" : "light",
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
      tracker_mode: darkMode ? "dark" : "light",
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
    setDarkMode(signupMode === "dark");
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
          ? `${getPublicAppUrl()}/connect/${inviteRow.invite_token}`
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

    const { error } = await supabase.from("support_messages").insert({
      connection_id: selectedOutsider.id,
      tracker_id: selectedOutsider.trackerId,
      outsider_id: user.id,
      outsider_name: displayName.trim() || secondaryDisplayName.trim() || "Connected outsider",
      message,
    });

    if (error) {
      console.error("Support message send error:", error);
      setOutsiderMessage("Could not send support message.");
      return;
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
    setInviteLink(`${getPublicAppUrl()}/connect/${token}`);
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
    setInviteLink(`${getPublicAppUrl()}/connect/${token}`);
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
        environment: "production",
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

  async function saveEntry(updated = {}) {
    if (!entryId || !user) return;

    const payload = {
      meds_taken: medTaken,
      meds_time: medsTime,
      meds,
      meals,
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
      cleaning_minutes:
        cleaningMinutes === "" ? null : Number(cleaningMinutes),
      cleaning_worth_it: Number(cleaningWorthIt),
      exercise_done: exerciseDone,
      exercise_time: exerciseTime,
      exercise_type: exerciseType,
      exercise_minutes:
        exerciseMinutes === "" ? null : Number(exerciseMinutes),
      exercise_feeling: exerciseFeeling,
      extra_walk: extraWalk,
      after_exercise_state: afterExerciseState,
      exercise_logs: exerciseLogs,
      bed_time: bedTime,
      wake_time: wakeTime,
      sleep_routine: sleepRoutine,
      used_screens_before_bed: usedScreensBeforeBed,
      sleep_quality: Number(sleepQuality),
      mood: Number(mood),
      mood_tags: moodTags,
      focus: Number(focus),
      energy: Number(energy),
      goals,
      rewards,
      user_id: user.id,
      ...updated,
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

  function nowTime() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
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

  function getLocalDateKey(dateInput) {
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

  function getLatestEntriesByDate(rows) {
    const latestByDate = new Map();

    rows.forEach((row) => {
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

  function compareEntryRecency(left, right) {
    const leftCreatedAt = left?.created_at ? new Date(left.created_at).getTime() : 0;
    const rightCreatedAt = right?.created_at ? new Date(right.created_at).getTime() : 0;

    if (leftCreatedAt !== rightCreatedAt) {
      return leftCreatedAt - rightCreatedAt;
    }

    return Number(left?.id ?? 0) - Number(right?.id ?? 0);
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

  function buildRecentChartData(rows, days) {
    const latestEntries = getLatestEntriesByDate(rows);
    const rowByDate = new Map(
      latestEntries
        .filter((row) => row?.entry_date && row.entry_date <= today)
        .map((row) => [row.entry_date, row])
    );
    const safeDays = Math.max(1, Number(days) || 7);
    const startDate = parseDateKey(today);
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
      default:
        return 0;
    }
  }

  function buildDailyPeriods(goal, rows) {
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

  function buildWeeklyPeriods(goal, rows) {
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

  function computeGoalProgress(goal, rows) {
    if (goal.completed) {
      return {
        ...goal,
        currentStreakProgress: goal.streakLength,
      };
    }

    const periods =
      goal.checkType === "weekly"
        ? buildWeeklyPeriods(goal, rows)
        : buildDailyPeriods(goal, rows);

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

  function calculateSimpleDailyStreak(rows, predicate) {
    const rowMap = new Map(rows.map((row) => [row.entry_date, row]));
    const cursor = new Date(`${today}T00:00:00`);
    let streak = 0;

    while (true) {
      const key = formatDateKey(cursor);
      const entry = rowMap.get(key);

      if (!entry || !predicate(entry)) {
        break;
      }

      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  const toggleMed = async () => {
    const value = !medTaken;
    const time = value ? nowTime() : "";
    setMedTaken(value);
    setMedsTime(time);
    setLastAction(value ? `Updated meds at ${time}` : "Marked meds as not taken");
    await saveEntry({ meds_taken: value, meds_time: time });
  };

  const addMedication = async () => {
    if (!medName.trim()) return;

    const time = nowTime();

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
    const time = value ? nowTime() : "";
    setShowered(value);
    setShoweredTime(time);
    setLastAction(value ? `Showered at ${time}` : "Unmarked shower");
    await saveEntry({ showered: value, showered_time: time });
  };

  const toggleBrushedTeeth = async () => {
    const value = !brushedTeeth;
    const time = value ? nowTime() : "";
    setBrushedTeeth(value);
    setBrushedTeethTime(time);
    setLastAction(value ? `Brushed teeth at ${time}` : "Unmarked brushed teeth");
    await saveEntry({ brushed_teeth: value, brushed_teeth_time: time });
  };

  const toggleSkincare = async () => {
    const value = !skincare;
    const time = value ? nowTime() : "";
    setSkincare(value);
    setSkincareTime(time);
    setLastAction(value ? `Did skincare at ${time}` : "Unmarked skincare");
    await saveEntry({ skincare: value, skincare_time: time });
  };

  const toggleLaundry = async () => {
    const value = !laundryDone;
    const time = value ? nowTime() : "";
    setLaundryDone(value);
    setLaundryTime(time);
    setLastAction(value ? `Finished laundry at ${time}` : "Unmarked laundry");
    await saveEntry({ laundry_done: value, laundry_time: time });
  };

  const toggleBedsheets = async () => {
    const value = !bedsheetsDone;
    const time = value ? nowTime() : "";
    setBedsheetsDone(value);
    setBedsheetsTime(time);
    setLastAction(value ? `Changed bedsheets at ${time}` : "Unmarked bedsheets");
    await saveEntry({ bedsheets_done: value, bedsheets_time: time });
  };

  const toggleRoomCleaned = async () => {
    const value = !roomCleaned;
    const time = value ? nowTime() : "";
    setRoomCleaned(value);
    setRoomCleanedTime(time);
    setLastAction(value ? `Cleaned room at ${time}` : "Unmarked room cleaned");
    await saveEntry({ room_cleaned: value, room_cleaned_time: time });
  };

  const toggleExerciseDone = async () => {
    const value = !exerciseDone;
    const time = value ? nowTime() : "";
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

    const logTime = exerciseTime || nowTime();
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

    const time = nowTime();

    const newMeal = {
      text: mealText.trim(),
      time,
    };

    const newMeals = [...meals, newMeal];
    setMeals(newMeals);
    setMealText("");
    setLastAction(`Added meal at ${time}`);

    await saveEntry({ meals: newMeals });
  };

  const removeMeal = async (indexToRemove) => {
    const newMeals = meals.filter((_, index) => index !== indexToRemove);
    setMeals(newMeals);
    setLastAction("Removed a meal");
    await saveEntry({ meals: newMeals });
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
      if (pushRegistrationHandle) {
        pushRegistrationHandle();
        setPushRegistrationHandle(null);
      }
      setLoading(false);
      setEntryId(null);
      setHistoryData([]);
      setTrackedAreas([]);
      setPendingTrackedAreas([]);
      setShowTrackingAreaPicker(false);
      setTrackingAreasMessage("");
      setShowAddTrackingAreaPicker(false);
      setTrackingAreaToAdd("");
      setPushToken("");
      setPushStatusMessage("");
      setPushSyncing(false);
      return;
    }

    setLoading(true);
    setProfileSyncLoading(true);

    (async () => {
      const profileSync = await ensureProfileExists(user);

      if (!profileSync.ok) {
        setAuthMessage(profileSync.error || "Could not sync your profile.");
      }

      await loadProfile(user.id);
      await loadEntry();
      await loadHistory();
      setProfileSyncLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    if (user && activePage === "settings") {
      loadProfile(user.id);
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
    if (!user || typeof window === "undefined") {
      setPushOptedOutLocally(false);
      return;
    }

    setPushOptedOutLocally(localStorage.getItem(getNativePushOptOutKey(user.id)) === "true");
  }, [user]);

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

    enableNativePushNotifications();
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
      loadConnectionsData();
      loadOutsiderTrackers();
      loadSupportInbox();
    }
  }, [user]);

  useEffect(() => {
    if (user && activePage === "connections") {
      loadConnectionsData();
    }
  }, [activePage, user]);

  useEffect(() => {
    if (user && (activePage === "support" || activePage === "mission" || activePage === "dashboard")) {
      loadSupportInbox();
    }
  }, [activePage, user]);

  useEffect(() => {
    if (!user || activePage !== "connections") return undefined;

    const intervalId = window.setInterval(() => {
      loadConnectionsData();
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activePage, user]);

  useEffect(() => {
    if (user && appExperience === "outsider") {
      loadOutsiderTrackers();
    }
  }, [appExperience, outsiderPage, user]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(PREFERRED_APP_EXPERIENCE_KEY, appExperience);
    setSelectedExperience(appExperience);
  }, [appExperience]);

  useEffect(() => {
    setGoalSuggestions(makeGoalSuggestions(themeFamily, darkMode));
  }, [darkMode, themeFamily]);

  useEffect(() => {
    if (!entryId || historyData.length === 0 || goals.length === 0) return;

    const computedGoals = goals.map((goal) => computeGoalProgress(goal, historyData));
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
      saveEntry({
        goals: computedGoals,
        rewards: updatedRewards,
      });
    }
  }, [historyData, goals, rewards, entryId, darkMode, today, themeFamily]);

  const chartRangeOptions = [7, 14];
  const recentChartData = useMemo(
    () => buildRecentChartData(historyData, chartRange),
    [historyData, chartRange, today]
  );
  const maxMeals = Math.max(...recentChartData.map((d) => d.mealsCount), 1);
  const maxHygiene = Math.max(...recentChartData.map((d) => d.hygieneCount), 1);
  const maxMeds = Math.max(...recentChartData.map((d) => d.medsCount), 1);
  const maxExercise = Math.max(...recentChartData.map((d) => d.exerciseCount), 1);
  const hygieneCount =
    (showered ? 1 : 0) + (brushedTeeth ? 1 : 0) + (skincare ? 1 : 0);
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
    { key: "goals", label: "Goals" },
    { key: "charts", label: "Charts" },
    { key: "support", label: "Support" },
    { key: "connections", label: "Connections" },
    { key: "settings", label: "Settings" },
  ];
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
        (row) => (Array.isArray(row.meals) ? row.meals.length : 0) > 0
      ),
      unit: "days",
    },
    {
      name: "Medicine Moon",
      progress: calculateSimpleDailyStreak(
        historyData,
        (row) => row.meds_taken || (Array.isArray(row.meds) ? row.meds.length : 0) > 0
      ),
      unit: "days",
    },
    {
      name: "Movement Orbit",
      progress: calculateSimpleDailyStreak(
        historyData,
        (row) =>
          row.exercise_done || (Array.isArray(row.exercise_logs) ? row.exercise_logs.length : 0) > 0
      ),
      unit: "days",
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
  const selectedOutsiderHistory = selectedOutsider?.history || [];
  const unreadSupportCount = supportInbox.filter((item) => !item.readAt).length;
  const selectedOutsiderChartData = useMemo(
    () => buildRecentChartData(selectedOutsiderHistory, 7),
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
  const renderSectionHeader = (title, subtitle, solarAccent, galaxyAccent) => (
    <>
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
    </>
  );

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
    medSymptoms,
    setMedSymptoms,
    medNotes,
    setMedNotes,
    toggleMed,
    addMedication,
    removeMedication,
    mealText,
    setMealText,
    addMeal,
    meals,
    removeMeal,
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
    toggleBrushedTeeth,
    toggleSkincare,
    laundryDone,
    laundryTime,
    bedsheetsDone,
    bedsheetsTime,
    roomCleaned,
    roomCleanedTime,
    cleaningMinutes,
    cleaningWorthIt,
    toggleLaundry,
    toggleBedsheets,
    toggleRoomCleaned,
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
        return <TrackerTrackingPage app={trackerPageProps} pageKey={activePage} />;
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
    }

    .galaxy-panel:hover {
      transform: translateY(-2px);
      filter: brightness(1.015);
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
              <div style={goalFormGridStyle}>
                <div>
                  <label style={labelStyle(authTheme)}>Email</label>
                  <input
                    style={inputStyle(authTheme)}
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label style={labelStyle(authTheme)}>Password</label>
                  <input
                    style={inputStyle(authTheme)}
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <button style={primaryButtonStyle(authTheme)} onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </div>
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
                  <div style={goalFormGridStyle}>
                    <div>
                      <label style={labelStyle(authTheme)}>Email</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label style={labelStyle(authTheme)}>Password</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label style={labelStyle(authTheme)}>Confirm password</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="password"
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button style={softButtonStyle(authTheme)} onClick={() => setSignupStep(1)}>
                        Back
                      </button>
                      <button style={primaryButtonStyle(authTheme)} onClick={() => setSignupStep(3)}>
                        Continue to profile
                      </button>
                    </div>
                  </div>
                )}

                {signupStep === 3 && (
                  <div style={goalFormGridStyle}>
                    <div>
                      <label style={labelStyle(authTheme)}>Display name</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label style={labelStyle(authTheme)}>Secondary display name</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="text"
                        value={secondaryDisplayName}
                        onChange={(e) => setSecondaryDisplayName(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label style={labelStyle(authTheme)}>PIN</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="password"
                        inputMode="numeric"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="4 to 8 digits"
                      />
                    </div>
                    <div>
                      <label style={labelStyle(authTheme)}>Confirm PIN</label>
                      <input
                        style={inputStyle(authTheme)}
                        type="password"
                        inputMode="numeric"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="Confirm PIN"
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button style={softButtonStyle(authTheme)} onClick={() => setSignupStep(2)}>
                        Back
                      </button>
                      <button style={primaryButtonStyle(authTheme)} onClick={handleSignup}>
                        Create account
                      </button>
                    </div>
                  </div>
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
        >
          {currentPageContent}
        </TrackerLayout>
      )}

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
        "radial-gradient(circle at 16% 20%, rgba(169,232,244,0.76) 0%, rgba(169,232,244,0) 20%), radial-gradient(circle at 78% 18%, rgba(146,198,255,0.42) 0%, rgba(146,198,255,0) 26%), radial-gradient(circle at 60% 74%, rgba(214,249,255,0.46) 0%, rgba(214,249,255,0) 28%), radial-gradient(circle at 36% 88%, rgba(196,241,255,0.26) 0%, rgba(196,241,255,0) 22%), linear-gradient(180deg, #edfafd 0%, #dcf2fb 34%, #d7ecf7 68%, #e7f8fc 100%)",
      heroBackground:
        "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 22%), linear-gradient(145deg, rgba(238,252,255,0.98) 0%, rgba(223,244,250,0.94) 55%, rgba(214,235,247,0.94) 100%)",
      cardBackground:
        "radial-gradient(circle at 82% 24%, rgba(179,235,246,0.22) 0%, rgba(179,235,246,0) 26%), linear-gradient(180deg, rgba(242,253,255,0.95) 0%, rgba(226,246,251,0.92) 100%)",
      text: "#1f3d48",
      subtleText: "#426675",
      faintText: "#628291",
      inputBackground: "rgba(247,254,255,0.9)",
      inputBorder: "#b6dbe7",
      itemBackground: "rgba(228,248,252,0.86)",
      softButtonBackground: "linear-gradient(180deg, #d6f5f9 0%, #beeaf2 100%)",
      softButtonText: "#25596a",
      navInactive: "rgba(224,246,250,0.78)",
      navActive: "linear-gradient(135deg, #58c6d8 0%, #4f9fe6 100%)",
      navText: "#1f5364",
      toggleText: "#0f4856",
      primary: "linear-gradient(135deg, #58c6d8 0%, #4f9fe6 100%)",
      toggleBackground: "linear-gradient(135deg, #66d8e6 0%, #4f9fe6 100%)",
      border: "1px solid rgba(112,184,205,0.22)",
      shadow: "0 22px 36px rgba(93,165,198,0.16)",
      heroShadow: "0 28px 48px rgba(92,160,194,0.18)",
      glow: "rgba(88, 198, 216, 0.28)",
      track: "#c9eaf2",
      chartSurface: "rgba(239,252,255,0.78)",
      chartGrid: "rgba(84,139,158,0.14)",
      chartLabel: "#4d7281",
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
    },
    dark: {
      themeFamily: "underwater",
      pageBackground:
        "radial-gradient(circle at 14% 18%, rgba(47,148,179,0.3) 0%, rgba(47,148,179,0) 22%), radial-gradient(circle at 82% 16%, rgba(63,124,201,0.26) 0%, rgba(63,124,201,0) 22%), radial-gradient(circle at 58% 76%, rgba(63,197,191,0.16) 0%, rgba(63,197,191,0) 28%), radial-gradient(circle at 30% 86%, rgba(135,223,255,0.08) 0%, rgba(135,223,255,0) 18%), linear-gradient(180deg, #06141d 0%, #0b202d 30%, #0d2938 56%, #103344 100%)",
      heroBackground:
        "radial-gradient(circle at 82% 20%, rgba(88,210,215,0.16) 0%, rgba(88,210,215,0) 24%), linear-gradient(145deg, rgba(11,34,46,0.96) 0%, rgba(15,48,63,0.93) 55%, rgba(22,61,79,0.9) 100%)",
      cardBackground:
        "radial-gradient(circle at 18% 18%, rgba(69,175,193,0.14) 0%, rgba(69,175,193,0) 26%), linear-gradient(180deg, rgba(11,28,40,0.94) 0%, rgba(18,42,56,0.9) 100%)",
      text: "#ecfbff",
      subtleText: "#bedce5",
      faintText: "#90b7c3",
      inputBackground: "rgba(8,25,34,0.9)",
      inputBorder: "#285267",
      itemBackground: "rgba(14,38,50,0.84)",
      softButtonBackground: "linear-gradient(180deg, #174359 0%, #12384c 100%)",
      softButtonText: "#eefcff",
      navInactive: "rgba(20,50,67,0.76)",
      navActive: "linear-gradient(135deg, #2f8ccf 0%, #47d1c8 100%)",
      navText: "#eafcff",
      primary: "linear-gradient(135deg, #2f8ccf 0%, #47d1c8 100%)",
      toggleBackground: "linear-gradient(135deg, #2f8ccf 0%, #47d1c8 100%)",
      toggleText: "#07202a",
      border: "1px solid rgba(90,166,190,0.16)",
      shadow: "0 24px 42px rgba(1,14,21,0.42)",
      heroShadow: "0 30px 58px rgba(0,12,18,0.44)",
      glow: "rgba(71, 209, 200, 0.24)",
      track: "#1c4759",
      chartSurface: "rgba(8,24,34,0.76)",
      chartGrid: "rgba(121,185,206,0.14)",
      chartLabel: "#b6d9e4",
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

const pageStyle = (theme) => ({
  minHeight: "100vh",
  background: `${theme.pageBackground}, radial-gradient(circle at 12% 12%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 18%), radial-gradient(circle at 88% 20%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 18%)`,
  padding: "clamp(12px, 4vw, 24px)",
  fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
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
  background:
    theme.themeFamily === "underwater"
      ? `radial-gradient(circle at 82% 18%, rgba(219,247,251,0.16) 0%, rgba(219,247,251,0) 24%), radial-gradient(circle at 16% 84%, rgba(135,201,228,0.12) 0%, rgba(135,201,228,0) 22%), ${theme.heroBackground}`
      : theme.themeFamily === "forest"
      ? `radial-gradient(circle at 16% 18%, rgba(223,235,191,0.16) 0%, rgba(223,235,191,0) 24%), radial-gradient(circle at 82% 78%, rgba(171,146,111,0.1) 0%, rgba(171,146,111,0) 22%), ${theme.heroBackground}`
      : `radial-gradient(circle at 84% 18%, rgba(166,150,255,0.18) 0%, rgba(166,150,255,0) 24%), radial-gradient(circle at 16% 82%, rgba(116,208,255,0.12) 0%, rgba(116,208,255,0) 22%), ${theme.heroBackground}`,
  borderRadius:
    theme.themeFamily === "underwater"
      ? "34px 24px 42px 22px / 24px 34px 26px 38px"
      : theme.themeFamily === "forest"
      ? "28px 40px 26px 42px / 36px 24px 34px 22px"
      : theme.heroRadius || "30px 42px 24px 40px / 24px 36px 22px 38px",
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
});

const featureCardStyle = (theme) => ({
  background: theme.cardBackground,
  borderRadius:
    theme.themeFamily === "underwater"
      ? "28px 18px 30px 22px / 20px 30px 22px 32px"
      : theme.themeFamily === "forest"
      ? "20px 32px 22px 34px / 30px 20px 32px 22px"
      : theme.featureRadius || "22px 32px 20px 34px / 24px 20px 32px 22px",
  padding: "clamp(18px, 4vw, 24px)",
  boxShadow: theme.shadow,
  border: theme.border,
  clipPath: theme.featureClipPath || "none",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  isolation: "isolate",
});

const sectionCardStyle = (theme, section) => {
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

  return {
    ...featureCardStyle(theme),
    background: `${frame.backgroundOverlay}, ${accent.tint}, ${theme.cardBackground}`,
    boxShadow: `${theme.shadow}, ${frame.boxShadow}, 0 18px 34px ${accent.glow}`,
    borderRadius: theme.sectionRadius || theme.featureRadius || "26px",
  };
};

const observerSectionCardStyle = (theme, section) => {
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
  letterSpacing: "0.02em",
  overflowWrap: "anywhere",
});

const tinyLabelStyle = (theme) => ({
  margin: "0 0 6px 0",
  color: theme.faintText,
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontSize: "0.78rem",
  fontWeight: "bold",
});

const subtitleStyle = (theme) => ({
  margin: "8px 0 6px 0",
  color: theme.subtleText,
  lineHeight: 1.5,
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
  overflowWrap: "anywhere",
  lineHeight: 1.25,
});

const helperTextStyle = (theme) => ({
  marginTop: 0,
  color: theme.faintText,
  fontSize: "0.95rem",
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

const inputStyle = (theme) => ({
  padding: "13px 14px",
  borderRadius: "12px",
  border: `1px solid ${theme.inputBorder}`,
  color: theme.text,
  background: theme.inputBackground,
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem",
  boxShadow: `inset 0 1px 0 ${theme.star}`,
  minWidth: 0,
  lineHeight: 1.4,
});

const primaryButtonStyle = (theme) => ({
  background: theme.primary,
  color: theme.primaryText,
  border: "none",
  borderRadius:
    theme.themeFamily === "underwater"
      ? "18px 14px 18px 14px / 14px 18px 14px 18px"
      : theme.themeFamily === "forest"
      ? "14px 18px 14px 18px / 18px 14px 18px 16px"
      : "999px",
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 10px 22px ${theme.glow}`,
  minHeight: "48px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
});

const softButtonStyle = (theme) => ({
  background: theme.softButtonBackground,
  color: theme.softButtonText,
  border: "none",
  borderRadius:
    theme.themeFamily === "underwater"
      ? "18px 14px 18px 14px / 14px 18px 14px 18px"
      : theme.themeFamily === "forest"
      ? "14px 18px 14px 18px / 18px 14px 18px 16px"
      : "999px",
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  minHeight: "48px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
});

const successButtonStyle = {
  backgroundColor: "#7ea06f",
  color: "#fffaf2",
  border: "none",
  borderRadius: "12px",
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  minHeight: "48px",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
};

const smallRemoveButtonStyle = (theme) => ({
  backgroundColor: theme.softButtonBackground,
  color: theme.softButtonText,
  border: "none",
  borderRadius: theme.themeFamily === "galaxy" ? "999px" : "12px",
  padding: "8px 10px",
  cursor: "pointer",
  fontWeight: "bold",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
});

const navButtonStyle = (active, theme) => ({
  background: active ? theme.navActive : theme.navInactive,
  color: active ? theme.primaryText : theme.navText,
  border: "none",
  borderRadius:
    theme.themeFamily === "underwater"
      ? "22px 18px 22px 18px / 18px 22px 18px 22px"
      : theme.themeFamily === "forest"
      ? "18px 24px 18px 22px / 22px 18px 22px 20px"
      : "999px",
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: active ? `0 12px 24px ${theme.glow}` : "none",
  minHeight: "42px",
  flex: "0 1 auto",
  maxWidth: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  textAlign: "center",
  fontSize: "0.92rem",
});

const mealListStyle = {
  listStyle: "none",
  padding: 0,
  margin: "12px 0 0 0",
};

const mealItemStyle = (theme) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap",
  backgroundColor: theme.itemBackground,
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "10px",
  minWidth: 0,
});

const rangeStyle = {
  width: "100%",
};

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
  borderRadius: "22px",
  background: `linear-gradient(145deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  marginBottom: "20px",
  flexWrap: "wrap",
  boxShadow: `inset 0 1px 0 ${theme.star}, 0 14px 28px ${theme.glow}`,
});

const observerHeroStyle = (theme) => ({
  ...dashboardHeroStyle(theme),
  background: theme.observerHeroBackground || theme.heroBackground,
  border: theme.observerBorder || theme.border,
  borderRadius: theme.observerRadius || "18px",
  boxShadow: theme.observerShadow || theme.shadow,
});

const dashboardKickerStyle = (theme) => ({
  margin: "0 0 8px 0",
  color: theme.faintText,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontSize: "0.75rem",
  fontWeight: "bold",
});

const dashboardHeadingStyle = (theme) => ({
  margin: 0,
  fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
  color: theme.text,
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

const summaryCardStyle = (theme) => ({
  background:
    theme.themeFamily === "underwater"
      ? `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 22%), linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`
      : theme.themeFamily === "forest"
      ? `radial-gradient(circle at 82% 18%, rgba(229,237,204,0.18) 0%, rgba(229,237,204,0) 22%), linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`
      : `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 20%), linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  borderRadius: theme.themeFamily === "underwater" ? "24px 18px 24px 18px / 18px 24px 18px 24px" : theme.themeFamily === "forest" ? "18px 24px 18px 28px / 24px 18px 24px 20px" : "20px 28px 20px 26px / 24px 20px 24px 22px",
  padding: "18px",
  border: theme.border,
  boxShadow: `0 16px 32px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
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
  borderRadius: "12px",
  background: theme.itemBackground,
  color: theme.text,
  fontSize: "0.92rem",
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
  background: selected ? theme.primary : theme.softButtonBackground,
  color: selected ? theme.primaryText : theme.softButtonText,
  border: "none",
  borderRadius: "999px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: selected ? `0 12px 26px ${theme.glow}` : `0 8px 18px ${theme.glow}`,
});

const goalSuggestionButtonStyle = (theme) => ({
  background: theme.softButtonBackground,
  color: theme.softButtonText,
  border: "none",
  borderRadius: "999px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 8px 18px ${theme.glow}`,
});

const quickJumpButtonStyle = (theme) => ({
  background: theme.softButtonBackground,
  color: theme.softButtonText,
  border: "none",
  borderRadius:
    theme.themeFamily === "underwater"
      ? "22px 16px 22px 16px / 16px 22px 16px 22px"
      : theme.themeFamily === "forest"
      ? "18px 24px 18px 22px / 22px 18px 22px 20px"
      : "22px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 10px 20px ${theme.glow}`,
  minHeight: "42px",
  width: "auto",
  minWidth: "110px",
  maxWidth: "160px",
  lineHeight: 1.35,
  textAlign: "center",
  justifySelf: "start",
  fontSize: "0.92rem",
});

const chartToolbarStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const rangeChipStyle = (active, theme) => ({
  background: active ? theme.primary : theme.softButtonBackground,
  color: active ? theme.primaryText : theme.softButtonText,
  border: "none",
  borderRadius: "999px",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "bold",
});

const chartStackStyle = {
  display: "grid",
  gap: "20px",
};

const chartCardStyle = (theme) => ({
  background: `linear-gradient(160deg, ${theme.chartSurface} 0%, rgba(255,255,255,0.03) 100%)`,
  borderRadius: "22px",
  padding: "18px",
  border: theme.border,
  boxShadow: `${theme.shadow}, 0 16px 30px ${theme.glow}`,
});

const goalCardItemStyle = (theme) => ({
  ...mealItemStyle(theme),
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

const rewardCardStyle = (theme) => ({
  background:
    theme.themeFamily === "underwater"
      ? `radial-gradient(circle at 84% 20%, rgba(211,247,252,0.14) 0%, rgba(211,247,252,0) 22%), linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`
      : theme.themeFamily === "forest"
      ? `radial-gradient(circle at 18% 20%, rgba(220,231,191,0.14) 0%, rgba(220,231,191,0) 22%), linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`
      : `radial-gradient(circle at 18% 18%, rgba(145,130,255,0.08) 0%, rgba(145,130,255,0) 20%), linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`,
  borderRadius: theme.themeFamily === "underwater" ? "22px 16px 22px 16px / 18px 24px 18px 24px" : theme.themeFamily === "forest" ? "18px 24px 18px 26px / 24px 18px 22px 20px" : "18px 24px 18px 24px / 22px 18px 22px 20px",
  padding: "16px",
  border: theme.border,
  boxShadow: `0 14px 28px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
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

function getPublicAppUrl() {
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

function getFeedbackTone(message = "") {
  return /error|failed|could not|incorrect|not found/i.test(message) ? "error" : "success";
}

function renderFeedbackMessage(message, theme) {
  if (!message) return null;

  return <div style={feedbackMessageStyle(getFeedbackTone(message), theme)}>{message}</div>;
}

function normalizeConnectionPermissions(permissions) {
  return {
    ...DEFAULT_CONNECTION_PERMISSIONS,
    ...(permissions && typeof permissions === "object" ? permissions : {}),
  };
}

function getThemeLanguage(family = "galaxy") {
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

function getThemeRewardCopy(family = "galaxy") {
  if (family === "underwater") {
    return { singular: "Reef", plural: "Reefs" };
  }

  if (family === "forest") {
    return { singular: "Bloom", plural: "Blooms" };
  }

  return { singular: "Constellation", plural: "Constellations" };
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
