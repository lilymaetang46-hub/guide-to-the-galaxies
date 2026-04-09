import { useMemo, useState } from "react";
import { getLocalDateKey } from "../../app/utils";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "appointment", label: "Plans" },
  { key: "todo", label: "To-Do" },
  { key: "period", label: "Period" },
];

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, 1);
  return date.toLocaleDateString([], { month: "long", year: "numeric" });
}

function formatDateLabel(dateKey) {
  const date = parseDateKey(dateKey);
  return Number.isNaN(date.getTime())
    ? dateKey
    : date.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
}

function formatTimeLabel(value) {
  if (!value) return "";
  const [hoursText, minutesText] = String(value).split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function getTodoPriorityLabel(priority) {
  switch (priority) {
    case "high":
      return "High priority";
    case "low":
      return "Low priority";
    default:
      return "Medium priority";
  }
}

function getCalendarSummaryDateLabel(dateKey) {
  const date = parseDateKey(dateKey);
  return Number.isNaN(date.getTime())
    ? dateKey
    : date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
}

function getAgendaItemTone(theme, item) {
  if (item.kind === "period") {
    return {
      border: "rgba(244, 114, 182, 0.28)",
      background:
        theme.themeFamily === "underwater"
          ? "rgba(244, 114, 182, 0.14)"
          : "rgba(244, 114, 182, 0.1)",
      chipBackground: "rgba(244, 114, 182, 0.18)",
    };
  }

  if (item.kind === "todo") {
    return {
      border: "rgba(59, 130, 246, 0.22)",
      background:
        item.completed
          ? "rgba(59, 130, 246, 0.08)"
          : theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
      chipBackground: "rgba(59, 130, 246, 0.16)",
    };
  }

  return {
    border: "rgba(250, 204, 21, 0.22)",
    background: theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.04)",
    chipBackground: "rgba(250, 204, 21, 0.18)",
  };
}

