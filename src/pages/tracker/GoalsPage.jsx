function TrackerGoalsPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    sectionCardStyle,
    renderSectionHeader,
    trackerLabels,
    goalFormGridStyle,
    labelStyle,
    inputStyle,
    goalName,
    setGoalName,
    goalCategory,
    setGoalCategory,
    goalCategories,
    goalCheckType,
    setGoalCheckType,
    goalTargetAmount,
    setGoalTargetAmount,
    goalStreakLength,
    setGoalStreakLength,
    goalSuggestionHeaderStyle,
    tagGroupLabelStyle,
    smallRemoveButtonStyle,
    refreshGoalSuggestions,
    moodTagGridStyle,
    goalSuggestions,
    goalSuggestionButtonStyle,
    applyGoalSuggestion,
    primaryButtonStyle,
    createGoal,
    emptyTextStyle,
    mealListStyle,
    goals,
    goalCardItemStyle,
    goalMetaStyle,
    goalProgressTrackStyle,
    goalProgressFillStyle,
    rewardGridStyle,
    rewardCardStyle,
    rewardTitleStyle,
    rewards,
    mealItemStyle,
    removeGoal,
  } = app;
  const disableGalaxyFrame =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const sectionStyle = (sectionKey) =>
    sectionCardStyle(theme, sectionKey, { disableCelestialFrame: disableGalaxyFrame });
  const rewardStyle = rewardCardStyle(theme, { disableCelestialFrame: disableGalaxyFrame });
  const goalItemStyle = goalCardItemStyle(theme, { disableCelestialFrame: disableGalaxyFrame });
  const listItemStyle = mealItemStyle(theme, { disableCelestialFrame: disableGalaxyFrame });
  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);
  const hasGoalDraft = Boolean(goalName?.trim()) || goalTargetAmount !== "1" || goalStreakLength !== "7";
  const infoChipStyle = (emphasis = false) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "34px",
    padding: "0.44rem 0.8rem",
    borderRadius: "999px",
    border: emphasis ? "none" : theme.border,
    background: emphasis
      ? theme.primary
      : theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.06)",
    color: emphasis ? theme.primaryText : theme.text,
    fontWeight: 700,
    fontSize: "0.88rem",
  });
  const summaryPanelStyle = {
    display: "grid",
    gap: "14px",
    padding: "16px",
    borderRadius: "22px",
    border: theme.border,
    background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
  };

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionStyle("goals")}>
        {renderSectionHeader(trackerLabels.streaks, "Create one simple streak at a time, then review active and completed goals below.", "Quest", "Quest")}
        <div style={summaryPanelStyle}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Goal builder</p>
            <div style={infoChipStyle(true)}>{hasGoalDraft ? "In progress" : "Ready"}</div>
          </div>
          <div style={goalFormGridStyle}>
            <div>
              <label style={labelStyle(theme)}>Goal name</label>
              <input style={inputStyle(theme)} type="text" placeholder="Golden Ritual" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle(theme)}>Category</label>
              <select style={inputStyle(theme)} value={goalCategory} onChange={(e) => setGoalCategory(e.target.value)}>
                {goalCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle(theme)}>Check type</label>
              <select style={inputStyle(theme)} value={goalCheckType} onChange={(e) => setGoalCheckType(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label style={labelStyle(theme)}>Target amount</label>
              <input style={inputStyle(theme)} type="number" min="1" value={goalTargetAmount} onChange={(e) => setGoalTargetAmount(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle(theme)}>{goalCheckType === "weekly" ? "Streak length (weeks)" : "Streak length (days)"}</label>
              <input style={inputStyle(theme)} type="number" min="1" value={goalStreakLength} onChange={(e) => setGoalStreakLength(e.target.value)} />
            </div>
          </div>
          <div>
            <div style={goalSuggestionHeaderStyle}>
              <p style={tagGroupLabelStyle(theme)}>Suggested names</p>
              <button style={smallRemoveButtonStyle(theme)} onClick={refreshGoalSuggestions}>Refresh Suggestions</button>
            </div>
            <div style={moodTagGridStyle}>
              {goalSuggestions.map((suggestion) => (
                <button key={suggestion} style={goalSuggestionButtonStyle(theme)} onClick={() => applyGoalSuggestion(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button style={primaryButtonStyle(theme)} onClick={createGoal}>Create Goal</button>
          </div>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionStyle("signals")}>
        {renderSectionHeader(`Active ${trackerLabels.streaks}`, "These are the goals currently reading from your tracker data.", "Glow", "Orbit")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px", alignItems: "center" }}>
          <div style={infoChipStyle()}>{`${activeGoals.length} active`}</div>
          <div style={infoChipStyle()}>{`${completedGoals.length} completed`}</div>
          <div style={infoChipStyle()}>{`${rewards.length} rewards`}</div>
        </div>
        {activeGoals.length === 0 ? (
          <p style={emptyTextStyle(theme)}>{trackerLabels.emptyStreaks}</p>
        ) : (
          <ul style={mealListStyle}>
            {activeGoals.map((goal) => (
              <li key={goal.id} style={goalItemStyle}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{goal.name}</div>
                  <div style={goalMetaStyle(theme)}>{goal.category} · {goal.checkType} · target {goal.targetAmount}</div>
                  <div style={goalMetaStyle(theme)}>
                    Streak: {goal.currentStreakProgress}/{goal.streakLength} {goal.checkType === "weekly" ? "weeks" : "days"}
                  </div>
                  <div style={goalProgressTrackStyle(theme)}>
                    <div
                      style={{
                        ...goalProgressFillStyle(theme),
                        width: `${Math.min(100, (goal.currentStreakProgress / goal.streakLength) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <button style={smallRemoveButtonStyle(theme)} onClick={() => removeGoal(goal.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div style={chartsPageStyle}>
        <div style={app.gridStyle}>
          <section className="galaxy-panel" style={sectionStyle("care")}>
            {renderSectionHeader(`Completed ${trackerLabels.streaks}`, "Finished streaks stay here like little celestial landmarks.", "Halo", "Nebula")}
            {completedGoals.length === 0 ? (
              <p style={emptyTextStyle(theme)}>{`No completed ${trackerLabels.streaks.toLowerCase()} yet.`}</p>
            ) : (
              <ul style={mealListStyle}>
                {completedGoals.map((goal) => (
                  <li key={goal.id} style={listItemStyle}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{goal.name}</div>
                      <div style={goalMetaStyle(theme)}>
                        Completed with {goal.currentStreakProgress}/{goal.streakLength} {goal.checkType === "weekly" ? "weeks" : "days"}
                      </div>
                      <div style={goalMetaStyle(theme)}>Reward: {goal.rewardEarned || "Reward unlocked"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="galaxy-panel" style={sectionStyle("dashboard")}>
            {renderSectionHeader(`Collected ${trackerLabels.rewards}`, "Every completed goal adds a themed reward to your collection.", "Dawn", "Starlight")}
            {rewards.length === 0 ? (
              <p style={emptyTextStyle(theme)}>{trackerLabels.emptyRewards}</p>
            ) : (
              <div style={rewardGridStyle}>
                {rewards.map((reward) => (
                  <div key={reward.id} style={rewardStyle}>
                    <div style={rewardTitleStyle(theme)}>{reward.title}</div>
                    <div style={goalMetaStyle(theme)}>{reward.goalName}</div>
                    <div style={goalMetaStyle(theme)}>Earned {reward.earnedAt}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default TrackerGoalsPage;
