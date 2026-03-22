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
  } = app;

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
