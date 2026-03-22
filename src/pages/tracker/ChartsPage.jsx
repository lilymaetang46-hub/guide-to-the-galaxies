import LineTrendChart from "../../components/LineTrendChart";

function TrackerChartsPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    sectionCardStyle,
    renderSectionHeader,
    chartToolbarStyle,
    chartRangeOptions,
    rangeChipStyle,
    chartRange,
    setChartRange,
    recentChartData,
    emptyTextStyle,
    chartStackStyle,
    maxMeals,
    maxMeds,
    maxHygiene,
    maxExercise,
    chartCardStyle,
  } = app;

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionCardStyle(theme, "charts")}>
        {renderSectionHeader("Celestial Charts", "Look for patterns across the last few days without overload.", "Sun", "Star")}
        <div style={chartToolbarStyle}>
          {chartRangeOptions.map((days) => (
            <button key={days} style={rangeChipStyle(chartRange === days, theme)} onClick={() => setChartRange(days)}>
              Last {days} days
            </button>
          ))}
        </div>

        {recentChartData.length === 0 ? (
          <p style={emptyTextStyle(theme)}>No chart data yet.</p>
        ) : (
          <div style={chartStackStyle}>
            <LineTrendChart
              title="Wellbeing trends"
              subtitle="Mood, focus, and energy traveling together across time."
              data={recentChartData}
              yMax={5}
              theme={theme}
              chartCardStyle={chartCardStyle}
              series={[
                { key: "mood", label: "Mood", color: theme.chartPalette.mood },
                { key: "focus", label: "Focus", color: theme.chartPalette.focus },
                { key: "energy", label: "Energy", color: theme.chartPalette.energy },
              ]}
            />
          </div>
        )}
      </section>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "care")}>
        {renderSectionHeader("Care Habits", "Meals, meds, hygiene, and movement across recent days.", "Comet", "Spark")}
        {recentChartData.length === 0 ? (
          <p style={emptyTextStyle(theme)}>No chart data yet.</p>
        ) : (
          <div style={chartStackStyle}>
            <LineTrendChart
              title="Care habits chart"
              subtitle="Counts for nourishment, meds, hygiene, and exercise logs."
              data={recentChartData}
              yMax={Math.max(maxMeals, maxMeds, maxHygiene, maxExercise, 3)}
              theme={theme}
              chartCardStyle={chartCardStyle}
              series={[
                { key: "mealsCount", label: "Meals", color: theme.chartPalette.meals },
                { key: "medsCount", label: "Meds", color: theme.chartPalette.meds },
                { key: "hygieneCount", label: "Hygiene", color: theme.chartPalette.hygiene },
                { key: "exerciseCount", label: "Exercise", color: theme.chartPalette.exercise },
              ]}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default TrackerChartsPage;
