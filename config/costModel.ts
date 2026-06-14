// By Mosaic Wedding Budget Calculator — Cost Model
// All base coefficients calibrated for LA market (2024–2026 data)
// Venue fixedBase recalibrated 2026-06-04 per Kristina (By Mosaic):
// real LA venue spend for 100-guest moderate weddings is $9–10K, not $5–6K.
// Validation targets (no timing adjustments):
//   100 guests / moderate / los-angeles  ≈ $47,000–$51,000
//   150 guests / luxury  / santa-barbara ≈ $112,000–$122,000
//    75 guests / budget  / socal-suburbs ≈ $23,000–$27,000

export type Tier = "budget" | "moderate" | "luxury";
export type Location =
  | "los-angeles"
  | "santa-barbara"
  | "orange-county"
  | "san-diego"
  | "palm-springs"
  | "socal-suburbs"
  | "other-major-metro"
  // DC metro ("Other Metro" expansion) — calibrated 2026-06 from market research
  | "washington-dc"
  | "maryland-montgomery"
  | "northern-virginia"
  | "us-average";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun, 6=Sat

export interface CategoryResult {
  name: string;
  subtotal: number;
  isFnB: boolean;
  perGuestRate: number;
  fixedBase: number;
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
  dowAdjustmentAmount: number;   // negative = savings vs Saturday baseline
  seasonNote: string | null;
  dowNote: string | null;
}

// ─── Per-guest overrides by tier ─────────────────────────────────────────────
const perGuestByTier: Record<string, Record<Tier, number>> = {
  Catering:        { budget: 55,  moderate: 60,  luxury: 100 },
  Bar:             { budget: 20,  moderate: 24,  luxury: 42  },
  Rentals:         { budget: 14,  moderate: 18,  luxury: 32  },
  "Cake/Desserts": { budget: 5,   moderate: 6,   luxury: 12  },
  Stationery:      { budget: 3,   moderate: 4,   luxury: 7   },
  Favors:          { budget: 3,   moderate: 4,   luxury: 7   },
};

// ─── Tier multipliers ────────────────────────────────────────────────────────
export const tierMultipliers: Record<Tier, number> = {
  budget:   0.70,
  moderate: 1.00,
  luxury:   1.75,
};

// ─── Location multipliers ─────────────────────────────────────────────────────
export const locationMultipliers: Record<Location, number> = {
  "los-angeles":       1.26,
  "santa-barbara":     1.40,
  "orange-county":     1.20,
  "san-diego":         1.10,
  "palm-springs":      1.12,
  "socal-suburbs":     0.95,
  "other-major-metro": 1.40,
  // DC metro — highest-cost catering region in the US; DC layers a 10% catering
  // tax + steep venue F&B minimums (DC proper > LA, < NYC/SF). Affluent suburbs
  // (Montgomery County, Northern Virginia) sit a notch below the District.
  "washington-dc":       1.32,
  "maryland-montgomery": 1.22,
  "northern-virginia":   1.22,
  "us-average":        1.00,
};

export const locationLabels: Record<Location, string> = {
  "los-angeles":       "Los Angeles",
  "santa-barbara":     "Santa Barbara / Malibu",
  "orange-county":     "Orange County",
  "san-diego":         "San Diego",
  "palm-springs":      "Palm Springs",
  "socal-suburbs":     "SoCal Suburbs",
  "other-major-metro": "Other Major Metro",
  "washington-dc":       "Washington, DC",
  "maryland-montgomery": "Montgomery County, MD",
  "northern-virginia":   "Northern Virginia",
  "us-average":        "US Average",
};

