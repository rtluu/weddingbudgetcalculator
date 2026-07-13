import { scoreLead } from "@/app/api/lead/scoreLead";

const base = {
  guests: 100,
  tier: "moderate" as const,
  venueStatus: "none",
  dateStatus: "not-sure",
  location: "us-average" as const,
  estimate: 40000,
};

describe("scoreLead v2 (points-based)", () => {
  test("hot lead: big-budget luxury SoCal couple touring venues scores A", () => {
    const { score, signals } = scoreLead({
      ...base,
      guests: 150,
      tier: "luxury",
      venueStatus: "touring",
      dateStatus: "yes",
      location: "los-angeles",
      estimate: 95000,
      barStyle: "premium",
    });
    expect(score).toBe("A");
    expect(signals.join(" ")).toMatch(/estimate/);
    expect(signals.join(" ")).toMatch(/SoCal/);
  });

  test("early-stage small out-of-market couple scores C", () => {
    const { score } = scoreLead({
      ...base,
      guests: 60,
      estimate: 25000,
      location: "atlanta",
    });
    expect(score).toBe("C");
  });

  test("mid-market SoCal couple with intent lands B", () => {
    const { score } = scoreLead({
      ...base,
      guests: 110,
      venueStatus: "touring",
      location: "san-diego",
      estimate: 52000,
    });
    expect(score).toBe("B");
  });

  test("SoCal boost never penalizes: same lead scores >= out-of-market twin", () => {
    const nyc = scoreLead({ ...base, location: "new-york-city", estimate: 90000, tier: "luxury" });
    const la = scoreLead({ ...base, location: "los-angeles", estimate: 90000, tier: "luxury" });
    // Identical merits: LA gets the fit boost, NYC keeps its merit-based score.
    expect(la.score <= nyc.score).toBe(true); // "A" < "B" < "C" lexicographically
    const nycAgain = scoreLead({ ...base, location: "new-york-city", estimate: 90000, tier: "luxury" });
    expect(nycAgain.score).toBe(nyc.score);
  });

  test("a big out-of-market lead can still reach A on merit", () => {
    const { score } = scoreLead({
      ...base,
      guests: 180,
      tier: "luxury",
      venueStatus: "touring",
      dateStatus: "yes",
      location: "new-york-city",
      estimate: 150000,
      barStyle: "premium",
      weddingYear: new Date().getFullYear() + 1,
    });
    expect(score).toBe("A");
  });

  test("known-venue selection adds a signal", () => {
    const withVenue = scoreLead({ ...base, venueId: "vibiana" });
    const without = scoreLead(base);
    expect(withVenue.signals.join(" ")).toMatch(/known venue/);
    expect(withVenue.signals.length).toBeGreaterThan(without.signals.length);
  });

  test("legacy payload (no v2 fields) still scores without throwing", () => {
    const { score } = scoreLead({
      guests: 120,
      tier: "luxury",
      venueStatus: "touring",
      location: "los-angeles",
      estimate: 85000,
    });
    expect(["A", "B", "C"]).toContain(score);
    expect(score).toBe("A");
  });

  test("wedding year only counts when near-term", () => {
    const near = scoreLead({ ...base, weddingYear: new Date().getFullYear() });
    const far = scoreLead({ ...base, weddingYear: new Date().getFullYear() + 5 });
    expect(near.signals.join(" ")).toMatch(/wedding in/);
    expect(far.signals.join(" ")).not.toMatch(/wedding in/);
  });
});
