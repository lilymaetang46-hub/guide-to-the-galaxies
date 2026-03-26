import LineTrendChart from "../../components/LineTrendChart";

function buildWaveformPath(data, yMax = 5) {
  if (!data?.length) {
    return "M0,50 L400,50";
  }

  const safeMax = Math.max(yMax, 1);

  return data
    .map((item, index) => {
      const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 400;
      const value = Number(item.mood ?? item.energy ?? item.sleepQuality ?? 0);
      const normalized = Math.max(0, Math.min(value, safeMax)) / safeMax;
      const y = 90 - normalized * 60;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function getSignalBars(value) {
  const activeBars = Math.max(1, Math.min(4, Math.round(value)));
  return Array.from({ length: 4 }, (_, index) => index < activeBars);
}

function telemetryPanelStyle(theme, accent = "primary") {
  const accentColor =
    accent === "warning" ? "#fd8b00" : accent === "neutral" ? "#929095" : theme.observerAccent;

  return {
    background: accent === "warning" ? "rgba(253, 139, 0, 0.1)" : "rgba(0,0,0,0.22)",
    border: `1px solid ${accent === "warning" ? "rgba(253, 139, 0, 0.35)" : `${accentColor}26`}`,
    padding: "16px",
    minHeight: 0,
  };
}

function labelStyle(color = "#6b7078") {
  return {
    margin: 0,
    fontSize: "10px",
    color,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };
}

function OutsiderTrackerDataPage({ app }) {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const isMobile = viewportWidth < 768;
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
      label: "Stability",
      value: selectedOutsider.moodScore >= 4 ? "High_Resilience" : selectedOutsider.moodScore >= 3 ? "Adaptive" : "Monitor",
      note: outsiderMoodLabel,
    },
    selectedOutsiderPermissions.mood && {
      label: "Volatility",
      value: selectedOutsider.comparisonStats?.[2]?.value ?? "0.12_EPS",
      note: "Mood average",
    },
    selectedOutsiderPermissions.activity && {
      label: "Sync Rate",
      value: `${Math.max(72, Math.min(99, 80 + selectedOutsiderHistory.length * 2))}%`,
      note: "Recent shared check-ins",
    },
  ].filter(Boolean);

  const systemsStrip = [
    {
      label: "Sensors",
      value: selectedOutsiderPermissions.activity ? "Active_Scan" : "Passive",
      tone: "default",
    },
    {
      label: "Power",
      value: selectedOutsiderPermissions.sleep ? "Aux_Grid_IV" : "Standby",
      tone: "default",
    },
    {
      label: "Biometrics",
      value: selectedOutsider.status || "Stable",
      tone: "accent",
    },
    {
      label: "Coord",
      value: `${selectedOutsider.moodScore ?? 0}.${selectedOutsider.comparisonStats?.[0]?.value ?? 0} / ${selectedOutsider.comparisonStats?.[1]?.value ?? 0}.8`,
      tone: "default",
    },
  ];

  const signalStrength = {
    uplink: getSignalBars((selectedOutsider.moodScore ?? 0) >= 4 ? 3.5 : 3),
    downlink: getSignalBars((selectedOutsiderHistory?.length ?? 0) >= 5 ? 3 : 2),
    latency: `${Math.max(24, 64 - selectedOutsiderHistory.length * 3)}ms`,
  };

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

  if (theme.observerConsole) {
    return (
      <div style={{ display: "grid", gap: "24px", marginTop: "8px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2fr) minmax(260px, 1fr)",
            gap: isMobile ? "16px" : "24px",
          }}
        >
          <div style={telemetryPanelStyle(theme)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "18px" }}>
              <span style={labelStyle()}>[01] MOOD_TREND_ANALYTICS</span>
              <span style={labelStyle(theme.observerAccent)}>SIGMA_V.04</span>
            </div>

            <div style={{ height: isMobile ? "160px" : "220px", border: `1px solid ${theme.observerAccent}22`, padding: isMobile ? "12px" : "16px", background: "rgba(0,0,0,0.16)" }}>
              {hasTrendData ? (
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                  <path
                    className="orbital-waveform-path"
                    d={buildWaveformPath(latestChartWindow)}
                    fill="none"
                    stroke={theme.observerAccent}
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `${theme.observerAccent}22`,
                    borderTop: `1px solid ${theme.observerAccent}55`,
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                gap: isMobile ? "12px" : "16px",
                borderTop: `1px solid ${theme.observerAccent}22`,
                paddingTop: "16px",
                marginTop: "16px",
              }}
            >
              {overviewCards.map((item) => (
                <div key={item.label}>
                  <p style={labelStyle()}>{item.label}</p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontFamily: "Newsreader, serif",
                      fontSize: "clamp(1.05rem, 2vw, 1.55rem)",
                      color: theme.text,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={telemetryPanelStyle(theme)}>
              <span style={labelStyle()}>[02] SIGNAL_STRENGTH</span>
              <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
                {[
                  { label: "UPLINK", bars: signalStrength.uplink },
                  { label: "DOWNLINK", bars: signalStrength.downlink },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ color: theme.text, fontSize: "12px", letterSpacing: "0.08em" }}>{item.label}</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {item.bars.map((active, index) => (
                        <div
                          key={`${item.label}-${index}`}
                          style={{
                            width: "8px",
                            height: "18px",
                            background: active ? theme.observerAccent : `${theme.observerAccent}22`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ color: theme.text, fontSize: "12px", letterSpacing: "0.08em" }}>LATENCY</span>
                  <span style={{ color: theme.observerAccent, fontSize: "12px" }}>{signalStrength.latency}</span>
                </div>
              </div>
            </div>

            <div style={telemetryPanelStyle(theme, "warning")}>
              <span style={labelStyle("#fd8b00")}>[03] CORE_TEMP_WARNING</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "10px" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Newsreader, serif",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    color: "#fd8b00",
                  }}
                >
                  {selectedOutsiderPermissions.mood ? "Over_Nominal" : "Standby"}
                </p>
                <span className="material-symbols-outlined" style={{ color: "#fd8b00", fontSize: "18px" }}>
                  warning
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
            gap: isMobile ? "12px" : "16px",
          }}
        >
          {systemsStrip.map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(40,42,44,0.5)",
                padding: "16px",
                border: "1px solid #47464b",
              }}
            >
              <p style={labelStyle()}>{item.label}</p>
              <p
                style={{
                  margin: "8px 0 0",
                  color: item.tone === "accent" ? theme.observerAccent : theme.text,
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <p style={labelStyle(theme.observerAccent)}>Selected Tracker</p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontFamily: "Newsreader, serif",
                  fontSize: "1.6rem",
                }}
              >
                {selectedOutsider.name}
              </p>
              <p style={{ ...labelStyle("#7d8289"), marginTop: "8px" }}>
                {outsiderEnvironmentLabel} // shared summaries only
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>
                Select Tracker
              </button>
              <button style={primaryButtonStyle(theme)} onClick={() => setOutsiderPage("outsiderSupport")}>
                Open Comms
              </button>
            </div>
          </div>

          {hasTrendData ? (
            <div style={{ display: "grid", gap: "18px" }}>
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
          ) : (
            <div style={telemetryPanelStyle(theme, "neutral")}>
              <p style={{ ...labelStyle(), marginBottom: "8px" }}>NO_SHARED_TREND_DATA</p>
              <p style={{ margin: 0, color: "#929095", fontSize: "13px" }}>
                Shared telemetry will appear after approved tracker check-ins are available.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
      </div>
    </div>
  );
}

export default OutsiderTrackerDataPage;
