"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeddingDatePicker from "@/components/WeddingDatePicker";
import { type DayOfWeek, type VenueType, venueTypeLabels } from "@/config/costModel";
import { searchVenues, type KnownVenue } from "@/config/venues";
import { type DateStatus } from "./useWeddingBudgetCalculator";

// ─── Date Status Picker ────────────────────────────────────────────────────────
export default function DateStatusPicker({
  dateStatus, onDateChange,
  weddingDate, onWeddingDateChange,
  weddingSeason, onSeasonChange,
  weddingDayOfWeek, onDayOfWeekChange,
  venueStatus, onVenueChange,
  venueName, onVenueNameChange,
  venueType, onVenueTypeChange,
  venueId, onSelectVenue,
}: {
  dateStatus: DateStatus;
  onDateChange: (v: DateStatus) => void;
  weddingDate: Date | null;
  onWeddingDateChange: (d: Date) => void;
  weddingSeason: "spring" | "summer" | "fall" | "winter" | null;
  onSeasonChange: (s: "spring" | "summer" | "fall" | "winter") => void;
  weddingDayOfWeek: DayOfWeek | null;
  onDayOfWeekChange: (d: DayOfWeek) => void;
  venueStatus: "touring" | "booked" | "none";
  onVenueChange: (v: "touring" | "booked" | "none") => void;
  venueName: string;
  onVenueNameChange: (v: string) => void;
  venueType: VenueType;
  onVenueTypeChange: (v: VenueType) => void;
  venueId: string | null;
  onSelectVenue: (v: KnownVenue) => void;
}) {
  const [venueFocused, setVenueFocused] = useState(false);
  const venueSuggestions = venueId === null && venueFocused ? searchVenues(venueName) : [];
  const EASE_REF = [0.22, 1, 0.36, 1] as const;

  const seasonOptions: { id: "spring" | "summer" | "fall" | "winter"; label: string; months: string }[] = [
    { id: "spring", label: "Spring", months: "Mar – May" },
    { id: "summer", label: "Summer", months: "Jun – Aug" },
    { id: "fall",   label: "Fall",   months: "Sep – Nov" },
    { id: "winter", label: "Winter", months: "Dec – Feb" },
  ];

  // Saturday=6 first since it's the most common; Sunday=0; Friday=5; weekday represented by Wed=3
  const dowOptions: { dow: DayOfWeek; label: string; note: string }[] = [
    { dow: 6, label: "Saturday",  note: "Peak pricing" },
    { dow: 5, label: "Friday",    note: "~15% savings" },
    { dow: 0, label: "Sunday",    note: "~20% savings" },
    { dow: 3, label: "Weekday",   note: "~35% savings" },
  ];

  const dateOptions: { id: DateStatus; label: string; sub: string }[] = [
    {
      id: "yes",
      label: "Yes, we have a date",
      sub: "Locked in and ready to plan.",
    },
    {
      id: "season",
      label: "Just a season",
      sub: "We know spring vs. fall, not the exact day.",
    },
    {
      id: "not-sure",
      label: "Not sure yet",
      sub: "Still figuring out timing.",
    },
  ];

  const venueOptions: { id: "touring" | "booked" | "none"; label: string }[] = [
    { id: "booked", label: "Venue booked" },
    { id: "touring", label: "Currently touring" },
    { id: "none", label: "Haven't started" },
  ];

  const venueTypeOptions: { id: VenueType; note: string }[] = [
    { id: "standard",      note: "Site fee + outside caterer" },
    { id: "all-inclusive", note: "Catering & rentals bundled" },
    { id: "raw-space",     note: "Bring everything in" },
  ];

  function getDateInsight(date: Date): { text: string; color: string } {
    const dow = date.getDay();
    const year = date.getFullYear();

    // Floating holidays
    const memorialDay = (() => {
      const d = new Date(year, 4, 31);
      while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
      return d;
    })();
    const laborDay = (() => {
      const d = new Date(year, 8, 1);
      while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
      return d;
    })();
    const thanksgiving = (() => {
      const d = new Date(year, 10, 1);
      let count = 0;
      while (count < 4) {
        if (d.getDay() === 4) count++;
        if (count < 4) d.setDate(d.getDate() + 1);
      }
      return d;
    })();

    const daysDiff = (a: Date, b: Date) =>
      Math.abs(a.getTime() - b.getTime()) / 86400000;

    const near = (holiday: Date, window = 2) => daysDiff(date, holiday) <= window;

    // Fixed holidays
    const holidays: [Date, number, string][] = [
      [new Date(year, 0, 1),   1, "New Year's Day weekend — demand rivals peak summer Saturdays. Venues book out fast and vendors often charge a holiday premium."],
      [new Date(year, 11, 31), 1, "New Year's Eve is one of the most-requested wedding dates of the year. Expect premium pricing and very limited last-minute availability."],
      [new Date(year, 1, 14),  1, "Valentine's weekend is peak season for florists — they're stretched thin and prices spike. Book your florals especially early."],
      [new Date(year, 6, 4),   2, "Fourth of July weekend is festive and popular, but comes with logistics: heat, travel, and parking. Vendors typically price it like a peak Saturday."],
      [new Date(year, 11, 25), 2, "Christmas week has limited vendor availability. Venues that are open may offer off-peak pricing, but confirm caterers and florists well in advance."],
    ];

    for (const [holiday, window, text] of holidays) {
      if (near(holiday, window)) return { text, color: "var(--clay)" };
    }
    if (near(memorialDay, 2))  return { text: "Memorial Day weekend has Saturday-level demand across all three days. The long weekend makes it popular for out-of-town guests — and competitive to book.", color: "var(--clay)" };
    if (near(laborDay, 2))     return { text: "Labor Day weekend is one of the busiest wedding weekends of the year. Out-of-town guests love the built-in travel window, and vendors price it accordingly.", color: "var(--clay)" };
    if (near(thanksgiving, 2)) return { text: "Thanksgiving week is an unusual pick — many vendors are limited and family travel conflicts are common. If it works for your crew, it can be a genuinely budget-friendly window.", color: "var(--olive)" };

    const dowName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dow];
    if (dow === 6) return { text: "Saturdays are the most in-demand day for weddings. Venues charge peak rates and top photographers, bands, and florists book out 12–18 months in advance.", color: "var(--clay)" };
    if (dow === 5) return { text: "Fridays save most couples 10–18% compared to Saturday at the same venue. Same vendors, same quality — guests just plan for an evening ceremony.", color: "var(--olive)" };
    if (dow === 0) return { text: "Sundays typically run 20–25% less than Saturdays. An afternoon ceremony works beautifully, and many guests appreciate wrapping up at a reasonable hour.", color: "var(--olive)" };
    return { text: `${dowName} weddings offer the deepest savings — often 30–40% less than a Saturday at the same venue. Ideal if your guest list is mostly local or flexible with time off.`, color: "var(--olive)" };
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3" role="radiogroup" aria-label="Date status">
        {dateOptions.map((opt) => {
          const isYes = opt.id === "yes";
          const selected = dateStatus === opt.id;

          // "Yes" card is an expandable div; others remain simple buttons
          if (isYes) {
            return (
              <div
                key={opt.id}
                role="radio"
                aria-checked={selected}
                className="rounded-lg transition-all duration-300"
                style={{
                  border: `1px solid ${selected ? "var(--clay)" : "var(--sand)"}`,
                  background: selected ? "var(--bone)" : "var(--alabaster)",
                  overflow: "hidden",
                }}
              >
                {/* clickable header row */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => onDateChange("yes")}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{ borderColor: selected ? "var(--clay)" : "var(--sand)" }}
                  >
                    {selected && (
                      <motion.div
                        layoutId="date-radio"
                        className="w-2 h-2 rounded-full"
                        style={{ background: "var(--clay)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium" style={{ color: "var(--ink)" }}>
                      {opt.label}
                    </p>
                    <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {weddingDate && selected
                        ? weddingDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
                        : opt.sub}
                    </p>
                  </div>
                </div>

                {/* calendar expands inside the card */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE_REF }}
                      style={{ overflow: "hidden" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ borderTop: "1px solid var(--sand)" }}>
                        <WeddingDatePicker
                          value={weddingDate}
                          onChange={onWeddingDateChange}
                          compact
                        />
                        <AnimatePresence>
                          {weddingDate && (() => {
                            const insight = getDateInsight(weddingDate);
                            return (
                              <motion.div
                                key={weddingDate.toDateString()}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE_REF }}
                                style={{
                                  margin: "0 16px 16px",
                                  padding: "10px 14px",
                                  borderRadius: 8,
                                  borderLeft: `3px solid ${insight.color}`,
                                  background: "var(--alabaster)",
                                }}
                              >
                                <p className="font-body text-xs leading-relaxed" style={{ color: "var(--ink)" }}>
                                  {insight.text}
                                </p>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // "Just a season" card also expands when selected
          if (opt.id === "season") {
            const seasonLabel = weddingSeason
              ? seasonOptions.find((s) => s.id === weddingSeason)?.label
              : null;
            const dowLabel = weddingDayOfWeek !== null
              ? dowOptions.find((d) => d.dow === weddingDayOfWeek)?.label
              : null;
            const subText = selected && (seasonLabel || dowLabel)
              ? [seasonLabel, dowLabel].filter(Boolean).join(" · ")
              : opt.sub;

            return (
              <div
                key={opt.id}
                role="radio"
                aria-checked={selected}
                className="rounded-lg transition-all duration-300"
                style={{
                  border: `1px solid ${selected ? "var(--clay)" : "var(--sand)"}`,
                  background: selected ? "var(--bone)" : "var(--alabaster)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => onDateChange("season")}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{ borderColor: selected ? "var(--clay)" : "var(--sand)" }}
                  >
                    {selected && (
                      <motion.div
                        layoutId="date-radio"
                        className="w-2 h-2 rounded-full"
                        style={{ background: "var(--clay)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium" style={{ color: "var(--ink)" }}>{opt.label}</p>
                    <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)" }}>{subText}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE_REF }}
                      style={{ overflow: "hidden" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ borderTop: "1px solid var(--sand)", padding: "16px" }} className="space-y-5">
                        {/* Season chips */}
                        <div>
                          <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
                            Which season?
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {seasonOptions.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => onSeasonChange(s.id)}
                                className="text-left px-4 py-3 rounded-lg transition-all duration-200"
                                style={{
                                  background: weddingSeason === s.id ? "var(--clay)" : "var(--alabaster)",
                                  color: weddingSeason === s.id ? "var(--bone)" : "var(--ink)",
                                  border: `1px solid ${weddingSeason === s.id ? "var(--clay)" : "var(--sand)"}`,
                                  cursor: "pointer",
                                }}
                              >
                                <p className="font-body text-sm font-medium">{s.label}</p>
                                <p className="font-body text-xs mt-0.5" style={{ color: weddingSeason === s.id ? "rgba(251,248,243,0.75)" : "var(--muted)" }}>
                                  {s.months}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Day-of-week chips */}
                        <div>
                          <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
                            Day of week?
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {dowOptions.map((d) => (
                              <button
                                key={d.dow}
                                onClick={() => onDayOfWeekChange(d.dow)}
                                className="text-left px-4 py-3 rounded-lg transition-all duration-200"
                                style={{
                                  background: weddingDayOfWeek === d.dow ? "var(--clay)" : "var(--alabaster)",
                                  color: weddingDayOfWeek === d.dow ? "var(--bone)" : "var(--ink)",
                                  border: `1px solid ${weddingDayOfWeek === d.dow ? "var(--clay)" : "var(--sand)"}`,
                                  cursor: "pointer",
                                }}
                              >
                                <p className="font-body text-sm font-medium">{d.label}</p>
                                <p className="font-body text-xs mt-0.5" style={{ color: weddingDayOfWeek === d.dow ? "rgba(251,248,243,0.75)" : "var(--muted)" }}>
                                  {d.note}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={selected}
              onClick={() => onDateChange(opt.id)}
              className="w-full text-left p-4 rounded-lg transition-all duration-300 card-bone"
              style={{
                border: `1px solid ${selected ? "var(--clay)" : "var(--sand)"}`,
                background: selected ? "var(--bone)" : "var(--alabaster)",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{ borderColor: selected ? "var(--clay)" : "var(--sand)" }}
                >
                  {selected && (
                    <motion.div
                      layoutId="date-radio"
                      className="w-2 h-2 rounded-full"
                      style={{ background: "var(--clay)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </div>
                <div>
                  <p className="font-body text-sm font-medium" style={{ color: "var(--ink)" }}>
                    {opt.label}
                  </p>
                  <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {opt.sub}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Venue status */}
      <div className="space-y-3">
        <p className="font-body text-sm font-medium" style={{ color: "var(--ink)" }}>
          Venue status?
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Venue status">
          {venueOptions.map((opt) => (
            <button
              key={opt.id}
              role="radio"
              aria-checked={venueStatus === opt.id}
              onClick={() => onVenueChange(opt.id)}
              className="font-body text-sm px-4 py-2 rounded-full transition-colors duration-200"
              style={{
                background:
                  venueStatus === opt.id ? "var(--clay)" : "var(--bone)",
                color: venueStatus === opt.id ? "var(--bone)" : "var(--muted)",
                border: `1px solid ${venueStatus === opt.id ? "var(--clay)" : "var(--sand)"}`,
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {(venueStatus === "booked" || venueStatus === "touring") && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_REF }}
            style={{ position: "relative" }}
          >
            <input
              type="text"
              placeholder={venueStatus === "booked" ? "Venue name (e.g. Vibiana, Greystone Mansion)" : "Venue you're eyeing (e.g. Calamigos Ranch)"}
              value={venueName}
              onChange={(e) => onVenueNameChange(e.target.value)}
              className="w-full px-4 py-3 rounded-md font-body text-sm outline-none transition-all"
              style={{
                background: "var(--alabaster)",
                border: `1px solid ${venueId ? "var(--olive)" : "var(--sand)"}`,
                color: "var(--ink)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--clay)"; setVenueFocused(true); }}
              onBlur={(e) => { e.currentTarget.style.borderColor = venueId ? "var(--olive)" : "var(--sand)"; setTimeout(() => setVenueFocused(false), 150); }}
              aria-label="Venue name"
              role="combobox"
              aria-expanded={venueSuggestions.length > 0}
              aria-controls="venue-suggestions"
            />
            {venueSuggestions.length > 0 && (
              <div
                id="venue-suggestions"
                role="listbox"
                aria-label="Known venues"
                className="absolute left-0 right-0 mt-1 rounded-md overflow-hidden z-10"
                style={{ background: "var(--bone)", border: "1px solid var(--sand)", boxShadow: "0 8px 24px rgba(43,38,34,0.12)" }}
              >
                {venueSuggestions.map((v) => (
                  <button
                    key={v.id}
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => { e.preventDefault(); onSelectVenue(v); setVenueFocused(false); }}
                    className="w-full text-left px-4 py-2.5 font-body text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--ink)", background: "transparent", cursor: "pointer", borderBottom: "1px solid var(--sand)" }}
                  >
                    {v.name}
                    <span className="text-xs ml-2" style={{ color: "var(--olive)" }}>
                      real pricing available
                    </span>
                  </button>
                ))}
              </div>
            )}
            {venueId ? (
              <p className="font-body text-xs mt-1.5" style={{ color: "var(--olive)" }}>
                ✓ Using {venueName}&apos;s published site fee and minimums in your estimate.
              </p>
            ) : (
              <p className="font-body text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                Helps Kristina give you a more accurate estimate — and if we know the venue&apos;s
                published pricing, your numbers update automatically.
              </p>
            )}
          </motion.div>
        )}
        {/* Venue type — shapes the rentals/catering split in the estimate */}
        <div className="space-y-3 pt-2">
          <p className="font-body text-sm font-medium" style={{ color: "var(--ink)" }}>
            What kind of venue are you picturing?
          </p>
          {venueId && (
            <p className="font-body text-xs" style={{ color: "var(--olive)" }}>
              Set automatically from {venueName}&apos;s published setup.
            </p>
          )}
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }} role="radiogroup" aria-label="Venue type">
            {venueTypeOptions.map((opt) => {
              const selected = venueType === opt.id;
              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={selected}
                  aria-disabled={!!venueId}
                  onClick={() => { if (!venueId) onVenueTypeChange(opt.id); }}
                  className="text-left px-4 py-3 rounded-lg transition-all duration-200"
                  style={{
                    background: selected ? "var(--clay)" : "var(--bone)",
                    color: selected ? "var(--bone)" : "var(--ink)",
                    border: `1px solid ${selected ? "var(--clay)" : "var(--sand)"}`,
                    cursor: venueId ? "default" : "pointer",
                    opacity: venueId && !selected ? 0.45 : 1,
                  }}
                >
                  <p className="font-body text-sm font-medium">{venueTypeLabels[opt.id]}</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: selected ? "rgba(251,248,243,0.75)" : "var(--muted)" }}>
                    {opt.note}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {venueStatus === "touring" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_REF }}
            className="font-body text-sm"
            style={{ color: "var(--clay)" }}
          >
            Still touring venues? That&apos;s actually the best time to talk to a
            planner — before you sign anything.{" "}
            <a
              href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
              className="underline hover:opacity-70 transition-opacity"
              style={{ color: "var(--clay)" }}
            >
              Schedule a free call →
            </a>
          </motion.p>
        )}
      </div>
    </div>
  );
}
