"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GuestSlider from "@/components/GuestSlider";
import LocationPicker from "@/components/LocationPicker";
import TierPicker from "@/components/TierPicker";
import ResultsBreakdown from "@/components/ResultsBreakdown";
import FloatingRail from "@/components/FloatingRail";
import { calculateWeddingBudget, BudgetResult, Tier, Location, DayOfWeek, dowDayLabels } from "@/config/costModel";
import WeddingDatePicker from "@/components/WeddingDatePicker";
import MobileEstimateBar from "@/components/MobileEstimateBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [weddingSeason, setWeddingSeason] = useState<"spring" | "summer" | "fall" | "winter" | null>(null);
  const [weddingDayOfWeek, setWeddingDayOfWeek] = useState<DayOfWeek | null>(null);
  const [venueStatus, setVenueStatus] = useState<"touring" | "booked" | "none">("none");
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  // Derive timing inputs for the cost model from all date-related state
  const timingMonth: number | undefined = (() => {
    if (weddingDate) return weddingDate.getMonth();
    // Representative month for each season
    if (weddingSeason === "spring") return 3;  // April
    if (weddingSeason === "summer") return 6;  // July
    if (weddingSeason === "fall")   return 9;  // October
    if (weddingSeason === "winter") return 0;  // January
    return undefined;
  })();

  const timingDow: DayOfWeek | undefined = (() => {
    if (weddingDate) return weddingDate.getDay() as DayOfWeek;
    if (weddingDayOfWeek !== null) return weddingDayOfWeek;
    return undefined;
  })();

  // Recalculate on any input change (for live rail)
  useEffect(() => {
    if (step >= 2) {
      setResult(calculateWeddingBudget(guests, location, tier, timingMonth, timingDow));
    }
  }, [guests, location, tier, timingMonth, timingDow, step]);

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
      const finalResult = calculateWeddingBudget(guests, location, tier, timingMonth, timingDow);
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
          <SiteHeader bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "#"} />

          {/* Hero */}
          <main className="flex-1 flex items-center">
            <div className="max-w-4xl mx-auto px-6 py-20">
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
          <SiteFooter />
        </motion.div>
      )}

      {/* ─── Calculator Steps ─────────────────────────────────────────────────── */}
      {step >= 1 && step <= 4 && (
        <><div className="min-h-screen" style={{ background: "var(--alabaster)" }}>
          <SiteHeader
            onLogoClick={restart}
            bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
          />

          {/* Main content with asymmetric grid */}
          <div className="max-w-7xl mx-auto px-6 py-8 lg:grid lg:gap-12" style={{ gridTemplateColumns: "7fr 4fr" }}>
            {/* Left: Steps — pb-24 gives clearance for the mobile sticky bar */}
            <div className="min-w-0 pb-24 lg:pb-0">
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
                          <div className="relative z-10 pt-2">
                            <div className="flex items-center gap-2 mb-3">
                              {step > 1 && (
                                <button
                                  onClick={goBack}
                                  aria-label="Go back"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                    color: "var(--clay)",
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              )}
                              <p
                                className="font-body text-xs uppercase tracking-widest"
                                style={{ color: "var(--clay)" }}
                              >
                                Step {step} of 4
                              </p>
                            </div>
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
                              weddingDate={weddingDate}
                              onWeddingDateChange={setWeddingDate}
                              weddingSeason={weddingSeason}
                              onSeasonChange={setWeddingSeason}
                              weddingDayOfWeek={weddingDayOfWeek}
                              onDayOfWeekChange={setWeddingDayOfWeek}
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

            {/* Right: Floating rail (desktop only) */}
            <FloatingRail
              result={step >= 2 ? result : null}
              currentStep={step}
              totalSteps={4}
            />
          </div>
        </div>

        {/* Mobile sticky estimate bar (steps 2–4 only) */}
        <MobileEstimateBar result={result} step={step} />
        </>
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
          <SiteHeader
            onLogoClick={restart}
            showBack
            onBack={goBack}
            bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
          />

          {/* Results content */}
          <div className="max-w-7xl mx-auto px-6 py-8 lg:grid lg:gap-12" style={{ gridTemplateColumns: "7fr 4fr" }}>
            <div className="min-w-0">
              {/* Section heading */}
              <div className="relative mb-8">
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
          <SiteFooter />
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
  dateStatus, onDateChange,
  weddingDate, onWeddingDateChange,
  weddingSeason, onSeasonChange,
  weddingDayOfWeek, onDayOfWeekChange,
  venueStatus, onVenueChange,
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
}) {
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
    { dow: 0, label: "Sunday",    note: "~22% savings" },
    { dow: 3, label: "Weekday",   note: "~38% savings" },
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
