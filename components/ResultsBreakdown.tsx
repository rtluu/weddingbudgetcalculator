"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BudgetResult, Tier, locationLabels, OPTIONAL_CATEGORIES } from "@/config/costModel";

const EASE = [0.22, 1, 0.36, 1] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const tierLabels: Record<Tier, string> = {
  budget: "Budget / Conservative",
  moderate: "Moderate / Signature",
  luxury: "Luxury / Editorial",
};

// ─── DIY reduction model ──────────────────────────────────────────────────────
// pct = fraction of planner-managed cost that a DIY couple can realistically save.
// Venue and Attire are 0% — you still need a space and clothes regardless.
// Planning/Coordination is 100% — the couple IS the coordinator in DIY mode.
// Notes explain the specific swap or skip that produces the savings.
const DIY_REDUCTIONS: Record<string, { pct: number; note: string }> = {
  "Planning/Coordination": { pct: 1.00, note: "You become the coordinator — doable, but time-intensive" },
  "Florals":               { pct: 0.60, note: "Grocery blooms, greenery, or Costco arrangements" },
  "Hair & Makeup":         { pct: 0.50, note: "DIY or swap skills with a talented friend" },
  "Favors":                { pct: 0.70, note: "Skip entirely — most guests forget them anyway" },
  "Stationery":            { pct: 0.60, note: "Canva templates + Vistaprint, or go digital" },
  "Decor":                 { pct: 0.50, note: "Amazon, thrift stores, candles, borrowed items" },
  "Cake/Desserts":         { pct: 0.50, note: "Costco or grocery store bakery cake" },
  "Videography":           { pct: 0.65, note: "Skip, or ask a friend with a nice camera" },
  "Music (DJ/band)":       { pct: 0.40, note: "Curated Spotify playlist + quality speakers" },
  "Transportation":        { pct: 0.30, note: "Uber/Lyft for guests vs. chartered shuttles" },
  "Officiant":             { pct: 0.20, note: "Have a friend get ordained online — it's free" },
  "Bar":                   { pct: 0.15, note: "Beer + wine only, skip the full bar program" },
  "Catering":              { pct: 0.10, note: "Buffet or food stations vs. plated service" },
  "Rentals":               { pct: 0.15, note: "Lean on venue-provided furniture and linens" },
  "Photography":           { pct: 0.10, note: "Emerging photographer building their portfolio" },
  "Venue":                 { pct: 0.00, note: "" },
  "Attire (both)":         { pct: 0.00, note: "" },
};

function kristinasNote(result: BudgetResult): string {
  const { guests, tier, location } = result;
  if (tier === "luxury" && guests >= 120) {
    return "At this scale and tier, the difference between a great wedding and a perfect one almost always comes down to vendor relationships — which is exactly what a planner brings.";
  }
  if (tier === "luxury") {
    return "Editorial-tier weddings have tight vendor choreography. The couples who execute these flawlessly almost always have a planner coordinating behind the scenes.";
  }
  if (
    location === "santa-barbara" ||
    location === "other-major-metro" ||
    location === "washington-dc" ||
    location === "maryland-montgomery" ||
    location === "northern-virginia"
  ) {
    return "This market is competitive. The venues that photograph beautifully book 12–18 months out. If you don't have a venue yet, that's the first call to make.";
  }
  if (guests >= 150) {
    return "Above 150 guests, logistical complexity compounds fast — timing, transportation, catering flow. This is where a planner's fee pays for itself in vendor credits alone.";
  }
  if (tier === "budget") {
    return "Budget doesn't mean basic. My best-value weddings came from knowing exactly which lines to invest in and which to simplify — that's a skill, not a spreadsheet.";
  }
  return "The couples who stay on budget almost always have a single person watching the big picture. Your vendors are watching their individual contracts. Someone needs to see all of it.";
}

interface ResultsBreakdownProps {
  result: BudgetResult;
  onLeadCapture: (data: { name: string; email: string; phone?: string }) => void;
  alreadyCaptured?: boolean;
  onToggleCategory?: (name: string) => void;
}

