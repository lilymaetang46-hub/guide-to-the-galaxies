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

function buildGalaxyFrameStars() {
  return [
    { top: "6px", left: "14px", size: "8px", opacity: 0.42, glyph: "·" },
    { top: "2px", left: "28px", size: "13px", opacity: 0.84, glyph: "✦" },
    { top: "14px", left: "46px", size: "7px", opacity: 0.36, glyph: "·" },
    { top: "10px", left: "62px", size: "9px", opacity: 0.52, glyph: "✦" },
    { top: "4px", left: "88px", size: "6px", opacity: 0.3, glyph: "•" },
    { top: "6px", left: "112px", size: "14px", opacity: 0.8, glyph: "✦" },
    { top: "16px", left: "136px", size: "8px", opacity: 0.44, glyph: "✦" },
    { top: "5px", left: "168px", size: "6px", opacity: 0.32, glyph: "•" },
    { top: "12px", left: "calc(50% - 36px)", size: "7px", opacity: 0.4, glyph: "✦" },
    { top: "4px", left: "calc(50% - 10px)", size: "15px", opacity: 0.88, glyph: "✦" },
    { top: "16px", left: "calc(50% + 18px)", size: "8px", opacity: 0.48, glyph: "✦" },
    { top: "7px", right: "164px", size: "6px", opacity: 0.3, glyph: "•" },
    { top: "14px", right: "138px", size: "9px", opacity: 0.52, glyph: "✦" },
    { top: "2px", right: "112px", size: "14px", opacity: 0.82, glyph: "✦" },
    { top: "14px", right: "88px", size: "7px", opacity: 0.38, glyph: "✦" },
    { top: "6px", right: "62px", size: "10px", opacity: 0.6, glyph: "✦" },
    { top: "16px", right: "42px", size: "7px", opacity: 0.34, glyph: "•" },
    { top: "4px", right: "22px", size: "13px", opacity: 0.8, glyph: "✦" },
    { bottom: "4px", left: "18px", size: "7px", opacity: 0.34, glyph: "•" },
    { bottom: "12px", left: "34px", size: "12px", opacity: 0.78, glyph: "✦" },
    { bottom: "2px", left: "58px", size: "7px", opacity: 0.36, glyph: "✦" },
    { bottom: "14px", left: "82px", size: "10px", opacity: 0.58, glyph: "✦" },
    { bottom: "4px", left: "108px", size: "6px", opacity: 0.28, glyph: "•" },
    { bottom: "12px", left: "136px", size: "13px", opacity: 0.8, glyph: "✦" },
    { bottom: "4px", left: "166px", size: "8px", opacity: 0.42, glyph: "✦" },
    { bottom: "14px", left: "calc(50% - 28px)", size: "7px", opacity: 0.34, glyph: "✦" },
    { bottom: "2px", left: "calc(50% - 4px)", size: "14px", opacity: 0.84, glyph: "✦" },
    { bottom: "14px", left: "calc(50% + 22px)", size: "8px", opacity: 0.42, glyph: "✦" },
    { bottom: "4px", right: "164px", size: "7px", opacity: 0.32, glyph: "•" },
    { bottom: "14px", right: "136px", size: "10px", opacity: 0.56, glyph: "✦" },
    { bottom: "2px", right: "108px", size: "13px", opacity: 0.82, glyph: "✦" },
    { bottom: "12px", right: "82px", size: "9px", opacity: 0.5, glyph: "✦" },
    { bottom: "4px", right: "58px", size: "6px", opacity: 0.28, glyph: "•" },
    { bottom: "14px", right: "34px", size: "12px", opacity: 0.76, glyph: "✦" },
    { bottom: "4px", right: "16px", size: "7px", opacity: 0.34, glyph: "•" },
    { top: "34px", left: "6px", size: "6px", opacity: 0.32, glyph: "•" },
    { top: "50px", left: "10px", size: "11px", opacity: 0.68, glyph: "✦" },
    { top: "72px", left: "4px", size: "8px", opacity: 0.42, glyph: "✦" },
    { top: "96px", left: "14px", size: "14px", opacity: 0.82, glyph: "✦" },
    { top: "126px", left: "6px", size: "7px", opacity: 0.36, glyph: "✦" },
    { top: "154px", left: "12px", size: "10px", opacity: 0.56, glyph: "✦" },
    { top: "184px", left: "6px", size: "6px", opacity: 0.28, glyph: "•" },
    { bottom: "156px", left: "8px", size: "9px", opacity: 0.48, glyph: "✦" },
    { bottom: "124px", left: "12px", size: "12px", opacity: 0.74, glyph: "✦" },
    { bottom: "92px", left: "6px", size: "7px", opacity: 0.34, glyph: "✦" },
    { bottom: "56px", left: "12px", size: "10px", opacity: 0.56, glyph: "✦" },
    { bottom: "34px", left: "6px", size: "6px", opacity: 0.28, glyph: "•" },
    { top: "34px", right: "6px", size: "6px", opacity: 0.32, glyph: "•" },
    { top: "50px", right: "10px", size: "11px", opacity: 0.68, glyph: "✦" },
    { top: "72px", right: "4px", size: "8px", opacity: 0.42, glyph: "✦" },
    { top: "96px", right: "14px", size: "14px", opacity: 0.82, glyph: "✦" },
    { top: "126px", right: "6px", size: "7px", opacity: 0.36, glyph: "✦" },
    { top: "154px", right: "12px", size: "10px", opacity: 0.56, glyph: "✦" },
    { top: "184px", right: "6px", size: "6px", opacity: 0.28, glyph: "•" },
    { bottom: "156px", right: "8px", size: "9px", opacity: 0.48, glyph: "✦" },
    { bottom: "124px", right: "12px", size: "12px", opacity: 0.74, glyph: "✦" },
    { bottom: "92px", right: "6px", size: "7px", opacity: 0.34, glyph: "✦" },
    { bottom: "56px", right: "12px", size: "10px", opacity: 0.56, glyph: "✦" },
    { bottom: "34px", right: "6px", size: "6px", opacity: 0.28, glyph: "•" },
  ];
}

