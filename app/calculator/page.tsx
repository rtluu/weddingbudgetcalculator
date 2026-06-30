"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GuestSlider from "@/components/GuestSlider";
import LocationPicker from "@/components/LocationPicker";
import TierPicker from "@/components/TierPicker";
import ResultsBreakdown from "@/components/ResultsBreakdown";
import FloatingRail from "@/components/FloatingRail";
import { calculateWeddingBudget, BudgetResult, Tier, Location, DayOfWeek, dowDayLabels, locationLabels } from "@/config/costModel";
import WeddingDatePicker from "@/components/WeddingDatePicker";
import MobileEstimateBar from "@/components/MobileEstimateBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { trackLead } from "@/lib/analytics";

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

  const [step, setStep] = useState(0); // 0 = landing, 1-4 = steps, 5 = soft gate, 6 = results
  const [guests, setGuests] = useState(100);
  const [location, setLocation] = useState<Location>("los-angeles");
  const [tier, setTier] = useState<Tier>("moderate");
  const [dateStatus, setDateStatus] = useState<DateStatus>("not-sure");
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [weddingSeason, setWeddingSeason] = useState<"spring" | "summer" | "fall" | "winter" | null>(null);
  const [weddingDayOfWeek, setWeddingDayOfWeek] = useState<DayOfWeek | null>(null);
  const [venueStatus, setVenueStatus] = useState<"touring" | "booked" | "none">("none");
  const [venueName, setVenueName] = useState("");
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [softGateName, setSoftGateName] = useState("");
  const [softGateEmail, setSoftGateEmail] = useState("");
  const [softGateSubmitting, setSoftGateSubmitting] = useState(false);

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

  // Hydrate from shared URL params on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("g");
    const l = params.get("l") as Location | null;
    const t = params.get("t") as Tier | null;
    const m = params.get("m");
    const d = params.get("d");

    const validLocations: Location[] = ["los-angeles","santa-barbara","orange-county","san-diego","palm-springs","socal-suburbs","other-major-metro","washington-dc","maryland-montgomery","northern-virginia","us-average"];
    const validTiers: Tier[] = ["budget","moderate","luxury"];

    if (!g || !l || !t || !validLocations.includes(l) || !validTiers.includes(t)) return;

    const gNum = Math.min(300, Math.max(20, parseInt(g)));
    const mNum = m !== null ? parseInt(m) : undefined;
    const dNum = d !== null ? parseInt(d) as DayOfWeek : undefined;

    setGuests(gNum);
    setLocation(l);
    setTier(t);
    if (mNum !== undefined) {
      const season = mNum >= 2 && mNum <= 4 ? "spring" : mNum >= 5 && mNum <= 7 ? "summer" : mNum >= 8 && mNum <= 10 ? "fall" : "winter";
      setWeddingSeason(season);
      setDateStatus("season");
    }
    if (dNum !== undefined) setWeddingDayOfWeek(dNum);

    setResult(calculateWeddingBudget(gNum, l, t, mNum, dNum));
    setStep(6); // bypass soft gate for shared links
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Write URL params when on results so the estimate is shareable
  useEffect(() => {
    if (step !== 6) return;
    const params = new URLSearchParams();
    params.set("g", String(guests));
    params.set("l", location);
    params.set("t", tier);
    if (timingMonth !== undefined) params.set("m", String(timingMonth));
    if (timingDow !== undefined) params.set("d", String(timingDow));
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [step, guests, location, tier, timingMonth, timingDow]);

  // Recalculate on any input change (for live rail)
  useEffect(() => {
    if (step >= 2) {
      setResult(calculateWeddingBudget(guests, location, tier, timingMonth, timingDow));
    }
  }, [guests, location, tier, timingMonth, timingDow, step]);

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
          venueName: venueName || undefined,
          timingMonth,
          timingDow,
          calculatedTotal: result?.total ?? 0,
        }),
      });
      trackLead("calculator", {
        guest_count: guests,
        location,
        tier,
        estimate: result?.total ?? 0,
      });
    },
    [guests, location, tier, dateStatus, venueStatus, venueName, timingMonth, timingDow, result]
  );

  const goNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const finalResult = calculateWeddingBudget(guests, location, tier, timingMonth, timingDow);
      setResult(finalResult);
      setStep(5); // go to soft gate
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step === 6) setStep(4); // skip soft gate when going back from results
    else if (step > 0) setStep(step - 1);
  };

  const goToStep = (n: number) => setStep(n);

  const handleSoftGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!softGateName || !softGateEmail) return;
    setSoftGateSubmitting(true);
    try {
      await handleLeadCapture({ name: softGateName, email: softGateEmail });
      setLeadCaptured(true);
    } catch {
      // proceed regardless
    } finally {
      setSoftGateSubmitting(false);
      setStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

          {/* Footer — extra bottom clearance on mobile so the sticky estimate bar doesn't cover it */}
          <div className="pb-20 lg:pb-0">
            <SiteFooter />
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
          className="min-h-screen flex flex-col"
          style={{ background: "var(--alabaster)" }}
        >
          <SiteHeader onLogoClick={restart} bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "#"} />
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
          <SiteFooter />
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
          className="min-h-screen"
          style={{ background: "var(--alabaster)" }}
        >
          <SiteHeader
            onLogoClick={restart}
            bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
          />

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
              />
            </div>
          </div>
          <SiteFooter />
        </motion.div>
      )}

    </>
  );
}

