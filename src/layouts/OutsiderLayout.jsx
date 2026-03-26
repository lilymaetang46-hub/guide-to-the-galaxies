import { useState } from "react";

const CONSOLE_NAV_ITEMS = [
  { key: "outsiderOverview", label: "Viewport", desktopLabel: "ENGINE_ROOM", icon: "settings_input_hdmi" },
  { key: "outsiderData", label: "Telemetry", desktopLabel: "NAV_COMPUTER", icon: "query_stats" },
  { key: "outsiderGoals", label: "Logs", desktopLabel: "CARGO_BAY", icon: "database" },
  { key: "outsiderSupport", label: "Comms", desktopLabel: "CREW_QUARTERS", icon: "satellite_alt" },
];

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
  const isConsole = theme.observerConsole;

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

  if (!isConsole) {
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

  const desktopSideNavItems = CONSOLE_NAV_ITEMS.map((item) => ({
    ...item,
    active:
      item.key === "outsiderOverview"
        ? outsiderPage === "outsiderOverview"
        : outsiderPage === item.key,
  }));

  const activeItem =
    CONSOLE_NAV_ITEMS.find((item) => item.key === outsiderPage) || CONSOLE_NAV_ITEMS[0];

  const pageTitle =
    outsiderPage === "outsiderData"
      ? "Tracker Summaries"
      : outsiderPage === "outsiderSupport"
      ? "Comms Console"
      : outsiderPage === "outsiderGoals"
      ? "Mission Log"
      : "Observer Viewport";

  const pageSubline =
    selectedTrackerName
      ? `MISSION_ID: ${selectedTrackerName.toUpperCase().replace(/[^A-Z0-9]+/g, "_")} // SECTOR_7G`
      : "MISSION_ID: ARCHIVE_99 // SECTOR_7G";

  const signalText = outsiderMessage ? "SIGNAL_BUSY" : "SIGNAL_LIVE";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        paddingBottom: "84px",
        fontFamily: theme.observerFontFamily,
        color: theme.text,
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          height: "64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          background: "rgba(13, 13, 18, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: `2px solid ${theme.observerAccent}33`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span className="material-symbols-outlined" style={{ color: theme.observerAccent }}>
            settings_input_component
          </span>
          <div
            style={{
              fontFamily: theme.observerHeadingFamily,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: theme.observerAccent,
              fontSize: "1.05rem",
              textTransform: "uppercase",
            }}
          >
            ORBITAL_OS_v.72
          </div>
        </div>

        <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {CONSOLE_NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPage(item.key)}
              style={{
                background: "transparent",
                border: "none",
                color: outsiderPage === item.key ? theme.observerAccent : "#5d6168",
                fontFamily: "Newsreader, serif",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: outsiderPage === item.key ? "underline" : "none",
                textUnderlineOffset: "8px",
                padding: "6px 0",
                display: typeof window !== "undefined" && window.innerWidth < 900 ? "none" : "inline-flex",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right", display: typeof window !== "undefined" && window.innerWidth < 640 ? "none" : "block" }}>
            <p style={{ margin: 0, fontSize: "10px", color: `${theme.observerAccent}99`, textTransform: "uppercase" }}>
              System Integrity
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: theme.observerAccent }}>NOMINAL_98%</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "2px",
              border: `1px solid ${theme.inputBorder}`,
              background: "#333537",
              color: theme.text,
              display: "grid",
              placeItems: "center",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>person</span>
          </button>
        </div>
      </header>

      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "272px",
          background: "#121416",
          borderRight: "1px solid #27292d",
          paddingTop: "80px",
          display: typeof window !== "undefined" && window.innerWidth < 1024 ? "none" : "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 40,
        }}
      >
        <div style={{ padding: "0 24px 16px" }}>
          <p style={{ margin: 0, color: "#ff9c2b", letterSpacing: "0.18em", fontSize: "11px", textTransform: "uppercase" }}>
            SYSTEM_MANIFEST
          </p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {desktopSideNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPage(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                background: item.active ? `${theme.observerAccent}14` : "transparent",
                color: item.active ? theme.observerAccent : "#757980",
                border: "none",
                borderLeft: item.active ? `4px solid ${theme.observerAccent}` : "4px solid transparent",
                padding: "16px 24px",
                fontFamily: theme.observerFontFamily,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.desktopLabel}</span>
            </button>
          ))}
        </nav>
        <div
          style={{
            marginTop: "auto",
            padding: "24px",
            background: "rgba(12,14,16,0.5)",
            borderTop: "1px solid #27292d",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "10px", color: "#777c83", textTransform: "uppercase" }}>
            <span>Oxygen_Reserve</span>
            <span style={{ color: theme.observerAccent }}>84%</span>
          </div>
          <div style={{ height: "4px", background: "#282a2c" }}>
            <div style={{ width: "84%", height: "100%", background: theme.observerAccent }} />
          </div>
        </div>
      </aside>

      <main
        style={{
          marginLeft: typeof window !== "undefined" && window.innerWidth >= 1024 ? "272px" : 0,
          paddingTop: "80px",
          paddingBottom: "24px",
          paddingInline: "16px",
          maxWidth: "1280px",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#282a2c",
            padding: "16px",
            borderTop: "4px solid #47464b",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 24px 48px rgba(0,0,0,0.34)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.1,
              background:
                "linear-gradient(135deg, rgba(0,230,57,0.16) 0%, rgba(0,0,0,0) 42%), linear-gradient(315deg, rgba(255,140,0,0.12) 0%, rgba(0,0,0,0) 36%)",
              pointerEvents: "none",
            }}
          />
          <div
            className="orbital-crt-glow"
            style={{
              position: "relative",
              background: "#0c0e10",
              borderRadius: "4px",
              border: "4px solid #37393b",
              padding: "24px 16px 32px",
              minHeight: "600px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              overflow: "hidden",
            }}
          >
            <div className="orbital-scanlines" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.28 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  borderBottom: `1px solid ${theme.observerAccent}33`,
                  paddingBottom: "16px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "Newsreader, serif",
                      fontStyle: "italic",
                      fontSize: "clamp(1.9rem, 4vw, 3rem)",
                      color: theme.text,
                    }}
                  >
                    {pageTitle}
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "11px",
                      color: theme.observerAccent,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {pageSubline}
                  </p>
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    border: `1px solid ${theme.observerAccent}55`,
                    background: `${theme.observerAccent}12`,
                    color: theme.observerAccent,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: theme.observerAccent, boxShadow: `0 0 12px ${theme.observerAccent}` }} />
                  {signalText}
                </div>
              </div>

              {children}

              <div
                style={{
                  marginTop: "24px",
                  borderTop: `1px solid ${theme.observerAccent}26`,
                  paddingTop: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  color: "#757980",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <span>ORBITAL_OS_v.72_SYSTEM_DIAGNOSTIC_COMPLETED_SUCCESSFULLY</span>
                <span style={{ color: theme.observerAccent }}>{today}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "28px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <button
                className="orbital-mechanical-shadow"
                onClick={() => handleSelectPage("outsiderData")}
                style={{
                  width: "72px",
                  height: "72px",
                  background: theme.observerAccent,
                  color: theme.primaryText,
                  border: "none",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  fontSize: "8px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span className="material-symbols-outlined">emergency</span>
                <span>Activate</span>
              </button>
              <button
                className="orbital-mechanical-shadow"
                onClick={() => handleSelectPage("outsiderSupport")}
                style={{
                  width: "72px",
                  height: "72px",
                  background: "#fd8b00",
                  color: "#2f1500",
                  border: "none",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  fontSize: "8px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span className="material-symbols-outlined">support</span>
                <span>Support</span>
              </button>
              <button
                className="orbital-mechanical-shadow"
                onClick={handleRefresh}
                style={{
                  width: "72px",
                  height: "72px",
                  background: "#333537",
                  color: "#c8c5cb",
                  border: `2px solid ${theme.inputBorder}`,
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  fontSize: "8px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span className="material-symbols-outlined">refresh</span>
                <span>Reboot</span>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "center",
                background: "rgba(12,14,16,0.5)",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid #27292d",
              }}
            >
              {[
                { label: "NAV_LOCK", active: false },
                { label: "SYNC_UP", active: true },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "48px",
                      background: "#3f4348",
                      borderRadius: "999px",
                      padding: "4px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: item.active ? "flex-end" : "flex-start",
                      alignItems: "center",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.36)",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: item.active ? "18px" : "10px",
                        background: item.active ? theme.observerAccent : "#a6aab0",
                        borderRadius: item.active ? "4px" : "50%",
                        boxShadow: item.active ? `0 0 8px ${theme.observerAccent}` : "none",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "8px", color: "#777c83", letterSpacing: "0.08em" }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: typeof window !== "undefined" && window.innerWidth < 640 ? "none" : "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: "4px solid #555a60",
                  background: "#333537",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.24)",
                  position: "relative",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    width: "4px",
                    height: "24px",
                    background: "#b8bec4",
                    transform: "rotate(45deg)",
                    transformOrigin: "bottom center",
                  }}
                />
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid #64686d",
                    background: "#1f2226",
                  }}
                />
              </div>
              <span style={{ fontSize: "8px", color: "#777c83", letterSpacing: "0.08em" }}>BANDWIDTH</span>
            </div>
          </div>
        </div>
      </main>

      <footer
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 55,
          height: "78px",
          background: "#0c0e10",
          borderTop: "4px solid #282a2c",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {CONSOLE_NAV_ITEMS.map((item) => {
          const active = outsiderPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleSelectPage(item.key)}
              style={{
                border: "none",
                background: active ? `${theme.observerAccent}22` : "transparent",
                color: active ? theme.observerAccent : "#757980",
                borderTop: active ? `2px solid ${theme.observerAccent}` : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                paddingBottom: "10px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: theme.observerHeadingFamily,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </footer>

      <div
        className="orbital-scanlines"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 100,
          opacity: 0.03,
        }}
      />
    </div>
  );
}

export default OutsiderLayout;
