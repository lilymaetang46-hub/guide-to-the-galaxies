import LineTrendChart from "../../components/LineTrendChart";
import useResponsiveViewport from "../../app/useResponsiveViewport";

function averageFromSeries(data, key) {
  const values = (Array.isArray(data) ? data : [])
    .map((item) => Number(item?.[key]))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function countEntriesWithValue(data, predicate) {
  return (Array.isArray(data) ? data : []).filter((item) => predicate(item)).length;
}

function formatDateLabel(value) {
  if (!value) {
    return "No recent check-in";
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getCoverageLabel(count, total) {
  if (!total) {
    return "No shared data";
  }

  return `${count} of ${total} recent check-ins`;
}

function getStabilityLabel(score) {
  if (score >= 4) {
    return "Mostly steady";
  }
  if (score >= 3) {
    return "Mixed but manageable";
  }
  return "Needs a little more support";
}

function getSupportFocus({ latestEntry, permissions }) {
  if (!latestEntry) {
    return {
      title: "Waiting for shared check-ins",
      body: "Once this tracker shares recent check-ins, this page will turn them into a quick read instead of a blank console.",
    };
  }

  const mealsCount = Array.isArray(latestEntry.meals) ? latestEntry.meals.length : 0;
  const exerciseCount = Array.isArray(latestEntry.exercise_logs)
    ? latestEntry.exercise_logs.length
    : latestEntry.exercise_done
    ? 1
    : 0;
  const hygieneCount = [
    latestEntry.brushed_teeth,
    latestEntry.showered,
    latestEntry.skincare,
  ].filter(Boolean).length;
  const medsLogged = Boolean(latestEntry.meds_taken) || Number(latestEntry.meds_count ?? 0) > 0;

  if (permissions.sleep && latestEntry.sleep_quality != null && Number(latestEntry.sleep_quality) <= 2) {
    return {
      title: "Sleep looks lower lately",
      body: `The latest shared check-in logged sleep quality at ${latestEntry.sleep_quality}/5, so a gentle check-in may help more than a productivity nudge.`,
    };
  }

  if (permissions.food && mealsCount === 0) {
    return {
      title: "Meals were not logged in the latest check-in",
      body: "Food support may be the most useful next nudge if that fits this person's usual needs.",
    };
  }

  if (permissions.meds && !medsLogged) {
    return {
      title: "Medication was not confirmed in the latest check-in",
      body: "Medication details stay minimal here, but this suggests a reminder could be more useful than general encouragement.",
    };
  }

  if (permissions.exercise && exerciseCount === 0) {
    return {
      title: "Movement has not shown up yet",
      body: "If this tracker finds movement grounding, a light reminder could help without turning support into pressure.",
    };
  }

  if (permissions.hygiene && hygieneCount <= 1) {
    return {
      title: "Reset routines look light today",
      body: "Hygiene and reset tasks were only partly logged, so practical support may land better than broad motivation.",
    };
  }

  return {
    title: "No obvious red flags in the latest shared summary",
    body: "Recent check-ins look reasonably steady, so simple encouragement or a calm check-in is probably enough right now.",
  };
}

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
    border: `1px solid ${accent === "warning" ? "rgba(253, 139, 0, 0.35)" : `${accentColor}26`}`,
    padding: "16px",
    minHeight: 0,
    borderRadius: "16px",
    boxShadow: isSolarMode
      ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 20px rgba(122,104,78,0.12)"
      : "inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 24px rgba(0,0,0,0.16)",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    clipPath: "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
  };
}

function labelStyle(color = "#6b7078") {
  return {
    margin: 0,
    fontSize: "10px",
    color,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  };
}

function mobileChartScrollerStyle(theme) {
  return {
    overflowX: "auto",
    paddingBottom: "4px",
    marginTop: "12px",
    borderTop: `1px solid ${theme.observerAccent}18`,
    paddingTop: "14px",
  };
}

function chartTakeawayStyle(theme) {
  return {
    margin: 0,
    color: theme.modeName === "Solar" ? "#5f564b" : "#929095",
    fontSize: "12px",
    lineHeight: 1.7,
  };
}

function OutsiderTrackerDataPage({ app }) {
  const { width: viewportWidth } = useResponsiveViewport();
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
  const chartWindowSize = latestChartWindow.length;
  const latestEntryDate = formatDateLabel(selectedOutsider.latestEntry?.entry_date);
  const moodAverage = averageFromSeries(latestChartWindow, "mood");
  const sleepAverage = averageFromSeries(latestChartWindow, "sleepQuality");
  const sharedMoodCount = countEntriesWithValue(latestChartWindow, (item) => typeof item?.mood === "number");
  const sharedSleepCount = countEntriesWithValue(
    latestChartWindow,
    (item) => typeof item?.sleepQuality === "number"
  );
  const routineLoggedCount = countEntriesWithValue(
    latestChartWindow,
    (item) =>
      Number(item?.mealsCount ?? 0) > 0 ||
      Number(item?.exerciseCount ?? 0) > 0 ||
      Number(item?.hygieneCount ?? 0) > 0
  );
  const medsLoggedCount = countEntriesWithValue(
    latestChartWindow,
    (item) => Number(item?.medsTaken ?? 0) > 0 || Number(item?.medsCount ?? 0) > 0
  );
  const supportFocus = getSupportFocus({
    latestEntry: selectedOutsider.latestEntry,
    permissions: selectedOutsiderPermissions,
  });
  const wellbeingTakeaway = moodAverage
    ? `Mood averaged ${moodAverage.toFixed(1)}/5 across ${sharedMoodCount} recent shared check-ins${sleepAverage ? `, with sleep averaging ${sleepAverage.toFixed(1)}/5.` : "."}`
    : "Wellbeing data is still limited, so treat this page as a rough signal rather than a full picture.";
  const routineTakeaway =
    routineLoggedCount > 0
      ? `Meals, movement, or hygiene showed up in ${getCoverageLabel(routineLoggedCount, chartWindowSize).toLowerCase()}.`
      : "Routine logging has been sparse lately, so practical support may help more than accountability language.";
  const medsTakeaway =
    medsLoggedCount > 0
      ? `Medication activity appeared in ${getCoverageLabel(medsLoggedCount, chartWindowSize).toLowerCase()}. Only counts are shown here.`
      : "No recent medication confirmations were shared in this chart window.";

  const overviewCards = [
    selectedOutsiderPermissions.mood && {
      label: "Overall read",
      value: getStabilityLabel(selectedOutsider.moodScore ?? 0),
      note: `${outsiderMoodLabel}. Latest check-in ${latestEntryDate}.`,
    },
    selectedOutsiderPermissions.mood && {
      label: "Mood average",
      value: moodAverage != null ? `${moodAverage.toFixed(1)}/5` : "Not enough data yet",
      note:
        moodAverage != null
          ? `${sharedMoodCount} recent mood check-ins shared`
          : "Mood is not available in the recent shared window",
    },
    selectedOutsiderPermissions.activity && {
      label: "Recent activity",
      value: `${selectedOutsiderHistory.length} shared check-ins`,
      note: selectedOutsider.latestEntry
        ? `Latest check-in was ${latestEntryDate}`
        : "No recent shared check-ins yet",
    },
    selectedOutsiderPermissions.sleep && {
      label: "Sleep coverage",
      value: getCoverageLabel(sharedSleepCount, chartWindowSize),
      note:
        sleepAverage != null
          ? `Average shared sleep quality ${sleepAverage.toFixed(1)}/5`
          : "Sleep quality has not been shared recently",
    },
  ].filter(Boolean);

  const systemsStrip = [
    {
      label: "Shared check-ins",
      value:
        selectedOutsiderHistory.length > 0 ? `${selectedOutsiderHistory.length} recent entries` : "No recent entries",
      note: selectedOutsider.latestEntry ? `Latest ${latestEntryDate}` : "Waiting on a first shared update",
      tone: "default",
    },
    {
      label: "Routines",
      value:
        routineLoggedCount > 0
          ? `${routineLoggedCount}/${chartWindowSize || 1} check-ins logged`
          : "No recent routine logs",
      note: "Meals, movement, and hygiene summaries only",
      tone: "default",
    },
    {
      label: "Status",
      value: selectedOutsider.status || "Stable",
      note: "Based on summary-safe shared data",
      tone: "accent",
    },
    {
      label: "Medication",
      value: selectedOutsiderPermissions.meds
        ? medsLoggedCount > 0
          ? `${medsLoggedCount}/${chartWindowSize || 1} check-ins logged`
          : "No recent medication logs"
        : "Not shared",
      note: selectedOutsiderPermissions.meds
        ? "Counts only, never medication details"
        : "Medication access is turned off",
      tone: "default",
    },
  ];

  const signalStrength = {
    wellbeing: getSignalBars(Math.min(4, Math.max(1, sharedMoodCount || sharedSleepCount || 1))),
    routines: getSignalBars(Math.min(4, Math.max(1, routineLoggedCount))),
    coverage: `${chartWindowSize} recent check-ins in view`,
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
  const warningTextColor = theme.modeName === "Solar" ? "#9a5710" : "#fd8b00";

  if (theme.observerConsole) {
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
    const mobileTelemetryCardStyle = {
      background:
        theme.modeName === "Solar"
          ? "linear-gradient(180deg, rgba(241, 235, 224, 0.98) 0%, rgba(215, 208, 198, 0.995) 100%)"
          : "linear-gradient(180deg, rgba(33, 45, 61, 0.94) 0%, rgba(16, 23, 35, 0.98) 100%)",
      border: `1px solid ${theme.observerAccent}22`,
      padding: "14px",
      borderRadius: "16px",
      position: "relative",
      overflow: "hidden",
    };

    return (
      <div style={{ display: "grid", gap: "24px", marginTop: "8px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2fr) minmax(260px, 1fr)",
            gap: isMobile ? "14px" : "24px",
          }}
        >
          <div style={telemetryPanelStyle(theme)}>
            <div style={panelChrome()} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "18px" }}>
              <span style={labelStyle()}>[01] MOOD_TREND_ANALYTICS</span>
              <span style={labelStyle(theme.observerAccent)}>SIGMA_V.04</span>
            </div>
            <p style={chartTakeawayStyle(theme)}>
              Shared check-ins are translated into a quick, plain-language read so this page stays useful without losing the terminal style.
            </p>

            <div style={{ height: isMobile ? "140px" : "220px", border: `1px solid ${theme.observerAccent}22`, padding: isMobile ? "10px" : "16px", background: "rgba(0,0,0,0.16)", marginTop: "14px" }}>
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
                gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
                gap: isMobile ? "10px" : "16px",
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
                  <p style={{ ...chartTakeawayStyle(theme), marginTop: "6px" }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={telemetryPanelStyle(theme)}>
              <div style={panelChrome()} />
              <span style={labelStyle()}>[02] SHARED_SIGNAL</span>
              <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
                {[
                  { label: "WELLBEING DATA", bars: signalStrength.wellbeing },
                  { label: "ROUTINE DATA", bars: signalStrength.routines },
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
                  <span style={{ color: theme.text, fontSize: "12px", letterSpacing: "0.08em" }}>WINDOW</span>
                  <span style={{ color: theme.observerAccent, fontSize: "12px" }}>{signalStrength.coverage}</span>
                </div>
              </div>
            </div>

            <div style={telemetryPanelStyle(theme, "warning")}>
              <span style={labelStyle(warningTextColor)}>[03] SUPPORT_FOCUS</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "10px" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Newsreader, serif",
                    fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)",
                    color: warningTextColor,
                  }}
                >
                  {supportFocus.title}
                </p>
                <span className="material-symbols-outlined" style={{ color: warningTextColor, fontSize: "18px" }}>
                  warning
                </span>
              </div>
              <p style={{ margin: "10px 0 0", color: warningTextColor, fontSize: "12px", lineHeight: 1.7 }}>
                {supportFocus.body}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
            gap: isMobile ? "10px" : "16px",
          }}
        >
          {systemsStrip.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        background: theme.modeName === "Solar"
                          ? "linear-gradient(180deg, rgba(240,236,228,0.92) 0%, rgba(219,211,199,0.98) 100%)"
                          : "linear-gradient(180deg, rgba(20,28,39,0.92) 0%, rgba(10,15,24,0.98) 100%)",
                        padding: "16px",
                        border: `1px solid ${theme.observerAccent}2a`,
                        clipPath: "polygon(0 9px, 9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px))",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
              <p style={{ ...chartTakeawayStyle(theme), marginTop: "8px" }}>{item.note}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gap: isMobile ? "14px" : "16px",
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
            <div style={{ display: "grid", gap: isMobile ? "14px" : "18px" }}>
              {wellbeingSeries.length > 0 ? (
                isMobile ? (
                  <div style={mobileTelemetryCardStyle}>
                    <div style={panelChrome()} />
                    <p style={labelStyle(theme.observerAccent)}>WELLBEING_TREND</p>
                    <p style={{ ...chartTakeawayStyle(theme), marginTop: "8px" }}>
                      Recent mood, energy, and sleep signals in one place.
                    </p>
                    <div style={mobileChartScrollerStyle(theme)}>
                      <div style={{ minWidth: "560px" }}>
                        <LineTrendChart
                          title="Shared wellbeing trend"
                          subtitle="High-level emotional and sleep trends only."
                          data={latestChartWindow}
                          yMax={5}
                          theme={theme}
                          chartCardStyle={chartCardStyle}
                          series={wellbeingSeries}
                        />
                      </div>
                    </div>
                    <p style={{ ...chartTakeawayStyle(theme), marginTop: "12px", color: theme.text }}>
                      {wellbeingTakeaway}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "10px" }}>
                    <LineTrendChart
                      title="Shared wellbeing trend"
                      subtitle="High-level emotional and sleep trends only."
                      data={latestChartWindow}
                      yMax={5}
                      theme={theme}
                      chartCardStyle={chartCardStyle}
                      series={wellbeingSeries}
                    />
                    <p style={chartTakeawayStyle(theme)}>{wellbeingTakeaway}</p>
                  </div>
                )
              ) : null}

              {routineSeries.length > 0 ? (
                isMobile ? (
                  <div style={mobileTelemetryCardStyle}>
                    <div style={panelChrome()} />
                    <p style={labelStyle(theme.observerAccent)}>DAILY_ROUTINES</p>
                    <p style={{ ...chartTakeawayStyle(theme), marginTop: "8px" }}>
                      Shared counts for meals, movement, and reset habits.
                    </p>
                    <div style={mobileChartScrollerStyle(theme)}>
                      <div style={{ minWidth: "560px" }}>
                        <LineTrendChart
                          title="Daily routines"
                          subtitle="Shared counts for meals, movement, and resets."
                          data={latestChartWindow}
                          yMax={routineMax}
                          theme={theme}
                          chartCardStyle={chartCardStyle}
                          series={routineSeries}
                        />
                      </div>
                    </div>
                    <p style={{ ...chartTakeawayStyle(theme), marginTop: "12px", color: theme.text }}>
                      {routineTakeaway}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "10px" }}>
                    <LineTrendChart
                      title="Daily routines"
                      subtitle="Shared counts for meals, movement, and resets."
                      data={latestChartWindow}
                      yMax={routineMax}
                      theme={theme}
                      chartCardStyle={chartCardStyle}
                      series={routineSeries}
                    />
                    <p style={chartTakeawayStyle(theme)}>{routineTakeaway}</p>
                  </div>
                )
              ) : null}

              {medsSeries.length > 0 ? (
                isMobile ? (
                  <div style={mobileTelemetryCardStyle}>
                    <div style={panelChrome()} />
                    <p style={labelStyle(theme.observerAccent)}>MEDICATION_SUPPORT</p>
                    <p style={{ ...chartTakeawayStyle(theme), marginTop: "8px" }}>
                      Counts only. Medication names and private details stay hidden.
                    </p>
                    <div style={mobileChartScrollerStyle(theme)}>
                      <div style={{ minWidth: "560px" }}>
                        <LineTrendChart
                          title="Medication support view"
                          subtitle="Only medication check counts and log counts are shown."
                          data={latestChartWindow}
                          yMax={medsMax}
                          theme={theme}
                          chartCardStyle={chartCardStyle}
                          series={medsSeries}
                        />
                      </div>
                    </div>
                    <p style={{ ...chartTakeawayStyle(theme), marginTop: "12px", color: theme.text }}>
                      {medsTakeaway}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "10px" }}>
                    <LineTrendChart
                      title="Medication support view"
                      subtitle="Only medication check counts and log counts are shown."
                      data={latestChartWindow}
                      yMax={medsMax}
                      theme={theme}
                      chartCardStyle={chartCardStyle}
                      series={medsSeries}
                    />
                    <p style={chartTakeawayStyle(theme)}>{medsTakeaway}</p>
                  </div>
                )
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
