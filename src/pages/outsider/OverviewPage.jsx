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

function OutsiderOverviewPage({ app }) {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const isMobile = viewportWidth < 768;
  const {
    theme,
    chartsPageStyle,
    observerSectionCardStyle,
    renderSectionHeader,
    observerLabels,
    dashboardStatsGridStyle,
    outsiderTrackers,
    summaryCardStyle,
    summaryLabelStyle,
    summaryValueStyle,
    summaryNoteStyle,
    primaryButtonStyle,
    setSelectedOutsiderId,
    setOutsiderPage,
    softButtonStyle,
    gridStyle,
    rewardCardStyle,
    rewardTitleStyle,
    goalMetaStyle,
    quickLinkGridStyle,
    quickJumpButtonStyle,
    renderFeedbackMessage,
    connectionsMessage,
    goalFormGridStyle,
    labelStyle,
    inputStyle,
    joinCodeInput,
    setJoinCodeInput,
    joinByCode,
    joinLinkInput,
    setJoinLinkInput,
    joinByLink,
  } = app;

  const overviewConsolePanel = (accent = "primary") => ({
    ...consolePanel(theme, accent),
    minHeight: 0,
  });

  if (theme.observerConsole) {
    return (
      <div style={{ display: "grid", gap: "24px", marginTop: "8px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
            gap: isMobile ? "16px" : "24px",
            alignItems: "start",
          }}
        >
          <div style={overviewConsolePanel()}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span style={consoleLabel()}>[01] TRACKER_LINKS</span>
              <span style={consoleLabel(theme.observerAccent)}>VIEWPORT_READY</span>
            </div>
            {outsiderTrackers.length > 0 ? (
              <div style={{ display: "grid", gap: "14px" }}>
                {outsiderTrackers.map((tracker) => (
                  <div
                    key={tracker.id}
                    style={{
                      border: `1px solid ${theme.observerAccent}22`,
                      padding: isMobile ? "14px" : "16px",
                      background: "rgba(0,0,0,0.18)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <p style={consoleLabel()}>{tracker.themeFamily}</p>
                        <p style={{ margin: "6px 0 0", fontFamily: "Newsreader, serif", fontSize: isMobile ? "1.2rem" : "1.5rem", color: theme.text }}>
                          {tracker.name}
                        </p>
                      </div>
                      <div style={{ color: theme.observerAccent, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {tracker.status}
                      </div>
                    </div>
                    <p style={{ margin: "10px 0 0", color: "#7d8289", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.6 }}>
                      Status: {tracker.status} // Goals: {tracker.activeGoals?.length || 0} // Mood {tracker.moodScore}/5
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, max-content))", gap: "10px", marginTop: "12px" }}>
                      <button
                        style={primaryButtonStyle(theme)}
                        onClick={() => {
                          setSelectedOutsiderId(tracker.id);
                          setOutsiderPage("outsiderData");
                        }}
                      >
                        Open Telemetry
                      </button>
                      <button
                        style={softButtonStyle(theme)}
                        onClick={() => {
                          setSelectedOutsiderId(tracker.id);
                          setOutsiderPage("outsiderSupport");
                        }}
                      >
                        Open Comms
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: "#929095", fontSize: "13px" }}>{observerLabels.emptyBody}</p>
            )}
          </div>

          <div style={{ display: "grid", gap: "24px" }}>
            <div style={overviewConsolePanel()}>
              <span style={consoleLabel()}>[02] REQUEST_ACCESS</span>
              {renderFeedbackMessage(connectionsMessage, theme)}
              <div style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
                <div>
                  <label style={consoleLabel()}>Invite Code</label>
                  <input
                    style={inputStyle(theme)}
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder="STAR-ABC123"
                  />
                  <div style={{ marginTop: "10px" }}>
                    <button style={primaryButtonStyle(theme)} onClick={joinByCode}>
                      Request by Code
                    </button>
                  </div>
                </div>
                <div>
                  <label style={consoleLabel()}>Invite Link</label>
                  <input
                    style={inputStyle(theme)}
                    type="text"
                    value={joinLinkInput}
                    onChange={(e) => setJoinLinkInput(e.target.value)}
                    placeholder="Paste invite link"
                  />
                  <div style={{ marginTop: "10px" }}>
                    <button style={softButtonStyle(theme)} onClick={joinByLink}>
                      Request by Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={overviewConsolePanel("warning")}>
              <span style={consoleLabel("#fd8b00")}>[03] QUICK_SUPPORT</span>
              <p style={{ margin: "8px 0 0", fontFamily: "Newsreader, serif", fontSize: "1.7rem", color: "#fd8b00" }}>
                Support Queue
              </p>
              <p style={{ margin: "8px 0 0", color: "#d39b66", fontSize: "12px" }}>
                Approved trackers appear in the viewport and can be opened directly into telemetry or comms.
              </p>
            </div>
          </div>
        </div>

        {outsiderTrackers.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
              gap: isMobile ? "16px" : "24px",
            }}
          >
            <div style={overviewConsolePanel()}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                <span style={consoleLabel()}>[04] SHARED_SIGNALS</span>
                <span style={consoleLabel(theme.observerAccent)}>READ_ONLY</span>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {outsiderTrackers.map((tracker) => (
                  <div
                    key={`signal-${tracker.id}`}
                    style={{
                      border: `1px solid ${theme.observerAccent}22`,
                      padding: "14px",
                      background: "rgba(0,0,0,0.16)",
                    }}
                  >
                    <p style={consoleLabel()}>{tracker.name}</p>
                    <p style={{ margin: "6px 0 0", color: theme.text, fontSize: "13px", lineHeight: 1.65 }}>
                      Mood {tracker.moodScore}/5 // Meals {tracker.comparisonStats?.[0]?.value ?? 0} // Movement {tracker.comparisonStats?.[1]?.value ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={overviewConsolePanel()}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                <span style={consoleLabel()}>[05] SUPPORT_SHORTCUTS</span>
                <span style={consoleLabel(theme.observerAccent)}>FAST_ACTIONS</span>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {outsiderTrackers.slice(0, 4).map((tracker) => (
                  <button
                    key={`support-${tracker.id}`}
                    style={quickJumpButtonStyle(theme)}
                    onClick={() => {
                      setSelectedOutsiderId(tracker.id);
                      setOutsiderPage("outsiderSupport");
                    }}
                  >
                    {`Support ${tracker.name}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={observerSectionCardStyle(theme, "dashboard")}>
        {renderSectionHeader(
          observerLabels.dashboard,
          outsiderTrackers.length > 0
            ? "All approved trackers are listed here so you can choose where to focus support."
            : observerLabels.empty,
          "Overview",
          "Overview"
        )}
        {outsiderTrackers.length > 0 ? (
          <div style={dashboardStatsGridStyle}>
            {outsiderTrackers.map((tracker) => (
              <div key={tracker.id} style={summaryCardStyle(theme)}>
                <div style={summaryLabelStyle(theme)}>{tracker.name}</div>
                <div style={summaryValueStyle(theme)}>{tracker.status}</div>
                <div style={summaryNoteStyle(theme)}>
                  Theme: {tracker.themeFamily} · Goals: {tracker.activeGoals?.length || 0}
                </div>
                <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                  <button
                    style={primaryButtonStyle(theme)}
                    onClick={() => {
                      setSelectedOutsiderId(tracker.id);
                      setOutsiderPage("outsiderData");
                    }}
                  >
                    Open Data & Charts
                  </button>
                  <button
                    style={softButtonStyle(theme)}
                    onClick={() => {
                      setSelectedOutsiderId(tracker.id);
                      setOutsiderPage("outsiderSupport");
                    }}
                  >
                    Open Support
                  </button>
                  <button
                    style={softButtonStyle(theme)}
                    onClick={() => {
                      setSelectedOutsiderId(tracker.id);
                      setOutsiderPage("outsiderGoals");
                    }}
                  >
                    Open Goals
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={summaryNoteStyle(theme)}>{observerLabels.emptyBody}</p>
        )}
      </section>

      <section className="galaxy-panel" style={observerSectionCardStyle(theme, "jump")}>
        {renderSectionHeader(
          "Connect to a Tracker",
          "Enter an invite code or invite link to request outsider access.",
          "Join",
          "Join"
        )}
        {renderFeedbackMessage(connectionsMessage, theme)}
        <div style={goalFormGridStyle}>
          <div>
            <label style={labelStyle(theme)}>Invite code</label>
            <input
              style={inputStyle(theme)}
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              placeholder="STAR-ABC123"
            />
            <div style={{ marginTop: "10px" }}>
              <button style={primaryButtonStyle(theme)} onClick={joinByCode}>
                Request by Code
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle(theme)}>Invite link</label>
            <input
              style={inputStyle(theme)}
              type="text"
              value={joinLinkInput}
              onChange={(e) => setJoinLinkInput(e.target.value)}
              placeholder="Paste invite link"
            />
            <div style={{ marginTop: "10px" }}>
              <button style={softButtonStyle(theme)} onClick={joinByLink}>
                Request by Link
              </button>
            </div>
          </div>
        </div>
        <p style={{ ...summaryNoteStyle(theme), marginTop: "14px" }}>
          Approved trackers will appear here automatically after the tracker accepts the request.
        </p>
      </section>

      {outsiderTrackers.length > 0 ? (
        <div style={gridStyle}>
          <section className="galaxy-panel" style={observerSectionCardStyle(theme, "signals")}>
            {renderSectionHeader(
              "Shared Comparison",
              "Compare shared high-level trends across connected trackers.",
              "Signal",
              "Signal"
            )}
            <div style={{ display: "grid", gap: "12px" }}>
              {outsiderTrackers.map((tracker) => (
                <div key={tracker.id} style={rewardCardStyle(theme)}>
                  <div style={rewardTitleStyle(theme)}>{tracker.name}</div>
                  <div style={goalMetaStyle(theme)}>
                    Mood {tracker.moodScore}/5 · Meals {tracker.comparisonStats?.[0]?.value ?? 0} · Movement{" "}
                    {tracker.comparisonStats?.[1]?.value ?? 0}
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <button
                      style={quickJumpButtonStyle(theme)}
                      onClick={() => {
                        setSelectedOutsiderId(tracker.id);
                        setOutsiderPage("outsiderData");
                      }}
                    >
                      View Trend Charts
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="galaxy-panel" style={observerSectionCardStyle(theme, "care")}>
            {renderSectionHeader(
              "Quick Support",
              "Jump straight into the next useful action for any connected tracker.",
              "Support",
              "Support"
            )}
            <div style={quickLinkGridStyle}>
              {outsiderTrackers.slice(0, 4).map((tracker) => (
                <button
                  key={tracker.id}
                  style={quickJumpButtonStyle(theme)}
                  onClick={() => {
                    setSelectedOutsiderId(tracker.id);
                    setOutsiderPage("outsiderSupport");
                  }}
                >
                  {`Support ${tracker.name}`}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default OutsiderOverviewPage;
