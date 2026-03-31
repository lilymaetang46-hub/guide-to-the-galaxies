function glassPanelStyle(theme, accent = "default") {
  if (theme?.trackerObservatory) {
    const topLeft = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 84" preserveAspectRatio="xMinYMin meet">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
        <path d="M10 46 Q10 12 46 12 H116" fill="none" stroke="url(#g)" stroke-width="1.8"/>
        <path d="M22 56 Q22 26 54 26 H98" fill="none" stroke="rgba(244,214,122,0.52)" stroke-width="1.1"/>
        <g transform="translate(12 12)"><polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="rgba(255,240,195,0.18)" stroke="#fff0c3" stroke-width="1.2"/><polygon points="0,-6 2.5,-2.5 6,0 2.5,2.5 0,6 -2.5,2.5 -6,0 -2.5,-2.5" fill="rgba(244,214,122,0.22)" stroke="rgba(244,214,122,0.9)" stroke-width="0.8"/></g>
      </svg>
    `)}")`;
    const topRight = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 84" preserveAspectRatio="xMaxYMin meet">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
        <path d="M108 46 Q108 12 72 12 H2" fill="none" stroke="url(#g)" stroke-width="1.8"/>
        <path d="M96 56 Q96 26 64 26 H20" fill="none" stroke="rgba(244,214,122,0.52)" stroke-width="1.1"/>
        <g transform="translate(106 12)"><polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="rgba(255,240,195,0.18)" stroke="#fff0c3" stroke-width="1.2"/><polygon points="0,-6 2.5,-2.5 6,0 2.5,2.5 0,6 -2.5,2.5 -6,0 -2.5,-2.5" fill="rgba(244,214,122,0.22)" stroke="rgba(244,214,122,0.9)" stroke-width="0.8"/></g>
      </svg>
    `)}")`;
    const bottomLeft = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 96" preserveAspectRatio="xMinYMax meet">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
        <path d="M10 48 Q10 84 48 84 H120" fill="none" stroke="url(#g)" stroke-width="1.7"/>
        <path d="M22 38 Q22 70 54 70 H98" fill="none" stroke="rgba(244,214,122,0.5)" stroke-width="1.05"/>
        <path d="M34 30 Q34 58 60 58 H82" fill="none" stroke="rgba(244,214,122,0.22)" stroke-width="0.9"/>
        <g transform="translate(12 84)"><polygon points="0,-8 3.5,-3.5 8,0 3.5,3.5 0,8 -3.5,3.5 -8,0 -3.5,-3.5" fill="rgba(255,240,195,0.16)" stroke="rgba(244,214,122,0.86)" stroke-width="1"/></g>
      </svg>
    `)}")`;
    const bottomRight = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 96" preserveAspectRatio="xMaxYMax meet">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff2c6"/><stop offset="45%" stop-color="#f4d67a"/><stop offset="100%" stop-color="#c89639"/></linearGradient></defs>
        <path d="M112 48 Q112 84 74 84 H2" fill="none" stroke="url(#g)" stroke-width="1.7"/>
        <path d="M100 38 Q100 70 68 70 H24" fill="none" stroke="rgba(244,214,122,0.5)" stroke-width="1.05"/>
        <path d="M88 30 Q88 58 62 58 H40" fill="none" stroke="rgba(244,214,122,0.22)" stroke-width="0.9"/>
        <g transform="translate(110 84)"><polygon points="0,-8 3.5,-3.5 8,0 3.5,3.5 0,8 -3.5,3.5 -8,0 -3.5,-3.5" fill="rgba(255,240,195,0.16)" stroke="rgba(244,214,122,0.86)" stroke-width="1"/></g>
      </svg>
    `)}")`;
    const leftSpine = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 222" preserveAspectRatio="xMinYMid meet">
        <path d="M24 8 C8 28, 8 56, 24 78 C40 100, 40 126, 24 148" fill="none" stroke="rgba(244,214,122,0.62)" stroke-width="1.7"/>
        <path d="M18 24 C6 42, 6 62, 18 78 C30 94, 30 114, 18 128" fill="none" stroke="rgba(244,214,122,0.3)" stroke-width="1"/>
      </svg>
    `)}")`;
    const rightSpine = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 222" preserveAspectRatio="xMaxYMid meet">
        <path d="M10 8 C26 28, 26 56, 10 78 C-6 100, -6 126, 10 148" fill="none" stroke="rgba(244,214,122,0.62)" stroke-width="1.7"/>
        <path d="M16 24 C28 42, 28 62, 16 78 C4 94, 4 114, 16 128" fill="none" stroke="rgba(244,214,122,0.3)" stroke-width="1"/>
      </svg>
    `)}")`;
    const topRail = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 18" preserveAspectRatio="none">
        <path d="M0 8 H154" fill="none" stroke="rgba(244,214,122,0.42)" stroke-width="1"/>
        <path d="M18 2 H136" fill="none" stroke="rgba(244,214,122,0.18)" stroke-width="0.85"/>
      </svg>
    `)}")`;
    const bottomRail = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 18" preserveAspectRatio="none">
        <path d="M0 10 H154" fill="none" stroke="rgba(244,214,122,0.28)" stroke-width="1"/>
        <path d="M18 16 H136" fill="none" stroke="rgba(244,214,122,0.14)" stroke-width="0.85"/>
      </svg>
    `)}")`;

    return {
      backgroundColor: "rgba(4, 4, 10, 0.82)",
      backgroundImage: `${topLeft}, ${topRight}, ${bottomLeft}, ${bottomRight}, ${leftSpine}, ${rightSpine}, ${topRail}, ${topRail}, ${bottomRail}, ${bottomRail}, radial-gradient(circle at 14% 18%, rgba(216,185,255,0.14) 0%, rgba(216,185,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(255,240,195,0.1) 0%, rgba(255,240,195,0) 20%), linear-gradient(180deg, rgba(5,7,16,0.94) 0%, rgba(9,11,24,0.9) 100%)`,
      backgroundSize: "118px 84px, 118px 84px, 122px 96px, 122px 96px, 34px 222px, 34px 222px, 154px 18px, 154px 18px, 154px 18px, 154px 18px, auto, auto, auto",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "18px 18px, calc(100% - 18px) 18px, 18px calc(100% - 18px), calc(100% - 18px) calc(100% - 18px), 18px 68px, calc(100% - 18px) 68px, 34px 18px, calc(100% - 188px) 18px, 34px calc(100% - 18px), calc(100% - 188px) calc(100% - 18px), center, center, center",
      backdropFilter: "blur(32px) saturate(160%)",
      WebkitBackdropFilter: "blur(32px) saturate(160%)",
      border: accent === "support" ? "1px solid rgba(255, 240, 195, 0.22)" : "1px solid rgba(244,214,122,0.14)",
      boxShadow: "0 0 0 1px rgba(255,245,214,0.08), 0 26px 46px rgba(4,8,24,0.34), 0 0 26px rgba(244,214,122,0.08), inset 0 0 0 1px rgba(255,245,214,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
      borderRadius: "30px",
      padding: "30px 28px 26px",
    };
  }

  return {
    background: theme.trackerGlassBackground || "rgba(4, 4, 10, 0.54)",
    backdropFilter: "blur(32px) saturate(160%)",
    WebkitBackdropFilter: "blur(32px) saturate(160%)",
    border: accent === "support" ? "1px solid rgba(255, 240, 195, 0.18)" : theme.border,
    boxShadow: `${theme.shadow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
    borderRadius: "24px",
    padding: "24px",
  };
}

function trackerSectionLabel(color) {
  return {
    fontSize: "9px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color,
    fontWeight: 700,
    margin: 0,
  };
}

function isObservatoryTrackerTheme(theme) {
  return Boolean(theme?.trackerObservatory && theme?.themeFamily === "galaxy");
}

function isSolarTrackerTheme(theme) {
  return Boolean(theme?.trackerSolar && theme?.themeFamily === "galaxy");
}

function isAbyssTrackerTheme(theme) {
  return Boolean(theme?.trackerAbyss && theme?.themeFamily === "underwater");
}

function isReefTrackerTheme(theme) {
  return Boolean(theme?.trackerReef && theme?.themeFamily === "underwater");
}

const CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH = {
  mobile: "360px",
  desktop: "820px",
};

const CANONICAL_OVERVIEW_ORBIT_CORE_SIZE = {
  mobile: 132,
  desktop: 180,
};

const CANONICAL_OVERVIEW_LOWER_PANEL_MAX_WIDTH = "620px";
const REEF_OVERVIEW_ORBIT_TRANSLATE_Y = {
  mobile: "0px",
  desktop: "72px",
};

const CANONICAL_OVERVIEW_ORBIT_POSITIONS = {
  meds: { x: "44%", y: "82%" },
  food: { x: "14%", y: "38%" },
  sleep: { x: "80%", y: "56%" },
  exercise: { x: "50%", y: "6%" },
  hygiene: { x: "67%", y: "18%" },
};

function TrackerOverviewPage({ app }) {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const isMobile = viewportWidth < 768;
  const {
    theme,
    chartsPageStyle,
    sectionCardStyle,
    renderSectionHeader,
    dashboardHeroStyle,
    dashboardKickerStyle,
    dashboardHeadingStyle,
    subtitleStyle,
    dashboardPulseStyle,
    dashboardPulseRingStyle,
    dashboardPulseCoreStyle,
    mood,
    dashboardStatsGridStyle,
    dashboardStats,
    summaryCardStyle,
    summaryLabelStyle,
    summaryValueStyle,
    summaryNoteStyle,
    gridStyle,
    trackerLabels,
    recentMoodSummary,
    smallInfoStyle,
    focus,
    energy,
    moodTags,
    today,
    setActivePage,
    goals,
    simpleAlignmentStreaks,
    emptyTextStyle,
    rewardCardStyle,
    rewardTitleStyle,
    goalMetaStyle,
    goalProgressTrackStyle,
    goalProgressFillStyle,
    rewards,
    nextRewardGoal,
    recentActivityItems,
    supportInbox,
    unreadSupportCount,
    connectedOutsiders,
    trackedAreas,
    selectedTrackingAreaOptions,
  } = app;
  const getDashboardStat = (key) => dashboardStats.find((item) => item.key === key);
  const getDashboardValue = (key, fallback = "Not logged") => getDashboardStat(key)?.value ?? fallback;
  const getDashboardNote = (key, fallback = "No update yet") => getDashboardStat(key)?.note ?? fallback;
  const wellbeingPercent = Math.round(((mood + focus + energy) / 15) * 100);
  const activeGoalsCount = goals.filter((goal) => !goal.completed).length;
  const completedGoalsCount = goals.filter((goal) => goal.completed).length;
  const latestSupportPreview =
    supportInbox[0]?.message ||
    "No support messages yet. Connected outsiders will show up here when they send one.";
  const recentTrackerEvents = (recentActivityItems || []).slice(0, 3);
  const moodStateLabel = mood >= 4 ? "Strong" : mood >= 3 ? "Steady" : mood >= 2 ? "Low" : "Heavy";

  if (isReefTrackerTheme(theme)) {
    const trackerUiFamily = theme.trackerUiFamily || theme.trackerBodyFamily;
    const tideLogs =
      recentTrackerEvents.length > 0
        ? recentTrackerEvents.map((item, index) => ({
            time: index === 0 ? "Most Recent" : `Update ${index + 1}`,
            color: index === 0 ? theme.trackerAccentSoft : index === 1 ? "#ffffff" : "#ffb38a",
            detail: `${item.label}: ${item.detail}`,
          }))
        : [
            {
              time: "Today",
              color: theme.trackerAccentSoft,
              detail: getDashboardNote("food", "No meals logged yet."),
            },
            {
              time: "Today",
              color: "#ffffff",
              detail: getDashboardNote("sleep", "Sleep details have not been logged yet."),
            },
            {
              time: "Today",
              color: "#ffb38a",
              detail: `Mood ${mood}/5, focus ${focus}/5, energy ${energy}/5.`,
            },
          ];
    const hudItems =
      (selectedTrackingAreaOptions?.length
        ? selectedTrackingAreaOptions.map((item) => ({
            key: item.pageKey || item.id,
            label: item.label,
            value:
              dashboardStats.find((stat) => stat.key === (item.pageKey || item.id))?.value ||
              dashboardStats.find((stat) => stat.key === (item.pageKey || item.id))?.note ||
              "Stable",
            icon:
              item.id === "meds"
                ? "medication"
                : item.id === "food"
                ? "restaurant"
                : item.id === "mood"
                ? "mood"
                : item.id === "sleep"
                ? "bedtime"
                : "bubble_chart",
          }))
        : [
            {
              key: "meds",
              label: "Meds",
              icon: "medication",
              value: dashboardStats.find((stat) => stat.key === "meds")?.value || "On track",
            },
            {
              key: "food",
              label: "Food",
              icon: "restaurant",
              value: dashboardStats.find((stat) => stat.key === "food")?.value || "Fueled",
            },
            {
              key: "mood",
              label: "Mood",
              icon: "mood",
              value: dashboardStats.find((stat) => stat.key === "mood")?.value || `${mood}/5`,
            },
            {
              key: "sleep",
              label: "Sleep",
              icon: "bedtime",
              value: dashboardStats.find((stat) => stat.key === "sleep")?.value || "Rested",
            },
          ]).slice(0, 4);
    const currentSpeed = wellbeingPercent;
    const reefStatusLine = `Mood ${mood}/5 • Focus ${focus}/5 • Energy ${energy}/5`;
    const reefVitalityBars = [
      { label: "Mood", value: Math.max(Math.round((mood / 5) * 100), 18), color: "rgba(79,209,217,0.7)" },
      { label: "Focus", value: Math.max(Math.round((focus / 5) * 100), 18), color: "rgba(255,140,148,0.7)" },
      { label: "Energy", value: Math.max(Math.round((energy / 5) * 100), 18), color: "#ffffff" },
      { label: "Goals", value: Math.max(Math.min(activeGoalsCount * 20, 100), 18), color: "rgba(255,140,148,0.7)" },
      { label: "Support", value: Math.max(Math.min(unreadSupportCount * 24, 100), 18), color: "rgba(79,209,217,0.7)" },
    ];

    const reefPanelStyle = (variant = "teal") => ({
      background:
        variant === "pink"
          ? theme.trackerReefPanelPink
          : variant === "peach"
          ? theme.trackerReefPanelPeach
          : theme.trackerReefPanelTeal,
      backdropFilter: "blur(25px) saturate(180%)",
      WebkitBackdropFilter: "blur(25px) saturate(180%)",
      border: `1px solid ${theme.trackerReefPanelBorder || theme.border}`,
      boxShadow: theme.shadow,
      position: "relative",
      overflow: "hidden",
      color: theme.text,
    });
    const reefCardRadius = isMobile ? "24px" : "32px";
    const reefMiniCardRadius = isMobile ? "20px" : "24px";

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 1fr) minmax(540px, 2fr) minmax(280px, 1fr)",
          gap: isMobile ? "18px" : "32px",
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 2 : 0 }}>
          <section
            style={{
              ...reefPanelStyle("teal"),
              borderRadius: reefCardRadius,
              padding: isMobile ? "24px" : "40px",
              minHeight: isMobile ? "auto" : "400px",
            }}
          >
            <h2 style={{ margin: 0, fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "2rem" : "2.4rem", color: theme.text, marginBottom: "28px" }}>
              Tide Logs
            </h2>
            <div style={{ display: "grid", gap: "28px" }}>
              {tideLogs.map((item, index) => (
                <div key={`${item.time}-${index}`} style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                  <span style={{ marginTop: "8px", width: "12px", height: "12px", borderRadius: "50%", background: item.color, boxShadow: `0 0 14px ${item.color}` }} />
                  <div>
                    <p style={{ margin: 0, fontFamily: trackerUiFamily, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.74)" }}>
                      {item.time}
                    </p>
                    <p style={{ margin: "8px 0 0", fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.2rem" : "1.45rem", lineHeight: 1.5, color: theme.text }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActivePage("charts")}
              style={{
                marginTop: "28px",
                width: "100%",
                padding: "14px 18px",
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: theme.text,
                borderRadius: "999px",
                fontFamily: trackerUiFamily,
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                cursor: "pointer",
              }}
            >
              Explore Archive
            </button>
          </section>

          <section
            style={{
              ...reefPanelStyle("peach"),
              borderRadius: reefCardRadius,
              padding: isMobile ? "24px" : "40px",
            }}
          >
            <h3 style={{ margin: 0, fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.8rem" : "2rem", color: theme.text, marginBottom: "20px" }}>
              Daily Readings
            </h3>
            <div style={{ height: "120px", display: "flex", alignItems: "end", gap: "10px" }}>
              {reefVitalityBars.map((item, index) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    height: `${item.value}%`,
                    background: item.color,
                    borderRadius: "999px 999px 0 0",
                    borderTop: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: index === 2 ? "0 0 20px rgba(255,255,255,0.35)" : "none",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "8px", marginTop: "14px" }}>
              {reefVitalityBars.map((item) => (
                <span key={item.label} style={{ textAlign: "center", fontFamily: trackerUiFamily, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.74)" }}>
                  {item.label}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <section style={{ display: "grid", gap: isMobile ? "18px" : "32px", justifyItems: "center", alignContent: "start", paddingTop: isMobile ? "8px" : "24px", order: isMobile ? 1 : 0 }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? "8px" : "0px" }}>
            <h1 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontWeight: 900, fontSize: isMobile ? "clamp(2.9rem, 14vw, 4.8rem)" : "clamp(4.4rem, 8.4vw, 5.8rem)", color: theme.text, letterSpacing: "-0.04em", lineHeight: isMobile ? 0.98 : 1.04 }}>
              Reef Overview
            </h1>
            <p style={{ margin: isMobile ? "12px 0 0" : "18px 0 0", fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.4rem" : "1.8rem", color: theme.trackerAccent }}>
              {reefStatusLine}
            </p>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.mobile : CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.desktop,
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: isMobile ? "18px" : "0px",
              transform: `translateY(${isMobile ? REEF_OVERVIEW_ORBIT_TRANSLATE_Y.mobile : REEF_OVERVIEW_ORBIT_TRANSLATE_Y.desktop})`,
            }}
          >
            <div className="reef-sway" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, pointerEvents: "none" }}>
              <div style={{ width: "80%", height: "80%", border: "60px solid rgba(255,140,148,0.16)", borderRadius: "50% 50% 40% 60%" }} />
            </div>
            <div className="reef-pulse-soft" style={{ position: "absolute", width: "80%", aspectRatio: "1 / 1", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%" }} />
            <div className="reef-pulse-soft" style={{ position: "absolute", width: "60%", aspectRatio: "1 / 1", border: "1px solid rgba(79,209,217,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                className="reef-sway"
                style={{
                  width: `${isMobile ? CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.mobile : CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.desktop}px`,
                  height: `${isMobile ? CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.mobile : CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.desktop}px`,
                  ...reefPanelStyle("teal"),
                  borderRadius: reefCardRadius,
                  boxShadow: "0 0 80px rgba(79,209,217,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "52px" : "72px", color: theme.text, fontVariationSettings: "'FILL' 1" }}>
                  sailing
                </span>
                <div style={{ marginTop: "10px" }}>
                  <span style={{ display: "block", fontFamily: theme.trackerUiFamily, fontSize: isMobile ? "2.6rem" : "3.6rem", fontWeight: 900, color: theme.text }}>
                    {currentSpeed}
                    <span style={{ fontSize: isMobile ? "1rem" : "1.5rem", color: theme.trackerAccent, marginLeft: "4px" }}>%</span>
                  </span>
                  <span style={{ fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.2rem" : "1.7rem", color: theme.text }}>
                    Day Snapshot
                  </span>
                </div>
              </div>
            </div>

            <div className="observatory-orbit-spin" style={{ position: "absolute", inset: 0 }}>
              {[
                { icon: "medication", value: getDashboardValue("meds", "Open"), top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.y, left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.x, variant: "teal" },
                { icon: "restaurant", value: getDashboardValue("food", "Open"), top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.food.y, left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.food.x, variant: "pink" },
                { icon: "bedtime", value: getDashboardValue("sleep", "Open"), top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.y, left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.x, variant: "peach" },
              ].map((chip) => (
                <div
                  key={chip.icon}
                  style={{
                    position: "absolute",
                    top: chip.top,
                    left: chip.left,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="observatory-orbit-counterspin"
                    style={{
                      ...reefPanelStyle(chip.variant),
                      borderRadius: reefMiniCardRadius,
                      padding: isMobile ? "14px" : "18px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: isMobile ? "74px" : "86px",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: theme.text }}>
                      {chip.icon}
                    </span>
                    <span style={{ fontFamily: trackerUiFamily, fontSize: "11px", fontWeight: 900, color: theme.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {chip.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))", gap: isMobile ? "12px" : "18px", width: "100%", maxWidth: CANONICAL_OVERVIEW_LOWER_PANEL_MAX_WIDTH, paddingInline: isMobile ? "4px" : "8px" }}>
            {hudItems.map((item, index) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                style={{
                  background: index % 3 === 1 ? theme.trackerReefPanelPink : index % 3 === 2 ? theme.trackerReefPanelPeach : theme.trackerReefPanelTeal,
                  border: `1px solid ${theme.trackerReefPanelBorder || theme.border}`,
                  borderRadius: reefMiniCardRadius,
                  padding: isMobile ? "12px 10px" : "18px 14px",
                  display: "grid",
                  justifyItems: "center",
                  alignContent: "space-between",
                  gap: "8px",
                  color: theme.text,
                  cursor: "pointer",
                  minHeight: isMobile ? "124px" : "148px",
                  textAlign: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "28px" : "32px" }}>
                  {item.icon}
                </span>
                <div style={{ display: "grid", gap: "6px", justifyItems: "center" }}>
                  <span style={{ fontFamily: trackerUiFamily, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "0.95rem" : "1.1rem", lineHeight: 1.2, maxWidth: "100%", overflowWrap: "anywhere" }}>
                    {item.value}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 3 : 0 }}>
          <section
            style={{
              ...reefPanelStyle("teal"),
              clipPath: "none",
              borderRadius: reefCardRadius,
              padding: isMobile ? "24px" : "40px",
            }}
          >
            <h2 style={{ margin: 0, fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "2rem" : "2.4rem", color: theme.text, marginBottom: "24px" }}>
              Quick Readings
            </h2>
            <div style={{ position: "relative", height: "176px", width: "100%", overflow: "hidden", borderRadius: "24px", background: "rgba(0,0,0,0.4)", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <svg viewBox="0 0 400 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path className="reef-waveform-primary" d="M0 100 Q 50 20, 100 100 T 200 100 T 300 100 T 400 100" fill="none" stroke="#4fd1d9" strokeWidth="4" />
                <path className="reef-waveform-secondary" d="M0 120 Q 50 40, 100 120 T 200 120 T 300 120 T 400 120" fill="none" stroke="#ff8c94" strokeDasharray="8 8" strokeWidth="2" opacity="0.72" />
              </svg>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { label: "Mood", value: `${mood}/5`, color: theme.text },
                { label: "Focus", value: `${focus}/5`, color: "#ffb38a" },
                { label: "Energy", value: `${energy}/5`, color: theme.trackerAccentSoft },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontFamily: trackerUiFamily, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.8)" }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: trackerUiFamily, fontSize: "1.1rem", fontWeight: 900, color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              ...reefPanelStyle("pink"),
              minHeight: isMobile ? "220px" : "288px",
              borderRadius: reefCardRadius,
              padding: isMobile ? "24px" : "40px",
              display: "flex",
              alignItems: "end",
            }}
          >
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: theme.text, marginBottom: "14px", display: "block", fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <h4 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontWeight: 900, fontSize: isMobile ? "2rem" : "2.6rem", lineHeight: 1.05, color: theme.text }}>
                {unreadSupportCount > 0 ? `${unreadSupportCount} New Message${unreadSupportCount === 1 ? "" : "s"}` : `${connectedOutsiders.length} Connected`}
              </h4>
              <p style={{ margin: "12px 0 0", fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.2rem" : "1.5rem", color: theme.text }}>
                {latestSupportPreview}
              </p>
            </div>
          </section>
        </aside>
      </div>
    );
  }

  if (isAbyssTrackerTheme(theme)) {
    const trackerUiFamily = theme.trackerUiFamily || theme.trackerBodyFamily;
    const moodPercent = Math.round((mood / 5) * 100);
    const focusPercent = Math.round((focus / 5) * 100);
    const energyPercent = Math.round((energy / 5) * 100);
    const centerDepth = wellbeingPercent;
    const telemetryItems = [
      {
        time: "09:12",
        color: theme.trackerAccent,
        detail:
          recentActivityItems[0]?.title ||
          dashboardStats.find((item) => item.key === "food")?.note ||
          "No recent tracker updates yet.",
      },
      {
        time: "08:00",
        color: theme.trackerAccentSoft,
        detail:
          dashboardStats.find((item) => item.key === "sleep")?.note ||
          "Sleep cycle completed and pressure settled.",
      },
      {
        time: "07:45",
        color: theme.trackerAccent,
        detail:
          dashboardStats.find((item) => item.key === "mood")?.note ||
          `Mood ${mood}/5, focus ${focus}/5, energy ${energy}/5.`,
      },
    ];
    const abyssQuickCards =
      (selectedTrackingAreaOptions?.length
        ? selectedTrackingAreaOptions.map((item) => ({
            key: item.pageKey || item.id,
            label: item.label,
            value:
              dashboardStats.find((stat) => stat.key === (item.pageKey || item.id))?.value ||
              "Stable",
          }))
        : trackedAreas.map((item) => ({
            key: item,
            label: item.charAt(0).toUpperCase() + item.slice(1),
            value: dashboardStats.find((stat) => stat.key === item)?.value || "Stable",
          }))).slice(0, 2);
    const restCard =
      dashboardStats.find((item) => item.key === "sleep")?.value || "Not logged";
    const ritualCard =
      rewards[0]?.name || nextRewardGoal?.name || "No reward yet";

    const panelStyle = (accent = "teal") => ({
      background: theme.trackerAbyssPanel || "rgba(1, 15, 18, 0.4)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${
        accent === "pink"
          ? "rgba(217,70,239,0.24)"
          : accent === "strong"
          ? "rgba(34,211,238,0.2)"
          : theme.trackerAbyssPanelBorder || "rgba(255,255,255,0.05)"
      }`,
      boxShadow: theme.shadow,
      borderRadius: isMobile ? "28px" : "40px",
      padding: isMobile ? "20px" : "28px",
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
    });

    const metricBar = (label, value, color, width) => (
      <div style={{ display: "grid", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
          <span style={{ fontFamily: trackerUiFamily, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: theme.subtleText }}>
            {label}
          </span>
          <span style={{ fontFamily: trackerUiFamily, fontSize: "11px", fontWeight: 700, color }}>
            {value}
          </span>
        </div>
        <div style={{ height: "8px", borderRadius: "999px", background: theme.track, overflow: "hidden" }}>
          <div style={{ width, height: "100%", borderRadius: "999px", background: color, boxShadow: `0 0 10px ${color}` }} />
        </div>
      </div>
    );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 1fr) minmax(540px, 2fr) minmax(280px, 1fr)",
          gap: isMobile ? "18px" : "32px",
          alignItems: "start",
          minHeight: isMobile ? "auto" : "calc(100vh - 180px)",
        }}
      >
        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 2 : 0 }}>
          <section style={{ ...panelStyle("strong"), minHeight: isMobile ? "auto" : "400px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px" }}>
              <h2 style={{ margin: 0, fontFamily: trackerUiFamily, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.28em", color: theme.trackerAccent }}>
                Telemetry Logs
              </h2>
              <span style={{ fontFamily: trackerUiFamily, fontSize: "10px", color: theme.faintText }}>Real-time</span>
            </div>
            <div style={{ display: "grid", gap: "24px", flex: 1 }}>
              {telemetryItems.map((item, index) => (
                <div key={`${item.time}-${index}`} style={{ borderLeft: `2px solid ${item.color}33`, paddingLeft: "18px" }}>
                  <span style={{ display: "block", marginBottom: "10px", fontFamily: trackerUiFamily, fontSize: "11px", fontWeight: 700, color: item.color }}>
                    {item.time}
                  </span>
                  <p style={{ margin: 0, fontSize: isMobile ? "1.05rem" : "1.25rem", fontStyle: "italic", lineHeight: 1.55, color: theme.subtleText }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => setActivePage("charts")}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: theme.trackerAccent,
                  fontFamily: trackerUiFamily,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                }}
              >
                View Archive
              </button>
            </div>
          </section>

          <section style={{ ...panelStyle(), display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: isMobile ? "56px" : "64px",
                height: isMobile ? "56px" : "64px",
                borderRadius: "50%",
                border: "1px solid rgba(34,211,238,0.25)",
                display: "grid",
                placeItems: "center",
                background: "rgba(34,211,238,0.05)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 0.45, 0.45].map((opacity, index) => (
                  <span key={`habitat-${index}`} style={{ width: "10px", height: "10px", borderRadius: "50%", background: theme.trackerAccent, opacity }} />
                ))}
              </div>
            </div>
            <div>
              <span style={{ display: "block", fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: theme.trackerAccent }}>
                Habitat
              </span>
              <span style={{ display: "block", marginTop: "6px", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.65rem" : "2rem", color: theme.text }}>
                Pure State
              </span>
            </div>
          </section>
        </aside>

        <section style={{ display: "grid", justifyItems: "center", alignContent: "start", gap: isMobile ? "18px" : "26px", order: isMobile ? 1 : 0 }}>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: theme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: isMobile ? "clamp(2.7rem, 16vw, 4.2rem)" : "clamp(4rem, 9vw, 6.8rem)",
                color: theme.text,
                lineHeight: 0.95,
                textShadow: "0 0 30px rgba(34,211,238,0.12)",
              }}
            >
              Depth Alignment
            </h1>
            <p style={{ margin: "18px 0 0", color: theme.faintText, letterSpacing: isMobile ? "0.16em" : "0.35em", textTransform: "uppercase", fontSize: "10px", lineHeight: 1.7, fontFamily: trackerUiFamily }}>
              Synchronizing your daily signals with the abyss current
            </p>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.mobile : CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.desktop,
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[0.8, 0.6].map((scale, index) => (
              <div
                key={`sonar-ring-${index}`}
                style={{
                  position: "absolute",
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  borderRadius: "50%",
                  border: `1px solid rgba(34,211,238,${0.15 - index * 0.04})`,
                }}
              />
            ))}
            <div className="observatory-orbit-spin" style={{ position: "absolute", inset: 0 }}>
              <div
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #22d3ee)",
                  top: "50%",
                  left: "50%",
                  transformOrigin: "left center",
                  transform: "rotate(-62deg)",
                  boxShadow: "0 0 15px #22d3ee",
                  opacity: 0.78,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.y,
                left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.x,
                transform: "translate(-50%, -50%)",
                ...panelStyle("strong"),
                borderRadius: "999px",
                padding: isMobile ? "8px 14px" : "12px 22px",
                background: theme.trackerAbyssPanelStrong || theme.trackerAbyssPanel,
                zIndex: 3,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: trackerUiFamily, fontSize: isMobile ? "10px" : "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: theme.text }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: theme.trackerAccent }} />
                Medication Logged
              </div>
            </div>
            <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              <span style={{ display: "block", fontFamily: trackerUiFamily, fontSize: isMobile ? "10px" : "11px", textTransform: "uppercase", letterSpacing: "0.5em", color: "rgba(34,211,238,0.7)", marginBottom: "10px" }}>
                Today
              </span>
              <h1 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontWeight: 300, fontStyle: "italic", fontSize: isMobile ? "clamp(4rem, 24vw, 6.4rem)" : "clamp(6rem, 13vw, 8.5rem)", lineHeight: 0.88, color: theme.text, textShadow: "0 0 40px rgba(34,211,238,0.12)" }}>
                {centerDepth}
              </h1>
              <span style={{ display: "block", marginTop: "16px", fontFamily: trackerUiFamily, fontSize: isMobile ? "10px" : "12px", textTransform: "uppercase", letterSpacing: "0.18em", color: theme.trackerAbyssDepthText || theme.faintText }}>
                Percent Logged / Steady
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.x,
                top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.y,
                transform: "translate(-50%, -50%)",
                ...panelStyle("pink"),
                minWidth: isMobile ? "118px" : "172px",
                maxWidth: isMobile ? "132px" : "192px",
                padding: isMobile ? "12px 12px" : "18px 22px",
                zIndex: 3,
              }}
            >
              <span style={{ display: "block", fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: theme.trackerAccentSoft }}>
                Next Reward
              </span>
              <span style={{ display: "block", marginTop: "8px", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.35rem" : "2.2rem", lineHeight: 0.95, color: theme.text }}>
                {ritualCard}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActivePage("charts")}
            style={{
              padding: isMobile ? "14px 26px" : "16px 42px",
              borderRadius: "999px",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.35)",
              color: theme.trackerAccent,
              fontFamily: trackerUiFamily,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              boxShadow: "0 0 24px rgba(34,211,238,0.14)",
              cursor: "pointer",
            }}
          >
            Open Charts
          </button>
          <p style={{ margin: 0, fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: theme.faintText }}>
            {activeGoalsCount} active goal{activeGoalsCount === 1 ? "" : "s"} tracked
          </p>
        </section>

        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 3 : 0 }}>
          <section style={panelStyle("pink")}>
            <h3 style={{ margin: 0, fontFamily: trackerUiFamily, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.28em", color: theme.trackerAccentSoft }}>
              Signal Protocol
            </h3>
            <svg viewBox="0 0 200 60" style={{ width: "100%", height: "84px", marginTop: "20px" }}>
              <path d="M0 30 Q 25 10, 50 30 T 100 30 T 150 30 T 200 30" fill="none" stroke={theme.trackerAccentSoft} strokeWidth="1.5" opacity="0.55" />
              <path d="M0 35 Q 25 15, 50 35 T 100 35 T 150 35 T 200 35" fill="none" stroke={theme.trackerAccent} strokeWidth="1.1" />
            </svg>
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: theme.faintText }}>
              <span>Recent Pattern</span>
              <span style={{ color: theme.trackerAccentSoft, fontWeight: 700 }}>{moodStateLabel}</span>
            </div>
          </section>

          <section style={panelStyle("strong")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontFamily: trackerUiFamily, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.28em", color: theme.trackerAccent }}>
                Biometric Flow
              </h3>
              <span className="material-symbols-outlined" style={{ color: theme.trackerAccent }}>analytics</span>
            </div>
            <div style={{ display: "grid", gap: "22px" }}>
              {metricBar("Mood", `${mood}/5`, theme.trackerAccent, `${moodPercent}%`)}
              {metricBar("Focus", `${focus}/5`, theme.trackerAccentSoft, `${Math.max(focusPercent, 24)}%`)}
              {metricBar("Energy", `${energy}/5`, theme.trackerAccent, `${energyPercent}%`)}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            {abyssQuickCards.map((item, index) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                style={{
                  ...panelStyle(index % 2 === 0 ? "strong" : "pink"),
                  aspectRatio: "1 / 1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span className="material-symbols-outlined" style={{ color: index % 2 === 0 ? theme.trackerAccent : theme.trackerAccentSoft, fontSize: "28px" }}>
                  {index % 2 === 0 ? "restaurant" : "pill"}
                </span>
                <div>
                  <span style={{ display: "block", fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: theme.faintText, marginBottom: "6px" }}>
                    {item.label}
                  </span>
                  <span style={{ display: "block", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.35rem" : "1.6rem", color: theme.text }}>
                    {item.value}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <section style={panelStyle("pink")}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(217,70,239,0.16)", display: "grid", placeItems: "center" }}>
                <span className="material-symbols-outlined" style={{ color: theme.trackerAccentSoft }}>bedtime</span>
              </div>
              <div>
                <span style={{ display: "block", fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: theme.trackerAccentSoft }}>
                  Sleep Summary
                </span>
                <span style={{ display: "block", marginTop: "4px", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.8rem" : "2.2rem", color: theme.text }}>
                  {restCard}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "end", height: "64px" }}>
              {[22, 42, 54, 34, 28].map((barHeight, index) => (
                <div
                  key={`sleep-bar-${index}`}
                  style={{
                    flex: 1,
                    height: `${barHeight}px`,
                    borderRadius: "6px 6px 0 0",
                    background: index === 2 ? theme.trackerAccentSoft : "rgba(217,70,239,0.42)",
                    boxShadow: index === 2 ? "0 0 16px rgba(217,70,239,0.55)" : "none",
                  }}
                />
              ))}
            </div>
          </section>
        </aside>
      </div>
    );
  }

  if (isObservatoryTrackerTheme(theme)) {
    const telemetryItems = [
      {
        time: "Current",
        title: "Mood and Energy Check",
        detail: `Mood ${mood}/5, focus ${focus}/5, energy ${energy}/5.`,
        active: true,
      },
      {
        time: "Mood",
        title: "Mood Tags",
        detail: moodTags.length > 0 ? `${moodTags.join(", ")} logged for today.` : "No mood tags selected yet.",
      },
      {
        time: "Tracker",
        title: "Food and Routine",
        detail: getDashboardNote("food", "No food update yet."),
      },
      {
        time: "Today",
        title: "Most Recent Activity",
        detail: recentTrackerEvents[0] ? `${recentTrackerEvents[0].label}: ${recentTrackerEvents[0].detail}` : `Last logged date: ${today}`,
        dim: true,
      },
    ];

    const ritualNodes = [
      { key: "meds", label: "Meds", icon: "medication", size: 56, ...CANONICAL_OVERVIEW_ORBIT_POSITIONS.meds },
      { key: "food", label: "Food", icon: "restaurant", size: 78, ...CANONICAL_OVERVIEW_ORBIT_POSITIONS.food },
      { key: "sleep", label: "Sleep", icon: "bedtime", size: 92, ...CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep },
      { key: "exercise", label: "Exercise", icon: "fitness_center", size: 70, ...CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise },
      { key: "hygiene", label: "Hygiene", icon: "self_care", size: 68, ...CANONICAL_OVERVIEW_ORBIT_POSITIONS.hygiene },
    ].filter((node) => trackedAreas.includes(node.key));

    const supportQuote = latestSupportPreview;
    const observatoryCardTitleSize = isMobile ? "1.28rem" : "1.7rem";
    const observatoryMiniTitleSize = isMobile ? "1.12rem" : "1.42rem";

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 1fr) minmax(540px, 2fr) minmax(280px, 1fr)",
          gap: isMobile ? "18px" : "32px",
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 2 : 0 }}>
          <section style={glassPanelStyle(theme)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: observatoryCardTitleSize, lineHeight: 1.02, color: theme.trackerAccent }}>
                Telemetry Logs
              </h3>
              <span style={{ fontSize: "10px", color: "rgba(216,185,255,0.4)" }}>LIVE</span>
            </div>
            <div style={{ display: "grid", gap: "22px" }}>
              {telemetryItems.map((item, index) => (
                <div key={`${item.title}-${index}`} style={{ position: "relative", paddingLeft: "24px", borderLeft: `1px solid ${index === 0 ? "rgba(255,240,195,0.2)" : "rgba(255,255,255,0.1)"}`, opacity: item.dim ? 0.5 : 1 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: "5px",
                      width: index === 0 ? "10px" : "8px",
                      height: index === 0 ? "10px" : "8px",
                      borderRadius: "50%",
                      background: index === 0 ? theme.trackerAccent : "rgba(216,185,255,0.4)",
                      boxShadow: index === 0 ? "0 0 18px rgba(255,240,195,0.3)" : "none",
                    }}
                  />
                  <p style={{ margin: 0, fontSize: "10px", color: "rgba(216,185,255,0.5)", letterSpacing: "0.08em" }}>{item.time}</p>
                  <p style={{ margin: "8px 0 0", fontSize: "0.95rem", color: theme.text }}>{item.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "11px", color: theme.subtleText, lineHeight: 1.55 }}>{item.detail}</p>
                </div>
              ))}
            </div>
            <button
              style={{
                width: "100%",
                marginTop: "28px",
                padding: "12px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(216,185,255,0.2)",
                background: "transparent",
                color: "rgba(216,185,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "10px",
              }}
              onClick={() => setActivePage("charts")}
            >
              Open Charts
            </button>
          </section>

          <section style={{ ...glassPanelStyle(theme, "support"), borderLeft: "2px solid rgba(255,240,195,0.3)" }}>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: observatoryCardTitleSize, lineHeight: 1.02, color: theme.trackerAccent }}>
              Support Uplink
            </h3>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
              Latest support and quick access to the tracker inbox.
            </p>
            <div
              style={{
                background: "rgba(0,0,0,0.34)",
                backdropFilter: "blur(12px)",
                padding: "18px",
                borderRadius: "20px",
                marginTop: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
                fontStyle: "italic",
                fontSize: isMobile ? "1.05rem" : "1.35rem",
                lineHeight: 1.45,
                color: theme.text,
                fontFamily: theme.trackerHeadingFamily,
              }}
            >
              "{supportQuote}"
            </div>
            <button
              style={{
                width: "100%",
                marginTop: "28px",
                padding: "16px 18px",
                background: theme.primary,
                color: theme.primaryText,
                border: "none",
                borderRadius: "16px",
                fontWeight: 700,
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                boxShadow: "0 0 20px rgba(255,240,195,0.3)",
              }}
              onClick={() => setActivePage("support")}
            >
              Open Support Inbox
            </button>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", marginTop: "16px" }}>
              <div style={{ padding: "10px 12px", border: "1px solid rgba(216,185,255,0.3)", borderRadius: "999px", background: "transparent", color: theme.trackerAccentSoft, fontSize: "10px", textTransform: "uppercase", textAlign: "center" }}>
                {unreadSupportCount} unread
              </div>
              <div style={{ padding: "10px 12px", border: "1px solid rgba(216,185,255,0.3)", borderRadius: "999px", background: "transparent", color: theme.trackerAccentSoft, fontSize: "10px", textTransform: "uppercase", textAlign: "center" }}>
                {connectedOutsiders.length} connected
              </div>
            </div>
          </section>
        </aside>

        <div style={{ display: "grid", gap: isMobile ? "18px" : "32px", justifyItems: "center", order: isMobile ? 1 : 0 }}>
          <section style={{ textAlign: "center", marginBottom: "8px" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: theme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: isMobile ? "clamp(2.55rem, 14vw, 3.9rem)" : "clamp(3.35rem, 6.8vw, 5.2rem)",
                color: theme.trackerAccent,
                textShadow: "0 0 20px rgba(255,240,195,0.3)",
                lineHeight: 0.9,
                maxWidth: isMobile ? "100%" : "560px",
                marginInline: "auto",
              }}
            >
              Tracker Overview
            </h1>
            <p style={{ margin: isMobile ? "12px 0 0" : "14px 0 0", color: "rgba(216,185,255,0.6)", letterSpacing: isMobile ? "0.14em" : "0.26em", textTransform: "uppercase", fontSize: "10px", lineHeight: 1.7, maxWidth: "560px", marginInline: "auto" }}>
              Your current tracker areas orbit around today's mood, routines, and progress
            </p>
          </section>

          <div style={{ position: "relative", width: "100%", maxWidth: isMobile ? CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.mobile : CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.desktop, aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "80%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", width: "60%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div
              style={{
                position: "absolute",
                width: `${isMobile ? CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.mobile : CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.desktop}px`,
                height: `${isMobile ? CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.mobile : CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.desktop}px`,
                borderRadius: "50%",
                background: "rgba(255,240,195,0.08)",
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(255,240,195,0.4)",
                boxShadow: "0 0 40px rgba(255,240,195,0.18)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "40px" : "52px", color: theme.trackerAccent, fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <div style={{ marginTop: "8px", fontSize: "10px", letterSpacing: isMobile ? "0.16em" : "0.3em", textTransform: "uppercase", color: theme.trackerAccent, fontWeight: 700 }}>
                  Day Snapshot
                </div>
                <div style={{ marginTop: "6px", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.25rem" : "1.55rem", color: theme.text }}>
                  {wellbeingPercent}%
                </div>
              </div>
            </div>

            <div className="observatory-orbit-spin" style={{ position: "absolute", inset: 0 }}>
              {ritualNodes.map((node) => (
                <button
                  key={node.key}
                  onClick={() => setActivePage(node.key)}
                  style={{
                    position: "absolute",
                    left: node.x,
                    top: node.y,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    color: theme.trackerAccentSoft,
                    cursor: "pointer",
                  }}
                >
                  <div className="observatory-orbit-counterspin" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: `${isMobile ? Math.max(42, Math.round(node.size * 0.72)) : node.size}px`,
                        height: `${isMobile ? Math.max(42, Math.round(node.size * 0.72)) : node.size}px`,
                        borderRadius: "50%",
                        background: "rgba(216, 185, 255, 0.08)",
                        border: "1px solid rgba(216, 185, 255, 0.15)",
                        backdropFilter: "blur(12px)",
                        display: "grid",
                        placeItems: "center",
                        transition: "all 0.4s ease",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "22px" : node.size > 80 ? "34px" : "28px" }}>
                        {node.icon}
                      </span>
                    </div>
                    <span style={{ marginTop: isMobile ? "8px" : "12px", fontSize: isMobile ? "8px" : "9px", letterSpacing: isMobile ? "0.08em" : "0.2em", textTransform: "uppercase", color: "rgba(216,185,255,0.6)" }}>
                      {node.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <section style={{ ...glassPanelStyle(theme), width: "100%", maxWidth: CANONICAL_OVERVIEW_LOWER_PANEL_MAX_WIDTH, padding: isMobile ? "20px 16px" : "28px 40px", borderRadius: isMobile ? "24px" : "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? "24px" : "34px", gap: "12px", flexWrap: "wrap" }}>
              <span style={trackerSectionLabel(theme.subtleText)}>Mood Check-In</span>
              <span style={trackerSectionLabel(theme.trackerAccent)}>{moodStateLabel}</span>
            </div>
            <div style={{ position: "relative", height: "96px", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg, rgba(253,111,133,0.3) 0%, rgba(216,185,255,0.3) 50%, rgba(255,240,195,0.3) 100%)", borderRadius: "999px" }} />
              <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "space-between", top: "-8px" }}>
                <span style={{ ...trackerSectionLabel(theme.trackerError), fontSize: "10px" }}>Low</span>
                <span style={{ ...trackerSectionLabel(theme.trackerAccentSoft), fontSize: "10px" }}>Steady</span>
                <span style={{ ...trackerSectionLabel(theme.trackerAccent), fontSize: "10px" }}>High</span>
              </div>
              <input type="range" min="1" max="5" value={mood} readOnly style={{ width: "100%", height: "48px", background: "transparent", position: "relative", zIndex: 10 }} />
            </div>
          </section>
        </div>

        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 3 : 0 }}>
          <section style={glassPanelStyle(theme)}>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: observatoryCardTitleSize, lineHeight: 1.02, color: theme.trackerAccent }}>
              Daily Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginTop: "24px", marginBottom: "28px" }}>
              <div>
                <span style={{ ...trackerSectionLabel("rgba(216,185,255,0.6)"), display: "block", marginBottom: "6px" }}>Orbit Status</span>
                <span style={{ fontSize: "13px", color: theme.trackerAccent, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.trackerAccent }} />
                  {moodStateLabel.toUpperCase()}
                </span>
              </div>
              <div>
                <span style={{ ...trackerSectionLabel("rgba(216,185,255,0.6)"), display: "block", marginBottom: "6px" }}>Core Frequency</span>
                <span style={{ fontSize: "13px", color: theme.trackerAccent }}>{activeGoalsCount} active goals</span>
              </div>
            </div>

            <div style={{ height: "132px", display: "flex", alignItems: "end", justifyContent: "space-between", gap: "8px", paddingInline: "8px", marginBottom: "28px" }}>
              {[40, 70, 90, 60, 30, 85, 50].map((height, index) => (
                <div
                  key={`bar-${index}`}
                  style={{
                    width: "10px",
                    height: `${height}%`,
                    borderRadius: "999px 999px 0 0",
                    background: "linear-gradient(0deg, #fd6f85 0%, #d8b9ff 50%, #fff0c3 100%)",
                    filter: "blur(1px)",
                    opacity: 0.4 + index * 0.08,
                  }}
                />
              ))}
            </div>

            <div style={{ position: "relative", height: "86px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <span style={{ ...trackerSectionLabel("rgba(216,185,255,0.4)"), position: "absolute", top: 0, left: 0 }}>Mood Frequency Wave</span>
              <svg viewBox="0 0 200 60" style={{ width: "100%", height: "100%" }}>
                <path d="M0,30 Q25,5 50,30 T100,30 T150,30 T200,30" fill="none" stroke="rgba(216,185,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M0,30 Q25,55 50,30 T100,30 T150,30 T200,30" fill="none" stroke="rgba(255,240,195,0.35)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </section>

          <section style={{ display: "grid", gap: isMobile ? "18px" : "24px" }}>
            <div style={{ ...glassPanelStyle(theme), backgroundColor: "rgba(0,0,0,0.46)", minHeight: isMobile ? "auto" : "180px", display: "grid", alignContent: "start" }}>
              <span style={trackerSectionLabel("rgba(169,199,255,0.6)")}>Stellar Phase</span>
              <h4 style={{ margin: "12px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: observatoryMiniTitleSize, lineHeight: 1.04, color: theme.text, maxWidth: "220px" }}>
                Support Snapshot
              </h4>
              <p style={{ margin: "10px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
                {latestSupportPreview}
              </p>
            </div>
            <div style={{ ...glassPanelStyle(theme), backgroundColor: "rgba(0,0,0,0.46)", minHeight: isMobile ? "auto" : "252px", display: "grid", alignContent: "start" }}>
              <div style={{ aspectRatio: "16 / 8.6", overflow: "hidden", borderRadius: "16px", background: "rgba(0,0,0,0.4)", marginBottom: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 45% 40%, rgba(253,111,133,0.35) 0%, rgba(216,185,255,0.16) 20%, rgba(0,0,0,0) 55%), radial-gradient(circle at 55% 45%, rgba(255,240,195,0.22) 0%, rgba(0,0,0,0) 20%), linear-gradient(135deg, #05070f 0%, #120815 42%, #090f1f 100%)" }} />
              </div>
              <h4 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: observatoryMiniTitleSize, lineHeight: 1.04, color: theme.text }}>
                Sleep and Recovery
              </h4>
              <p style={{ margin: "10px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
                {dashboardStats.find((item) => item.key === "sleep")?.note || "Sleep hygiene has drifted. Recalibrate core rest protocols."}
              </p>
            </div>
          </section>
        </aside>
      </div>
    );
  }

  if (isSolarTrackerTheme(theme)) {
    const medsCardValue =
      dashboardStats.find((item) => item.key === "meds")?.value || "Sync";
    const sleepCardValue =
      dashboardStats.find((item) => item.key === "sleep")?.value || "8.2h";
    const outputValue = wellbeingPercent;
    const moodWord =
      mood >= 4 ? "Strong" : mood >= 3 ? "Steady" : mood >= 2 ? "Low" : "Heavy";
    const leftTelemetryNote =
      dashboardStats.find((item) => item.key === "mood")?.note ||
      "Today's mood note will appear here after you log one.";
    const rightSignalTitle =
      dashboardStats.find((item) => item.key === "sleep")?.value || "Not logged";
    const rightSignalNote =
      dashboardStats.find((item) => item.key === "sleep")?.note ||
      "Sleep details have not been logged yet.";
    const solarTrackingPage =
      selectedTrackingAreaOptions.find((item) =>
        ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "todo", "period", "mood"].includes(
          item.pageKey || item.id
        )
      )?.pageKey ||
      trackedAreas.find((item) =>
        ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "todo", "period", "mood"].includes(item)
      ) ||
      "mood";
    const solarQuickLinks =
      (selectedTrackingAreaOptions?.length
        ? selectedTrackingAreaOptions.map((area) => ({
            key: area.pageKey || area.id,
            label: area.label,
          }))
        : trackedAreas.map((areaId) => ({
            key: areaId,
            label: areaId.charAt(0).toUpperCase() + areaId.slice(1),
          }))).slice(0, 6);

    const glassPlateStyle = {
      backdropFilter: "blur(24px)",
      background: theme.trackerSolarGlass || "rgba(255,255,255,0.22)",
      border: "1.5px solid rgba(255, 193, 7, 0.4)",
      boxShadow: "0 8px 32px rgba(70, 35, 0, 0.15)",
      borderRadius: "24px",
    };

    const floatingCardStyle = {
      backdropFilter: "blur(16px)",
      background: theme.trackerSolarCard || "rgba(255,255,255,0.35)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 10px 30px rgba(70, 35, 0, 0.1), inset 0 0 10px rgba(255,255,255,0.5)",
      borderRadius: isMobile ? "20px 20px 16px 16px" : "22px 22px 18px 18px",
      padding: isMobile ? "10px 12px" : "12px 14px",
      width: isMobile ? "108px" : "132px",
      minHeight: isMobile ? "88px" : "96px",
      display: "grid",
      alignContent: "center",
      justifyItems: "center",
    };

    const orbitCard = (label, value, positionStyle, connectorStyle, pageKey) => (
      <div
        style={{
          position: "absolute",
          zIndex: 30,
          transform: "translate(-50%, -50%)",
          ...positionStyle,
        }}
      >
        <div
          className="observatory-orbit-counterspin"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          {connectorStyle ? <div style={connectorStyle} /> : null}
          <button
            onClick={() => setActivePage(pageKey)}
            style={{
              ...floatingCardStyle,
              textAlign: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <p style={{ margin: 0, fontSize: isMobile ? "9px" : "10px", letterSpacing: isMobile ? "0.14em" : "0.2em", textTransform: "uppercase", color: "#7b5a00", fontWeight: 700 }}>
              {label}
            </p>
            <p style={{ margin: "6px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.2rem" : "1.55rem", lineHeight: 1.05, color: theme.text }}>
              {value}
            </p>
          </button>
        </div>
      </div>
    );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 1fr) minmax(540px, 2fr) minmax(280px, 1fr)",
          gap: isMobile ? "18px" : "32px",
          alignItems: "start",
          width: "100%",
        }}
      >
        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 2 : 0 }}>
          <section style={{ ...glassPlateStyle, padding: isMobile ? "18px" : "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>Mood / Energy</span>
              <span className="material-symbols-outlined" style={{ color: theme.secondary, fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
                sensors
              </span>
            </div>
            <div style={{ marginTop: "16px", display: "grid", gap: "14px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtleText, fontWeight: 600 }}>Mood</p>
                <div style={{ marginTop: "8px", height: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.36)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(Math.round((mood / 5) * 100), 8)}%`, height: "100%", background: theme.primary, boxShadow: "0 0 8px rgba(255,193,7,0.8)" }} />
                </div>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtleText, fontWeight: 600 }}>Energy</p>
                <div style={{ marginTop: "8px", height: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.36)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(Math.round((energy / 5) * 100), 8)}%`, height: "100%", background: theme.secondary, boxShadow: "0 0 8px rgba(230,126,34,0.8)" }} />
                </div>
              </div>
            </div>
            <p style={{ margin: "16px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1rem" : "1.2rem", lineHeight: 1.4, color: theme.text }}>
              {leftTelemetryNote}
            </p>
          </section>

          <section style={{ ...glassPlateStyle, padding: isMobile ? "18px" : "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>Mood State</span>
              <span className="material-symbols-outlined" style={{ color: theme.secondary, fontSize: "16px" }}>
                wb_sunny
              </span>
            </div>
            <h3 style={{ margin: "14px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.5rem" : "2rem", color: theme.text }}>
              {moodWord}
            </h3>
            <p style={{ margin: "10px 0 0", color: theme.subtleText, lineHeight: 1.6 }}>
              Today's overall snapshot is {outputValue}%. This combines mood, focus, and energy into one quick read.
            </p>
          </section>
        </aside>

        <div style={{ display: "grid", gap: isMobile ? "18px" : "28px", justifyItems: "center", order: isMobile ? 1 : 0 }}>
          <section style={{ textAlign: "center", marginBottom: "8px" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: theme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: isMobile ? "clamp(2.7rem, 16vw, 4.2rem)" : "clamp(4rem, 9vw, 6.8rem)",
                color: theme.trackerAccent,
                textShadow: "0 0 20px rgba(255,193,7,0.18)",
                lineHeight: 0.95,
              }}
            >
              Tracker Overview
            </h1>
            <p style={{ margin: "18px 0 0", color: "rgba(122,82,18,0.62)", letterSpacing: isMobile ? "0.16em" : "0.35em", textTransform: "uppercase", fontSize: "10px", lineHeight: 1.7 }}>
              Quick links for the areas you are actively tracking today
            </p>
          </section>

          <div style={{ position: "relative", width: "100%", maxWidth: isMobile ? CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.mobile : CANONICAL_OVERVIEW_ORBIT_MAX_WIDTH.desktop, aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "80%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(139, 69, 19, 0.14)" }} />
            <div style={{ position: "absolute", width: "60%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(139, 69, 19, 0.2)" }} />
            <div className="observatory-orbit-spin" style={{ position: "absolute", inset: 0 }}>
              {orbitCard(
                "Meds",
                medsCardValue,
                { left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.meds.x, top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.meds.y },
                null,
                "meds"
              )}

              {orbitCard(
                "Food",
                dashboardStats.find((item) => item.key === "food")?.value || "Ready",
                { left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.food.x, top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.food.y },
                null,
                "food"
              )}

              {orbitCard(
                "Sleep",
                sleepCardValue,
                { left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.x, top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.y },
                null,
                "sleep"
              )}

              {orbitCard(
                "Exercise",
                dashboardStats.find((item) => item.key === "exercise")?.value || "Move",
                { left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.x, top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.y },
                null,
                "exercise"
              )}

              {orbitCard(
                "Mood",
                moodWord,
                { left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.hygiene.x, top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.hygiene.y },
                null,
                "mood"
              )}
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 20,
                width: `${isMobile ? CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.mobile : CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.desktop}px`,
                height: `${isMobile ? CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.mobile : CANONICAL_OVERVIEW_ORBIT_CORE_SIZE.desktop}px`,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffc107 0%, #fff8dc 100%)",
                boxShadow: "0 0 100px rgba(255,193,7,0.45), inset 0 0 40px rgba(230,126,34,0.22)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: isMobile ? "18px" : "24px",
                border: "8px solid rgba(255,255,255,0.35)",
              }}
            >
              <span style={{ color: "#463600", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "4px" }}>
                Day Snapshot
              </span>
              <span style={{ fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", color: theme.text, fontSize: isMobile ? "2rem" : "3rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                {outputValue}
                <span style={{ fontSize: isMobile ? "1rem" : "1.4rem" }}>%</span>
              </span>
            </div>
          </div>

          <section style={{ ...glassPlateStyle, width: "100%", maxWidth: CANONICAL_OVERVIEW_LOWER_PANEL_MAX_WIDTH, padding: isMobile ? "16px" : "18px 22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "14px",
              }}
            >
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>
                Daily Rituals
              </span>
              <button
                onClick={() => setActivePage(solarTrackingPage)}
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.34)",
                  color: theme.text,
                  padding: "10px 14px",
                  borderRadius: "999px",
                  fontWeight: 700,
                }}
              >
                Open Log
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {solarQuickLinks.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  style={{
                    border: "1px solid rgba(255, 193, 7, 0.22)",
                    background: "rgba(255,255,255,0.34)",
                    color: theme.text,
                    borderRadius: "18px",
                    padding: isMobile ? "12px 10px" : "14px 12px",
                    fontWeight: 700,
                    minHeight: "58px",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 3 : 0 }}>
          <section style={{ ...glassPlateStyle, padding: isMobile ? "18px" : "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>Sleep</span>
              <span className="material-symbols-outlined" style={{ color: theme.secondary, fontSize: "16px" }}>
                wifi_tethering
              </span>
            </div>
            <div style={{ marginTop: "14px", aspectRatio: "16 / 8", borderRadius: "18px", overflow: "hidden", background: "linear-gradient(135deg, #150300 0%, #291100 24%, #ff7b00 60%, #fff2ba 100%)", boxShadow: "0 8px 24px rgba(70,35,0,0.14)" }} />
            <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: theme.subtleText }}>Rest Signal</p>
                <p style={{ margin: "6px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.7rem" : "2rem", color: theme.text }}>
                  {rightSignalTitle}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: 1.6, color: theme.subtleText }}>
                  {rightSignalNote}
                </p>
              </div>
              <button
                onClick={() => setActivePage("charts")}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: theme.secondary,
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 12px 24px rgba(230,126,34,0.24)",
                }}
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>

          <section style={{ ...glassPlateStyle, padding: isMobile ? "18px" : "24px" }}>
            <span style={{ ...trackerSectionLabel("#7b5a00"), display: "block", marginBottom: "10px" }}>
              Goals
            </span>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.5rem" : "2rem", color: theme.text }}>
              {activeGoalsCount > 0 ? `${activeGoalsCount} Active Goal${activeGoalsCount === 1 ? "" : "s"}` : "No Active Goals"}
            </h3>
            <p style={{ margin: "12px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
              {nextRewardGoal
                ? `${nextRewardGoal.name} is ${nextRewardGoal.currentStreakProgress}/${nextRewardGoal.streakLength} complete.`
                : completedGoalsCount > 0
                ? `${completedGoalsCount} goal${completedGoalsCount === 1 ? "" : "s"} completed so far.`
                : "Create a goal to start tracking streak progress here."}
            </p>
          </section>
        </aside>
      </div>
    );
  }

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionCardStyle(theme, "dashboard")}>
        {renderSectionHeader(
          trackerLabels.dashboard,
          trackerLabels.dashboardSubtitle,
          "Halo",
          "Starlight"
        )}
        <div style={dashboardHeroStyle(theme)}>
          <div>
            <p style={dashboardKickerStyle(theme)}>{trackerLabels.dashboardKicker}</p>
            <h3 style={dashboardHeadingStyle(theme)}>{trackerLabels.greeting}</h3>
            <p style={subtitleStyle(theme)}>{trackerLabels.dashboardBody}</p>
          </div>
          <div style={dashboardPulseStyle(theme)}>
            <div style={dashboardPulseRingStyle(theme)} />
            <div style={dashboardPulseCoreStyle(theme)}>{mood}/5</div>
          </div>
        </div>

        <div style={dashboardStatsGridStyle}>
          {dashboardStats.map((item) => (
            <button
              key={item.label}
              style={{
                ...summaryCardStyle(theme),
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => setActivePage(item.key)}
            >
              <div style={summaryLabelStyle(theme)}>{item.label}</div>
              <div style={summaryValueStyle(theme)}>{item.value}</div>
              <div style={summaryNoteStyle(theme)}>{item.note}</div>
            </button>
          ))}
        </div>
      </section>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
          {renderSectionHeader(trackerLabels.mood, trackerLabels.moodSubtitle, "Moon", "Moon")}
          <p style={smallInfoStyle(theme)}>Latest mood: {recentMoodSummary?.mood ?? mood}/5</p>
          <p style={smallInfoStyle(theme)}>
            Mood words:{" "}
            {recentMoodSummary?.mood_tags?.length
              ? recentMoodSummary.mood_tags.join(", ")
              : moodTags.length > 0
              ? moodTags.join(", ")
              : "No tags selected"}
          </p>
          <p style={smallInfoStyle(theme)}>
            Focus / Energy: {recentMoodSummary?.focus ?? focus}/5, {recentMoodSummary?.energy ?? energy}/5
          </p>
          <p style={smallInfoStyle(theme)}>Logged on: {recentMoodSummary?.entry_date || today}</p>
        </section>
      </div>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
        {renderSectionHeader("Connected Outsiders", "People currently approved on your tracker account.", "Connected", "Connected")}
        {connectedOutsiders.length === 0 ? (
          <p style={smallInfoStyle(theme)}>No connected outsiders yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {connectedOutsiders.slice(0, 4).map((outsider) => (
              <div key={outsider.id} style={summaryCardStyle(theme)}>
                <div style={summaryLabelStyle(theme)}>Connected outsider</div>
                <div style={summaryValueStyle(theme)}>{outsider.name}</div>
                <div style={summaryNoteStyle(theme)}>
                  {outsider.notificationCap} notifications per day, {outsider.cooldownLength} minute cooldown
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={sectionCardStyle(theme, "goals")}>
          {renderSectionHeader(trackerLabels.streaks, trackerLabels.streaksSubtitle, "Bloom", "Constellation")}
          {goals.filter((goal) => !goal.completed).length === 0 && simpleAlignmentStreaks.length === 0 ? (
            <p style={emptyTextStyle(theme)}>{trackerLabels.emptyStreaks}</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {(goals.filter((goal) => !goal.completed).length > 0
                ? goals
                    .filter((goal) => !goal.completed)
                    .slice(0, 3)
                    .map((goal) => ({
                      id: goal.id,
                      name: goal.name,
                      progress: goal.currentStreakProgress,
                      target: goal.streakLength,
                      unit: goal.checkType === "weekly" ? "weeks" : "days",
                    }))
                : simpleAlignmentStreaks.map((goal) => ({
                    id: goal.name,
                    name: goal.name,
                    progress: goal.progress,
                    target: Math.max(goal.progress, 1),
                    unit: goal.unit,
                  }))).map((goal) => (
                <div key={goal.id} style={rewardCardStyle(theme)}>
                  <div style={rewardTitleStyle(theme)}>{goal.name}</div>
                  <div style={goalMetaStyle(theme)}>
                    {goal.progress}/{goal.target} {goal.unit}
                  </div>
                  <div style={goalProgressTrackStyle(theme)}>
                    <div
                      style={{
                        ...goalProgressFillStyle(theme),
                        width: `${Math.min(100, (goal.progress / goal.target) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={sectionCardStyle(theme, "dashboard")}>
          {renderSectionHeader(trackerLabels.rewards, trackerLabels.rewardsSubtitle, "Halo", "Starlight")}
          <p style={smallInfoStyle(theme)}>{trackerLabels.rewards} collected: {rewards.length}</p>
          <p style={smallInfoStyle(theme)}>Completed goals: {goals.filter((goal) => goal.completed).length}</p>
          <p style={smallInfoStyle(theme)}>
            Next reward:{" "}
            {nextRewardGoal
              ? `${nextRewardGoal.name} is ${nextRewardGoal.currentStreakProgress}/${nextRewardGoal.streakLength} ${nextRewardGoal.checkType === "weekly" ? "weeks" : "days"} complete`
              : trackerLabels.nextReward}
          </p>
        </section>

        <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
          {renderSectionHeader(trackerLabels.activity, trackerLabels.activitySubtitle, "Glow", "Moon")}
          {recentActivityItems.length === 0 ? (
            <p style={smallInfoStyle(theme)}>{trackerLabels.emptyActivity}</p>
          ) : (
            recentActivityItems.map((item) => (
              <p key={`${item.label}-${item.detail}`} style={smallInfoStyle(theme)}>
                {item.label}: {item.detail}
              </p>
            ))
          )}
        </section>
      </div>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
        {renderSectionHeader("Support Inbox", "Recent nudges from connected outsiders appear here.", "Support", "Support")}
        <p style={smallInfoStyle(theme)}>Unread messages: {unreadSupportCount}</p>
        {supportInbox.length === 0 ? (
          <p style={smallInfoStyle(theme)}>No support messages yet.</p>
        ) : (
          supportInbox.slice(0, 3).map((item) => (
            <p key={item.id} style={smallInfoStyle(theme)}>
              {item.outsiderName}: {item.message}
            </p>
          ))
        )}
      </section>
    </div>
  );
}

export default TrackerOverviewPage;
