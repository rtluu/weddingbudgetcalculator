"use client";

import { motion } from "framer-motion";
import { Location, locationLabels } from "@/config/costModel";

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

interface LocationPickerProps {
  value: Location;
  onChange: (loc: Location) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
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
          const isSelected = value === loc.id;
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
            </button>
          );
        })}
      </div>

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
          "LA vendors run ~26% above the national baseline. Venue availability and vendor minimums drive this."}
        {value === "santa-barbara" &&
          "Santa Barbara adds ~40% premium. It's one of the most sought-after wedding markets in the US."}
        {value === "orange-county" &&
          "Orange County runs ~20% above national — strong demand, limited venue inventory."}
        {value === "san-diego" &&
          "San Diego is ~10% above national — a relative bargain compared to LA or SB."}
        {value === "palm-springs" &&
          "Palm Springs adds ~12% — popular venue market with high seasonal demand in spring and fall."}
        {value === "socal-suburbs" &&
          "SoCal suburbs run ~5% below the national baseline — more value, still beautiful venues."}
        {value === "other-major-metro" &&
          "Major metros (NYC, SF, Chicago) run ~40% above national baseline."}
        {value === "us-average" &&
          "US national average — useful for comparison or if your market is more moderate."}
      </motion.p>
    </div>
  );
}
