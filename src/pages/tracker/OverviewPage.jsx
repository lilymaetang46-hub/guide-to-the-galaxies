function glassPanelStyle(theme, accent = "default") {
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
    energyFlowCards,
  } = app;

  if (isReefTrackerTheme(theme)) {
    const trackerUiFamily = theme.trackerUiFamily || theme.trackerBodyFamily;
    const tideLogs = [
      {
        time: "08:42 AM",
        color: theme.trackerAccentSoft,
        detail:
          recentActivityItems[0]?.title ||
          "Kelp forest density increased by 12% near sector 7.",
      },
      {
        time: "07:15 AM",
        color: "#ffffff",
        detail:
          dashboardStats.find((item) => item.key === "sleep")?.note ||
          "Thermal vent stabilization complete. Flow rate steady.",
      },
      {
        time: "05:30 AM",
        color: "#ffb38a",
        detail:
          dashboardStats.find((item) => item.key === "mood")?.note ||
          "Migration currents remain calm across the reef.",
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
    const currentSpeed = ((mood + focus + energy) / 3 + 10.7).toFixed(1);
    const surfaceTemp =
      dashboardStats.find((item) => item.key === "sleep")?.value || "24.5";

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
              Coral Vitality
            </h3>
            <div style={{ height: "120px", display: "flex", alignItems: "end", gap: "10px" }}>
              {[45, 70, 90, 60, 75].map((height, index) => (
                <div
                  key={`reef-bar-${index}`}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: index === 2 ? "#ffffff" : index % 2 === 0 ? "rgba(79,209,217,0.7)" : "rgba(255,140,148,0.7)",
                    borderRadius: "999px 999px 0 0",
                    borderTop: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: index === 2 ? "0 0 20px rgba(255,255,255,0.35)" : "none",
                  }}
                />
              ))}
            </div>
          </section>
        </aside>

        <section style={{ display: "grid", gap: isMobile ? "18px" : "26px", justifyItems: "center", order: isMobile ? 1 : 0 }}>
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
                    <span style={{ fontSize: isMobile ? "1rem" : "1.5rem", color: theme.trackerAccent, marginLeft: "4px" }}>kn</span>
                  </span>
                  <span style={{ fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.2rem" : "1.7rem", color: theme.text }}>
                    Surface Drift
                  </span>
                </div>
              </div>
            </div>

            <div className="observatory-orbit-spin" style={{ position: "absolute", inset: 0 }}>
              {[
                { icon: "water_drop", value: "84%", top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.y, left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.exercise.x, variant: "teal" },
                { icon: "flare", value: "LUME", top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.food.y, left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.food.x, variant: "pink" },
                { icon: "waves", value: "Calm", top: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.y, left: CANONICAL_OVERVIEW_ORBIT_POSITIONS.sleep.x, variant: "peach" },
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

          <div style={{ textAlign: "center", marginTop: "4px" }}>
            <h1 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontWeight: 900, fontSize: isMobile ? "clamp(2.9rem, 14vw, 4.8rem)" : "clamp(4.6rem, 9vw, 6rem)", color: theme.text, letterSpacing: "-0.04em" }}>
              The Shallows
            </h1>
            <p style={{ margin: "12px 0 0", fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.4rem" : "2rem", color: theme.trackerAccent }}>
              {`High Noon Current - ${surfaceTemp} C`}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: isMobile ? "12px" : "24px", width: "100%", maxWidth: "760px", paddingInline: isMobile ? "4px" : "16px" }}>
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
              Frequency
            </h2>
            <div style={{ position: "relative", height: "176px", width: "100%", overflow: "hidden", borderRadius: "24px", background: "rgba(0,0,0,0.4)", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <svg viewBox="0 0 400 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path className="reef-waveform-primary" d="M0 100 Q 50 20, 100 100 T 200 100 T 300 100 T 400 100" fill="none" stroke="#4fd1d9" strokeWidth="4" />
                <path className="reef-waveform-secondary" d="M0 120 Q 50 40, 100 120 T 200 120 T 300 120 T 400 120" fill="none" stroke="#ff8c94" strokeDasharray="8 8" strokeWidth="2" opacity="0.72" />
              </svg>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { label: "Oscillation", value: "42.8 Hz", color: theme.text },
                { label: "Amplitude", value: "1.4m", color: "#ffb38a" },
                { label: "Status", value: "ACTIVE", color: theme.trackerAccentSoft },
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
                98% Integrity
              </h4>
              <p style={{ margin: "12px 0 0", fontFamily: theme.trackerBodyFamily, fontStyle: "italic", fontSize: isMobile ? "1.2rem" : "1.5rem", color: theme.text }}>
                Sector 12 thriving.
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
    const centerDepth = Math.round(760 + mood * 10 + focus * 6 + energy * 8);
    const telemetryItems = [
      {
        time: "09:12",
        color: theme.trackerAccent,
        detail:
          recentActivityItems[0]?.title ||
          dashboardStats.find((item) => item.key === "food")?.note ||
          "Nutrient intake verified.",
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
          `Pressure sensors recalibrated. Current mood reading ${mood}/5.`,
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
      dashboardStats.find((item) => item.key === "sleep")?.value || "REM Stage";
    const ritualCard =
      rewards[0]?.name || nextRewardGoal?.name || "Deep Sleep";

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

        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? "18px" : "26px", order: isMobile ? 1 : 0 }}>
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
                Depth Status
              </span>
              <h1 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontWeight: 300, fontStyle: "italic", fontSize: isMobile ? "clamp(4rem, 24vw, 6.4rem)" : "clamp(6rem, 13vw, 8.5rem)", lineHeight: 0.88, color: theme.text, textShadow: "0 0 40px rgba(34,211,238,0.12)" }}>
                {centerDepth}
              </h1>
              <span style={{ display: "block", marginTop: "16px", fontFamily: trackerUiFamily, fontSize: isMobile ? "10px" : "12px", textTransform: "uppercase", letterSpacing: "0.18em", color: theme.trackerAbyssDepthText || theme.faintText }}>
                Meters Below Shelf
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
                Ritual
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
            Re-Align Sonar
          </button>
          <p style={{ margin: 0, fontFamily: trackerUiFamily, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: theme.faintText }}>
            Automatic sync in 04:20
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
              <span>Alpha Waves</span>
              <span style={{ color: theme.trackerAccentSoft, fontWeight: 700 }}>Synced</span>
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
              {metricBar("Mood / Serenity", `${moodPercent}%`, theme.trackerAccent, `${moodPercent}%`)}
              {metricBar("Osmosis Balance", focus >= 4 ? "Optimal" : "Stable", theme.trackerAccentSoft, `${Math.max(focusPercent, 24)}%`)}
              {metricBar("Kinetic Energy", dashboardStats.find((item) => item.key === "exercise")?.value || `${energyPercent}%`, theme.trackerAccent, `${energyPercent}%`)}
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
                  Sleep Depth
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
        time: "22:41:04 UTC",
        title: "Orbital Alignment Confirmed",
        detail: `Core resonance synced with mood ${mood}/5 and energy ${energy}/5.`,
        active: true,
      },
      {
        time: "19:15:22 UTC",
        title: "Deep Space Meditation",
        detail: moodTags.length > 0 ? `${moodTags.join(", ")} logged across the current orbit.` : "Mood words still drifting in the field.",
      },
      {
        time: "14:02:59 UTC",
        title: "Sustenance Intake",
        detail: dashboardStats.find((item) => item.key === "food")?.note || "Fuel ritual awaiting a log.",
      },
      {
        time: "08:30:11 UTC",
        title: "Wake Sequence Initiation",
        detail: `Last action: ${today}`,
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

    const supportQuote =
      supportInbox[0]?.message || "The stars are but beacons of your progress. Keep the orbit steady.";

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
              <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.45rem" : "2rem", color: theme.trackerAccent }}>
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
              View All Streams
            </button>
          </section>

          <section style={{ ...glassPanelStyle(theme, "support"), borderLeft: "2px solid rgba(255,240,195,0.3)" }}>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.45rem" : "2rem", color: theme.trackerAccent }}>
              Support Uplink
            </h3>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
              The Outsider is reaching out. Frequency clear.
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
              Transmit Support
            </button>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", marginTop: "16px" }}>
              <button style={{ padding: "10px 12px", border: "1px solid rgba(216,185,255,0.3)", borderRadius: "999px", background: "transparent", color: theme.trackerAccentSoft, fontSize: "10px", textTransform: "uppercase" }}>
                Steady Orbit
              </button>
              <button style={{ padding: "10px 12px", border: "1px solid rgba(216,185,255,0.3)", borderRadius: "999px", background: "transparent", color: theme.trackerAccentSoft, fontSize: "10px", textTransform: "uppercase" }}>
                Spark Pulse
              </button>
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
                fontSize: isMobile ? "clamp(2.7rem, 16vw, 4.2rem)" : "clamp(4rem, 9vw, 6.8rem)",
                color: theme.trackerAccent,
                textShadow: "0 0 20px rgba(255,240,195,0.3)",
                lineHeight: 0.95,
              }}
            >
              Ritual Alignment
            </h1>
            <p style={{ margin: "18px 0 0", color: "rgba(216,185,255,0.6)", letterSpacing: isMobile ? "0.16em" : "0.35em", textTransform: "uppercase", fontSize: "10px", lineHeight: 1.7 }}>
              Synchronizing your biological pulse with the celestial tide
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
                  The Pulse
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

          <section style={{ ...glassPanelStyle(theme), width: "100%", maxWidth: "620px", padding: isMobile ? "20px 16px" : "28px 40px", borderRadius: isMobile ? "24px" : "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? "24px" : "34px", gap: "12px", flexWrap: "wrap" }}>
              <span style={trackerSectionLabel(theme.subtleText)}>Resonance Map</span>
              <span style={trackerSectionLabel(theme.trackerAccent)}>Harmonizing...</span>
            </div>
            <div style={{ position: "relative", height: "96px", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg, rgba(253,111,133,0.3) 0%, rgba(216,185,255,0.3) 50%, rgba(255,240,195,0.3) 100%)", borderRadius: "999px" }} />
              <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "space-between", top: "-8px" }}>
                <span style={{ ...trackerSectionLabel(theme.trackerError), fontSize: "10px" }}>Void</span>
                <span style={{ ...trackerSectionLabel(theme.trackerAccentSoft), fontSize: "10px" }}>Ether</span>
                <span style={{ ...trackerSectionLabel(theme.trackerAccent), fontSize: "10px" }}>Supernova</span>
              </div>
              <input type="range" min="1" max="5" value={mood} readOnly style={{ width: "100%", height: "48px", background: "transparent", position: "relative", zIndex: 10 }} />
            </div>
          </section>
        </div>

        <aside style={{ display: "grid", gap: isMobile ? "18px" : "32px", order: isMobile ? 3 : 0 }}>
          <section style={glassPanelStyle(theme)}>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.45rem" : "2rem", color: theme.trackerAccent }}>
              Signal Protocol
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginTop: "24px", marginBottom: "28px" }}>
              <div>
                <span style={{ ...trackerSectionLabel("rgba(216,185,255,0.6)"), display: "block", marginBottom: "6px" }}>Orbit Status</span>
                <span style={{ fontSize: "13px", color: theme.trackerAccent, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.trackerAccent }} />
                  STABLE
                </span>
              </div>
              <div>
                <span style={{ ...trackerSectionLabel("rgba(216,185,255,0.6)"), display: "block", marginBottom: "6px" }}>Core Frequency</span>
                <span style={{ fontSize: "13px", color: theme.trackerAccent }}>432 Hz</span>
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
            <div style={{ ...glassPanelStyle(theme), background: "rgba(0,0,0,0.46)" }}>
              <span style={trackerSectionLabel("rgba(169,199,255,0.6)")}>Stellar Phase</span>
              <h4 style={{ margin: "10px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.45rem" : "2rem", color: theme.text }}>
                Waxing Resonance
              </h4>
              <p style={{ margin: "12px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
                Your ritual alignment is 84% congruent. Energy peaks expected in 12h.
              </p>
            </div>
            <div style={{ ...glassPanelStyle(theme), background: "rgba(0,0,0,0.46)" }}>
              <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "16px", background: "rgba(0,0,0,0.4)", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 45% 40%, rgba(253,111,133,0.35) 0%, rgba(216,185,255,0.16) 20%, rgba(0,0,0,0) 55%), radial-gradient(circle at 55% 45%, rgba(255,240,195,0.22) 0%, rgba(0,0,0,0) 20%), linear-gradient(135deg, #05070f 0%, #120815 42%, #090f1f 100%)" }} />
              </div>
              <h4 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.45rem" : "2rem", color: theme.text }}>
                Nebula Tracking
              </h4>
              <p style={{ margin: "12px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
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
    const outputValue = ((mood + focus + energy) / 3 + 0.49).toFixed(2);
    const moodWord =
      mood >= 4 ? "Zenith" : mood >= 3 ? "Radiant" : mood >= 2 ? "Drift" : "Low Sun";
    const leftTelemetryNote =
      dashboardStats.find((item) => item.key === "mood")?.note ||
      "Surface turbulence remains within predicted ritual alignment parameters.";
    const rightSignalTitle =
      dashboardStats.find((item) => item.key === "sleep")?.value || "X-Class 2.4";
    const rightSignalNote =
      dashboardStats.find((item) => item.key === "sleep")?.note ||
      "Rest signal remains warm and steady through the current cycle.";
    const solarTrackingPage =
      selectedTrackingAreaOptions.find((item) =>
        ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(
          item.pageKey || item.id
        )
      )?.pageKey ||
      trackedAreas.find((item) =>
        ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(item)
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
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>Telemetry</span>
              <span className="material-symbols-outlined" style={{ color: theme.secondary, fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
                sensors
              </span>
            </div>
            <div style={{ marginTop: "16px", display: "grid", gap: "14px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtleText, fontWeight: 600 }}>Flux Density</p>
                <div style={{ marginTop: "8px", height: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.36)", overflow: "hidden" }}>
                  <div style={{ width: "74%", height: "100%", background: theme.primary, boxShadow: "0 0 8px rgba(255,193,7,0.8)" }} />
                </div>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtleText, fontWeight: 600 }}>Magnetic Variance</p>
                <div style={{ marginTop: "8px", height: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.36)", overflow: "hidden" }}>
                  <div style={{ width: "42%", height: "100%", background: theme.secondary, boxShadow: "0 0 8px rgba(230,126,34,0.8)" }} />
                </div>
              </div>
            </div>
            <p style={{ margin: "16px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1rem" : "1.2rem", lineHeight: 1.4, color: theme.text }}>
              {leftTelemetryNote}
            </p>
          </section>

          <section style={{ ...glassPlateStyle, padding: isMobile ? "18px" : "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>Solar Phase</span>
              <span className="material-symbols-outlined" style={{ color: theme.secondary, fontSize: "16px" }}>
                wb_sunny
              </span>
            </div>
            <h3 style={{ margin: "14px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.5rem" : "2rem", color: theme.text }}>
              {moodWord}
            </h3>
            <p style={{ margin: "10px 0 0", color: theme.subtleText, lineHeight: 1.6 }}>
              Output is tracking at {outputValue} YW. Warmth and momentum stay centered when the daily rituals remain visible.
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
              Ritual Alignment
            </h1>
            <p style={{ margin: "18px 0 0", color: "rgba(122,82,18,0.62)", letterSpacing: isMobile ? "0.16em" : "0.35em", textTransform: "uppercase", fontSize: "10px", lineHeight: 1.7 }}>
              Synchronizing your biological pulse with the solar tide
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
                Current Output
              </span>
              <span style={{ fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", color: theme.text, fontSize: isMobile ? "2rem" : "3rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                {outputValue}
                <span style={{ fontSize: isMobile ? "1rem" : "1.4rem" }}>YW</span>
              </span>
            </div>
          </div>

          <section style={{ ...glassPlateStyle, width: "100%", maxWidth: "820px", padding: isMobile ? "16px" : "18px 22px" }}>
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
                gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(6, minmax(0, 1fr))",
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
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#7b5a00" }}>Signal</span>
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
              Heat Map
            </span>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: isMobile ? "1.5rem" : "2rem", color: theme.text }}>
              Photosphere Stable
            </h3>
            <p style={{ margin: "12px 0 0", fontSize: "12px", color: theme.subtleText, lineHeight: 1.7 }}>
              Surface conditions remain warm and readable. Solar mode now follows the same tracker frame while keeping the brighter atmosphere.
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
