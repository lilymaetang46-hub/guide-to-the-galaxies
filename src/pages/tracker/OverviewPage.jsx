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
      { key: "meds", label: "Meds", icon: "medication", size: 56, x: "44%", y: "82%" },
      { key: "food", label: "Food", icon: "restaurant", size: 78, x: "14%", y: "38%" },
      { key: "sleep", label: "Sleep", icon: "bedtime", size: 92, x: "80%", y: "56%" },
      { key: "exercise", label: "Exercise", icon: "fitness_center", size: 70, x: "50%", y: "6%" },
      { key: "hygiene", label: "Hygiene", icon: "self_care", size: 68, x: "67%", y: "18%" },
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

          <div style={{ position: "relative", width: "100%", maxWidth: isMobile ? "360px" : "820px", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "80%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", width: "60%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div
              style={{
                position: "absolute",
                width: isMobile ? "132px" : "180px",
                height: isMobile ? "132px" : "180px",
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

          <div style={{ position: "relative", width: "100%", maxWidth: isMobile ? "360px" : "820px", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "80%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(139, 69, 19, 0.14)" }} />
            <div style={{ position: "absolute", width: "60%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(139, 69, 19, 0.2)" }} />
            <div className="observatory-orbit-spin" style={{ position: "absolute", inset: 0 }}>
              {orbitCard(
                "Meds",
                medsCardValue,
                { left: "24%", top: "73%" },
                null,
                "meds"
              )}

              {orbitCard(
                "Food",
                dashboardStats.find((item) => item.key === "food")?.value || "Ready",
                { left: "16%", top: "33%" },
                null,
                "food"
              )}

              {orbitCard(
                "Sleep",
                sleepCardValue,
                { left: "84%", top: "49%" },
                null,
                "sleep"
              )}

              {orbitCard(
                "Exercise",
                dashboardStats.find((item) => item.key === "exercise")?.value || "Move",
                { left: "50%", top: "14%" },
                null,
                "exercise"
              )}

              {orbitCard(
                "Mood",
                moodWord,
                { left: "76%", top: "24%" },
                null,
                "mood"
              )}
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 20,
                width: isMobile ? "132px" : "180px",
                height: isMobile ? "132px" : "180px",
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