function TrackerCalendarPage({ app }) {
  const {
    theme,
    today,
    sectionCardStyle,
    renderSectionHeader,
    summaryCardStyle,
    summaryLabelStyle,
    summaryValueStyle,
    summaryNoteStyle,
    smallInfoStyle,
    emptyTextStyle,
    softButtonStyle,
    trackerSectionSwitcherButtonStyle,
    setActivePage,
    calendarEvents = [],
    googleCalendarEventsLoading = false,
    nextCycleEstimateDate,
  } = app;

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibleMonth, setVisibleMonth] = useState(() => today?.slice(0, 7) || getMonthKey(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => today || getLocalDateKey(new Date()));

  const eventsForVisibleFilter = useMemo(
    () =>
      calendarEvents.filter(
        (item) => selectedFilter === "all" || item.kind === selectedFilter
      ),
    [calendarEvents, selectedFilter]
  );

  const [visibleYear, visibleMonthNumber] = visibleMonth.split("-").map(Number);
  const monthStart = new Date(visibleYear, (visibleMonthNumber || 1) - 1, 1);
  const monthEnd = new Date(visibleYear, visibleMonthNumber || 1, 0);
  const monthGridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
  const monthGridEnd = addDays(monthEnd, 6 - ((monthEnd.getDay() + 6) % 7));
  const visibleMonthLabel = formatMonthLabel(visibleMonth);

  const eventMap = useMemo(() => {
    const map = new Map();

    eventsForVisibleFilter.forEach((item) => {
      const currentItems = map.get(item.date) || [];
      currentItems.push(item);
      map.set(item.date, currentItems);
    });

    map.forEach((items) => {
      items.sort((left, right) => {
        if (left.date !== right.date) return left.date.localeCompare(right.date);
        if ((left.time || "") !== (right.time || "")) {
          return (left.time || "").localeCompare(right.time || "");
        }
        return (left.title || "").localeCompare(right.title || "");
      });
    });

    return map;
  }, [eventsForVisibleFilter]);

  const monthDays = [];
  for (
    let cursor = new Date(monthGridStart);
    cursor <= monthGridEnd;
    cursor = addDays(cursor, 1)
  ) {
    monthDays.push(getLocalDateKey(cursor));
  }

  const selectedDayItems = eventMap.get(selectedDate) || [];
  const todayItems = eventMap.get(today) || [];
  const weekEndKey = getLocalDateKey(addDays(parseDateKey(today), 6));
  const upcomingWeekItems = eventsForVisibleFilter
    .filter((item) => item.date >= today && item.date <= weekEndKey)
    .slice(0, 8);
  const overdueTaskCount = calendarEvents.filter(
    (item) => item.kind === "todo" && !item.completed && item.date < today
  ).length;
  const nextPlan = calendarEvents.find(
    (item) => item.kind === "appointment" && item.date >= today
  );
  const upcomingGroupedItems = upcomingWeekItems.reduce((groups, item) => {
    const currentGroup = groups.get(item.date) || [];
    currentGroup.push(item);
    groups.set(item.date, currentGroup);
    return groups;
  }, new Map());

  return (
    <div style={{ display: "grid", gap: "18px" }} data-testid="tracker-calendar-page">
      <section className="galaxy-panel" style={sectionCardStyle(theme, "calendar")}>
        {renderSectionHeader(
          "Calendar",
          "A calm month view for plans, tasks, and cycle context without turning the app into a heavy scheduler.",
          "Orbit",
          "Orbit"
        )}
        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={softButtonStyle(theme)}
                onClick={() => setVisibleMonth(getMonthKey(new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1)))}
              >
                Previous
              </button>
              <button style={softButtonStyle(theme)} onClick={() => setVisibleMonth(today.slice(0, 7))}>
                This Month
              </button>
              <button
                style={softButtonStyle(theme)}
                onClick={() => setVisibleMonth(getMonthKey(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)))}
              >
                Next
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: theme.text }}>{visibleMonthLabel}</div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {FILTER_OPTIONS.map((item) => (
              <button
                key={item.key}
                style={trackerSectionSwitcherButtonStyle(selectedFilter === item.key, theme)}
                onClick={() => setSelectedFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                style={{
                  padding: "6px 4px",
                  textAlign: "center",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: theme.faintText,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            ))}
            {monthDays.map((dateKey) => {
              const dayItems = eventMap.get(dateKey) || [];
              const isCurrentMonth = dateKey.startsWith(visibleMonth);
              const isToday = dateKey === today;
              const isSelected = dateKey === selectedDate;
              const planCount = dayItems.filter((item) => item.kind === "appointment").length;
              const todoCount = dayItems.filter((item) => item.kind === "todo" && !item.completed).length;
              const periodCount = dayItems.filter((item) => item.kind === "period").length;

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  style={{
                    minHeight: "108px",
                    borderRadius: "20px",
                    border: isSelected ? `1px solid ${theme.primary}` : theme.border,
                    background: isSelected
                      ? theme.surfaceElevated || theme.cardBackground || "rgba(255,255,255,0.08)"
                      : theme.itemBackground || "rgba(255,255,255,0.03)",
                    color: theme.text,
                    padding: "10px",
                    textAlign: "left",
                    display: "grid",
                    alignContent: "start",
                    gap: "8px",
                    opacity: isCurrentMonth ? 1 : 0.54,
                    boxShadow: isToday ? `0 0 0 1px ${theme.primary}` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.94rem" }}>{Number(dateKey.slice(-2))}</span>
                    {isToday ? (
                      <span
                        style={{
                          padding: "0.16rem 0.45rem",
                          borderRadius: "999px",
                          background: theme.primary,
                          color: theme.primaryText,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        Today
                      </span>
                    ) : null}
                  </div>
                  <div style={{ display: "grid", gap: "4px" }}>
                    {planCount > 0 ? <div style={{ fontSize: "0.76rem" }}>Plan{planCount > 1 ? "s" : ""}: {planCount}</div> : null}
                    {todoCount > 0 ? <div style={{ fontSize: "0.76rem" }}>To-do: {todoCount}</div> : null}
                    {periodCount > 0 ? <div style={{ fontSize: "0.76rem" }}>Period day</div> : null}
                    {dayItems.length === 0 ? <div style={{ fontSize: "0.76rem", color: theme.faintText }}>Clear</div> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
        <div style={summaryCardStyle(theme)}>
          <div style={summaryLabelStyle(theme)}>Today</div>
          <div style={summaryValueStyle(theme)}>{todayItems.length}</div>
          <div style={summaryNoteStyle(theme)}>
            {todayItems.length === 0 ? "No dated items today." : "Items on today's agenda."}
          </div>
        </div>
        <div style={summaryCardStyle(theme)}>
          <div style={summaryLabelStyle(theme)}>Upcoming Week</div>
          <div style={summaryValueStyle(theme)}>{upcomingWeekItems.length}</div>
          <div style={summaryNoteStyle(theme)}>
            {upcomingWeekItems[0]
              ? `${upcomingWeekItems[0].title} on ${formatDateLabel(upcomingWeekItems[0].date)}`
              : "Nothing dated in the next week."}
          </div>
        </div>
        <div style={summaryCardStyle(theme)}>
          <div style={summaryLabelStyle(theme)}>Overdue Tasks</div>
          <div style={summaryValueStyle(theme)}>{overdueTaskCount}</div>
          <div style={summaryNoteStyle(theme)}>
            {overdueTaskCount > 0 ? "Open tasks with due dates before today." : "No overdue tasks right now."}
          </div>
        </div>
        <div style={summaryCardStyle(theme)}>
          <div style={summaryLabelStyle(theme)}>Cycle / Next Plan</div>
          <div style={summaryValueStyle(theme)}>{nextCycleEstimateDate ? formatDateLabel(nextCycleEstimateDate) : "Open"}</div>
          <div style={summaryNoteStyle(theme)}>
            {nextPlan
              ? `${nextPlan.title}${nextPlan.time ? ` at ${formatTimeLabel(nextPlan.time)}` : ""}`
              : "No upcoming appointment saved yet."}
          </div>
        </div>
      </div>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "agenda")}>
        {renderSectionHeader(
          "Week Ahead",
          "A calmer grouped readout for the next seven days, built from the normalized event layer.",
          "Orbit",
          "Orbit"
        )}
        {googleCalendarEventsLoading ? (
          <p style={smallInfoStyle(theme)}>Refreshing Google Calendar events for this view.</p>
        ) : null}
        {upcomingGroupedItems.size === 0 ? (
          <p style={emptyTextStyle(theme)}>Nothing dated in the next week yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {[...upcomingGroupedItems.entries()].map(([dateKey, items]) => (
              <div
                key={dateKey}
                style={{
                  ...summaryCardStyle(theme),
                  display: "grid",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={summaryLabelStyle(theme)}>{getCalendarSummaryDateLabel(dateKey)}</div>
                  <div style={summaryNoteStyle(theme)}>{items.length} item{items.length === 1 ? "" : "s"}</div>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      style={{
                        border: `1px solid ${theme.borderColorStrong || "rgba(255,255,255,0.08)"}`,
                        background: theme.itemBackground || "rgba(255,255,255,0.03)",
                        color: theme.text,
                        borderRadius: "16px",
                        padding: "12px 14px",
                        textAlign: "left",
                      }}
                      onClick={() => {
                        setSelectedDate(dateKey);
                        setActivePage(item.sourcePageKey);
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 700 }}>{item.title}</div>
                        <div style={{ ...smallInfoStyle(theme), margin: 0 }}>
                          {item.time ? formatTimeLabel(item.time) : item.badgeLabel}
                        </div>
                      </div>
                      {item.external ? (
                        <div style={{ ...smallInfoStyle(theme), marginTop: "6px" }}>Imported from Google Calendar</div>
                      ) : null}
                      {item.detail ? <div style={{ ...smallInfoStyle(theme), marginTop: "6px" }}>{item.detail}</div> : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="galaxy-panel" style={sectionCardStyle(theme, "agenda")}>
        {renderSectionHeader(
          "Selected Day",
          `${formatDateLabel(selectedDate)}${selectedDate === today ? " · today" : ""}`,
          "Signal",
          "Signal"
        )}
        {selectedDayItems.length === 0 ? (
          <p style={emptyTextStyle(theme)}>Nothing dated on this day yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {selectedDayItems.map((item) => {
              const tone = getAgendaItemTone(theme, item);

              return (
                <div
                  key={item.id}
                  style={{
                    border: `1px solid ${tone.border}`,
                    background: tone.background,
                    color: theme.text,
                    borderRadius: "20px",
                    padding: "14px 16px",
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ display: "grid", gap: "6px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.55rem",
                            borderRadius: "999px",
                            background: tone.chipBackground,
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {item.badgeLabel}
                        </span>
                        {item.kind === "todo" ? (
                          <span
                            style={{
                              padding: "0.2rem 0.55rem",
                              borderRadius: "999px",
                              background: "rgba(59, 130, 246, 0.12)",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                            }}
                          >
                            {getTodoPriorityLabel(item.priority)}
                          </span>
                        ) : null}
                        {item.external ? (
                          <span style={{ ...smallInfoStyle(theme), margin: 0 }}>Imported</span>
                        ) : null}
                        {item.estimated ? <span style={{ ...smallInfoStyle(theme), margin: 0 }}>Estimate</span> : null}
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 700 }}>{item.title}</div>
                      {item.detail ? <div style={{ fontSize: "0.92rem", opacity: 0.82 }}>{item.detail}</div> : null}
                    </div>
                    <button style={softButtonStyle(theme)} onClick={() => setActivePage(item.sourcePageKey)}>
                      Open {item.sourceLabel}
                    </button>
                  </div>
                  {item.note ? <div style={{ fontSize: "0.9rem", opacity: 0.84 }}>{item.note}</div> : null}
                </div>
              );
            })}
          </div>
        )}
        <p style={smallInfoStyle(theme)}>
          Calendar items stay tied to their source pages, so editing still happens in the place where that data lives.
        </p>
      </section>
    </div>
  );
}

export default TrackerCalendarPage;
