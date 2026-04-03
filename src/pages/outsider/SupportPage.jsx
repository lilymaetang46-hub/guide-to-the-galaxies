import useResponsiveViewport from "../../app/useResponsiveViewport";

function consolePanel(theme, accent = "primary") {
  const borderColor =
    accent === "warning" ? "rgba(253, 139, 0, 0.35)" : `${theme.observerAccent}26`;
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
    border: `1px solid ${borderColor}`,
    padding: "16px",
    borderRadius: "16px",
    boxShadow: isSolarMode
      ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 20px rgba(122,104,78,0.12)"
      : "inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 24px rgba(0,0,0,0.16)",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
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
  const { width: viewportWidth } = useResponsiveViewport();
  const isMobile = viewportWidth < 768;
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
    const warningTextColor = theme.modeName === "Solar" ? "#9a5710" : "#fd8b00";
    const warningMutedColor = theme.modeName === "Solar" ? "#7a6247" : "#d39b66";
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
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.3fr) minmax(0, 1fr)",
            gap: isMobile ? "16px" : "24px",
          }}
        >
          <div style={consolePanel(theme)}>
            <div style={panelChrome()} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[01] CURRENT_CHANNEL</span>
              <span style={consoleLabel(theme.observerAccent)}>COMMS_OPEN</span>
            </div>
            <p style={consoleLabel()}>{selectedOutsider.themeFamily}</p>
            <p style={{ margin: "6px 0 0", fontFamily: "Newsreader, serif", fontSize: isMobile ? "1.45rem" : "1.8rem", color: theme.text }}>
              {selectedOutsider.name}
            </p>
            <p style={{ margin: "12px 0 0", color: "#929095", fontSize: "12px", lineHeight: 1.7 }}>
              Approved categories can receive support nudges from this space.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, max-content)", gap: "12px", marginTop: "14px", width: isMobile ? "100%" : "auto" }}>
              <button style={primaryButtonStyle(theme)} onClick={() => setShowOutsiderChooser(true)}>
                Select Tracker
              </button>
              <button style={softButtonStyle(theme)} onClick={() => setOutsiderPage("outsiderData")}>
                Open Telemetry
              </button>
            </div>
          </div>

          <div style={consolePanel(theme, "warning")}>
            <div style={panelChrome("warning")} />
            <span style={consoleLabel(warningTextColor)}>[02] TRANSMISSION_WINDOW</span>
            <p style={{ margin: "8px 0 0", fontFamily: "Newsreader, serif", fontSize: "1.7rem", color: warningTextColor }}>
              {outsiderCooldownUntil ? "Cooldown_Active" : "Ready_To_Transmit"}
            </p>
            <p style={{ margin: "8px 0 0", color: warningMutedColor, fontSize: "12px", lineHeight: 1.7 }}>
              {outsiderCooldownUntil ? `Next reminder available at ${outsiderCooldownUntil}` : "A reminder can be sent now."}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
            gap: isMobile ? "16px" : "24px",
          }}
        >
          <div style={consolePanel(theme)}>
            <div style={panelChrome()} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[03] GENERAL_SUPPORT</span>
              <span style={consoleLabel(theme.observerAccent)}>TEXT_QUEUE</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
              {generalMessages.map((message) => (
                <button key={message} style={quickJumpButtonStyle(theme)} onClick={() => sendSupportMessage(message)}>
                  {message}
                </button>
              ))}
            </div>
          </div>

          <div style={consolePanel(theme)}>
            <div style={panelChrome()} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[04] CATEGORY_NUDGES</span>
              <span style={consoleLabel(theme.observerAccent)}>APPROVED_ONLY</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "1fr", gap: "12px" }}>
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
