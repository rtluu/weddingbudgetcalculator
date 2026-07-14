"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GuestSlider from "@/components/GuestSlider";
import LocationPicker from "@/components/LocationPicker";
import TierPicker from "@/components/TierPicker";
import ResultsBreakdown from "@/components/ResultsBreakdown";
import FloatingRail from "@/components/FloatingRail";
import { locationLabels } from "@/config/costModel";
import MobileEstimateBar from "@/components/MobileEstimateBar";
import SiteNav from "@/components/marketing/SiteNav";
import SiteFooterFull from "@/components/marketing/SiteFooterFull";
import { useWeddingBudgetCalculator } from "./useWeddingBudgetCalculator";
import CopyLinkButton from "./CopyLinkButton";
import DateStatusPicker from "./DateStatusPicker";
import BarStylePicker from "./BarStylePicker";

const EASE = [0.22, 1, 0.36, 1] as const;

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

  const {
    step, setStep,
    guests, setGuests,
    location, setLocation,
    tier, setTier,
    dateStatus, setDateStatus,
    weddingDate, setWeddingDate,
    weddingSeason, setWeddingSeason,
    weddingDayOfWeek, setWeddingDayOfWeek,
    venueStatus, setVenueStatus,
    venueName, setVenueName,
    venueId, selectKnownVenue, knownVenue,
    venueType, setVenueType,
    barStyle, setBarStyle,
    musicType, setMusicType,
    planningPackage, setPlanningPackage,
    toggleCategory,
    leadCaptured,
    softGateName, setSoftGateName,
    softGateEmail, setSoftGateEmail,
    softGateSubmitting,
    result,
    goNext, goBack, goToStep, restart,
    handleLeadCapture, handleSoftGateSubmit,
  } = useWeddingBudgetCalculator();

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* ─── Landing Hero ────────────────────────────────────────────────────── */}
      {step === 0 && (
        <motion.div
          key="landing"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="flex-1 flex flex-col"
          style={{ background: "var(--alabaster)" }}
        >
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
                Built by a SoCal wedding planner, not a spreadsheet. Numbers reflect realistic vendor estimates Kristina sees every season — not national averages from a content farm.
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
        <><div className="flex-1" style={{ background: "var(--alabaster)" }}>
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
                              {step >= 1 && (
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
                              <button
                                onClick={restart}
                                className="font-body text-xs"
                                style={{
                                  marginLeft: "auto",
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                  color: "var(--muted)",
                                  flexShrink: 0,
                                }}
                              >
                                Start over
                              </button>
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
                              venueName={venueName}
                              onVenueNameChange={setVenueName}
                              venueType={knownVenue?.venueType ?? venueType}
                              onVenueTypeChange={setVenueType}
                              venueId={venueId}
                              onSelectVenue={selectKnownVenue}
                            />
                          )}
                          {step === 4 && (
                            <div className="space-y-8">
                              <TierPicker value={tier} onChange={setTier} />
                              <BarStylePicker value={barStyle} onChange={setBarStyle} />
                            </div>
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

      {/* ─── Soft Gate ───────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <motion.div
          key="soft-gate"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={pageTransition}
          className="flex-1 flex flex-col"
          style={{ background: "var(--alabaster)" }}
        >
          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <motion.div
              className="w-full max-w-md space-y-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
            >
              {/* Estimate preview */}
              <div className="text-center space-y-1">
                <p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--clay)" }}>
                  Your estimate is ready
                </p>
                <p
                  className="font-display font-semibold"
                  style={{ fontSize: "clamp(2rem, 10vw, 3rem)", color: "var(--clay)", fontVariantNumeric: "tabular-nums" }}
                >
                  {result ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(result.total) : "—"}
                </p>
                <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
                  {guests} guests · {locationLabels[location]}
                </p>
              </div>

              {/* Form card */}
              <div className="card-bone-elevated p-6 space-y-4">
                <div>
                  <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
                    Get this sent to your inbox
                  </h3>
                  <p className="font-body text-sm mt-1" style={{ color: "var(--muted)" }}>
                    Kristina reads every submission personally. No spam, no pressure.
                  </p>
                </div>
                <form onSubmit={handleSoftGateSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={softGateName}
                    onChange={(e) => setSoftGateName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md font-body text-sm outline-none"
                    style={{ background: "var(--alabaster)", border: "1px solid var(--sand)", color: "var(--ink)" }}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={softGateEmail}
                    onChange={(e) => setSoftGateEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md font-body text-sm outline-none"
                    style={{ background: "var(--alabaster)", border: "1px solid var(--sand)", color: "var(--ink)" }}
                  />
                  <button type="submit" disabled={softGateSubmitting} className="btn-clay w-full">
                    {softGateSubmitting ? "Sending..." : "Send my estimate + see full breakdown →"}
                  </button>
                </form>
              </div>

              {/* Skip */}
              <button
                onClick={() => { setStep(6); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full font-body text-sm text-center"
                style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
              >
                Skip — just show me the numbers →
              </button>
            </motion.div>
          </main>
        </motion.div>
      )}

      {/* ─── Results Page ──────────────────────────────────────────────────────── */}
      {step === 6 && result && (
        <motion.div
          key="results"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={pageTransition}
          className="flex-1"
          style={{ background: "var(--alabaster)" }}
        >
          {/* Results content */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="min-w-0">
              {/* Section heading */}
              <div className="relative mb-8">
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
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
                      <p
                        className="font-body text-xs uppercase tracking-widest"
                        style={{ color: "var(--clay)" }}
                      >
                        Your mosaic estimate
                      </p>
                    </div>
                    <CopyLinkButton />
                  </div>
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
                  {/* Quick-edit chips */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { label: `${guests} guests`, step: 1 },
                      { label: locationLabels[location], step: 2 },
                      { label: tier === "budget" ? "Conservative" : tier === "moderate" ? "Signature" : "Editorial", step: 4 },
                    ].map(({ label, step: s }) => (
                      <button
                        key={s}
                        onClick={() => goToStep(s)}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--muted)",
                          background: "var(--bone)",
                          border: "1px solid var(--sand)",
                          borderRadius: 20,
                          padding: "4px 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--clay)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--sand)")}
                      >
                        {label}
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <ResultsBreakdown
                result={result}
                onLeadCapture={handleLeadCapture}
                alreadyCaptured={leadCaptured}
                onToggleCategory={toggleCategory}
                musicType={musicType}
                onMusicTypeChange={setMusicType}
                planningPackage={planningPackage}
                onPlanningPackageChange={setPlanningPackage}
              />
            </div>
          </div>
        </motion.div>
      )}
      </div>
      <SiteFooterFull />
    </div>
  );
}
