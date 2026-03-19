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
  const [activePage, setActivePage] = useState("tracker");

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

  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  const [mood, setMood] = useState(3);
  const [focus, setFocus] = useState(3);
  const [energy, setEnergy] = useState(3);

  const [lastAction, setLastAction] = useState("Nothing yet");
  const [historyData, setHistoryData] = useState([]);

  const theme = darkMode ? mellowDarkTheme : mellowLightTheme;

  useEffect(() => {
    loadEntry();
    loadHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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
      setBedTime(row.bed_time ?? "");
      setWakeTime(row.wake_time ?? "");
      setMood(row.mood ?? 3);
      setFocus(row.focus ?? 3);
      setEnergy(row.energy ?? 3);
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
      }
    }

    setLoading(false);
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
      bed_time: bedTime,
      wake_time: wakeTime,
      mood: Number(mood),
      focus: Number(focus),
      energy: Number(energy),
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

  const handleMoodChange = async (value) => {
    setMood(value);
    setLastAction(`Updated mood to ${value}/5`);
    await saveEntry({ mood: Number(value) });
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

  const chartData = useMemo(() => {
    return historyData.map((row) => ({
      date: row.entry_date,
      mood: Number(row.mood ?? 0),
      focus: Number(row.focus ?? 0),
      energy: Number(row.energy ?? 0),
      mealsCount: Array.isArray(row.meals) ? row.meals.length : 0,
      medsTaken: row.meds_taken ? 1 : 0,
      medsCount: Array.isArray(row.meds) ? row.meds.length : 0,
      hygieneCount:
        (row.showered ? 1 : 0) +
        (row.brushed_teeth ? 1 : 0) +
        (row.skincare ? 1 : 0),
    }));
  }, [historyData]);

  const maxMeals = Math.max(...chartData.map((d) => d.mealsCount), 1);
  const maxHygiene = Math.max(...chartData.map((d) => d.hygieneCount), 1);
  const maxMeds = Math.max(...chartData.map((d) => d.medsCount), 1);

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
      <div style={containerStyle}>
        <div style={heroCardStyle(theme)}>
          <div>
            <p style={tinyLabelStyle(theme)}>Daily Care</p>
            <h1 style={titleStyle(theme)}>Daily Tracker</h1>
            <p style={subtitleStyle(theme)}>Simple, calm, and focused.</p>
            <p style={dateStyle(theme)}>{today}</p>
            <p style={lastActionStyle(theme)}>Last action: {lastAction}</p>
          </div>

          <div style={headerControlsStyle}>
            <button
              style={navButtonStyle(activePage === "tracker", theme)}
              onClick={() => setActivePage("tracker")}
            >
              Tracker
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
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <div style={statusBadgeStyle(status, theme)}>{status || "Ready"}</div>
          </div>
        </div>

        {activePage === "tracker" ? (
          <div style={gridStyle}>
            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>💊</div>
                  <h2 style={sectionTitleStyle(theme)}>Meds</h2>
                </div>
              </div>

              <p style={helperTextStyle(theme)}>Track each medication separately.</p>

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
                  {medTaken ? "Taken ✅" : "Not Taken ❌"}
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

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>🍽️</div>
                  <h2 style={sectionTitleStyle(theme)}>Food</h2>
                </div>
              </div>

              <p style={helperTextStyle(theme)}>Track what you ate and when.</p>

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

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>🛁</div>
                  <h2 style={sectionTitleStyle(theme)}>Hygiene</h2>
                </div>
              </div>
              <p style={helperTextStyle(theme)}>Quick check-off tasks.</p>

              <div style={buttonWrapStyle}>
                <button
                  style={showered ? successButtonStyle : softButtonStyle(theme)}
                  onClick={toggleShowered}
                >
                  {showered ? "Showered ✅" : "Shower"}
                </button>

                <button
                  style={brushedTeeth ? successButtonStyle : softButtonStyle(theme)}
                  onClick={toggleBrushedTeeth}
                >
                  {brushedTeeth ? "Brushed Teeth ✅" : "Brush Teeth"}
                </button>

                <button
                  style={skincare ? successButtonStyle : softButtonStyle(theme)}
                  onClick={toggleSkincare}
                >
                  {skincare ? "Skincare ✅" : "Skincare"}
                </button>
              </div>

              <div style={{ marginTop: "14px" }}>
                <p style={smallInfoStyle(theme)}>Shower: {showeredTime || "Not recorded"}</p>
                <p style={smallInfoStyle(theme)}>Brush teeth: {brushedTeethTime || "Not recorded"}</p>
                <p style={smallInfoStyle(theme)}>Skincare: {skincareTime || "Not recorded"}</p>
              </div>
            </section>

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>🌙</div>
                  <h2 style={sectionTitleStyle(theme)}>Sleep</h2>
                </div>
              </div>
              <p style={helperTextStyle(theme)}>Track bedtime and wake time.</p>

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
            </section>

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>✨</div>
                  <h2 style={sectionTitleStyle(theme)}>Mood</h2>
                </div>
              </div>
              <p style={sliderValueStyle(theme)}>Current: {mood}/5</p>
              <input
                style={rangeStyle}
                type="range"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => handleMoodChange(e.target.value)}
              />
            </section>

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>🕯️</div>
                  <h2 style={sectionTitleStyle(theme)}>Focus</h2>
                </div>
              </div>
              <p style={sliderValueStyle(theme)}>Current: {focus}/5</p>
              <input
                style={rangeStyle}
                type="range"
                min="1"
                max="5"
                value={focus}
                onChange={(e) => handleFocusChange(e.target.value)}
              />
            </section>

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>⚡</div>
                  <h2 style={sectionTitleStyle(theme)}>Energy</h2>
                </div>
              </div>
              <p style={sliderValueStyle(theme)}>Current: {energy}/5</p>
              <input
                style={rangeStyle}
                type="range"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => handleEnergyChange(e.target.value)}
              />
            </section>
          </div>
        ) : (
          <div style={chartsPageStyle}>
            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>📊</div>
                  <h2 style={sectionTitleStyle(theme)}>Mood / Focus / Energy Trends</h2>
                </div>
              </div>

              {chartData.length === 0 ? (
                <p style={emptyTextStyle(theme)}>No chart data yet.</p>
              ) : (
                <div style={chartBlockStyle}>
                  {chartData.map((item) => (
                    <div key={item.date} style={chartRowStyle(theme)}>
                      <div style={chartDateStyle(theme)}>{item.date}</div>

                      <div style={chartGroupStyle}>
                        <span style={chartLabelStyle(theme)}>Mood</span>
                        <div style={barTrackStyle(theme)}>
                          <div style={{ ...barFillStyle("#8b6fcb"), width: `${(item.mood / 5) * 100}%` }} />
                        </div>
                        <span style={chartValueStyle(theme)}>{item.mood}/5</span>
                      </div>

                      <div style={chartGroupStyle}>
                        <span style={chartLabelStyle(theme)}>Focus</span>
                        <div style={barTrackStyle(theme)}>
                          <div style={{ ...barFillStyle("#7ea5c9"), width: `${(item.focus / 5) * 100}%` }} />
                        </div>
                        <span style={chartValueStyle(theme)}>{item.focus}/5</span>
                      </div>

                      <div style={chartGroupStyle}>
                        <span style={chartLabelStyle(theme)}>Energy</span>
                        <div style={barTrackStyle(theme)}>
                          <div style={{ ...barFillStyle("#d6b26e"), width: `${(item.energy / 5) * 100}%` }} />
                        </div>
                        <span style={chartValueStyle(theme)}>{item.energy}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={featureCardStyle(theme)}>
              <div style={cardHeaderRowStyle}>
                <div>
                  <div style={emojiStyle}>🗂️</div>
                  <h2 style={sectionTitleStyle(theme)}>Meals / Meds / Hygiene Overview</h2>
                </div>
              </div>

              {chartData.length === 0 ? (
                <p style={emptyTextStyle(theme)}>No chart data yet.</p>
              ) : (
                <div style={chartBlockStyle}>
                  {chartData.map((item) => (
                    <div key={item.date} style={chartRowStyle(theme)}>
                      <div style={chartDateStyle(theme)}>{item.date}</div>

                      <div style={chartGroupStyle}>
                        <span style={chartLabelStyle(theme)}>Meals</span>
                        <div style={barTrackStyle(theme)}>
                          <div
                            style={{
                              ...barFillStyle("#c9996b"),
                              width: `${(item.mealsCount / maxMeals) * 100}%`,
                            }}
                          />
                        </div>
                        <span style={chartValueStyle(theme)}>{item.mealsCount}</span>
                      </div>

                      <div style={chartGroupStyle}>
                        <span style={chartLabelStyle(theme)}>Meds</span>
                        <div style={barTrackStyle(theme)}>
                          <div
                            style={{
                              ...barFillStyle("#c96b6b"),
                              width: `${(item.medsCount / maxMeds) * 100}%`,
                            }}
                          />
                        </div>
                        <span style={chartValueStyle(theme)}>{item.medsCount}</span>
                      </div>

                      <div style={chartGroupStyle}>
                        <span style={chartLabelStyle(theme)}>Hygiene</span>
                        <div style={barTrackStyle(theme)}>
                          <div
                            style={{
                              ...barFillStyle("#7fa68c"),
                              width: `${(item.hygieneCount / maxHygiene) * 100}%`,
                            }}
                          />
                        </div>
                        <span style={chartValueStyle(theme)}>{item.hygieneCount}/3</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

const mellowLightTheme = {
  pageBackground: "linear-gradient(180deg, #ebe7df 0%, #d8d2c6 100%)",
  heroBackground: "#f5f1e8",
  cardBackground: "#f8f5ee",
  text: "#2f2a24",
  subtleText: "#5b544a",
  faintText: "#7b7266",
  inputBackground: "#fffdf8",
  inputBorder: "#d6cfc2",
  itemBackground: "#f1ece3",
  softButtonBackground: "#e4ddd1",
  softButtonText: "#2f2a24",
  navInactive: "#9e9384",
  navActive: "#7d8f9f",
  toggleBackground: "#2f2a24",
  toggleText: "#fffaf2",
  primary: "#7d8f9f",
  primaryText: "#fffaf2",
  success: "#7e9b74",
  shadow: "0 10px 24px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.06)",
  track: "#ded8ce",
};

const mellowDarkTheme = {
  pageBackground: "linear-gradient(180deg, #2b2f36 0%, #23262d 100%)",
  heroBackground: "#353b44",
  cardBackground: "#3d444e",
  text: "#f4efe7",
  subtleText: "#ddd4c7",
  faintText: "#b7aea1",
  inputBackground: "#2b3038",
  inputBorder: "#4e5662",
  itemBackground: "#313740",
  softButtonBackground: "#505a67",
  softButtonText: "#f4efe7",
  navInactive: "#6a7481",
  navActive: "#8da2b6",
  toggleBackground: "#f4efe7",
  toggleText: "#2b2f36",
  primary: "#8da2b6",
  primaryText: "#1f2329",
  success: "#7ea06f",
  shadow: "0 10px 24px rgba(0,0,0,0.22)",
  border: "1px solid rgba(255,255,255,0.06)",
  track: "#4a5360",
};

const pageStyle = (theme) => ({
  minHeight: "100vh",
  background: theme.pageBackground,
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  color: theme.text,
});

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const heroCardStyle = (theme) => ({
  background: theme.heroBackground,
  borderRadius: "24px",
  padding: "24px",
  boxShadow: theme.shadow,
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  border: theme.border,
});

const featureCardStyle = (theme) => ({
  background: theme.cardBackground,
  borderRadius: "20px",
  padding: "20px",
  boxShadow: theme.shadow,
  border: theme.border,
});

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
  fontSize: "2rem",
  color: theme.text,
});

const tinyLabelStyle = (theme) => ({
  margin: "0 0 6px 0",
  color: theme.faintText,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
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
  fontSize: "1.4rem",
  marginBottom: "6px",
};

const sectionTitleStyle = (theme) => ({
  marginTop: 0,
  marginBottom: "8px",
  color: theme.text,
  fontSize: "1.25rem",
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
  backgroundColor: theme.inputBackground,
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem",
});

const primaryButtonStyle = (theme) => ({
  backgroundColor: theme.primary,
  color: theme.primaryText,
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
});

const softButtonStyle = (theme) => ({
  backgroundColor: theme.softButtonBackground,
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
  backgroundColor: active ? theme.navActive : theme.navInactive,
  color: "#fffaf2",
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
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
  backgroundColor: theme.toggleBackground,
  color: theme.toggleText,
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold",
});

const statusBadgeStyle = (status, theme) => ({
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  backgroundColor:
    status === "Saved"
      ? "rgba(126,160,111,0.22)"
      : status.includes("Error")
      ? "rgba(201,107,107,0.22)"
      : theme.softButtonBackground,
  color: theme.text,
});

const chartBlockStyle = {
  display: "grid",
  gap: "12px",
};

const chartRowStyle = (theme) => ({
  display: "grid",
  gap: "10px",
  padding: "14px",
  borderRadius: "14px",
  backgroundColor: theme.itemBackground,
});

const chartDateStyle = (theme) => ({
  fontWeight: "bold",
  color: theme.text,
});

const chartGroupStyle = {
  display: "grid",
  gridTemplateColumns: "70px 1fr 50px",
  gap: "10px",
  alignItems: "center",
};

const chartLabelStyle = (theme) => ({
  color: theme.subtleText,
  fontSize: "0.9rem",
});

const chartValueStyle = (theme) => ({
  color: theme.text,
  fontWeight: "bold",
  textAlign: "right",
});

const barTrackStyle = (theme) => ({
  width: "100%",
  height: "12px",
  backgroundColor: theme.track,
  borderRadius: "999px",
  overflow: "hidden",
});

const barFillStyle = (color) => ({
  height: "100%",
  backgroundColor: color,
  borderRadius: "999px",
});

export default App;