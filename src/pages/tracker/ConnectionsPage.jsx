function TrackerConnectionsPage({ app }) {
  const {
    theme,
    chartsPageStyle,
    sectionCardStyle,
    renderSectionHeader,
    connectionsLoading,
    feedbackMessageStyle,
    renderFeedbackMessage,
    connectionsMessage,
    primaryButtonStyle,
    generateInviteCode,
    softButtonStyle,
    generateInviteLink,
    loadConnectionsData,
    summaryCardStyle,
    summaryLabelStyle,
    summaryNoteStyle,
    inviteCode,
    inviteLink,
    gridStyle,
    pendingRequests,
    emptyTextStyle,
    rewardCardStyle,
    rewardTitleStyle,
    goalMetaStyle,
    requestApproval,
    rejectRequest,
    connectedOutsiders,
    goalFormGridStyle,
    labelStyle,
    inputStyle,
    updateOutsiderSetting,
    permissionsGridStyle,
    normalizeConnectionPermissions,
    permissionItemStyle,
    updateOutsiderPermission,
    revokeOutsider,
    joinCodeInput,
    setJoinCodeInput,
    joinByCode,
    joinLinkInput,
    setJoinLinkInput,
    joinByLink,
  } = app;
  const disableGalaxyFrame =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const sectionStyle = (sectionKey) =>
    sectionCardStyle(theme, sectionKey, { disableCelestialFrame: disableGalaxyFrame });
  const summaryStyle = summaryCardStyle(theme, { disableCelestialFrame: disableGalaxyFrame });
  const rewardStyle = rewardCardStyle(theme, { disableCelestialFrame: disableGalaxyFrame });
  const infoChipStyle = (emphasis = false) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "34px",
    padding: "0.44rem 0.8rem",
    borderRadius: "999px",
    border: emphasis ? "none" : theme.border,
    background: emphasis
      ? theme.primary
      : theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.06)",
    color: emphasis ? theme.primaryText : theme.text,
    fontWeight: 700,
    fontSize: "0.88rem",
  });
  const summaryPanelStyle = {
    display: "grid",
    gap: "14px",
    padding: "16px",
    borderRadius: "22px",
    border: theme.border,
    background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
  };

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionStyle("dashboard")}>
        {renderSectionHeader("Connections", "Manage outsider access and prepare connection settings in one place.", "Connections", "Connections")}
        {connectionsLoading ? <div style={feedbackMessageStyle("info", theme)}>Loading connections...</div> : null}
        {renderFeedbackMessage(connectionsMessage, theme)}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px", alignItems: "center" }}>
          <div style={infoChipStyle()}>{`${pendingRequests.length} pending`}</div>
          <div style={infoChipStyle()}>{`${connectedOutsiders.length} connected`}</div>
          <button style={softButtonStyle(theme)} onClick={loadConnectionsData}>
            Refresh Connections
          </button>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionStyle("signals")}>
        {renderSectionHeader("Tracker Connections", "Generate invite details here, then manage requests and outsider settings below.", "Tracker", "Tracker")}
        <div style={summaryPanelStyle}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ ...summaryLabelStyle(theme), margin: 0 }}>Invite setup</p>
            <div style={infoChipStyle(true)}>{inviteCode || inviteLink ? "Ready to share" : "Generate invite"}</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={primaryButtonStyle(theme)} onClick={generateInviteCode}>Generate Invite Code</button>
            <button style={softButtonStyle(theme)} onClick={generateInviteLink}>Generate Invite Link</button>
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={summaryStyle}>
              <div style={summaryLabelStyle(theme)}>Current code</div>
              <div style={summaryNoteStyle(theme)}>{inviteCode || "No code generated yet"}</div>
            </div>
            <div style={summaryStyle}>
              <div style={summaryLabelStyle(theme)}>Current link</div>
              <div style={summaryNoteStyle(theme)}>{inviteLink || "No link generated yet"}</div>
            </div>
          </div>
        </div>
      </section>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={sectionStyle("care")}>
          {renderSectionHeader("Pending Requests", "Approve or reject outsider requests. Approval uses PIN confirmation.", "Requests", "Requests")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px", alignItems: "center" }}>
            <div style={infoChipStyle()}>{`${pendingRequests.length} waiting`}</div>
          </div>
          {pendingRequests.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No pending requests.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {pendingRequests.map((request) => (
                <div key={request.id} style={rewardStyle}>
                  <div style={rewardTitleStyle(theme)}>{request.name}</div>
                  <div style={goalMetaStyle(theme)}>{request.note}</div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                    <button style={primaryButtonStyle(theme)} onClick={() => requestApproval(request.id)}>Approve</button>
                    <button style={softButtonStyle(theme)} onClick={() => rejectRequest(request.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="galaxy-panel" style={sectionStyle("goals")}>
          {renderSectionHeader("Connected Outsiders", "Current approved outsider connections and placeholder controls.", "Connected", "Connected")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px", alignItems: "center" }}>
            <div style={infoChipStyle()}>{`${connectedOutsiders.length} connected`}</div>
          </div>
          {connectedOutsiders.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No connected outsiders yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {connectedOutsiders.map((outsider) => (
                <div key={outsider.id} style={rewardStyle}>
                  <div style={rewardTitleStyle(theme)}>{outsider.name}</div>
                  <div style={goalFormGridStyle}>
                    <div>
                      <label style={labelStyle(theme)}>Name visibility</label>
                      <select style={inputStyle(theme)} value={outsider.nameVisibility} onChange={(e) => updateOutsiderSetting(outsider.id, "nameVisibility", e.target.value)}>
                        <option value="display">display name</option>
                        <option value="secondary">secondary display name</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle(theme)}>Notification cap</label>
                      <input style={inputStyle(theme)} type="number" min="1" value={outsider.notificationCap} onChange={(e) => updateOutsiderSetting(outsider.id, "notificationCap", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle(theme)}>Cooldown length</label>
                      <input style={inputStyle(theme)} type="number" min="1" value={outsider.cooldownLength} onChange={(e) => updateOutsiderSetting(outsider.id, "cooldownLength", e.target.value)} />
                    </div>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <label style={labelStyle(theme)}>Permissions</label>
                    <div style={permissionsGridStyle}>
                      {Object.entries(normalizeConnectionPermissions(outsider.permissions)).map(([permissionKey, enabled]) => (
                        <label key={permissionKey} style={permissionItemStyle(theme)}>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => updateOutsiderPermission(outsider.id, permissionKey, e.target.checked)}
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: theme.trackerAccent || theme.success,
                              cursor: "pointer",
                              flex: "0 0 auto",
                            }}
                          />
                          <span style={{ textTransform: "capitalize" }}>{permissionKey}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <button style={softButtonStyle(theme)} onClick={() => revokeOutsider(outsider.id)}>Remove / Revoke</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="galaxy-panel" style={sectionStyle("jump")}>
        {renderSectionHeader("Join As Outsider", "Enter an invite code or link to request connection to someone else.", "Join", "Join")}
        <div style={summaryPanelStyle}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ ...summaryLabelStyle(theme), margin: 0 }}>Request access</p>
            <div style={infoChipStyle()}>{joinCodeInput || joinLinkInput ? "In progress" : "Optional"}</div>
          </div>
          <div style={goalFormGridStyle}>
            <div>
              <label style={labelStyle(theme)}>Join by Code</label>
              <input style={inputStyle(theme)} type="text" value={joinCodeInput} onChange={(e) => setJoinCodeInput(e.target.value)} placeholder="STAR-ABC123" />
              <div style={{ marginTop: "10px" }}>
                <button style={primaryButtonStyle(theme)} onClick={joinByCode}>Join by Code</button>
              </div>
            </div>

            <div>
              <label style={labelStyle(theme)}>Join by Link</label>
              <input style={inputStyle(theme)} type="text" value={joinLinkInput} onChange={(e) => setJoinLinkInput(e.target.value)} placeholder="Paste invite link" />
              <div style={{ marginTop: "10px" }}>
                <button style={softButtonStyle(theme)} onClick={joinByLink}>Join by Link</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TrackerConnectionsPage;
