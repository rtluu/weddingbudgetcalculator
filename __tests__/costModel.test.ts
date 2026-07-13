import { calculateWeddingBudget, fnbFactors } from "@/config/costModel";

describe("calculateWeddingBudget", () => {
  // Research-derived validation anchors (2026-07 recalibration).
  // Windows come from 2025–2026 market data — The Knot 2026 Real Weddings
  // Study, Zola 2026 First Look Report, The Wedding Report metro estimates —
  // adjusted for full-boat semantics (all 17 line items purchased). See
  // config/costModel.sources.md for the source-by-source mapping.
  describe("Validation anchors (moderate tier)", () => {
    const anchors: Array<[string, number, Parameters<typeof calculateWeddingBudget>[1], number, number]> = [
      ["US average, 100 guests",        100, "us-average",        40000, 45000],
      ["Los Angeles, 100 guests",       100, "los-angeles",       50000, 55000],
      ["Los Angeles, 50 guests",         50, "los-angeles",       33000, 38000],
      ["Los Angeles, 150 guests",       150, "los-angeles",       65000, 72000],
      ["Los Angeles, 200 guests",       200, "los-angeles",       82000, 92000],
      ["San Diego, 120 guests",         120, "san-diego",         48000, 56000],
      ["Palm Springs, 120 guests",      120, "palm-springs",      47000, 57000],
      ["Orange County, 120 guests",     120, "orange-county",     50000, 60000],
      ["Santa Barbara, 125 guests",     125, "santa-barbara",     60000, 70000],
      ["Other major metro, 150 guests", 150, "other-major-metro", 75000, 90000],
      ["Washington DC, 125 guests",     125, "washington-dc",     58000, 68000],
      ["SoCal suburbs, 150 guests",     150, "socal-suburbs",     50000, 60000],
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
  });

  describe("Guest-count scaling", () => {
    // LA market data (Zola/The Wedding Report) fits ≈ fixed + ~$350/guest:
    // small weddings must not carry full big-wedding overhead, and marginal
    // per-guest cost should sit in a plausible band.
    test("LA moderate marginal cost per added guest is ~$280–$400", () => {
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

    test("range is asymmetric: −8% low, +22% high (overruns dominate)", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.rangeLow).toBeCloseTo(result.total * 0.92, 0);
      expect(result.rangeHigh).toBeCloseTo(result.total * 1.22, 0);
    });

    test("luxury is at least 2x budget for same guests/location", () => {
      const luxury = calculateWeddingBudget(100, "los-angeles", "luxury");
      const budget = calculateWeddingBudget(100, "los-angeles", "budget");
      expect(luxury.total).toBeGreaterThan(budget.total * 2);
    });

    test("LA costs more than US average for same inputs", () => {
      const la = calculateWeddingBudget(100, "los-angeles", "moderate");
      const us = calculateWeddingBudget(100, "us-average", "moderate");
      expect(la.total).toBeGreaterThan(us.total);
    });

    test("Santa Barbara costs more than Los Angeles", () => {
      const sb = calculateWeddingBudget(100, "santa-barbara", "moderate");
      const la = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(sb.total).toBeGreaterThan(la.total);
    });

    test("metro premium is smaller for services than for venue", () => {
      // A photographer in LA costs far less of a premium than an LA venue.
      const la = calculateWeddingBudget(100, "los-angeles", "moderate");
      const us = calculateWeddingBudget(100, "us-average", "moderate");
      const ratio = (name: string, r1 = la, r2 = us) =>
        r1.categories.find((c) => c.name === name)!.subtotal /
        r2.categories.find((c) => c.name === name)!.subtotal;
      expect(ratio("Photography")).toBeLessThan(ratio("Venue"));
    });

    test("contingency is 9% of pre-contingency subtotal", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.contingencyRate).toBe(0.09);
      expect(result.contingencyAmount).toBeCloseTo(
        result.subtotalBeforeContingency * 0.09,
        0
      );
    });

    test("has 17 category line items", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.categories).toHaveLength(17);
    });

    test("more guests means higher total cost", () => {
      const small = calculateWeddingBudget(50, "los-angeles", "moderate");
      const large = calculateWeddingBudget(200, "los-angeles", "moderate");
      expect(large.total).toBeGreaterThan(small.total);
    });
  });

  describe("F&B categories", () => {
    test("Catering, Bar, and Cake/Desserts are marked as F&B", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      const fnbNames = ["Catering", "Bar", "Cake/Desserts"];
      fnbNames.forEach((name) => {
        const cat = result.categories.find((c) => c.name === name);
        expect(cat?.isFnB).toBe(true);
      });
    });

    test("non-F&B categories (Venue, Photography) are not marked as F&B", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      ["Venue", "Photography", "Videography", "Florals"].forEach((name) => {
        const cat = result.categories.find((c) => c.name === name);
        expect(cat?.isFnB).toBe(false);
      });
    });

    test("F&B factor is market-specific (DC 10% catering tax > MD 6%)", () => {
      expect(fnbFactors["washington-dc"]).toBeGreaterThan(fnbFactors["maryland-montgomery"]);
      expect(fnbFactors["other-major-metro"]).toBeGreaterThan(fnbFactors["us-average"]);
    });

    test("fnbServiceAmount equals the service/tax share of F&B lines", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      const factor = fnbFactors["los-angeles"];
      const fnbTotal = result.categories
        .filter((c) => c.isFnB)
        .reduce((s, c) => s + c.subtotal, 0);
      expect(result.fnbServiceAmount).toBeCloseTo(fnbTotal * (1 - 1 / factor), 0);
    });
  });

  describe("Seasonal adjustment amount", () => {
    test("is zero when no month is given", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.seasonalAdjustmentAmount).toBe(0);
    });

    test("is positive in peak October and negative in off-peak January (LA)", () => {
      const oct = calculateWeddingBudget(100, "los-angeles", "moderate", 9);
      const jan = calculateWeddingBudget(100, "los-angeles", "moderate", 0);
      expect(oct.seasonalAdjustmentAmount).toBeGreaterThan(0);
      expect(jan.seasonalAdjustmentAmount).toBeLessThan(0);
    });

    test("total equals annual-average total plus the adjustment", () => {
      const base = calculateWeddingBudget(100, "los-angeles", "moderate");
      const oct = calculateWeddingBudget(100, "los-angeles", "moderate", 9);
      expect(oct.total - oct.seasonalAdjustmentAmount).toBeCloseTo(base.total, 6);
    });

    test("whole-budget seasonal swing is gentler than the venue-axis curve", () => {
      // Venues swing hardest; blended total should move less than seasonalMult.
      const oct = calculateWeddingBudget(100, "los-angeles", "moderate", 9);
      const base = calculateWeddingBudget(100, "los-angeles", "moderate");
      const totalSwing = oct.total / base.total;
      expect(totalSwing).toBeGreaterThan(1);
      expect(totalSwing).toBeLessThan(oct.seasonalMult);
    });
  });
});
