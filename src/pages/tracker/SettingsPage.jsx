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
    resetPinPassword,
    setResetPinPassword,
    resetNewPinInput,
    setResetNewPinInput,
    resetConfirmNewPinInput,
    setResetConfirmNewPinInput,
    resetPinWithPassword,
  } = app;

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
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

      <section className="galaxy-panel" style={sectionCardStyle(theme, "goals")}>
        {renderSectionHeader("Change PIN", "Use your current PIN, then choose a new one with 4 to 8 digits.", "Bloom", "Constellation")}
        <div style={goalFormGridStyle}>
          <div>
            <label style={labelStyle(theme)}>Current PIN</label>
            <input style={inputStyle(theme)} type="password" inputMode="numeric" value={currentPinInput} onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ""))} placeholder="Current PIN" />
          </div>
          <div>
            <label style={labelStyle(theme)}>New PIN</label>
            <input style={inputStyle(theme)} type="password" inputMode="numeric" value={newPinInput} onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ""))} placeholder="New PIN" />
          </div>
          <div>
            <label style={labelStyle(theme)}>Confirm new PIN</label>
            <input style={inputStyle(theme)} type="password" inputMode="numeric" value={confirmNewPinInput} onChange={(e) => setConfirmNewPinInput(e.target.value.replace(/\D/g, ""))} placeholder="Confirm new PIN" />
          </div>
        </div>
        <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={primaryButtonStyle(theme)} onClick={changePin}>Update PIN</button>
          <button style={softButtonStyle(theme)} onClick={handleLogout}>Logout</button>
        </div>
        {renderFeedbackMessage(settingsMessage, theme)}
      </section>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "care")}>
        {renderSectionHeader("Forgot PIN / Reset PIN", "Use your account password to reset your PIN if you do not remember the current one.", "Reset", "Reset")}
        <div style={goalFormGridStyle}>
          <div>
            <label style={labelStyle(theme)}>Account password</label>
            <input style={inputStyle(theme)} type="password" value={resetPinPassword} onChange={(e) => setResetPinPassword(e.target.value)} placeholder="Account password" />
          </div>
          <div>
            <label style={labelStyle(theme)}>New PIN</label>
            <input style={inputStyle(theme)} type="password" inputMode="numeric" value={resetNewPinInput} onChange={(e) => setResetNewPinInput(e.target.value.replace(/\D/g, ""))} placeholder="New PIN" />
          </div>
          <div>
            <label style={labelStyle(theme)}>Confirm new PIN</label>
            <input style={inputStyle(theme)} type="password" inputMode="numeric" value={resetConfirmNewPinInput} onChange={(e) => setResetConfirmNewPinInput(e.target.value.replace(/\D/g, ""))} placeholder="Confirm new PIN" />
          </div>
        </div>
        <div style={{ marginTop: "18px" }}>
          <button style={primaryButtonStyle(theme)} onClick={resetPinWithPassword}>Reset PIN</button>
        </div>
        {renderFeedbackMessage(settingsMessage, theme)}
      </section>
    </div>
  );
}

export default TrackerSettingsPage;
