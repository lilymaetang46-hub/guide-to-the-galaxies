import useResponsiveViewport from "../../app/useResponsiveViewport";

function consolePanel(theme, accent = "primary") {
  const borderColor =
    accent === "warning" ? "rgba(253, 139, 0, 0.35)" : `${theme.observerAccent}26`;
  const isSolarMode = theme.modeName === "Solar";

  return {
    background:
      accent === "warning"
        ? isSolarMode
          ? "linear-gradient(180deg, rgba(240, 210, 169, 0.96) 0%, rgba(214, 183, 141, 0.99) 100%)"
          : "linear-gradient(180deg, rgba(79, 53, 25, 0.94) 0%, rgba(43, 28, 15, 0.98) 100%)"
        : isSolarMode
        ? "linear-gradient(180deg, rgba(241, 235, 224, 0.98) 0%, rgba(215, 208, 198, 0.995) 100%)"
        : "linear-gradient(180deg, rgba(33, 45, 61, 0.96) 0%, rgba(16, 23, 35, 0.985) 100%)",
    border: `1px solid ${borderColor}`,
    padding: "16px",
    borderRadius: "16px",
    boxShadow: isSolarMode
      ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 20px rgba(122,104,78,0.12)"
      : "inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 24px rgba(0,0,0,0.16)",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
  };
}

function consoleLabel(color = "#6b7078") {
  return {
    margin: 0,
    fontSize: "10px",
    color,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };
}

