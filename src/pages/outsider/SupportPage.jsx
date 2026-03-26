function consolePanel(theme, accent = "primary") {
  const borderColor =
    accent === "warning" ? "rgba(253, 139, 0, 0.35)" : `${theme.observerAccent}26`;

  return {
    background: accent === "warning" ? "rgba(253, 139, 0, 0.08)" : "rgba(0,0,0,0.22)",
    border: `1px solid ${borderColor}`,
    padding: "16px",
  };
}

function consoleLabel(color = "#6b7078") {
  return {
    margin: 0,
    fontSize: "10px",
    color,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };
}

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
    softButtonStyle,
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

  if (theme.observerConsole) {
    const generalMessages = [
      "Good job",
      "Proud of you",
      "Keep going",
      "Checking in",
      "You are doing enough",
      "Small steps still count",
    ];
    const categoryMessages = [
      selectedOutsiderPermissions.meds && "Remind: Meds",
      selectedOutsiderPermissions.food && "Remind: Eat",
      selectedOutsiderPermissions.hygiene && "Remind: Reset",
      selectedOutsiderPermissions.sleep && "Remind: Wind down",
      selectedOutsiderPermissions.exercise && "Remind: Move",
      selectedOutsiderPermissions.mood && "Remind: Check in",
    ].filter(Boolean);

    return (
      <div style={{ display: "grid", gap: "24px", marginTop: "8px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
            gap: "24px",
          }}
        >
          <div style={consolePanel(theme)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[01] CURRENT_CHANNEL</span>
              <span style={consoleLabel(theme.observerAccent)}>COMMS_OPEN</span>
            </div>
            <p style={consoleLabel()}>{selectedOutsider.themeFamily}</p>
            <p style={{ margin: "6px 0 0", fontFamily: "Newsreader, serif", fontSize: "1.8rem", color: theme.text }}>
              {selectedOutsider.name}
            </p>
            <p style={{ margin: "12px 0 0", color: "#929095", fontSize: "12px" }}>
              Approved categories can receive support nudges from this space.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "14px" }}>
              <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>
                Select Tracker
              </button>
              <button style={softButtonStyle(theme)} onClick={() => setOutsiderPage("outsiderData")}>
                Open Telemetry
              </button>
            </div>
          </div>

          <div style={consolePanel(theme, "warning")}>
            <span style={consoleLabel("#fd8b00")}>[02] TRANSMISSION_WINDOW</span>
            <p style={{ margin: "8px 0 0", fontFamily: "Newsreader, serif", fontSize: "1.7rem", color: "#fd8b00" }}>
              {outsiderCooldownUntil ? "Cooldown_Active" : "Ready_To_Transmit"}
            </p>
            <p style={{ margin: "8px 0 0", color: "#d39b66", fontSize: "12px" }}>
              {outsiderCooldownUntil ? `Next reminder available at ${outsiderCooldownUntil}` : "A reminder can be sent now."}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "24px",
          }}
        >
          <div style={consolePanel(theme)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[03] GENERAL_SUPPORT</span>
              <span style={consoleLabel(theme.observerAccent)}>TEXT_QUEUE</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
              {generalMessages.map((message) => (
                <button key={message} style={quickJumpButtonStyle(theme)} onClick={() => sendSupportMessage(message)}>
                  {message}
                </button>
              ))}
            </div>
          </div>

          <div style={consolePanel(theme)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[04] CATEGORY_NUDGES</span>
              <span style={consoleLabel(theme.observerAccent)}>APPROVED_ONLY</span>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {categoryMessages.map((message) => (
                <button key={message} style={quickJumpButtonStyle(theme)} onClick={() => sendSupportMessage(message)}>
                  {message}
                </button>
              ))}
            </div>
            {outsiderMessage ? (
              <p style={{ margin: "14px 0 0", color: theme.observerAccent, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Latest support action: {outsiderMessage}
              </p>
            ) : null}
          </div>
        </div>
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
