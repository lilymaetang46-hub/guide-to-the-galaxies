function TrackerLayout({
  theme,
  title,
  subtitle,
  today,
  lastAction,
  status,
  activePage,
  setActivePage,
  darkMode,
  setDarkMode,
  handleLogout,
  setAppExperience,
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
  statusBadgeStyle,
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
          <p style={lastActionStyle(theme)}>Last action: {lastAction}</p>
        </div>

        <div style={headerControlsStyle}>
          <button
            style={navButtonStyle(activePage === "mission" || activePage === "dashboard", theme)}
            onClick={() => setActivePage("mission")}
          >
            Overview
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
            style={navButtonStyle(activePage === "support", theme)}
            onClick={() => setActivePage("support")}
          >
            Support
          </button>
          <button
            style={navButtonStyle(activePage === "connections", theme)}
            onClick={() => setActivePage("connections")}
          >
            Connections
          </button>
          <button
            style={navButtonStyle(activePage === "settings", theme)}
            onClick={() => setActivePage("settings")}
          >
            Settings
          </button>
          <button style={softButtonStyle(theme)} onClick={() => setAppExperience("outsider")}>
            Open Outsider App
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
          <div style={statusBadgeStyle(status, theme)}>{status || "Ready"}</div>
        </div>
      </div>

      {children}
    </div>
  );
}

export default TrackerLayout;
