function TrackerTrackingPage({ app, pageKey }) {
  const {
    theme,
    sectionCardStyle,
    renderSectionHeader,
    trackerNavItems,
    setActivePage,
    today,
    trackerSectionSwitcherButtonStyle,
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
    medEntryTime,
    setMedEntryTime,
    medSymptoms,
    setMedSymptoms,
    medNotes,
    setMedNotes,
    addMedication,
    handleMedsTimeChange,
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
    sleepGridStyle,
    labelStyle,
    tagGroupLabelStyle,
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
    handleShoweredTimeChange,
    handleBrushedTeethTimeChange,
    handleSkincareTimeChange,
    laundryDone,
    toggleLaundry,
    bedsheetsDone,
    toggleBedsheets,
    roomCleaned,
    toggleRoomCleaned,
    laundryTime,
    bedsheetsTime,
    roomCleanedTime,
    handleLaundryTimeChange,
    handleBedsheetsTimeChange,
    handleRoomCleanedTimeChange,
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

  const formatTimeLabel = (value) => {
    if (!value) return "Not recorded";
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match) return value;
    const hours = Number(match[1]);
    const minutes = match[2];
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${suffix}`;
  };

  const formatDateLabel = (value) => {
    if (!value) return "Not recorded";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const getCycleLengthLabel = (cycle) => {
    if (!cycle?.startDate) return "Length unknown";
    const now = new Date();
    const endDate =
      cycle.endDate ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;
    const length = Math.max(
      1,
      Math.floor((new Date(`${endDate}T12:00:00`) - new Date(`${cycle.startDate}T12:00:00`)) / 86400000) + 1
    );
    return `${length} day${length === 1 ? "" : "s"}`;
  };

  const periodSymptomOptions = ["Cramps", "Headache", "Fatigue", "Bloating", "Acne", "Back pain"];

  const actionTimeRowStyle = {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
    alignItems: "end",
  };

  const trackingSections = (trackerNavItems || []).filter((item) =>
    ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "todo", "period", "appointments", "mood"].includes(item.key)
  );
  const disableGalaxyFrame =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const trackerSectionStyle = (sectionKey) =>
    sectionCardStyle(theme, sectionKey, { disableCelestialFrame: disableGalaxyFrame });
  const trackerSummaryPanelStyle = {
    display: "grid",
    gap: "14px",
    padding: "16px",
    borderRadius: "22px",
    border: theme.border,
    background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
  };
  const trackerInfoChipStyle = (emphasis = false) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "36px",
    padding: "0.48rem 0.85rem",
    borderRadius: "999px",
    border: emphasis ? "none" : theme.border,
    background: emphasis
      ? theme.primary
      : theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.06)",
    color: emphasis ? theme.primaryText : theme.text,
    fontWeight: 700,
    fontSize: "0.9rem",
    letterSpacing: emphasis ? "0.01em" : "normal",
  });

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
            style={trackerSectionSwitcherButtonStyle(active, theme)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  ) : null;

  if (pageKey === "meds") {
    const hasDetailedMedicationDraft = Boolean(
      medName?.trim() || medDose?.trim() || medEntryTime || medSymptoms?.trim() || medNotes?.trim()
    );

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("meds")}>
        {renderSectionHeader("Meds", "Use the quick check-in first, then add a detailed medication log if you need it.", "Sun", "Star")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Quick medication check-in</p>
            <div style={trackerInfoChipStyle(true)}>
              {medTaken ? "Taken" : "Not marked"}
            </div>
          </div>
          <div style={actionTimeRowStyle}>
            <button style={medTaken ? successButtonStyle(theme) : softButtonStyle(theme)} onClick={toggleMed}>
              {medTaken ? "Taken" : "Not Taken"}
            </button>
            <input style={inputStyle(theme)} type="time" value={medsTime} onChange={(e) => handleMedsTimeChange(e.target.value)} />
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            {medTaken
              ? `Quick check-in saved for ${formatTimeLabel(medsTime)}.`
              : "Use this when you just want to mark that meds happened today."}
          </p>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Detailed medication log</p>
            <div style={trackerInfoChipStyle()}>{hasDetailedMedicationDraft ? "In progress" : "Optional"}</div>
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            <input style={inputStyle(theme)} type="text" placeholder="Medication name" value={medName} onChange={(e) => setMedName(e.target.value)} />
            <input style={inputStyle(theme)} type="text" placeholder="Dose" value={medDose} onChange={(e) => setMedDose(e.target.value)} />
            <input style={inputStyle(theme)} type="time" value={medEntryTime} onChange={(e) => setMedEntryTime(e.target.value)} />
            <input style={inputStyle(theme)} type="text" placeholder="Symptoms / side effects" value={medSymptoms} onChange={(e) => setMedSymptoms(e.target.value)} />
            <input style={inputStyle(theme)} type="text" placeholder="Notes" value={medNotes} onChange={(e) => setMedNotes(e.target.value)} />
            <button style={primaryButtonStyle(theme)} onClick={addMedication}>Add Medication</button>
          </div>
          <p style={smallInfoStyle(theme)}>
            Use the detailed log when you need the medication name, dose, symptoms, or notes saved separately.
          </p>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Today&apos;s medication entries</p>
            <div style={trackerInfoChipStyle()}>{`${meds.length} logged`}</div>
          </div>
          <p style={{ ...countTextStyle(theme), margin: 0 }}>Meds logged today: {meds.length}</p>
        {meds.length === 0 ? (
          <p style={emptyTextStyle(theme)}>No medications logged yet.</p>
        ) : (
          <ul style={mealListStyle}>
            {meds.map((med, index) => (
              <li key={index} style={mealItemStyle(theme)}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{med.name} {med.dose ? `- ${med.dose}` : ""}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Taken at {formatTimeLabel(med.time)}</div>
                  {med.symptoms && <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Symptoms: {med.symptoms}</div>}
                  {med.notes && <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Notes: {med.notes}</div>}
                </div>
                <button style={smallRemoveButtonStyle(theme)} onClick={() => removeMedication(index)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        </div>
      </section>
    );
  }

  if (pageKey === "food") {
    const hasMealDraft = Boolean(mealText?.trim() || mealTime);

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("food")}>
        {renderSectionHeader("Food", "Log what you ate first, then review today's entries below.", "Glow", "Spark")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Quick meal log</p>
            <div style={trackerInfoChipStyle(true)}>{hasMealDraft ? "In progress" : "Ready"}</div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <input style={inputStyle(theme)} type="text" placeholder="What did you eat?" value={mealText} onChange={(e) => setMealText(e.target.value)} />
            <input style={inputStyle(theme)} type="time" value={mealTime} onChange={(e) => handleMealTimeChange(e.target.value)} />
            <button style={primaryButtonStyle(theme)} onClick={addMeal}>Add</button>
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Keep this one simple: what you ate and when.
          </p>
        </div>
        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Today&apos;s meals</p>
            <div style={trackerInfoChipStyle()}>{`${meals.length} logged`}</div>
          </div>
          <p style={{ ...countTextStyle(theme), margin: 0 }}>Meals today: {meals.length}</p>
          {meals.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No meals added yet.</p>
          ) : (
            <ul style={mealListStyle}>
              {meals.map((meal, index) => (
                <li key={index} style={mealItemStyle(theme)}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{meal.text}</div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{formatTimeLabel(meal.time)}</div>
                  </div>
                  <button style={smallRemoveButtonStyle(theme)} onClick={() => removeMeal(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  if (pageKey === "todo") {
    const activeTodoItems = [...todoItems]
      .filter((item) => !item.completed)
      .sort((left, right) => {
        if (left.dueDate && right.dueDate) return left.dueDate.localeCompare(right.dueDate);
        if (left.dueDate) return -1;
        if (right.dueDate) return 1;
        return left.text.localeCompare(right.text);
      });
    const completedTodoItems = [...todoItems]
      .filter((item) => item.completed)
      .sort((left, right) => (right.completedAt || "").localeCompare(left.completedAt || ""));
    const completedTodoCount = completedTodoItems.length;
    const openTodoCount = activeTodoItems.length;
    const dueTodayCount = activeTodoItems.filter((item) => item.dueDate === today).length;
    const hasTodoDraft = Boolean(todoText?.trim() || todoDueDate || todoNote?.trim());

    const renderTodoItem = (item) => (
      <li
        key={item.id}
        style={{
          ...mealItemStyle(theme),
          opacity: item.completed ? 0.82 : 1,
        }}
      >
        <div style={{ display: "grid", gap: "6px" }}>
          <div
            style={{
              fontWeight: "bold",
              textDecoration: item.completed ? "line-through" : "none",
            }}
          >
            {item.text}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.72 }}>
            {item.dueDate
              ? `Due ${formatDateLabel(item.dueDate)}`
              : item.time
              ? `Planned for ${formatTimeLabel(item.time)}`
              : "No due date"}
            {item.completed && item.completedAt ? ` - Done at ${formatTimeLabel(item.completedAt)}` : ""}
          </div>
          {item.note ? <div style={{ fontSize: "0.88rem", opacity: 0.82 }}>{item.note}</div> : null}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            style={item.completed ? softButtonStyle(theme) : successButtonStyle(theme)}
            onClick={() => toggleTodoItem(item.id)}
          >
            {item.completed ? "Mark Open" : "Mark Done"}
          </button>
          <button style={smallRemoveButtonStyle(theme)} onClick={() => removeTodoItem(item.id)}>
            Remove
          </button>
        </div>
      </li>
    );

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("todo")}>
        {renderSectionHeader("To-Do", "Capture the next task, give it a due date if it helps, and keep active and done items separate.", "List", "Orbit")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Quick task add</p>
            <div style={trackerInfoChipStyle(true)}>{hasTodoDraft ? "In progress" : "Ready"}</div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <input
              style={inputStyle(theme)}
              type="text"
              placeholder="Add a task"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
            />
            <input
              style={inputStyle(theme)}
              type="date"
              value={todoDueDate}
              onChange={(e) => setTodoDueDate(e.target.value)}
            />
            <textarea
              style={{ ...inputStyle(theme), minHeight: "88px", resize: "vertical" }}
              placeholder="Optional note"
              value={todoNote}
              onChange={(e) => setTodoNote(e.target.value)}
            />
            <button style={primaryButtonStyle(theme)} onClick={addTodoItem}>
              Add Task
            </button>
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Keep this light: the task is the main thing. Due date and note are optional support, not requirements.
          </p>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Task summary</p>
            <div style={trackerInfoChipStyle()}>{`${completedTodoCount}/${todoItems.length} done`}</div>
            <div style={trackerInfoChipStyle()}>{`${openTodoCount} open`}</div>
            {dueTodayCount > 0 ? <div style={trackerInfoChipStyle()}>{`${dueTodayCount} due today`}</div> : null}
          </div>
          {todoItems.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No tasks added yet.</p>
          ) : (
            <>
              <div style={{ display: "grid", gap: "18px" }}>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                    <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Active tasks</p>
                    <div style={trackerInfoChipStyle()}>{openTodoCount === 0 ? "All clear" : `${openTodoCount} active`}</div>
                  </div>
                  {activeTodoItems.length === 0 ? (
                    <p style={emptyTextStyle(theme)}>No active tasks right now.</p>
                  ) : (
                    <ul style={mealListStyle}>{activeTodoItems.map(renderTodoItem)}</ul>
                  )}
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                    <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Completed tasks</p>
                    <div style={trackerInfoChipStyle()}>{completedTodoCount === 0 ? "Nothing done yet" : `${completedTodoCount} done`}</div>
                  </div>
                  {completedTodoItems.length === 0 ? (
                    <p style={emptyTextStyle(theme)}>Completed tasks will show up here.</p>
                  ) : (
                    <ul style={mealListStyle}>{completedTodoItems.map(renderTodoItem)}</ul>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  if (pageKey === "appointments") {
    const todayKey = formatDateLabel(today);
    const upcomingAppointments = (appointments || []).filter((item) => item.eventDate >= today);
    const pastAppointments = (appointments || []).filter((item) => item.eventDate < today).slice().reverse();
    const todayAppointments = upcomingAppointments.filter((item) => item.eventDate === today);
    const hasAppointmentDraft = Boolean(
      editingAppointmentId ||
        appointmentTitle?.trim() ||
        appointmentTime ||
        appointmentLocation?.trim() ||
        appointmentNote?.trim()
    );
    const appointmentActionLabel = editingAppointmentId
      ? `Save ${appointmentType === "reminder" ? "Reminder" : "Appointment"}`
      : `Add ${appointmentType === "reminder" ? "Reminder" : "Appointment"}`;

    const renderAppointmentList = (items, emptyMessage) =>
      items.length === 0 ? (
        <p style={emptyTextStyle(theme)}>{emptyMessage}</p>
      ) : (
        <ul style={mealListStyle}>
          {items.map((item) => (
            <li key={item.id} style={mealItemStyle(theme)}>
              <div style={{ display: "grid", gap: "4px" }}>
                <div style={{ fontWeight: "bold" }}>{item.title}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.76 }}>
                  {`${item.itemType === "reminder" ? "Reminder" : "Appointment"} · ${formatDateLabel(item.eventDate)} at ${formatTimeLabel(item.eventTime)}`}
                </div>
                <div style={{ fontSize: "0.85rem", opacity: 0.76 }}>
                  {item.location ? `Location: ${item.location}` : "No location saved"}
                </div>
              </div>
              <div style={{ display: "grid", gap: "8px", justifyItems: "end" }}>
                <div style={{ ...smallInfoStyle(theme), maxWidth: "20rem", margin: 0 }}>
                  {item.note || "No note saved"}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button style={softButtonStyle(theme)} onClick={() => startEditingAppointment(item.id)}>
                    Edit
                  </button>
                  <button style={smallRemoveButtonStyle(theme)} onClick={() => removeAppointment(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      );

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("appointments")}>
        {renderSectionHeader("Appointments", "Add appointments or reminders without turning this into a heavy calendar. Keep only what you need.", "Signal", "Orbit")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Quick plan add</p>
            <div style={trackerInfoChipStyle(true)}>
              {editingAppointmentId ? "Editing" : hasAppointmentDraft ? "In progress" : "Ready"}
            </div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <label style={labelStyle(theme)}>Type</label>
              <select style={inputStyle(theme)} value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
                <option value="appointment">appointment</option>
                <option value="reminder">reminder</option>
              </select>
            </div>
            <div>
              <label style={labelStyle(theme)}>Title</label>
              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="Therapy, dentist, call pharmacy, pay rent..."
                value={appointmentTitle}
                onChange={(e) => setAppointmentTitle(e.target.value)}
              />
            </div>
            <div style={sleepGridStyle}>
              <div>
                <label style={labelStyle(theme)}>Date</label>
                <input style={inputStyle(theme)} type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle(theme)}>Time</label>
                <input style={inputStyle(theme)} type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle(theme)}>Location</label>
              <input
                style={inputStyle(theme)}
                type="text"
                placeholder="Optional location"
                value={appointmentLocation}
                onChange={(e) => setAppointmentLocation(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle(theme)}>Note</label>
              <textarea
                style={{ ...inputStyle(theme), minHeight: "96px", resize: "vertical" }}
                placeholder="Optional note"
                value={appointmentNote}
                onChange={(e) => setAppointmentNote(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={primaryButtonStyle(theme)}
                onClick={editingAppointmentId ? updateAppointment : addAppointment}
              >
                {appointmentActionLabel}
              </button>
              {editingAppointmentId ? (
                <button style={softButtonStyle(theme)} onClick={cancelAppointmentEdit}>
                  Cancel Edit
                </button>
              ) : null}
              <div style={trackerInfoChipStyle()}>{todayAppointments.length > 0 ? `${todayAppointments.length} today` : `${upcomingAppointments.length} upcoming`}</div>
            </div>
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Date and time are required. Location and note are optional so this can stay lighter than a full calendar.
          </p>
          {appointmentStatusMessage ? <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>{appointmentStatusMessage}</p> : null}
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Upcoming</p>
            <div style={trackerInfoChipStyle()}>{`${upcomingAppointments.length} upcoming`}</div>
            <div style={trackerInfoChipStyle()}>{todayAppointments.length > 0 ? `Today: ${todayAppointments.length}` : `Today: 0`}</div>
          </div>
          {renderAppointmentList(upcomingAppointments, "No upcoming appointments or reminders yet.")}
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Past</p>
            <div style={trackerInfoChipStyle()}>{`${pastAppointments.length} archived`}</div>
          </div>
          {renderAppointmentList(pastAppointments, "No past plans yet.")}
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Today is {todayKey}. Past items stay available for reference until you remove them.
          </p>
        </div>
      </section>
    );
  }

  if (pageKey === "period") {
    const hasDraftSymptoms = periodSymptomTags.length > 0 || periodPrivateNotes?.trim();

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("period")}>
        {renderSectionHeader("Period", "Keep this private by default. Track the cycle dates first, then add symptoms or notes only if they help.", "Moon", "Orbit")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Cycle status</p>
            <div style={trackerInfoChipStyle(true)}>
              {activePeriodCycle ? `Day ${getCycleLengthLabel(activePeriodCycle).split(" ")[0]}` : "Private"}
            </div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <label style={labelStyle(theme)}>{activePeriodCycle ? "Period start" : "Start date"}</label>
              <input
                style={inputStyle(theme)}
                type="date"
                value={periodStartDate}
                onChange={(e) => setPeriodStartDate(e.target.value)}
                disabled={Boolean(activePeriodCycle)}
              />
            </div>
            {activePeriodCycle ? (
              <div>
                <label style={labelStyle(theme)}>Period end</label>
                <input
                  style={inputStyle(theme)}
                  type="date"
                  value={periodEndDate}
                  onChange={(e) => setPeriodEndDate(e.target.value)}
                />
              </div>
            ) : null}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={primaryButtonStyle(theme)} onClick={activePeriodCycle ? endPeriodCycle : startPeriodCycle}>
                {activePeriodCycle ? "Mark Period Ended" : "Mark Period Started"}
              </button>
              {activePeriodCycle ? (
                <div style={trackerInfoChipStyle()}>{`${getCycleLengthLabel(activePeriodCycle)} active`}</div>
              ) : nextCycleEstimateDate ? (
                <div style={trackerInfoChipStyle()}>{`Next estimate ${formatDateLabel(nextCycleEstimateDate)}`}</div>
              ) : null}
            </div>
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            {activePeriodCycle
              ? `Started ${formatDateLabel(activePeriodCycle.startDate)}. History stays private unless you choose otherwise later.`
              : "This tracker uses dedicated private storage and is not shared with outsiders by default."}
          </p>
          {periodStatusMessage ? <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>{periodStatusMessage}</p> : null}
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Flow and symptoms</p>
            <div style={trackerInfoChipStyle()}>{hasDraftSymptoms ? "Added" : "Optional"}</div>
          </div>
          <div>
            <label style={labelStyle(theme)}>Flow level</label>
            <select style={inputStyle(theme)} value={periodFlowLevel} onChange={(e) => setPeriodFlowLevel(e.target.value)}>
              <option value="light">light</option>
              <option value="medium">medium</option>
              <option value="heavy">heavy</option>
            </select>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {periodSymptomOptions.map((symptom) => {
              const selected = periodSymptomTags.includes(symptom);
              return (
                <button
                  key={symptom}
                  style={selected ? successButtonStyle(theme) : softButtonStyle(theme)}
                  onClick={() => togglePeriodSymptomTag(symptom)}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
          <div>
            <label style={labelStyle(theme)}>Private notes</label>
            <textarea
              style={{ ...inputStyle(theme), minHeight: "110px", resize: "vertical" }}
              placeholder="Private notes for this cycle"
              value={periodPrivateNotes}
              onChange={(e) => setPeriodPrivateNotes(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={primaryButtonStyle(theme)}
              onClick={activePeriodCycle ? savePeriodNotesAndSymptoms : startPeriodCycle}
            >
              {activePeriodCycle ? "Save Cycle Details" : "Start With These Details"}
            </button>
            {nextCycleEstimateDate ? (
              <div style={trackerInfoChipStyle()}>{`Average cycle ${averageCycleLengthDays} days`}</div>
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Cycle history</p>
            <div style={trackerInfoChipStyle()}>{`${periodCycles.length} saved`}</div>
          </div>
          {periodCycles.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No cycle history yet.</p>
          ) : (
            <ul style={mealListStyle}>
              {periodCycles.map((cycle) => (
                <li key={cycle.id} style={mealItemStyle(theme)}>
                  <div style={{ display: "grid", gap: "4px" }}>
                    <div style={{ fontWeight: "bold" }}>
                      {formatDateLabel(cycle.startDate)}
                      {cycle.endDate ? ` to ${formatDateLabel(cycle.endDate)}` : " to now"}
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.76 }}>
                      {`${getCycleLengthLabel(cycle)} · ${cycle.flowLevel} flow`}
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.76 }}>
                      {cycle.symptomTags.length > 0 ? cycle.symptomTags.join(", ") : "No symptoms saved"}
                    </div>
                  </div>
                  <div style={{ ...smallInfoStyle(theme), maxWidth: "20rem" }}>
                    {cycle.privateNotes || "No private notes"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  if (pageKey === "sleep") {
    const sleepQualityValue = Number(sleepQuality);
    const sleepQualityTone =
      sleepQualityValue >= 5
        ? "Rested"
        : sleepQualityValue >= 4
        ? "Pretty good"
        : sleepQualityValue >= 3
        ? "Okay"
        : sleepQualityValue >= 2
        ? "Rough"
        : "Exhausted";
    const sleepQualityLabels = [
      { value: 1, label: "Exhausted" },
      { value: 2, label: "Rough" },
      { value: 3, label: "Okay" },
      { value: 4, label: "Pretty good" },
      { value: 5, label: "Rested" },
    ];
    const hasOptionalSleepDetails = Boolean(sleepRoutine?.trim()) || usedScreensBeforeBed;

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("sleep")}>
        {renderSectionHeader("Sleep", "Log the basics first, then add optional context if you want.", "Moon", "Moon")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Sleep check-in</p>
            <div style={trackerInfoChipStyle(true)}>{sleepQualityTone}</div>
          </div>
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
          <div>
            <p style={{ ...sliderValueStyle(theme), marginBottom: "8px" }}>{`Sleep quality: ${sleepQuality}/5`}</p>
            <input style={rangeStyle(theme)} type="range" min="1" max="5" value={sleepQuality} onChange={(e) => handleSleepQualityChange(e.target.value)} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: "8px",
                marginTop: "8px",
                color: theme.faintText,
                fontSize: "0.78rem",
                textAlign: "center",
              }}
            >
              {sleepQualityLabels.map((item) => (
                <span
                  key={item.value}
                  style={{
                    opacity: item.value === sleepQualityValue ? 1 : 0.74,
                    fontWeight: item.value === sleepQualityValue ? 700 : 500,
                    color: item.value === sleepQualityValue ? theme.text : theme.faintText,
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Bedtime, wake time, and quality are the main sleep check-in. Extra context is optional.
          </p>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Optional sleep details</p>
            <div style={trackerInfoChipStyle()}>{hasOptionalSleepDetails ? "Added" : "Not added"}</div>
          </div>
          <button
            style={usedScreensBeforeBed ? successButtonStyle(theme) : softButtonStyle(theme)}
            onClick={toggleUsedScreensBeforeBed}
          >
            {usedScreensBeforeBed ? "Screens Before Bed Logged" : "Used Screens Before Bed"}
          </button>
          <div>
            <label style={labelStyle(theme)}>Sleep routine</label>
            <textarea
              style={{ ...inputStyle(theme), minHeight: "90px", resize: "vertical" }}
              placeholder="What helped you wind down before bed?"
              value={sleepRoutine}
              onChange={(e) => handleSleepRoutineChange(e.target.value)}
            />
          </div>
          <p style={smallInfoStyle(theme)}>
            {hasOptionalSleepDetails
              ? "Your extra sleep context is saved below the core check-in."
              : "Add routine notes or screen use only when it helps explain the night."}
          </p>
        </div>
      </section>
    );
  }

  if (pageKey === "hygiene") {
    const hygieneItems = [
      {
        key: "shower",
        label: "Shower",
        done: showered,
        time: showeredTime,
        toggle: toggleShowered,
        onTimeChange: handleShoweredTimeChange,
      },
      {
        key: "brush",
        label: "Brush Teeth",
        done: brushedTeeth,
        time: brushedTeethTime,
        toggle: toggleBrushedTeeth,
        onTimeChange: handleBrushedTeethTimeChange,
      },
      {
        key: "skincare",
        label: "Skincare",
        done: skincare,
        time: skincareTime,
        toggle: toggleSkincare,
        onTimeChange: handleSkincareTimeChange,
      },
    ];
    const completedHygieneCount = hygieneItems.filter((item) => item.done).length;

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("maintenance")}>
        {renderSectionHeader("Hygiene", "Tap off the basics first, then add times if you want them.", "Star", "Star")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Hygiene checklist</p>
            <div style={trackerInfoChipStyle(true)}>{`${completedHygieneCount}/3 done`}</div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {hygieneItems.map((item) => (
              <div key={item.key} style={actionTimeRowStyle}>
                <button
                  style={item.done ? successButtonStyle(theme) : softButtonStyle(theme)}
                  onClick={item.toggle}
                >
                  {item.done ? `${item.label} Done` : item.label}
                </button>
                <input
                  style={inputStyle(theme)}
                  type="time"
                  value={item.time}
                  onChange={(e) => item.onTimeChange(e.target.value)}
                  aria-label={`${item.label} time`}
                />
              </div>
            ))}
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Mark the task first. Time is optional and only there if it helps you remember the day.
          </p>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Today at a glance</p>
            <div style={trackerInfoChipStyle()}>{completedHygieneCount === 3 ? "Complete" : "Still in progress"}</div>
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {hygieneItems.map((item) => (
              <p key={item.key} style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
                {item.label}: {item.done ? formatTimeLabel(item.time) : "Not done yet"}
              </p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (pageKey === "cleaning") {
    const cleaningItems = [
      {
        key: "laundry",
        label: "Laundry",
        done: laundryDone,
        time: laundryTime,
        toggle: toggleLaundry,
        onTimeChange: handleLaundryTimeChange,
      },
      {
        key: "bedsheets",
        label: "Bedsheets",
        done: bedsheetsDone,
        time: bedsheetsTime,
        toggle: toggleBedsheets,
        onTimeChange: handleBedsheetsTimeChange,
      },
      {
        key: "room",
        label: "Room Cleaned",
        done: roomCleaned,
        time: roomCleanedTime,
        toggle: toggleRoomCleaned,
        onTimeChange: handleRoomCleanedTimeChange,
      },
    ];
    const completedCleaningCount = cleaningItems.filter((item) => item.done).length;
    const cleaningWorthItValue = Number(cleaningWorthIt);
    const cleaningWorthItTone =
      cleaningWorthItValue >= 5
        ? "Very worth it"
        : cleaningWorthItValue >= 4
        ? "Worth it"
        : cleaningWorthItValue >= 3
        ? "Neutral"
        : cleaningWorthItValue >= 2
        ? "Mixed"
        : "Not worth it";
    const cleaningWorthItLabels = [
      { value: 1, label: "Not worth it" },
      { value: 2, label: "Mixed" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Worth it" },
      { value: 5, label: "Very worth it" },
    ];
    const hasCleaningReflection = cleaningMinutes !== "" || cleaningWorthItValue !== 3;

    return (
      <section className="galaxy-panel" style={trackerSectionStyle("cleaning")}>
        {renderSectionHeader("Cleaning", "Log the small wins first, then add reflection only if it helps.", "Comet", "Spark")}
        {sectionSwitcher}
        <div style={trackerSummaryPanelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Cleaning wins</p>
            <div style={trackerInfoChipStyle(true)}>{`${completedCleaningCount}/3 done`}</div>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {cleaningItems.map((item) => (
              <div key={item.key} style={actionTimeRowStyle}>
                <button
                  style={item.done ? successButtonStyle(theme) : softButtonStyle(theme)}
                  onClick={item.toggle}
                >
                  {item.done ? `${item.label} Done` : item.label}
                </button>
                <input
                  style={inputStyle(theme)}
                  type="time"
                  value={item.time}
                  onChange={(e) => item.onTimeChange(e.target.value)}
                  aria-label={`${item.label} time`}
                />
              </div>
            ))}
          </div>
          <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
            Count the task as the main win. Time is optional if you want a clearer memory of when it happened.
          </p>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Today at a glance</p>
            <div style={trackerInfoChipStyle()}>{completedCleaningCount === 3 ? "Complete" : "Still in progress"}</div>
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {cleaningItems.map((item) => (
              <p key={item.key} style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
                {item.label}: {item.done ? formatTimeLabel(item.time) : "Not done yet"}
              </p>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Optional reflection</p>
            <div style={trackerInfoChipStyle()}>{hasCleaningReflection ? "Added" : cleaningWorthItTone}</div>
          </div>
          <div>
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
          <div>
            <p style={{ ...sliderValueStyle(theme), marginBottom: "8px" }}>{`Worth it: ${cleaningWorthIt}/5`}</p>
            <input style={rangeStyle(theme)} type="range" min="1" max="5" value={cleaningWorthIt} onChange={(e) => handleCleaningWorthItChange(e.target.value)} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: "8px",
                marginTop: "8px",
                color: theme.faintText,
                fontSize: "0.78rem",
                textAlign: "center",
              }}
            >
              {cleaningWorthItLabels.map((item) => (
                <span
                  key={item.value}
                  style={{
                    opacity: item.value === cleaningWorthItValue ? 1 : 0.74,
                    fontWeight: item.value === cleaningWorthItValue ? 700 : 500,
                    color: item.value === cleaningWorthItValue ? theme.text : theme.faintText,
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <p style={smallInfoStyle(theme)}>
            Minutes and "worth it" are still saved, but they live here so the quick cleaning wins stay front and center.
          </p>
        </div>
      </section>
    );
  }

  const hasExerciseDraft = Boolean(
    exerciseTime || exerciseType?.trim() || exerciseMinutes !== "" || exerciseFeeling?.trim() || afterExerciseState?.trim()
  );

  return (
    <section className="galaxy-panel" style={trackerSectionStyle("exercise")}>
      {renderSectionHeader("Exercise", "Use the quick movement check-in first, then add a detailed log when you want more context.", "Orbit", "Star")}
      {sectionSwitcher}
      <div style={trackerSummaryPanelStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ ...sliderValueStyle(theme), margin: 0 }}>Quick movement check-in</p>
          <div style={trackerInfoChipStyle(true)}>
            {exerciseDone ? "Exercise marked" : "Not marked"}
          </div>
        </div>
        <div style={buttonWrapStyle}>
          <button style={exerciseDone ? successButtonStyle(theme) : softButtonStyle(theme)} onClick={toggleExerciseDone}>
            {exerciseDone ? "Exercise Done" : "Mark Exercise"}
          </button>
          <button style={extraWalk ? successButtonStyle(theme) : softButtonStyle(theme)} onClick={toggleExtraWalk}>
            {extraWalk ? "Extra Walk Done" : "Extra Walk"}
          </button>
        </div>
        <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
          {exerciseDone
            ? `Movement marked${exerciseTime ? ` at ${formatTimeLabel(exerciseTime)}` : ""}.`
            : "Use this when you just want to note that movement happened."}
        </p>
      </div>

      <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Detailed exercise log</p>
          <div style={trackerInfoChipStyle()}>{hasExerciseDraft ? "In progress" : "Optional"}</div>
        </div>
        <div style={{ display: "grid", gap: "12px" }}>
          <div>
            <label style={labelStyle(theme)}>Exercise time</label>
            <input style={inputStyle(theme)} type="time" value={exerciseTime} onChange={(e) => handleExerciseTimeChange(e.target.value)} />
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
        <div>
          <button style={primaryButtonStyle(theme)} onClick={addExerciseLog}>Add Exercise Log</button>
        </div>
        <p style={smallInfoStyle(theme)}>
          Use the detailed log when you want to keep the time, type, minutes, and how the workout felt.
        </p>
      </div>

      <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Today&apos;s exercise entries</p>
          <div style={trackerInfoChipStyle()}>{`${exerciseLogs.length} logged`}</div>
        </div>
        {exerciseLogs.length === 0 ? (
          <p style={emptyTextStyle(theme)}>No exercise logs yet.</p>
        ) : (
          <ul style={mealListStyle}>
            {exerciseLogs.map((log, index) => (
              <li key={index} style={mealItemStyle(theme)}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{log.type || "Unnamed exercise"}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Time: {formatTimeLabel(log.time)}</div>
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
      </div>
    </section>
  );
}

export default TrackerTrackingPage;

