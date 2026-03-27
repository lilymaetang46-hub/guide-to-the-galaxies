function TrackerMoodPage({ app }) {
  const {
    theme,
    sectionCardStyle,
    renderSectionHeader,
    trackerLabels,
    trackerNavItems,
    setActivePage,
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
    ["meds", "food", "sleep", "hygiene", "cleaning", "exercise", "mood"].includes(item.key)
  );

  return (
    <section className="galaxy-panel" style={sectionCardStyle(theme, "mood")}>
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
                style={{
                  border: theme.trackerSolar ? "1px solid rgba(255, 193, 7, 0.28)" : theme.border,
                  background: active
                    ? theme.primary
                    : theme.trackerSolar
                    ? "rgba(255,255,255,0.34)"
                    : theme.softButtonBackground,
                  color: active ? theme.primaryText : theme.softButtonText,
                  borderRadius: "999px",
                  padding: "10px 14px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  letterSpacing: "0.04em",
                  boxShadow: active ? `0 10px 24px ${theme.glow}` : "none",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <p style={sliderValueStyle(theme)}>{`${trackerLabels.mood}: ${mood}/5`}</p>
      <input
        style={rangeStyle}
        type="range"
        min="1"
        max="5"
        value={mood}
        onChange={(e) => handleMoodChange(e.target.value)}
      />

      <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
        {moodTagGroups.map((group) => (
          <div key={group.label}>
            <p style={tagGroupLabelStyle(theme)}>{group.label}</p>
            <div style={moodTagGridStyle}>
              {group.tags.map((tag) => {
                const selected = moodTags.includes(tag);

                return (
                  <button
                    key={tag}
                    style={moodTagButtonStyle(selected, theme)}
                    onClick={() => toggleMoodTag(tag)}
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
        Selected mood words: {moodTags.length > 0 ? moodTags.join(", ") : "None yet"}
      </p>
    </section>
  );
}

export default TrackerMoodPage;
