import { renderHook, act } from "@testing-library/react";
import { useWeddingBudgetCalculator } from "@/app/calculator/useWeddingBudgetCalculator";

// Locks in the calculator's core behavior so future refactors (extracting
// per-step components, etc.) can't silently change the flow.
describe("useWeddingBudgetCalculator", () => {
  // The hook hydrates from URL params on mount and writes them back on the
  // results step; jsdom shares window.location across tests in this file, so
  // reset it to keep tests independent.
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("starts on the landing step with defaults and a derived estimate", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    expect(result.current.step).toBe(0);
    expect(result.current.guests).toBe(100);
    expect(result.current.location).toBe("los-angeles");
    expect(result.current.tier).toBe("moderate");
    expect(result.current.result.total).toBeGreaterThan(0);
  });

  it("advances through the four steps into the soft gate", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    for (const expected of [1, 2, 3, 4, 5]) {
      act(() => result.current.goNext());
      expect(result.current.step).toBe(expected);
    }
  });

  it("goBack from the results step skips the soft gate", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    act(() => result.current.goToStep(6));
    act(() => result.current.goBack());
    expect(result.current.step).toBe(4);
  });

  it("restart returns to the landing step", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    act(() => result.current.goToStep(4));
    act(() => result.current.restart());
    expect(result.current.step).toBe(0);
  });

  it("recomputes the estimate when inputs change (derived, not stale)", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    const before = result.current.result.total;
    act(() => result.current.setGuests(250));
    expect(result.current.result.total).toBeGreaterThan(before);
    act(() => result.current.setTier("luxury"));
    expect(result.current.result.total).toBeGreaterThan(before);
  });

  it("bar style and venue type flow into the estimate", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    const before = result.current.result.total;
    act(() => result.current.setBarStyle("premium"));
    expect(result.current.result.total).toBeGreaterThan(before);
    act(() => result.current.setBarStyle("none"));
    expect(result.current.result.total).toBeLessThan(before);
    act(() => result.current.setVenueType("all-inclusive"));
    const rentals = result.current.result.categories.find((c) => c.name === "Rentals")!;
    expect(rentals.subtotal).toBeLessThan(1000);
  });

  it("toggleCategory excludes and re-includes an optional line", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    const before = result.current.result.total;
    act(() => result.current.toggleCategory("Videography"));
    expect(result.current.excludedCategories).toContain("Videography");
    expect(result.current.result.total).toBeLessThan(before);
    act(() => result.current.toggleCategory("Videography"));
    expect(result.current.excludedCategories).toHaveLength(0);
    expect(result.current.result.total).toBeCloseTo(before, 6);
  });

  it("toggleCategory ignores non-optional categories like Venue", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    act(() => result.current.toggleCategory("Venue"));
    expect(result.current.excludedCategories).toHaveLength(0);
  });

  it("defaults to DJ + Full-service planning and flows changes into the estimate", () => {
    const { result } = renderHook(() => useWeddingBudgetCalculator());
    expect(result.current.musicType).toBe("dj");
    expect(result.current.planningPackage).toBe("full");
    const music = () => result.current.result.categories.find((c) => c.name === "Music (DJ/band)")!.subtotal;
    const plan = () => result.current.result.categories.find((c) => c.name === "Planning/Coordination")!.subtotal;
    const djCost = music();
    const fullCost = plan();
    act(() => result.current.setMusicType("band"));
    expect(music()).toBeGreaterThan(djCost);
    act(() => result.current.setPlanningPackage("partial"));
    expect(plan()).toBeLessThan(fullCost);
    act(() => result.current.setPlanningPackage("month-of"));
    expect(plan()).toBeLessThan(fullCost);
  });
});