function LineTrendChart({ title, subtitle, data, yMax, series, theme, chartCardStyle }) {
  const isConsoleChart = theme.observerChartMode === "stepped";
  const isSolarConsole = isConsoleChart && theme.modeName === "Solar";
  const isGalaxyTrackerCard =
    theme.themeFamily === "galaxy" &&
    !theme.observerConsole &&
    !theme.trackerSolar &&
    !theme.trackerReef &&
    !theme.trackerAbyss;
  const width = 640;
  const height = 260;
  const padding = { top: 24, right: 18, bottom: 40, left: 40 };
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
  const galaxyFrameStars = buildGalaxyFrameStars();

  const legend = (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: isGalaxyTrackerCard ? "0" : "12px" }}>
      {series.map((item) => (
        <div
          key={item.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: isGalaxyTrackerCard ? "8px 12px" : "7px 10px",
            borderRadius: isGalaxyTrackerCard ? "999px" : isConsoleChart ? "10px" : "999px",
            background: isGalaxyTrackerCard
              ? "linear-gradient(180deg, rgba(15,18,34,0.82) 0%, rgba(22,26,48,0.7) 100%)"
              : isSolarConsole
              ? "rgba(255,255,255,0.45)"
              : theme.itemBackground,
            color: isSolarConsole ? theme.text : theme.subtleText,
            fontSize: "0.88rem",
            fontWeight: "bold",
            fontFamily: theme.observerFontFamily,
            letterSpacing: isConsoleChart ? "0.05em" : "normal",
            textTransform: isConsoleChart ? "uppercase" : "none",
            border: isGalaxyTrackerCard ? "1px solid rgba(255,255,255,0.08)" : "none",
            boxShadow: isGalaxyTrackerCard ? "0 10px 20px rgba(0,0,0,0.16)" : "none",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
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
          <line
            x1={padding.left}
            y1={line.y}
            x2={width - padding.right}
            y2={line.y}
            stroke={theme.chartGrid}
            strokeWidth="1"
          />
          <text
            x={padding.left - 10}
            y={line.y + 4}
            textAnchor="end"
            fill={theme.chartLabel}
            fontSize="11"
            fontFamily={theme.observerFontFamily}
          >
            {Math.round(line.value)}
          </text>
        </g>
      ))}

      {data.map((item, index) => (
        <text
          key={`${item.date}-${index}`}
          x={getX(index)}
          y={height - 12}
          textAnchor="middle"
          fill={theme.chartLabel}
          fontSize="11"
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
                    <rect
                      x={point.x - 3.5}
                      y={point.y - 3.5}
                      width="7"
                      height="7"
                      fill={item.color}
                      opacity="0.18"
                    />
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
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="2.8"
                      fill={item.color}
                      stroke={theme.chartSurface}
                      strokeWidth="1.5"
                    />
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
          background:
            "linear-gradient(180deg, rgba(14,18,34,0.42) 0%, rgba(10,14,28,0.3) 100%)",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 24px 44px rgba(4,8,24,0.28)",
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
            inset: "0",
            background:
              "radial-gradient(circle at 18% 18%, rgba(142,126,255,0.18) 0%, rgba(142,126,255,0) 22%), radial-gradient(circle at 84% 18%, rgba(114,208,255,0.14) 0%, rgba(114,208,255,0) 20%), radial-gradient(circle at 80% 82%, rgba(255,214,102,0.08) 0%, rgba(255,214,102,0) 18%), linear-gradient(180deg, rgba(12,16,30,0.94) 0%, rgba(16,21,40,0.9) 100%)",
            borderRadius: "34px",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(166,150,255,0.08)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "0",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {galaxyFrameStars.map((star, index) => (
            <span
              key={`${star.top || star.bottom}-${index}`}
              style={{
                position: "absolute",
                color: "rgba(255,240,195,0.88)",
                textShadow: "0 0 10px rgba(255,240,195,0.28)",
                fontSize: star.size,
                lineHeight: 1,
                opacity: star.opacity,
                ...star,
              }}
            >
              {star.glyph || "✦"}
            </span>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gap: "8px", padding: "12px 14px 0", textAlign: "left" }}>
            <h3 style={{ margin: 0, color: theme.text }}>{title}</h3>
            <p style={{ margin: 0, color: theme.subtleText, fontSize: "0.92rem" }}>{subtitle}</p>
          </div>

          <div style={{ paddingInline: "14px" }}>{legend}</div>

          <div
            style={{
              position: "relative",
              borderRadius: "26px",
              padding: "18px 14px 10px",
              background:
                "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 32%), linear-gradient(180deg, rgba(12,17,36,0.9) 0%, rgba(17,22,42,0.78) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 30px rgba(0,0,0,0.18)",
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
