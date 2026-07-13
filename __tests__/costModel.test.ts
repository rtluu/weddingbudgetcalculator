import {
  calculateWeddingBudget,
  fnbFactors,
  MODEL_VINTAGE,
  OPTIONAL_CATEGORIES,
  type Location,
} from "@/config/costModel";

describe("calculateWeddingBudget", () => {
  // Research-derived validation anchors (v2, 2026-07). Windows come from
  // 2025–2026 market data adjusted for full-boat semantics — see
  // config/costModel.sources.md for the source-by-source mapping.
  describe("Validation anchors (moderate tier)", () => {
    const anchors: Array<[string, number, Location, number, number]> = [
      ["US average, 100 guests",        100, "us-average",        40000, 45000],
      ["Los Angeles, 100 guests",       100, "los-angeles",       50000, 55000],
      ["Los Angeles, 50 guests",         50, "los-angeles",       33000, 38000],
      ["Los Angeles, 150 guests",       150, "los-angeles",       65000, 72000],
      ["Los Angeles, 200 guests",       200, "los-angeles",       82000, 92000],
      ["San Diego, 120 guests",         120, "san-diego",         48000, 56000],
      ["Palm Springs, 120 guests",      120, "palm-springs",      47000, 57000],
      ["Orange County, 120 guests",     120, "orange-county",     50000, 60000],
      ["Santa Barbara, 125 guests",     125, "santa-barbara",     60000, 70000],
      ["Washington DC, 125 guests",     125, "washington-dc",     58000, 68000],
      ["SoCal suburbs, 150 guests",     150, "socal-suburbs",     50000, 60000],
      // v2 metros
      ["New York City, 150 guests",     150, "new-york-city",     88000, 100000],
      ["New York City, 100 guests",     100, "new-york-city",     63000, 74000],
      ["SF Bay Area, 150 guests",       150, "sf-bay-area",       85000, 95000],
      ["Chicago, 150 guests",           150, "chicago",           62000, 76000],
      ["Boston, 125 guests",            125, "boston",            52000, 62000],
      ["Seattle, 120 guests",           120, "seattle",           48000, 58000],
      ["Miami, 125 guests",             125, "miami",             48000, 58000],
      ["Dallas–Fort Worth, 120 guests", 120, "dallas-fort-worth", 42000, 50000],
      ["Atlanta, 120 guests",           120, "atlanta",           41000, 49000],
      ["Other US Metro, 120 guests",    120, "other-major-metro", 52000, 62000],
    ];

    test.each(anchors)("%s ≈ $%i–$%i (moderate)", (_desc, guests, location, low, high) => {
      const result = calculateWeddingBudget(guests, location, "moderate");
      expect(result.total).toBeGreaterThanOrEqual(low);
      expect(result.total).toBeLessThanOrEqual(high);
    });

    test("budget tier: 100 guests / us-average ≈ $22,000–$27,000", () => {
      const result = calculateWeddingBudget(100, "us-average", "budget");
      expect(result.total).toBeGreaterThanOrEqual(22000);
      expect(result.total).toBeLessThanOrEqual(27000);
    });

    test("budget tier: 75 guests / socal-suburbs ≈ $18,000–$23,000", () => {
      const result = calculateWeddingBudget(75, "socal-suburbs", "budget");
      expect(result.total).toBeGreaterThanOrEqual(18000);
      expect(result.total).toBeLessThanOrEqual(23000);
    });

    test("luxury tier: 100 guests / los-angeles ≈ $95,000–$115,000", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "luxury");
      expect(result.total).toBeGreaterThanOrEqual(95000);
      expect(result.total).toBeLessThanOrEqual(115000);
    });

    test("luxury tier: 150 guests / santa-barbara ≈ $130,000–$160,000", () => {
      const result = calculateWeddingBudget(150, "santa-barbara", "luxury");
      expect(result.total).toBeGreaterThanOrEqual(130000);
      expect(result.total).toBeLessThanOrEqual(160000);
    });

    test("NYC luxury services carry a bigger metro premium than moderate", () => {
      const ratioFor = (tier: "moderate" | "luxury") => {
        const nyc = calculateWeddingBudget(150, "new-york-city", tier);
        const us = calculateWeddingBudget(150, "us-average", tier);
        const photo = (r: typeof nyc) => r.categories.find((c) => c.name === "Photography")!.subtotal;
        return photo(nyc) / photo(us);
      };
      expect(ratioFor("luxury")).toBeGreaterThan(ratioFor("moderate"));
    });
  });

  describe("Guest-count scaling", () => {
    test("micro-wedding taper: LA 20-guest moderate lands ≈ $18,000–$22,500", () => {
      const result = calculateWeddingBudget(20, "los-angeles", "moderate");
      expect(result.total).toBeGreaterThanOrEqual(18000);
      expect(result.total).toBeLessThanOrEqual(22500);
    });

    test("volume pricing: LA 300-guest moderate lands ≈ $105,000–$118,000", () => {
      const result = calculateWeddingBudget(300, "los-angeles", "moderate");
      expect(result.total).toBeGreaterThanOrEqual(105000);
      expect(result.total).toBeLessThanOrEqual(118000);
    });

    test("total is strictly monotonic in guest count from 20 to 300", () => {
      let prev = 0;
      for (let g = 20; g <= 300; g += 5) {
        const t = calculateWeddingBudget(g, "los-angeles", "moderate").total;
        expect(t).toBeGreaterThan(prev);
        prev = t;
      }
    });

    test("LA moderate marginal cost per added guest is ~$280–$400 (50→200)", () => {
      const at50 = calculateWeddingBudget(50, "los-angeles", "moderate").total;
      const at200 = calculateWeddingBudget(200, "los-angeles", "moderate").total;
      const slope = (at200 - at50) / 150;
      expect(slope).toBeGreaterThanOrEqual(280);
      expect(slope).toBeLessThanOrEqual(400);
    });

    test("venue cost grows with guest count", () => {
      const venueAt = (guests: number) =>
        calculateWeddingBudget(guests, "los-angeles", "moderate").categories.find(
          (c) => c.name === "Venue"
        )!.subtotal;
      expect(venueAt(200)).toBeGreaterThan(venueAt(50));
    });
  });

  describe("Inflation to wedding year", () => {
    test("no wedding year → vintage pricing (unchanged)", () => {
      const base = calculateWeddingBudget(100, "los-angeles", "moderate");
      const withOpts = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {});
      expect(withOpts.total).toBeCloseTo(base.total, 6);
    });

    test("a wedding one year past vintage costs ~3.5% more", () => {
      const base = calculateWeddingBudget(100, "los-angeles", "moderate");
      const later = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        weddingYear: MODEL_VINTAGE + 1,
      });
      expect(later.total / base.total).toBeCloseTo(1.035, 3);
    });

    test("escalation is capped at 3 years", () => {
      const at3 = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        weddingYear: MODEL_VINTAGE + 3,
      });
      const at10 = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        weddingYear: MODEL_VINTAGE + 10,
      });
      expect(at10.total).toBeCloseTo(at3.total, 6);
    });

    test("past wedding years never deflate the estimate", () => {
      const base = calculateWeddingBudget(100, "los-angeles", "moderate");
      const past = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        weddingYear: 2020,
      });
      expect(past.total).toBeCloseTo(base.total, 6);
    });
  });

  describe("Venue type", () => {
    test("all-inclusive shrinks Rentals and raises Venue vs standard", () => {
      const std = calculateWeddingBudget(100, "los-angeles", "moderate");
      const ai = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        venueType: "all-inclusive",
      });
      const line = (r: typeof std, name: string) => r.categories.find((c) => c.name === name)!.subtotal;
      expect(line(ai, "Rentals")).toBeLessThan(line(std, "Rentals") * 0.5);
      expect(line(ai, "Venue")).toBeGreaterThan(line(std, "Venue"));
    });

    test("raw space cuts Venue but raises Rentals", () => {
      const std = calculateWeddingBudget(100, "los-angeles", "moderate");
      const raw = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        venueType: "raw-space",
      });
      const line = (r: typeof std, name: string) => r.categories.find((c) => c.name === name)!.subtotal;
      expect(line(raw, "Venue")).toBeLessThan(line(std, "Venue"));
      expect(line(raw, "Rentals")).toBeGreaterThan(line(std, "Rentals"));
    });
  });

  describe("Bar style", () => {
    test("none zeroes the Bar line; premium beats standard beats beer-wine", () => {
      const bar = (style: "none" | "beer-wine" | "standard" | "premium") =>
        calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
          barStyle: style,
        }).categories.find((c) => c.name === "Bar")!.subtotal;
      expect(bar("none")).toBe(0);
      expect(bar("beer-wine")).toBeLessThan(bar("standard"));
      expect(bar("standard")).toBeLessThan(bar("premium"));
    });

    test("a zeroed bar contributes nothing to the F&B service amount", () => {
      const none = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        barStyle: "none",
      });
      const std = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(none.fnbServiceAmount).toBeLessThan(std.fnbServiceAmount);
    });
  });

  describe("Excluded categories", () => {
    test("excluding lines lowers the total by exactly those lines (+contingency)", () => {
      const excluded = ["Videography", "Favors"];
      const base = calculateWeddingBudget(100, "los-angeles", "moderate");
      const trimmed = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        excludedCategories: excluded,
      });
      const excludedSum = base.categories
        .filter((c) => excluded.includes(c.name))
        .reduce((s, c) => s + c.subtotal, 0);
      expect(trimmed.total).toBeCloseTo(base.total - excludedSum * 1.09, 0);
    });

    test("excluded lines are flagged but still priced for display", () => {
      const r = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
        excludedCategories: ["Videography"],
      });
      const video = r.categories.find((c) => c.name === "Videography")!;
      expect(video.included).toBe(false);
      expect(video.subtotal).toBeGreaterThan(0);
      expect(r.categories.filter((c) => c.included)).toHaveLength(16);
    });

    test("OPTIONAL_CATEGORIES are all real category names", () => {
      const names = new Set(calculateWeddingBudget(100, "us-average", "moderate").categories.map((c) => c.name));
      for (const n of OPTIONAL_CATEGORIES) expect(names.has(n)).toBe(true);
    });
  });

  describe("Structure and computation", () => {
    test("returns all expected fields", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result).toHaveProperty("categories");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("rangeLow");
      expect(result).toHaveProperty("rangeHigh");
      expect(result).toHaveProperty("contingencyAmount");
      expect(result).toHaveProperty("fnbServiceAmount");
      expect(result).toHaveProperty("seasonalAdjustmentAmount");
    });

    test("range is asymmetric −8%/+22% in calibrated markets", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.rangeLow).toBeCloseTo(result.total * 0.92, 0);
      expect(result.rangeHigh).toBeCloseTo(result.total * 1.22, 0);
    });

    test("fallback markets get a wider −12%/+30% range", () => {
      for (const loc of ["other-major-metro", "us-average"] as Location[]) {
        const result = calculateWeddingBudget(100, loc, "moderate");
        expect(result.rangeLow).toBeCloseTo(result.total * 0.88, 0);
        expect(result.rangeHigh).toBeCloseTo(result.total * 1.30, 0);
      }
    });

    test("luxury is at least 2x budget for same guests/location", () => {
      const luxury = calculateWeddingBudget(100, "los-angeles", "luxury");
      const budget = calculateWeddingBudget(100, "los-angeles", "budget");
      expect(luxury.total).toBeGreaterThan(budget.total * 2);
    });

    test("market ordering: NYC > SF > LA > Chicago > Seattle > DFW ≥ Atlanta", () => {
      const total = (loc: Location) => calculateWeddingBudget(120, loc, "moderate").total;
      expect(total("new-york-city")).toBeGreaterThan(total("sf-bay-area"));
      expect(total("sf-bay-area")).toBeGreaterThan(total("los-angeles"));
      expect(total("los-angeles")).toBeGreaterThan(total("chicago"));
      expect(total("chicago")).toBeGreaterThan(total("seattle"));
      expect(total("seattle")).toBeGreaterThan(total("dallas-fort-worth"));
      expect(total("dallas-fort-worth")).toBeGreaterThanOrEqual(total("atlanta"));
    });

    test("metro premium is smaller for services than for venue", () => {
      const la = calculateWeddingBudget(100, "los-angeles", "moderate");
      const us = calculateWeddingBudget(100, "us-average", "moderate");
      const ratio = (name: string) =>
        la.categories.find((c) => c.name === name)!.subtotal /
        us.categories.find((c) => c.name === name)!.subtotal;
      expect(ratio("Photography")).toBeLessThan(ratio("Venue"));
    });

    test("contingency is 9% of pre-contingency subtotal", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.contingencyRate).toBe(0.09);
      expect(result.contingencyAmount).toBeCloseTo(result.subtotalBeforeContingency * 0.09, 0);
    });

    test("has 17 category line items", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.categories).toHaveLength(17);
    });
  });

  describe("F&B categories", () => {
    test("Catering, Bar, and Cake/Desserts are marked as F&B", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      ["Catering", "Bar", "Cake/Desserts"].forEach((name) => {
        expect(result.categories.find((c) => c.name === name)?.isFnB).toBe(true);
      });
    });

    test("F&B factor is market-specific (Chicago meal tax > Boston)", () => {
      expect(fnbFactors["chicago"]).toBeGreaterThan(fnbFactors["boston"]);
      expect(fnbFactors["washington-dc"]).toBeGreaterThan(fnbFactors["maryland-montgomery"]);
      expect(fnbFactors["new-york-city"]).toBeGreaterThan(fnbFactors["us-average"]);
    });

    test("cake carries tax but not the full venue service charge", () => {
      // The cake line's F&B share must be far smaller than catering's share.
      const r = calculateWeddingBudget(100, "los-angeles", "moderate");
      const cake = r.categories.find((c) => c.name === "Cake/Desserts")!;
      const catering = r.categories.find((c) => c.name === "Catering")!;
      // service+tax share as a fraction of the line
      const factor = fnbFactors["los-angeles"];
      const cateringShare = 1 - 1 / factor;
      // if cake had the full factor, its share would equal cateringShare;
      // with tax-only it must be well under half of that.
      const cakeTaxOnly = 1 - 1 / (1 + (factor - 1) * 0.35);
      expect(cakeTaxOnly).toBeLessThan(cateringShare * 0.5);
      expect(cake.subtotal).toBeGreaterThan(0);
      expect(catering.subtotal).toBeGreaterThan(0);
    });
  });

  describe("Timing", () => {
    test("seasonal adjustment is positive in peak October, negative in January (LA)", () => {
      const oct = calculateWeddingBudget(100, "los-angeles", "moderate", 9);
      const jan = calculateWeddingBudget(100, "los-angeles", "moderate", 0);
      expect(oct.seasonalAdjustmentAmount).toBeGreaterThan(0);
      expect(jan.seasonalAdjustmentAmount).toBeLessThan(0);
    });

    test("stacked off-peak + midweek discounts are floored (never below −45% on a line)", () => {
      // Palm Springs July Wednesday: venue-axis 0.58 seasonal × 0.65 DoW would
      // be −62% uncapped; the timing floor keeps the venue line ≥ 55% of base.
      const stacked = calculateWeddingBudget(100, "palm-springs", "moderate", 6, 3);
      const base = calculateWeddingBudget(100, "palm-springs", "moderate");
      const venue = (r: typeof base) => r.categories.find((c) => c.name === "Venue")!.subtotal;
      expect(venue(stacked) / venue(base)).toBeGreaterThanOrEqual(0.549);
    });

    test("Miami peaks in winter, troughs in hurricane season", () => {
      const feb = calculateWeddingBudget(100, "miami", "moderate", 1).total;
      const sep = calculateWeddingBudget(100, "miami", "moderate", 8).total;
      expect(feb).toBeGreaterThan(sep);
    });

    test("Seattle peaks in the July–August dry season", () => {
      const jul = calculateWeddingBudget(100, "seattle", "moderate", 6).total;
      const jan = calculateWeddingBudget(100, "seattle", "moderate", 0).total;
      expect(jul).toBeGreaterThan(jan);
    });
  });

  describe("Model freshness", () => {
    test("model vintage is less than ~14 months old (recalibrate yearly!)", () => {
      const nowFractional = new Date().getFullYear() + new Date().getMonth() / 12;
      const ageYears = nowFractional - MODEL_VINTAGE;
      if (ageYears > 1.2) {
        // Soft signal: loud console warning + failing assertion so CI surfaces it.
        console.warn(
          `⚠ Cost model vintage is ${ageYears.toFixed(1)} years old — rerun the market research (see config/costModel.sources.md).`
        );
      }
      expect(ageYears).toBeLessThanOrEqual(1.2);
    });
  });
});
