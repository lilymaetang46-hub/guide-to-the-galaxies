function TrackerTrackingPage({ app, pageKey }) {
  const {
    theme,
    sectionCardStyle,
    renderSectionHeader,
    trackerNavItems,
    setActivePage,
    inputStyle,
    primaryButtonStyle,
    countTextStyle,
    smallInfoStyle,
    medTaken,
    medsTime,
    successButtonStyle,
    softButtonStyle,
    toggleMed,
    emptyTextStyle,
    mealListStyle,
    meds,
    mealItemStyle,
    smallRemoveButtonStyle,
    removeMedication,
    medName,
    setMedName,
    medDose,
    setMedDose,
    medSymptoms,
    setMedSymptoms,
    medNotes,
    setMedNotes,
    addMedication,
    rowStyle,
    mealText,
    setMealText,
    addMeal,
    meals,
    removeMeal,
    sleepGridStyle,
    labelStyle,
    bedTime,
    handleBedTimeChange,
    wakeTime,
    handleWakeTimeChange,
    sleepRoutine,
    handleSleepRoutineChange,
    usedScreensBeforeBed,
    toggleUsedScreensBeforeBed,
    sliderValueStyle,
    sleepQuality,
    rangeStyle,
    handleSleepQualityChange,
    buttonWrapStyle,
    showered,
    toggleShowered,
    brushedTeeth,
    toggleBrushedTeeth,
    skincare,
    toggleSkincare,
    showeredTime,
    brushedTeethTime,
    skincareTime,
    laundryDone,
    toggleLaundry,
    bedsheetsDone,
    toggleBedsheets,
    roomCleaned,
    toggleRoomCleaned,
    laundryTime,
    bedsheetsTime,
    roomCleanedTime,
    cleaningMinutes,
    handleCleaningMinutesChange,
    cleaningWorthIt,
    handleCleaningWorthItChange,
    exerciseDone,
    toggleExerciseDone,
    extraWalk,
    toggleExtraWalk,
    exerciseTime,
    handleExerciseTimeChange,
    exerciseType,
    handleExerciseTypeChange,
    exerciseMinutes,
    handleExerciseMinutesChange,
    exerciseFeeling,
    handleExerciseFeelingChange,
    afterExerciseState,
    handleAfterExerciseStateChange,
    addExerciseLog,
    exerciseLogs,
    removeExerciseLog,
  } = app;

  const trackingSections = (trackerNavItems || []).filter((item) =>
    ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(item.key)
  );

  const sectionSwitcher = trackingSections.length > 1 ? (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "18px",
      }}
    >
      {trackingSections.map((item) => {
        const active = item.key === pageKey;
        return (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            style={{
              border: theme.trackerSolar ? "1px solid rgba(255, 193, 7, 0.28)" : theme.border,
              background: active
                ? theme.primary
                : theme.trackerSolar
                ? "rgba(255,255,255,0.34)"
                : theme.softButtonBackground,
              color: active ? theme.primaryText : theme.softButtonText,
              borderRadius: "999px",
              padding: "10px 14px",
              fontWeight: 700,
              fontSize: "0.88rem",
              letterSpacing: "0.04em",
              boxShadow: active ? `0 10px 24px ${theme.glow}` : "none",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  ) : null;

  if (pageKey === "meds") {
    return (
      <section className="galaxy-panel" style={sectionCardStyle(theme, "meds")}>
        {renderSectionHeader("Meds", "Track each medication separately.", "Sun", "Star")}
        {sectionSwitcher}
        <div style={{ display: "grid", gap: "10px" }}>
          <input style={inputStyle(theme)} type="text" placeholder="Medication name" value={medName} onChange={(e) => setMedName(e.target.value)} />
          <input style={inputStyle(theme)} type="text" placeholder="Dose" value={medDose} onChange={(e) => setMedDose(e.target.value)} />
          <input style={inputStyle(theme)} type="text" placeholder="Symptoms / side effects" value={medSymptoms} onChange={(e) => setMedSymptoms(e.target.value)} />
          <input style={inputStyle(theme)} type="text" placeholder="Notes" value={medNotes} onChange={(e) => setMedNotes(e.target.value)} />
          <button style={primaryButtonStyle(theme)} onClick={addMedication}>Add Medication</button>
        </div>
        <p style={countTextStyle(theme)}>Meds logged today: {meds.length}</p>
        <p style={smallInfoStyle(theme)}>Quick toggle: {medTaken ? `Taken at ${medsTime}` : "Not marked"}</p>
        <div style={{ marginTop: "10px" }}>
          <button style={medTaken ? successButtonStyle : softButtonStyle(theme)} onClick={toggleMed}>
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
                  <div style={{ fontWeight: "bold" }}>{med.name} {med.dose ? `- ${med.dose}` : ""}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Taken at {med.time}</div>
                  {med.symptoms && <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Symptoms: {med.symptoms}</div>}
                  {med.notes && <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Notes: {med.notes}</div>}
                </div>
                <button style={smallRemoveButtonStyle(theme)} onClick={() => removeMedication(index)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  if (pageKey === "food") {
    return (
      <section className="galaxy-panel" style={sectionCardStyle(theme, "food")}>
        {renderSectionHeader("Food", "Track what you ate and when.", "Glow", "Spark")}
        {sectionSwitcher}
        <div style={rowStyle}>
          <input style={inputStyle(theme)} type="text" placeholder="What did you eat?" value={mealText} onChange={(e) => setMealText(e.target.value)} />
          <button style={primaryButtonStyle(theme)} onClick={addMeal}>Add</button>
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
                  <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{meal.time}</div>
                </div>
                <button style={smallRemoveButtonStyle(theme)} onClick={() => removeMeal(index)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  if (pageKey === "sleep") {
    return (
      <section className="galaxy-panel" style={sectionCardStyle(theme, "sleep")}>
        {renderSectionHeader("Sleep", "Track bedtime and wake time.", "Moon", "Moon")}
        {sectionSwitcher}
        <div style={sleepGridStyle}>
          <div>
            <label style={labelStyle(theme)}>Bedtime</label>
            <input style={inputStyle(theme)} type="time" value={bedTime} onChange={(e) => handleBedTimeChange(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle(theme)}>Wake time</label>
            <input style={inputStyle(theme)} type="time" value={wakeTime} onChange={(e) => handleWakeTimeChange(e.target.value)} />
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
          <input style={rangeStyle} type="range" min="1" max="5" value={sleepQuality} onChange={(e) => handleSleepQualityChange(e.target.value)} />
        </div>
      </section>
    );
  }

  if (pageKey === "hygiene") {
    return (
      <section className="galaxy-panel" style={sectionCardStyle(theme, "maintenance")}>
        {renderSectionHeader("Hygiene", "Quick check-off hygiene tasks.", "Star", "Star")}
        {sectionSwitcher}
        <div style={buttonWrapStyle}>
          <button style={showered ? successButtonStyle : softButtonStyle(theme)} onClick={toggleShowered}>
            {showered ? "Showered Done" : "Shower"}
          </button>
          <button style={brushedTeeth ? successButtonStyle : softButtonStyle(theme)} onClick={toggleBrushedTeeth}>
            {brushedTeeth ? "Brushed Teeth Done" : "Brush Teeth"}
          </button>
          <button style={skincare ? successButtonStyle : softButtonStyle(theme)} onClick={toggleSkincare}>
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
  }

  if (pageKey === "cleaning") {
    return (
      <section className="galaxy-panel" style={sectionCardStyle(theme, "cleaning")}>
        {renderSectionHeader("Cleaning", "Track small cleaning wins.", "Comet", "Spark")}
        {sectionSwitcher}
        <div style={buttonWrapStyle}>
          <button style={laundryDone ? successButtonStyle : softButtonStyle(theme)} onClick={toggleLaundry}>
            {laundryDone ? "Laundry Done" : "Laundry"}
          </button>
          <button style={bedsheetsDone ? successButtonStyle : softButtonStyle(theme)} onClick={toggleBedsheets}>
            {bedsheetsDone ? "Bedsheets Done" : "Bedsheets"}
          </button>
          <button style={roomCleaned ? successButtonStyle : softButtonStyle(theme)} onClick={toggleRoomCleaned}>
            {roomCleaned ? "Room Cleaned Done" : "Room Cleaned"}
          </button>
        </div>
        <div style={{ marginTop: "14px" }}>
          <p style={smallInfoStyle(theme)}>Laundry: {laundryTime || "Not recorded"}</p>
          <p style={smallInfoStyle(theme)}>Bedsheets: {bedsheetsTime || "Not recorded"}</p>
          <p style={smallInfoStyle(theme)}>Room cleaned: {roomCleanedTime || "Not recorded"}</p>
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
          <input style={rangeStyle} type="range" min="1" max="5" value={cleaningWorthIt} onChange={(e) => handleCleaningWorthItChange(e.target.value)} />
        </div>
      </section>
    );
  }

  return (
    <section className="galaxy-panel" style={sectionCardStyle(theme, "exercise")}>
      {renderSectionHeader("Exercise", "Track movement and how it felt.", "Orbit", "Star")}
      {sectionSwitcher}
      <div style={buttonWrapStyle}>
        <button style={exerciseDone ? successButtonStyle : softButtonStyle(theme)} onClick={toggleExerciseDone}>
          {exerciseDone ? "Exercise Done" : "Mark Exercise"}
        </button>
        <button style={extraWalk ? successButtonStyle : softButtonStyle(theme)} onClick={toggleExtraWalk}>
          {extraWalk ? "Extra Walk Done" : "Extra Walk"}
        </button>
      </div>
      <div style={{ marginTop: "14px" }}>
        <p style={smallInfoStyle(theme)}>Exercise time: {exerciseTime || "Not recorded"}</p>
      </div>
      <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        <div>
          <label style={labelStyle(theme)}>Exercise time</label>
          <input style={inputStyle(theme)} type="text" placeholder="2:30 PM" value={exerciseTime} onChange={(e) => handleExerciseTimeChange(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle(theme)}>Exercise type</label>
          <input style={inputStyle(theme)} type="text" placeholder="Walk, stretch, yoga, etc." value={exerciseType} onChange={(e) => handleExerciseTypeChange(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle(theme)}>Exercise minutes</label>
          <input style={inputStyle(theme)} type="number" min="0" placeholder="Minutes exercised" value={exerciseMinutes} onChange={(e) => handleExerciseMinutesChange(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle(theme)}>How I felt after</label>
          <input style={inputStyle(theme)} type="text" placeholder="Calm, stronger, sweaty, etc." value={exerciseFeeling} onChange={(e) => handleExerciseFeelingChange(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle(theme)}>After exercise state</label>
          <input style={inputStyle(theme)} type="text" placeholder="Productive, tired, zombie, etc." value={afterExerciseState} onChange={(e) => handleAfterExerciseStateChange(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <button style={primaryButtonStyle(theme)} onClick={addExerciseLog}>Add Exercise Log</button>
      </div>
      {exerciseLogs.length === 0 ? (
        <p style={emptyTextStyle(theme)}>No exercise logs yet.</p>
      ) : (
        <ul style={mealListStyle}>
          {exerciseLogs.map((log, index) => (
            <li key={index} style={mealItemStyle(theme)}>
              <div>
                <div style={{ fontWeight: "bold" }}>{log.type || "Unnamed exercise"}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Time: {log.time || "Not recorded"}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Minutes: {log.minutes === "" || log.minutes == null ? "Not recorded" : log.minutes}
                </div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Felt after: {log.feeling || "Not recorded"}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Extra walk: {log.extraWalk ? "Yes" : "No"}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>State after: {log.afterState || "Not recorded"}</div>
              </div>
              <button style={smallRemoveButtonStyle(theme)} onClick={() => removeExerciseLog(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TrackerTrackingPage;
