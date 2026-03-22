import { useState } from "react";

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
  const [navOpen, setNavOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 900
  );

  const shouldCollapseAfterAction =
    typeof window !== "undefined" && window.innerWidth < 900;

  const handleSelectPage = (page) => {
    setOutsiderPage(page);
    if (shouldCollapseAfterAction) {
      setNavOpen(false);
    }
  };

  const handleRefresh = () => {
    loadOutsiderTrackers();
    if (shouldCollapseAfterAction) {
      setNavOpen(false);
    }
  };

  const handleToggleExperience = () => {
    setAppExperience("tracker");
    if (shouldCollapseAfterAction) {
      setNavOpen(false);
    }
  };

  const shellMetaRowStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: "14px",
  };

  const shellInset = "clamp(12px, 4vw, 24px)";
  const sidebarLeftOffset = `max(${shellInset}, calc((100vw - 1100px) / 2 + ${shellInset} - 34px))`;

  const navToggleStyle = {
    ...softButtonStyle(theme),
    position: "fixed",
    top: shellInset,
    left: sidebarLeftOffset,
    zIndex: 80,
    minHeight: "42px",
    width: "min(320px, calc(100vw - 28px))",
    minWidth: "min(320px, calc(100vw - 28px))",
    padding: "10px 16px",
    borderRadius:
      theme.themeFamily === "underwater"
        ? "26px 26px 14px 14px / 24px 24px 12px 12px"
        : theme.themeFamily === "forest"
        ? "24px 24px 14px 14px / 22px 22px 12px 12px"
        : "24px 24px 12px 12px / 22px 22px 10px 10px",
    background: navOpen ? theme.primary : theme.softButtonBackground,
    color: navOpen ? theme.primaryText : theme.softButtonText,
    boxShadow: navOpen
      ? `0 10px 18px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
      : `0 14px 24px ${theme.glow}`,
    justifyContent: "flex-start",
    textAlign: "left",
    border: theme.border,
  };

  const navDrawerStyle = {
    position: "fixed",
    top: "58px",
    left: sidebarLeftOffset,
    bottom: shellInset,
    width: "min(320px, calc(100vw - 28px))",
    maxWidth: "100%",
    zIndex: 60,
    display: navOpen ? "grid" : "none",
    gap: "18px",
    alignContent: "start",
    padding: "20px 18px",
    borderRadius:
      theme.themeFamily === "underwater"
        ? "0 22px 34px 24px / 0 24px 22px 30px"
        : theme.themeFamily === "forest"
        ? "0 28px 26px 32px / 0 22px 30px 24px"
        : "0 30px 24px 32px / 0 24px 20px 30px",
    background:
      theme.themeFamily === "underwater"
        ? `radial-gradient(circle at 18% 18%, rgba(214,247,251,0.16) 0%, rgba(214,247,251,0) 24%), ${theme.itemBackground}`
        : theme.themeFamily === "forest"
        ? `radial-gradient(circle at 80% 16%, rgba(220,234,191,0.16) 0%, rgba(220,234,191,0) 24%), ${theme.itemBackground}`
        : `radial-gradient(circle at 18% 18%, rgba(165,150,255,0.16) 0%, rgba(165,150,255,0) 24%), ${theme.itemBackground}`,
    border: theme.border,
    boxShadow: `0 20px 36px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
    overflowY: "auto",
    paddingTop: "28px",
  };

  const navOverlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    background: "rgba(8, 10, 20, 0.24)",
    backdropFilter: "blur(4px)",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
  };

  const navSectionLabelStyle = {
    margin: 0,
    color: theme.faintText,
    fontSize: "0.72rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  };

  const navGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
  };

  const utilityGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    alignItems: "start",
  };

  return (
    <div style={containerStyle}>
      <div style={heroCardStyle(theme)}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
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
          <div style={shellMetaRowStyle} />
        </div>
      </div>

      <button style={navToggleStyle} onClick={() => setNavOpen((current) => !current)}>
        {navOpen ? "Hide Sidebar" : "Open Sidebar"}
      </button>

      {navOpen ? (
        <button aria-label="Close sidebar overlay" style={navOverlayStyle} onClick={() => setNavOpen(false)} />
      ) : null}

      <div style={navDrawerStyle}>
        <div style={{ ...headerControlsStyle, alignContent: "start" }}>
          <p style={navSectionLabelStyle}>Outsider</p>
          <div style={navGridStyle}>
            <button
              style={navButtonStyle(outsiderPage === "outsiderOverview", theme)}
              onClick={() => handleSelectPage("outsiderOverview")}
            >
              Overview
            </button>
            <button
              style={navButtonStyle(outsiderPage === "outsiderData", theme)}
              onClick={() => handleSelectPage("outsiderData")}
            >
              Data & Charts
            </button>
            <button
              style={navButtonStyle(outsiderPage === "outsiderSupport", theme)}
              onClick={() => handleSelectPage("outsiderSupport")}
            >
              Support
            </button>
            <button
              style={navButtonStyle(outsiderPage === "outsiderGoals", theme)}
              onClick={() => handleSelectPage("outsiderGoals")}
            >
              Goals
            </button>
          </div>
        </div>

        <div style={{ ...headerControlsStyle, alignContent: "start" }}>
          <p style={navSectionLabelStyle}>Utilities</p>
          <div style={utilityGridStyle}>
            <button style={softButtonStyle(theme)} onClick={handleRefresh}>
              Refresh
            </button>
            <button style={softButtonStyle(theme)} onClick={handleToggleExperience}>
              Open Tracker App
            </button>
            <button style={themeToggleStyle(theme)} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Solar Mode" : "Galaxy Mode"}
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

export default OutsiderLayout;
