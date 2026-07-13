import { venues, findVenueById, searchVenues } from "@/config/venues";
import { calculateWeddingBudget, locationLabels } from "@/config/costModel";

describe("venue table integrity", () => {
  test("ids are unique and slug-like", () => {
    const ids = venues.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  test("every venue maps to a real location and sane prices", () => {
    for (const v of venues) {
      expect(locationLabels[v.location]).toBeDefined();
      expect(v.siteFee).toBeGreaterThanOrEqual(1000);
      expect(v.siteFee).toBeLessThanOrEqual(50000);
      if (v.fnbMinimum !== null) {
        expect(v.fnbMinimum).toBeGreaterThanOrEqual(5000);
        expect(v.fnbMinimum).toBeLessThanOrEqual(150000);
      }
      if (v.cateringPerGuest !== undefined) {
        expect(v.cateringPerGuest).toBeGreaterThanOrEqual(50);
        expect(v.cateringPerGuest).toBeLessThanOrEqual(400);
      }
      expect(v.sourceNote.length).toBeGreaterThan(20);
    }
  });

  test("search matches by name fragment and alias, case-insensitively", () => {
    expect(searchVenues("vibi").map((v) => v.id)).toContain("vibiana");
    expect(searchVenues("GREYSTONE").map((v) => v.id)).toContain("greystone-mansion");
    expect(searchVenues("the del").map((v) => v.id)).toContain("hotel-del-coronado");
    expect(searchVenues("x")).toHaveLength(0); // too short
    expect(searchVenues("zzzz")).toHaveLength(0);
  });
});

describe("known-venue pricing in the estimate", () => {
  const vibiana = findVenueById("vibiana")!;
  const greystone = findVenueById("greystone-mansion")!;

  test("venue line uses the published site fee instead of the modeled cost", () => {
    const withVenue = calculateWeddingBudget(150, "los-angeles", "moderate", undefined, undefined, {
      venue: greystone,
    });
    const venueLine = withVenue.categories.find((c) => c.name === "Venue")!;
    expect(venueLine.subtotal).toBeCloseTo(greystone.siteFee, 0);
    expect(withVenue.venueId).toBe("greystone-mansion");
    expect(withVenue.venueNote).toContain("Greystone");
  });

  test("the venue's bundling style overrides the manual venue type", () => {
    // Vibiana is all-inclusive: rentals should shrink even if the user picked raw-space.
    const std = calculateWeddingBudget(150, "los-angeles", "moderate");
    const withVenue = calculateWeddingBudget(150, "los-angeles", "moderate", undefined, undefined, {
      venue: vibiana,
      venueType: "raw-space",
    });
    const rentals = (r: typeof std) => r.categories.find((c) => c.name === "Rentals")!.subtotal;
    expect(rentals(withVenue)).toBeLessThan(rentals(std) * 0.5);
  });

  test("F&B minimum raises catering+bar for a small guest count", () => {
    // 60 guests at Vibiana ($43,750 Saturday minimum) sits far below the minimum.
    const r = calculateWeddingBudget(60, "los-angeles", "moderate", undefined, undefined, {
      venue: vibiana,
    });
    expect(r.fnbMinimumApplied).toBe(true);
    expect(r.venueNote).toContain("minimum");
    const catering = r.categories.find((c) => c.name === "Catering")!.subtotal;
    const bar = r.categories.find((c) => c.name === "Bar")!.subtotal;
    const fnb = 1.34; // LA factor
    const preFactorSpend = catering / fnb + bar / fnb;
    expect(preFactorSpend).toBeGreaterThanOrEqual(43750 * 0.999);
  });

  test("F&B minimum is not applied when spend already exceeds it", () => {
    const r = calculateWeddingBudget(250, "los-angeles", "moderate", undefined, undefined, {
      venue: vibiana,
    });
    expect(r.fnbMinimumApplied).toBe(false);
  });

  test("day-of-week discount applies to the minimum (Wednesday below Saturday)", () => {
    const sat = calculateWeddingBudget(60, "los-angeles", "moderate", undefined, 6, { venue: vibiana });
    const wed = calculateWeddingBudget(60, "los-angeles", "moderate", undefined, 3, { venue: vibiana });
    const fnbSpend = (r: typeof sat) =>
      r.categories.find((c) => c.name === "Catering")!.subtotal +
      r.categories.find((c) => c.name === "Bar")!.subtotal;
    expect(fnbSpend(wed)).toBeLessThan(fnbSpend(sat));
  });

  test("in-house per-plate rate replaces the tier catering rate", () => {
    const wilsonCreek = findVenueById("wilson-creek")!;
    const r = calculateWeddingBudget(100, "socal-suburbs", "moderate", undefined, undefined, {
      venue: wilsonCreek,
    });
    const catering = r.categories.find((c) => c.name === "Catering")!.subtotal;
    // 130/pp × 100 guests × suburb F&B factor 1.32 = ~17,160 (no fixed, no locSens)
    expect(catering).toBeCloseTo(130 * 100 * 1.32, -2);
  });

  test("capacity caution appears when guests exceed the venue's capacity", () => {
    const millwick = findVenueById("millwick")!;
    const r = calculateWeddingBudget(280, "los-angeles", "moderate", undefined, undefined, {
      venue: millwick,
    });
    expect(r.venueNote).toContain("capacity");
  });

  test("no venue → venue fields are null/false and note absent", () => {
    const r = calculateWeddingBudget(100, "los-angeles", "moderate");
    expect(r.venueId).toBeNull();
    expect(r.fnbMinimumApplied).toBe(false);
    expect(r.venueNote).toBeNull();
  });
});
