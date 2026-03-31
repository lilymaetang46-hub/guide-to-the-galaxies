function formatShortDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function buildLinePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function buildSteppedLinePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const commands = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    commands.push(`L ${current.x} ${previous.y}`);
    commands.push(`L ${current.x} ${current.y}`);
  }

  return commands.join(" ");
}

function getGalaxyTrackerChartFrame(panelTone = "charts") {
  const frames = {
    charts: {
      shellGlow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 26px 46px rgba(4,8,24,0.34), 0 0 26px rgba(244,214,122,0.08)",
      legendBorder: "rgba(244,214,122,0.2)",
      plotBorder: "rgba(244,214,122,0.22)",
      plotGlow: "0 18px 30px rgba(0,0,0,0.18), 0 0 20px rgba(244,214,122,0.04)",
      aura:
        "radial-gradient(circle at 16% 18%, rgba(114,208,255,0.16) 0%, rgba(114,208,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(255,240,195,0.1) 0%, rgba(255,240,195,0) 22%), radial-gradient(circle at 50% 100%, rgba(160,148,255,0.08) 0%, rgba(160,148,255,0) 36%)",
    },
    care: {
      shellGlow:
        "0 0 0 1px rgba(255,245,214,0.08), 0 26px 46px rgba(4,8,24,0.34), 0 0 26px rgba(244,214,122,0.08)",
      legendBorder: "rgba(244,214,122,0.2)",
      plotBorder: "rgba(244,214,122,0.22)",
      plotGlow: "0 18px 30px rgba(0,0,0,0.18), 0 0 20px rgba(244,214,122,0.04)",
      aura:
        "radial-gradient(circle at 16% 18%, rgba(245,163,255,0.16) 0%, rgba(245,163,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(166,150,255,0.12) 0%, rgba(166,150,255,0) 22%), radial-gradient(circle at 50% 100%, rgba(255,209,102,0.08) 0%, rgba(255,209,102,0) 36%)",
    },
  };

  return frames[panelTone] || frames.charts;
}

