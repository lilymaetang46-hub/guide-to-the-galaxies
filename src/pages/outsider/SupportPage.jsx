function OutsiderSupportPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    observerSectionCardStyle,
    renderSectionHeader,
    observerLabels,
    observerHeroStyle,
    dashboardKickerStyle,
    dashboardHeadingStyle,
    subtitleStyle,
    selectedOutsider,
    primaryButtonStyle,
    setShowOutsiderChooser,
    setOutsiderPage,
    gridStyle,
    quickLinkGridStyle,
    quickJumpButtonStyle,
    sendSupportMessage,
    selectedOutsiderPermissions,
    outsiderMessage,
    smallInfoStyle,
    outsiderCooldownUntil,
  } = app;

  if (!selectedOutsider) {
    return (
      <div style={chartsPageStyle}>
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
          {renderSectionHeader(
            observerLabels.support,
            "Connect to a tracker first so this page has someone to support.",
            "Support",
            "Support"
          )}
          <p style={smallInfoStyle(theme)}>
            No approved tracker is selected yet. Use Overview to request access, then come back here for support nudges.
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

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
        {renderSectionHeader(observerLabels.support, "Send one-way nudges and encouragement to the selected tracker.", "Support", "Support")}
        <div style={observerHeroStyle(theme)}>
          <div>
            <p style={dashboardKickerStyle(theme)}>Current tracker</p>
            <h3 style={dashboardHeadingStyle(theme)}>{selectedOutsider.name}</h3>
            <p style={subtitleStyle(theme)}>Approved categories can receive support nudges from this space.</p>
          </div>
          <div style={{ width: "100%", maxWidth: "240px" }}>
            <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>Select Tracker</button>
          </div>
        </div>
      </section>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "signals")}>
          {renderSectionHeader("General Support", "Quick encouragement and check-ins.", "Support", "Support")}
          <div style={quickLinkGridStyle}>
            {["Good job", "Proud of you", "Keep going", "Checking in", "You are doing enough", "Small steps still count"].map((message) => (
              <button key={message} style={quickJumpButtonStyle(theme)} onClick={() => sendSupportMessage(message)}>
                {message}
              </button>
            ))}
          </div>
        </section>

        <section className="galaxy-panel" style={observerSectionCardStyle(theme, "care")}>
          {renderSectionHeader("Category Nudges", "Use approved categories for simple support reminders.", "Support", "Support")}
          <div style={quickLinkGridStyle}>
            {[
              selectedOutsiderPermissions.meds && "Remind: Meds",
              selectedOutsiderPermissions.food && "Remind: Eat",
              selectedOutsiderPermissions.hygiene && "Remind: Reset",
              selectedOutsiderPermissions.sleep && "Remind: Wind down",
              selectedOutsiderPermissions.exercise && "Remind: Move",
              selectedOutsiderPermissions.mood && "Remind: Check in",
            ]
              .filter(Boolean)
              .map((message) => (
                <button key={message} style={quickJumpButtonStyle(theme)} onClick={() => sendSupportMessage(message)}>
                  {message}
                </button>
              ))}
          </div>
          {outsiderMessage ? <p style={smallInfoStyle(theme)}>{`Latest support action: ${outsiderMessage}`}</p> : null}
          <p style={smallInfoStyle(theme)}>
            {outsiderCooldownUntil ? `Next reminder available at ${outsiderCooldownUntil}` : "A reminder can be sent now."}
          </p>
        </section>
      </div>
    </div>
  );
}

export default OutsiderSupportPage;