// ─── Seasonal multipliers ─────────────────────────────────────────────────────
// Index 0 = January … 11 = December.
// Reflects booking demand curves sourced from The Knot Real Weddings Study
// (2024–2025), WeddingWire Cost of Wedding data, and SoCal venue pricing
// patterns. "1.00" = this location's own annual average; above/below shifts
// the whole estimate to reflect real seasonal demand pressure.
//
// Key patterns:
//  LA/OC/SoCal-Suburbs: Oct–Nov peak (perfect weather + highest demand),
//    Jan–Feb + Jul–Aug valley (heat, fire season concerns, slow demand).
//  Santa Barbara/Malibu: Oct is absolute peak; June gloom suppresses Jun;
//    late-summer fire risk creates a paradox where Oct is most demanded
//    AND most risky for outdoor events.
//  Palm Springs: INVERTED season — Nov–Mar peak (desert winter escape);
//    Jun–Sep near-zero outdoor demand (110°F+).
//  San Diego: mildest seasonality of any SoCal market; beach weddings
//    boost Jul–Aug slightly vs. other SoCal markets.
//  Other Major Metro (NYC/SF): Jun is the peak, not Oct.
//  DC metro (DC / Montgomery County / Northern Virginia): twin peaks — spring
//    (cherry blossoms / lush vines, Apr–May) and a stronger fall (Sep–Oct,
//    foliage + Loudoun wine-country harvest); humid Jul–Aug dip; winter valley.
//  US Average: May–Jun and Sep–Oct are twin peaks nationally.
export const seasonalMultipliers: Record<Location, number[]> = {
  "los-angeles": [
  // Jan    Feb    Mar    Apr    May    Jun    Jul    Aug    Sep    Oct    Nov    Dec
    0.82,  0.85,  0.93,  1.00,  1.08,  0.97,  0.87,  0.89,  1.05,  1.15,  1.12,  0.94,
  ],
  "santa-barbara": [
    0.78,  0.80,  0.90,  1.00,  1.12,  0.93,  0.90,  0.88,  1.10,  1.20,  1.15,  0.88,
  ],
  "orange-county": [
    0.84,  0.87,  0.95,  1.00,  1.07,  0.96,  0.88,  0.90,  1.03,  1.13,  1.10,  0.95,
  ],
  "san-diego": [
  // Mildest seasonality; beach venues boost summer slightly
    0.90,  0.92,  0.97,  1.02,  1.05,  0.95,  1.00,  1.03,  1.07,  1.08,  1.05,  0.93,
  ],
  "palm-springs": [
  // Inverted: winter escape market. Jun–Sep nearly dead (extreme heat).
    1.15,  1.18,  1.20,  1.10,  0.85,  0.62,  0.52,  0.52,  0.65,  1.00,  1.12,  1.10,
  ],
  "socal-suburbs": [
  // Temecula / Inland Empire: wine country peaks in fall, hot inland summers
    0.85,  0.88,  0.95,  1.00,  1.05,  0.97,  0.87,  0.87,  1.00,  1.10,  1.07,  0.93,
  ],
  "other-major-metro": [
  // NYC/SF: June peak (outdoor season); Oct strong; winter sharp valley
    0.80,  0.82,  0.90,  1.03,  1.12,  1.15,  0.95,  0.95,  1.12,  1.13,  0.93,  0.85,
  ],
  "washington-dc": [
  // Oct single peak (most popular month); spring cherry-blossom peak Apr–May;
  // humid Jul–Aug dip; deep Dec–Feb valley
    0.83,  0.85,  0.96,  1.12,  1.13,  1.06,  0.92,  0.90,  1.15,  1.18,  0.97,  0.85,
  ],
  "maryland-montgomery": [
  // Mid-Atlantic suburb: May spring peak, strong Sep–Oct fall, humid-summer dip
    0.82,  0.84,  0.92,  1.10,  1.16,  1.10,  0.93,  0.92,  1.15,  1.18,  0.97,  0.88,
  ],
  "northern-virginia": [
  // Loudoun wine country: sharp Sep–Oct harvest/foliage peak; Apr–May spring
    0.80,  0.81,  0.90,  1.08,  1.14,  1.05,  0.92,  0.92,  1.20,  1.22,  0.98,  0.83,
  ],
  "us-average": [
  // National: twin peaks May–Jun and Sep–Oct; Jan–Feb valley
    0.82,  0.85,  0.92,  1.00,  1.08,  1.10,  0.92,  0.93,  1.07,  1.10,  0.95,  0.88,
  ],
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Day-of-week multipliers ──────────────────────────────────────────────────
// Applied per-category using sensitivity weights (below).
// Saturday = 1.00 baseline. Discounts reflect real vendor pricing:
//  - Venues: 15–25% less for Fri, 20–30% less for Sun, 35–40% less for weekdays
//    (The Knot Vendor Pricing Survey 2024; WeddingWire Cost of Wedding 2025)
//  - DJs/bands: 15–20% less for non-Saturday
//  - Photographers: minimal DoW variance (flat day rate)
//  - Caterers: occasional minimum-spend reductions on off-peak days
export const dowBaseMultipliers: Record<number, number> = {
  0: 0.78, // Sunday  (−22 % vs Saturday baseline)
  1: 0.62, // Monday  (−38 %)
  2: 0.62, // Tuesday (−38 %)
  3: 0.62, // Wednesday (−38 %)
  4: 0.65, // Thursday (−35 %)
  5: 0.85, // Friday  (−15 %)
  6: 1.00, // Saturday — peak baseline
};

export const dowDayLabels: Record<number, string> = {
  0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
  4: "Thursday", 5: "Friday", 6: "Saturday",
};

// How much of the DoW base discount applies to each category (0–1).
// Venue and entertainment are DoW-sensitive; attire, planning, stationery are not.
const dowWeights: Record<string, number> = {
  "Venue":                 1.00,
  "Music (DJ/band)":       0.80,
  "Rentals":               0.50,
  "Catering":              0.20,
  "Bar":                   0.20,
  "Photography":           0.15,
  "Videography":           0.15,
  "Florals":               0.10,
  "Planning/Coordination": 0.00,
  "Attire (both)":         0.00,
  "Decor":                 0.10,
  "Cake/Desserts":         0.10,
  "Hair & Makeup":         0.15,
  "Stationery":            0.00,
  "Transportation":        0.25,
  "Officiant":             0.10,
  "Favors":                0.00,
};

// ─── Category definitions (moderate baseline, national) ──────────────────────
interface CategoryDef {
  name: string;
  fixedBase: number;
  perGuestModerate: number;
  isFnB: boolean;
  hasPerGuestOverride: boolean;
  isHouseholdStationery?: boolean;
}

export const categories: CategoryDef[] = [
  { name: "Venue",                fixedBase: 7200, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Catering",             fixedBase: 0,    perGuestModerate: 60, isFnB: true,  hasPerGuestOverride: true  },
  { name: "Bar",                  fixedBase: 200,  perGuestModerate: 24, isFnB: true,  hasPerGuestOverride: true  },
  { name: "Photography",          fixedBase: 1800, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Videography",          fixedBase: 1300, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Florals",              fixedBase: 900,  perGuestModerate: 15, isFnB: false, hasPerGuestOverride: false },
  { name: "Planning/Coordination",fixedBase: 1600, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Attire (both)",        fixedBase: 1800, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Music (DJ/band)",      fixedBase: 1200, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Rentals",              fixedBase: 250,  perGuestModerate: 18, isFnB: false, hasPerGuestOverride: true  },
  { name: "Decor",                fixedBase: 750,  perGuestModerate: 5,  isFnB: false, hasPerGuestOverride: false },
  { name: "Cake/Desserts",        fixedBase: 120,  perGuestModerate: 6,  isFnB: true,  hasPerGuestOverride: true  },
  { name: "Hair & Makeup",        fixedBase: 1600, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Stationery",           fixedBase: 180,  perGuestModerate: 4,  isFnB: false, hasPerGuestOverride: true,  isHouseholdStationery: true },
  { name: "Transportation",       fixedBase: 450,  perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Officiant",            fixedBase: 350,  perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Favors",               fixedBase: 0,    perGuestModerate: 4,  isFnB: false, hasPerGuestOverride: true  },
];

// ─── F&B service/tax factor ──────────────────────────────────────────────────
const FNB_FACTOR = 1.3;
const FNB_NAMES = new Set(["Catering", "Bar", "Cake/Desserts"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function seasonNoteFor(location: Location, month: number): string | null {
  const mult = seasonalMultipliers[location][month];
  const monthName = MONTH_NAMES[month];
  const locLabel = locationLabels[location];
  const pct = Math.round(Math.abs(mult - 1) * 100);

  if (mult >= 1.10) return `${monthName} is peak season in ${locLabel} — venues and vendors run ~${pct}% above the annual average. Book early.`;
  if (mult >= 1.04) return `${monthName} is a popular month in ${locLabel} — expect moderate seasonal demand.`;
  if (mult <= 0.70) return `${monthName} is very off-peak in ${locLabel} — significant savings available (~${pct}% below average). Great time to negotiate.`;
  if (mult <= 0.90) return `${monthName} is off-peak in ${locLabel} — vendors and venues are more negotiable (~${pct}% below the annual average).`;
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

// ─── Main calculation ─────────────────────────────────────────────────────────
export function calculateWeddingBudget(
  guests: number,
  location: Location,
  tier: Tier,
  month?: number,       // 0–11; omit for annual-average estimate
  dayOfWeek?: DayOfWeek // 0=Sun, 6=Sat; omit for Saturday baseline
): BudgetResult {
  const locationMult = locationMultipliers[location];
  const tierMult     = tierMultipliers[tier];
  const seasonMult   = month !== undefined ? seasonalMultipliers[location][month] : 1.0;
  const dowBase      = dayOfWeek !== undefined ? dowBaseMultipliers[dayOfWeek] : 1.0;

  let fnbPreFactor = 0;
  let saturdaySubtotal = 0; // what the subtotal would be at Saturday DoW prices
  const rawCategories: Array<{ cat: CategoryDef; subtotal: number }> = [];

  for (const cat of categories) {
    const guestCount = cat.isHouseholdStationery ? guests * 0.5 : guests;

    let baseSubtotal: number;
    if (cat.hasPerGuestOverride) {
      const pgRate = perGuestByTier[cat.name]?.[tier] ?? cat.perGuestModerate;
      baseSubtotal = cat.fixedBase * tierMult + pgRate * guestCount;
    } else {
      baseSubtotal = (cat.fixedBase + cat.perGuestModerate * guestCount) * tierMult;
    }

    // Apply DoW: effective multiplier blended by category sensitivity
    const weight = dowWeights[cat.name] ?? 0;
    const effectiveDoW = 1.0 + (dowBase - 1.0) * weight;
    const subtotal = baseSubtotal * effectiveDoW;
    // Track what Saturday pricing would have been (for savings calc)
    saturdaySubtotal += baseSubtotal;

    if (FNB_NAMES.has(cat.name)) fnbPreFactor += subtotal;
    rawCategories.push({ cat, subtotal });
  }

  // Apply F&B service/tax factor and location multiplier, then seasonal mult
  const categoryResults: CategoryResult[] = rawCategories.map(({ cat, subtotal }) => {
    const fnbAdjusted   = FNB_NAMES.has(cat.name) ? subtotal * FNB_FACTOR : subtotal;
    const withLocation  = fnbAdjusted * locationMult;
    const withSeasonal  = withLocation * seasonMult;
    const pgRate        = cat.hasPerGuestOverride
      ? (perGuestByTier[cat.name]?.[tier] ?? cat.perGuestModerate)
      : cat.perGuestModerate;
    return {
      name: cat.name,
      subtotal: withSeasonal,
      isFnB: cat.isFnB,
      perGuestRate: pgRate,
      fixedBase: cat.fixedBase,
    };
  });

  const fnbServiceAmount = fnbPreFactor * (FNB_FACTOR - 1) * locationMult * seasonMult;

  const subtotalBeforeContingency = categoryResults.reduce((s, c) => s + c.subtotal, 0);
  const contingencyRate   = 0.08;
  const contingencyAmount = subtotalBeforeContingency * contingencyRate;
  const total             = subtotalBeforeContingency + contingencyAmount;

  // DoW savings = difference between Saturday baseline and actual DoW, post-location+seasonal
  const saturdayTotal = saturdaySubtotal * locationMult * seasonMult * (1 + contingencyRate);
  // Also add F&B factor to saturday baseline for accurate comparison
  const satFnB = rawCategories
    .filter(({ cat }) => FNB_NAMES.has(cat.name))
    .reduce((s, { cat, subtotal: _ }) => {
      const pgRate = cat.hasPerGuestOverride ? (perGuestByTier[cat.name]?.[tier] ?? cat.perGuestModerate) : cat.perGuestModerate;
      const guestCount = cat.isHouseholdStationery ? guests * 0.5 : guests;
      const base = cat.hasPerGuestOverride
        ? cat.fixedBase * tierMult + pgRate * guestCount
        : (cat.fixedBase + cat.perGuestModerate * guestCount) * tierMult;
      return s + base;
    }, 0);
  const satTotal = (saturdaySubtotal * locationMult * seasonMult +
    satFnB * (FNB_FACTOR - 1) * locationMult * seasonMult) * (1 + contingencyRate);

  const dowAdjustmentAmount = total - satTotal; // negative = savings vs Saturday

  return {
    categories: categoryResults,
    fnbServiceAmount,
    subtotalBeforeContingency,
    contingencyRate,
    contingencyAmount,
    total,
    rangeLow:  total * 0.9,
    rangeHigh: total * 1.15,
    guests,
    location,
    tier,
    month:    month    !== undefined ? month    : null,
    dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : null,
    seasonalMult: seasonMult,
    dowAdjustmentAmount,
    seasonNote: month    !== undefined ? seasonNoteFor(location, month) : null,
    dowNote:    dayOfWeek !== undefined ? dowNoteFor(dayOfWeek)         : null,
  };
}