function CelestialFrameOverlay({ title, subtitle }) {
  const starbursts = [
    { x: 44, y: 34, r: 10 },
    { x: 1156, y: 34, r: 10 },
    { x: 44, y: 556, r: 11 },
    { x: 72, y: 544, r: 7 },
    { x: 1156, y: 556, r: 12 },
    { x: 1128, y: 540, r: 6 },
  ];

  const accentStars = [
    [172, 18], [214, 24], [252, 20], [286, 16], [914, 16], [948, 20], [986, 24], [1028, 18],
    [70, 96], [96, 110], [1130, 96], [1104, 110], [104, 548], [1090, 548], [138, 566], [1044, 568],
    [34, 244], [28, 334], [30, 470], [1168, 228], [1172, 320], [1166, 418], [602, 86], [580, 90], [624, 90],
    [152, 60], [1048, 60], [176, 552], [1022, 554],
  ];

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    >
      <defs>
        <linearGradient id="celestialGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2c6" />
          <stop offset="45%" stopColor="#f4d67a" />
          <stop offset="100%" stopColor="#c89639" />
        </linearGradient>
        <linearGradient id="celestialGoldSoft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,242,198,0)" />
          <stop offset="18%" stopColor="rgba(244,214,122,0.85)" />
          <stop offset="50%" stopColor="rgba(255,242,198,0.96)" />
          <stop offset="82%" stopColor="rgba(244,214,122,0.85)" />
          <stop offset="100%" stopColor="rgba(255,242,198,0)" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="10" y="10" width="1180" height="580" rx="28" fill="none" stroke="url(#celestialGold)" strokeWidth="1.9" />
      <rect x="18" y="18" width="1164" height="564" rx="26" fill="none" stroke="rgba(244,214,122,0.72)" strokeWidth="1.3" />
      <rect x="30" y="30" width="1140" height="540" rx="22" fill="none" stroke="rgba(244,214,122,0.18)" strokeWidth="0.95" />

      <path d="M28 64 Q28 26 68 26 H230" fill="none" stroke="url(#celestialGold)" strokeWidth="1.75" />
      <path d="M42 74 Q42 42 78 42 H198" fill="none" stroke="rgba(244,214,122,0.52)" strokeWidth="1.15" />
      <path d="M1172 64 Q1172 26 1132 26 H970" fill="none" stroke="url(#celestialGold)" strokeWidth="1.75" />
      <path d="M1158 74 Q1158 42 1122 42 H1002" fill="none" stroke="rgba(244,214,122,0.52)" strokeWidth="1.15" />

      <path d="M22 504 Q22 576 96 576 L230 576" fill="none" stroke="url(#celestialGold)" strokeWidth="1.65" />
      <path d="M34 492 Q34 558 100 558 L198 558" fill="none" stroke="rgba(244,214,122,0.5)" strokeWidth="1.1" />
      <path d="M46 480 Q46 542 108 542 L176 542" fill="none" stroke="rgba(244,214,122,0.24)" strokeWidth="0.9" />
      <path d="M1178 504 Q1178 576 1104 576 L970 576" fill="none" stroke="url(#celestialGold)" strokeWidth="1.65" />
      <path d="M1166 492 Q1166 558 1100 558 L1002 558" fill="none" stroke="rgba(244,214,122,0.5)" strokeWidth="1.1" />
      <path d="M1154 480 Q1154 542 1092 542 L1024 542" fill="none" stroke="rgba(244,214,122,0.24)" strokeWidth="0.9" />

      <path d="M58 96 C34 128, 34 176, 58 208 C82 238, 82 286, 58 316" fill="none" stroke="url(#celestialGoldSoft)" strokeWidth="2.8" />
      <path d="M70 110 C52 136, 52 174, 70 198 C88 222, 88 260, 70 284" fill="none" stroke="rgba(244,214,122,0.48)" strokeWidth="1.35" />
      <path d="M1142 96 C1166 128, 1166 176, 1142 208 C1118 238, 1118 286, 1142 316" fill="none" stroke="url(#celestialGoldSoft)" strokeWidth="2.8" />
      <path d="M1130 110 C1148 136, 1148 174, 1130 198 C1112 222, 1112 260, 1130 284" fill="none" stroke="rgba(244,214,122,0.48)" strokeWidth="1.35" />
      <path d="M58 356 C34 388, 34 436, 58 468 C82 498, 82 536, 58 558" fill="none" stroke="url(#celestialGoldSoft)" strokeWidth="2.8" />
      <path d="M70 372 C52 398, 52 436, 70 460 C88 484, 88 516, 70 536" fill="none" stroke="rgba(244,214,122,0.48)" strokeWidth="1.35" />
      <path d="M1142 356 C1166 388, 1166 436, 1142 468 C1118 498, 1118 536, 1142 558" fill="none" stroke="url(#celestialGoldSoft)" strokeWidth="2.8" />
      <path d="M1130 372 C1148 398, 1148 436, 1130 460 C1112 484, 1112 516, 1130 536" fill="none" stroke="rgba(244,214,122,0.48)" strokeWidth="1.35" />

      <path d="M126 18 H430" fill="none" stroke="rgba(244,214,122,0.46)" strokeWidth="1.2" />
      <path d="M770 18 H1074" fill="none" stroke="rgba(244,214,122,0.46)" strokeWidth="1.2" />
      <path d="M154 32 H364" fill="none" stroke="rgba(244,214,122,0.18)" strokeWidth="0.95" />
      <path d="M836 32 H1046" fill="none" stroke="rgba(244,214,122,0.18)" strokeWidth="0.95" />
      <path d="M58 582 H1142" fill="none" stroke="rgba(244,214,122,0.3)" strokeWidth="1" />
      <path d="M84 548 H182" fill="none" stroke="rgba(244,214,122,0.18)" strokeWidth="1" />
      <path d="M1018 548 H1116" fill="none" stroke="rgba(244,214,122,0.18)" strokeWidth="1" />

      <path d="M452 10 H748 L782 60 L748 122 H452 L418 60 Z" fill="rgba(10,14,28,0.95)" stroke="url(#celestialGold)" strokeWidth="2.2" />
      <path d="M474 22 H726 L752 60 L726 108 H474 L448 60 Z" fill="none" stroke="rgba(244,214,122,0.44)" strokeWidth="1.25" />
      <path d="M492 30 H708 L728 60 L708 100 H492 L472 60 Z" fill="none" stroke="rgba(244,214,122,0.16)" strokeWidth="0.95" />
      <path d="M432 46 H416" fill="none" stroke="url(#celestialGold)" strokeWidth="1.55" />
      <path d="M768 46 H784" fill="none" stroke="url(#celestialGold)" strokeWidth="1.55" />
      <circle cx="414" cy="46" r="2.2" fill="#f4d67a" />
      <circle cx="786" cy="46" r="2.2" fill="#f4d67a" />
      <path d="M446 10 C434 28, 428 44, 426 60 C428 76, 434 94, 446 122" fill="none" stroke="rgba(244,214,122,0.56)" strokeWidth="1.3" />
      <path d="M754 10 C766 28, 772 44, 774 60 C772 76, 766 94, 754 122" fill="none" stroke="rgba(244,214,122,0.56)" strokeWidth="1.3" />
      <path d="M464 8 C452 22, 444 42, 442 60 C444 78, 452 100, 464 124" fill="none" stroke="rgba(244,214,122,0.24)" strokeWidth="1" />
      <path d="M736 8 C748 22, 756 42, 758 60 C756 78, 748 100, 736 124" fill="none" stroke="rgba(244,214,122,0.24)" strokeWidth="1" />

      <text x="600" y="30" textAnchor="middle" fill="#fff1d5" fontSize="14" letterSpacing="1.25" fontWeight="700">
        {String(title || "").toUpperCase()}
      </text>
      <text x="600" y="53" textAnchor="middle" fill="rgba(232,221,194,0.8)" fontSize="7.6" letterSpacing="0.45">
        {subtitle}
      </text>
      <text x="600" y="72" textAnchor="middle" fill="rgba(232,221,194,0.8)" fontSize="7.6" letterSpacing="0.45">
        {"guided across time"}
      </text>

      {starbursts.map((star, index) => (
        <g key={`burst-${index}`} transform={`translate(${star.x} ${star.y})`} filter="url(#goldGlow)" opacity="0.92">
          <line x1={-star.r} y1="0" x2={star.r} y2="0" stroke="#fff0c3" strokeWidth="1.4" />
          <line x1="0" y1={-star.r} x2="0" y2={star.r} stroke="#fff0c3" strokeWidth="1.4" />
          <line x1={-star.r * 0.72} y1={-star.r * 0.72} x2={star.r * 0.72} y2={star.r * 0.72} stroke="rgba(244,214,122,0.72)" strokeWidth="1" />
          <line x1={-star.r * 0.72} y1={star.r * 0.72} x2={star.r * 0.72} y2={-star.r * 0.72} stroke="rgba(244,214,122,0.72)" strokeWidth="1" />
        </g>
      ))}

      <g transform="translate(44 34)" filter="url(#goldGlow)">
        <polygon points="0,-18 7,-7 18,0 7,7 0,18 -7,7 -18,0 -7,-7" fill="rgba(255,240,195,0.2)" stroke="#fff0c3" strokeWidth="1.6" />
        <polygon points="0,-11 4,-4 11,0 4,4 0,11 -4,4 -11,0 -4,-4" fill="rgba(244,214,122,0.24)" stroke="rgba(244,214,122,0.92)" strokeWidth="1.1" />
      </g>
      <g transform="translate(1156 34)" filter="url(#goldGlow)">
        <polygon points="0,-18 7,-7 18,0 7,7 0,18 -7,7 -18,0 -7,-7" fill="rgba(255,240,195,0.2)" stroke="#fff0c3" strokeWidth="1.6" />
        <polygon points="0,-11 4,-4 11,0 4,4 0,11 -4,4 -11,0 -4,-4" fill="rgba(244,214,122,0.24)" stroke="rgba(244,214,122,0.92)" strokeWidth="1.1" />
      </g>
      <g transform="translate(44 556)" filter="url(#goldGlow)">
        <polygon points="0,-15 6,-6 15,0 6,6 0,15 -6,6 -15,0 -6,-6" fill="rgba(255,240,195,0.16)" stroke="rgba(244,214,122,0.86)" strokeWidth="1.4" />
      </g>
      <g transform="translate(1156 556)" filter="url(#goldGlow)">
        <polygon points="0,-15 6,-6 15,0 6,6 0,15 -6,6 -15,0 -6,-6" fill="rgba(255,240,195,0.16)" stroke="rgba(244,214,122,0.86)" strokeWidth="1.4" />
      </g>

      {accentStars.map(([x, y], index) => (
        <circle key={`small-${index}`} cx={x} cy={y} r="1.6" fill="rgba(255,240,195,0.9)" />
      ))}
    </svg>
  );
}

