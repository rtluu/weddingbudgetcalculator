import {
  calculateWeddingBudget,
  seasonalMultipliers,
  locationLabels,
  type Location,
  type Tier,
  type DayOfWeek,
} from "@/config/costModel";

const LOCATIONS = Object.keys(locationLabels) as Location[];
const TIERS: Tier[] = ["budget", "moderate", "luxury"];

describe("calculateWeddingBudget — seasonality", () => {
  it("omitting the month uses a neutral seasonal multiplier of 1.0", () => {
    expect(calculateWeddingBudget(120, "los-angeles", "moderate").seasonalMult).toBe(1);
  });

  it("seasonalMult matches the location's configured multiplier for a month", () => {
    for (const loc of LOCATIONS) {
      const monthly = seasonalMultipliers[loc];
      monthly.forEach((mult, month) => {
        const r = calculateWeddingBudget(120, loc, "moderate", month);
        expect(r.seasonalMult).toBeCloseTo(mult, 5);
      });
    }
  });

  it("a peak-season month costs at least as much as the cheapest month", () => {
    for (const loc of LOCATIONS) {
      const monthly = seasonalMultipliers[loc];
      const peak = monthly.indexOf(Math.max(...monthly));
      const low = monthly.indexOf(Math.min(...monthly));
      const peakTotal = calculateWeddingBudget(120, loc, "moderate", peak).total;
      const lowTotal = calculateWeddingBudget(120, loc, "moderate", low).total;
      expect(peakTotal).toBeGreaterThanOrEqual(lowTotal);
    }
  });
});

describe("calculateWeddingBudget — day of week", () => {
  it("omitting the day of week is the Saturday baseline (no adjustment)", () => {
    // Effectively zero (allow floating-point noise from the multiplier chain).
    expect(calculateWeddingBudget(120, "los-angeles", "moderate").dowAdjustmentAmount).toBeCloseTo(0, 6);
  });

  it("Saturday (6) has no adjustment vs. the baseline", () => {
    const r = calculateWeddingBudget(120, "los-angeles", "moderate", undefined, 6 as DayOfWeek);
    expect(Math.abs(r.dowAdjustmentAmount)).toBeLessThan(1);
  });

  it("every non-Saturday day is a saving (never more than Saturday)", () => {
    for (let d = 0 as DayOfWeek; d <= 6; d = (d + 1) as DayOfWeek) {
      const r = calculateWeddingBudget(120, "los-angeles", "moderate", undefined, d);
      expect(r.dowAdjustmentAmount).toBeLessThanOrEqual(1); // <= 0 within rounding
    }
    // At least one weekday must be a real saving.
    const monday = calculateWeddingBudget(120, "los-angeles", "moderate", undefined, 1 as DayOfWeek);
    expect(monday.dowAdjustmentAmount).toBeLessThan(0);
  });
});

describe("calculateWeddingBudget — every location & tier", () => {
  it("produces a positive, well-ordered estimate for all locations and tiers", () => {
    for (const loc of LOCATIONS) {
      const totals = TIERS.map((t) => calculateWeddingBudget(120, loc, t).total);
      totals.forEach((t) => expect(t).toBeGreaterThan(0));
      // budget < moderate < luxury
      expect(totals[0]).toBeLessThan(totals[1]);
      expect(totals[1]).toBeLessThan(totals[2]);
    }
  });

  it("rangeLow < total < rangeHigh for every combination", () => {
    for (const loc of LOCATIONS) {
      for (const t of TIERS) {
        const r = calculateWeddingBudget(120, loc, t, 5, 6 as DayOfWeek);
        expect(r.rangeLow).toBeLessThan(r.total);
        expect(r.total).toBeLessThan(r.rangeHigh);
      }
    }
  });
});

describe("calculateWeddingBudget — guest-count edges", () => {
  it("scales monotonically with guest count", () => {
    const small = calculateWeddingBudget(20, "los-angeles", "moderate").total;
    const mid = calculateWeddingBudget(150, "los-angeles", "moderate").total;
    const large = calculateWeddingBudget(300, "los-angeles", "moderate").total;
    expect(small).toBeLessThan(mid);
    expect(mid).toBeLessThan(large);
  });

  it("stays finite and positive at the extremes", () => {
    for (const g of [20, 300]) {
      const r = calculateWeddingBudget(g, "los-angeles", "luxury", 9, 6 as DayOfWeek);
      expect(Number.isFinite(r.total)).toBe(true);
      expect(r.total).toBeGreaterThan(0);
    }
  });
});
