function TrackerMoodPage({ app }) {
  const {
    theme,
    sectionCardStyle,
    renderSectionHeader,
    trackerLabels,
    trackerNavItems,
    setActivePage,
    trackerSectionSwitcherButtonStyle,
    sliderValueStyle,
    mood,
    rangeStyle,
    handleMoodChange,
    moodTagGroups,
    tagGroupLabelStyle,
    moodTagGridStyle,
    moodTags,
    moodTagButtonStyle,
    toggleMoodTag,
    smallInfoStyle,
  } = app;

  const trackingSections = (trackerNavItems || []).filter((item) =>
    ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "todo", "period", "mood"].includes(item.key)
  );
  const disableGalaxyFrame =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const moodValue = Number(mood);
  const moodTone =
    moodValue >= 5
      ? "Excellent"
      : moodValue >= 4
      ? "Good"
      : moodValue >= 3
      ? "Steady"
      : moodValue >= 2
      ? "Low"
      : "Heavy";
  const moodScaleLabels = [
    { value: 1, label: "Heavy" },
    { value: 2, label: "Low" },
    { value: 3, label: "Steady" },
    { value: 4, label: "Good" },
    { value: 5, label: "Excellent" },
  ];
  const moodTagLimitReached = moodTags.length >= 3;
  const summaryChipStyle = (selected = false) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "36px",
    padding: "0.48rem 0.85rem",
    borderRadius: "999px",
    border: selected ? "none" : theme.border,
    background: selected ? theme.primary : theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.06)",
    color: selected ? theme.primaryText : theme.text,
    fontWeight: 700,
    fontSize: "0.9rem",
    letterSpacing: selected ? "0.01em" : "normal",
  });

  return (
    <section
      className="galaxy-panel"
      style={sectionCardStyle(theme, "mood", { disableCelestialFrame: disableGalaxyFrame })}
    >
      {renderSectionHeader(
        trackerLabels.mood,
        "Keep the slider, then add up to 3 words that fit today.",
        "Glow",
        "Nova"
      )}
      {trackingSections.length > 1 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          {trackingSections.map((item) => {
            const active = item.key === "mood";
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                style={trackerSectionSwitcherButtonStyle(active, theme)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gap: "14px",
          padding: "16px",
          borderRadius: "22px",
          border: theme.border,
          background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ ...sliderValueStyle(theme), margin: 0 }}>{`${trackerLabels.mood}: ${mood}/5`}</p>
          <div style={summaryChipStyle(true)}>{moodTone}</div>
        </div>
        <input
          style={rangeStyle(theme)}
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => handleMoodChange(e.target.value)}
          aria-label="Mood level from 1 to 5"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "8px",
            color: theme.faintText,
            fontSize: "0.78rem",
            textAlign: "center",
          }}
        >
          {moodScaleLabels.map((item) => (
            <span
              key={item.value}
              style={{
                opacity: item.value === moodValue ? 1 : 0.74,
                fontWeight: item.value === moodValue ? 700 : 500,
                color: item.value === moodValue ? theme.text : theme.faintText,
              }}
            >
              {item.label}
            </span>
          ))}
        </div>
        <p style={{ ...smallInfoStyle(theme), marginTop: 0 }}>
          Pick the number first, then add up to 3 words if you want more detail.
        </p>
      </div>

      <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <p style={{ ...tagGroupLabelStyle(theme), margin: 0 }}>Selected words</p>
          <div style={summaryChipStyle()}>{`${moodTags.length}/3 chosen`}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {moodTags.length > 0 ? (
            moodTags.map((tag) => (
              <button
                key={tag}
                style={moodTagButtonStyle(true, theme)}
                onClick={() => toggleMoodTag(tag)}
              >
                {tag}
              </button>
            ))
          ) : (
            <div style={summaryChipStyle()}>No words selected yet</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
        {moodTagGroups.map((group) => (
          <div key={group.label}>
            <p style={tagGroupLabelStyle(theme)}>{group.label}</p>
            <div style={moodTagGridStyle}>
              {group.tags.map((tag) => {
                const selected = moodTags.includes(tag);
                const disabled = moodTagLimitReached && !selected;

                return (
                  <button
                    key={tag}
                    style={{
                      ...moodTagButtonStyle(selected, theme),
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    onClick={() => toggleMoodTag(tag)}
                    disabled={disabled}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p style={smallInfoStyle(theme)}>
        {moodTagLimitReached
          ? "Tag limit reached. Tap a selected word to swap it out."
          : "You can leave this as just the slider, or add words for extra context."}
      </p>
    </section>
  );
}

export default TrackerMoodPage;
