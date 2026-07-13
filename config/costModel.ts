// By Mosaic Wedding Budget Calculator — Cost Model v2
// Recalibrated 2026-07 from 2025–2026 market research; every coefficient is
// sourced and explained in config/costModel.sources.md.
//
// Model semantics: estimates are "full-boat" — every included line item priced
// at the selected tier's typical market rate. Published market averages (The
// Knot: $34K national) include couples who skip categories, so they sit ~8–12%
// below a full-boat estimate at the same guest count. Users can exclude
// optional categories (excludedCategories) to personalize the estimate.
//
// v2 additions: 8 named metros (NYC, SF Bay, Chicago, Boston, Seattle, Miami,
// DFW, Atlanta), micro-wedding taper (<40 guests), volume pricing (>200),
// inflation to the wedding year, venue-type and bar-style inputs, per-category
// line exclusions, per-market ranges, and a seasonal×day-of-week cap.
//
// Validation anchors (all enforced in __tests__/costModel.test.ts):
//   100 guests / moderate / los-angeles   ≈ $50,000–$55,000
//   150 guests / moderate / new-york-city ≈ $88,000–$100,000
//    20 guests / moderate / los-angeles   ≈ $18,000–$22,500 (micro taper)
//   300 guests / moderate / los-angeles   ≈ $105,000–$118,000 (volume pricing)

export type Tier = "budget" | "moderate" | "luxury";
export type Location =
  | "los-angeles"
  | "santa-barbara"
  | "orange-county"
  | "san-diego"
  | "palm-springs"
  | "socal-suburbs"
  | "washington-dc"
  | "maryland-montgomery"
  | "northern-virginia"
  | "new-york-city"
  | "sf-bay-area"
  | "chicago"
  | "boston"
  | "seattle"
  | "miami"
  | "dallas-fort-worth"
  | "atlanta"
  | "other-major-metro"
  | "us-average";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun, 6=Sat
export type VenueType = "standard" | "all-inclusive" | "raw-space";
export type BarStyle = "none" | "beer-wine" | "standard" | "premium";

export interface CalcOptions {
  weddingYear?: number;          // calendar year; prices escalate from data vintage
  venueType?: VenueType;         // default "standard"
  barStyle?: BarStyle;           // default "standard"
  excludedCategories?: string[]; // names from OPTIONAL_CATEGORIES to leave out
}

export interface CategoryResult {
  name: string;
  subtotal: number;   // what this line would cost (even when excluded)
  isFnB: boolean;
  included: boolean;  // false when excluded via opts.excludedCategories
}

export interface BudgetResult {
  categories: CategoryResult[];
  fnbServiceAmount: number;
  subtotalBeforeContingency: number;
  contingencyRate: number;
  contingencyAmount: number;
  total: number;
  rangeLow: number;
  rangeHigh: number;
  guests: number;
  location: Location;
  tier: Tier;
  // Timing adjustments
  month: number | null;
  dayOfWeek: DayOfWeek | null;
  seasonalMult: number;
  seasonalAdjustmentAmount: number; // signed $ vs annual-average pricing
  dowAdjustmentAmount: number;      // negative = savings vs Saturday baseline
  seasonNote: string | null;
  dowNote: string | null;
}

// ─── Category cost tables ─────────────────────────────────────────────────────
// National (us-average) baseline. Fixed + per-guest per tier, plus sensitivity
// weights (0–1) for how fully the metro premium, seasonal demand curve, and
// day-of-week discount apply to this vendor class.
interface TierValues {
  budget: number;
  moderate: number;
  luxury: number;
}

export interface CategoryDef {
  name: string;
  fixed: TierValues;
  perGuest: TierValues;
  isFnB: boolean;
  fnbTaxOnly?: boolean;      // cake: sales tax + cutting fee, no 22% service charge
  locationSensitivity: number;
  seasonalSensitivity: number;
  dowSensitivity: number;
  volumeTaper?: boolean;     // per-guest rate discounts above 200 guests
  luxuryServiceBump?: boolean; // luxury-tier service premiums track metros harder
  isHouseholdStationery?: boolean;
}

