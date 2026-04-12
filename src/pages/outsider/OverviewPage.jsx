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
    clipPath: "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
  };
}

function consoleLabel(color = "#6b7078") {
  return {
    margin: 0,
    fontSize: "10px",
    color,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  };
}

function isAbyssOutsiderTheme(theme) {
  return Boolean(theme?.observerAbyssBridge && theme?.themeFamily === "underwater");
}

function industrialTexture(theme) {
  return `linear-gradient(170deg, rgba(255,255,255,${theme.modeName === "Reef" ? 0.24 : 0.08}) 0%, transparent 40%, rgba(0,0,0,${theme.modeName === "Reef" ? 0.12 : 0.3}) 100%), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,${theme.modeName === "Reef" ? 0.025 : 0.02}) 2px, rgba(255,255,255,${theme.modeName === "Reef" ? 0.025 : 0.02}) 4px), radial-gradient(circle at 12% 18%, ${theme.observerIndustrialRust} 0%, rgba(0,0,0,0) 22%), radial-gradient(circle at 72% 22%, ${theme.observerIndustrialRust} 0%, rgba(0,0,0,0) 16%), radial-gradient(circle at 22% 82%, rgba(72,34,12,${theme.modeName === "Reef" ? 0.08 : 0.18}) 0%, rgba(0,0,0,0) 18%), radial-gradient(circle at 84% 78%, rgba(255,255,255,${theme.modeName === "Reef" ? 0.08 : 0.04}) 0%, rgba(255,255,255,0) 20%), ${theme.observerIndustrialPanel}`;
}

