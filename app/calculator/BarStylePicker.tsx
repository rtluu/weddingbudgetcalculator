"use client";

import { type BarStyle, barStyleLabels } from "@/config/costModel";

const options: { id: BarStyle; note: string }[] = [
  { id: "beer-wine", note: "Simple pours, lower cost" },
  { id: "standard",  note: "Full open bar — most common" },
  { id: "premium",   note: "Top-shelf + craft cocktails" },
  { id: "none",      note: "Dry or BYO celebration" },
];

// Compact selector for the bar service level; sits under the tier picker on
// step 4 and drives the Bar line's per-guest rate.
export default function BarStylePicker({
  value,
  onChange,
}: {
  value: BarStyle;
  onChange: (b: BarStyle) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="font-body text-sm font-medium" style={{ color: "var(--ink)" }}>
        How will the bar work?
      </p>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
        role="radiogroup"
        aria-label="Bar style"
      >
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className="text-left px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                background: selected ? "var(--clay)" : "var(--bone)",
                color: selected ? "var(--bone)" : "var(--ink)",
                border: `1px solid ${selected ? "var(--clay)" : "var(--sand)"}`,
                cursor: "pointer",
              }}
            >
              <p className="font-body text-sm font-medium">{barStyleLabels[opt.id]}</p>
              <p
                className="font-body text-xs mt-0.5"
                style={{ color: selected ? "rgba(251,248,243,0.75)" : "var(--muted)" }}
              >
                {opt.note}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
