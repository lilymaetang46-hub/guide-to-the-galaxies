import { useEffect, useState } from "react";

import useResponsiveViewport from "../app/useResponsiveViewport";

const CONSOLE_NAV_ITEMS = [
  { key: "outsiderOverview", label: "Overview", desktopLabel: "ENGINE_ROOM", icon: "settings_input_hdmi" },
  { key: "outsiderData", label: "Telemetry", desktopLabel: "NAV_COMPUTER", icon: "query_stats" },
  { key: "outsiderGoals", label: "Goals", desktopLabel: "GOAL_ARCHIVE", icon: "database" },
  { key: "outsiderSupport", label: "Comms", desktopLabel: "CREW_QUARTERS", icon: "satellite_alt" },
];

function isAbyssOutsiderTheme(theme) {
  return Boolean(theme?.observerAbyssBridge && theme?.themeFamily === "underwater");
}

function steelTextureOverlay(theme) {
  return `linear-gradient(170deg, rgba(255,255,255,${theme.modeName === "Reef" ? 0.24 : 0.08}) 0%, transparent 40%, rgba(0,0,0,${theme.modeName === "Reef" ? 0.12 : 0.3}) 100%), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,${theme.modeName === "Reef" ? 0.025 : 0.02}) 2px, rgba(255,255,255,${theme.modeName === "Reef" ? 0.025 : 0.02}) 4px), radial-gradient(circle at 12% 18%, ${theme.observerIndustrialRust} 0%, rgba(0,0,0,0) 22%), radial-gradient(circle at 72% 22%, ${theme.observerIndustrialRust} 0%, rgba(0,0,0,0) 16%), radial-gradient(circle at 22% 82%, rgba(72,34,12,${theme.modeName === "Reef" ? 0.08 : 0.18}) 0%, rgba(0,0,0,0) 18%), radial-gradient(circle at 84% 78%, rgba(255,255,255,${theme.modeName === "Reef" ? 0.08 : 0.04}) 0%, rgba(255,255,255,0) 20%), ${theme.observerIndustrialPanel}`;
}

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
  handleLogout,
  showOutsiderTutorial,
  startOutsiderTutorial,
  children,
}) {
  const { width: viewportWidth, isCoarsePointer } = useResponsiveViewport();
  const [navOpen, setNavOpen] = useState(() => viewportWidth >= 900);
  const shouldCollapseAfterAction = viewportWidth < 900;
  const isConsole = theme.observerConsole;
  const isAbyssBridge = isAbyssOutsiderTheme(theme);
  const isMobile = viewportWidth < 768 || (isCoarsePointer && viewportWidth < 1024);
  const showDesktopSidebar = !isCoarsePointer && viewportWidth >= 1180;
  const showCompactConsoleNav = !showDesktopSidebar;
  const consoleSidebarWidth = viewportWidth >= 1480 ? 248 : 224;

  useEffect(() => {
    setNavOpen(viewportWidth >= 900);
  }, [viewportWidth]);

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

  if (isAbyssBridge) {
    const sidebarWidth = showDesktopSidebar ? 288 : 0;
    const topHeaderHeight = isMobile ? 68 : 80;
    const footerHeight = isMobile ? 58 : 48;
    const selectedLabel =
      CONSOLE_NAV_ITEMS.find((item) => item.key === outsiderPage)?.label || "Overview";
    const navItems = [
      { key: "outsiderOverview", label: "Dashboard", icon: "dashboard" },
      { key: "outsiderData", label: "Biometrics", icon: "monitor_heart" },
      { key: "outsiderSupport", label: "Comms", icon: "radar" },
      { key: "outsiderGoals", label: "Diagnostics", icon: "construction" },
    ];

    const industrialPanelStyle = {
      backgroundColor: theme.observerIndustrialPanelBase,
      backgroundImage: steelTextureOverlay(theme),
      border: `3px solid ${theme.observerIndustrialBorder}`,
      borderBottomColor: theme.observerIndustrialBottomEdge,
      borderRightColor: theme.observerIndustrialBottomEdge,
      boxShadow: theme.observerIndustrialShadow,
      position: "relative",
      overflow: "hidden",
    };

    const rivetStyle = (position) => ({
      width: "16px",
      height: "16px",
      background:
        `radial-gradient(circle at 35% 35%, ${theme.observerIndustrialRivet} 0%, ${theme.observerIndustrialEdge} 60%, #000 100%)`,
      border: "1px solid rgba(0,0,0,0.8)",
      borderRadius: "50%",
      boxShadow:
        "1px 2px 4px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.1)",
      position: "absolute",
      zIndex: 4,
      ...position,
    });

    const rivetStainStyle = (position) => ({
      position: "absolute",
      width: "34px",
      height: "34px",
      background: `radial-gradient(circle at center, ${theme.observerIndustrialRust} 0%, rgba(0,0,0,0) 72%)`,
      transform: "translate(-9px, -9px)",
      pointerEvents: "none",
      zIndex: 3,
      opacity: theme.modeName === "Reef" ? 0.7 : 1,
      ...position,
    });

    const seamLineStyle = (position) => ({
      position: "absolute",
      background:
        theme.modeName === "Reef"
          ? "linear-gradient(180deg, rgba(157,149,139,0.7) 0%, rgba(255,255,255,0.25) 50%, rgba(125,118,111,0.6) 100%)"
          : "linear-gradient(180deg, rgba(61,66,71,0.95) 0%, rgba(255,255,255,0.06) 50%, rgba(18,20,22,0.95) 100%)",
      boxShadow:
        theme.modeName === "Reef"
          ? "0 0 0 1px rgba(255,255,255,0.08)"
          : "0 0 0 1px rgba(0,0,0,0.35)",
      pointerEvents: "none",
      zIndex: 2,
      ...position,
    });

    const supportBeamStyle = {
      position: "fixed",
      top: `${topHeaderHeight}px`,
      bottom: 0,
      left: `${sidebarWidth}px`,
      width: showDesktopSidebar ? "12px" : "0",
      display: showDesktopSidebar ? "block" : "none",
      zIndex: 30,
      backgroundColor: theme.observerIndustrialBeam,
      backgroundImage:
        "linear-gradient(to right, rgba(0,0,0,0.4), transparent 20%, transparent 80%, rgba(0,0,0,0.4))",
      borderLeft: "1px solid rgba(255,255,255,0.05)",
      borderRight: "1px solid rgba(0,0,0,0.5)",
      boxShadow: "2px 0 10px rgba(0,0,0,0.5)",
    };

    const headerActionButton = {
      border: `1px solid ${theme.observerIndustrialEdge}`,
      background: theme.softButtonBackground,
      color: theme.observerIndustrialText,
      minHeight: isMobile ? "34px" : "38px",
      minWidth: isMobile ? "34px" : "38px",
      padding: isMobile ? "0" : "0 12px",
      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
      fontSize: isMobile ? "11px" : "10px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      display: "grid",
      placeItems: "center",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 16px rgba(0,0,0,0.35)",
    };

    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #01080a 0%, #020b0d 28%, #020305 100%)",
          color: theme.text,
          fontFamily: theme.observerFontFamily,
          overflowX: "hidden",
        }}
      >
        <div style={supportBeamStyle}>
          <div style={rivetStyle({ top: "12%", left: "50%", transform: "translate(-50%, -50%)" })} />
          <div style={rivetStainStyle({ top: "12%", left: "50%" })} />
          <div style={rivetStyle({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" })} />
          <div style={rivetStainStyle({ top: "50%", left: "50%" })} />
          <div style={rivetStyle({ bottom: "12%", left: "50%", transform: "translate(-50%, 50%)" })} />
          <div style={rivetStainStyle({ bottom: "12%", left: "50%" })} />
        </div>

        <header
          style={{
            ...industrialPanelStyle,
            position: "fixed",
            inset: "0 0 auto 0",
            height: `${topHeaderHeight}px`,
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 14px" : "0 24px 0 32px",
            borderLeft: "none",
            borderTop: "none",
          }}
        >
          <div style={seamLineStyle({ left: "18px", top: "8px", bottom: "8px", width: "2px" })} />
          <div style={seamLineStyle({ right: "18px", top: "8px", bottom: "8px", width: "2px" })} />
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px", minWidth: 0 }}>
            <span
              style={{
                fontFamily: theme.observerHeadingFamily,
                fontWeight: 900,
                color: theme.observerAccent,
                fontSize: isMobile ? "1rem" : "1.6rem",
                letterSpacing: isMobile ? "0.04em" : "0.02em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textShadow: "0 0 10px rgba(34, 211, 238, 0.8)",
              }}
            >
              Bridge_Terminal_v4.2
            </span>
            {!isMobile ? (
              <nav style={{ display: "flex", gap: "18px", marginLeft: "12px" }}>
                {["Command", "Telemetry", "Comms"].map((label, index) => (
                  <span
                    key={label}
                    style={{
                      color: index === 0 ? theme.observerAccent : theme.faintText,
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      borderBottom: index === 0 ? `2px solid ${theme.observerAccent}` : "2px solid transparent",
                      paddingBottom: "4px",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </nav>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
            {!isMobile ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    background: theme.observerAlert,
                    boxShadow: `0 0 15px ${theme.observerAlert}`,
                  }}
                />
                <span
                  style={{
                    color: theme.observerAlert,
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                    fontWeight: 900,
                    fontSize: "12px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reactor Warning
                </span>
              </div>
            ) : null}
            <button style={headerActionButton} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
              <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "18px" : "20px" }}>
                contrast
              </span>
            </button>
            <button
              style={headerActionButton}
              onClick={() => startOutsiderTutorial(0)}
              aria-label={showOutsiderTutorial ? "Tutorial open" : "Start tutorial"}
              disabled={showOutsiderTutorial}
            >
              <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "18px" : "20px" }}>
                school
              </span>
            </button>
          </div>
          <div style={rivetStyle({ top: "8px", left: "8px" })} />
          <div style={rivetStainStyle({ top: "8px", left: "8px" })} />
          <div style={rivetStyle({ top: "8px", right: "8px" })} />
          <div style={rivetStainStyle({ top: "8px", right: "8px" })} />
        </header>

        {showDesktopSidebar ? (
          <aside
            style={{
              ...industrialPanelStyle,
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${sidebarWidth}px`,
              zIndex: 40,
              borderLeft: "none",
              paddingTop: `${topHeaderHeight + 18}px`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={seamLineStyle({ top: "102px", left: "18px", right: "18px", height: "2px" })} />
            <div style={{ padding: "0 22px 18px" }}>
              <div
                style={{
                  background: theme.observerIndustrialWell,
                  border: `3px solid ${theme.track}`,
                  boxShadow: "inset 0 10px 30px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.05)",
                  borderRadius: "14px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,81,250,0.08)",
                    border: "1px solid rgba(255,81,250,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: theme.observerAccentAlt }}>
                    waves
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: theme.observerAccentAlt,
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontWeight: 900,
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    Bulkhead Nav
                  </div>
                  <div
                    style={{
                      color: theme.faintText,
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontSize: "10px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      marginTop: "4px",
                    }}
                  >
                    Unit: DS-Support
                  </div>
                </div>
              </div>
            </div>

            <nav style={{ display: "grid", gap: "2px" }}>
              {navItems.map((item) => {
                const active = outsiderPage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectPage(item.key)}
                    style={{
                      border: "none",
                      borderRight: active ? `4px solid ${theme.observerAccent}` : "4px solid transparent",
                      background: active
                        ? "linear-gradient(90deg, rgba(34,211,238,0.08) 0%, rgba(34,211,238,0.02) 100%)"
                        : "transparent",
                      color: active ? theme.observerAccent : theme.faintText,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 26px",
                      textAlign: "left",
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div style={{ marginTop: "auto", padding: "22px", display: "grid", gap: "12px" }}>
              <button
                onClick={handleRefresh}
                style={{
                  ...headerActionButton,
                  width: "100%",
                  minWidth: 0,
                  minHeight: "46px",
                }}
              >
                Refresh Feed
              </button>
              <button
                onClick={handleToggleExperience}
                style={{
                  ...headerActionButton,
                  width: "100%",
                  minWidth: 0,
                  minHeight: "46px",
                }}
              >
                Open Tracker
              </button>
              <button
                onClick={handleLogout}
                style={{
                  border: "none",
                  minHeight: "50px",
                  background: "linear-gradient(180deg, #d85b57 0%, #7f1f1b 100%)",
                  color: "#fff4f3",
                  fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  boxShadow: "0 8px 0 #4d0f0d, 0 14px 22px rgba(0,0,0,0.34)",
                }}
              >
                Emerg. Surface
              </button>
              <div
                style={{
                  color: theme.faintText,
                  textAlign: "center",
                  fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  fontSize: "9px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(0,0,0,0.5)",
                }}
              >
                Protocol Delta-9 Active
              </div>
            </div>
          </aside>
        ) : null}

        <main
          style={{
            marginLeft: showDesktopSidebar ? `${sidebarWidth}px` : 0,
            paddingTop: `${topHeaderHeight + 18}px`,
            paddingBottom: `${footerHeight + 18}px`,
            minHeight: "100vh",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: isMobile ? "12px" : "22px",
            }}
          >
            <div
              style={{
                position: "relative",
                minHeight: `calc(100vh - ${topHeaderHeight + footerHeight + 40}px)`,
                padding: isMobile ? "12px" : "20px",
                background:
                  theme.modeName === "Reef"
                    ? "linear-gradient(180deg, rgba(253,245,236,0.92) 0%, rgba(233,225,215,0.92) 100%)"
                    : "#020305",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  opacity: 0.14,
                  background:
                    "radial-gradient(circle at 18% 22%, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0) 20%), radial-gradient(circle at 82% 72%, rgba(255,81,250,0.08) 0%, rgba(255,81,250,0) 18%), linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.12) 100%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: isMobile ? "flex-start" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  marginBottom: isMobile ? "14px" : "18px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: theme.observerAccent,
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontWeight: 900,
                      fontSize: isMobile ? "10px" : "11px",
                      letterSpacing: "0.34em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {selectedLabel}
                  </div>
                  <h1
                    style={{
                      margin: 0,
                      color: theme.text,
                      fontFamily: theme.observerHeadingFamily,
                      fontSize: isMobile ? "1.8rem" : "2.6rem",
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      textTransform: "uppercase",
                    }}
                  >
                    {title}
                  </h1>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: theme.faintText,
                      fontSize: isMobile ? "12px" : "13px",
                      lineHeight: 1.55,
                      maxWidth: "780px",
                    }}
                  >
                    {subtitle}
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: "6px",
                    alignItems: "end",
                    color: theme.faintText,
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                    fontSize: isMobile ? "10px" : "11px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>{today}</span>
                  <span style={{ color: theme.observerAccent }}>
                    {selectedTrackerName ? `Selected: ${selectedTrackerName}` : "No tracker selected"}
                  </span>
                  <span>{outsiderMessage ? `Comms: ${outsiderMessage}` : "Comms channel clear"}</span>
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
            </div>
          </div>
        </main>

        <footer
          style={{
            ...industrialPanelStyle,
            position: "fixed",
            left: showDesktopSidebar ? `${sidebarWidth}px` : 0,
            right: 0,
            bottom: 0,
            height: `${footerHeight}px`,
            zIndex: 35,
            borderLeft: showDesktopSidebar ? "3px solid #3d4247" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 12px" : "0 22px",
            gap: "12px",
          }}
        >
          <div style={rivetStyle({ top: "8px", left: "8px" })} />
          <div style={rivetStainStyle({ top: "8px", left: "8px" })} />
          <div style={rivetStyle({ top: "8px", right: "8px" })} />
          <div style={rivetStainStyle({ top: "8px", right: "8px" })} />
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "22px", minWidth: 0, overflow: "hidden" }}>
            {[
              { color: "#22c55e", text: "Reactor_Core: Stable" },
              { color: theme.observerAccent, text: "Hull_Stress: 2%" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: item.color,
                    boxShadow: `0 0 12px ${item.color}`,
                  }}
                />
                <span
                  style={{
                    color: theme.faintText,
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                    fontWeight: 700,
                    fontSize: isMobile ? "8px" : "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          {!isMobile ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span
                style={{
                  color: theme.faintText,
                  fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  fontWeight: 700,
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Oxygen: 24.2h
              </span>
              <span
                style={{
                  color: theme.observerAccent,
                  fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  fontWeight: 900,
                  fontSize: "12px",
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  textShadow: "0 0 10px rgba(34, 211, 238, 0.8)",
                }}
              >
                ETR: 14:22:09
              </span>
            </div>
          ) : null}
        </footer>

        {!showDesktopSidebar ? (
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: `${footerHeight}px`,
              zIndex: 36,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              background: "rgba(1, 4, 6, 0.92)",
              borderTop: `1px solid ${theme.observerIndustrialEdge}`,
            }}
          >
            {navItems.map((item) => {
              const active = outsiderPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelectPage(item.key)}
                  style={{
                    border: "none",
                    background: active ? "rgba(34,211,238,0.14)" : "transparent",
                    color: active ? theme.observerAccent : theme.faintText,
                    padding: "10px 6px 9px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                    fontSize: "8px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

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
              <button style={softButtonStyle(theme)} onClick={() => startOutsiderTutorial(0)} disabled={showOutsiderTutorial}>
                {showOutsiderTutorial ? "Tutorial Open" : "Start Tutorial"}
              </button>
              <button style={softButtonStyle(theme)} onClick={handleRefresh}>
                Refresh
              </button>
              <button style={softButtonStyle(theme)} onClick={handleToggleExperience}>
                Open Tracker App
              </button>
              <button style={softButtonStyle(theme)} onClick={handleLogout}>
                Logout
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

  const pageTitle =
    outsiderPage === "outsiderData"
      ? "Tracker Summaries"
      : outsiderPage === "outsiderSupport"
      ? "Comms Console"
      : outsiderPage === "outsiderGoals"
      ? "Mission Log"
      : "Tracker Overview";

  const pageSubline =
    selectedTrackerName
      ? `MISSION_ID: ${selectedTrackerName.toUpperCase().replace(/[^A-Z0-9]+/g, "_")} // SECTOR_7G`
      : "MISSION_ID: ARCHIVE_99 // SECTOR_7G";

  const signalText = outsiderMessage ? "SIGNAL_BUSY" : "SIGNAL_LIVE";
  const isSolarMode = theme.modeName === "Solar";
  const starfieldBackground = isSolarMode
    ? "radial-gradient(circle at 20% 14%, rgba(232, 161, 82, 0.16) 0%, rgba(232, 161, 82, 0) 18%), radial-gradient(circle at 78% 18%, rgba(54, 148, 151, 0.12) 0%, rgba(54, 148, 151, 0) 16%), linear-gradient(180deg, #d8ddd9 0%, #c7cdca 42%, #b8c0bf 100%)"
    : "radial-gradient(circle at 20% 18%, rgba(90, 128, 212, 0.14) 0%, rgba(90, 128, 212, 0) 20%), radial-gradient(circle at 78% 18%, rgba(42, 160, 132, 0.1) 0%, rgba(42, 160, 132, 0) 18%), linear-gradient(180deg, #060910 0%, #0a1019 44%, #050811 100%)";
  const cockpitPanelBackground = isSolarMode
    ? "linear-gradient(180deg, rgba(207, 198, 184, 0.98) 0%, rgba(177, 169, 156, 0.99) 40%, rgba(153, 147, 139, 0.995) 100%)"
    : "linear-gradient(180deg, rgba(33, 43, 61, 0.98) 0%, rgba(18, 25, 38, 0.99) 40%, rgba(11, 16, 27, 0.995) 100%)";
  const viewportGlassBackground = isSolarMode
    ? "linear-gradient(180deg, rgba(247, 242, 230, 0.96) 0%, rgba(231, 225, 210, 0.985) 100%)"
    : "linear-gradient(180deg, rgba(10, 15, 26, 0.96) 0%, rgba(7, 11, 20, 0.985) 100%)";
  const bridgeAccentLines = isSolarMode
    ? "linear-gradient(90deg, rgba(219,134,49,0.82) 0%, rgba(219,134,49,0.18) 24%, rgba(0,0,0,0) 44%, rgba(0,0,0,0) 56%, rgba(46,143,146,0.2) 76%, rgba(46,143,146,0.78) 100%)"
    : "linear-gradient(90deg, rgba(255,163,92,0.85) 0%, rgba(255,163,92,0.2) 24%, rgba(0,0,0,0) 44%, rgba(0,0,0,0) 56%, rgba(113,214,255,0.22) 76%, rgba(113,214,255,0.82) 100%)";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        paddingBottom: isMobile ? "64px" : "28px",
        fontFamily: theme.observerFontFamily,
        color: theme.text,
        background: starfieldBackground,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: isSolarMode ? 0.14 : 0.42,
          backgroundImage: isSolarMode
            ? "radial-gradient(circle, rgba(255,255,255,0.65) 0 1px, transparent 1.7px), radial-gradient(circle, rgba(54,148,151,0.2) 0 0.9px, transparent 1.4px), radial-gradient(circle, rgba(219,134,49,0.18) 0 0.9px, transparent 1.4px)"
            : "radial-gradient(circle, rgba(255,255,255,0.9) 0 1.1px, transparent 1.8px), radial-gradient(circle, rgba(157,215,255,0.55) 0 0.9px, transparent 1.5px), radial-gradient(circle, rgba(255,229,173,0.48) 0 0.9px, transparent 1.5px)",
          backgroundSize: "220px 220px, 280px 280px, 360px 360px",
          backgroundPosition: "0 0, 60px 100px, 140px 30px",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: isMobile ? "16%" : "14%",
          right: isMobile ? "-84px" : "-48px",
          width: isMobile ? "180px" : "280px",
          height: isMobile ? "180px" : "280px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background: isSolarMode
            ? "radial-gradient(circle at 34% 34%, rgba(255,255,255,0.2) 0%, rgba(255,224,196,0.12) 14%, rgba(220,157,102,0.08) 30%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle at 34% 34%, rgba(255,255,255,0.34) 0%, rgba(201,229,255,0.18) 14%, rgba(110,154,221,0.12) 30%, rgba(42,63,110,0.05) 52%, rgba(0,0,0,0) 70%)",
          boxShadow: isSolarMode ? "0 0 48px rgba(220,157,102,0.08)" : "0 0 80px rgba(114, 176, 255, 0.1)",
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: isMobile ? "-120px" : "-96px",
          bottom: isMobile ? "18%" : "8%",
          width: isMobile ? "190px" : "250px",
          height: isMobile ? "190px" : "250px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background: isSolarMode
            ? "radial-gradient(circle at 30% 30%, rgba(76, 156, 141, 0.1) 0%, rgba(34, 115, 101, 0.06) 32%, rgba(8, 27, 31, 0.02) 64%, rgba(0,0,0,0) 74%)"
            : "radial-gradient(circle at 30% 30%, rgba(73, 226, 176, 0.14) 0%, rgba(34, 115, 101, 0.1) 32%, rgba(8, 27, 31, 0.02) 64%, rgba(0,0,0,0) 74%)",
          boxShadow: isSolarMode ? "0 0 72px rgba(28, 134, 108, 0.05)" : "0 0 100px rgba(28, 134, 108, 0.08)",
        }}
      />
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          height: isMobile ? "48px" : "64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "0 10px" : "0 20px",
          background: isSolarMode
            ? "linear-gradient(180deg, rgba(224, 217, 205, 0.97) 0%, rgba(197, 191, 181, 0.92) 100%)"
            : "linear-gradient(180deg, rgba(22, 30, 45, 0.96) 0%, rgba(11, 17, 28, 0.9) 100%)",
          backdropFilter: "blur(18px)",
          borderBottom: `2px solid ${theme.observerAccent}33`,
          boxShadow: isSolarMode ? "0 10px 24px rgba(108, 95, 76, 0.14)" : "0 10px 30px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: showDesktopSidebar ? `${consoleSidebarWidth}px` : "18px",
            right: "18px",
            bottom: "6px",
            height: "2px",
            background: bridgeAccentLines,
            opacity: 0.65,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "14px" }}>
          <span className="material-symbols-outlined" style={{ color: theme.observerAccent, fontSize: isMobile ? "16px" : "24px" }}>
            settings_input_component
          </span>
          <div
            style={{
              fontFamily: theme.observerHeadingFamily,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: theme.observerAccent,
              fontSize: isMobile ? "0.68rem" : "1.05rem",
              textTransform: "uppercase",
            }}
          >
            ORBITAL_OS_v.72
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
          {isMobile ? (
            <button
              onClick={() => startOutsiderTutorial(0)}
              style={{
                width: "30px",
                height: "30px",
                padding: 0,
                borderRadius: "2px",
                border: `1px solid ${theme.inputBorder}`,
                background: showOutsiderTutorial ? `${theme.observerAccent}18` : theme.softButtonBackground,
                color: showOutsiderTutorial ? theme.observerAccent : theme.text,
                display: "grid",
                placeItems: "center",
              }}
              aria-label={showOutsiderTutorial ? "Outsider tutorial open" : "Start outsider tutorial"}
              disabled={showOutsiderTutorial}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                school
              </span>
            </button>
          ) : (
            <button
              onClick={() => startOutsiderTutorial(0)}
              style={{
                padding: "8px 10px",
                borderRadius: "2px",
                border: `1px solid ${theme.inputBorder}`,
                background: showOutsiderTutorial ? `${theme.observerAccent}18` : theme.softButtonBackground,
                color: showOutsiderTutorial ? theme.observerAccent : theme.text,
                fontFamily: theme.observerFontFamily,
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
              disabled={showOutsiderTutorial}
            >
              {showOutsiderTutorial ? "Tutorial Open" : "Tutorial"}
            </button>
          )}
          <div style={{ textAlign: "right", display: viewportWidth < 640 ? "none" : "block" }}>
            <p style={{ margin: 0, fontSize: "10px", color: `${theme.observerAccent}99`, textTransform: "uppercase" }}>
              System Integrity
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: theme.observerAccent }}>NOMINAL_98%</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: isMobile ? "30px" : "auto",
              height: isMobile ? "30px" : "auto",
              padding: isMobile ? 0 : "8px 10px",
              borderRadius: "2px",
              border: `1px solid ${theme.inputBorder}`,
              background: theme.softButtonBackground,
              color: theme.text,
              fontFamily: theme.observerFontFamily,
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Logout"
          >
            {isMobile ? (
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                logout
              </span>
            ) : (
              "Logout"
            )}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: isMobile ? "30px" : "34px",
              height: isMobile ? "30px" : "34px",
              borderRadius: "2px",
              border: `1px solid ${theme.inputBorder}`,
              background: theme.observerPanelFrame,
              color: theme.text,
              display: "grid",
              placeItems: "center",
            }}
            aria-label={darkMode ? "Switch to light console mode" : "Switch to dark console mode"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              contrast
            </span>
          </button>
        </div>
      </header>

      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${consoleSidebarWidth}px`,
          background: cockpitPanelBackground,
          borderRight: `1px solid ${theme.observerAccent}18`,
          paddingTop: "80px",
          display: showDesktopSidebar ? "flex" : "none",
          flexDirection: "column",
          gap: "8px",
          zIndex: 40,
          boxShadow: isSolarMode ? "inset -1px 0 0 rgba(255,255,255,0.18), 20px 0 28px rgba(108,95,76,0.1)" : "inset -1px 0 0 rgba(255,255,255,0.03), 20px 0 40px rgba(0,0,0,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "14px",
            right: "14px",
            height: "10px",
            borderRadius: "999px",
            background: isSolarMode
              ? "linear-gradient(90deg, rgba(219,134,49,0.52) 0%, rgba(219,134,49,0.14) 14%, rgba(0,0,0,0) 36%, rgba(0,0,0,0) 64%, rgba(46,143,146,0.16) 86%, rgba(46,143,146,0.44) 100%)"
              : "linear-gradient(90deg, rgba(255,160,90,0.58) 0%, rgba(255,160,90,0.16) 14%, rgba(0,0,0,0) 36%, rgba(0,0,0,0) 64%, rgba(117,205,255,0.18) 86%, rgba(117,205,255,0.54) 100%)",
            opacity: 0.6,
          }}
        />
        <div style={{ padding: "0 24px 16px" }}>
          <p style={{ margin: 0, color: theme.observerAccentAlt, letterSpacing: "0.18em", fontSize: "11px", textTransform: "uppercase" }}>
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
                background: item.active
                  ? isSolarMode
                    ? "linear-gradient(90deg, rgba(219, 134, 49, 0.2) 0%, rgba(219, 134, 49, 0.08) 72%, rgba(219, 134, 49, 0) 100%)"
                    : "linear-gradient(90deg, rgba(39, 215, 161, 0.2) 0%, rgba(39, 215, 161, 0.08) 72%, rgba(39, 215, 161, 0) 100%)"
                  : "transparent",
                color: item.active ? theme.observerAccent : theme.faintText,
                border: "none",
                borderLeft: item.active ? `4px solid ${theme.observerAccent}` : "4px solid transparent",
                padding: "16px 24px",
                fontFamily: theme.observerFontFamily,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "left",
                position: "relative",
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
            background: isSolarMode
              ? "linear-gradient(180deg, rgba(189, 181, 170, 0.96) 0%, rgba(161, 154, 146, 0.98) 32%, rgba(142, 137, 132, 0.99) 100%)"
              : "linear-gradient(180deg, rgba(44, 56, 76, 0.92) 0%, rgba(23, 31, 46, 0.98) 32%, rgba(12, 18, 29, 0.99) 100%)",
            borderTop: `1px solid ${theme.observerAccent}18`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "10px", color: theme.faintText, textTransform: "uppercase" }}>
            <span>Oxygen_Reserve</span>
            <span style={{ color: theme.observerAccent }}>84%</span>
          </div>
          <div style={{ height: "4px", background: theme.inputBackground }}>
            <div style={{ width: "84%", height: "100%", background: theme.observerAccent }} />
          </div>
        </div>
      </aside>

      <main
        style={{
          marginLeft: showDesktopSidebar ? `${consoleSidebarWidth}px` : 0,
          marginRight: 0,
          paddingTop: isMobile ? "54px" : "80px",
          paddingBottom: showCompactConsoleNav ? (isMobile ? "60px" : "74px") : "24px",
          paddingInline: isMobile ? "4px" : "20px",
          maxWidth: "none",
          width: showDesktopSidebar ? "auto" : "100%",
          boxSizing: "border-box",
          minWidth: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            background: isSolarMode
              ? "linear-gradient(180deg, rgba(196, 188, 177, 0.94) 0%, rgba(172, 165, 156, 0.98) 14%, rgba(150, 145, 139, 0.99) 38%, rgba(136, 132, 129, 1) 100%)"
              : "linear-gradient(180deg, rgba(78, 95, 118, 0.92) 0%, rgba(49, 63, 84, 0.98) 14%, rgba(27, 36, 50, 0.99) 38%, rgba(16, 22, 33, 1) 100%)",
            padding: isMobile ? "8px" : "22px",
            border: isSolarMode ? "1px solid rgba(155, 139, 108, 0.28)" : "1px solid rgba(203, 223, 255, 0.12)",
            borderRadius: isMobile ? "24px 24px 0 0" : "34px 34px 26px 26px",
            boxShadow: isSolarMode ? "0 24px 44px rgba(108,95,76,0.16), inset 0 1px 0 rgba(255,255,255,0.24)" : "0 30px 70px rgba(0,0,0,0.44), inset 0 1px 0 rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          {!isMobile ? (
            <>
              <div
                style={{
                  position: "absolute",
                  left: "22px",
                  top: "22px",
                  bottom: "22px",
                  width: "18px",
                  borderRadius: "18px 6px 6px 18px",
                  background:
                    isSolarMode
                      ? "linear-gradient(180deg, rgba(219,134,49,0.34) 0%, rgba(171,144,112,0.86) 18%, rgba(144,139,133,0.98) 58%, rgba(126,123,120,0.98) 100%)"
                      : "linear-gradient(180deg, rgba(255,162,94,0.22) 0%, rgba(69,50,34,0.72) 18%, rgba(24,30,43,0.98) 58%, rgba(11,16,25,0.98) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  opacity: 0.92,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "22px",
                  top: "22px",
                  bottom: "22px",
                  width: "18px",
                  borderRadius: "6px 18px 18px 6px",
                  background:
                    isSolarMode
                      ? "linear-gradient(180deg, rgba(46,143,146,0.26) 0%, rgba(142,160,159,0.82) 18%, rgba(144,139,133,0.98) 58%, rgba(126,123,120,0.98) 100%)"
                      : "linear-gradient(180deg, rgba(110,191,255,0.2) 0%, rgba(39,57,84,0.74) 18%, rgba(24,30,43,0.98) 58%, rgba(11,16,25,0.98) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  opacity: 0.92,
                }}
              />
            </>
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              background: isSolarMode
                ? "linear-gradient(135deg, rgba(46,143,146,0.08) 0%, rgba(0,0,0,0) 42%), linear-gradient(315deg, rgba(219,134,49,0.08) 0%, rgba(0,0,0,0) 36%)"
                : "linear-gradient(135deg, rgba(0,230,57,0.12) 0%, rgba(0,0,0,0) 42%), linear-gradient(315deg, rgba(255,140,0,0.08) 0%, rgba(0,0,0,0) 36%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: isMobile ? "18px" : "30px",
              right: isMobile ? "18px" : "30px",
              top: isMobile ? "8px" : "12px",
              height: isMobile ? "14px" : "18px",
              borderRadius: "999px",
              background: isSolarMode
                ? "linear-gradient(90deg, rgba(219,134,49,0.42) 0%, rgba(219,134,49,0.16) 12%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 76%, rgba(46,143,146,0.14) 88%, rgba(46,143,146,0.42) 100%)"
                : "linear-gradient(90deg, rgba(255,180,92,0.55) 0%, rgba(255,180,92,0.16) 12%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 76%, rgba(110,184,255,0.16) 88%, rgba(110,184,255,0.5) 100%)",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
          {!isMobile ? (
            <>
              <div
                style={{
                  position: "absolute",
                  left: "56px",
                  top: "18px",
                  width: "180px",
                  height: "6px",
                  borderRadius: "999px",
                  background: isSolarMode ? "linear-gradient(90deg, rgba(219,134,49,0.78) 0%, rgba(219,134,49,0.18) 100%)" : "linear-gradient(90deg, rgba(255,171,99,0.88) 0%, rgba(255,171,99,0.18) 100%)",
                  opacity: 0.72,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "56px",
                  top: "18px",
                  width: "180px",
                  height: "6px",
                  borderRadius: "999px",
                  background: isSolarMode ? "linear-gradient(90deg, rgba(46,143,146,0.18) 0%, rgba(46,143,146,0.72) 100%)" : "linear-gradient(90deg, rgba(109,193,255,0.18) 0%, rgba(109,193,255,0.88) 100%)",
                  opacity: 0.72,
                  pointerEvents: "none",
                }}
              />
            </>
          ) : null}
          <div
            className="orbital-crt-glow"
            style={{
              position: "relative",
              background: viewportGlassBackground,
              borderRadius: isMobile ? "18px 18px 12px 12px" : "22px",
              border: isSolarMode ? "1px solid rgba(156, 141, 112, 0.24)" : "1px solid rgba(172, 216, 255, 0.12)",
              padding: isMobile ? "18px 14px 18px" : "30px 28px 28px",
              minHeight: isMobile ? "auto" : "600px",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "18px" : "24px",
              overflow: "hidden",
              boxShadow: isSolarMode
                ? "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 18px 44px rgba(255,255,255,0.06), inset 0 -18px 30px rgba(116,100,78,0.08)"
                : "inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 18px 44px rgba(102, 142, 255, 0.035), inset 0 -18px 30px rgba(0,0,0,0.18)",
            }}
          >
            {!isMobile ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: "18px",
                    right: "18px",
                    top: "14px",
                    height: "14px",
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 1.2fr",
                    gap: "14px",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  <div style={{ borderRadius: "999px", background: isSolarMode ? "linear-gradient(90deg, rgba(219,134,49,0.34) 0%, rgba(219,134,49,0.08) 100%)" : "linear-gradient(90deg, rgba(255,166,96,0.48) 0%, rgba(255,166,96,0.08) 100%)" }} />
                  <div style={{ borderRadius: "999px", background: "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 100%)" }} />
                  <div style={{ borderRadius: "999px", background: isSolarMode ? "linear-gradient(90deg, rgba(46,143,146,0.08) 0%, rgba(46,143,146,0.42) 100%)" : "linear-gradient(90deg, rgba(107,196,255,0.08) 0%, rgba(107,196,255,0.48) 100%)" }} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "26px",
                    right: "26px",
                    bottom: "18px",
                    height: "12px",
                    display: "grid",
                    gridTemplateColumns: "0.9fr 1.4fr 0.9fr",
                    gap: "16px",
                    pointerEvents: "none",
                    zIndex: 1,
                    opacity: 0.72,
                  }}
                >
                  <div style={{ borderRadius: "999px", background: isSolarMode ? "linear-gradient(90deg, rgba(219,134,49,0.18) 0%, rgba(219,134,49,0.34) 100%)" : "linear-gradient(90deg, rgba(255,166,96,0.18) 0%, rgba(255,166,96,0.42) 100%)" }} />
                  <div style={{ borderRadius: "999px", background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.05) 100%)" }} />
                  <div style={{ borderRadius: "999px", background: isSolarMode ? "linear-gradient(90deg, rgba(46,143,146,0.34) 0%, rgba(46,143,146,0.14) 100%)" : "linear-gradient(90deg, rgba(107,196,255,0.42) 0%, rgba(107,196,255,0.18) 100%)" }} />
                </div>
              </>
            ) : null}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.22,
                backgroundImage: isSolarMode
                  ? "radial-gradient(circle, rgba(255,255,255,0.42) 0 1px, transparent 1.7px), radial-gradient(circle, rgba(46,143,146,0.22) 0 0.9px, transparent 1.5px), radial-gradient(circle, rgba(219,134,49,0.16) 0 0.9px, transparent 1.4px)"
                  : "radial-gradient(circle, rgba(255,255,255,0.9) 0 1.2px, transparent 1.9px), radial-gradient(circle, rgba(118,191,255,0.46) 0 1px, transparent 1.6px), radial-gradient(circle, rgba(255,208,122,0.34) 0 1px, transparent 1.5px)",
                backgroundSize: "180px 180px, 260px 260px, 320px 320px",
                backgroundPosition: "0 0, 60px 100px, 140px 30px",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: isMobile ? "-62px" : "-34px",
                top: isMobile ? "8%" : "6%",
                width: isMobile ? "120px" : "160px",
                height: isMobile ? "120px" : "160px",
                borderRadius: "50%",
                background: isSolarMode
                  ? "radial-gradient(circle at 34% 34%, rgba(255,255,255,0.18) 0%, rgba(255,224,196,0.1) 18%, rgba(219,134,49,0.06) 42%, rgba(0,0,0,0) 72%)"
                  : "radial-gradient(circle at 34% 34%, rgba(255,255,255,0.38) 0%, rgba(214, 229, 255, 0.14) 18%, rgba(109, 151, 221, 0.08) 42%, rgba(0,0,0,0) 72%)",
                pointerEvents: "none",
                zIndex: 0,
                filter: "blur(0.5px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "-14%",
                bottom: "-18%",
                width: "48%",
                height: "30%",
                background: isSolarMode
                  ? "radial-gradient(ellipse at center, rgba(46,143,146,0.1) 0%, rgba(46,143,146,0.04) 30%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(ellipse at center, rgba(32, 122, 108, 0.16) 0%, rgba(32, 122, 108, 0.05) 30%, rgba(0,0,0,0) 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            {!isMobile ? (
              <div
                style={{
                  position: "absolute",
                  inset: "44px 18px 40px",
                  border: isSolarMode ? "1px solid rgba(155, 139, 108, 0.14)" : "1px solid rgba(122, 158, 200, 0.08)",
                  borderRadius: "18px",
                  pointerEvents: "none",
                  zIndex: 1,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
                }}
              />
            ) : null}
            <div className="orbital-scanlines" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.28 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "flex-start",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "16px",
                  borderBottom: `1px solid ${theme.observerAccent}33`,
                  paddingBottom: isMobile ? "12px" : "16px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "Newsreader, serif",
                      fontSize: isMobile ? "clamp(1.65rem, 8vw, 2.3rem)" : "clamp(1.9rem, 4vw, 3rem)",
                      color: theme.text,
                      lineHeight: 1.02,
                    }}
                  >
                    {pageTitle}
                  </h2>
                  <p
                    style={{
                      margin: isMobile ? "6px 0 0" : "8px 0 0",
                      fontSize: isMobile ? "10px" : "11px",
                      color: theme.observerAccent,
                      letterSpacing: isMobile ? "0.12em" : "0.18em",
                      textTransform: "uppercase",
                      lineHeight: 1.5,
                    }}
                  >
                    {pageSubline}
                  </p>
                </div>
                <div
                  style={{
                    padding: isMobile ? "8px 10px" : "10px 14px",
                    border: `1px solid ${theme.observerAccent}55`,
                    background: `${theme.observerAccent}12`,
                    color: theme.observerAccent,
                    fontSize: isMobile ? "10px" : "12px",
                    textTransform: "uppercase",
                    letterSpacing: isMobile ? "0.04em" : "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "6px" : "8px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    minWidth: isMobile ? "100%" : "auto",
                    justifyContent: "center",
                    alignSelf: isMobile ? "stretch" : "auto",
                  }}
                >
                  <span style={{ width: isMobile ? "7px" : "9px", height: isMobile ? "7px" : "9px", borderRadius: "50%", background: theme.observerAccent, boxShadow: `0 0 12px ${theme.observerAccent}` }} />
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
                  color: theme.faintText,
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
        </div>
      </main>

      {showCompactConsoleNav ? (
      <footer
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 55,
          height: isMobile ? "52px" : "58px",
          background: isSolarMode
            ? "linear-gradient(180deg, rgba(214, 208, 198, 0.96) 0%, rgba(186, 181, 172, 0.98) 100%)"
            : "linear-gradient(180deg, rgba(12, 18, 31, 0.94) 0%, rgba(9, 16, 27, 0.98) 100%)",
          borderTop: `2px solid ${theme.inputBorder}`,
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
                color: active ? theme.observerAccent : theme.faintText,
                borderTop: active ? `2px solid ${theme.observerAccent}` : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? "2px" : "4px",
                paddingBottom: isMobile ? "4px" : "6px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "16px" : "18px" }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: theme.observerHeadingFamily,
                  fontSize: isMobile ? "7px" : "8px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </footer>
      ) : null}

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
