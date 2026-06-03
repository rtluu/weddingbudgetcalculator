"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GuestSlider from "@/components/GuestSlider";
import LocationPicker from "@/components/LocationPicker";
import TierPicker from "@/components/TierPicker";
import ResultsBreakdown from "@/components/ResultsBreakdown";
import FloatingRail from "@/components/FloatingRail";
import { calculateWeddingBudget, BudgetResult, Tier, Location } from "@/config/costModel";

const EASE = [0.22, 1, 0.36, 1] as const;

type DateStatus = "yes" | "season" | "not-sure";

interface StepConfig {
  num: string;
  title: string;
  subtitle: string;
}

const steps: StepConfig[] = [
  { num: "01", title: "How many guests?", subtitle: "Include everyone — ceremony and reception." },
  { num: "02", title: "Where in the world?", subtitle: "Location is the single biggest cost variable." },
  { num: "03", title: "Do you have a date?", subtitle: "Timeline shapes how much leverage you have with vendors." },
  { num: "04", title: "What does your vision feel like?", subtitle: "Be honest — this is just math, not judgment." },
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(0); // 0 = landing, 1-4 = steps, 5 = results
  const [guests, setGuests] = useState(100);
  const [location, setLocation] = useState<Location>("los-angeles");
  const [tier, setTier] = useState<Tier>("moderate");
  const [dateStatus, setDateStatus] = useState<DateStatus>("season");
  const [venueStatus, setVenueStatus] = useState<"touring" | "booked" | "none">("none");
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  // Recalculate on any input change (for live rail)
  useEffect(() => {
    if (step >= 2) {
      setResult(calculateWeddingBudget(guests, location, tier));
    }
  }, [guests, location, tier, step]);

  // Sticky footer after scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600 && !stickyDismissed) {
        setShowStickyFooter(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stickyDismissed]);

  const handleLeadCapture = useCallback(
    async (data: { name: string; email: string; phone?: string }) => {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          guestCount: guests,
          location,
          tier,
          dateStatus,
          venueStatus,
          calculatedTotal: result?.total ?? 0,
        }),
      });
    },
    [guests, location, tier, dateStatus, venueStatus, result]
  );

  const goNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const finalResult = calculateWeddingBudget(guests, location, tier);
      setResult(finalResult);
      setStep(5);
    }
    // Smooth scroll to top of content on mobile
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    setResult(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: EASE,
  };

  return (
    <>
      {/* ─── Landing Hero ────────────────────────────────────────────────────── */}
      {step === 0 && (
        <motion.div
          key="landing"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="min-h-screen flex flex-col"
          style={{ background: "var(--alabaster)" }}
        >
          {/* Header */}
          <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--clay)" }}
              >
                <span className="font-display text-sm font-semibold" style={{ color: "var(--bone)" }}>
                  M
                </span>
              </div>
              <span
                className="font-body text-sm font-medium"
                style={{ color: "var(--ink)" }}
              >
                By Mosaic Events
              </span>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
              className="btn-outline text-sm py-2 px-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Kristina
            </a>
          </header>

          {/* Hero */}
          <main className="flex-1 flex items-center">
            <div className="max-w-4xl mx-auto px-6 py-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.7 }}
              >
                <p
                  className="font-body text-xs uppercase tracking-widest mb-6"
                  style={{ color: "var(--clay)" }}
                >
                  By Mosaic Events · Est. 2022 · LA-based
                </p>
              </motion.div>

              <motion.h1
                className="display-xl mb-6"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              >
                What will your wedding{" "}
                <em className="italic-serif" style={{ color: "var(--clay)" }}>
                  actually
                </em>{" "}
                cost?
              </motion.h1>

              <motion.p
                className="font-body text-xl mb-3 max-w-2xl"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
              >
                A real LA estimate in 60 seconds.
              </motion.p>

              <motion.p
                className="font-body text-base mb-10 max-w-xl"
                style={{ color: "var(--muted)", opacity: 0.8 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Built by an LA wedding planner, not a spreadsheet. Every number
                reflects real vendor costs Kristina sees every season — not national
                averages from a content farm.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
              >
                <button
                  onClick={goNext}
                  className="btn-clay text-base px-8 py-4"
                >
                  Get my real estimate →
                </button>
                <a
                  href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
                  className="btn-outline text-base px-6 py-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule a free consultation
                </a>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                className="mt-12 flex flex-wrap gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                {[
                  "Results are free — no email required",
                  "Built on real LA vendor data",
                  "Every detail big or small",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                    style={{ color: "var(--muted)" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--clay)" }}
                    />
                    <span className="font-body text-sm">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </main>
        </motion.div>
      )}

      {/* ─── Calculator Steps ─────────────────────────────────────────────────── */}
      {step >= 1 && step <= 4 && (
        <div className="min-h-screen" style={{ background: "var(--alabaster)" }}>
          {/* Header */}
          <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full border-b" style={{ borderColor: "var(--sand)" }}>
            <button
              onClick={restart}
              className="flex items-center gap-2 font-body text-sm"
              style={{ color: "var(--clay)" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--clay)" }}
              >
                <span className="font-display text-xs font-semibold" style={{ color: "var(--bone)" }}>
                  M
                </span>
              </div>
              By Mosaic Events
            </button>
            <a
              href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
              className="btn-clay text-sm py-2 px-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Kristina
            </a>
          </header>

          {/* Main content with asymmetric grid */}
          <div className="max-w-7xl mx-auto px-6 py-8 lg:grid lg:gap-12" style={{ gridTemplateColumns: "7fr 4fr" }}>
            {/* Left: Steps */}
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                {steps.map(
                  (stepConfig, idx) =>
                    step === idx + 1 && (
                      <motion.div
                        key={`step-${idx + 1}`}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="space-y-8"
                      >
                        {/* Section header */}
                        <div className="relative">
                          <span className="section-numeral">{stepConfig.num}</span>
                          <div className="relative z-10 pt-2">
                            <p
                              className="font-body text-xs uppercase tracking-widest mb-3"
                              style={{ color: "var(--clay)" }}
                            >
                              Step {step} of 4
                            </p>
                            <h2 className="display-lg mb-2">{stepConfig.title}</h2>
                            <p
                              className="font-body text-base"
                              style={{ color: "var(--muted)" }}
                            >
                              {stepConfig.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Step content */}
                        <div className="py-4">
                          {step === 1 && (
                            <GuestSlider value={guests} onChange={setGuests} />
                          )}
                          {step === 2 && (
                            <LocationPicker value={location} onChange={setLocation} />
                          )}
                          {step === 3 && (
                            <DateStatusPicker
                              dateStatus={dateStatus}
                              onDateChange={setDateStatus}
                              venueStatus={venueStatus}
                              onVenueChange={setVenueStatus}
                            />
                          )}
                          {step === 4 && (
                            <TierPicker value={tier} onChange={setTier} />
                          )}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center gap-4 pt-4">
                          {step > 1 && (
                            <button
                              onClick={goBack}
                              className="btn-outline"
                            >
                              ← Back
                            </button>
                          )}
                          <button
                            onClick={goNext}
                            className="btn-clay"
                          >
                            {step < 4 ? "Continue →" : "See my estimate →"}
                          </button>
                          {step === 1 && (
                            <button
                              onClick={restart}
                              className="font-body text-sm ml-auto"
                              style={{ color: "var(--muted)" }}
                            >
                              ← Start over
                            </button>
                          )}
                        </div>

                        {/* Mobile progress */}
                        <div className="lg:hidden">
                          <div
                            className="h-0.5 rounded-full overflow-hidden"
                            style={{ background: "var(--sand)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(step / 4) * 100}%`,
                                background: "var(--clay)",
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>

            {/* Right: Floating rail */}
            <FloatingRail
              result={step >= 2 ? result : null}
              currentStep={step}
              totalSteps={4}
            />
          </div>
        </div>
      )}

      {/* ─── Results Page ──────────────────────────────────────────────────────── */}
      {step === 5 && result && (
        <motion.div
          key="results"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={pageTransition}
          className="min-h-screen"
          style={{ background: "var(--alabaster)" }}
        >
          {/* Header */}
          <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full border-b" style={{ borderColor: "var(--sand)" }}>
            <button
              onClick={restart}
              className="flex items-center gap-2 font-body text-sm"
              style={{ color: "var(--clay)" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--clay)" }}
              >
                <span className="font-display text-xs font-semibold" style={{ color: "var(--bone)" }}>
                  M
                </span>
              </div>
              By Mosaic Events
            </button>
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="btn-outline text-sm py-2 px-4"
              >
                ← Adjust
              </button>
              <a
                href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
                className="btn-clay text-sm py-2 px-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Talk to Kristina
              </a>
            </div>
          </header>

          {/* Results content */}
          <div className="max-w-7xl mx-auto px-6 py-8 lg:grid lg:gap-12" style={{ gridTemplateColumns: "7fr 4fr" }}>
            <div className="min-w-0">
              {/* Section heading */}
              <div className="relative mb-8">
                <span className="section-numeral" style={{ opacity: 0.04 }}>
                  est.
                </span>
                <div className="relative z-10">
                  <p
                    className="font-body text-xs uppercase tracking-widest mb-2"
                    style={{ color: "var(--clay)" }}
                  >
                    Your mosaic estimate
                  </p>
                  <h2 className="display-lg">
                    Your wedding{" "}
                    <em
                      className="italic-serif"
                      style={{ color: "var(--clay)" }}
                    >
                      masterpiece
                    </em>
                    , priced.
                  </h2>
                </div>
              </div>
              <ResultsBreakdown
                result={result}
                onLeadCapture={handleLeadCapture}
              />
            </div>

            {/* Right rail on results */}
            <FloatingRail
              result={result}
              currentStep={5}
              totalSteps={4}
            />
          </div>
        </motion.div>
      )}

      {/* ─── Sticky Footer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStickyFooter && !stickyDismissed && step === 5 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4"
            style={{ background: "var(--ink)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <p
                className="font-body text-sm"
                style={{ color: "var(--bone)", opacity: 0.9 }}
              >
                Questions about your number? Ask Kristina.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
                  className="btn-clay text-sm py-2 px-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "var(--clay)" }}
                >
                  Free consultation
                </a>
                <button
                  onClick={() => setStickyDismissed(true)}
                  className="font-body text-sm"
                  style={{ color: "var(--muted)" }}
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Date Status Picker ────────────────────────────────────────────────────────
function DateStatusPicker({
  dateStatus,
  onDateChange,
  venueStatus,
  onVenueChange,
}: {
  dateStatus: DateStatus;
  onDateChange: (v: DateStatus) => void;
  venueStatus: "touring" | "booked" | "none";
  onVenueChange: (v: "touring" | "booked" | "none") => void;
}) {
  const EASE_REF = [0.22, 1, 0.36, 1] as const;

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

  return (
    <div className="space-y-8">
      <div className="space-y-3" role="radiogroup" aria-label="Date status">
        {dateOptions.map((opt) => (
          <button
            key={opt.id}
            role="radio"
            aria-checked={dateStatus === opt.id}
            onClick={() => onDateChange(opt.id)}
            className="w-full text-left p-4 rounded-lg transition-all duration-300 card-bone"
            style={{
              border: `1px solid ${dateStatus === opt.id ? "var(--clay)" : "var(--sand)"}`,
              background:
                dateStatus === opt.id ? "var(--bone)" : "var(--alabaster)",
              cursor: "pointer",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                style={{
                  borderColor:
                    dateStatus === opt.id ? "var(--clay)" : "var(--sand)",
                }}
              >
                {dateStatus === opt.id && (
                  <motion.div
                    layoutId="date-radio"
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--clay)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
              <div>
                <p
                  className="font-body text-sm font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {opt.label}
                </p>
                <p
                  className="font-body text-xs mt-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  {opt.sub}
                </p>
              </div>
            </div>
          </button>
        ))}
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
