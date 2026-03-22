function OutsiderGoalsPage({ app }) {
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
