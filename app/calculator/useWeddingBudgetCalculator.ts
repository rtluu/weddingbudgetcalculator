import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  calculateWeddingBudget,
  OPTIONAL_CATEGORIES,
  type BudgetResult,
  type Tier,
  type Location,
  type DayOfWeek,
  type VenueType,
  type BarStyle,
} from "@/config/costModel";
import { findVenueById, type KnownVenue } from "@/config/venues";
import { track, trackLead } from "@/lib/analytics";

export type DateStatus = "yes" | "season" | "not-sure";

const VALID_LOCATIONS: Location[] = [
  "los-angeles", "santa-barbara", "orange-county", "san-diego", "palm-springs",
  "socal-suburbs", "other-major-metro", "washington-dc", "maryland-montgomery",
  "northern-virginia", "new-york-city", "sf-bay-area", "chicago", "boston",
  "seattle", "miami", "dallas-fort-worth", "atlanta", "us-average",
];
const VALID_TIERS: Tier[] = ["budget", "moderate", "luxury"];
const VALID_VENUE_TYPES: VenueType[] = ["standard", "all-inclusive", "raw-space"];
const VALID_BAR_STYLES: BarStyle[] = ["none", "beer-wine", "standard", "premium"];

// Names for the GA funnel (step 0 = landing is covered by the /calculator page_view).
const STEP_NAMES: Record<number, string> = {
  1: "guests",
  2: "location",
  3: "date_venue",
  4: "style_tier",
  5: "soft_gate",
  6: "results",
};