function LineTrendChart({ title, subtitle, data, yMax, series, theme, chartCardStyle, panelTone }) {
  const isConsoleChart = theme.observerChartMode === "stepped";
  const isSolarConsole = isConsoleChart && theme.modeName === "Solar";
  const isGalaxyTrackerCard =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;

  const width = 500;
  const height = 198;
  const padding = { top: 16, right: 28, bottom: 54, left: 52 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const safeMax = Math.max(yMax, 1);

  const getX = (index) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value) => {
    const normalized = Math.max(0, Math.min(value, safeMax)) / safeMax;
    return padding.top + chartHeight - normalized * chartHeight;
  };

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const value = (safeMax / 4) * index;
    const y = getY(value);
    return { value, y };
  });

  const galaxyTrackerFrame = getGalaxyTrackerChartFrame(panelTone);

  const legend = (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: isGalaxyTrackerCard ? "0" : "12px" }}>
      {series.map((item) => (
        <div
          key={item.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: isGalaxyTrackerCard ? "7px 10px" : "7px 10px",
            borderRadius: isGalaxyTrackerCard ? "999px" : isConsoleChart ? "10px" : "999px",
            background: isGalaxyTrackerCard
              ? "linear-gradient(180deg, rgba(15,18,34,0.82) 0%, rgba(22,26,48,0.7) 100%)"
              : isSolarConsole
              ? "rgba(255,255,255,0.45)"
              : theme.itemBackground,
            color: isSolarConsole ? theme.text : theme.subtleText,
            fontSize: isGalaxyTrackerCard ? "0.8rem" : "0.88rem",
            fontWeight: "bold",
            fontFamily: theme.observerFontFamily,
            letterSpacing: isConsoleChart ? "0.05em" : "normal",
            textTransform: isConsoleChart ? "uppercase" : "none",
            border: isGalaxyTrackerCard ? `1px solid ${galaxyTrackerFrame.legendBorder}` : "none",
            boxShadow: isGalaxyTrackerCard ? "0 10px 20px rgba(0,0,0,0.16)" : "none",
          }}
        >
          <span
            style={{
              width: isGalaxyTrackerCard ? "8px" : "10px",
              height: isGalaxyTrackerCard ? "8px" : "10px",
              borderRadius: "50%",
              backgroundColor: item.color,
              boxShadow: isSolarConsole ? "none" : `0 0 10px ${item.color}`,
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );

  const chartSvg = (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {isConsoleChart ? (
        <rect
          x={padding.left}
          y={padding.top}
          width={chartWidth}
          height={chartHeight}
          fill="none"
          stroke={theme.chartGrid}
          strokeWidth="1"
          opacity="0.8"
        />
      ) : null}
      {gridLines.map((line) => (
        <g key={line.value}>
          <line x1={padding.left} y1={line.y} x2={width - padding.right} y2={line.y} stroke={theme.chartGrid} strokeWidth="1" />
          <text x={padding.left - 12} y={line.y + 4} textAnchor="end" fill={theme.chartLabel} fontSize="10" fontFamily={theme.observerFontFamily}>
            {Math.round(line.value)}
          </text>
        </g>
      ))}

      {data.map((item, index) => (
        <text
          key={`${item.date}-${index}`}
          x={getX(index)}
          y={height - 16}
          textAnchor="middle"
          fill={theme.chartLabel}
          fontSize="10"
          fontFamily={theme.observerFontFamily}
        >
          {formatShortDate(item.date)}
        </text>
      ))}

      {series.map((item) => {
        const points = data.map((entry, index) => ({
          x: getX(index),
          y: getY(Number(entry[item.key] ?? 0)),
          value: Number(entry[item.key] ?? 0),
        }));
        const path = isConsoleChart ? buildSteppedLinePath(points) : buildLinePath(points);

        return (
          <g key={item.key}>
            <path
              d={path}
              fill="none"
              stroke={item.color}
              strokeWidth={isConsoleChart ? "5" : "8"}
              strokeLinecap={isConsoleChart ? "square" : "round"}
              strokeLinejoin={isConsoleChart ? "miter" : "round"}
              opacity={isSolarConsole ? "0.04" : isConsoleChart ? "0.08" : "0.14"}
            />
            <path
              d={path}
              fill="none"
              stroke={item.color}
              strokeWidth={isSolarConsole ? "2.2" : isConsoleChart ? "1.8" : "3"}
              strokeLinecap={isConsoleChart ? "square" : "round"}
              strokeLinejoin={isConsoleChart ? "miter" : "round"}
            />
            {points.map((point, index) => (
              <g key={`${item.key}-${index}`}>
                {isConsoleChart ? (
                  <>
                    <rect x={point.x - 3.5} y={point.y - 3.5} width="7" height="7" fill={item.color} opacity="0.18" />
                    <rect
                      x={point.x - 2}
                      y={point.y - 2}
                      width="4"
                      height="4"
                      fill={item.color}
                      stroke={isSolarConsole ? "rgba(255,255,255,0.65)" : theme.chartSurface}
                      strokeWidth="1"
                    />
                  </>
                ) : (
                  <>
                    <circle cx={point.x} cy={point.y} r="5" fill={item.color} opacity="0.22" />
                    <circle cx={point.x} cy={point.y} r="2.8" fill={item.color} stroke={theme.chartSurface} strokeWidth="1.5" />
                  </>
                )}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );

  if (isGalaxyTrackerCard) {
    return (
      <div
        style={{
          ...chartCardStyle(theme),
          background: "linear-gradient(180deg, rgba(12,16,30,0.94) 0%, rgba(16,21,40,0.9) 100%)",
          border: "1px solid rgba(244,214,122,0.12)",
          boxShadow: galaxyTrackerFrame.shellGlow,
          clipPath: "none",
          position: "relative",
          overflow: "visible",
          padding: "18px",
          borderRadius: "34px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: galaxyTrackerFrame.aura,
            borderRadius: "34px",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <CelestialFrameOverlay title={title} subtitle={subtitle} />

        <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "12px", paddingTop: "80px" }}>
          <div style={{ paddingInline: "28px" }}>{legend}</div>

          <div
            style={{
              position: "relative",
              borderRadius: "26px",
              padding: "0 20px 24px",
              marginTop: "-16px",
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          >
            {chartSvg}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={chartCardStyle(theme)}>
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0, color: theme.text }}>{title}</h3>
        <p style={{ margin: "6px 0 0 0", color: theme.subtleText, fontSize: "0.92rem" }}>{subtitle}</p>
      </div>

      {legend}

      {chartSvg}
    </div>
  );
}

export default LineTrendChart;