// ─── Copy Link Button ──────────────────────────────────────────────────────────
function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-body)",
        fontSize: 12,
        color: copied ? "var(--olive)" : "var(--muted)",
        background: "none",
        border: "1px solid var(--sand)",
        borderRadius: 6,
        padding: "4px 10px",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        {copied
          ? <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
      {copied ? "Copied!" : "Share estimate"}
    </button>
  );
}

// ─── Date Status Picker ────────────────────────────────────────────────────────
function DateStatusPicker({
  dateStatus, onDateChange,
  weddingDate, onWeddingDateChange,
  weddingSeason, onSeasonChange,
  weddingDayOfWeek, onDayOfWeekChange,
  venueStatus, onVenueChange,
  venueName, onVenueNameChange,
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
  venueName: string;
  onVenueNameChange: (v: string) => void;
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

  function getDateInsight(date: Date): { text: string; color: string } {
    const dow = date.getDay();
    const year = date.getFullYear();

    // Floating holidays
    const memorialDay = (() => {
      const d = new Date(year, 4, 31);
      while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
      return d;
    })();
    const laborDay = (() => {
      const d = new Date(year, 8, 1);
      while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
      return d;
    })();
    const thanksgiving = (() => {
      const d = new Date(year, 10, 1);
      let count = 0;
      while (count < 4) {
        if (d.getDay() === 4) count++;
        if (count < 4) d.setDate(d.getDate() + 1);
      }
      return d;
    })();

    const daysDiff = (a: Date, b: Date) =>
      Math.abs(a.getTime() - b.getTime()) / 86400000;

    const near = (holiday: Date, window = 2) => daysDiff(date, holiday) <= window;

    // Fixed holidays
    const holidays: [Date, number, string][] = [
      [new Date(year, 0, 1),   1, "New Year's Day weekend — demand rivals peak summer Saturdays. Venues book out fast and vendors often charge a holiday premium."],
      [new Date(year, 11, 31), 1, "New Year's Eve is one of the most-requested wedding dates of the year. Expect premium pricing and very limited last-minute availability."],
      [new Date(year, 1, 14),  1, "Valentine's weekend is peak season for florists — they're stretched thin and prices spike. Book your florals especially early."],
      [new Date(year, 6, 4),   2, "Fourth of July weekend is festive and popular, but comes with logistics: heat, travel, and parking. Vendors typically price it like a peak Saturday."],
      [new Date(year, 11, 25), 2, "Christmas week has limited vendor availability. Venues that are open may offer off-peak pricing, but confirm caterers and florists well in advance."],
    ];

    for (const [holiday, window, text] of holidays) {
      if (near(holiday, window)) return { text, color: "var(--clay)" };
    }
    if (near(memorialDay, 2))  return { text: "Memorial Day weekend has Saturday-level demand across all three days. The long weekend makes it popular for out-of-town guests — and competitive to book.", color: "var(--clay)" };
    if (near(laborDay, 2))     return { text: "Labor Day weekend is one of the busiest wedding weekends of the year. Out-of-town guests love the built-in travel window, and vendors price it accordingly.", color: "var(--clay)" };
    if (near(thanksgiving, 2)) return { text: "Thanksgiving week is an unusual pick — many vendors are limited and family travel conflicts are common. If it works for your crew, it can be a genuinely budget-friendly window.", color: "var(--olive)" };

    const dowName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dow];
    if (dow === 6) return { text: "Saturdays are the most in-demand day for weddings. Venues charge peak rates and top photographers, bands, and florists book out 12–18 months in advance.", color: "var(--clay)" };
    if (dow === 5) return { text: "Fridays save most couples 10–18% compared to Saturday at the same venue. Same vendors, same quality — guests just plan for an evening ceremony.", color: "var(--olive)" };
    if (dow === 0) return { text: "Sundays typically run 20–25% less than Saturdays. An afternoon ceremony works beautifully, and many guests appreciate wrapping up at a reasonable hour.", color: "var(--olive)" };
    return { text: `${dowName} weddings offer the deepest savings — often 30–40% less than a Saturday at the same venue. Ideal if your guest list is mostly local or flexible with time off.`, color: "var(--olive)" };
  }

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
                        <AnimatePresence>
                          {weddingDate && (() => {
                            const insight = getDateInsight(weddingDate);
                            return (
                              <motion.div
                                key={weddingDate.toDateString()}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE_REF }}
                                style={{
                                  margin: "0 16px 16px",
                                  padding: "10px 14px",
                                  borderRadius: 8,
                                  borderLeft: `3px solid ${insight.color}`,
                                  background: "var(--alabaster)",
                                }}
                              >
                                <p className="font-body text-xs leading-relaxed" style={{ color: "var(--ink)" }}>
                                  {insight.text}
                                </p>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
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
        {venueStatus === "booked" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_REF }}
          >
            <input
              type="text"
              placeholder="Venue name (e.g. Vibiana, Greystone Mansion)"
              value={venueName}
              onChange={(e) => onVenueNameChange(e.target.value)}
              className="w-full px-4 py-3 rounded-md font-body text-sm outline-none transition-all"
              style={{
                background: "var(--alabaster)",
                border: "1px solid var(--sand)",
                color: "var(--ink)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--clay)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sand)")}
              aria-label="Venue name"
            />
            <p className="font-body text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              Helps Kristina give you a more accurate estimate based on the venue&apos;s specific requirements.
            </p>
          </motion.div>
        )}
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
