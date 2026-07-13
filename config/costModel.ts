// By Mosaic Wedding Budget Calculator — Cost Model
// Fully recalibrated 2026-07 from 2025–2026 market research; every coefficient
// is sourced and explained in config/costModel.sources.md.
//
// Model semantics: estimates are "full-boat" — all 17 line items purchased at
// the selected tier's typical market price. Published market averages (The
// Knot: $34K national, $48K LA) include couples who skip categories such as
// videography or planning, so they sit ~8–12% below a full-boat estimate at
// the same guest count. Line items here match real median vendor pricing.
//
// Validation anchors (moderate tier, Saturday, annual average):
//   100 guests / moderate / los-angeles  ≈ $50,000–$55,000
//   150 guests / moderate / los-angeles  ≈ $65,000–$72,000
//   100 guests / moderate / us-average   ≈ $40,000–$45,000
//    75 guests / budget   / socal-suburbs ≈ $18,000–$23,000
//   150 guests / luxury   / santa-barbara ≈ $130,000–$160,000

export type Tier = "budget" | "moderate" | "luxury";
export type Location =
  | "los-angeles"
  | "santa-barbara"
  | "orange-county"
  | "san-diego"
  | "palm-springs"
  | "socal-suburbs"
  | "other-major-metro"
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
  seasonalAdjustmentAmount: number; // signed $ vs annual-average pricing
  dowAdjustmentAmount: number;      // negative = savings vs Saturday baseline
  seasonNote: string | null;
  dowNote: string | null;
}

// ─── Category cost tables ─────────────────────────────────────────────────────
// National (us-average) baseline. Each category has a fixed cost plus a
// per-guest cost for each tier, and three sensitivity weights (0–1):
//   locationSensitivity — how fully the metro premium applies. Venue/F&B track
//     the local market ~1:1; service vendors (photo, attire) vary far less
//     between metros (LA photographers average only ~6% above national).
//   seasonalSensitivity — how much peak/off-peak demand moves this vendor's
//     price. Venues swing hardest; stationery not at all.
//   dowSensitivity — how much of the Fri/Sun/weekday discount applies.
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
  locationSensitivity: number;
  seasonalSensitivity: number;
  dowSensitivity: number;
  isHouseholdStationery?: boolean; // per-guest applies to ~1 invite per 2 guests
}

const T = (budget: number, moderate: number, luxury: number): TierValues => ({
  budget,
  moderate,
  luxury,
});