function OutsiderOverviewPage({ app }) {
  const { width: viewportWidth } = useResponsiveViewport();
  const isMobile = viewportWidth < 768;
  const {
    theme,
    today,
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

  if (isAbyssOutsiderTheme(theme)) {
    const industrialPanel = {
      backgroundColor: theme.observerIndustrialPanelBase,
      backgroundImage: industrialTexture(theme),
      border: `3px solid ${theme.observerIndustrialBorder}`,
      borderBottomColor: theme.observerIndustrialBottomEdge,
      borderRightColor: theme.observerIndustrialBottomEdge,
      boxShadow: theme.observerIndustrialShadow,
      position: "relative",
      overflow: "hidden",
    };

    const screenWell = {
      background: theme.observerIndustrialWell,
      border: `4px solid ${theme.track}`,
      boxShadow: "inset 0 10px 30px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.05)",
      position: "relative",
      overflow: "hidden",
    };

    const industrialButton = (accent = "default") => ({
      border: accent === "danger" ? "none" : `1px solid ${theme.observerIndustrialEdge}`,
      background:
        accent === "primary"
          ? theme.primary
          : accent === "danger"
          ? "linear-gradient(180deg, #d85b57 0%, #7f1f1b 100%)"
          : theme.softButtonBackground,
      color:
        accent === "primary"
          ? theme.primaryText
          : accent === "danger"
          ? "#fff4f3"
          : theme.observerIndustrialText,
      minHeight: "42px",
      padding: "0 14px",
      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
      fontWeight: 900,
      fontSize: "10px",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      boxShadow:
        accent === "danger"
          ? "0 8px 0 #4d0f0d, 0 14px 22px rgba(0,0,0,0.34)"
          : "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 16px rgba(0,0,0,0.35)",
    });

    const selectedTracker = outsiderTrackers[0];
    const portholeTracker = selectedTracker || {
      name: "Archive_99",
      status: "Awaiting connection",
      moodScore: 0,
      comparisonStats: [],
      themeFamily: "underwater",
      activeGoals: [],
    };
    const portholeRivets = [
      { top: "-16px", left: "50%", transform: "translateX(-50%)" },
      { bottom: "-16px", left: "50%", transform: "translateX(-50%)" },
      { left: "-16px", top: "50%", transform: "translateY(-50%)" },
      { right: "-16px", top: "50%", transform: "translateY(-50%)" },
      { top: "10%", left: "10%", transform: "translate(-50%, -50%)" },
      { top: "10%", right: "10%", transform: "translate(50%, -50%)" },
      { bottom: "10%", left: "10%", transform: "translate(-50%, 50%)" },
      { bottom: "10%", right: "10%", transform: "translate(50%, 50%)" },
    ];
    const primaryTelemetryStats = [
      { label: "Oxygen_Sat", value: `${Math.max(88, 92 + (portholeTracker.moodScore ?? 0))}%`, tone: "accent" },
      { label: "Heart_Rate", value: `${68 + (portholeTracker.moodScore ?? 0)} BPM`, tone: "secondary" },
      { label: "Neural_Stability", value: portholeTracker.moodScore >= 4 ? "Nominal" : "Watch", tone: "default" },
      { label: "Goal_Links", value: `${portholeTracker.activeGoals?.length || 0} Active`, tone: "default" },
    ];
    const interceptMessages = outsiderTrackers.length
      ? [
          {
            label: "HQ_COMMS • 02M AGO",
            tone: theme.observerAccentAlt,
            body: `COORDINATES VERIFIED. ${portholeTracker.name.toUpperCase()} STATUS ${portholeTracker.status?.toUpperCase() || "NOMINAL"}.`,
          },
          {
            label: `${portholeTracker.name.toUpperCase().replace(/[^A-Z0-9]+/g, "_")} • 05M AGO`,
            tone: theme.observerAccent,
            body: `BIOMETRIC LINK STABLE. Mood ${portholeTracker.moodScore}/5 with ${portholeTracker.activeGoals?.length || 0} approved goals in queue.`,
          },
          {
            label: "BALLAST_CONTROL • 08M AGO",
            tone: theme.faintText,
            body: "HULL TENSION WITHIN LIMITS. PRESSURE ENVELOPE HOLDING AT CURRENT DEPTH BAND.",
          },
        ]
      : [
          {
            label: "NO_SIGNAL • STANDBY",
            tone: theme.faintText,
            body: "No incoming support traffic yet. Request access to bring a tracker into the bridge view.",
          },
        ];

    return (
      <div style={{ display: "grid", gap: isMobile ? "14px" : "22px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(12, minmax(0, 1fr))",
            gap: isMobile ? "14px" : "22px",
            alignItems: "stretch",
          }}
        >
          <section
            style={{
              gridColumn: isMobile ? "auto" : "span 8",
              minHeight: isMobile ? "360px" : "520px",
              borderRadius: "999px",
              border: isMobile
                ? `36px solid ${theme.observerIndustrialPanelBase}`
                : `64px solid ${theme.observerIndustrialPanelBase}`,
              background: theme.observerIndustrialWell,
              boxShadow:
                "inset 0 0 100px rgba(0,0,0,1), 0 30px 80px rgba(0,0,0,1), inset 0 0 0 8px #1a1c1e, inset 0 0 20px 10px rgba(0,0,0,0.8)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: isMobile ? "8px" : "14px",
                borderRadius: "999px",
                overflow: "hidden",
                border: isMobile ? `8px solid ${theme.track}` : `12px solid ${theme.track}`,
                boxShadow: "inset 0 0 80px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,1)",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    theme.modeName === "Reef"
                      ? "radial-gradient(circle at 50% 50%, rgba(79,209,217,0.16) 0%, rgba(79,209,217,0.08) 24%, rgba(255,255,255,0) 54%), linear-gradient(180deg, #fdf5ec 0%, #eee7dd 54%, #e3dcd0 100%)"
                      : "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.08) 24%, rgba(0,0,0,0) 54%), linear-gradient(180deg, #00050a 0%, #000810 54%, #000 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(circle at 8% 12%, rgba(110,56,16,0.14) 0%, rgba(0,0,0,0) 14%), radial-gradient(circle at 92% 16%, rgba(110,56,16,0.12) 0%, rgba(0,0,0,0) 12%), radial-gradient(circle at 16% 88%, rgba(78,34,10,0.1) 0%, rgba(0,0,0,0) 14%)",
                  mixBlendMode: theme.modeName === "Reef" ? "multiply" : "normal",
                  opacity: theme.modeName === "Reef" ? 0.34 : 0.44,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: theme.modeName === "Reef" ? 0.14 : 0.1,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 28px)",
                  backgroundSize: "100% 28px, 28px 100%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.24,
                  backgroundImage:
                    theme.modeName === "Reef"
                      ? "radial-gradient(circle, rgba(255,255,255,0.65) 0 1px, transparent 1.6px), radial-gradient(circle, rgba(79,209,217,0.24) 0 0.8px, transparent 1.4px)"
                      : "radial-gradient(circle, rgba(255,255,255,0.85) 0 1px, transparent 1.6px), radial-gradient(circle, rgba(34,211,238,0.38) 0 0.8px, transparent 1.4px)",
                  backgroundSize: "120px 120px, 200px 200px",
                  backgroundPosition: "0 0, 60px 80px",
                }}
              />
              {[
                { top: "24%", left: "18%", size: "74px", color: theme.observerAccentAlt },
                { bottom: "20%", right: "22%", size: "112px", color: theme.observerAccent },
              ].map((jelly, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    ...("top" in jelly ? { top: jelly.top } : { bottom: jelly.bottom }),
                    ...("left" in jelly ? { left: jelly.left } : { right: jelly.right }),
                    width: jelly.size,
                    height: `calc(${jelly.size} * 1.45)`,
                    opacity: index === 0 ? 0.34 : 0.24,
                    filter: `drop-shadow(0 0 25px ${jelly.color})`,
                  }}
                >
                  <svg viewBox="0 0 80 180" style={{ width: "100%", height: "100%" }}>
                    <path d="M10 60 C 10 0, 70 0, 70 60" fill={jelly.color} opacity="0.18" />
                    <g opacity="0.35" stroke={jelly.color} strokeWidth="1.5">
                      <path d="M25 65 Q 20 120, 25 175" strokeDasharray="2 3" />
                      <path d="M40 65 Q 45 125, 40 180" strokeDasharray="2 3" />
                      <path d="M55 65 Q 60 120, 55 175" strokeDasharray="2 3" />
                    </g>
                  </svg>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  inset: isMobile ? "18px" : "22px",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    color: `${theme.observerAccent}cc`,
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                    fontWeight: 700,
                    fontSize: isMobile ? "7px" : "9px",
                    letterSpacing: isMobile ? "0.16em" : "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  <div>
                    <div>TGT 28.41'N</div>
                    <div style={{ color: theme.faintText, marginTop: "4px" }}>HDG 184.2 SE</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: theme.text }}>TEMP 2.1 C</div>
                    <div style={{ color: theme.faintText, marginTop: "4px" }}>STBL</div>
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: isMobile ? "30%" : "26%",
                    left: isMobile ? "7%" : "9%",
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? "4px" : "5px",
                    textAlign: "left",
                    maxWidth: isMobile ? "54px" : "72px",
                  }}
                >
                  {[
                    `THM ${portholeTracker.themeFamily?.toUpperCase() || "UNDERWATER"}`,
                    `MD ${portholeTracker.moodScore ?? 0}/5`,
                    `GL ${portholeTracker.activeGoals?.length || 0}`,
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        color: theme.faintText,
                        fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                        fontWeight: 700,
                        fontSize: isMobile ? "6px" : "7px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: isMobile ? "31%" : "25%",
                    right: isMobile ? "7%" : "9%",
                    display: "grid",
                    gap: isMobile ? "6px" : "8px",
                    justifyItems: "end",
                  }}
                >
                  {[
                    { label: "SYNC", value: `${Math.max(84, 92 + (portholeTracker.activeGoals?.length || 0))}%` },
                    { label: "LINK", value: portholeTracker.status === "Attention needed" ? "ATTN" : "OK" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        minWidth: isMobile ? "48px" : "64px",
                        padding: isMobile ? "5px 6px" : "6px 8px",
                        border: `1px solid ${theme.observerAccent}33`,
                        background: `${theme.observerAccent}12`,
                        color: theme.observerAccent,
                        fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                        fontWeight: 900,
                        fontSize: isMobile ? "6px" : "7px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ opacity: 0.72, marginBottom: "4px" }}>{item.label}</div>
                      <div style={{ color: theme.text }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: "center", alignSelf: "center" }}>
                  <div
                    style={{
                      color: theme.observerAccent,
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontSize: isMobile ? "7px" : "9px",
                      fontWeight: 900,
                      letterSpacing: isMobile ? "0.2em" : "0.32em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Tracker
                  </div>
                  <div
                    style={{
                      color: theme.text,
                      fontFamily: theme.observerHeadingFamily,
                      fontWeight: 900,
                      fontSize: isMobile ? "1.6rem" : "2.5rem",
                      letterSpacing: "-0.04em",
                      textTransform: "uppercase",
                      textShadow: "0 0 24px rgba(34, 211, 238, 0.24)",
                      lineHeight: 0.95,
                    }}
                  >
                    {portholeTracker.name}
                  </div>
                  <div
                    style={{
                      color: theme.faintText,
                      fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                      fontSize: isMobile ? "7px" : "8px",
                      letterSpacing: isMobile ? "0.12em" : "0.18em",
                      textTransform: "uppercase",
                      marginTop: "6px",
                    }}
                  >
                    {(portholeTracker.status || "Nominal").toUpperCase()} / G{portholeTracker.activeGoals?.length || 0}
                  </div>
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {primaryTelemetryStats.slice(0, 2).map((item) => (
                      <div
                        key={item.label}
                        style={{
                          minWidth: isMobile ? "68px" : "82px",
                          padding: isMobile ? "6px 7px" : "6px 8px",
                          border: `1px solid ${theme.observerAccent}26`,
                          background: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <div
                          style={{
                            color: theme.faintText,
                            fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                            fontSize: isMobile ? "5px" : "6px",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.label.replace("_", " ")}
                        </div>
                        <div
                          style={{
                            marginTop: "4px",
                            color: item.tone === "secondary" ? theme.observerAccentAlt : theme.observerAccent,
                            fontFamily: theme.observerHeadingFamily,
                            fontWeight: 900,
                            fontSize: isMobile ? "0.72rem" : "0.82rem",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    alignSelf: "center",
                    display: "flex",
                    gap: "8px",
                    pointerEvents: "auto",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{ ...industrialButton("primary"), minHeight: isMobile ? "32px" : "34px", padding: isMobile ? "0 10px" : "0 12px", fontSize: isMobile ? "8px" : "9px" }}
                    onClick={() => {
                      if (selectedTracker) {
                        setSelectedOutsiderId(selectedTracker.id);
                        setOutsiderPage("outsiderData");
                      }
                    }}
                    disabled={!selectedTracker}
                  >
                    Telemetry
                  </button>
                  <button
                    style={{ ...industrialButton(), minHeight: isMobile ? "32px" : "34px", padding: isMobile ? "0 10px" : "0 12px", fontSize: isMobile ? "8px" : "9px" }}
                    onClick={() => setOutsiderPage("outsiderSupport")}
                  >
                    Comms
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 3,
              }}
            >
              {portholeRivets.map((position, index) => (
                <div key={`porthole-rivet-${index}`}>
                  <div
                    style={{
                      position: "absolute",
                      width: isMobile ? "14px" : "18px",
                      height: isMobile ? "14px" : "18px",
                      borderRadius: "999px",
                      background: `radial-gradient(circle at 35% 35%, ${theme.observerIndustrialRivet} 0%, ${theme.observerIndustrialEdge} 60%, #000 100%)`,
                      boxShadow: "1px 2px 4px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.12)",
                      zIndex: 2,
                      ...position,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: isMobile ? "28px" : "34px",
                      height: isMobile ? "28px" : "34px",
                      borderRadius: "999px",
                      background: `radial-gradient(circle at center, ${theme.observerIndustrialRust} 0%, rgba(0,0,0,0) 72%)`,
                      opacity: theme.modeName === "Reef" ? 0.48 : 0.64,
                      zIndex: 1,
                      ...position,
                      transform: position.transform
                        ? `${position.transform} translate(${isMobile ? "-7px, -7px" : "-8px, -8px"})`
                        : `translate(${isMobile ? "-7px, -7px" : "-8px, -8px"})`,
                    }}
                  />
                </div>
              ))}
              {[
                { top: "18%", left: "8%", width: "4px", height: "54px", rotate: "-18deg" },
                { top: "16%", right: "9%", width: "3px", height: "48px", rotate: "16deg" },
                { bottom: "18%", left: "12%", width: "3px", height: "44px", rotate: "22deg" },
              ].map((drip, index) => (
                <div
                  key={`porthole-drip-${index}`}
                  style={{
                    position: "absolute",
                    background: `linear-gradient(${theme.observerIndustrialRust}, rgba(0,0,0,0))`,
                    borderRadius: "999px",
                    filter: "blur(2px)",
                    opacity: theme.modeName === "Reef" ? 0.34 : 0.48,
                    ...("top" in drip ? { top: drip.top } : { bottom: drip.bottom }),
                    ...("left" in drip ? { left: drip.left } : { right: drip.right }),
                    width: drip.width,
                    height: drip.height,
                    transform: `rotate(${drip.rotate})`,
                  }}
                />
              ))}
            </div>
          </section>

          <section
            style={{
              ...industrialPanel,
              gridColumn: isMobile ? "auto" : "span 4",
              padding: isMobile ? "16px" : "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 18%), linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.16) 100%)",
              }}
            />
            {[
              { top: "8px", left: "8px" },
              { top: "8px", right: "8px" },
              { bottom: "8px", left: "8px" },
              { bottom: "8px", right: "8px" },
            ].map((pos, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  width: "14px",
                  height: "14px",
                  borderRadius: "999px",
                  background: `radial-gradient(circle at 35% 35%, ${theme.observerIndustrialRivet} 0%, ${theme.observerIndustrialEdge} 60%, #000 100%)`,
                  boxShadow: "1px 2px 4px rgba(0,0,0,0.8)",
                  zIndex: 2,
                  ...pos,
                }}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  color: theme.observerAccent,
                  fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  fontWeight: 900,
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                Telemetry_Unit_01
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "999px", border: `1px solid ${theme.observerAccent}33` }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: theme.observerAccent, boxShadow: `0 0 12px ${theme.observerAccent}` }} />
              </div>
            </div>

            <div style={{ ...screenWell, borderRadius: "12px", padding: isMobile ? "14px" : "16px", display: "grid", gap: "14px", flex: 1 }}>
              {outsiderTrackers.length > 0 ? (
                <>
                  <div
                    style={{
                      border: `1px solid ${theme.observerAccent}22`,
                      background: "rgba(34,211,238,0.04)",
                      padding: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ ...consoleLabel(theme.faintText), marginBottom: "6px" }}>{portholeTracker.themeFamily}</div>
                        <div style={{ color: theme.text, fontFamily: theme.observerHeadingFamily, fontWeight: 700, fontSize: "1.05rem" }}>
                          {portholeTracker.name}
                        </div>
                      </div>
                      <div style={{ color: theme.observerAccentAlt, fontFamily: theme.observerUiFamily || theme.observerHeadingFamily, fontSize: "10px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                        {portholeTracker.status}
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", color: theme.faintText, fontSize: "12px", lineHeight: 1.5 }}>
                      Mood {portholeTracker.moodScore}/5 // Goals {portholeTracker.activeGoals?.length || 0}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {primaryTelemetryStats.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          border: `1px solid ${item.tone === "secondary" ? theme.observerAccentAlt : theme.observerAccent}22`,
                          padding: "10px",
                          background: "rgba(0,0,0,0.18)",
                        }}
                      >
                        <div style={{ ...consoleLabel(theme.faintText), marginBottom: "6px" }}>{item.label}</div>
                        <div
                          style={{
                            color: item.tone === "secondary" ? theme.observerAccentAlt : item.tone === "accent" ? theme.observerAccent : theme.text,
                            fontFamily: theme.observerHeadingFamily,
                            fontWeight: 800,
                            fontSize: "1rem",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {[84, 62, 91].map((value, index) => (
                      <div key={index}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "8px",
                            marginBottom: "4px",
                            color: theme.faintText,
                            fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                            fontSize: "8px",
                            fontWeight: 700,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                          }}
                        >
                          <span>{["Signal Link", "Hull Calm", "Bridge Uplink"][index]}</span>
                          <span style={{ color: theme.observerAccent }}>{value}%</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.observerAccent}18` }}>
                          <div style={{ width: `${value}%`, height: "100%", background: index === 1 ? theme.observerAccentAlt : theme.observerAccent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ color: theme.faintText, fontSize: "13px", lineHeight: 1.6 }}>
                  No connected trackers yet. Use the command modules below to request outsider access.
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
              <button style={industrialButton()} onClick={() => setOutsiderPage("outsiderData")}>
                Recalibrate
              </button>
              <button style={industrialButton()} onClick={() => setOutsiderPage("outsiderSupport")}>
                Isolate
              </button>
            </div>
          </section>

          <section
            style={{
              ...industrialPanel,
              gridColumn: isMobile ? "auto" : "span 4",
              padding: isMobile ? "16px" : "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "12px",
                right: "12px",
                top: "14px",
                height: "2px",
                background:
                  theme.modeName === "Reef"
                    ? "linear-gradient(90deg, rgba(157,149,139,0.7) 0%, rgba(255,255,255,0.2) 50%, rgba(125,118,111,0.7) 100%)"
                    : "linear-gradient(90deg, rgba(61,66,71,0.95) 0%, rgba(255,255,255,0.06) 50%, rgba(18,20,22,0.95) 100%)",
              }}
            />
            <div>
              <div style={consoleLabel(theme.faintText)}>Depth_Level</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "6px" }}>
                <div style={{ color: theme.observerAccent, fontFamily: theme.observerHeadingFamily, fontWeight: 900, fontSize: isMobile ? "2rem" : "2.4rem", textShadow: "0 0 12px rgba(34, 211, 238, 0.8)" }}>
                  2,480
                </div>
                <div style={{ color: theme.faintText, fontFamily: theme.observerUiFamily || theme.observerHeadingFamily, fontWeight: 700, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Meters
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={consoleLabel(theme.faintText)}>Pressure</div>
              <div style={{ marginTop: "6px", color: theme.text, fontFamily: theme.observerHeadingFamily, fontWeight: 700, fontSize: "1.3rem" }}>
                248.5 ATM
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: isMobile ? "16px" : "18px",
                right: isMobile ? "16px" : "18px",
                bottom: isMobile ? "12px" : "14px",
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gap: "6px",
              }}
            >
              {[42, 58, 76, 92, 68, 54].map((value, index) => (
                <div
                  key={index}
                  style={{
                    height: `${18 + value / 4}px`,
                    alignSelf: "end",
                    background: index === 3 ? theme.observerAccent : `${theme.observerAccent}66`,
                    boxShadow: index === 3 ? `0 0 14px ${theme.observerAccent}` : "none",
                  }}
                />
              ))}
            </div>
          </section>

          <section
            style={{
              ...industrialPanel,
              gridColumn: isMobile ? "auto" : "span 5",
              padding: isMobile ? "16px" : "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 16%), linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.16) 100%)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="material-symbols-outlined" style={{ color: theme.observerAccentAlt, filter: "drop-shadow(0 0 14px rgba(255,81,250,0.6))" }}>
                radar
              </span>
              <div style={{ color: theme.text, fontFamily: theme.observerUiFamily || theme.observerHeadingFamily, fontWeight: 900, fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase" }}>
                Signal_Intercept
              </div>
            </div>
            <div style={{ ...screenWell, borderRadius: "12px", padding: isMobile ? "14px" : "16px", display: "grid", gap: "14px", minHeight: "184px" }}>
              {interceptMessages.length > 0 ? (
                interceptMessages.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderLeft: `4px solid ${item.tone}`,
                      paddingLeft: "12px",
                    }}
                  >
                    <div style={{ color: item.tone, fontFamily: theme.observerUiFamily || theme.observerHeadingFamily, fontWeight: 900, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>
                      {item.label}
                    </div>
                    <div style={{ color: theme.text, fontSize: "12px", lineHeight: 1.55 }}>
                      {item.body}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: theme.faintText, fontSize: "13px", lineHeight: 1.6 }}>
                  No incoming support traffic yet. Request access to bring a tracker into the bridge view.
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <input
                style={{
                  flex: "1 1 220px",
                  minHeight: "42px",
                  background: theme.observerIndustrialWell,
                  border: `2px solid ${theme.observerIndustrialEdge}`,
                  color: theme.observerAccent,
                  padding: "0 12px",
                  fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  outline: "none",
                }}
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="ENCODE MESSAGE / INVITE CODE"
              />
              <button style={industrialButton("primary")} onClick={joinByCode}>
                Send
              </button>
            </div>
          </section>

          <section
            style={{
              gridColumn: isMobile ? "auto" : "span 7",
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {[
              { label: "Int_Light", code: "LGT-01", active: true },
              { label: "Flood_Arrays", code: "FLOOD-A", active: true },
              { label: "Thrusters", code: "Standby", active: false, warning: true },
              { label: "Buoyancy", code: "Auto", active: false },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  ...industrialPanel,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ ...consoleLabel(item.warning ? theme.observerAlert : theme.faintText), textAlign: "center" }}>{item.label}</div>
                <div
                  style={{
                    width: "50px",
                    height: "32px",
                    background: theme.observerIndustrialWell,
                    borderRadius: "4px",
                    position: "relative",
                    boxShadow: "inset 0 4px 10px rgba(0,0,0,1)",
                    border: `2px solid ${theme.observerIndustrialBorder}`,
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: item.active
                        ? theme.primary
                        : theme.modeName === "Reef"
                        ? "linear-gradient(#d7cbbd, #a29c94)"
                        : "linear-gradient(#7a7f84, #3a3d41)",
                      borderRadius: "2px",
                      position: "absolute",
                      top: "2px",
                      left: item.active ? "20px" : "2px",
                      boxShadow: item.active ? "0 0 15px rgba(34, 211, 238, 0.6)" : "0 2px 5px rgba(0,0,0,0.8)",
                    }}
                  />
                </div>
                <div
                  style={{
                    color: item.warning ? theme.observerAlert : item.active ? theme.observerAccent : theme.faintText,
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                    fontWeight: 900,
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {item.code}
                </div>
              </div>
            ))}
            <div
              style={{
                ...industrialPanel,
                gridColumn: "1 / -1",
                padding: isMobile ? "16px" : "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ color: "rgba(0,0,0,0.42)", fontFamily: theme.observerHeadingFamily, fontWeight: 900, fontSize: isMobile ? "1rem" : "1.5rem", letterSpacing: "-0.03em" }}>
                ABYSS_CORP_HEAVY_IND
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: theme.faintText, fontFamily: theme.observerUiFamily || theme.observerHeadingFamily, fontWeight: 700, fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  System_v4.8.1_DeepSea
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginTop: "10px" }}>
                  <span style={{ width: "10px", height: "10px", background: theme.observerAccent, boxShadow: `0 0 8px ${theme.observerAccent}` }} />
                  <span style={{ width: "10px", height: "10px", background: `${theme.observerAccent}66` }} />
                  <span style={{ width: "10px", height: "10px", background: `${theme.observerAccent}33` }} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {renderFeedbackMessage(connectionsMessage, theme)}

        {!outsiderTrackers.length ? (
          <section style={{ ...industrialPanel, padding: isMobile ? "16px" : "20px" }}>
            <div style={{ color: theme.observerAccentAlt, fontFamily: theme.observerUiFamily || theme.observerHeadingFamily, fontWeight: 900, fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: "12px" }}>
              Access_Request
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
              <div>
                <label style={consoleLabel(theme.faintText)}>Invite Code</label>
                <input
                  style={{
                    width: "100%",
                    minHeight: "44px",
                    marginTop: "8px",
                    background: theme.observerIndustrialWell,
                    border: `2px solid ${theme.observerIndustrialEdge}`,
                    color: theme.text,
                    padding: "0 12px",
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  }}
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="STAR-ABC123"
                />
                <div style={{ marginTop: "10px" }}>
                  <button style={industrialButton("primary")} onClick={joinByCode}>
                    Request by Code
                  </button>
                </div>
              </div>
              <div>
                <label style={consoleLabel(theme.faintText)}>Invite Link</label>
                <input
                  style={{
                    width: "100%",
                    minHeight: "44px",
                    marginTop: "8px",
                    background: theme.observerIndustrialWell,
                    border: `2px solid ${theme.observerIndustrialEdge}`,
                    color: theme.text,
                    padding: "0 12px",
                    fontFamily: theme.observerUiFamily || theme.observerHeadingFamily,
                  }}
                  type="text"
                  value={joinLinkInput}
                  onChange={(e) => setJoinLinkInput(e.target.value)}
                  placeholder="Paste invite link"
                />
                <div style={{ marginTop: "10px" }}>
                  <button style={industrialButton()} onClick={joinByLink}>
                    Request by Link
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  if (theme.observerConsole) {
    const selectedTracker = outsiderTrackers[0] || null;
    const sideModuleStyle = (accent = "primary") => ({
      ...overviewConsolePanel(accent),
      padding: isMobile ? "12px" : "14px",
      minHeight: 0,
    });
    const actionButtonStyle = (primary = false) => ({
      ...(primary ? primaryButtonStyle(theme) : softButtonStyle(theme)),
      width: "100%",
      clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
    });
    const frameLine = {
      position: "absolute",
      border: `1px solid ${theme.observerAccent}24`,
      pointerEvents: "none",
      opacity: 0.8,
    };

    return (
      <div style={{ display: "grid", gap: "24px", marginTop: "8px" }}>
        <div style={overviewConsolePanel()}>
            <div style={panelChrome()} />
            <div
              style={{
                position: "relative",
                minHeight: isMobile ? "auto" : "540px",
                padding: isMobile ? "14px" : "18px",
                border: `1px solid ${theme.observerAccent}20`,
                background: "rgba(7, 12, 20, 0.24)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: "translateX(-50%)",
                  width: isMobile ? "72%" : "56%",
                  height: "16px",
                  borderLeft: `1px solid ${theme.observerAccent}44`,
                  borderRight: `1px solid ${theme.observerAccent}44`,
                  borderBottom: `1px solid ${theme.observerAccent}44`,
                  background: `${theme.observerAccent}10`,
                  clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
                }}
              />
              <div
                style={{
                  display: "grid",
                  gap: isMobile ? "14px" : "18px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    minHeight: isMobile ? "340px" : "420px",
                    padding: isMobile ? "18px 16px 22px" : "26px 28px 30px",
                    border: `1px solid ${theme.observerAccent}26`,
                    background:
                      theme.modeName === "Solar"
                        ? "linear-gradient(180deg, rgba(245,239,229,0.42) 0%, rgba(223,214,202,0.14) 100%)"
                        : "linear-gradient(180deg, rgba(10,17,28,0.5) 0%, rgba(6,10,18,0.24) 100%)",
                    clipPath: "polygon(10% 0, 90% 0, 100% 12%, 100% 88%, 90% 100%, 10% 100%, 0 88%, 0 12%)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", left: "14%", right: "14%", top: "18px", height: "4px", background: `${theme.observerAccent}2e`, borderRadius: "999px" }} />
                  <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "20px", width: "34%", height: "22px", borderTop: `2px solid ${warningTextColor}`, borderRadius: "50%", opacity: 0.8 }} />
                  <div style={{ position: "absolute", left: "50%", top: "50%", width: "72px", height: "72px", transform: "translate(-50%, -50%)", border: `1px solid ${theme.observerAccent}34`, borderRadius: "50%" }} />
                  <div style={{ position: "absolute", left: "50%", top: "50%", width: "12px", height: "12px", transform: "translate(-50%, -50%)", borderRadius: "50%", background: theme.observerAccent, boxShadow: `0 0 16px ${theme.observerAccent}` }} />
                  <div style={{ position: "absolute", left: "24px", top: "50%", width: "22px", borderTop: `3px double ${theme.observerAccent}66` }} />
                  <div style={{ position: "absolute", right: "24px", top: "50%", width: "22px", borderTop: `3px double ${theme.observerAccent}66` }} />
                  <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                      <span style={consoleLabel()}>[01] PRIMARY_VIEWPORT</span>
                      <span style={consoleLabel(theme.observerAccent)}>OVERVIEW</span>
                    </div>
                    {selectedTracker ? (
                      <>
                        <div>
                          <p style={{ ...consoleLabel(theme.faintText), marginBottom: "8px" }}>{selectedTracker.themeFamily}</p>
                          <p style={{ margin: 0, fontFamily: "Newsreader, serif", fontSize: isMobile ? "2rem" : "2.8rem", color: theme.text, lineHeight: 0.94 }}>
                            {selectedTracker.name}
                          </p>
                          <p style={{ margin: "10px 0 0", color: theme.faintText, fontSize: "12px", lineHeight: 1.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Status {selectedTracker.status}
                          </p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, max-content))", gap: "10px", marginTop: "auto", alignItems: "end" }}>
                          <button
                            style={actionButtonStyle(true)}
                            onClick={() => {
                              setSelectedOutsiderId(selectedTracker.id);
                              setOutsiderPage("outsiderData");
                            }}
                          >
                            Open Telemetry
                          </button>
                          <button
                            style={actionButtonStyle(false)}
                            onClick={() => {
                              setSelectedOutsiderId(selectedTracker.id);
                              setOutsiderPage("outsiderSupport");
                            }}
                          >
                            Open Comms
                          </button>
                        </div>
                      </>
                    ) : (
                      <p style={{ margin: 0, color: "#929095", fontSize: "13px" }}>{observerLabels.emptyBody}</p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "minmax(220px, 0.52fr) minmax(0, 1fr) minmax(220px, 0.52fr)",
                    gap: isMobile ? "12px" : "14px",
                    marginTop: "16px",
                  }}
                >
                  <div style={sideModuleStyle()}>
                    <div style={panelChrome()} />
                    <span style={consoleLabel()}>[03] READOUT</span>
                    <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
                      {[selectedTracker?.name || "No tracker", selectedTracker?.status || "Waiting", today].map((item) => (
                        <div
                          key={item}
                          style={{
                            padding: "10px 12px",
                            border: `1px solid ${theme.observerAccent}22`,
                            background: "rgba(0,0,0,0.16)",
                            color: theme.text,
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            clipPath: "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)",
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={sideModuleStyle()}>
                    <div style={panelChrome()} />
                    <div style={{ display: "grid", placeItems: "center", minHeight: isMobile ? "88px" : "100px" }}>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "220px",
                          height: "56px",
                          border: `1px solid ${theme.observerAccent}2a`,
                          background: `${theme.observerAccent}08`,
                          clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)",
                          display: "grid",
                          placeItems: "center",
                          color: theme.observerAccent,
                          fontSize: "12px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                        }}
                      >
                        Overview Hub
                      </div>
                    </div>
                  </div>

                  <div style={sideModuleStyle(selectedTracker ? "warning" : "primary")}>
                    <div style={panelChrome(selectedTracker ? "warning" : "primary")} />
                    <span style={consoleLabel(selectedTracker ? warningTextColor : theme.observerAccent)}>[04] STATUS</span>
                    <p style={{ margin: "10px 0 0", fontFamily: "Newsreader, serif", fontSize: "1.25rem", color: selectedTracker ? warningTextColor : theme.observerAccent }}>
                      {selectedTracker ? "Ready" : "No Link"}
                    </p>
                    <p style={{ margin: "8px 0 0", color: selectedTracker ? warningMutedColor : theme.faintText, fontSize: "12px", lineHeight: 1.7 }}>
                      {selectedTracker ? "Open telemetry or comms from the main viewport." : "Use an invite code or link to connect a tracker."}
                    </p>
                  </div>
                </div>

                {!selectedTracker ? (
                  <div style={{ ...sideModuleStyle(), marginTop: "14px" }}>
                    <div style={panelChrome()} />
                    <span style={consoleLabel()}>[05] REQUEST_ACCESS</span>
                    {renderFeedbackMessage(connectionsMessage, theme)}
                    <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
                      <div>
                        <label style={consoleLabel()}>Invite Code</label>
                        <input
                          style={inputStyle(theme)}
                          type="text"
                          value={joinCodeInput}
                          onChange={(e) => setJoinCodeInput(e.target.value)}
                          placeholder="STAR-ABC123"
                        />
                      </div>
                      <button style={actionButtonStyle(true)} onClick={joinByCode}>
                        Request by Code
                      </button>
                      <div>
                        <label style={consoleLabel()}>Invite Link</label>
                        <input
                          style={inputStyle(theme)}
                          type="text"
                          value={joinLinkInput}
                          onChange={(e) => setJoinLinkInput(e.target.value)}
                          placeholder="Paste invite link"
                        />
                      </div>
                      <button style={actionButtonStyle(false)} onClick={joinByLink}>
                        Request by Link
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
        </div>
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
