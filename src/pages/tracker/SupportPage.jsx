function TrackerSupportPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    sectionCardStyle,
    renderSectionHeader,
    renderFeedbackMessage,
    supportInboxMessage,
    supportInboxLoading,
    primaryButtonStyle,
    softButtonStyle,
    loadSupportInbox,
    unreadSupportCount,
    supportInbox,
    emptyTextStyle,
    rewardCardStyle,
    rewardTitleStyle,
    goalMetaStyle,
    markSupportMessageRead,
    smallInfoStyle,
  } = app;
  const disableGalaxyFrame =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const sectionStyle = (sectionKey) =>
    sectionCardStyle(theme, sectionKey, { disableCelestialFrame: disableGalaxyFrame });
  const rewardStyle = rewardCardStyle(theme, { disableCelestialFrame: disableGalaxyFrame });

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionStyle("signals")}>
        {renderSectionHeader("Support Inbox", "View nudges and encouragement sent by connected outsiders.", "Signal", "Signal")}
        {renderFeedbackMessage(supportInboxMessage, theme)}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
          <button style={softButtonStyle(theme)} onClick={loadSupportInbox}>
            Refresh Inbox
          </button>
          <div style={smallInfoStyle(theme)}>Unread messages: {unreadSupportCount}</div>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionStyle("dashboard")}>
        {renderSectionHeader("Recent Nudges", "Messages appear here when an outsider sends one.", "Support", "Support")}
        {supportInboxLoading ? (
          <p style={smallInfoStyle(theme)}>Loading support messages...</p>
        ) : supportInbox.length === 0 ? (
          <p style={emptyTextStyle(theme)}>No support messages yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {supportInbox.map((item) => (
              <div key={item.id} style={rewardStyle}>
                <div style={rewardTitleStyle(theme)}>{item.message}</div>
                <div style={goalMetaStyle(theme)}>
                  From {item.outsiderName} on {item.createdAtLabel}
                </div>
                <div style={goalMetaStyle(theme)}>{item.readAt ? "Read" : "Unread"}</div>
                {!item.readAt ? (
                  <div style={{ marginTop: "12px" }}>
                    <button style={primaryButtonStyle(theme)} onClick={() => markSupportMessageRead(item.id)}>
                      Mark Read
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TrackerSupportPage;
