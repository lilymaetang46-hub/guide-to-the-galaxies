import { useState } from "react";

function TrackerLayout({
  theme,
  title,
  subtitle,
  today,
  lastAction,
  status,
  activePage,
  setActivePage,
  trackerNavItems,
  darkMode,
  setDarkMode,
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
  const [navOpen, setNavOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 900
  );

  const shouldCollapseAfterAction =
    typeof window !== "undefined" && window.innerWidth < 900;

  const handleSelectPage = (page) => {
    setActivePage(page);
    if (shouldCollapseAfterAction) {
      setNavOpen(false);
    }
  };

  const handleToggleExperience = () => {
    setAppExperience("outsider");
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
        ? `radial-gradient(circle at 78% 18%, rgba(215,246,250,0.18) 0%, rgba(215,246,250,0) 24%), ${theme.itemBackground}`
        : theme.themeFamily === "forest"
        ? `radial-gradient(circle at 18% 18%, rgba(220,233,190,0.16) 0%, rgba(220,233,190,0) 24%), ${theme.itemBackground}`
        : `radial-gradient(circle at 82% 14%, rgba(160,148,255,0.18) 0%, rgba(160,148,255,0) 22%), ${theme.itemBackground}`,
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
          <p style={lastActionStyle(theme)}>Last action: {lastAction}</p>
          <div style={shellMetaRowStyle}>
            <div style={{ ...statusBadgeStyle(status, theme), width: "auto", minWidth: "140px" }}>
              {status || "Ready"}
            </div>
          </div>
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
          <p style={navSectionLabelStyle}>Tracker</p>
          <div style={navGridStyle}>
            {trackerNavItems.map((item) => (
              <button
                key={item.key}
                style={navButtonStyle(
                  item.key === "mission"
                    ? activePage === "mission" || activePage === "dashboard"
                    : activePage === item.key,
                  theme
                )}
                onClick={() => handleSelectPage(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...headerControlsStyle, alignContent: "start" }}>
          <p style={navSectionLabelStyle}>Utilities</p>
          <div style={utilityGridStyle}>
            <button style={softButtonStyle(theme)} onClick={handleToggleExperience}>
              Open Outsider App
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

export default TrackerLayout;
