import LineTrendChart from "../../components/LineTrendChart";

function OutsiderTrackerDataPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    observerSectionCardStyle,
    renderSectionHeader,
    outsiderEnvironmentLabel,
    selectedOutsider,
    observerHeroStyle,
    dashboardKickerStyle,
    dashboardHeadingStyle,
    subtitleStyle,
    primaryButtonStyle,
    setShowOutsiderChooser,
    setOutsiderPage,
    gridStyle,
    observerLabels,
    smallInfoStyle,
    summaryCardStyle,
    summaryLabelStyle,
    summaryValueStyle,
    selectedOutsiderPermissions,
    selectedOutsiderHistory,
    selectedOutsiderChartData,
    outsiderMoodLabel,
    summaryNoteStyle,
    chartStackStyle,
    chartCardStyle,
  } = app;

  if (!selectedOutsider) {
    return (
      <div style={chartsPageStyle}>
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
          {renderSectionHeader(
            "Tracker Data",
            "Connect to a tracker first, then shared data and charts will appear here.",
            "Overview",
            "Overview"
          )}
          <p style={smallInfoStyle(theme)}>
            No approved tracker is selected yet. Use Overview to send a connection request or wait for approval.
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

  const latestChartWindow = selectedOutsiderChartData;
  const hasTrendData = selectedOutsiderHistory.length > 0;

  const overviewCards = [
    selectedOutsiderPermissions.mood && {
      label: "Mood",
      value: `${selectedOutsider.moodScore}/5`,
      note: `Current read: ${outsiderMoodLabel}`,
    },
    selectedOutsiderPermissions.food && {
      label: "Meals / 14d",
      value: selectedOutsider.comparisonStats?.[0]?.value ?? 0,
      note: "Shared count only",
    },
    selectedOutsiderPermissions.exercise && {
      label: "Movement / 14d",
      value: selectedOutsider.comparisonStats?.[1]?.value ?? 0,
      note: "Shared count only",
    },
    (selectedOutsiderPermissions.mood || selectedOutsiderPermissions.sleep) && {
      label: "Mood avg",
      value: selectedOutsider.comparisonStats?.[2]?.value ?? "N/A",
      note: "Average across recent shared check-ins",
    },
  ].filter(Boolean);

  const wellbeingSeries = [
    selectedOutsiderPermissions.mood && {
      key: "mood",
      label: "Mood",
      color: theme.chartPalette.mood,
    },
    selectedOutsiderPermissions.sleep && {
      key: "sleepQuality",
      label: "Sleep",
      color: theme.chartPalette.focus,
    },
    selectedOutsiderPermissions.mood && {
      key: "energy",
      label: "Energy",
      color: theme.chartPalette.energy,
    },
  ].filter(Boolean);

  const routineSeries = [
    selectedOutsiderPermissions.food && {
      key: "mealsCount",
      label: "Meals",
      color: theme.chartPalette.meals,
    },
    selectedOutsiderPermissions.exercise && {
      key: "exerciseCount",
      label: "Movement",
      color: theme.chartPalette.exercise,
    },
    selectedOutsiderPermissions.hygiene && {
      key: "hygieneCount",
      label: "Hygiene",
      color: theme.chartPalette.hygiene,
    },
  ].filter(Boolean);

  const medsSeries = [
    selectedOutsiderPermissions.meds && {
      key: "medsTaken",
      label: "Medication check",
      color: theme.chartPalette.meds,
    },
    selectedOutsiderPermissions.meds && {
      key: "medsCount",
      label: "Medication logs",
      color: theme.chartPalette.meals,
    },
  ].filter(Boolean);

  const routineMax = Math.max(
    1,
    ...latestChartWindow.map((item) =>
      Math.max(item.mealsCount ?? 0, item.exerciseCount ?? 0, item.hygieneCount ?? 0)
    )
  );
  const medsMax = Math.max(
    1,
    ...latestChartWindow.map((item) => Math.max(item.medsCount ?? 0, item.medsTaken ?? 0))
  );

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
        {renderSectionHeader(
          "Tracker Data",
          `${outsiderEnvironmentLabel} for ${selectedOutsider.name}. Charts are included below.`,
          "Overview",
          "Overview"
        )}
        <div style={observerHeroStyle(theme)}>
          <div>
            <p style={dashboardKickerStyle(theme)}>Selected tracker</p>
            <h3 style={dashboardHeadingStyle(theme)}>{selectedOutsider.name}</h3>
            <p style={subtitleStyle(theme)}>
              Theme family: {selectedOutsider.themeFamily} · Shared summaries only, no private notes.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "240px" }}>
            <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>
              Select Tracker
            </button>
          </div>
        </div>
      </section>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "signals")}>
          {renderSectionHeader(
            observerLabels.status,
            "A simple overall read on how things look right now.",
            "Status",
            "Status"
          )}
          <p style={smallInfoStyle(theme)}>{selectedOutsider.status}</p>
          <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
            {overviewCards.map((item) => (
              <div key={item.label} style={summaryCardStyle(theme)}>
                <div style={summaryLabelStyle(theme)}>{item.label}</div>
                <div style={summaryValueStyle(theme)}>{item.value}</div>
                <div style={summaryNoteStyle(theme)}>{item.note}</div>
              </div>
            ))}
          </div>
        </section>

        {selectedOutsiderPermissions.mood ? (
          <section className="galaxy-panel" style={observerSectionCardStyle(theme, "care")}>
            {renderSectionHeader(
              observerLabels.mood,
              "Simple mood summary from the current view.",
              "Mood",
              "Mood"
            )}
            <p style={smallInfoStyle(theme)}>{outsiderMoodLabel}</p>
            {selectedOutsider.latestEntry ? (
              <p style={smallInfoStyle(theme)}>
                Focus / Energy: {selectedOutsider.latestEntry.focus ?? "N/A"}/5,{" "}
                {selectedOutsider.latestEntry.energy ?? "N/A"}/5
              </p>
            ) : null}
          </section>
        ) : null}
      </div>

      {selectedOutsider.systems.filter((system) => selectedOutsiderPermissions[system.label]).length > 0 ? (
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "jump")}>
          {renderSectionHeader("Systems", "Approved category summaries only.", "Systems", "Systems")}
          <div style={{ display: "grid", gap: "10px" }}>
            {selectedOutsider.systems
              .filter((system) => selectedOutsiderPermissions[system.label])
              .map((system) => (
                <div key={system.label} style={summaryCardStyle(theme)}>
                  <div style={summaryLabelStyle(theme)}>{system.label}</div>
                  <div style={summaryValueStyle(theme)}>{system.value}</div>
                  <div style={summaryNoteStyle(theme)}>{system.note}</div>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      <div style={gridStyle}>
        {selectedOutsiderPermissions.activity ? (
          <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
            {renderSectionHeader(
              observerLabels.activity,
              "Recent shared activity from the tracker.",
              "Activity",
              "Activity"
            )}
            <div style={{ display: "grid", gap: "8px" }}>
              {selectedOutsider.activity.map((item) => (
                <p key={item} style={smallInfoStyle(theme)}>
                  {item}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "goals")}>
          {renderSectionHeader(
            "Trends & Charts",
            "Recent shared patterns across the latest approved check-ins.",
            "Trends",
            "Trends"
          )}
          {!hasTrendData ? (
            <p style={smallInfoStyle(theme)}>No shared trend data yet.</p>
          ) : (
            <div style={chartStackStyle}>
              {wellbeingSeries.length > 0 ? (
                <LineTrendChart
                  title="Shared wellbeing trend"
                  subtitle="High-level emotional and sleep trends only."
                  data={latestChartWindow}
                  yMax={5}
                  theme={theme}
                  chartCardStyle={chartCardStyle}
                  series={wellbeingSeries}
                />
              ) : null}

              {routineSeries.length > 0 ? (
                <LineTrendChart
                  title="Daily routines"
                  subtitle="Shared counts for meals, movement, and resets."
                  data={latestChartWindow}
                  yMax={routineMax}
                  theme={theme}
                  chartCardStyle={chartCardStyle}
                  series={routineSeries}
                />
              ) : null}

              {medsSeries.length > 0 ? (
                <LineTrendChart
                  title="Medication support view"
                  subtitle="Only medication check counts and log counts are shown."
                  data={latestChartWindow}
                  yMax={medsMax}
                  theme={theme}
                  chartCardStyle={chartCardStyle}
                  series={medsSeries}
                />
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default OutsiderTrackerDataPage;
