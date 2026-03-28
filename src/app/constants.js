export const DEFAULT_PUBLIC_APP_URL = "https://guide-to-the-galaxies.app";
export const DEFAULT_PUSH_ENVIRONMENT = "production";

export const DEFAULT_CONNECTION_PERMISSIONS = {
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

export const TRACKING_AREA_OPTIONS = [
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
