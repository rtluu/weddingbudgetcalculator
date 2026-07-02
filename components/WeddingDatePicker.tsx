"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type CalMode = "days" | "months" | "years";

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  /** Strip outer card chrome so it nests inside a parent card */
  compact?: boolean;
}

// Module-scope so it isn't re-created every render (react-hooks/static-components).
function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {dir === "left"
        ? <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  );
}

export default function WeddingDatePicker({ value, onChange, compact }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayYear = today.getFullYear();

  const [viewYear, setViewYear]       = useState(value?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth]     = useState(value?.getMonth()      ?? today.getMonth());
  const [mode, setMode]               = useState<CalMode>("days");
  const [direction, setDirection]     = useState(1);
  const YEAR_PAGE = 12;
  // Pages of years are anchored at today.getFullYear() so no past years ever appear.
  // yearPageFor(y) returns the page start that contains year y, >= current year.
  const yearPageFor = (y: number) => {
    const base = today.getFullYear();
    return base + Math.floor(Math.max(0, y - base) / YEAR_PAGE) * YEAR_PAGE;
  };
  const [yearStart, setYearStart] = useState(() => yearPageFor(value?.getFullYear() ?? today.getFullYear()));

  // ── navigation ──────────────────────────────────────────────────────────────
  const goMonth = useCallback((delta: number) => {
    setDirection(delta);
    setViewMonth((m) => {
      const next = m + delta;
      if (next > 11) { setViewYear((y) => y + 1); return 0; }
      if (next < 0)  { setViewYear((y) => y - 1); return 11; }
      return next;
    });
  }, []);

  const goYear = useCallback((delta: number) => {
    setDirection(delta);
    setViewYear((y) => y + delta);
  }, []);

  const goYearPage = useCallback((delta: number) => {
    setDirection(delta);
    setYearStart((s) => Math.max(todayYear, s + delta * YEAR_PAGE));
  }, [todayYear]);

  // ── header prev/next based on mode ──────────────────────────────────────────
  const handlePrev = () => {
    if (mode === "days")   goMonth(-1);
    if (mode === "months") goYear(-1);
    if (mode === "years")  goYearPage(-1);
  };
  const handleNext = () => {
    if (mode === "days")   goMonth(1);
    if (mode === "months") goYear(1);
    if (mode === "years")  goYearPage(1);
  };

  const canGoPrev = () => {
    if (mode === "days")   return viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());
    if (mode === "months") return viewYear > today.getFullYear();
    if (mode === "years")  return yearStart > today.getFullYear();
    return false;
  };

  // ── day grid ────────────────────────────────────────────────────────────────
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate();
  const dayCells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (dayCells.length % 7 !== 0) dayCells.push(null);

  const isSelected = (day: number) =>
    value !== null &&
    value?.getFullYear() === viewYear &&
    value?.getMonth()    === viewMonth &&
    value?.getDate()     === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth()    === viewMonth &&
    today.getDate()     === day;

  const isDayPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  // ── month grid ──────────────────────────────────────────────────────────────
  const isMonthPast = (m: number) =>
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && m < today.getMonth());

  const isMonthSelected = (m: number) =>
    value !== null && value?.getFullYear() === viewYear && value?.getMonth() === m;

  const selectMonth = (m: number) => {
    if (isMonthPast(m)) return;
    setViewMonth(m);
    setMode("days");
  };

  // ── year grid ───────────────────────────────────────────────────────────────
  const yearCells = Array.from({ length: YEAR_PAGE }, (_, i) => yearStart + i);

  const isYearPast    = (y: number) => y < today.getFullYear();
  const isYearSelected = (y: number) => value !== null && value?.getFullYear() === y;

  const selectYear = (y: number) => {
    if (isYearPast(y)) return;
    setViewYear(y);
    setYearStart(yearPageFor(y));
    setMode("months");
  };

  // ── slide variants ──────────────────────────────────────────────────────────
  const slide = {
    enter:  (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -28 : 28, opacity: 0 }),
  };
  const fade = {
    enter:  { opacity: 0, scale: 0.97 },
    center: { opacity: 1, scale: 1 },
    exit:   { opacity: 0, scale: 0.97 },
  };

  const monthKey = `${viewYear}-${viewMonth}`;
  const yearKey  = `years-${yearStart}`;

  // Capture these as plain booleans so TypeScript doesn't narrow inside JSX branches
  const isDaysMode   = mode === "days";
  const isMonthsMode = mode === "months";
  const isYearsMode  = mode === "years";

  // ── shared button style helpers ─────────────────────────────────────────────
  const chipBase: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    padding: "10px 0",
    textAlign: "center",
  };

  const inner = (
    <div>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: compact ? "1px solid var(--sand)" : undefined }}
      >
        {/* prev */}
        <button
          onClick={handlePrev}
          disabled={!canGoPrev()}
          aria-label="Previous"
          style={{
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
            color: canGoPrev() ? "var(--ink)" : "var(--sand)",
            cursor: canGoPrev() ? "pointer" : "not-allowed",
            background: "transparent",
            transition: "background 0.15s",
            border: "none",
            padding: 0,
          }}
          onMouseEnter={(e) => canGoPrev() && ((e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          <Chevron dir="left" />
        </button>

        {/* month + year labels */}
        <div className="flex items-center gap-1 relative overflow-hidden" style={{ height: 24, flex: 1, justifyContent: "center" }}>
          {isYearsMode ? (
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.span
                key={yearKey}
                custom={direction}
                variants={slide}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.22, ease: EASE }}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--ink)", position: "absolute", whiteSpace: "nowrap" }}
              >
                {yearStart}–{yearStart + YEAR_PAGE - 1}
              </motion.span>
            </AnimatePresence>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={monthKey}
                custom={direction}
                variants={slide}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.22, ease: EASE }}
                style={{ display: "flex", alignItems: "center", gap: 2, position: "absolute" }}
              >
                {/* Month pill — click to toggle month picker */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMode(isMonthsMode ? "days" : "months"); }}
                  style={{
                    fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600,
                    color: isMonthsMode ? "var(--clay)" : "var(--ink)",
                    background: isMonthsMode ? "rgba(79, 111, 87,0.10)" : "transparent",
                    border: "none", borderRadius: 6, padding: "2px 6px", cursor: "pointer",
                    textDecoration: isMonthsMode ? "underline" : "none",
                    textDecorationColor: "var(--clay)",
                    textUnderlineOffset: 3,
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isMonthsMode) (e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)"; }}
                  onMouseLeave={(e) => { if (!isMonthsMode) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  aria-label="Pick month"
                >
                  {MONTHS_LONG[viewMonth]}
                </button>

                {/* Year pill — click to toggle year picker */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMode(isDaysMode || isMonthsMode ? "years" : "days"); setYearStart(yearPageFor(viewYear)); }}
                  style={{
                    fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600,
                    color: "var(--ink)",
                    background: "transparent",
                    border: "none", borderRadius: 6, padding: "2px 6px", cursor: "pointer",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  aria-label="Pick year"
                >
                  {viewYear}
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* next */}
        <button
          onClick={handleNext}
          aria-label="Next"
          style={{
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", color: "var(--ink)", cursor: "pointer",
            background: "transparent", border: "none", padding: 0,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          <Chevron dir="right" />
        </button>
      </div>

      {/* ── Body: days / months / years ── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: 200 }}>
        <AnimatePresence initial={false} mode="wait">

          {/* DAY GRID */}
          {isDaysMode && (
            <motion.div
              key={`days-${monthKey}`}
              variants={slide} custom={direction}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: EASE }}
              style={{ padding: "8px 12px 12px" }}
            >
              {/* day-of-week headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", padding: "0 0 6px" }}>
                    {d}
                  </div>
                ))}
              </div>
              {/* day cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px 0" }}>
                {dayCells.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />;
                  const past  = isDayPast(day);
                  const sel   = isSelected(day);
                  const tod   = isToday(day);
                  return (
                    <button
                      key={day}
                      disabled={past}
                      onClick={() => onChange(new Date(viewYear, viewMonth, day))}
                      aria-label={`${MONTHS_LONG[viewMonth]} ${day}, ${viewYear}`}
                      aria-pressed={sel}
                      style={{
                        width: 36, height: 36, margin: "0 auto",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "50%", border: "none",
                        fontFamily: "var(--font-body)", fontSize: 13,
                        fontWeight: sel ? 600 : 400,
                        background: sel ? "var(--clay)" : "transparent",
                        color: sel ? "var(--bone)" : past ? "var(--sand)" : "var(--ink)",
                        cursor: past ? "not-allowed" : "pointer",
                        outline: tod && !sel ? "1.5px solid var(--clay)" : "none",
                        outlineOffset: -1,
                        transition: "background 0.12s, color 0.12s",
                      }}
                      onMouseEnter={(e) => { if (!past && !sel) (e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)"; }}
                      onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* MONTH GRID */}
          {isMonthsMode && (
            <motion.div
              key={`months-${viewYear}`}
              variants={fade} custom={direction}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: EASE }}
              style={{ padding: "12px 12px 16px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}
            >
              {MONTHS_SHORT.map((label, m) => {
                const past = isMonthPast(m);
                const sel  = isMonthSelected(m);
                return (
                  <button
                    key={m}
                    disabled={past}
                    onClick={() => selectMonth(m)}
                    style={{
                      ...chipBase,
                      fontWeight: sel ? 600 : 400,
                      background: sel ? "var(--clay)" : "transparent",
                      color: sel ? "var(--bone)" : past ? "var(--sand)" : "var(--ink)",
                      cursor: past ? "not-allowed" : "pointer",
                      border: "none",
                    }}
                    onMouseEnter={(e) => { if (!past && !sel) (e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)"; }}
                    onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {label}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* YEAR GRID */}
          {isYearsMode && (
            <motion.div
              key={yearKey}
              variants={slide} custom={direction}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: EASE }}
              style={{ padding: "12px 12px 16px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}
            >
              {yearCells.map((y) => {
                const past = isYearPast(y);
                const sel  = isYearSelected(y);
                const cur  = y === today.getFullYear();
                return (
                  <button
                    key={y}
                    disabled={past}
                    onClick={() => selectYear(y)}
                    style={{
                      ...chipBase,
                      fontWeight: sel || cur ? 600 : 400,
                      background: sel ? "var(--clay)" : "transparent",
                      color: sel ? "var(--bone)" : past ? "var(--sand)" : cur ? "var(--clay)" : "var(--ink)",
                      cursor: past ? "not-allowed" : "pointer",
                      border: "none",
                      outline: cur && !sel ? "1.5px solid var(--clay)" : "none",
                      borderRadius: 8,
                    }}
                    onMouseEnter={(e) => { if (!past && !sel) (e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)"; }}
                    onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {y}
                  </button>
                );
              })}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Selected date footer ── */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{ borderTop: "1px solid var(--sand)", overflow: "hidden" }}
          >
            <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
                Selected date
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--clay)" }}>
                {value.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (compact) return inner;

  return (
    <div style={{ background: "var(--bone)", border: "1px solid var(--sand)", borderRadius: 16, overflow: "hidden", maxWidth: 340 }}>
      {inner}
    </div>
  );
}
