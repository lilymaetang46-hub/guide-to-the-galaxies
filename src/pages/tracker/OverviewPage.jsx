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

function TrackerOverviewPage({ app }) {
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
          gridTemplateColumns: "minmax(280px, 1fr) minmax(540px, 2fr) minmax(280px, 1fr)",
          gap: "32px",
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: "32px" }}>
          <section style={glassPanelStyle(theme)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: "2rem", color: theme.trackerAccent }}>
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
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: "2rem", color: theme.trackerAccent }}>
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
                fontSize: "1.35rem",
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
              <button style={{ padding: "10px 12px", border: "1px solid rgba(216,185,255,0.3)", borderRadius: "999px", background: "transparent", color: theme.trackerAccentSoft, fontSize: "10px", textTransform: "uppercase" }}>
                Steady Orbit
              </button>
              <button style={{ padding: "10px 12px", border: "1px solid rgba(216,185,255,0.3)", borderRadius: "999px", background: "transparent", color: theme.trackerAccentSoft, fontSize: "10px", textTransform: "uppercase" }}>
                Spark Pulse
              </button>
            </div>
          </section>
        </aside>

        <div style={{ display: "grid", gap: "32px", justifyItems: "center" }}>
          <section style={{ textAlign: "center", marginBottom: "8px" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: theme.trackerHeadingFamily,
                fontStyle: "italic",
                fontSize: "clamp(4rem, 9vw, 6.8rem)",
                color: theme.trackerAccent,
                textShadow: "0 0 20px rgba(255,240,195,0.3)",
                lineHeight: 0.95,
              }}
            >
              Ritual Alignment
            </h1>
            <p style={{ margin: "18px 0 0", color: "rgba(216,185,255,0.6)", letterSpacing: "0.35em", textTransform: "uppercase", fontSize: "10px" }}>
              Synchronizing your biological pulse with the celestial tide
            </p>
          </section>

          <div style={{ position: "relative", width: "100%", maxWidth: "820px", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "80%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", width: "60%", aspectRatio: "1 / 1", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
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
                <span className="material-symbols-outlined" style={{ fontSize: "52px", color: theme.trackerAccent, fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <div style={{ marginTop: "8px", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: theme.trackerAccent, fontWeight: 700 }}>
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
                        width: `${node.size}px`,
                        height: `${node.size}px`,
                        borderRadius: "50%",
                        background: "rgba(216, 185, 255, 0.08)",
                        border: "1px solid rgba(216, 185, 255, 0.15)",
                        backdropFilter: "blur(12px)",
                        display: "grid",
                        placeItems: "center",
                        transition: "all 0.4s ease",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: node.size > 80 ? "34px" : "28px" }}>
                        {node.icon}
                      </span>
                    </div>
                    <span style={{ marginTop: "12px", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(216,185,255,0.6)" }}>
                      {node.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <section style={{ ...glassPanelStyle(theme), width: "100%", maxWidth: "620px", padding: "28px 40px", borderRadius: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "34px" }}>
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

        <aside style={{ display: "grid", gap: "32px" }}>
          <section style={glassPanelStyle(theme)}>
            <h3 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: "2rem", color: theme.trackerAccent }}>
              Signal Protocol
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px", marginBottom: "28px" }}>
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

          <section style={{ display: "grid", gap: "24px" }}>
            <div style={{ ...glassPanelStyle(theme), background: "rgba(0,0,0,0.46)" }}>
              <span style={trackerSectionLabel("rgba(169,199,255,0.6)")}>Stellar Phase</span>
              <h4 style={{ margin: "10px 0 0", fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: "2rem", color: theme.text }}>
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
              <h4 style={{ margin: 0, fontFamily: theme.trackerHeadingFamily, fontStyle: "italic", fontSize: "2rem", color: theme.text }}>
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
