"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring, useReducedMotion, useDragControls } from "framer-motion";
import { BudgetResult, Tier, locationLabels } from "@/config/costModel";

const EASE = [0.22, 1, 0.36, 1] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const tierLabel: Record<Tier, string> = {
  budget: "Conservative",
  moderate: "Signature",
  luxury: "Editorial",
};

interface Props {
  result: BudgetResult | null;
  step: number;
}

export default function MobileEstimateBar({ result, step }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const dragControls = useDragControls();
  const [displayTotal, setDisplayTotal] = useState(result?.total ?? 0);

  const springTotal = useSpring(result?.total ?? 0, {
    stiffness: shouldReduceMotion ? 300 : 80,
    damping: shouldReduceMotion ? 30 : 22,
  });

  useEffect(() => {
    if (result?.total !== undefined) springTotal.set(result.total);
  }, [result?.total, springTotal]);

  useEffect(() => {
    const unsub = springTotal.on("change", (v) => setDisplayTotal(Math.round(v)));
    return unsub;
  }, [springTotal]);

  // Close sheet if user goes back to step 1 or reaches results
  useEffect(() => {
    if (step < 2 || step >= 5) setOpen(false);
  }, [step]);

  // Only visible on mobile (lg:hidden handled by wrapper), steps 2–4
  if (step < 2 || step >= 5) return null;

  const topCats = result
    ? [...result.categories].sort((a, b) => b.subtotal - a.subtotal).slice(0, 4)
    : [];

  const hasSeasonalNote = result?.seasonNote || result?.dowNote;

  return (
    <>
      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
            className="lg:hidden"
            style={{
              position: "fixed", inset: 0,
              background: "rgba(43,38,34,0.40)",
              zIndex: 49,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Expanded bottom sheet ── */}
      <AnimatePresence>
        {open && result && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.40, ease: EASE }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) {
                setOpen(false);
              }
            }}
            className="lg:hidden"
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "var(--bone)",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -8px 48px rgba(43,38,34,0.18)",
              zIndex: 50,
              maxHeight: "78vh",
              overflowY: "auto",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 76px)",
            }}
          >
            {/* Drag handle — touch here to pull down */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              style={{
                display: "flex", justifyContent: "center",
                padding: "14px 0 6px",
                touchAction: "none",
                cursor: "grab",
              }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--clay)", opacity: 0.35 }} />
            </div>

            <div style={{ padding: "12px 24px 0" }}>
              {/* Sheet header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 10,
                  letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)",
                }}>
                  Your estimate so far
                </p>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--muted)", fontSize: 22, lineHeight: 1, padding: "0 0 2px",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Context chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {[
                  `${result.guests} guests`,
                  locationLabels[result.location],
                  tierLabel[result.tier],
                  ...(result.month !== null
                    ? [["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][result.month]]
                    : []),
                  ...(result.dayOfWeek !== null
                    ? [["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][result.dayOfWeek]]
                    : []),
                ].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      fontFamily: "var(--font-body)", fontSize: 11,
                      padding: "3px 10px", borderRadius: 20,
                      background: "var(--alabaster)", border: "1px solid var(--sand)",
                      color: "var(--ink)",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Top line items */}
              <div style={{ borderTop: "1px solid var(--sand)" }}>
                {topCats.map((cat) => (
                  <div
                    key={cat.name}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "11px 0", borderBottom: "1px solid var(--sand)",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 11,
                      letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)",
                    }}>
                      {cat.name}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: 15,
                      color: "var(--ink)", fontVariantNumeric: "tabular-nums",
                    }}>
                      {fmt(cat.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timing insight */}
              {hasSeasonalNote && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.seasonNote && (
                    <div style={{
                      padding: "10px 12px", borderRadius: 8,
                      background: "rgba(79, 111, 87,0.07)", border: "1px solid var(--sand)",
                    }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink)", lineHeight: 1.55 }}>
                        ◈ {result.seasonNote}
                      </p>
                    </div>
                  )}
                  {result.dowNote && (
                    <div style={{
                      padding: "10px 12px", borderRadius: 8,
                      background: "rgba(110,114,83,0.07)", border: "1px solid var(--sand)",
                    }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink)", lineHeight: 1.55 }}>
                        ◈ {result.dowNote}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Grand total + range */}
              <div style={{ marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 10,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    color: "var(--ink)", fontWeight: 600,
                  }}>
                    Estimated total
                  </span>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: 30,
                    fontWeight: 700, color: "var(--clay)", fontVariantNumeric: "tabular-nums",
                  }}>
                    {fmt(result.total)}
                  </span>
                </div>
                <p style={{
                  textAlign: "right", marginTop: 2,
                  fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)",
                }}>
                  Range: {fmt(result.rangeLow)} – {fmt(result.rangeHigh)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed sticky bar (always visible) ── */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 48,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 50vh 0 50vh var(--bone)",
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close estimate" : "View running estimate"}
          aria-expanded={open}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 24px 14px",
            background: "var(--bone)",
            borderTop: "1px solid var(--sand)",
            boxShadow: open ? "none" : "0 -6px 28px rgba(43,38,34,0.11)",
            cursor: "pointer",
          }}
        >
          {/* Left: label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: 10,
              letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)",
              display: "block",
            }}>
              Running estimate
            </span>
            {result && (result.month !== null || result.dayOfWeek !== null) && (
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", opacity: 0.7,
                display: "block",
              }}>
                {[
                  result.month !== null ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][result.month] : null,
                  result.dayOfWeek !== null ? ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][result.dayOfWeek] : null,
                ].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>

          {/* Right: animated total + chevron */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
              color: result ? "var(--clay)" : "var(--muted)",
              fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em",
            }}>
              {result ? fmt(displayTotal) : "—"}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{
                color: "var(--clay)", fontSize: 16, lineHeight: 1,
                display: "flex", alignItems: "center",
              }}
            >
              ↑
            </motion.span>
          </div>
        </button>
      </div>
    </>
  );
}
