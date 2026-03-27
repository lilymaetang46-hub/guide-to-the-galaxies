import { useState } from "react";

const OBSERVATORY_NAV_ITEMS = [
  { key: "charts", label: "Map", icon: "auto_awesome" },
  { key: "tracking", label: "Log", icon: "terminal" },
  { key: "orbit", label: "Orbit", icon: "adjust" },
  { key: "support", label: "Signal", icon: "rss_feed" },
  { key: "connections", label: "Portal", icon: "blur_on" },
  { key: "settings", label: "Settings", icon: "settings" },
];

const SOLAR_NAV_ITEMS = [
  { key: "mission", label: "Observe", icon: "visibility" },
  { key: "charts", label: "Reflect", icon: "auto_awesome" },
  { key: "tracking", label: "Log", icon: "edit_note" },
  { key: "support", label: "Signal", icon: "notifications" },
  { key: "connections", label: "Orbit", icon: "wb_sunny" },
  { key: "settings", label: "Settings", icon: "settings" },
];

function isObservatoryTrackerTheme(theme) {
  return Boolean(theme?.trackerObservatory && theme?.themeFamily === "galaxy");
}

function isSolarTrackerTheme(theme) {
  return Boolean(theme?.trackerSolar && theme?.themeFamily === "galaxy");
}

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
  tutorialActive,
  children,
}) {
  const [navOpen, setNavOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 900
  );
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const isMobile = viewportWidth < 768;

  const shouldCollapseAfterAction = viewportWidth < 900;

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

  if (isObservatoryTrackerTheme(theme)) {
    const mobileNavActive = (itemKey) => {
      if (itemKey === "charts") {
        return activePage === "charts";
      }

      if (itemKey === "tracking") {
        return ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(activePage);
      }

      if (itemKey === "orbit") {
        return activePage === "mission" || activePage === "dashboard";
      }

      return activePage === itemKey;
    };

    return (
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            paddingBottom: tutorialActive ? "32px" : isMobile ? "124px" : "170px",
            position: "relative",
            color: theme.text,
            fontFamily: theme.trackerBodyFamily,
            overflow: "hidden",
            background: "transparent",
            isolation: "isolate",
          }}
        >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background:
              "linear-gradient(180deg, #020205 0%, #070916 42%, #0b1020 100%)",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            opacity: 1,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.98) 0 1.4px, transparent 1.8px), radial-gradient(circle, rgba(255,255,255,0.78) 0 1px, transparent 1.5px), radial-gradient(circle, rgba(255,240,195,0.85) 0 1.2px, transparent 1.7px), radial-gradient(circle, rgba(216,185,255,0.8) 0 1.1px, transparent 1.6px)",
            backgroundSize: "120px 120px, 180px 180px, 240px 240px, 300px 300px",
            backgroundPosition: "0 0, 40px 70px, 80px 20px, 130px 110px",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            opacity: 0.95,
            backgroundImage:
              "radial-gradient(circle at 8% 18%, rgba(255,255,255,1) 0 1.8px, transparent 2.6px), radial-gradient(circle at 22% 12%, rgba(255,240,195,0.98) 0 1.7px, transparent 2.5px), radial-gradient(circle at 34% 30%, rgba(255,255,255,0.96) 0 1.6px, transparent 2.4px), radial-gradient(circle at 49% 14%, rgba(216,185,255,0.96) 0 1.7px, transparent 2.5px), radial-gradient(circle at 62% 42%, rgba(255,255,255,1) 0 1.8px, transparent 2.6px), radial-gradient(circle at 78% 24%, rgba(169,199,255,0.94) 0 1.7px, transparent 2.5px), radial-gradient(circle at 90% 56%, rgba(255,255,255,0.98) 0 1.8px, transparent 2.6px), radial-gradient(circle at 18% 72%, rgba(255,255,255,0.94) 0 1.6px, transparent 2.4px), radial-gradient(circle at 42% 84%, rgba(255,240,195,0.94) 0 1.7px, transparent 2.5px), radial-gradient(circle at 71% 78%, rgba(255,255,255,0.96) 0 1.7px, transparent 2.5px)",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            opacity: 0.82,
            backgroundImage:
              "radial-gradient(circle at 14% 26%, rgba(255,255,255,0.92) 0 1px, transparent 1.7px), radial-gradient(circle at 20% 32%, rgba(255,255,255,0.78) 0 0.9px, transparent 1.5px), radial-gradient(circle at 27% 36%, rgba(255,240,195,0.82) 0 0.95px, transparent 1.6px), radial-gradient(circle at 35% 42%, rgba(255,255,255,0.9) 0 1px, transparent 1.6px), radial-gradient(circle at 41% 46%, rgba(216,185,255,0.8) 0 0.95px, transparent 1.6px), radial-gradient(circle at 47% 50%, rgba(255,255,255,0.95) 0 1.1px, transparent 1.8px), radial-gradient(circle at 53% 54%, rgba(169,199,255,0.78) 0 0.95px, transparent 1.6px), radial-gradient(circle at 59% 57%, rgba(255,255,255,0.88) 0 1px, transparent 1.6px), radial-gradient(circle at 66% 61%, rgba(255,240,195,0.8) 0 0.95px, transparent 1.6px), radial-gradient(circle at 72% 66%, rgba(255,255,255,0.8) 0 0.9px, transparent 1.5px), radial-gradient(circle at 79% 70%, rgba(255,255,255,0.9) 0 1px, transparent 1.6px), radial-gradient(circle at 85% 74%, rgba(216,185,255,0.76) 0 0.9px, transparent 1.5px), radial-gradient(circle at 24% 44%, rgba(255,255,255,0.74) 0 0.8px, transparent 1.4px), radial-gradient(circle at 31% 40%, rgba(255,255,255,0.72) 0 0.8px, transparent 1.4px), radial-gradient(circle at 57% 60%, rgba(255,255,255,0.72) 0 0.8px, transparent 1.4px), radial-gradient(circle at 69% 56%, rgba(255,255,255,0.7) 0 0.8px, transparent 1.4px)",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: "-12% -6%",
            zIndex: 2,
            pointerEvents: "none",
            opacity: 0.42,
            transform: "rotate(-16deg) scale(1.08)",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.15) 6%, rgba(255,240,195,0.14) 11%, rgba(216,185,255,0.13) 18%, rgba(169,199,255,0.1) 26%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0) 56%)",
            filter: "blur(24px)",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            opacity: 0.14,
            background:
              "radial-gradient(circle at 24% 20%, rgba(216,185,255,0.16) 0%, rgba(216,185,255,0) 28%), radial-gradient(circle at 78% 78%, rgba(169,199,255,0.14) 0%, rgba(169,199,255,0) 30%), radial-gradient(circle at 52% 56%, rgba(255,240,195,0.12) 0%, rgba(255,240,195,0) 34%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            opacity: 0.08,
            background:
              "radial-gradient(circle at 18% 24%, rgba(253,111,133,0.14) 0%, rgba(253,111,133,0) 26%), radial-gradient(circle at 82% 76%, rgba(146,186,255,0.14) 0%, rgba(146,186,255,0) 28%), radial-gradient(circle at 50% 58%, rgba(255,240,195,0.1) 0%, rgba(255,240,195,0) 30%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -5,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -5,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: "-10% -5%",
            zIndex: -4,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -4,
            background: "transparent",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -3,
            background: "transparent",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -3,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            background: "transparent",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            opacity: 0,
            background: "transparent",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            opacity: 0,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 39,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            opacity: 0,
            pointerEvents: "none",
            background: "transparent",
          }}
        />

        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "16px 14px" : "24px 32px",
            background: "rgba(255,255,255,0.94)",
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: theme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: isMobile ? "1.3rem" : "2rem",
                color: theme.trackerAccent,
                textShadow: "0 0 10px rgba(255,240,195,0.4)",
              }}
            >
              The Observatory
            </div>
            <span style={{ fontSize: isMobile ? "7px" : "8px", letterSpacing: isMobile ? "0.28em" : "0.4em", textTransform: "uppercase", color: "rgba(216,185,255,0.4)", fontWeight: 700 }}>
              Vessel ID: 00-OMNIPRESENCE
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "24px" }}>
            <div style={{ display: isMobile ? "none" : "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "12px" }}>
              <span style={{ fontSize: "9px", color: "rgba(255,240,195,0.6)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Signal Strength
              </span>
              <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                {[true, true, true, false].map((active, index) => (
                  <div
                    key={`sig-${index}`}
                    style={{
                      width: "4px",
                      height: "12px",
                      borderRadius: "999px",
                      background: active ? theme.trackerAccent : "rgba(255,240,195,0.16)",
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: "transparent", border: "none", color: "rgba(216,185,255,0.6)", padding: 0 }}
            >
              <span className="material-symbols-outlined">flare</span>
            </button>
            <button
              onClick={() => setActivePage("settings")}
              style={{ background: "transparent", border: "none", color: "rgba(216,185,255,0.6)", padding: 0 }}
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        <main
          style={{
            paddingTop: isMobile ? "92px" : "128px",
            paddingBottom: tutorialActive ? "32px" : isMobile ? "84px" : "96px",
            paddingInline: isMobile ? "12px" : "24px",
            maxWidth: "1600px",
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          {children}
        </main>

        {!tutorialActive ? (
        <nav
          style={{
            position: "fixed",
            bottom: isMobile ? "12px" : "32px",
            left: "50%",
            transform: "translateX(-50%)",
            width: isMobile ? "calc(100% - 16px)" : "min(94%, 680px)",
            zIndex: 50,
            background: "rgba(4, 4, 10, 0.75)",
            background: "rgba(4, 4, 10, 0.56)",
            backdropFilter: "blur(32px) saturate(160%)",
            borderRadius: "999px",
            padding: isMobile ? "12px 10px" : "16px 24px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
          }}
        >
          {OBSERVATORY_NAV_ITEMS.map((item) => {
            const active = mobileNavActive(item.key);

            return (
              <button
                key={item.key}
                onClick={() =>
                  handleSelectPage(
                    item.key === "tracking"
                      ? trackerNavItems.find((navItem) =>
                          ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(navItem.key)
                        )?.key || "mood"
                      : item.key === "charts"
                      ? "charts"
                      : item.key === "orbit"
                      ? "mission"
                      : item.key
                  )
                }
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? theme.trackerAccent : "rgba(216,185,255,0.4)",
                  background: active ? "rgba(255,240,195,0.1)" : "transparent",
                  border: active ? "1px solid rgba(255,240,195,0.2)" : "none",
                  borderRadius: active ? "999px" : "0",
                  padding: active ? (isMobile ? "9px 10px" : "14px 20px") : "0",
                  marginTop: active ? (isMobile ? "-20px" : "-40px") : "0",
                  minWidth: active ? (isMobile ? "58px" : "84px") : "auto",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: active ? (isMobile ? "24px" : "32px") : isMobile ? "20px" : "24px",
                    fontVariationSettings: active ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : undefined,
                  }}
                >
                  {item.icon}
                </span>
                <span style={{ fontSize: active ? (isMobile ? "7px" : "9px") : isMobile ? "7px" : "8px", letterSpacing: isMobile ? "0.06em" : "0.15em", textTransform: "uppercase", marginTop: "4px" }}>
                  {item.label}
                </span>
                {active ? (
                  <div
                    style={{
                      position: "absolute",
                      top: isMobile ? "-2px" : "-4px",
                      right: isMobile ? "6px" : "10px",
                      width: isMobile ? "6px" : "8px",
                      height: isMobile ? "6px" : "8px",
                      borderRadius: "50%",
                      background: theme.trackerAccent,
                      boxShadow: "0 0 20px rgba(255,240,195,0.3)",
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </nav>
        ) : null}
      </div>
    );
  }

  if (isSolarTrackerTheme(theme)) {
    const solarNavActive = (itemKey) => {
      if (itemKey === "mission") {
        return activePage === "mission" || activePage === "dashboard";
      }

       if (itemKey === "tracking") {
        return ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(activePage);
      }

      return activePage === itemKey;
    };

    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          paddingBottom: tutorialActive ? "32px" : isMobile ? "124px" : "170px",
          position: "relative",
          color: theme.text,
          fontFamily: theme.trackerBodyFamily,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: theme.trackerSolarCanvas || theme.pageBackground,
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background: theme.trackerSolarGlow,
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            background: theme.trackerSolarVignette,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: isMobile ? "-80px" : "-140px",
            left: isMobile ? "-80px" : "-140px",
            width: isMobile ? "340px" : "800px",
            height: isMobile ? "340px" : "800px",
            zIndex: 3,
            pointerEvents: "none",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, rgba(255, 193, 7, 0) 70%)",
            mixBlendMode: "color-dodge",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "36px" : "16px",
            right: isMobile ? "-40px" : "10px",
            width: isMobile ? "220px" : "600px",
            height: isMobile ? "220px" : "600px",
            zIndex: 3,
            pointerEvents: "none",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 193, 7, 0.22) 0%, rgba(255, 193, 7, 0) 70%)",
            mixBlendMode: "color-dodge",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.18) 18%, rgba(255,255,255,0) 44%)",
            filter: "blur(34px)",
            opacity: 0.58,
          }}
        />

        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "16px 14px" : "24px 32px",
            background: "rgba(255, 248, 230, 0.56)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(230,126,34,0.12)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: theme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: isMobile ? "1.3rem" : "2rem",
                color: theme.trackerAccent,
                textShadow: "0 0 12px rgba(255,193,7,0.22)",
              }}
            >
              The Observer
            </div>
            <span
              style={{
                fontSize: isMobile ? "7px" : "8px",
                letterSpacing: isMobile ? "0.28em" : "0.4em",
                textTransform: "uppercase",
                color: "rgba(122, 82, 18, 0.5)",
                fontWeight: 700,
              }}
            >
              Vessel ID: 00-HELIOCENTRIC
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "24px" }}>
            <div style={{ display: isMobile ? "none" : "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "12px" }}>
              <span style={{ fontSize: "9px", color: "rgba(122, 82, 18, 0.6)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Solar Flux
              </span>
              <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                {[true, true, true, false].map((active, index) => (
                  <div
                    key={`solar-sig-${index}`}
                    style={{
                      width: "4px",
                      height: "12px",
                      borderRadius: "999px",
                      background: active ? theme.trackerAccent : "rgba(230,126,34,0.16)",
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: "transparent", border: "none", color: theme.text, padding: 0 }}
              aria-label="Switch tracker theme mode"
            >
              <span className="material-symbols-outlined">flare</span>
            </button>
            <button
              onClick={() => setActivePage("settings")}
              style={{ background: "transparent", border: "none", color: theme.text, padding: 0 }}
              aria-label="Open settings"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </nav>

        <main
          style={{
            paddingTop: isMobile ? "92px" : "128px",
            paddingBottom: tutorialActive ? "32px" : isMobile ? "84px" : "96px",
            paddingInline: isMobile ? "12px" : "24px",
            maxWidth: "1600px",
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          {children}
        </main>

        {!tutorialActive ? (
        <nav
          style={{
            position: "fixed",
            bottom: isMobile ? "12px" : "32px",
            left: "50%",
            transform: "translateX(-50%)",
            width: isMobile ? "calc(100% - 16px)" : "min(94%, 680px)",
            zIndex: 50,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: isMobile ? "12px 10px" : "16px 24px",
            background: "rgba(255, 248, 230, 0.66)",
            backdropFilter: "blur(32px) saturate(160%)",
            borderRadius: "999px",
            border: "1px solid rgba(230,126,34,0.14)",
            boxShadow: "0 20px 50px rgba(124,72,16,0.16)",
          }}
        >
          {SOLAR_NAV_ITEMS.map((item) => {
            const active = solarNavActive(item.key);
            return (
              <button
                key={item.key}
                onClick={() =>
                  handleSelectPage(
                    item.key === "tracking"
                      ? trackerNavItems.find((navItem) =>
                          ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(navItem.key)
                        )?.key || "mood"
                      : item.key
                  )
                }
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? theme.trackerAccent : "rgba(122, 82, 18, 0.48)",
                  background: active ? "rgba(255,255,255,0.42)" : "transparent",
                  border: active ? "1px solid rgba(230,126,34,0.22)" : "none",
                  borderRadius: active ? "999px" : "0",
                  padding: active ? (isMobile ? "9px 10px" : "14px 20px") : "0",
                  marginTop: active ? (isMobile ? "-20px" : "-40px") : "0",
                  minWidth: active ? (isMobile ? "58px" : "84px") : "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  boxShadow: active ? "0 12px 24px rgba(230,126,34,0.16)" : "none",
                  borderWidth: active ? "1px" : 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: active ? (isMobile ? "24px" : "32px") : isMobile ? "20px" : "24px",
                    fontVariationSettings: active ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : undefined,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: active ? (isMobile ? "7px" : "9px") : isMobile ? "7px" : "8px",
                    textTransform: "uppercase",
                    letterSpacing: isMobile ? "0.06em" : "0.15em",
                    marginTop: "4px",
                  }}
                >
                  {item.label}
                </span>
                {active ? (
                  <div
                    style={{
                      position: "absolute",
                      top: isMobile ? "-2px" : "-4px",
                      right: isMobile ? "6px" : "10px",
                      width: isMobile ? "6px" : "8px",
                      height: isMobile ? "6px" : "8px",
                      borderRadius: "50%",
                      background: theme.trackerAccent,
                      boxShadow: "0 0 20px rgba(230,126,34,0.28)",
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </nav>
        ) : null}
      </div>
    );
  }

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
