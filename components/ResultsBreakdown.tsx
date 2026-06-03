"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BudgetResult, Tier, Location, locationLabels } from "@/config/costModel";

const EASE = [0.22, 1, 0.36, 1] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const tierLabels: Record<Tier, string> = {
  budget: "Budget / Intimate",
  moderate: "Moderate / Signature",
  luxury: "Luxury / Editorial",
};

function kristinasNote(result: BudgetResult): string {
  const { guests, tier, location } = result;
  if (tier === "luxury" && guests >= 120) {
    return "At this scale and tier, the difference between a great wedding and a perfect one almost always comes down to vendor relationships — which is exactly what a planner brings.";
  }
  if (tier === "luxury") {
    return "Editorial-tier weddings have tight vendor choreography. The couples who execute these flawlessly almost always have a planner coordinating behind the scenes.";
  }
  if (location === "santa-barbara" || location === "other-major-metro") {
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
}

export default function ResultsBreakdown({
  result,
  onLeadCapture,
}: ResultsBreakdownProps) {
  const shouldReduceMotion = useReducedMotion();
  const [diyMode, setDiyMode] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const plannerFee = result.tier === "luxury" ? 0.12 : 0.10;
  const plannerAmount = result.total * plannerFee;
  const diyPenalty = result.total * 0.08; // avg overage without planner
  const netWithPlanner = result.total + plannerAmount - diyPenalty;

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
        <div className="flex flex-wrap items-baseline gap-3">
          <span
            className="font-display font-semibold"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              color: "var(--clay)",
              fontVariantNumeric: "tabular-nums",
              fontOpticalSizing: "auto",
            }}
          >
            {fmt(result.rangeLow)}
          </span>
          <span className="font-body text-2xl" style={{ color: "var(--muted)" }}>—</span>
          <span
            className="font-display font-semibold"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              color: "var(--ink)",
              fontVariantNumeric: "tabular-nums",
              fontOpticalSizing: "auto",
            }}
          >
            {fmt(result.rangeHigh)}
          </span>
        </div>
        <div
          className="h-px w-16 rounded-full"
          style={{ background: "var(--clay)" }}
        />
        <p className="font-body text-sm italic" style={{ color: "var(--muted)" }}>
          "{kristinasNote(result)}" — Kristina
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
          className="card-bone p-5 border-l-4"
          style={{ borderLeftColor: "var(--terracotta)" }}
        >
          <p className="font-body text-sm" style={{ color: "var(--ink)" }}>
            DIY couples typically overspend by 8–12% due to vendor missteps, timing errors, and not knowing what to negotiate.{" "}
            <span style={{ color: "var(--terracotta)", fontWeight: 500 }}>
              That&apos;s approximately {fmt(diyPenalty)} in avoidable overages
            </span>{" "}
            on this budget — more than Kristina&apos;s coordination fee.
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
          {result.categories.map((cat) => (
            <motion.div key={cat.name} variants={itemVariants} className="invoice-line">
              <div className="flex-1 min-w-0">
                <span className="invoice-label">{cat.name}</span>
                {cat.name === "Planning/Coordination" && (
                  <p className="font-body text-xs mt-0.5" style={{ color: "var(--clay)", opacity: 0.8 }}>
                    Most LA couples underestimate this line.{" "}
                    <a
                      href={process.env.NEXT_PUBLIC_BOOKING_URL || "#lead"}
                      className="underline hover:opacity-80 transition-opacity"
                      style={{ color: "var(--clay)" }}
                    >
                      Free 20-min call →
                    </a>
                  </p>
                )}
              </div>
              <span className="invoice-value">{fmt(cat.subtotal)}</span>
            </motion.div>
          ))}

          {/* F&B service fee line */}
          <motion.div variants={itemVariants} className="invoice-line">
            <span className="invoice-label" style={{ color: "var(--muted)", opacity: 0.7 }}>
              F&B service + tax (est. 30%)
            </span>
            <span className="invoice-value" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              {fmt(result.fnbServiceAmount)}
            </span>
          </motion.div>

          {/* Contingency */}
          <motion.div variants={itemVariants} className="invoice-line">
            <div>
              <span className="invoice-label">Contingency (8%)</span>
              <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)", opacity: 0.7 }}>
                Things happen. This is the line most people skip, then regret.
              </p>
            </div>
            <span className="invoice-value">{fmt(result.contingencyAmount)}</span>
          </motion.div>

          {/* Grand total */}
          <motion.div
            variants={itemVariants}
            className="pt-4 pb-2 flex items-baseline justify-between"
          >
            <span
              className="font-body text-xs uppercase tracking-widest font-semibold"
              style={{ color: "var(--ink)" }}
            >
              Estimated Total
            </span>
            <span
              className="font-display font-semibold"
              style={{
                fontSize: "1.75rem",
                color: "var(--clay)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt(result.total)}
            </span>
          </motion.div>

          {/* Range note */}
          <motion.div
            variants={itemVariants}
            className="card-bone p-4 text-center"
          >
            <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
              Realistic range
            </p>
            <p
              className="font-display font-medium"
              style={{ fontSize: "1.25rem", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(result.rangeLow)} – {fmt(result.rangeHigh)}
            </p>
          </motion.div>
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
        <p className="font-body text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
          {transitionCopy}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={process.env.NEXT_PUBLIC_BOOKING_URL || "#lead"}
            className="btn-clay text-sm"
          >
            Schedule a free consultation
          </a>
          <button
            onClick={() => setShowLeadForm(true)}
            className="btn-outline text-sm"
          >
            Email me this estimate (PDF)
          </button>
        </div>
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

      {/* Attribution */}
      <div className="pt-4 border-t" style={{ borderColor: "var(--sand)" }}>
        <p className="font-body text-xs text-center" style={{ color: "var(--muted)" }}>
          By Mosaic Events · Est. 2022 · LA-based · bymosaic.com
        </p>
        <p className="font-body text-xs text-center mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Estimates are based on real LA market data. Individual vendor quotes will vary.
        </p>
      </div>
    </div>
  );
}
