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

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionCardStyle(theme, "goals")}>
        {renderSectionHeader(trackerLabels.streaks, "Create streak goals that read from your tracker automatically.", "Quest", "Quest")}
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

        <div style={{ marginTop: "18px" }}>
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

        <div style={{ marginTop: "18px" }}>
          <button style={primaryButtonStyle(theme)} onClick={createGoal}>Create Goal</button>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
        {renderSectionHeader(`Active ${trackerLabels.streaks}`, "If a streak misses its target, it resets and starts again.", "Glow", "Orbit")}
        {goals.filter((goal) => !goal.completed).length === 0 ? (
          <p style={emptyTextStyle(theme)}>{trackerLabels.emptyStreaks}</p>
        ) : (
          <ul style={mealListStyle}>
            {goals.filter((goal) => !goal.completed).map((goal) => (
              <li key={goal.id} style={goalCardItemStyle(theme)}>
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
          <section className="galaxy-panel" style={sectionCardStyle(theme, "care")}>
            {renderSectionHeader(`Completed ${trackerLabels.streaks}`, "Finished streaks stay here like little celestial landmarks.", "Halo", "Nebula")}
            {goals.filter((goal) => goal.completed).length === 0 ? (
              <p style={emptyTextStyle(theme)}>{`No completed ${trackerLabels.streaks.toLowerCase()} yet.`}</p>
            ) : (
              <ul style={mealListStyle}>
                {goals.filter((goal) => goal.completed).map((goal) => (
                  <li key={goal.id} style={mealItemStyle(theme)}>
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

          <section className="galaxy-panel" style={sectionCardStyle(theme, "dashboard")}>
            {renderSectionHeader(`Collected ${trackerLabels.rewards}`, "Every completed goal adds a themed reward to your collection.", "Dawn", "Starlight")}
            {rewards.length === 0 ? (
              <p style={emptyTextStyle(theme)}>{trackerLabels.emptyRewards}</p>
            ) : (
              <div style={rewardGridStyle}>
                {rewards.map((reward) => (
                  <div key={reward.id} style={rewardCardStyle(theme)}>
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