const T = (budget: number, moderate: number, luxury: number): TierValues => ({
  budget,
  moderate,
  luxury,
});

export const categories: CategoryDef[] = [
  // Venue = site fee only (catering broken out); scales with capacity.
  { name: "Venue",                 fixed: T(1400, 2400, 5200), perGuest: T(18, 32, 62),
    isFnB: false, locationSensitivity: 1.0,  seasonalSensitivity: 1.0,  dowSensitivity: 1.0 },
  // $80/pp national average; buffet ~$40–65, plated $90–150; volume breaks at 150+.
  { name: "Catering",              fixed: T(250, 300, 700),    perGuest: T(44, 76, 118),
    isFnB: true,  locationSensitivity: 0.8,  seasonalSensitivity: 0.25, dowSensitivity: 0.15,
    volumeTaper: true },
  // Per-guest rate set by barStyle (see barRates); this row is the "standard" default.
  { name: "Bar",                   fixed: T(100, 150, 300),    perGuest: T(19, 34, 56),
    isFnB: true,  locationSensitivity: 0.8,  seasonalSensitivity: 0.15, dowSensitivity: 0.15,
    volumeTaper: true },
  { name: "Photography",           fixed: T(1400, 2100, 4400), perGuest: T(3, 6, 10),
    isFnB: false, locationSensitivity: 0.45, seasonalSensitivity: 0.45, dowSensitivity: 0.2,
    luxuryServiceBump: true },
  { name: "Videography",           fixed: T(900, 1500, 3300),  perGuest: T(1, 3, 6),
    isFnB: false, locationSensitivity: 0.45, seasonalSensitivity: 0.45, dowSensitivity: 0.2,
    luxuryServiceBump: true },
  { name: "Florals",               fixed: T(500, 800, 2200),   perGuest: T(7, 16, 42),
    isFnB: false, locationSensitivity: 0.6,  seasonalSensitivity: 0.5,  dowSensitivity: 0.1 },
  // Budget = day-of; moderate = month-of; luxury = full-service.
  { name: "Planning/Coordination", fixed: T(1000, 1800, 6000), perGuest: T(0, 3, 8),
    isFnB: false, locationSensitivity: 0.6,  seasonalSensitivity: 0.15, dowSensitivity: 0,
    luxuryServiceBump: true },
  { name: "Attire (both)",         fixed: T(1200, 2700, 5500), perGuest: T(0, 0, 0),
    isFnB: false, locationSensitivity: 0.25, seasonalSensitivity: 0,    dowSensitivity: 0 },
  // DJ at budget/moderate; live band assumed at luxury.
  { name: "Music (DJ/band)",       fixed: T(900, 1400, 3600),  perGuest: T(0, 3, 6),
    isFnB: false, locationSensitivity: 0.5,  seasonalSensitivity: 0.5,  dowSensitivity: 0.8 },
  { name: "Rentals",               fixed: T(100, 180, 400),    perGuest: T(5, 13, 32),
    isFnB: false, locationSensitivity: 0.7,  seasonalSensitivity: 0.35, dowSensitivity: 0.4,
    volumeTaper: true },
  { name: "Decor",                 fixed: T(220, 420, 1400),   perGuest: T(2.5, 6.5, 18),
    isFnB: false, locationSensitivity: 0.5,  seasonalSensitivity: 0.3,  dowSensitivity: 0.1 },
  // Bakery cake: sales tax + cake-cutting allowance (in fixed), no venue service charge.
  { name: "Cake/Desserts",         fixed: T(250, 340, 550),    perGuest: T(3, 5.5, 10),
    isFnB: true,  fnbTaxOnly: true,
    locationSensitivity: 0.6,  seasonalSensitivity: 0.1,  dowSensitivity: 0.1,
    volumeTaper: true },
  { name: "Hair & Makeup",         fixed: T(350, 800, 1500),   perGuest: T(0, 0, 0),
    isFnB: false, locationSensitivity: 0.5,  seasonalSensitivity: 0.15, dowSensitivity: 0.1,
    luxuryServiceBump: true },
  { name: "Stationery",            fixed: T(50, 110, 250),     perGuest: T(5.5, 10, 22),
    isFnB: false, locationSensitivity: 0.2,  seasonalSensitivity: 0,    dowSensitivity: 0,
    isHouseholdStationery: true },
  { name: "Transportation",        fixed: T(150, 400, 1000),   perGuest: T(0, 2.5, 8),
    isFnB: false, locationSensitivity: 0.6,  seasonalSensitivity: 0.1,  dowSensitivity: 0.2 },
  { name: "Officiant",             fixed: T(230, 420, 750),    perGuest: T(0, 0, 0),
    isFnB: false, locationSensitivity: 0.4,  seasonalSensitivity: 0,    dowSensitivity: 0.1 },
  { name: "Favors",                fixed: T(0, 0, 0),          perGuest: T(2, 4, 8),
    isFnB: false, locationSensitivity: 0.2,  seasonalSensitivity: 0,    dowSensitivity: 0 },
];

