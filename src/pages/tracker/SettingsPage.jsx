function TrackerSettingsPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    sectionCardStyle,
    renderSectionHeader,
    goalFormGridStyle,
    labelStyle,
    inputStyle,
    displayName,
    setDisplayName,
    secondaryDisplayName,
    setSecondaryDisplayName,
    user,
    themeFamily,
    setThemeFamily,
    themeToggleStyle,
    darkMode,
    setDarkMode,
    primaryButtonStyle,
    saveProfileSettings,
    currentPinInput,
    setCurrentPinInput,
    newPinInput,
    setNewPinInput,
    confirmNewPinInput,
    setConfirmNewPinInput,
    changePin,
    softButtonStyle,
    handleLogout,
    renderFeedbackMessage,
    settingsMessage,
    connectionsMessage,
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
    googleCalendarConnection,
    googleCalendarSyncStats,
    googleCalendarCalendars,
    googleCalendarAuthLoading,
    googleCalendarSyncing,
    startGoogleCalendarOAuth,
    refreshGoogleCalendarChoices,
    syncGoogleCalendarNow,
    updateGoogleCalendarSetting,
    markGoogleCalendarReady,
    disableGoogleCalendarSync,
    selectedTrackingAreaOptions,
    inactiveTrackingAreaOptions,
    showAddTrackingAreaPicker,
    setShowAddTrackingAreaPicker,
    trackingAreaToAdd,
    setTrackingAreaToAdd,
    addTrackedArea,
    trackingAreasMessage,
    startTrackerTutorial,
    showTrackerTutorial,
  } = app;
  const disableGalaxyFrame =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const sectionStyle = (sectionKey) =>
    sectionCardStyle(theme, sectionKey, { disableCelestialFrame: disableGalaxyFrame });
  const googleSyncStatusLabel =
    googleCalendarConnection.status === "ready"
      ? "Ready"
      : googleCalendarConnection.status === "syncing"
      ? "Syncing"
      : googleCalendarConnection.status === "disabled"
      ? "Paused"
      : googleCalendarConnection.status === "error"
      ? "Needs attention"
      : "Setup";
  const googleSyncStatusNote =
    googleCalendarConnection.status === "ready"
      ? `Connected${googleCalendarConnection.externalAccountEmail ? ` as ${googleCalendarConnection.externalAccountEmail}` : ""}.`
      : googleCalendarConnection.status === "disabled"
      ? "Google Calendar sync is saved but currently turned off."
      : "Connect Google here, choose a calendar, and control what syncs out from the app.";
  const googleLastSyncedStamp = googleCalendarConnection.lastSyncedAt
    ? new Date(googleCalendarConnection.lastSyncedAt).getTime()
    : 0;
  const googleConnectedStamp = googleCalendarConnection.connectedAt
    ? new Date(googleCalendarConnection.connectedAt).getTime()
    : 0;
  const showConnectedDate =
    googleConnectedStamp > 0 &&
    (!googleLastSyncedStamp || googleConnectedStamp >= googleLastSyncedStamp);
  const googleStatusDateLabel = showConnectedDate ? "Connected" : "Last event sync";
  const googleStatusDateValue = showConnectedDate
    ? new Date(googleCalendarConnection.connectedAt).toLocaleString()
    : googleCalendarConnection.lastSyncedAt
    ? new Date(googleCalendarConnection.lastSyncedAt).toLocaleString()
    : "No event sync yet";
  const shouldShowSyncDiagnostics =
    googleCalendarSyncStats.pending > 0 ||
    googleCalendarSyncStats.failed > 0 ||
    googleCalendarSyncStats.synced > 0;
  const hasGoogleCalendarChoices = googleCalendarCalendars.length > 0;

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionStyle("signals")}>
        {renderSectionHeader("Settings", "Update your profile, theme, and security details here.", "Halo", "Moon")}
        <div style={goalFormGridStyle}>
          <div>
            <label style={labelStyle(theme)}>Display name</label>
            <input style={inputStyle(theme)} type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" />
          </div>
          <div>
            <label style={labelStyle(theme)}>Secondary display name</label>
            <input style={inputStyle(theme)} type="text" value={secondaryDisplayName} onChange={(e) => setSecondaryDisplayName(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label style={labelStyle(theme)}>Theme family</label>
            <select style={inputStyle(theme)} value={themeFamily} onChange={(e) => setThemeFamily(e.target.value)}>
              <option value="galaxy">galaxy</option>
              <option value="underwater">underwater</option>
              <option value="forest">forest</option>
            </select>
          </div>
          <div>
            <label style={labelStyle(theme)}>Current mode</label>
            <button style={themeToggleStyle(theme)} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Solar Mode" : "Galaxy Mode"}
            </button>
          </div>
        </div>
        <div style={{ marginTop: "18px" }}>
          <button style={primaryButtonStyle(theme)} onClick={saveProfileSettings}>Save Profile Settings</button>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionStyle("calendar")}>
        {renderSectionHeader(
          "Google Calendar",
          "Manage your Google Calendar connection and choose what this app syncs out.",
          "Calendar",
          "Orbit"
        )}
        <div style={{ display: "grid", gap: "14px", padding: "16px", borderRadius: "22px", border: theme.border, background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, color: theme.subtleText, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.78rem" }}>Connection</p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "34px",
                padding: "0.44rem 0.8rem",
                borderRadius: "999px",
                border: googleCalendarConnection.status === "ready" ? "none" : theme.border,
                background:
                  googleCalendarConnection.status === "ready"
                    ? theme.primary
                    : theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.06)",
                color: googleCalendarConnection.status === "ready" ? theme.primaryText : theme.text,
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              {googleSyncStatusLabel}
            </div>
          </div>
          <p style={{ margin: 0, color: theme.subtleText, lineHeight: 1.6 }}>{googleSyncStatusNote}</p>
          {renderFeedbackMessage(connectionsMessage, theme)}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={primaryButtonStyle(theme)} onClick={startGoogleCalendarOAuth} disabled={googleCalendarAuthLoading}>
              {googleCalendarAuthLoading ? "Opening Google..." : "Connect Google"}
            </button>
            <button
              style={softButtonStyle(theme)}
              onClick={refreshGoogleCalendarChoices}
              disabled={
                googleCalendarAuthLoading ||
                googleCalendarSyncing ||
                googleCalendarConnection.status === "needs_setup"
              }
            >
              {googleCalendarAuthLoading ? "Refreshing..." : "Refresh Calendars"}
            </button>
            <button
              style={softButtonStyle(theme)}
              onClick={() => syncGoogleCalendarNow()}
              disabled={
                googleCalendarAuthLoading ||
                googleCalendarSyncing ||
                googleCalendarConnection.status === "disabled" ||
                googleCalendarConnection.status === "needs_setup"
              }
            >
              {googleCalendarSyncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
          <div style={goalFormGridStyle}>
            <div>
              <label style={labelStyle(theme)}>Google account email</label>
              <input
                style={inputStyle(theme)}
                type="email"
                value={googleCalendarConnection.externalAccountEmail}
                onChange={(e) => updateGoogleCalendarSetting("externalAccountEmail", e.target.value)}
                placeholder="name@gmail.com"
              />
            </div>
            <div>
              <label style={labelStyle(theme)}>Destination calendar</label>
              {hasGoogleCalendarChoices ? (
                <select
                  style={inputStyle(theme)}
                  value={googleCalendarConnection.externalCalendarId}
                  onChange={(e) => {
                    const selected = googleCalendarCalendars.find((item) => item.id === e.target.value);
                    updateGoogleCalendarSetting("externalCalendarId", e.target.value);
                    updateGoogleCalendarSetting("externalCalendarName", selected?.summary || "");
                  }}
                >
                  <option value="">Choose a calendar</option>
                  {googleCalendarCalendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar.primary ? `${calendar.summary} (Primary)` : calendar.summary}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  style={inputStyle(theme)}
                  type="text"
                  value={googleCalendarConnection.externalCalendarName}
                  onChange={(e) => updateGoogleCalendarSetting("externalCalendarName", e.target.value)}
                  placeholder="Primary calendar"
                />
              )}
            </div>
            <div>
              <label style={labelStyle(theme)}>Destination calendar ID</label>
              <input
                style={inputStyle(theme)}
                type="text"
                value={googleCalendarConnection.externalCalendarId}
                onChange={(e) => updateGoogleCalendarSetting("externalCalendarId", e.target.value)}
                placeholder="Optional until calendar picker loads"
              />
            </div>
          </div>
          {hasGoogleCalendarChoices ? (
            <p style={{ margin: 0, color: theme.subtleText, lineHeight: 1.6 }}>
              Google returned {googleCalendarCalendars.length} calendar choice{googleCalendarCalendars.length === 1 ? "" : "s"} for this account.
            </p>
          ) : null}
          <div>
            <label style={labelStyle(theme)}>Sync out from the app</label>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
              {[
                ["syncAppointments", "Appointments"],
                ["syncReminders", "Reminders"],
                ["syncDatedTodos", "Dated to-dos"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    borderRadius: "16px",
                    border: theme.border,
                    background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
                    color: theme.text,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={googleCalendarConnection[key]}
                    onChange={(e) => updateGoogleCalendarSetting(key, e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: theme.trackerAccent || theme.success, cursor: "pointer", flex: "0 0 auto" }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            <div style={{ padding: "14px", borderRadius: "18px", border: theme.border, background: theme.cardBackground }}>
              <div style={{ color: theme.subtleText, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{googleStatusDateLabel}</div>
              <div style={{ color: theme.text, marginTop: "6px" }}>{googleStatusDateValue}</div>
            </div>
            {shouldShowSyncDiagnostics ? (
              <div style={{ padding: "14px", borderRadius: "18px", border: theme.border, background: theme.cardBackground }}>
                <div style={{ color: theme.subtleText, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Pending sync items</div>
                <div style={{ color: theme.text, marginTop: "6px" }}>{googleCalendarSyncStats.pending}</div>
              </div>
            ) : null}
            {shouldShowSyncDiagnostics ? (
              <div style={{ padding: "14px", borderRadius: "18px", border: theme.border, background: theme.cardBackground }}>
                <div style={{ color: theme.subtleText, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Synced items</div>
                <div style={{ color: theme.text, marginTop: "6px" }}>{googleCalendarSyncStats.synced}</div>
              </div>
            ) : null}
            {shouldShowSyncDiagnostics ? (
              <div style={{ padding: "14px", borderRadius: "18px", border: theme.border, background: theme.cardBackground }}>
                <div style={{ color: theme.subtleText, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Failed sync items</div>
                <div style={{ color: theme.text, marginTop: "6px" }}>{googleCalendarSyncStats.failed}</div>
              </div>
            ) : null}
          </div>
          {googleCalendarConnection.lastError &&
          googleCalendarConnection.lastError !== connectionsMessage ? (
            <div style={{ padding: "12px 14px", borderRadius: "16px", border: theme.border, background: theme.errorBackground || "rgba(239,68,68,0.12)", color: theme.text }}>
              {googleCalendarConnection.lastError}
            </div>
          ) : null}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {googleCalendarConnection.status === "disabled" ? (
              <button style={primaryButtonStyle(theme)} onClick={markGoogleCalendarReady}>
                Resume Sync
              </button>
            ) : (
              <button style={softButtonStyle(theme)} onClick={disableGoogleCalendarSync}>
                Pause Sync
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionStyle("jump")}>
        {renderSectionHeader("Tracking Areas", "Add more tracker sections later without repeating the first-time chooser.", "Areas", "Areas")}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {selectedTrackingAreaOptions.map((area) => (
            <div
              key={area.id}
              style={{
                ...softButtonStyle(theme),
                width: "auto",
                minHeight: "unset",
                cursor: "default",
              }}
            >
              {area.label}
            </div>
          ))}
        </div>
        {inactiveTrackingAreaOptions.length > 0 ? (
          <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
            <button style={softButtonStyle(theme)} onClick={() => setShowAddTrackingAreaPicker((current) => !current)}>
              {showAddTrackingAreaPicker ? "Hide Add Area" : "Add Another Area"}
            </button>
            {showAddTrackingAreaPicker ? (
              <div style={goalFormGridStyle}>
                <div>
                  <label style={labelStyle(theme)}>Available area</label>
                  <select style={inputStyle(theme)} value={trackingAreaToAdd} onChange={(e) => setTrackingAreaToAdd(e.target.value)}>
                    <option value="">Choose an area</option>
                    {inactiveTrackingAreaOptions.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle(theme)}>What it covers</label>
                  <div style={{ ...inputStyle(theme), minHeight: "48px", display: "flex", alignItems: "center" }}>
                    {inactiveTrackingAreaOptions.find((area) => area.id === trackingAreaToAdd)?.description || "Choose an area to preview it."}
                  </div>
                </div>
              </div>
            ) : null}
            {showAddTrackingAreaPicker ? (
              <div>
                <button style={primaryButtonStyle(theme)} onClick={addTrackedArea}>Add Area To Tracker</button>
              </div>
            ) : null}
          </div>
        ) : (
          <p style={{ color: theme.subtleText }}>All available tracking areas are already enabled.</p>
        )}
        {renderFeedbackMessage(trackingAreasMessage, theme)}
      </section>

      <section className="galaxy-panel" style={sectionStyle("dashboard")}>
        {renderSectionHeader("Tutorial", "Replay the tracker walkthrough anytime while staying logged in.", "Guide", "Guide")}
        <p style={{ margin: "0 0 16px 0", color: theme.subtleText, lineHeight: 1.6 }}>
          Use this as a test harness while we tune the onboarding flow.
        </p>
        <button
          style={primaryButtonStyle(theme)}
          onClick={() => startTrackerTutorial(0)}
          disabled={showTrackerTutorial}
        >
          {showTrackerTutorial ? "Tutorial Already Open" : "Start Tutorial"}
        </button>
      </section>

      <section className="galaxy-panel" style={sectionStyle("goals")}>
        {renderSectionHeader("Change PIN", "Use your current PIN, then choose a new one with 4 to 8 digits.", "Bloom", "Constellation")}
        <form
          style={goalFormGridStyle}
          onSubmit={(event) => {
            event.preventDefault();
            changePin();
          }}
        >
          <div>
            <label htmlFor="settings-current-pin" style={labelStyle(theme)}>Current PIN</label>
            <input
              id="settings-current-pin"
              style={inputStyle(theme)}
              type="password"
              name="current-pin"
              autoComplete="off"
              inputMode="numeric"
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="Current PIN"
            />
          </div>
          <div>
            <label htmlFor="settings-new-pin" style={labelStyle(theme)}>New PIN</label>
            <input
              id="settings-new-pin"
              style={inputStyle(theme)}
              type="password"
              name="new-pin"
              autoComplete="off"
              inputMode="numeric"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="New PIN"
            />
          </div>
          <div>
            <label htmlFor="settings-confirm-new-pin" style={labelStyle(theme)}>Confirm new PIN</label>
            <input
              id="settings-confirm-new-pin"
              style={inputStyle(theme)}
              type="password"
              name="confirm-new-pin"
              autoComplete="off"
              inputMode="numeric"
              value={confirmNewPinInput}
              onChange={(e) => setConfirmNewPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="Confirm new PIN"
            />
          </div>
          <div style={{ gridColumn: "1 / -1", marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="submit" style={primaryButtonStyle(theme)}>Update PIN</button>
          </div>
        </form>
        {renderFeedbackMessage(settingsMessage, theme)}
      </section>

      <section className="galaxy-panel" style={sectionStyle("care")}>
        {renderSectionHeader(
          "Native Push",
          "Turn on device notifications for the native app shell while keeping the shared web app flow intact.",
          "Signal",
          "Signal"
        )}
        <p style={{ margin: "0 0 12px 0", color: theme.subtleText, lineHeight: 1.6 }}>
          {pushNotificationsSupported
            ? `Permission status: ${pushPermissionStatus}.`
            : "Native push controls appear when this account is opened inside the Android or iPhone app shell."}
        </p>
        {pushToken ? (
          <p
            style={{
              margin: "0 0 12px 0",
              color: theme.faintText,
              fontSize: "0.85rem",
              overflowWrap: "anywhere",
            }}
          >
            Device token saved: {pushToken}
          </p>
        ) : null}
        <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={primaryButtonStyle(theme)} onClick={enableNativePushNotifications} disabled={pushSyncing}>
            {pushSyncing ? "Working..." : "Enable Native Push"}
          </button>
          <button style={softButtonStyle(theme)} onClick={disableNativePushNotifications} disabled={pushSyncing || !pushToken}>
            Turn Off On This Device
          </button>
        </div>
        {renderFeedbackMessage(pushStatusMessage, theme)}
      </section>

      <section className="galaxy-panel" style={sectionStyle("care")}>
        {renderSectionHeader("Forgot PIN / Reset PIN", "Use your account password to reset your PIN if you do not remember the current one.", "Reset", "Reset")}
        <form
          style={goalFormGridStyle}
          onSubmit={(event) => {
            event.preventDefault();
            resetPinWithPassword();
          }}
        >
          <input type="hidden" name="username" autoComplete="username" value={user?.email || ""} readOnly />
          <div>
            <label htmlFor="settings-reset-account-password" style={labelStyle(theme)}>Account password</label>
            <input
              id="settings-reset-account-password"
              style={inputStyle(theme)}
              type="password"
              name="current-password"
              autoComplete="current-password"
              value={resetPinPassword}
              onChange={(e) => setResetPinPassword(e.target.value)}
              placeholder="Account password"
            />
          </div>
          <div>
            <label htmlFor="settings-reset-new-pin" style={labelStyle(theme)}>New PIN</label>
            <input
              id="settings-reset-new-pin"
              style={inputStyle(theme)}
              type="password"
              name="new-pin"
              autoComplete="off"
              inputMode="numeric"
              value={resetNewPinInput}
              onChange={(e) => setResetNewPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="New PIN"
            />
          </div>
          <div>
            <label htmlFor="settings-reset-confirm-new-pin" style={labelStyle(theme)}>Confirm new PIN</label>
            <input
              id="settings-reset-confirm-new-pin"
              style={inputStyle(theme)}
              type="password"
              name="confirm-new-pin"
              autoComplete="off"
              inputMode="numeric"
              value={resetConfirmNewPinInput}
              onChange={(e) => setResetConfirmNewPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="Confirm new PIN"
            />
          </div>
          <div style={{ gridColumn: "1 / -1", marginTop: "18px" }}>
            <button type="submit" style={primaryButtonStyle(theme)}>Reset PIN</button>
          </div>
        </form>
        {renderFeedbackMessage(settingsMessage, theme)}
      </section>

      <section className="galaxy-panel" style={sectionStyle("signals")}>
        {renderSectionHeader("Session", "Account actions stay at the bottom so the main settings are easier to scan.", "Session", "Session")}
        <button style={softButtonStyle(theme)} onClick={handleLogout}>Logout</button>
      </section>
    </div>
  );
}

export default TrackerSettingsPage;
