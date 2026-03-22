function TrackerMoodPage({ app }) {
  const {
    theme,
    sectionCardStyle,
    renderSectionHeader,
    trackerLabels,
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

  return (
    <section className="galaxy-panel" style={sectionCardStyle(theme, "mood")}>
      {renderSectionHeader(
        trackerLabels.mood,
        "Keep the slider, then add up to 3 words that fit today.",
        "Glow",
        "Nova"
      )}
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
