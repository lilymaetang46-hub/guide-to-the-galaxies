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

function LineTrendChart({ title, subtitle, data, yMax, series, theme, chartCardStyle }) {
  const isConsoleChart = theme.observerChartMode === "stepped";
  const isSolarConsole = isConsoleChart && theme.modeName === "Solar";
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

  return (
    <div style={chartCardStyle(theme)}>
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0, color: theme.text }}>{title}</h3>
        <p style={{ margin: "6px 0 0 0", color: theme.subtleText, fontSize: "0.92rem" }}>{subtitle}</p>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
        {series.map((item) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 10px",
              borderRadius: isConsoleChart ? "10px" : "999px",
              background: isSolarConsole ? "rgba(255,255,255,0.45)" : theme.itemBackground,
              color: isSolarConsole ? theme.text : theme.subtleText,
              fontSize: "0.88rem",
              fontWeight: "bold",
              fontFamily: theme.observerFontFamily,
              letterSpacing: isConsoleChart ? "0.05em" : "normal",
              textTransform: isConsoleChart ? "uppercase" : "none",
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
    </div>
  );
}

export default LineTrendChart;