export const categories: CategoryDef[] = [
  // Venue = ceremony + reception site fee only (catering broken out below).
  // National venue-only averages $3K–$11K; site fees scale with capacity.
  { name: "Venue",                 fixed: T(1400, 2400, 5200), perGuest: T(18, 32, 62),
    isFnB: false, locationSensitivity: 1.0,  seasonalSensitivity: 1.0,  dowSensitivity: 1.0 },
  // $80/pp national average (range $62–$123); buffet ~$40–65, plated $90–150.
  { name: "Catering",              fixed: T(250, 300, 700),    perGuest: T(44, 76, 118),
    isFnB: true,  locationSensitivity: 0.8,  seasonalSensitivity: 0.25, dowSensitivity: 0.15 },
  // Open bar $15–30/pp basic, $30–50 standard, $50–90 premium.
  { name: "Bar",                   fixed: T(100, 150, 300),    perGuest: T(19, 34, 56),
    isFnB: true,  locationSensitivity: 0.8,  seasonalSensitivity: 0.15, dowSensitivity: 0.15 },
  // $3,000 national average; hours scale mildly with guest count.
  { name: "Photography",           fixed: T(1400, 2100, 4400), perGuest: T(3, 6, 10),
    isFnB: false, locationSensitivity: 0.45, seasonalSensitivity: 0.45, dowSensitivity: 0.2 },
  // $2,300 national average (The Knot 2025).
  { name: "Videography",           fixed: T(900, 1500, 3300),  perGuest: T(1, 3, 6),
    isFnB: false, locationSensitivity: 0.45, seasonalSensitivity: 0.45, dowSensitivity: 0.2 },
  // $2,800 national average; centerpieces scale with table count.
  { name: "Florals",               fixed: T(500, 800, 2200),   perGuest: T(7, 16, 42),
    isFnB: false, locationSensitivity: 0.6,  seasonalSensitivity: 0.5,  dowSensitivity: 0.1 },
  // Budget = day-of ($1,200–2,500); moderate = month-of ($1,500–4,000);
  // luxury = full-service ($5,500 national, $7–12K major metros).
  { name: "Planning/Coordination", fixed: T(1000, 1800, 6000), perGuest: T(0, 3, 8),
    isFnB: false, locationSensitivity: 0.6,  seasonalSensitivity: 0.15, dowSensitivity: 0 },
  // Dress $2,100 avg + alterations $300–600 + suit ($200–400 rental → $1,200 new).
  { name: "Attire (both)",         fixed: T(1200, 2700, 5500), perGuest: T(0, 0, 0),
    isFnB: false, locationSensitivity: 0.25, seasonalSensitivity: 0,    dowSensitivity: 0 },
  // DJ $1,800 avg; live band $4,500 avg ($4–10K) → luxury assumes band.
  { name: "Music (DJ/band)",       fixed: T(900, 1400, 3600),  perGuest: T(0, 3, 6),
    isFnB: false, locationSensitivity: 0.5,  seasonalSensitivity: 0.5,  dowSensitivity: 0.8 },
  // Basic rentals $425–$1,000; full place settings $12–20/guest.
  { name: "Rentals",               fixed: T(100, 180, 400),    perGuest: T(5, 13, 32),
    isFnB: false, locationSensitivity: 0.7,  seasonalSensitivity: 0.35, dowSensitivity: 0.4 },
  // Non-floral decor + lighting: uplighting from ~$500, layered $1–2K+.
  { name: "Decor",                 fixed: T(220, 420, 1400),   perGuest: T(2.5, 6.5, 18),
    isFnB: false, locationSensitivity: 0.5,  seasonalSensitivity: 0.3,  dowSensitivity: 0.1 },
  // $917 national average; per-slice pricing $4.50–$8.
  { name: "Cake/Desserts",         fixed: T(100, 190, 400),    perGuest: T(3, 5.5, 10),
    isFnB: true,  locationSensitivity: 0.6,  seasonalSensitivity: 0.1,  dowSensitivity: 0.1 },
  // Bride ~$300 + trial; with party average $982.
  { name: "Hair & Makeup",         fixed: T(350, 800, 1500),   perGuest: T(0, 0, 0),
    isFnB: false, locationSensitivity: 0.5,  seasonalSensitivity: 0.15, dowSensitivity: 0.1 },
  // Full suite $5–8 per guest ($500–800 per 100); one invite per ~2 guests.
  { name: "Stationery",            fixed: T(50, 110, 250),     perGuest: T(5.5, 10, 22),
    isFnB: false, locationSensitivity: 0.2,  seasonalSensitivity: 0,    dowSensitivity: 0,
    isHouseholdStationery: true },
  // $500–$1,500 typical; luxury adds guest shuttles (per-guest component).
  { name: "Transportation",        fixed: T(150, 400, 1000),   perGuest: T(0, 2.5, 8),
    isFnB: false, locationSensitivity: 0.6,  seasonalSensitivity: 0.1,  dowSensitivity: 0.2 },
  // Professional officiant $300–$800; religious/donation lower.
  { name: "Officiant",             fixed: T(230, 420, 750),    perGuest: T(0, 0, 0),
    isFnB: false, locationSensitivity: 0.4,  seasonalSensitivity: 0,    dowSensitivity: 0.1 },
  // $200–$600 typical total → per-guest.
  { name: "Favors",                fixed: T(0, 0, 0),          perGuest: T(2, 4, 8),
    isFnB: false, locationSensitivity: 0.2,  seasonalSensitivity: 0,    dowSensitivity: 0 },
];