// Categories a couple can exclude from their estimate (results-screen toggles).
export const OPTIONAL_CATEGORIES: readonly string[] = [
  "Videography",
  "Planning/Coordination",
  "Hair & Makeup",
  "Decor",
  "Transportation",
  "Stationery",
  "Favors",
];

// ─── Bar styles ───────────────────────────────────────────────────────────────
// Open-bar per-guest rates: basic beer & wine $15–30, standard full bar $30–50,
// premium/top-shelf $50–90 (varies by tier's pour quality and hours).
export const barRates: Record<BarStyle, TierValues> = {
  "none":      T(0, 0, 0),
  "beer-wine": T(14, 18, 24),
  "standard":  T(19, 34, 56), // matches the Bar row default
  "premium":   T(40, 55, 75),
};

export const barStyleLabels: Record<BarStyle, string> = {
  "none":      "No alcohol",
  "beer-wine": "Beer & wine",
  "standard":  "Full open bar",
  "premium":   "Top-shelf bar",
};

// ─── Venue types ──────────────────────────────────────────────────────────────
// All-inclusive venues bundle rentals (74% of venues) and in-house catering
// overhead; raw spaces cost less to rent but push rentals/kitchen/logistics up.
interface VenueTypeAdjustment {
  fixedMult?: number; // applies to the category's fixed cost only
  allMult?: number;   // applies to the whole category line
}

export const venueTypeAdjustments: Record<VenueType, Record<string, VenueTypeAdjustment>> = {
  "standard": {},
  "all-inclusive": {
    "Venue":    { fixedMult: 1.15 },
    "Rentals":  { allMult: 0.35 },
    "Decor":    { allMult: 0.8 },
    "Catering": { fixedMult: 0.5 },
  },
  "raw-space": {
    "Venue":          { allMult: 0.7 },
    "Rentals":        { allMult: 1.6 },
    "Catering":       { fixedMult: 1.3 },
    "Transportation": { allMult: 1.2 },
  },
};

export const venueTypeLabels: Record<VenueType, string> = {
  "standard":      "Classic venue",
  "all-inclusive": "All-inclusive venue",
  "raw-space":     "Raw space / DIY",
};

// ─── Location multipliers (venue/F&B axis) ────────────────────────────────────
// Calibrated to metro spend data (see sources): LA $48K avg; NYC $75K avg
// ($99K@150 Zola); SF $84.6K@150; Chicago city $81K@150 / suburbs $30–55K;
// Boston $43–52K@100–150 + full-boat; Seattle $53K metro avg; Miami $45–60K;
// DFW/Atlanta near national. Services feel this scaled by locationSensitivity.
export const locationMultipliers: Record<Location, number> = {
  "los-angeles":       1.30,
  "santa-barbara":     1.45,
  "orange-county":     1.22,
  "san-diego":         1.12,
  "palm-springs":      1.14,
  "socal-suburbs":     0.98,
  "washington-dc":     1.34,
  "maryland-montgomery": 1.20,
  "northern-virginia": 1.22,
  "new-york-city":     1.75,
  "sf-bay-area":       1.67,
  "chicago":           1.28,
  "boston":            1.30,
  "seattle":           1.18,
  "miami":             1.18,
  "dallas-fort-worth": 0.98,
  "atlanta":           0.95,
  "other-major-metro": 1.25, // mid-tier fallback for unlisted big metros
  "us-average":        1.00,
};

