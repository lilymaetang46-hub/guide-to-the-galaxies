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

  return (
    <div style={chartsPageStyle}>
      <section className="galaxy-panel" style={sectionCardStyle(theme, "dashboard")}>
        {renderSectionHeader("Connections", "Manage outsider access and prepare connection settings in one place.", "Connections", "Connections")}
        {connectionsLoading ? <div style={feedbackMessageStyle("info", theme)}>Loading connections...</div> : null}
        {renderFeedbackMessage(connectionsMessage, theme)}
        <div style={{ marginTop: "12px" }}>
          <button style={softButtonStyle(theme)} onClick={loadConnectionsData}>
            Refresh Connections
          </button>
        </div>
      </section>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "signals")}>
        {renderSectionHeader("Tracker Connections", "Generate invite details for outsiders you want to connect with.", "Tracker", "Tracker")}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={primaryButtonStyle(theme)} onClick={generateInviteCode}>Generate Invite Code</button>
          <button style={softButtonStyle(theme)} onClick={generateInviteLink}>Generate Invite Link</button>
        </div>
        <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
          <div style={summaryCardStyle(theme)}>
            <div style={summaryLabelStyle(theme)}>Current code</div>
            <div style={summaryNoteStyle(theme)}>{inviteCode || "No code generated yet"}</div>
          </div>
          <div style={summaryCardStyle(theme)}>
            <div style={summaryLabelStyle(theme)}>Current link</div>
            <div style={summaryNoteStyle(theme)}>{inviteLink || "No link generated yet"}</div>
          </div>
        </div>
      </section>

      <div style={gridStyle}>
        <section className="galaxy-panel" style={sectionCardStyle(theme, "care")}>
          {renderSectionHeader("Pending Requests", "Approve or reject outsider requests. Approval uses PIN confirmation.", "Requests", "Requests")}
          {pendingRequests.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No pending requests.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {pendingRequests.map((request) => (
                <div key={request.id} style={rewardCardStyle(theme)}>
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

        <section className="galaxy-panel" style={sectionCardStyle(theme, "goals")}>
          {renderSectionHeader("Connected Outsiders", "Current approved outsider connections and placeholder controls.", "Connected", "Connected")}
          {connectedOutsiders.length === 0 ? (
            <p style={emptyTextStyle(theme)}>No connected outsiders yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {connectedOutsiders.map((outsider) => (
                <div key={outsider.id} style={rewardCardStyle(theme)}>
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
                          <input type="checkbox" checked={enabled} onChange={(e) => updateOutsiderPermission(outsider.id, permissionKey, e.target.checked)} />
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

      <section className="galaxy-panel" style={sectionCardStyle(theme, "jump")}>
        {renderSectionHeader("Join As Outsider", "Enter an invite code or link to request connection to someone else.", "Join", "Join")}
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
      </section>
    </div>
  );
}

export default TrackerConnectionsPage;