// ─── Location multipliers (venue/F&B axis) ────────────────────────────────────
// Calibrated so market totals match metro spend data (see sources):
// LA ≈ $48K avg / $29K@50 / $67K@150 / $83K@200; SF 150-guest ≈ $85K;
// San Diego avg ≈ $35–38K; OC ≈ $49–50K (at its higher typical guest counts);
// DC is a top-5 market; Montgomery Co./NoVA sit a notch below the District.
// Service vendors apply this premium scaled by their locationSensitivity.
export const locationMultipliers: Record<Location, number> = {
  "los-angeles":       1.30,
  "santa-barbara":     1.45,
  "orange-county":     1.22,
  "san-diego":         1.12,
  "palm-springs":      1.14,
  "socal-suburbs":     0.98,
  "other-major-metro": 1.50,
  "washington-dc":     1.34,
  "maryland-montgomery": 1.20,
  "northern-virginia": 1.22,
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

// ─── F&B service charge + sales tax factor, by market ─────────────────────────
// Mandatory service charge (18–24%, typically ~22% in major markets) compounded
// with the local prepared-food sales tax (service charges are taxable in most
// jurisdictions): CA 7.75–9.5%, DC 10% catering tax, MD 6%, VA ~10–11% with
// local meals tax, NYC 8.875%. National: ~20% service × ~7% tax.
export const fnbFactors: Record<Location, number> = {
  "los-angeles":       1.34,
  "santa-barbara":     1.34,
  "orange-county":     1.32,
  "san-diego":         1.32,
  "palm-springs":      1.33,
  "socal-suburbs":     1.32,
  "other-major-metro": 1.36,
  "washington-dc":     1.34,
  "maryland-montgomery": 1.29,
  "northern-virginia": 1.32,
  "us-average":        1.28,
};

// ─── Seasonal multipliers (venue-axis demand curves) ─────────────────────────
// Index 0 = January … 11 = December. Values express how venue-class pricing
// moves vs the location's own annual average; other categories feel the swing
// scaled by their seasonalSensitivity. Peak-month venue minimums run 30–50%
// above deep-winter in major markets (curve ratio ≈ 1.4–1.5 peak/trough).
//
// Shapes: national twin peaks (Sep/Oct is the single busiest stretch — Sep
// ~15% of all weddings — with May/Jun close behind; Jan/Feb are 2–3%);
// SoCal peaks Oct–Nov, dips in fire-risk/heat late summer; Palm Springs is
// INVERTED (Nov–Apr desert season, 100–115°F summers force 30–50% venue
// discounts); DC has cherry-blossom spring + stronger fall.
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
  // Mildest seasonality of the SoCal markets; beach venues hold summer demand
    0.88,  0.90,  0.96,  1.02,  1.06,  0.97,  1.00,  1.03,  1.08,  1.10,  1.05,  0.92,
  ],
  "palm-springs": [
  // Inverted: desert-winter escape market; Jun–Sep venues discount 30–50%
    1.14,  1.18,  1.20,  1.10,  0.88,  0.65,  0.58,  0.58,  0.70,  1.02,  1.14,  1.10,
  ],
  "socal-suburbs": [
  // Temecula wine country / Inland Empire: fall harvest peak, hot inland summer
    0.84,  0.87,  0.94,  1.00,  1.06,  0.97,  0.87,  0.87,  1.02,  1.12,  1.08,  0.92,
  ],
  "other-major-metro": [
  // NYC/SF/Chicago: Jun + Sep/Oct peaks; sharp winter valley
    0.78,  0.81,  0.90,  1.02,  1.10,  1.14,  0.95,  0.95,  1.13,  1.14,  0.94,  0.84,
  ],
  "washington-dc": [
  // Cherry-blossom Apr–May peak + stronger Sep–Oct fall; humid Jul–Aug dip
    0.82,  0.84,  0.95,  1.12,  1.13,  1.05,  0.90,  0.89,  1.15,  1.18,  0.97,  0.84,
  ],
  "maryland-montgomery": [
    0.82,  0.84,  0.92,  1.10,  1.15,  1.09,  0.92,  0.91,  1.14,  1.17,  0.97,  0.87,
  ],
  "northern-virginia": [
  // Loudoun wine country: sharp Sep–Oct harvest/foliage peak
    0.80,  0.81,  0.90,  1.08,  1.13,  1.05,  0.91,  0.91,  1.18,  1.21,  0.98,  0.83,
  ],
  "us-average": [
  // National: Sep/Oct peak, May/Jun secondary; Jan–Feb valley (2–3% of weddings)
    0.80,  0.83,  0.92,  1.00,  1.08,  1.10,  0.92,  0.93,  1.12,  1.12,  0.95,  0.86,
  ],
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Day-of-week multipliers (venue-axis) ─────────────────────────────────────
// Saturday = 1.00 baseline. Venue/vendor surveys: Fri and Sun run 15–25% below
// Saturday; Mon–Thu run 20–40% below. Categories feel the discount scaled by
// their dowSensitivity (venues fully; photographers barely).
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

