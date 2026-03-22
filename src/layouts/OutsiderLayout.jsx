function OutsiderLayout({
  theme,
  title,
  subtitle,
  today,
  selectedTrackerName,
  outsiderPage,
  setOutsiderPage,
  darkMode,
  setDarkMode,
  handleLogout,
  loadOutsiderTrackers,
  setAppExperience,
  outsiderMessage,
  containerStyle,
  heroCardStyle,
  tinyLabelStyle,
  titleStyle,
  subtitleStyle,
  dateStyle,
  lastActionStyle,
  headerControlsStyle,
  navButtonStyle,
  themeToggleStyle,
  softButtonStyle,
  children,
}) {
  return (
    <div style={containerStyle}>
      <div style={heroCardStyle(theme)}>
        <div>
          <p style={tinyLabelStyle(theme)}>Guide to the Galaxies</p>
          <h1 style={titleStyle(theme)}>{title}</h1>
          <p style={subtitleStyle(theme)}>{subtitle}</p>
          <p style={dateStyle(theme)}>{today}</p>
          <p style={lastActionStyle(theme)}>
            {selectedTrackerName
              ? `Selected tracker: ${selectedTrackerName}`
              : "Choose a connected tracker to view support data."}
          </p>
          {outsiderMessage ? (
            <p style={lastActionStyle(theme)}>{`Latest support action: ${outsiderMessage}`}</p>
          ) : null}
        </div>

        <div style={headerControlsStyle}>
          <button
            style={navButtonStyle(outsiderPage === "outsiderOverview", theme)}
            onClick={() => setOutsiderPage("outsiderOverview")}
          >
            Overview
          </button>
          <button
            style={navButtonStyle(outsiderPage === "outsiderData", theme)}
            onClick={() => setOutsiderPage("outsiderData")}
          >
            Data & Charts
          </button>
          <button
            style={navButtonStyle(outsiderPage === "outsiderSupport", theme)}
            onClick={() => setOutsiderPage("outsiderSupport")}
          >
            Support
          </button>
          <button
            style={navButtonStyle(outsiderPage === "outsiderGoals", theme)}
            onClick={() => setOutsiderPage("outsiderGoals")}
          >
            Goals
          </button>
          <button style={softButtonStyle(theme)} onClick={loadOutsiderTrackers}>
            Refresh
          </button>
          <button style={softButtonStyle(theme)} onClick={() => setAppExperience("tracker")}>
            Open Tracker App
          </button>
          <button
            style={themeToggleStyle(theme)}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Solar Mode" : "Galaxy Mode"}
          </button>
          <button style={softButtonStyle(theme)} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

export default OutsiderLayout;
