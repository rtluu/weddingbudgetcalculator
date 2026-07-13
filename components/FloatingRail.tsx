"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, useSpring } from "framer-motion";
import { BudgetResult, Tier, locationLabels } from "@/config/costModel";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const tierShort: Record<Tier, string> = {
  budget: "Conservative",
  moderate: "Signature",
  luxury: "Editorial",
};

interface FloatingRailProps {
  result: BudgetResult | null;
  currentStep: number;
  totalSteps: number;
}

export default function FloatingRail({
  result,
  currentStep,
  totalSteps,
}: FloatingRailProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayTotal, setDisplayTotal] = useState(result?.total ?? 0);

  const springTotal = useSpring(result?.total ?? 0, {
    stiffness: shouldReduceMotion ? 300 : 80,
    damping: shouldReduceMotion ? 30 : 22,
  });

  useEffect(() => {
    if (result?.total !== undefined) {
      springTotal.set(result.total);
    }
  }, [result?.total, springTotal]);

  useEffect(() => {
    const unsub = springTotal.on("change", (v) => {
      setDisplayTotal(Math.round(v));
    });
    return unsub;
  }, [springTotal]);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div
      className="hidden lg:flex flex-col gap-4 sticky top-8"
      style={{ width: "var(--rail-width, 300px)" }}
      aria-label="Running budget estimate"
    >
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span
            className="font-body text-xs uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Step {Math.min(currentStep, 4)} of {totalSteps}
          </span>
          <span
            className="font-body text-xs"
            style={{ color: "var(--muted)" }}
          >
            {Math.round(Math.min(progress, 100))}%
          </span>
        </div>
        <div
          className="h-0.5 rounded-full overflow-hidden"
          style={{ background: "var(--sand)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: "var(--clay)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
      </div>

      {/* Live total card */}
      <div className="card-bone-elevated p-6 space-y-4">
        <p
          className="font-body text-xs uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Running estimate
        </p>

        {result ? (
          <>
            {/* Animated total */}
            <div
              className="font-display font-semibold leading-none"
              style={{
                fontSize: "2rem",
                color: "var(--clay)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt(displayTotal)}
            </div>

            {/* Range */}
            <p
              className="font-body text-xs"
              style={{ color: "var(--muted)" }}
            >
              Range: {fmt(result.rangeLow)} – {fmt(result.rangeHigh)}
            </p>

            {/* Summary pills */}
            <div className="flex flex-wrap gap-1.5">
              <span
                className="font-body text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--alabaster)",
                  color: "var(--ink)",
                  border: "1px solid var(--sand)",
                }}
              >
                {result.guests} guests
              </span>
              <span
                className="font-body text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--alabaster)",
                  color: "var(--ink)",
                  border: "1px solid var(--sand)",
                }}
              >
                {locationLabels[result.location]}
              </span>
              <span
                className="font-body text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--alabaster)",
                  color: "var(--ink)",
                  border: "1px solid var(--sand)",
                }}
              >
                {tierShort[result.tier]}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "var(--sand)" }} />

            {/* Top 3 categories */}
            <div className="space-y-2">
              <p
                className="font-body text-xs uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Biggest lines
              </p>
              {result.categories
                .filter((c) => c.included)
                .sort((a, b) => b.subtotal - a.subtotal)
                .slice(0, 3)
                .map((cat) => (
                  <div
                    key={cat.name}
                    className="flex justify-between items-baseline"
                  >
                    <span
                      className="font-body text-xs"
                      style={{ color: "var(--ink)" }}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="font-display text-sm"
                      style={{
                        color: "var(--clay)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {fmt(cat.subtotal)}
                    </span>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div
              className="h-8 rounded-md"
              style={{
                background: "var(--sand)",
                opacity: 0.4,
                width: "70%",
              }}
            />
            <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
              Complete the steps to see your live estimate
            </p>
          </div>
        )}
      </div>

      {/* Kristina card */}
      <div
        className="card-bone p-4 space-y-3"
        style={{ borderLeft: "2px solid var(--clay)" }}
      >
        <p
          className="font-body text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          <span style={{ color: "var(--clay)", fontWeight: 500 }}>
            By Mosaic Events
          </span>{" "}
          is Kristina&apos;s LA-based wedding planning studio. Est. 2022. Every
          couple gets her direct attention.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
          className="font-body text-xs underline transition-opacity hover:opacity-70"
          style={{ color: "var(--clay)" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Free 20-min consultation →
        </a>
      </div>
    </div>
  );
}