export const locationLabels: Record<Location, string> = {
  "los-angeles":       "Los Angeles",
  "santa-barbara":     "Santa Barbara / Malibu",
  "orange-county":     "Orange County",
  "san-diego":         "San Diego",
  "palm-springs":      "Palm Springs",
  "socal-suburbs":     "SoCal Suburbs",
  "washington-dc":       "Washington, DC",
  "maryland-montgomery": "Montgomery County, MD",
  "northern-virginia":   "Northern Virginia",
  "new-york-city":     "New York City",
  "sf-bay-area":       "SF Bay Area",
  "chicago":           "Chicago",
  "boston":            "Boston",
  "seattle":           "Seattle",
  "miami":             "Miami / South Florida",
  "dallas-fort-worth": "Dallas–Fort Worth",
  "atlanta":           "Atlanta",
  "other-major-metro": "Other US Metro",
  "us-average":        "US Average",
};

// ─── F&B service charge + sales tax factor, by market ─────────────────────────
// Mandatory service charge (18–24%) compounded with the local prepared-food
// tax: Chicago 11.25–11.75%, Seattle 10.35%, DC 10%, CA 7.75–9.5%, NYC 8.875%,
// Atlanta ~8.9%, TX 8.25%, Boston/Miami 7%, MD 6%. National ~20% × ~7%.
export const fnbFactors: Record<Location, number> = {
  "los-angeles":       1.34,
  "santa-barbara":     1.34,
  "orange-county":     1.32,
  "san-diego":         1.32,
  "palm-springs":      1.33,
  "socal-suburbs":     1.32,
  "washington-dc":     1.34,
  "maryland-montgomery": 1.29,
  "northern-virginia": 1.32,
  "new-york-city":     1.36,
  "sf-bay-area":       1.36, // 8.63% tax + SF employer-mandate surcharges
  "chicago":           1.36,
  "boston":            1.30,
  "seattle":           1.35,
  "miami":             1.30,
  "dallas-fort-worth": 1.31,
  "atlanta":           1.32,
  "other-major-metro": 1.32,
  "us-average":        1.28,
};

