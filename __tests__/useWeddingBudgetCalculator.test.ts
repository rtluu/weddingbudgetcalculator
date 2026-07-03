import { renderHook, act } from "@testing-library/react";
import { useWeddingBudgetCalculator } from "@/app/calculator/useWeddingBudgetCalculator";

// Locks in the calculator's core behavior so future refactors (extracting
// per-step components, etc.) can't silently change the flow.
describe("useWeddingBudgetCalculator", () => {
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
});
