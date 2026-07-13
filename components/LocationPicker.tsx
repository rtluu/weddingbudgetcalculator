"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Location } from "@/config/costModel";

const EASE = [0.22, 1, 0.36, 1] as const;

const locations: { id: Location; short: string }[] = [
  { id: "los-angeles",       short: "Los Angeles" },
  { id: "santa-barbara",     short: "Santa Barbara" },
  { id: "orange-county",     short: "Orange County" },
  { id: "san-diego",         short: "San Diego" },
  { id: "palm-springs",      short: "Palm Springs" },
  { id: "socal-suburbs",     short: "SoCal Suburbs" },
  { id: "other-major-metro", short: "Other Metro" },
  { id: "us-average",        short: "US Average" },
];

// "Other Metro" expands to reveal these named markets (each individually
// calibrated in the cost model); "Other US Metro" itself is the fallback.
const otherMetroChildren: { id: Location; short: string; sub: string }[] = [
  { id: "new-york-city",       short: "New York City",         sub: "Manhattan · Brooklyn · metro" },
  { id: "sf-bay-area",         short: "SF Bay Area",           sub: "San Francisco · Wine Country" },
  { id: "chicago",             short: "Chicago",               sub: "City · North Shore · suburbs" },
  { id: "boston",              short: "Boston",                sub: "Greater Boston · Cape" },
  { id: "seattle",             short: "Seattle",               sub: "Puget Sound region" },
  { id: "miami",               short: "Miami",                 sub: "South Florida" },
  { id: "dallas-fort-worth",   short: "Dallas–Fort Worth",     sub: "DFW metroplex" },
  { id: "atlanta",             short: "Atlanta",               sub: "Metro Atlanta" },
  { id: "washington-dc",       short: "Washington, DC",        sub: "The District" },
  { id: "maryland-montgomery", short: "Montgomery County, MD", sub: "Bethesda · Potomac · Rockville" },
  { id: "northern-virginia",   short: "Northern Virginia",     sub: "Arlington · Loudoun wine country" },
];

const otherMetroFamily: Location[] = [
  "other-major-metro",
  ...otherMetroChildren.map((c) => c.id),
];

interface LocationPickerProps {
  value: Location;
  onChange: (loc: Location) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const otherMetroOpen = otherMetroFamily.includes(value);

  return (
    <div className="space-y-4">
      {/* Pill grid */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        }}
        role="radiogroup"
        aria-label="Wedding location"
      >
        {locations.map((loc) => {
          const isOtherMetro = loc.id === "other-major-metro";
          // The "Other Metro" pill stays active while any of its sub-markets is selected.
          const isSelected = isOtherMetro ? otherMetroOpen : value === loc.id;
          return (
            <button
              key={loc.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(loc.id)}
              className="relative py-3 px-4 rounded-full text-sm font-medium transition-colors duration-300 text-left"
              style={{
                fontFamily: "var(--font-body)",
                background: isSelected ? "var(--clay)" : "var(--bone)",
                color: isSelected ? "var(--bone)" : "var(--ink)",
                border: `1px solid ${isSelected ? "var(--clay)" : "var(--sand)"}`,
                cursor: "pointer",
              }}
            >
              {/* Animated underline */}
              {isSelected && (
                <motion.span
                  layoutId="location-underline"
                  className="absolute bottom-2 left-4 right-4 h-px"
                  style={{ background: "var(--bone)", opacity: 0.6 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {loc.short}
              {isOtherMetro && (
                <motion.span
                  aria-hidden
                  className="ml-1.5 inline-block"
                  animate={{ rotate: otherMetroOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ fontSize: 9, opacity: 0.7 }}
                >
                  ▾
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      {/* Other Metro expansion — DC / Maryland / Virginia sub-markets */}
      <AnimatePresence initial={false}>
        {otherMetroOpen && (
          <motion.div
            key="other-metro-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="rounded-lg p-4 space-y-3"
              style={{ background: "var(--bone)", border: "1px solid var(--sand)" }}
            >
              <p
                className="font-body text-xs uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Pick your metro
              </p>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
                role="radiogroup"
                aria-label="Metro market"
              >
                {otherMetroChildren.map((child) => {
                  const selected = value === child.id;
                  return (
                    <button
                      key={child.id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onChange(child.id)}
                      className="text-left px-4 py-3 rounded-lg transition-colors duration-200"
                      style={{
                        background: selected ? "var(--clay)" : "var(--alabaster)",
                        color: selected ? "var(--bone)" : "var(--ink)",
                        border: `1px solid ${selected ? "var(--clay)" : "var(--sand)"}`,
                        cursor: "pointer",
                      }}
                    >
                      <p className="font-body text-sm font-medium">{child.short}</p>
                      <p
                        className="font-body text-xs mt-0.5"
                        style={{ color: selected ? "rgba(251,248,243,0.75)" : "var(--muted)" }}
                      >
                        {child.sub}
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
                Don&apos;t see your city? Keep &ldquo;Other Metro&rdquo; selected — it uses a
                calibrated mid-tier big-city baseline.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multiplier context */}
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="text-sm"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {value === "los-angeles" &&
          "LA venues and catering run ~30% above the national baseline. Venue availability and vendor minimums drive this."}
        {value === "santa-barbara" &&
          "Santa Barbara adds a ~45% venue premium. It's one of the most sought-after wedding markets in the US."}
        {value === "orange-county" &&
          "Orange County runs ~22% above national — strong demand, limited venue inventory."}
        {value === "san-diego" &&
          "San Diego is ~12% above national — a relative bargain compared to LA or SB."}
        {value === "palm-springs" &&
          "Palm Springs adds ~14% — desert-winter demand peaks November through April."}
        {value === "socal-suburbs" &&
          "SoCal suburbs sit right at the national baseline — more value, still beautiful venues."}
        {value === "other-major-metro" &&
          "Calibrated mid-tier big-city baseline (~25% above national) for metros not listed by name."}
        {value === "washington-dc" &&
          "DC runs ~34% above national — the country's priciest catering market, plus a 10% DC catering tax and steep venue food-and-beverage minimums."}
        {value === "maryland-montgomery" &&
          "Montgomery County runs ~20% above national — DC-suburb pricing on catering and country-club venues, a notch below the District itself."}
        {value === "northern-virginia" &&
          "Northern Virginia runs ~22% above national — DC-metro affluence plus a premium Loudoun wine-country venue scene."}
        {value === "new-york-city" &&
          "NYC is the country's most expensive market — venues and catering run ~75% above national (Manhattan higher, outer boroughs lower)."}
        {value === "sf-bay-area" &&
          "The Bay Area runs ~65% above national on venues and catering, with wine-country venues at a further premium."}
        {value === "chicago" &&
          "Chicago runs ~28% above national — plus the nation's highest meal tax (up to 11.75%) on catering."}
        {value === "boston" &&
          "Greater Boston runs ~30% above national — historic venues and full-service expectations drive it."}
        {value === "seattle" &&
          "Seattle runs ~18% above national, with a sharp July–August dry-season peak."}
        {value === "miami" &&
          "Miami runs ~18% above national — peak season is November through April, opposite most of the country."}
        {value === "dallas-fort-worth" &&
          "DFW sits right at the national baseline — big-city vendor depth without coastal pricing."}
        {value === "atlanta" &&
          "Atlanta runs slightly below the national baseline — one of the best-value major metros."}
        {value === "us-average" &&
          "US national average — useful for comparison or if your market is more moderate."}
      </motion.p>
    </div>
  );
}