// ─── Seasonal multipliers (venue-axis demand curves) ─────────────────────────
// Index 0 = January … 11 = December; how venue-class pricing moves vs the
// location's own annual average. Other categories scale by seasonalSensitivity.
export const seasonalMultipliers: Record<Location, number[]> = {
  "los-angeles": [
  // Jan    Feb    Mar    Apr    May    Jun    Jul    Aug    Sep    Oct    Nov    Dec
    0.80,  0.84,  0.93,  1.00,  1.08,  0.98,  0.88,  0.90,  1.08,  1.16,  1.12,  0.92,
  ],
  "santa-barbara": [
    0.78,  0.80,  0.90,  1.00,  1.12,  0.94,  0.92,  0.90,  1.10,  1.18,  1.12,  0.87,
  ],
  "orange-county": [
    0.82,  0.86,  0.94,  1.00,  1.07,  0.97,  0.89,  0.91,  1.05,  1.14,  1.10,  0.93,
  ],
  "san-diego": [
    0.88,  0.90,  0.96,  1.02,  1.06,  0.97,  1.00,  1.03,  1.08,  1.10,  1.05,  0.92,
  ],
  "palm-springs": [
  // Inverted desert-winter market; Jun–Sep venues discount 30–50%
    1.14,  1.18,  1.20,  1.10,  0.88,  0.65,  0.58,  0.58,  0.70,  1.02,  1.14,  1.10,
  ],
  "socal-suburbs": [
    0.84,  0.87,  0.94,  1.00,  1.06,  0.97,  0.87,  0.87,  1.02,  1.12,  1.08,  0.92,
  ],
  "washington-dc": [
    0.82,  0.84,  0.95,  1.12,  1.13,  1.05,  0.90,  0.89,  1.15,  1.18,  0.97,  0.84,
  ],
  "maryland-montgomery": [
    0.82,  0.84,  0.92,  1.10,  1.15,  1.09,  0.92,  0.91,  1.14,  1.17,  0.97,  0.87,
  ],
  "northern-virginia": [
    0.80,  0.81,  0.90,  1.08,  1.13,  1.05,  0.91,  0.91,  1.18,  1.21,  0.98,  0.83,
  ],
  "new-york-city": [
  // Jun + Sep/Oct peaks; deep winter valley
    0.78,  0.80,  0.90,  1.02,  1.10,  1.14,  0.94,  0.94,  1.14,  1.15,  0.94,  0.84,
  ],
  "sf-bay-area": [
  // Sep–Oct dry-season peak; June-gloom-lite on the coast
    0.80,  0.82,  0.90,  1.00,  1.08,  1.05,  0.95,  1.00,  1.15,  1.15,  0.93,  0.84,
  ],
  "chicago": [
  // Jun–Sep season; hard winter valley
    0.75,  0.77,  0.88,  1.00,  1.10,  1.15,  1.05,  1.05,  1.15,  1.10,  0.90,  0.82,
  ],
  "boston": [
  // Sep–Oct foliage peak, strong Jun; hard winter valley
    0.75,  0.77,  0.87,  1.00,  1.10,  1.12,  1.00,  1.00,  1.16,  1.16,  0.92,  0.82,
  ],
  "seattle": [
  // Sharp Jul–Aug dry-season peak; long wet-season valley
    0.78,  0.80,  0.86,  0.95,  1.05,  1.12,  1.20,  1.20,  1.12,  0.92,  0.80,  0.78,
  ],
  "miami": [
  // Inverted-ish: Nov–Apr peak; Jun–Sep heat + hurricane-season trough
    1.12,  1.14,  1.12,  1.08,  0.95,  0.78,  0.75,  0.72,  0.72,  0.85,  1.08,  1.12,
  ],
  "dallas-fort-worth": [
  // Apr–May + Oct–Nov twin peaks; hot-summer dip
    0.85,  0.88,  1.00,  1.12,  1.12,  1.00,  0.82,  0.82,  1.02,  1.12,  1.10,  0.90,
  ],
  "atlanta": [
  // Spring + fall peaks; humid-summer dip; mild winter
    0.82,  0.85,  0.98,  1.12,  1.12,  1.00,  0.85,  0.85,  1.10,  1.14,  1.05,  0.88,
  ],
  "other-major-metro": [
    0.78,  0.81,  0.90,  1.02,  1.10,  1.14,  0.95,  0.95,  1.13,  1.14,  0.94,  0.84,
  ],
  "us-average": [
    0.80,  0.83,  0.92,  1.00,  1.08,  1.10,  0.92,  0.93,  1.12,  1.12,  0.95,  0.86,
  ],
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Day-of-week multipliers (venue-axis) ─────────────────────────────────────
export const dowBaseMultipliers: Record<number, number> = {
  0: 0.80, // Sunday   (−20% vs Saturday)
  1: 0.65, // Monday   (−35%)
  2: 0.65, // Tuesday  (−35%)
  3: 0.65, // Wednesday(−35%)
  4: 0.68, // Thursday (−32%)
  5: 0.85, // Friday   (−15%)
  6: 1.00, // Saturday — peak baseline
};

export const dowDayLabels: Record<number, string> = {
  0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
  4: "Thursday", 5: "Friday", 6: "Saturday",
};

// ─── Scale effects ────────────────────────────────────────────────────────────
// Micro-weddings (≤40 guests) buy packages/scaled-down services, not 17
// full-scale vendors: fixed costs taper to 52% at 20 guests (LA elopement/
// micro packages + venue land real 20-guest weddings near $18–22K, not $27K).
function microTaper(guests: number): number {
  return 0.52 + 0.48 * Math.min(Math.max(guests, 0), 40) / 40;
}

// Caterers/rental houses give volume pricing at scale: per-guest rates on
// volumeTaper categories slide to −10% by 300 guests.
function volumeFactor(guests: number): number {
  return guests <= 200 ? 1 : 1 - 0.10 * Math.min(guests - 200, 100) / 100;
}

// ─── Inflation ────────────────────────────────────────────────────────────────
// Coefficients reflect mid-2025 pricing; wedding vendors escalate ~3.5%/yr.
// Estimates for future wedding years compound from the vintage, capped at 3yrs.
export const MODEL_VINTAGE = 2025.5;
const ANNUAL_ESCALATION = 0.035;

// ─── Contingency & range ──────────────────────────────────────────────────────
// 9% contingency (Zola: hidden costs average ~9% of spend). Range is
// asymmetric (most couples end up over, average overrun ~31%) and wider for
// the heterogeneous fallback markets where the point estimate is least certain.
const CONTINGENCY_RATE = 0.09;
const DEFAULT_RANGE = { low: 0.92, high: 1.22 };
const FALLBACK_RANGE = { low: 0.88, high: 1.30 };
const FALLBACK_LOCATIONS = new Set<Location>(["other-major-metro", "us-average"]);

// Combined seasonal × day-of-week venue-axis swing is capped so stacked
// discounts/premiums can't compound past what vendors actually quote.
const TIMING_FLOOR = 0.55;
const TIMING_CEIL = 1.25;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function seasonNoteFor(location: Location, month: number): string | null {
  const mult = seasonalMultipliers[location][month];
  const monthName = MONTH_NAMES[month];
  const locLabel = locationLabels[location];
  const pct = Math.round(Math.abs(mult - 1) * 100);

  if (mult >= 1.10) return `${monthName} is peak season in ${locLabel} — venues run ~${pct}% above the annual average and dates book 12+ months out. Book early.`;
  if (mult >= 1.04) return `${monthName} is a popular month in ${locLabel} — expect moderate seasonal demand.`;
  if (mult <= 0.70) return `${monthName} is very off-peak in ${locLabel} — venues discount heavily (~${pct}% below average). Great time to negotiate.`;
  if (mult <= 0.90) return `${monthName} is off-peak in ${locLabel} — venues and vendors are more negotiable (~${pct}% below the annual average).`;
  return null;
}

function dowNoteFor(dayOfWeek: DayOfWeek): string | null {
  const base = dowBaseMultipliers[dayOfWeek];
  const label = dowDayLabels[dayOfWeek];
  if (base === 1.00) return null;
  const pct = Math.round((1 - base) * 100);
  if (dayOfWeek === 5) return `Friday weddings typically save ${pct}% on venue and entertainment vs. Saturday.`;
  if (dayOfWeek === 0) return `Sunday weddings typically save ${pct}% on venue and entertainment vs. Saturday.`;
  return `${label} weddings can save ${pct}%+ on venue and entertainment — most vendors heavily discount non-weekend days.`;
}

interface PricedLines {
  lines: Array<{ amount: number; included: boolean }>;
  subtotal: number;
  fnbServiceAmount: number;
}

function computeSubtotals(
  guests: number,
  location: Location,
  tier: Tier,
  seasonMult: number,
  dowBase: number,
  opts: Required<Pick<CalcOptions, "venueType" | "barStyle">> & {
    excluded: Set<string>;
    inflation: number;
  }
): PricedLines {
  const locMult = locationMultipliers[location];
  const fnb = fnbFactors[location];
  const fnbTax = 1 + (fnb - 1) * 0.35; // tax share of the combined factor
  const taper = microTaper(guests);
  const volume = volumeFactor(guests);
  const typeAdj = venueTypeAdjustments[opts.venueType];

  const lines: Array<{ amount: number; included: boolean }> = [];
  let subtotal = 0;
  let fnbServiceAmount = 0;

  for (const cat of categories) {
    const adj = typeAdj[cat.name] ?? {};
    const guestCount = cat.isHouseholdStationery ? guests * 0.5 : guests;

    const fixed = cat.fixed[tier] * taper * (adj.fixedMult ?? 1);
    let rate = cat.name === "Bar" ? barRates[opts.barStyle][tier] : cat.perGuest[tier];
    if (cat.volumeTaper) rate *= volume;

    let amount = fixed + rate * guestCount;
    if (adj.allMult !== undefined) amount *= adj.allMult;
    if (cat.name === "Bar" && opts.barStyle === "none") amount = 0;

    const factor = cat.isFnB ? (cat.fnbTaxOnly ? fnbTax : fnb) : 1;
    amount *= factor;

    let locSens = cat.locationSensitivity;
    if (cat.luxuryServiceBump && tier === "luxury") locSens = Math.max(locSens, 0.7);
    amount *= 1 + (locMult - 1) * locSens;

    const timing = Math.min(
      Math.max(
        (1 + (seasonMult - 1) * cat.seasonalSensitivity) *
          (1 + (dowBase - 1) * cat.dowSensitivity),
        TIMING_FLOOR
      ),
      TIMING_CEIL
    );
    amount *= timing * opts.inflation;

    const included = !opts.excluded.has(cat.name);
    if (included) {
      subtotal += amount;
      if (cat.isFnB && amount > 0) fnbServiceAmount += amount * (1 - 1 / factor);
    }
    lines.push({ amount, included });
  }
  return { lines, subtotal, fnbServiceAmount };
}

// ─── Main calculation ─────────────────────────────────────────────────────────
export function calculateWeddingBudget(
  guests: number,
  location: Location,
  tier: Tier,
  month?: number,        // 0–11; omit for annual-average estimate
  dayOfWeek?: DayOfWeek, // 0=Sun, 6=Sat; omit for Saturday baseline
  options?: CalcOptions
): BudgetResult {
  const seasonMult = month !== undefined ? seasonalMultipliers[location][month] : 1.0;
  const dowBase = dayOfWeek !== undefined ? dowBaseMultipliers[dayOfWeek] : 1.0;

  const years = Math.min(
    Math.max((options?.weddingYear ?? MODEL_VINTAGE) - MODEL_VINTAGE, 0),
    3
  );
  const computeOpts = {
    venueType: options?.venueType ?? ("standard" as VenueType),
    barStyle: options?.barStyle ?? ("standard" as BarStyle),
    excluded: new Set(options?.excludedCategories ?? []),
    inflation: Math.pow(1 + ANNUAL_ESCALATION, years),
  };

  const priced = computeSubtotals(guests, location, tier, seasonMult, dowBase, computeOpts);

  const categoryResults: CategoryResult[] = categories.map((cat, i) => ({
    name: cat.name,
    subtotal: priced.lines[i].amount,
    isFnB: cat.isFnB,
    included: priced.lines[i].included,
  }));

  const subtotalBeforeContingency = priced.subtotal;
  const contingencyAmount = subtotalBeforeContingency * CONTINGENCY_RATE;
  const total = subtotalBeforeContingency + contingencyAmount;

  const withContingency = (subtotal: number) => subtotal * (1 + CONTINGENCY_RATE);

  const dowAdjustmentAmount =
    dowBase !== 1.0
      ? total -
        withContingency(
          computeSubtotals(guests, location, tier, seasonMult, 1.0, computeOpts).subtotal
        )
      : 0;

  const seasonalAdjustmentAmount =
    seasonMult !== 1.0
      ? total -
        withContingency(
          computeSubtotals(guests, location, tier, 1.0, dowBase, computeOpts).subtotal
        )
      : 0;

  const range = FALLBACK_LOCATIONS.has(location) ? FALLBACK_RANGE : DEFAULT_RANGE;

  return {
    categories: categoryResults,
    fnbServiceAmount: priced.fnbServiceAmount,
    subtotalBeforeContingency,
    contingencyRate: CONTINGENCY_RATE,
    contingencyAmount,
    total,
    rangeLow:  total * range.low,
    rangeHigh: total * range.high,
    guests,
    location,
    tier,
    month:     month     !== undefined ? month     : null,
    dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : null,
    seasonalMult: seasonMult,
    seasonalAdjustmentAmount,
    dowAdjustmentAmount,
    seasonNote: month     !== undefined ? seasonNoteFor(location, month) : null,
    dowNote:    dayOfWeek !== undefined ? dowNoteFor(dayOfWeek)          : null,
  };
}
