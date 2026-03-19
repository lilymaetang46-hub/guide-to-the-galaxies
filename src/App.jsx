import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const today = new Date().toISOString().split("T")[0];

  const [entryId, setEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === null ? true : savedTheme === "true";
  });
  const [activePage, setActivePage] = useState("dashboard");

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

  const theme = darkMode ? mellowDarkTheme : mellowLightTheme;
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
    "Maintenance",
    "Sleep",
    "Cleaning",
    "Exercise",
  ];

  useEffect(() => {
    loadEntry();
    loadHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setGoalSuggestions(makeGoalSuggestions(darkMode ? "galaxy" : "solar"));
  }, [darkMode]);

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
        const rewardMode = darkMode ? "galaxy" : "solar";
        const rewardTitle = makeRewardName(rewardMode);
        const rewardType = darkMode ? "Constellation" : "Sunburst";

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
          message:
            rewardMode === "galaxy"
              ? `${goal.name} complete! You unlocked a Constellation.`
              : `${goal.name} complete! You unlocked a Sunburst.`,
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
  }, [historyData, goals, rewards, entryId, darkMode, today]);

  async function loadEntry() {
    const { data, error } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("entry_date", today)
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
      await loadGoalCollections(row);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("daily_entries")
        .insert([{ entry_date: today }])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        setStatus("Error creating today");
      } else {
        setEntryId(inserted.id);
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
    const { data, error } = await supabase
      .from("daily_entries")
      .select("*")
      .order("entry_date", { ascending: true });

    if (error) {
      console.error("History load error:", error);
      return;
    }

    setHistoryData(data || []);
  }

  async function saveEntry(updated = {}) {
    if (!entryId) return;

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
    const value = new Date(`${date}T00:00:00`);
    const day = value.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    value.setDate(value.getDate() + diff);
    return value;
  }

  function formatDateKey(date) {
    return date.toISOString().split("T")[0];
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
      case "Maintenance":
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

  function makeGoalSuggestions(mode) {
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

    const themeWords = mode === "galaxy" ? galaxyWords : solarWords;
    const suggestions = [];

    while (suggestions.length < 3) {
      const themeWord =
        themeWords[Math.floor(Math.random() * themeWords.length)];
      const actionWord =
        actionWords[Math.floor(Math.random() * actionWords.length)];
      const candidate = `${themeWord} ${actionWord}`;

      if (!suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
    }

    return suggestions;
  }

  function makeRewardName(mode) {
    const solarRewards = ["Golden", "Radiant", "Dawn", "Glow", "Halo", "Aurora"];
    const galaxyRewards = ["Nova", "Celestial", "Lunar", "Comet", "Nebula", "Starlight"];
    const rewardType = mode === "galaxy" ? "Constellation" : "Sunburst";
    const baseWords = mode === "galaxy" ? galaxyRewards : solarRewards;
    const word = baseWords[Math.floor(Math.random() * baseWords.length)];
    return `${word} ${rewardType}`;
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
    setGoalSuggestions(makeGoalSuggestions(darkMode ? "galaxy" : "solar"));
  };

  const applyGoalSuggestion = (suggestion) => {
    setGoalName(suggestion);
  };

  const createGoal = async () => {
    const trimmedName = goalName.trim() || goalSuggestions[0] || "Celestial Goal";
    const nextGoal = {
      id: `${Date.now()}`,
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

  const handleFocusChange = async (value) => {
    setFocus(value);
    setLastAction(`Updated focus to ${value}/5`);
    await saveEntry({ focus: Number(value) });
  };

  const handleEnergyChange = async (value) => {
    setEnergy(value);
    setLastAction(`Updated energy to ${value}/5`);
    await saveEntry({ energy: Number(value) });
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

  const chartData = useMemo(() => {
    return historyData.map((row) => ({
      date: row.entry_date,
      mood: Number(row.mood ?? 0),
      focus: Number(row.focus ?? 0),
      energy: Number(row.energy ?? 0),
      mealsCount: Array.isArray(row.meals) ? row.meals.length : 0,
      medsTaken: row.meds_taken ? 1 : 0,
      medsCount: Array.isArray(row.meds) ? row.meds.length : 0,
      exerciseCount: Array.isArray(row.exercise_logs) ? row.exercise_logs.length : 0,
      cleaningMinutes: Number(row.cleaning_minutes ?? 0),
      sleepQuality: Number(row.sleep_quality ?? 0),
      hygieneCount:
        (row.showered ? 1 : 0) +
        (row.brushed_teeth ? 1 : 0) +
        (row.skincare ? 1 : 0),
    }));
  }, [historyData]);

  const maxMeals = Math.max(...chartData.map((d) => d.mealsCount), 1);
  const maxHygiene = Math.max(...chartData.map((d) => d.hygieneCount), 1);
  const maxMeds = Math.max(...chartData.map((d) => d.medsCount), 1);
  const maxExercise = Math.max(...chartData.map((d) => d.exerciseCount), 1);
  const maintenanceCount =
    (showered ? 1 : 0) + (brushedTeeth ? 1 : 0) + (skincare ? 1 : 0);
  const recentChartData = chartData.slice(-chartRange);
  const chartRangeOptions = [7, 14];
  const dashboardStats = [
    { label: "Meds logged", value: meds.length, note: medTaken ? `Marked at ${medsTime}` : "Not marked yet" },
    { label: "Meals logged", value: meals.length, note: meals.length > 0 ? "Fuel recorded for today" : "No meals yet" },
    { label: "Maintenance", value: `${maintenanceCount}/3`, note: "Shower, teeth, skincare" },
    { label: "Goals active", value: goals.filter((goal) => !goal.completed).length, note: "Streaks update automatically" },
    { label: "Exercise logs", value: exerciseLogs.length, note: exerciseDone ? "Movement marked today" : "No movement marked yet" },
    { label: "Cleaning minutes", value: cleaningMinutes || "0", note: "Small resets count too" },
    { label: "Sleep quality", value: `${sleepQuality}/5`, note: `${bedTime || "No bed"} to ${wakeTime || "No wake"}` },
  ];
  const pageAccent = (solarAccent, galaxyAccent) => (darkMode ? galaxyAccent : solarAccent);
  const renderSectionHeader = (title, subtitle, solarAccent, galaxyAccent) => (
    <>
      <div style={cardHeaderRowStyle}>
        <div>
          <div style={emojiStyle}>{pageAccent(solarAccent, galaxyAccent)}</div>
          <h2 style={sectionTitleStyle(theme)}>{title}</h2>
        </div>
      </div>
      {subtitle ? <p style={helperTextStyle(theme)}>{subtitle}</p> : null}
    </>
  );

  const currentPageContent = (() => {
    switch (activePage) {
      case "dashboard":
        return (
          <div style={chartsPageStyle}>
            <section className="galaxy-panel" style={sectionCardStyle(theme, "dashboard")}>
              {renderSectionHeader(
                "Guide to the Galaxies",
                "A calm navigation panel for today.",
                "Sun",
                "Star"
              )}
              <div style={dashboardHeroStyle(theme)}>
                <div>
                  <p style={dashboardKickerStyle(theme)}>Today's coordinates</p>
                  <h3 style={dashboardHeadingStyle(theme)}>Steady, supportive, and easy to read.</h3>
                  <p style={subtitleStyle(theme)}>
                    Use each page like a constellation map: one small step at a time.
                  </p>
                </div>
                <div style={dashboardPulseStyle(theme)}>
                  <div style={dashboardPulseRingStyle(theme)} />
                  <div style={dashboardPulseCoreStyle(theme)}>{mood}/5</div>
                </div>
              </div>

              <div style={dashboardStatsGridStyle}>
                {dashboardStats.map((item) => (
                  <div key={item.label} style={summaryCardStyle(theme)}>
                    <div style={summaryLabelStyle(theme)}>{item.label}</div>
                    <div style={summaryValueStyle(theme)}>{item.value}</div>
                    <div style={summaryNoteStyle(theme)}>{item.note}</div>
                  </div>
                ))}
              </div>
            </section>

            <div style={gridStyle}>
              <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
                {renderSectionHeader(
                  "Daily Signals",
                  "Quick readouts for how the day is moving.",
                  "Spark",
                  "Spark"
                )}
                <p style={smallInfoStyle(theme)}>Mood / Focus / Energy: {mood}/5, {focus}/5, {energy}/5</p>
                <p style={smallInfoStyle(theme)}>Sleep: {bedTime || "No bedtime"} to {wakeTime || "No wake time"}</p>
                <p style={smallInfoStyle(theme)}>Screens before bed: {usedScreensBeforeBed ? "Yes" : "No"}</p>
                <p style={smallInfoStyle(theme)}>Last action: {lastAction}</p>
              </section>

              <section className="galaxy-panel" style={sectionCardStyle(theme, "jump")}>
                {renderSectionHeader(
                  "Jump To",
                  "Fast links for the pages you may want on hard days.",
                  "Comet",
                  "Comet"
                )}
                <div style={quickLinkGridStyle}>
                  {[
                    { key: "goals", label: "Goals" },
                    { key: "meds", label: "Meds" },
                    { key: "food", label: "Food" },
                    { key: "sleep", label: "Sleep" },
                    { key: "mood", label: "Mood" },
                    { key: "maintenance", label: "Maintenance" },
                    { key: "cleaning", label: "Cleaning" },
                    { key: "exercise", label: "Exercise" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      style={quickJumpButtonStyle(theme)}
                      onClick={() => setActivePage(item.key)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );
      case "goals":
        return (
          <div style={chartsPageStyle}>
            <section className="galaxy-panel" style={sectionCardStyle(theme, "goals")}>
              {renderSectionHeader(
                "Goals",
                "Create streak goals that read from your tracker automatically.",
                "Quest",
                "Quest"
              )}

              <div style={goalFormGridStyle}>
                <div>
                  <label style={labelStyle(theme)}>Goal name</label>
                  <input
                    style={inputStyle(theme)}
                    type="text"
                    placeholder="Golden Ritual"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle(theme)}>Category</label>
                  <select
                    style={inputStyle(theme)}
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                  >
                    {goalCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle(theme)}>Check type</label>
                  <select
                    style={inputStyle(theme)}
                    value={goalCheckType}
                    onChange={(e) => setGoalCheckType(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle(theme)}>Target amount</label>
                  <input
                    style={inputStyle(theme)}
                    type="number"
                    min="1"
                    value={goalTargetAmount}
                    onChange={(e) => setGoalTargetAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle(theme)}>
                    {goalCheckType === "weekly" ? "Streak length (weeks)" : "Streak length (days)"}
                  </label>
                  <input
                    style={inputStyle(theme)}
                    type="number"
                    min="1"
                    value={goalStreakLength}
                    onChange={(e) => setGoalStreakLength(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: "18px" }}>
                <div style={goalSuggestionHeaderStyle}>
                  <p style={tagGroupLabelStyle(theme)}>Suggested names</p>
                  <button style={smallRemoveButtonStyle(theme)} onClick={refreshGoalSuggestions}>
                    Refresh Suggestions
                  </button>
                </div>
                <div style={moodTagGridStyle}>
                  {goalSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      style={goalSuggestionButtonStyle(theme)}
                      onClick={() => applyGoalSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "18px" }}>
                <button style={primaryButtonStyle(theme)} onClick={createGoal}>
                  Create Goal
                </button>
              </div>
            </section>

            <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
              {renderSectionHeader(
                "Active Goals",
                "If a streak misses its target, it resets and starts again.",
                "Glow",
                "Orbit"
              )}

              {goals.filter((goal) => !goal.completed).length === 0 ? (
                <p style={emptyTextStyle(theme)}>No active goals yet.</p>
              ) : (
                <ul style={mealListStyle}>
                  {goals
                    .filter((goal) => !goal.completed)
                    .map((goal) => (
                      <li key={goal.id} style={goalCardItemStyle(theme)}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "bold" }}>{goal.name}</div>
                          <div style={goalMetaStyle(theme)}>
                            {goal.category} · {goal.checkType} · target {goal.targetAmount}
                          </div>
                          <div style={goalMetaStyle(theme)}>
                            Streak: {goal.currentStreakProgress}/{goal.streakLength}{" "}
                            {goal.checkType === "weekly" ? "weeks" : "days"}
                          </div>
                          <div style={goalProgressTrackStyle(theme)}>
                            <div
                              style={{
                                ...goalProgressFillStyle(theme),
                                width: `${Math.min(
                                  100,
                                  (goal.currentStreakProgress / goal.streakLength) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <button
                          style={smallRemoveButtonStyle(theme)}
                          onClick={() => removeGoal(goal.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </section>

            <div style={gridStyle}>
              <section className="galaxy-panel" style={sectionCardStyle(theme, "care")}>
                {renderSectionHeader(
                  "Completed Goals",
                  "Finished streaks stay here like little celestial landmarks.",
                  "Halo",
                  "Nebula"
                )}

                {goals.filter((goal) => goal.completed).length === 0 ? (
                  <p style={emptyTextStyle(theme)}>No completed goals yet.</p>
                ) : (
                  <ul style={mealListStyle}>
                    {goals
                      .filter((goal) => goal.completed)
                      .map((goal) => (
                        <li key={goal.id} style={mealItemStyle(theme)}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>{goal.name}</div>
                            <div style={goalMetaStyle(theme)}>
                              Completed with {goal.currentStreakProgress}/{goal.streakLength}{" "}
                              {goal.checkType === "weekly" ? "weeks" : "days"}
                            </div>
                            <div style={goalMetaStyle(theme)}>
                              Reward: {goal.rewardEarned || "Reward unlocked"}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </section>

              <section className="galaxy-panel" style={sectionCardStyle(theme, "dashboard")}>
                {renderSectionHeader(
                  darkMode ? "Collected Constellations" : "Collected Sunbursts",
                  "Every completed goal adds a themed reward to your collection.",
                  "Dawn",
                  "Starlight"
                )}

                {rewards.length === 0 ? (
                  <p style={emptyTextStyle(theme)}>No rewards collected yet.</p>
                ) : (
                  <div style={rewardGridStyle}>
                    {rewards.map((reward) => (
                      <div key={reward.id} style={rewardCardStyle(theme)}>
                        <div style={rewardTitleStyle(theme)}>{reward.title}</div>
                        <div style={goalMetaStyle(theme)}>{reward.goalName}</div>
                        <div style={goalMetaStyle(theme)}>Earned {reward.earnedAt}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        );
      case "mood":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "mood")}>
            {renderSectionHeader(
              "Mood",
              "Keep the slider, then add up to 3 words that fit today.",
              "Glow",
              "Nova"
            )}
            <p style={sliderValueStyle(theme)}>Current mood: {mood}/5</p>
            <input
              style={rangeStyle}
              type="range"
              min="1"
              max="5"
              value={mood}
              onChange={(e) => handleMoodChange(e.target.value)}
            />

            <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
              {moodTagGroups.map((group) => (
                <div key={group.label}>
                  <p style={tagGroupLabelStyle(theme)}>{group.label}</p>
                  <div style={moodTagGridStyle}>
                    {group.tags.map((tag) => {
                      const selected = moodTags.includes(tag);

                      return (
                        <button
                          key={tag}
                          style={moodTagButtonStyle(selected, theme)}
                          onClick={() => toggleMoodTag(tag)}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p style={smallInfoStyle(theme)}>
              Selected mood words: {moodTags.length > 0 ? moodTags.join(", ") : "None yet"}
            </p>
          </section>
        );
      case "meds":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "meds")}>
            {renderSectionHeader("Meds", "Track each medication separately.", "Sun", "Star")}

            <div style={{ display: "grid", gap: "10px" }}>
              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="Medication name"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
              />

              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="Dose"
                value={medDose}
                onChange={(e) => setMedDose(e.target.value)}
              />

              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="Symptoms / side effects"
                value={medSymptoms}
                onChange={(e) => setMedSymptoms(e.target.value)}
              />

              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="Notes"
                value={medNotes}
                onChange={(e) => setMedNotes(e.target.value)}
              />

              <button style={primaryButtonStyle(theme)} onClick={addMedication}>
                Add Medication
              </button>
            </div>

            <p style={countTextStyle(theme)}>Meds logged today: {meds.length}</p>
            <p style={smallInfoStyle(theme)}>
              Quick toggle: {medTaken ? `Taken at ${medsTime}` : "Not marked"}
            </p>

            <div style={{ marginTop: "10px" }}>
              <button
                style={medTaken ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleMed}
              >
                {medTaken ? "Taken" : "Not Taken"}
              </button>
            </div>

            {meds.length === 0 ? (
              <p style={emptyTextStyle(theme)}>No medications logged yet.</p>
            ) : (
              <ul style={mealListStyle}>
                {meds.map((med, index) => (
                  <li key={index} style={mealItemStyle(theme)}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        {med.name} {med.dose ? `- ${med.dose}` : ""}
                      </div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        Taken at {med.time}
                      </div>
                      {med.symptoms && (
                        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                          Symptoms: {med.symptoms}
                        </div>
                      )}
                      {med.notes && (
                        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                          Notes: {med.notes}
                        </div>
                      )}
                    </div>

                    <button
                      style={smallRemoveButtonStyle(theme)}
                      onClick={() => removeMedication(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      case "food":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "food")}>
            {renderSectionHeader("Food", "Track what you ate and when.", "Glow", "Spark")}

            <div style={rowStyle}>
              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="What did you eat?"
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
              />
              <button style={primaryButtonStyle(theme)} onClick={addMeal}>
                Add
              </button>
            </div>

            <p style={countTextStyle(theme)}>Meals today: {meals.length}</p>

            {meals.length === 0 ? (
              <p style={emptyTextStyle(theme)}>No meals added yet.</p>
            ) : (
              <ul style={mealListStyle}>
                {meals.map((meal, index) => (
                  <li key={index} style={mealItemStyle(theme)}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{meal.text}</div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        {meal.time}
                      </div>
                    </div>

                    <button
                      style={smallRemoveButtonStyle(theme)}
                      onClick={() => removeMeal(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      case "sleep":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "sleep")}>
            {renderSectionHeader("Sleep", "Track bedtime and wake time.", "Moon", "Moon")}

            <div style={sleepGridStyle}>
              <div>
                <label style={labelStyle(theme)}>Bedtime</label>
                <input
                  style={inputStyle(theme)}
                  type="time"
                  value={bedTime}
                  onChange={(e) => handleBedTimeChange(e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle(theme)}>Wake time</label>
                <input
                  style={inputStyle(theme)}
                  type="time"
                  value={wakeTime}
                  onChange={(e) => handleWakeTimeChange(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={labelStyle(theme)}>Sleep routine</label>
              <textarea
                style={{ ...inputStyle(theme), minHeight: "90px", resize: "vertical" }}
                placeholder="What helped you wind down before bed?"
                value={sleepRoutine}
                onChange={(e) => handleSleepRoutineChange(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <button
                style={usedScreensBeforeBed ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleUsedScreensBeforeBed}
              >
                {usedScreensBeforeBed ? "Screens Before Bed Done" : "Used Screens Before Bed"}
              </button>
            </div>

            <div style={{ marginTop: "16px" }}>
              <p style={sliderValueStyle(theme)}>Sleep quality: {sleepQuality}/5</p>
              <input
                style={rangeStyle}
                type="range"
                min="1"
                max="5"
                value={sleepQuality}
                onChange={(e) => handleSleepQualityChange(e.target.value)}
              />
            </div>
          </section>
        );
      case "maintenance":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "maintenance")}>
            {renderSectionHeader("Maintenance", "Quick check-off tasks.", "Star", "Star")}

            <div style={buttonWrapStyle}>
              <button
                style={showered ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleShowered}
              >
                {showered ? "Showered Done" : "Shower"}
              </button>

              <button
                style={brushedTeeth ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleBrushedTeeth}
              >
                {brushedTeeth ? "Brushed Teeth Done" : "Brush Teeth"}
              </button>

              <button
                style={skincare ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleSkincare}
              >
                {skincare ? "Skincare Done" : "Skincare"}
              </button>
            </div>

            <div style={{ marginTop: "14px" }}>
              <p style={smallInfoStyle(theme)}>Shower: {showeredTime || "Not recorded"}</p>
              <p style={smallInfoStyle(theme)}>Brush teeth: {brushedTeethTime || "Not recorded"}</p>
              <p style={smallInfoStyle(theme)}>Skincare: {skincareTime || "Not recorded"}</p>
            </div>
          </section>
        );
      case "cleaning":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "cleaning")}>
            {renderSectionHeader("Cleaning", "Track small cleaning wins.", "Comet", "Spark")}

            <div style={buttonWrapStyle}>
              <button
                style={laundryDone ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleLaundry}
              >
                {laundryDone ? "Laundry Done" : "Laundry"}
              </button>

              <button
                style={bedsheetsDone ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleBedsheets}
              >
                {bedsheetsDone ? "Bedsheets Done" : "Bedsheets"}
              </button>

              <button
                style={roomCleaned ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleRoomCleaned}
              >
                {roomCleaned ? "Room Cleaned Done" : "Room Cleaned"}
              </button>
            </div>

            <div style={{ marginTop: "14px" }}>
              <p style={smallInfoStyle(theme)}>Laundry: {laundryTime || "Not recorded"}</p>
              <p style={smallInfoStyle(theme)}>Bedsheets: {bedsheetsTime || "Not recorded"}</p>
              <p style={smallInfoStyle(theme)}>
                Room cleaned: {roomCleanedTime || "Not recorded"}
              </p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={labelStyle(theme)}>Cleaning minutes</label>
              <input
                style={inputStyle(theme)}
                type="number"
                min="0"
                placeholder="Minutes spent cleaning"
                value={cleaningMinutes}
                onChange={(e) => handleCleaningMinutesChange(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <p style={sliderValueStyle(theme)}>Worth it: {cleaningWorthIt}/5</p>
              <input
                style={rangeStyle}
                type="range"
                min="1"
                max="5"
                value={cleaningWorthIt}
                onChange={(e) => handleCleaningWorthItChange(e.target.value)}
              />
            </div>
          </section>
        );
      case "exercise":
        return (
          <section className="galaxy-panel" style={sectionCardStyle(theme, "exercise")}>
            {renderSectionHeader("Exercise", "Track movement and how it felt.", "Orbit", "Star")}

            <div style={buttonWrapStyle}>
              <button
                style={exerciseDone ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleExerciseDone}
              >
                {exerciseDone ? "Exercise Done" : "Mark Exercise"}
              </button>

              <button
                style={extraWalk ? successButtonStyle : softButtonStyle(theme)}
                onClick={toggleExtraWalk}
              >
                {extraWalk ? "Extra Walk Done" : "Extra Walk"}
              </button>
            </div>

            <div style={{ marginTop: "14px" }}>
              <p style={smallInfoStyle(theme)}>Exercise time: {exerciseTime || "Not recorded"}</p>
            </div>

            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              <div>
                <label style={labelStyle(theme)}>Exercise time</label>
                <input
                  style={inputStyle(theme)}
                  type="text"
                  placeholder="2:30 PM"
                  value={exerciseTime}
                  onChange={(e) => handleExerciseTimeChange(e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle(theme)}>Exercise type</label>
                <input
                  style={inputStyle(theme)}
                  type="text"
                  placeholder="Walk, stretch, yoga, etc."
                  value={exerciseType}
                  onChange={(e) => handleExerciseTypeChange(e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle(theme)}>Exercise minutes</label>
                <input
                  style={inputStyle(theme)}
                  type="number"
                  min="0"
                  placeholder="Minutes exercised"
                  value={exerciseMinutes}
                  onChange={(e) => handleExerciseMinutesChange(e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle(theme)}>How I felt after</label>
                <input
                  style={inputStyle(theme)}
                  type="text"
                  placeholder="Calm, stronger, sweaty, etc."
                  value={exerciseFeeling}
                  onChange={(e) => handleExerciseFeelingChange(e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle(theme)}>After exercise state</label>
                <input
                  style={inputStyle(theme)}
                  type="text"
                  placeholder="Productive, tired, zombie, etc."
                  value={afterExerciseState}
                  onChange={(e) => handleAfterExerciseStateChange(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <button style={primaryButtonStyle(theme)} onClick={addExerciseLog}>
                Add Exercise Log
              </button>
            </div>

            {exerciseLogs.length === 0 ? (
              <p style={emptyTextStyle(theme)}>No exercise logs yet.</p>
            ) : (
              <ul style={mealListStyle}>
                {exerciseLogs.map((log, index) => (
                  <li key={index} style={mealItemStyle(theme)}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{log.type || "Unnamed exercise"}</div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        Time: {log.time || "Not recorded"}
                      </div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                        Minutes: {log.minutes === "" || log.minutes == null ? "Not recorded" : log.minutes}
                      </div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                        Felt after: {log.feeling || "Not recorded"}
                      </div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                        Extra walk: {log.extraWalk ? "Yes" : "No"}
                      </div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                        State after: {log.afterState || "Not recorded"}
                      </div>
                    </div>

                    <button
                      style={smallRemoveButtonStyle(theme)}
                      onClick={() => removeExerciseLog(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      case "charts":
        return (
          <div style={chartsPageStyle}>
            <section className="galaxy-panel" style={sectionCardStyle(theme, "charts")}>
              {renderSectionHeader(
                "Celestial Charts",
                "Look for patterns across the last few days without overload.",
                "Sun",
                "Star"
              )}
              <div style={chartToolbarStyle}>
                {chartRangeOptions.map((days) => (
                  <button
                    key={days}
                    style={rangeChipStyle(chartRange === days, theme)}
                    onClick={() => setChartRange(days)}
                  >
                    Last {days} days
                  </button>
                ))}
              </div>

              {recentChartData.length === 0 ? (
                <p style={emptyTextStyle(theme)}>No chart data yet.</p>
              ) : (
                <div style={chartStackStyle}>
                  <LineTrendChart
                    title="Wellbeing trends"
                    subtitle="Mood, focus, and energy traveling together across time."
                    data={recentChartData}
                    yMax={5}
                    theme={theme}
                    series={[
                      { key: "mood", label: "Mood", color: theme.chartPalette.mood },
                      { key: "focus", label: "Focus", color: theme.chartPalette.focus },
                      { key: "energy", label: "Energy", color: theme.chartPalette.energy },
                    ]}
                  />
                </div>
              )}
            </section>

            <section className="galaxy-panel" style={sectionCardStyle(theme, "care")}>
              {renderSectionHeader(
                "Care Habits",
                "Meals, meds, maintenance, and movement across recent days.",
                "Comet",
                "Spark"
              )}

              {recentChartData.length === 0 ? (
                <p style={emptyTextStyle(theme)}>No chart data yet.</p>
              ) : (
                <div style={chartStackStyle}>
                  <LineTrendChart
                    title="Care habits chart"
                    subtitle="Counts for nourishment, meds, hygiene, and exercise logs."
                    data={recentChartData}
                    yMax={Math.max(maxMeals, maxMeds, maxHygiene, maxExercise, 3)}
                    theme={theme}
                    series={[
                      { key: "mealsCount", label: "Meals", color: theme.chartPalette.meals },
                      { key: "medsCount", label: "Meds", color: theme.chartPalette.meds },
                      { key: "hygieneCount", label: "Maintenance", color: theme.chartPalette.hygiene },
                      { key: "exerciseCount", label: "Exercise", color: theme.chartPalette.exercise },
                    ]}
                  />
                </div>
              )}
            </section>
          </div>
        );
      default:
        return null;
    }
  })();

  if (loading) {
    return (
      <div style={pageStyle(theme)}>
        <div style={containerStyle}>
          <div style={heroCardStyle(theme)}>
            <h1 style={titleStyle(theme)}>Loading your tracker...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle(theme)}>
      <style>{`
        .galaxy-panel {
          transition: transform 180ms ease, box-shadow 220ms ease, filter 220ms ease;
        }

        .galaxy-panel:hover {
          transform: translateY(-2px);
          filter: brightness(1.015);
        }

        button,
        input,
        textarea {
          transition: transform 160ms ease, box-shadow 200ms ease, filter 200ms ease, border-color 200ms ease, background 220ms ease;
        }

        button:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }

        button:active {
          transform: translateY(1px) scale(0.99);
        }

        input:focus,
        textarea:focus {
          outline: none;
          filter: brightness(1.015);
        }
      `}</style>
      {rewardPopup ? (
        <div style={popupOverlayStyle}>
          <div style={popupCardStyle(theme)}>
            <p style={tinyLabelStyle(theme)}>
              {darkMode ? "Constellation Found" : "Sunburst Unlocked"}
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
      <div style={containerStyle}>
        <div style={heroCardStyle(theme)}>
          <div>
            <p style={tinyLabelStyle(theme)}>Guide to the Galaxies</p>
            <h1 style={titleStyle(theme)}>Daily Navigation Console</h1>
            <p style={subtitleStyle(theme)}>Celestial, calm, and built for gentle progress.</p>
            <p style={dateStyle(theme)}>{today}</p>
            <p style={lastActionStyle(theme)}>Last action: {lastAction}</p>
          </div>

          <div style={headerControlsStyle}>
            <button
              style={navButtonStyle(activePage === "dashboard", theme)}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </button>
            <button
              style={navButtonStyle(activePage === "goals", theme)}
              onClick={() => setActivePage("goals")}
            >
              Goals
            </button>
            <button
              style={navButtonStyle(activePage === "mood", theme)}
              onClick={() => setActivePage("mood")}
            >
              Mood
            </button>
            <button
              style={navButtonStyle(activePage === "meds", theme)}
              onClick={() => setActivePage("meds")}
            >
              Meds
            </button>
            <button
              style={navButtonStyle(activePage === "food", theme)}
              onClick={() => setActivePage("food")}
            >
              Food
            </button>
            <button
              style={navButtonStyle(activePage === "sleep", theme)}
              onClick={() => setActivePage("sleep")}
            >
              Sleep
            </button>
            <button
              style={navButtonStyle(activePage === "maintenance", theme)}
              onClick={() => setActivePage("maintenance")}
            >
              Maintenance
            </button>
            <button
              style={navButtonStyle(activePage === "cleaning", theme)}
              onClick={() => setActivePage("cleaning")}
            >
              Cleaning
            </button>
            <button
              style={navButtonStyle(activePage === "exercise", theme)}
              onClick={() => setActivePage("exercise")}
            >
              Exercise
            </button>
            <button
              style={navButtonStyle(activePage === "charts", theme)}
              onClick={() => setActivePage("charts")}
            >
              Charts
            </button>
            <button
              style={themeToggleStyle(theme)}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Solar Mode" : "Galaxy Mode"}
            </button>
            <div style={statusBadgeStyle(status, theme)}>{status || "Ready"}</div>
          </div>
        </div>

        {currentPageContent}
      </div>
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

const pageStyle = (theme) => ({
  minHeight: "100vh",
  background: theme.pageBackground,
  padding: "24px",
  fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
  color: theme.text,
  position: "relative",
  overflowX: "hidden",
});

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const heroCardStyle = (theme) => ({
  background: theme.heroBackground,
  borderRadius: "28px",
  padding: "24px",
  boxShadow: theme.heroShadow,
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  border: theme.border,
  position: "relative",
  overflow: "hidden",
});

const featureCardStyle = (theme) => ({
  background: theme.cardBackground,
  borderRadius: "26px",
  padding: "22px",
  boxShadow: theme.shadow,
  border: theme.border,
  clipPath:
    "polygon(0 14px, 14px 0, calc(100% - 18px) 0, 100% 10px, 100% calc(100% - 14px), calc(100% - 10px) 100%, 12px 100%, 0 calc(100% - 18px))",
  position: "relative",
  overflow: "hidden",
});

const sectionCardStyle = (theme, section) => {
  const sectionThemes = {
    dashboard: {
      glow: darkModeSafe(theme, "rgba(124, 112, 255, 0.24)", "rgba(242, 183, 92, 0.26)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 16% 18%, rgba(124,112,255,0.14) 0%, rgba(124,112,255,0) 34%)",
        "radial-gradient(circle at 14% 16%, rgba(255,206,120,0.2) 0%, rgba(255,206,120,0) 32%)"
      ),
      tilt: "-0.35deg",
    },
    signals: {
      glow: darkModeSafe(theme, "rgba(116, 207, 255, 0.18)", "rgba(255, 187, 133, 0.18)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 78% 18%, rgba(94,181,255,0.14) 0%, rgba(94,181,255,0) 28%)",
        "radial-gradient(circle at 76% 18%, rgba(255,175,126,0.18) 0%, rgba(255,175,126,0) 28%)"
      ),
      tilt: "0.2deg",
    },
    jump: {
      glow: darkModeSafe(theme, "rgba(173, 142, 255, 0.18)", "rgba(255, 211, 132, 0.2)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 82% 72%, rgba(160,126,255,0.15) 0%, rgba(160,126,255,0) 30%)",
        "radial-gradient(circle at 84% 70%, rgba(255,214,132,0.2) 0%, rgba(255,214,132,0) 30%)"
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
      glow: darkModeSafe(theme, "rgba(120, 190, 255, 0.18)", "rgba(255, 196, 98, 0.22)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 82% 20%, rgba(120,190,255,0.14) 0%, rgba(120,190,255,0) 30%)",
        "radial-gradient(circle at 82% 20%, rgba(255,204,123,0.18) 0%, rgba(255,204,123,0) 30%)"
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
      glow: darkModeSafe(theme, "rgba(245, 163, 255, 0.16)", "rgba(240, 168, 104, 0.16)"),
      tint: darkModeSafe(
        theme,
        "radial-gradient(circle at 84% 18%, rgba(245,163,255,0.12) 0%, rgba(245,163,255,0) 28%)",
        "radial-gradient(circle at 84% 18%, rgba(240,168,104,0.16) 0%, rgba(240,168,104,0) 28%)"
      ),
      tilt: "0.12deg",
    },
  };

  const accent = sectionThemes[section] || sectionThemes.dashboard;

  return {
    ...featureCardStyle(theme),
    background: `${accent.tint}, ${theme.cardBackground}`,
    boxShadow: `${theme.shadow}, 0 0 0 1px rgba(255,255,255,0.03), 0 18px 34px ${accent.glow}`,
    transform: `rotate(${accent.tilt})`,
  };
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const chartsPageStyle = {
  display: "grid",
  gap: "18px",
};

const titleStyle = (theme) => ({
  margin: 0,
  fontSize: "2.3rem",
  color: theme.text,
  letterSpacing: "0.02em",
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
  margin: "6px 0 4px 0",
  color: theme.subtleText,
});

const dateStyle = (theme) => ({
  margin: 0,
  color: theme.faintText,
  fontSize: "0.95rem",
});

const lastActionStyle = (theme) => ({
  marginTop: "8px",
  color: theme.subtleText,
  fontSize: "0.95rem",
});

const headerControlsStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const cardHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  gap: "10px",
};

const emojiStyle = {
  fontSize: "1.15rem",
  marginBottom: "6px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontWeight: "bold",
};

const sectionTitleStyle = (theme) => ({
  marginTop: 0,
  marginBottom: "8px",
  color: theme.text,
  fontSize: "1.35rem",
});

const helperTextStyle = (theme) => ({
  marginTop: 0,
  color: theme.faintText,
  fontSize: "0.95rem",
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
  marginBottom: "8px",
  fontWeight: "bold",
  color: theme.subtleText,
});

const smallInfoStyle = (theme) => ({
  margin: "8px 0 0 0",
  color: theme.faintText,
  fontSize: "0.9rem",
});

const rowStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap",
};

const buttonWrapStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const sleepGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const inputStyle = (theme) => ({
  padding: "12px 14px",
  borderRadius: "12px",
  border: `1px solid ${theme.inputBorder}`,
  color: theme.text,
  background: theme.inputBackground,
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem",
  boxShadow: `inset 0 1px 0 ${theme.star}`,
});

const primaryButtonStyle = (theme) => ({
  background: theme.primary,
  color: theme.primaryText,
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 10px 22px ${theme.glow}`,
});

const softButtonStyle = (theme) => ({
  background: theme.softButtonBackground,
  color: theme.softButtonText,
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
});

const successButtonStyle = {
  backgroundColor: "#7ea06f",
  color: "#fffaf2",
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
};

const smallRemoveButtonStyle = (theme) => ({
  backgroundColor: theme.softButtonBackground,
  color: theme.softButtonText,
  border: "none",
  borderRadius: "10px",
  padding: "8px 10px",
  cursor: "pointer",
  fontWeight: "bold",
});

const navButtonStyle = (active, theme) => ({
  background: active ? theme.navActive : theme.navInactive,
  color: active ? theme.primaryText : theme.navText,
  border: "none",
  borderRadius: "999px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: active ? `0 12px 24px ${theme.glow}` : "none",
});

const mealListStyle = {
  listStyle: "none",
  padding: 0,
  margin: "12px 0 0 0",
};

const mealItemStyle = (theme) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  backgroundColor: theme.itemBackground,
  padding: "10px 12px",
  borderRadius: "12px",
  marginBottom: "8px",
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
  borderRadius: "999px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 12px 24px ${theme.glow}`,
});

const statusBadgeStyle = (status, theme) => ({
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  backgroundColor:
    status === "Saved"
      ? "rgba(105,201,178,0.24)"
      : status.includes("Error")
      ? "rgba(201,107,107,0.22)"
      : theme.itemBackground,
  color: theme.text,
});

const dashboardHeroStyle = (theme) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "18px 20px",
  borderRadius: "22px",
  background: `linear-gradient(145deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  marginBottom: "18px",
  flexWrap: "wrap",
  boxShadow: `inset 0 1px 0 ${theme.star}, 0 14px 28px ${theme.glow}`,
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
  fontSize: "1.5rem",
  color: theme.text,
});

const dashboardPulseStyle = (theme) => ({
  position: "relative",
  width: "112px",
  height: "112px",
  display: "grid",
  placeItems: "center",
});

const dashboardPulseRingStyle = (theme) => ({
  position: "absolute",
  inset: "8px",
  borderRadius: "50%",
  border: `1px solid ${theme.star}`,
  boxShadow: `0 0 24px ${theme.glow}`,
});

const dashboardPulseCoreStyle = (theme) => ({
  width: "68px",
  height: "68px",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const summaryCardStyle = (theme) => ({
  background: `linear-gradient(155deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.03) 100%)`,
  borderRadius: "20px",
  padding: "16px",
  border: theme.border,
  boxShadow: `0 16px 32px ${theme.glow}`,
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
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginTop: "8px",
});

const summaryNoteStyle = (theme) => ({
  color: theme.subtleText,
  fontSize: "0.9rem",
  marginTop: "8px",
});

const quickLinkGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "10px",
};

const goalFormGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const goalSuggestionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const moodTagGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
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
  borderRadius: "18px",
  padding: "12px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: `0 10px 20px ${theme.glow}`,
});

const chartToolbarStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "14px",
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
  gap: "18px",
};

const chartCardStyle = (theme) => ({
  background: `linear-gradient(160deg, ${theme.chartSurface} 0%, rgba(255,255,255,0.03) 100%)`,
  borderRadius: "22px",
  padding: "16px",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const rewardCardStyle = (theme) => ({
  background: `linear-gradient(160deg, ${theme.itemBackground} 0%, rgba(255,255,255,0.04) 100%)`,
  borderRadius: "18px",
  padding: "14px",
  border: theme.border,
  boxShadow: `0 14px 28px ${theme.glow}`,
});

const rewardTitleStyle = (theme) => ({
  color: theme.text,
  fontWeight: "bold",
  marginBottom: "6px",
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
  borderRadius: "24px",
  padding: "22px",
  border: theme.border,
  boxShadow: theme.heroShadow,
  textAlign: "center",
});

function darkModeSafe(theme, galaxyValue, solarValue) {
  return theme.modeName === "Galaxy" ? galaxyValue : solarValue;
}

function formatShortDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function buildLinePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function LineTrendChart({ title, subtitle, data, yMax, series, theme }) {
  const width = 640;
  const height = 260;
  const padding = { top: 24, right: 18, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const safeMax = Math.max(yMax, 1);

  const getX = (index) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value) => {
    const normalized = Math.max(0, Math.min(value, safeMax)) / safeMax;
    return padding.top + chartHeight - normalized * chartHeight;
  };

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const value = (safeMax / 4) * index;
    const y = getY(value);
    return { value, y };
  });

  return (
    <div style={chartCardStyle(theme)}>
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0, color: theme.text }}>{title}</h3>
        <p style={{ margin: "6px 0 0 0", color: theme.subtleText, fontSize: "0.92rem" }}>{subtitle}</p>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
        {series.map((item) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 10px",
              borderRadius: "999px",
              background: theme.itemBackground,
              color: theme.subtleText,
              fontSize: "0.88rem",
              fontWeight: "bold",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: item.color,
                boxShadow: `0 0 10px ${item.color}`,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {gridLines.map((line) => (
          <g key={line.value}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={width - padding.right}
              y2={line.y}
              stroke={theme.chartGrid}
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={line.y + 4}
              textAnchor="end"
              fill={theme.chartLabel}
              fontSize="11"
            >
              {Math.round(line.value)}
            </text>
          </g>
        ))}

        {data.map((item, index) => (
          <text
            key={item.date}
            x={getX(index)}
            y={height - 12}
            textAnchor="middle"
            fill={theme.chartLabel}
            fontSize="11"
          >
            {formatShortDate(item.date)}
          </text>
        ))}

        {series.map((item) => {
          const points = data.map((entry, index) => ({
            x: getX(index),
            y: getY(Number(entry[item.key] ?? 0)),
            value: Number(entry[item.key] ?? 0),
          }));
          const path = buildLinePath(points);

          return (
            <g key={item.key}>
              <path
                d={path}
                fill="none"
                stroke={item.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.14"
              />
              <path
                d={path}
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((point, index) => (
                <g key={`${item.key}-${index}`}>
                  <circle cx={point.x} cy={point.y} r="5" fill={item.color} opacity="0.22" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2.8"
                    fill={item.color}
                    stroke={theme.chartSurface}
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default App;


