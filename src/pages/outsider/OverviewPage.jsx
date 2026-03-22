function OutsiderOverviewPage({ app }) {
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