function OutsiderGoalsPage({ app }) {
  const { width: viewportWidth } = useResponsiveViewport();
  const isMobile = viewportWidth < 768;
  const {
    theme,
    chartsPageStyle,
    observerSectionCardStyle,
    renderSectionHeader,
    observerHeroStyle,
    dashboardKickerStyle,
    dashboardHeadingStyle,
    subtitleStyle,
    selectedOutsider,
    primaryButtonStyle,
    setShowOutsiderChooser,
    setOutsiderPage,
    gridStyle,
    selectedOutsiderPermissions,
    observerLabels,
    rewardCardStyle,
    rewardTitleStyle,
    goalMetaStyle,
    softButtonStyle,
  } = app;

  if (!selectedOutsider) {
    return (
      <div style={chartsPageStyle}>
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "goals")}>
          {renderSectionHeader(
            "Goals",
            "Connect to a tracker first, then approved goal progress will appear here.",
            "Goals",
            "Goals"
          )}
          <p style={subtitleStyle(theme)}>
            No approved tracker is selected yet. Use Overview to request access or wait for approval.
          </p>
          <div style={{ marginTop: "14px" }}>
            <button style={primaryButtonStyle(theme)} onClick={() => setOutsiderPage("outsiderOverview")}>
              Back to Overview
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (theme.observerConsole) {
    const warningTextColor = theme.modeName === "Solar" ? "#9a5710" : "#fd8b00";
    const panelChrome = (accent = "primary") => ({
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      background:
        accent === "warning"
          ? "linear-gradient(90deg, rgba(255,171,92,0.22) 0%, rgba(255,171,92,0.04) 14%, rgba(0,0,0,0) 26%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 16%)"
          : "linear-gradient(90deg, rgba(111,196,255,0.18) 0%, rgba(111,196,255,0.04) 14%, rgba(0,0,0,0) 26%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 16%)",
    });
    const goalCards =
      selectedOutsider.activeGoals?.length > 0
        ? selectedOutsider.activeGoals.map((goal) => ({
            key: goal.id,
            title: goal.name,
            subtitle: `${goal.currentStreakProgress}/${goal.streakLength} ${goal.checkType === "weekly" ? "weeks" : "days"}`,
          }))
        : selectedOutsider.alignments.map((alignment) => ({
            key: alignment.label,
            title: alignment.label,
            subtitle: alignment.summary,
          }));

    return (
      <div style={{ display: "grid", gap: "24px", marginTop: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
          <div style={consolePanel(theme)}>
            <div style={panelChrome()} />
            <p style={consoleLabel()}>[01] CURRENT_TRACKER</p>
            <p style={{ margin: "6px 0 0", fontFamily: "Newsreader, serif", fontSize: isMobile ? "1.45rem" : "1.8rem", color: theme.text }}>
              {selectedOutsider.name}
            </p>
            <p style={{ margin: "10px 0 0", color: "#929095", fontSize: "12px" }}>
              Only high-level approved goal progress is shown here.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, max-content)", gap: "12px", width: isMobile ? "100%" : "auto" }}>
            <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>
              Select Tracker
            </button>
            <button style={softButtonStyle(theme)} onClick={() => setOutsiderPage("outsiderData")}>
              Back to Telemetry
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.25fr) minmax(0, 1fr)",
            gap: isMobile ? "16px" : "24px",
          }}
        >
          {selectedOutsiderPermissions.streaks ? (
            <div style={consolePanel(theme)}>
              <div style={panelChrome()} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                <span style={consoleLabel()}>{observerLabels.streaks}</span>
                <span style={consoleLabel(theme.observerAccent)}>TRACKED</span>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {goalCards.map((goal) => (
                  <div key={goal.key} style={{ border: `1px solid ${theme.observerAccent}22`, padding: "14px" }}>
                    <p style={consoleLabel()}>{goal.title}</p>
                    <p style={{ margin: "6px 0 0", fontFamily: "Newsreader, serif", fontSize: "1.35rem", color: theme.text }}>
                      {goal.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {selectedOutsiderPermissions.rewards ? (
            <div style={consolePanel(theme, "warning")}>
              <div style={panelChrome("warning")} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                <span style={consoleLabel(warningTextColor)}>{observerLabels.rewards}</span>
                <span style={consoleLabel(warningTextColor)}>UNLOCKED</span>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {selectedOutsider.rewards.map((item) => (
                  <div key={item} style={{ border: "1px solid rgba(253, 139, 0, 0.25)", padding: "14px" }}>
                    <p style={{ margin: 0, fontFamily: "Newsreader, serif", fontSize: "1.3rem", color: warningTextColor }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={observerSectionCardStyle(theme, "goals")}>
        {renderSectionHeader("Goals", "Approved goals and progress for the selected tracker.", "Goals", "Goals")}
        <div style={observerHeroStyle(theme)}>
          <div>
            <p style={dashboardKickerStyle(theme)}>Current tracker</p>
            <h3 style={dashboardHeadingStyle(theme)}>{selectedOutsider.name}</h3>
            <p style={subtitleStyle(theme)}>Only high-level approved goal progress is shown here.</p>
          </div>
          <div style={{ width: "100%", maxWidth: "240px" }}>
            <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>Select Tracker</button>
          </div>
        </div>
      </section>

      <div style={gridStyle}>
        {selectedOutsiderPermissions.streaks ? (
          <section className="galaxy-panel" style={observerSectionCardStyle(theme, "signals")}>
            {renderSectionHeader(observerLabels.streaks, "Current approved goal and streak summaries.", "Alignments", "Alignments")}
            {selectedOutsider.activeGoals?.length > 0 ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {selectedOutsider.activeGoals.map((goal) => (
                  <div key={goal.id} style={rewardCardStyle(theme)}>
                    <div style={rewardTitleStyle(theme)}>{goal.name}</div>
                    <div style={goalMetaStyle(theme)}>
                      {goal.currentStreakProgress}/{goal.streakLength} {goal.checkType === "weekly" ? "weeks" : "days"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {selectedOutsider.alignments.map((alignment) => (
                  <div key={alignment.label} style={rewardCardStyle(theme)}>
                    <div style={rewardTitleStyle(theme)}>{alignment.label}</div>
                    <div style={goalMetaStyle(theme)}>{alignment.summary}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {selectedOutsiderPermissions.rewards ? (
          <section className="galaxy-panel" style={observerSectionCardStyle(theme, "care")}>
            {renderSectionHeader(observerLabels.rewards, "Recently approved rewards from the selected tracker.", "Rewards", "Rewards")}
            <div style={{ display: "grid", gap: "12px" }}>
              {selectedOutsider.rewards.map((item) => (
                <div key={item} style={rewardCardStyle(theme)}>
                  <div style={rewardTitleStyle(theme)}>{item}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default OutsiderGoalsPage;
