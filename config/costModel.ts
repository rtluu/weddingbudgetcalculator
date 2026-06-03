// By Mosaic Wedding Budget Calculator — Cost Model
// All coefficients calibrated for LA market (2024–2025)
// Validation targets:
//   100 guests / moderate / los-angeles  ≈ $44,000–$47,000
//   150 guests / luxury  / santa-barbara ≈ $90,000–$115,000
//    75 guests / budget  / socal-suburbs ≈ $22,000–$27,000

export type Tier = "budget" | "moderate" | "luxury";
export type Location =
  | "los-angeles"
  | "santa-barbara"
  | "orange-county"
  | "san-diego"
  | "palm-springs"
  | "socal-suburbs"
  | "other-major-metro"
  | "us-average";

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
}

// ─── Per-guest overrides by tier ─────────────────────────────────────────────
// These 6 categories skip the tier multiplier on per-head spend; they have
// their own tier-specific rates baked in.
const perGuestByTier: Record<string, Record<Tier, number>> = {
  Catering:      { budget: 55,  moderate: 60,  luxury: 100 },
  Bar:           { budget: 20,  moderate: 24,  luxury: 42  },
  Rentals:       { budget: 14,  moderate: 18,  luxury: 32  },
  "Cake/Desserts": { budget: 5, moderate: 6,   luxury: 12  },
  Stationery:    { budget: 3,   moderate: 4,   luxury: 7   },
  Favors:        { budget: 3,   moderate: 4,   luxury: 7   },
};

// ─── Tier multipliers (applied to every non-override category) ────────────────
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
  "us-average":        1.00,
};

export const locationLabels: Record<Location, string> = {
  "los-angeles":       "Los Angeles",
  "santa-barbara":     "Santa Barbara",
  "orange-county":     "Orange County",
  "san-diego":         "San Diego",
  "palm-springs":      "Palm Springs",
  "socal-suburbs":     "SoCal Suburbs",
  "other-major-metro": "Other Major Metro",
  "us-average":        "US Average",
};

// ─── Category definitions (moderate baseline, national) ──────────────────────
interface CategoryDef {
  name: string;
  fixedBase: number;
  perGuestModerate: number; // used only when no perGuestByTier override
  isFnB: boolean;
  hasPerGuestOverride: boolean;
  isHouseholdStationery?: boolean; // per-guest applied to guests/2
}

export const categories: CategoryDef[] = [
  { name: "Venue",                fixedBase: 4500, perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
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
  { name: "Hair & Makeup",        fixedBase: 350,  perGuestModerate: 7,  isFnB: false, hasPerGuestOverride: false },
  { name: "Stationery",           fixedBase: 180,  perGuestModerate: 4,  isFnB: false, hasPerGuestOverride: true,  isHouseholdStationery: true },
  { name: "Transportation",       fixedBase: 450,  perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Officiant",            fixedBase: 350,  perGuestModerate: 0,  isFnB: false, hasPerGuestOverride: false },
  { name: "Favors",               fixedBase: 0,    perGuestModerate: 4,  isFnB: false, hasPerGuestOverride: true  },
];

// ─── F&B service/tax factor ──────────────────────────────────────────────────
const FNB_FACTOR = 1.3;
const FNB_NAMES = new Set(["Catering", "Bar", "Cake/Desserts"]);

// ─── Main calculation ─────────────────────────────────────────────────────────
export function calculateWeddingBudget(
  guests: number,
  location: Location,
  tier: Tier
): BudgetResult {
  const locationMult = locationMultipliers[location];
  const tierMult     = tierMultipliers[tier];

  let fnbPreFactor = 0;
  const rawCategories: Array<{ cat: CategoryDef; subtotal: number }> = [];

  for (const cat of categories) {
    const guestCount = cat.isHouseholdStationery ? guests * 0.5 : guests;

    let subtotal: number;
    if (cat.hasPerGuestOverride) {
      // Fixed base scales with tier; per-guest is tier-specific
      const pgRate = perGuestByTier[cat.name]?.[tier] ?? cat.perGuestModerate;
      subtotal = cat.fixedBase * tierMult + pgRate * guestCount;
    } else {
      // Entire line item (fixed + per-guest) scaled by tier multiplier
      subtotal = (cat.fixedBase + cat.perGuestModerate * guestCount) * tierMult;
    }

    // Accumulate F&B pre-factor total for service-fee line
    if (FNB_NAMES.has(cat.name)) {
      fnbPreFactor += subtotal;
    }

    rawCategories.push({ cat, subtotal });
  }

  // Apply F&B service/tax factor
  const categoryResults: CategoryResult[] = rawCategories.map(({ cat, subtotal }) => {
    const adjustedSubtotal = FNB_NAMES.has(cat.name) ? subtotal * FNB_FACTOR : subtotal;
    const pgRate = cat.hasPerGuestOverride
      ? (perGuestByTier[cat.name]?.[tier] ?? cat.perGuestModerate)
      : cat.perGuestModerate;
    return {
      name: cat.name,
      subtotal: adjustedSubtotal * locationMult,
      isFnB: cat.isFnB,
      perGuestRate: pgRate,
      fixedBase: cat.fixedBase,
    };
  });

  const fnbServiceAmount = fnbPreFactor * (FNB_FACTOR - 1) * locationMult;

  const subtotalBeforeContingency = categoryResults.reduce(
    (sum, c) => sum + c.subtotal,
    0
  );

  const contingencyRate   = 0.08;
  const contingencyAmount = subtotalBeforeContingency * contingencyRate;
  const total             = subtotalBeforeContingency + contingencyAmount;

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
  };
}
