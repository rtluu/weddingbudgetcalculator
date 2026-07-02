"use client";

import { useEffect, useState } from "react";
import { useSpring, motion, useReducedMotion } from "framer-motion";

interface GuestSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export default function GuestSlider({ value, onChange }: GuestSliderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  // Spring-animated motion value for the rolling number
  const springConfig = {
    stiffness: shouldReduceMotion ? 300 : 80,
    damping: shouldReduceMotion ? 30 : 20,
  };
  const springVal = useSpring(value, springConfig);

  // Track the fill width for the slider track
  const fillPercent = ((value - 20) / (300 - 20)) * 100;

  useEffect(() => {
    springVal.set(value);
    const unsub = springVal.on("change", (v) => {
      setDisplayValue(Math.round(v));
    });
    return unsub;
  }, [value, springVal]);

  return (
    <div className="space-y-6">
      {/* Big rolling number */}
      <div className="flex items-baseline gap-3">
        <motion.span
          className="font-display font-semibold leading-none"
          style={{
            fontSize: "clamp(4rem, 14vw, 8rem)",
            color: "var(--clay)",
            fontVariantNumeric: "tabular-nums",
            fontOpticalSizing: "auto",
          }}
        >
          {displayValue}
        </motion.span>
        <span
          className="font-body text-xl"
          style={{ color: "var(--muted)" }}
        >
          guests
        </span>
      </div>

      {/* Custom slider with clay fill track */}
      <div className="relative py-2">
        {/* Background track */}
        <div
          className="absolute left-0 right-0 rounded-full pointer-events-none"
          style={{
            height: "2px",
            background: "var(--sand)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        {/* Filled portion */}
        <div
          className="absolute left-0 rounded-full pointer-events-none transition-all"
          style={{
            width: `${fillPercent}%`,
            height: "2px",
            background: "var(--clay)",
            top: "50%",
            transform: "translateY(-50%)",
            transitionDuration: "50ms",
          }}
        />
        <input
          type="range"
          min={20}
          max={300}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-custom w-full relative z-10"
          aria-label={`Guest count: ${value}`}
          aria-valuenow={value}
          aria-valuemin={20}
          aria-valuemax={300}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between">
        <span className="font-body text-xs" style={{ color: "var(--muted)" }}>
          20 intimate
        </span>
        <span className="font-body text-xs" style={{ color: "var(--muted)" }}>
          300 grand
        </span>
      </div>

      {/* Context note */}
      <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
        {value < 50
          ? "Intimate weddings can be deeply personal — and surprisingly flexible on cost."
          : value < 100
          ? "A mid-size wedding. Plenty of room to be selective about where you splurge."
          : value < 150
          ? "The LA sweet spot — enough scale for full production, still personal."
          : value < 200
          ? "A proper celebration. Venue capacity and catering logistics start to matter here."
          : "A grand affair. Every vendor category scales up significantly above 200."}
      </p>
    </div>
  );
}