// ─── Contingency & range ──────────────────────────────────────────────────────
// Zola 2026: hidden/unexpected costs average $3,314 ≈ 9% of spend; planner
// guidance is an 8–10% buffer. Range is asymmetric because overruns dominate:
// 74–78% of couples exceed their budget (average overrun ~31%), so the high
// end sits much further from the point estimate than the low end.
const CONTINGENCY_RATE = 0.09;
const RANGE_LOW_FACTOR = 0.92;
const RANGE_HIGH_FACTOR = 1.22;

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

// Core pricing pass. Seasonal and DoW venue-axis multipliers are blended per
// category through its sensitivity weights.
function computeSubtotals(
  guests: number,
  location: Location,
  tier: Tier,
  seasonMult: number,
  dowBase: number
): { lines: number[]; subtotal: number; fnbServiceAmount: number } {
  const locMult = locationMultipliers[location];
  const fnb = fnbFactors[location];

  const lines: number[] = [];
  let subtotal = 0;
  let fnbServiceAmount = 0;

  for (const cat of categories) {
    const guestCount = cat.isHouseholdStationery ? guests * 0.5 : guests;
    let amount = cat.fixed[tier] + cat.perGuest[tier] * guestCount;
    if (cat.isFnB) amount *= fnb;
    amount *= 1 + (locMult - 1) * cat.locationSensitivity;
    amount *= 1 + (seasonMult - 1) * cat.seasonalSensitivity;
    amount *= 1 + (dowBase - 1) * cat.dowSensitivity;

    if (cat.isFnB) fnbServiceAmount += amount * (1 - 1 / fnb);
    lines.push(amount);
    subtotal += amount;
  }
  return { lines, subtotal, fnbServiceAmount };
}

// ─── Main calculation ─────────────────────────────────────────────────────────
export function calculateWeddingBudget(
  guests: number,
  location: Location,
  tier: Tier,
  month?: number,       // 0–11; omit for annual-average estimate
  dayOfWeek?: DayOfWeek // 0=Sun, 6=Sat; omit for Saturday baseline
): BudgetResult {
  const seasonMult = month !== undefined ? seasonalMultipliers[location][month] : 1.0;
  const dowBase = dayOfWeek !== undefined ? dowBaseMultipliers[dayOfWeek] : 1.0;

  const priced = computeSubtotals(guests, location, tier, seasonMult, dowBase);

  const categoryResults: CategoryResult[] = categories.map((cat, i) => ({
    name: cat.name,
    subtotal: priced.lines[i],
    isFnB: cat.isFnB,
    perGuestRate: cat.perGuest[tier],
    fixedBase: cat.fixed[tier],
  }));

  const subtotalBeforeContingency = priced.subtotal;
  const contingencyAmount = subtotalBeforeContingency * CONTINGENCY_RATE;
  const total = subtotalBeforeContingency + contingencyAmount;

  const withContingency = (subtotal: number) => subtotal * (1 + CONTINGENCY_RATE);

  // Saturday-pricing comparison (same month) → day-of-week savings.
  const dowAdjustmentAmount =
    dowBase !== 1.0
      ? total - withContingency(computeSubtotals(guests, location, tier, seasonMult, 1.0).subtotal)
      : 0;

  // Annual-average comparison (same day of week) → seasonal premium/discount.
  const seasonalAdjustmentAmount =
    seasonMult !== 1.0
      ? total - withContingency(computeSubtotals(guests, location, tier, 1.0, dowBase).subtotal)
      : 0;

  return {
    categories: categoryResults,
    fnbServiceAmount: priced.fnbServiceAmount,
    subtotalBeforeContingency,
    contingencyRate: CONTINGENCY_RATE,
    contingencyAmount,
    total,
    rangeLow:  total * RANGE_LOW_FACTOR,
    rangeHigh: total * RANGE_HIGH_FACTOR,
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
