import { calculateWeddingBudget } from "@/config/costModel";

describe("calculateWeddingBudget", () => {
  describe("Validation targets (total before range)", () => {
    test("100 guests / moderate / los-angeles total ≈ $44,000–$47,000", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.total).toBeGreaterThanOrEqual(44000);
      expect(result.total).toBeLessThanOrEqual(47000);
    });

    test("150 guests / luxury / santa-barbara total range ≈ $90,000–$115,000", () => {
      const result = calculateWeddingBudget(150, "santa-barbara", "luxury");
      // The total (pre-range) should be within the target band
      expect(result.total).toBeGreaterThanOrEqual(90000);
      expect(result.total).toBeLessThanOrEqual(115000);
    });

    test("75 guests / budget / socal-suburbs total ≈ $22,000–$27,000", () => {
      const result = calculateWeddingBudget(75, "socal-suburbs", "budget");
      expect(result.total).toBeGreaterThanOrEqual(22000);
      expect(result.total).toBeLessThanOrEqual(27000);
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
    });

    test("rangeLow is 90% of total", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.rangeLow).toBeCloseTo(result.total * 0.9, 0);
    });

    test("rangeHigh is 115% of total", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.rangeHigh).toBeCloseTo(result.total * 1.15, 0);
    });

    test("luxury is significantly more expensive than budget for same guests/location", () => {
      const luxury = calculateWeddingBudget(100, "los-angeles", "luxury");
      const budget = calculateWeddingBudget(100, "los-angeles", "budget");
      expect(luxury.total).toBeGreaterThan(budget.total * 1.5);
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

    test("contingency is 8% of pre-contingency subtotal", () => {
      const result = calculateWeddingBudget(100, "los-angeles", "moderate");
      expect(result.contingencyAmount).toBeCloseTo(
        result.subtotalBeforeContingency * 0.08,
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
  });
});