export default function ResultsBreakdown({
  result,
  onLeadCapture,
  alreadyCaptured = false,
  onToggleCategory,
}: ResultsBreakdownProps) {
  const shouldReduceMotion = useReducedMotion();
  const [diyMode, setDiyMode] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const diyPenalty = result.total * 0.08;

  // Build per-category DIY view
  const diyCategories = result.categories.map((cat) => {
    const reduction = DIY_REDUCTIONS[cat.name];
    const pct = reduction?.pct ?? 0;
    return {
      ...cat,
      diySubtotal: cat.subtotal * (1 - pct),
      savings: cat.subtotal * pct,
      pct,
      note: reduction?.note ?? "",
    };
  });
  const diySubtotal = diyCategories.reduce((s, c) => (c.included ? s + c.diySubtotal : s), 0);
  const diyContingency = diySubtotal * result.contingencyRate;
  const diyTotal = diySubtotal + diyContingency;
  const diyTotalSavings = result.total - diyTotal;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadName) return;
    setSubmitting(true);
    try {
      await onLeadCapture({
        name: leadName,
        email: leadEmail,
        phone: leadPhone || undefined,
      });
      setSubmitted(true);
    } catch {
      // Still show success — don't block the user experience
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const transitionCopy =
    result.guests >= 120 && result.tier !== "budget"
      ? `You have ${result.guests} guests planned and no venue locked — this is the exact moment a planner saves you the most. Want a free second opinion on your estimate?`
      : `That number can feel like a lot. The couples who stay on budget almost always have a planner — Kristina's clients save more than her fee by avoiding the wrong vendors.`;

  return (
    <div className="space-y-8">
      {/* Summary header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="card-bone-elevated p-6 md:p-8 space-y-3"
      >
        <p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Your estimated range · {result.guests} guests · {locationLabels[result.location]} · {tierLabels[result.tier]}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.3em", flexWrap: "nowrap", overflow: "hidden" }}>
          <span
            className="font-display font-semibold"
            style={{
              fontSize: "clamp(1.75rem, 6.5vw, 3.5rem)",
              color: "var(--clay)",
              fontVariantNumeric: "tabular-nums",
              fontOpticalSizing: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {fmt(result.rangeLow)}
          </span>
          <span
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 6.5vw, 3.5rem)",
              color: "var(--clay)",
              opacity: 0.4,
              lineHeight: 1,
            }}
          >
            –
          </span>
          <span
            className="font-display font-semibold"
            style={{
              fontSize: "clamp(1.75rem, 6.5vw, 3.5rem)",
              color: "var(--clay)",
              fontVariantNumeric: "tabular-nums",
              fontOpticalSizing: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {fmt(result.rangeHigh)}
          </span>
        </div>
        <div
          className="h-px w-16 rounded-full"
          style={{ background: "var(--clay)" }}
        />
        <p className="font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {transitionCopy}
        </p>
      </motion.div>

      {/* DIY vs. planner toggle */}
      <div className="flex items-center gap-4">
        <span className="font-body text-sm" style={{ color: "var(--ink)" }}>
          View as:
        </span>
        <button
          onClick={() => setDiyMode(false)}
          className="font-body text-sm px-4 py-2 rounded-full transition-colors"
          style={{
            background: !diyMode ? "var(--clay)" : "transparent",
            color: !diyMode ? "var(--bone)" : "var(--muted)",
            border: `1px solid ${!diyMode ? "var(--clay)" : "var(--sand)"}`,
            cursor: "pointer",
          }}
        >
          Planner-managed
        </button>
        <button
          onClick={() => setDiyMode(true)}
          className="font-body text-sm px-4 py-2 rounded-full transition-colors"
          style={{
            background: diyMode ? "var(--clay)" : "transparent",
            color: diyMode ? "var(--bone)" : "var(--muted)",
            border: `1px solid ${diyMode ? "var(--clay)" : "var(--sand)"}`,
            cursor: "pointer",
          }}
        >
          DIY
        </button>
      </div>

      {diyMode && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="space-y-2"
        >
          <div
            className="p-4 rounded-lg flex items-baseline justify-between"
            style={{ background: "rgba(110,114,83,0.10)", border: "1px solid var(--sand)" }}
          >
            <div>
              <p className="font-body text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--olive)" }}>
                DIY potential savings
              </p>
              <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
                Based on realistic swaps — not cutting corners on what matters
              </p>
            </div>
            <span className="font-display text-xl font-semibold ml-4 flex-shrink-0" style={{ color: "var(--olive)" }}>
              −{fmt(diyTotalSavings)}
            </span>
          </div>
          <p className="font-body text-xs" style={{ color: "var(--muted)", paddingLeft: 2 }}>
            Note: DIY couples typically overspend by 8–12% from vendor missteps alone —{" "}
            <span style={{ color: "var(--terracotta)" }}>
              ~{fmt(diyPenalty)} in avoidable overages
            </span>{" "}
            that often wipe out these savings.
          </p>
        </motion.div>
      )}

      {/* Line-item breakdown */}
      <div>
        <h3
          className="font-body text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--muted)" }}
        >
          Category breakdown
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-0"
        >
          {diyCategories.map((cat) => {
            const isExcluded = !cat.included;
            const hasSavings = !isExcluded && diyMode && cat.pct > 0;
            const isRemoved  = isExcluded || (diyMode && cat.pct === 1.00);
            const isToggleable = !!onToggleCategory && OPTIONAL_CATEGORIES.includes(cat.name);

            return (
              <motion.div key={cat.name} variants={itemVariants} className="invoice-line" style={{ alignItems: "flex-start" }}>
                {/* Left: name + notes */}
                <div className="flex-1 min-w-0 pr-4">
                  <span className="invoice-label" style={{ textDecoration: isRemoved ? "line-through" : "none", opacity: isRemoved ? 0.5 : 1 }}>
                    {cat.name}
                  </span>
                  {isToggleable && (
                    <button
                      onClick={() => onToggleCategory(cat.name)}
                      className="font-body text-xs ml-2 underline transition-opacity hover:opacity-70"
                      style={{ color: isExcluded ? "var(--clay)" : "var(--muted)", cursor: "pointer" }}
                      aria-pressed={isExcluded}
                      aria-label={isExcluded ? `Add ${cat.name} back to the estimate` : `Remove ${cat.name} from the estimate`}
                    >
                      {isExcluded ? "add back" : "skip"}
                    </button>
                  )}
                  {/* Planner mode: planning CTA */}
                  {!diyMode && cat.name === "Planning/Coordination" && (
                    <p className="font-body text-xs mt-0.5" style={{ color: "var(--clay)", opacity: 0.8 }}>
                      Most LA couples underestimate this line.{" "}
                      <a href={process.env.NEXT_PUBLIC_BOOKING_URL || "#lead"} className="underline hover:opacity-80 transition-opacity" style={{ color: "var(--clay)" }}>
                        Free 20-min call →
                      </a>
                    </p>
                  )}
                  {/* DIY mode: swap note */}
                  {hasSavings && cat.note && (
                    <p className="font-body text-xs mt-0.5 leading-relaxed" style={{ color: "var(--olive)", opacity: 0.85 }}>
                      {cat.note}
                    </p>
                  )}
                </div>

                {/* Right: price(s) */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {isExcluded ? (
                    <span className="invoice-value" style={{ color: "var(--muted)" }}>
                      <span className="font-body text-xs mr-1.5" style={{ textDecoration: "line-through", fontVariantNumeric: "tabular-nums" }}>
                        {fmt(cat.subtotal)}
                      </span>
                      —
                    </span>
                  ) : hasSavings ? (
                    <>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "flex-end" }}>
                        {/* original, struck out */}
                        <span className="font-body text-xs" style={{ color: "var(--muted)", textDecoration: "line-through", fontVariantNumeric: "tabular-nums" }}>
                          {fmt(cat.subtotal)}
                        </span>
                        {/* DIY price */}
                        <span className="invoice-value" style={{ color: isRemoved ? "var(--muted)" : "var(--ink)" }}>
                          {isRemoved ? "—" : fmt(cat.diySubtotal)}
                        </span>
                      </div>
                      {/* savings badge */}
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: 11,
                        color: "var(--olive)", display: "block", marginTop: 2,
                      }}>
                        save {fmt(cat.savings)}
                      </span>
                    </>
                  ) : (
                    <span className="invoice-value">{fmt(cat.subtotal)}</span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* F&B service fee line */}
          <motion.div variants={itemVariants} className="invoice-line">
            <span className="invoice-label" style={{ color: "var(--muted)", opacity: 0.7 }}>
              F&B service charge + tax
            </span>
            <span className="invoice-value" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              {fmt(result.fnbServiceAmount)}
            </span>
          </motion.div>

          {/* Contingency */}
          <motion.div variants={itemVariants} className="invoice-line">
            <div>
              <span className="invoice-label">Contingency ({Math.round(result.contingencyRate * 100)}%)</span>
              <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)", opacity: 0.7 }}>
                Things happen. This is the line most people skip, then regret.
              </p>
            </div>
            {diyMode ? (
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="font-body text-xs" style={{ color: "var(--muted)", textDecoration: "line-through", fontVariantNumeric: "tabular-nums" }}>
                    {fmt(result.contingencyAmount)}
                  </span>
                  <span className="invoice-value">{fmt(diyContingency)}</span>
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--olive)", display: "block", marginTop: 2 }}>
                  save {fmt(result.contingencyAmount - diyContingency)}
                </span>
              </div>
            ) : (
              <span className="invoice-value">{fmt(result.contingencyAmount)}</span>
            )}
          </motion.div>

          {/* Seasonal adjustment line */}
          {result.month !== null && result.seasonalMult !== 1.0 && (
            <motion.div variants={itemVariants} className="invoice-line">
              <div>
                <span className="invoice-label" style={{ color: result.seasonalMult > 1 ? "var(--terracotta)" : "var(--olive)" }}>
                  Seasonal demand ({["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][result.month]})
                </span>
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)", opacity: 0.8 }}>
                  {result.seasonalMult > 1
                    ? `+${Math.round((result.seasonalAdjustmentAmount / (result.total - result.seasonalAdjustmentAmount)) * 100)}% peak season premium`
                    : `${Math.round((result.seasonalAdjustmentAmount / (result.total - result.seasonalAdjustmentAmount)) * 100)}% off-peak discount`}
                </p>
              </div>
              <span className="invoice-value" style={{ color: result.seasonalMult > 1 ? "var(--terracotta)" : "var(--olive)", fontSize: "0.9rem" }}>
                {result.seasonalMult > 1 ? "+" : ""}{fmt(result.seasonalAdjustmentAmount)}
              </span>
            </motion.div>
          )}

          {/* Day-of-week adjustment line */}
          {result.dayOfWeek !== null && result.dowAdjustmentAmount !== 0 && (
            <motion.div variants={itemVariants} className="invoice-line">
              <div>
                <span className="invoice-label" style={{ color: "var(--olive)" }}>
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][result.dayOfWeek]} wedding savings
                </span>
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)", opacity: 0.8 }}>
                  Venue, entertainment & rentals discount vs. Saturday
                </p>
              </div>
              <span className="invoice-value" style={{ color: "var(--olive)", fontSize: "0.9rem" }}>
                {fmt(result.dowAdjustmentAmount)}
              </span>
            </motion.div>
          )}

          {/* Grand total */}
          <motion.div
            variants={itemVariants}
            className="pt-4 pb-2 flex items-baseline justify-between"
          >
            <span className="font-body text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--ink)" }}>
              {diyMode ? "DIY Total" : "Estimated Total"}
            </span>
            <div style={{ textAlign: "right" }}>
              {diyMode && (
                <span className="font-body text-sm" style={{ color: "var(--muted)", textDecoration: "line-through", fontVariantNumeric: "tabular-nums", display: "block", marginBottom: 2 }}>
                  {fmt(result.total)}
                </span>
              )}
              <span
                className="font-display font-semibold"
                style={{ fontSize: "1.75rem", color: diyMode ? "var(--olive)" : "var(--clay)", fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(diyMode ? diyTotal : result.total)}
              </span>
            </div>
          </motion.div>

          {/* Range note */}
          <motion.div variants={itemVariants} className="card-bone p-4 text-center">
            <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
              {diyMode ? "DIY range" : "Realistic range"}
            </p>
            <p className="font-display font-medium" style={{ fontSize: "1.25rem", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
              {diyMode
                ? `${fmt(diyTotal * 0.9)} – ${fmt(diyTotal * 1.15)}`
                : `${fmt(result.rangeLow)} – ${fmt(result.rangeHigh)}`}
            </p>
            {diyMode && (
              <p className="font-body text-xs mt-2" style={{ color: "var(--terracotta)" }}>
                +{fmt(diyPenalty)} typical DIY overage risk not included above
              </p>
            )}
          </motion.div>

          {/* Full-boat explainer */}
          <motion.p
            variants={itemVariants}
            className="font-body text-xs text-center leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            This estimate prices every line item at typical market rates — published
            &ldquo;average wedding cost&rdquo; figures skip several of them. Not booking
            something? Hit &ldquo;skip&rdquo; on that line to make the number yours.
          </motion.p>

          {/* Timing insight notes */}
          {(result.seasonNote || result.dowNote) && (
            <motion.div variants={itemVariants} className="space-y-2">
              {result.seasonNote && (
                <div className="flex gap-2 items-start p-3 rounded-lg" style={{ background: "rgba(79, 111, 87,0.07)", border: "1px solid var(--sand)" }}>
                  <span style={{ color: "var(--clay)", fontSize: 14, flexShrink: 0 }}>◈</span>
                  <p className="font-body text-xs leading-relaxed" style={{ color: "var(--ink)" }}>{result.seasonNote}</p>
                </div>
              )}
              {result.dowNote && (
                <div className="flex gap-2 items-start p-3 rounded-lg" style={{ background: "rgba(110,114,83,0.07)", border: "1px solid var(--sand)" }}>
                  <span style={{ color: "var(--olive)", fontSize: 14, flexShrink: 0 }}>◈</span>
                  <p className="font-body text-xs leading-relaxed" style={{ color: "var(--ink)" }}>{result.dowNote}</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Transition copy / savings gap CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="card-bone p-6 space-y-4"
        style={{ borderLeft: "3px solid var(--clay)" }}
      >
        <p className="font-body text-sm italic leading-relaxed" style={{ color: "var(--ink)" }}>
          “{kristinasNote(result)}” â Kristina
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={process.env.NEXT_PUBLIC_BOOKING_URL || "#lead"}
            className="btn-clay text-sm"
          >
            Schedule a free consultation
          </a>
          {!alreadyCaptured && (
            <button
              onClick={() => setShowLeadForm(true)}
              className="btn-outline text-sm"
            >
              Email me this estimate (PDF)
            </button>
          )}
        </div>
        {alreadyCaptured && (
          <p className="font-body text-xs" style={{ color: "var(--olive)" }}>
            ✓ Your estimate is on its way — Kristina will be in touch within 24 hours.
          </p>
        )}
      </motion.div>

      {/* Lead capture form */}
      {showLeadForm && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="card-bone-elevated p-6 space-y-4"
          id="lead"
        >
          <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
            Get your free estimate PDF
          </h3>
          <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
            Kristina reads every note. No spam, no pressure — just your numbers in a
            beautifully formatted estimate you can share with your partner.
          </p>
          <form onSubmit={handleLeadSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md font-body text-sm outline-none transition-all"
              style={{
                background: "var(--alabaster)",
                border: "1px solid var(--sand)",
                color: "var(--ink)",
              }}
              aria-label="Your name"
            />
            <input
              type="email"
              placeholder="Your email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md font-body text-sm outline-none transition-all"
              style={{
                background: "var(--alabaster)",
                border: "1px solid var(--sand)",
                color: "var(--ink)",
              }}
              aria-label="Your email address"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-md font-body text-sm outline-none transition-all"
              style={{
                background: "var(--alabaster)",
                border: "1px solid var(--sand)",
                color: "var(--ink)",
              }}
              aria-label="Phone number (optional)"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-clay w-full"
            >
              {submitting ? "Sending..." : "Send my free estimate PDF →"}
            </button>
          </form>
        </motion.div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="card-bone p-6 text-center space-y-2"
        >
          <p
            className="font-display text-2xl italic"
            style={{ color: "var(--clay)", fontOpticalSizing: "auto" }}
          >
            It&apos;s on its way.
          </p>
          <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
            Kristina personally reads every inquiry. Expect a reply within 24 hours.
          </p>
        </motion.div>
      )}

      {/* Footer attribution — rendered by parent page via SiteFooter */}
    </div>
  );
}