// All state, derived values, effects, and handlers for the budget calculator.
// The estimate is fully derived from the inputs (no result state / effect).
export function useWeddingBudgetCalculator() {
  const [step, setStep] = useState(0); // 0 landing, 1-4 steps, 5 soft gate, 6 results
  const [guests, setGuests] = useState(100);
  const [location, setLocation] = useState<Location>("los-angeles");
  const [tier, setTier] = useState<Tier>("moderate");
  const [dateStatus, setDateStatus] = useState<DateStatus>("not-sure");
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [weddingSeason, setWeddingSeason] = useState<"spring" | "summer" | "fall" | "winter" | null>(null);
  const [weddingDayOfWeek, setWeddingDayOfWeek] = useState<DayOfWeek | null>(null);
  const [venueStatus, setVenueStatus] = useState<"touring" | "booked" | "none">("none");
  const [venueName, setVenueNameState] = useState("");
  const [venueId, setVenueId] = useState<string | null>(null);
  const [venueType, setVenueType] = useState<VenueType>("standard");
  const [barStyle, setBarStyle] = useState<BarStyle>("standard");
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [softGateName, setSoftGateName] = useState("");
  const [softGateEmail, setSoftGateEmail] = useState("");
  const [softGateSubmitting, setSoftGateSubmitting] = useState(false);

  // Derive the cost-model timing inputs from all date-related state.
  const timingMonth: number | undefined = (() => {
    if (weddingDate) return weddingDate.getMonth();
    if (weddingSeason === "spring") return 3; // April
    if (weddingSeason === "summer") return 6; // July
    if (weddingSeason === "fall") return 9;   // October
    if (weddingSeason === "winter") return 0; // January
    return undefined;
  })();

  const timingDow: DayOfWeek | undefined = (() => {
    if (weddingDate) return weddingDate.getDay() as DayOfWeek;
    if (weddingDayOfWeek !== null) return weddingDayOfWeek;
    return undefined;
  })();

  // Wedding year for inflation: the picked date's year, or the next occurrence
  // of the chosen month/season (a month earlier than the current one means
  // next year).
  const weddingYear: number | undefined = (() => {
    if (weddingDate) return weddingDate.getFullYear();
    if (timingMonth === undefined) return undefined;
    const now = new Date();
    return timingMonth >= now.getMonth() ? now.getFullYear() : now.getFullYear() + 1;
  })();

  const toggleCategory = useCallback((name: string) => {
    if (!OPTIONAL_CATEGORIES.includes(name)) return;
    setExcludedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }, []);

  // Free-typing a venue name detaches any previously selected known venue;
  // selecting from the autocomplete attaches its real pricing.
  const setVenueName = useCallback((name: string) => {
    setVenueNameState(name);
    setVenueId(null);
  }, []);

  const selectKnownVenue = useCallback((venue: KnownVenue) => {
    setVenueNameState(venue.name);
    setVenueId(venue.id);
  }, []);

  const knownVenue = venueId ? findVenueById(venueId) : undefined;

  // Estimate is derived — recomputes automatically as inputs change.
  const result: BudgetResult = useMemo(
    () =>
      calculateWeddingBudget(guests, location, tier, timingMonth, timingDow, {
        weddingYear,
        venueType,
        barStyle,
        excludedCategories,
        venue: knownVenue,
      }),
    [guests, location, tier, timingMonth, timingDow, weddingYear, venueType, barStyle, excludedCategories, knownVenue]
  );

  // GA funnel: fire calculator_step once per step first reached (forward only),
  // so we can see where people drop off between landing and the estimate.
  const maxStepReached = useRef(0);
  useEffect(() => {
    if (step > maxStepReached.current) {
      maxStepReached.current = step;
      const stepName = STEP_NAMES[step];
      if (stepName) track("calculator_step", { step, step_name: stepName });
    }
  }, [step]);

  // Hydrate from shared URL params on first load (bypasses the soft gate).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("g");
    const l = params.get("l") as Location | null;
    const t = params.get("t") as Tier | null;
    const m = params.get("m");
    const d = params.get("d");
    const vt = params.get("vt") as VenueType | null;
    const b = params.get("b") as BarStyle | null;
    const x = params.get("x");
    if (!g || !l || !t || !VALID_LOCATIONS.includes(l) || !VALID_TIERS.includes(t)) return;

    const gNum = Math.min(300, Math.max(20, parseInt(g)));
    const mNum = m !== null ? parseInt(m) : undefined;
    const dNum = d !== null ? (parseInt(d) as DayOfWeek) : undefined;

    setGuests(gNum);
    setLocation(l);
    setTier(t);
    if (mNum !== undefined) {
      const season = mNum >= 2 && mNum <= 4 ? "spring" : mNum >= 5 && mNum <= 7 ? "summer" : mNum >= 8 && mNum <= 10 ? "fall" : "winter";
      setWeddingSeason(season);
      setDateStatus("season");
    }
    if (dNum !== undefined) setWeddingDayOfWeek(dNum);
    if (vt && VALID_VENUE_TYPES.includes(vt)) setVenueType(vt);
    if (b && VALID_BAR_STYLES.includes(b)) setBarStyle(b);
    if (x) setExcludedCategories(x.split("|").filter((n) => OPTIONAL_CATEGORIES.includes(n)));
    const vn = params.get("vn");
    if (vn) {
      const venue = findVenueById(vn);
      if (venue) {
        setVenueId(venue.id);
        setVenueNameState(venue.name);
      }
    }
    setStep(6);
  }, []);

  // Write URL params on the results step so the estimate is shareable.
  useEffect(() => {
    if (step !== 6) return;
    const params = new URLSearchParams();
    params.set("g", String(guests));
    params.set("l", location);
    params.set("t", tier);
    if (timingMonth !== undefined) params.set("m", String(timingMonth));
    if (timingDow !== undefined) params.set("d", String(timingDow));
    if (venueType !== "standard") params.set("vt", venueType);
    if (barStyle !== "standard") params.set("b", barStyle);
    if (excludedCategories.length > 0) params.set("x", excludedCategories.join("|"));
    if (venueId) params.set("vn", venueId);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [step, guests, location, tier, timingMonth, timingDow, venueType, barStyle, excludedCategories, venueId]);

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
          venueId: venueId || undefined,
          timingMonth,
          timingDow,
          venueType,
          barStyle,
          excludedCategories,
          weddingYear,
          calculatedTotal: result.total,
        }),
      });
      trackLead("calculator", { guest_count: guests, location, tier, estimate: result.total });
    },
    [guests, location, tier, dateStatus, venueStatus, venueName, venueId, timingMonth, timingDow, venueType, barStyle, excludedCategories, weddingYear, result]
  );

  const scrollTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    setStep((s) => (s < 4 ? s + 1 : 5)); // step 4 → soft gate
    scrollTop();
  };

  const goBack = () => {
    setStep((s) => (s === 6 ? 4 : s > 0 ? s - 1 : s)); // skip soft gate from results
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
      scrollTop();
    }
  };

  const restart = () => {
    setStep(0);
    scrollTop();
  };

  return {
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
    excludedCategories, toggleCategory,
    leadCaptured,
    softGateName, setSoftGateName,
    softGateEmail, setSoftGateEmail,
    softGateSubmitting,
    timingMonth, timingDow,
    result,
    goNext, goBack, goToStep, restart,
    handleLeadCapture, handleSoftGateSubmit,
  };
}
