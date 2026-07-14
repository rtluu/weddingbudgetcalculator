import { render, screen, fireEvent } from "@testing-library/react";
import ResultsBreakdown from "@/components/ResultsBreakdown";
import { calculateWeddingBudget } from "@/config/costModel";

// Smoke test for the results screen's line-item toggles: the "skip" control
// reports the toggle upward, and an excluded line renders struck-through with
// an "add back" affordance.
describe("ResultsBreakdown line-item toggles", () => {
  const noop = () => {};

  it("renders a skip control for optional lines and fires onToggleCategory", () => {
    const onToggle = jest.fn();
    const result = calculateWeddingBudget(100, "los-angeles", "moderate");
    render(
      <ResultsBreakdown result={result} onLeadCapture={noop} onToggleCategory={onToggle} />
    );
    fireEvent.click(screen.getByRole("button", { name: /remove videography/i }));
    expect(onToggle).toHaveBeenCalledWith("Videography");
  });

  it("shows excluded lines as struck-through with an add-back control", () => {
    const result = calculateWeddingBudget(100, "los-angeles", "moderate", undefined, undefined, {
      excludedCategories: ["Videography"],
    });
    render(
      <ResultsBreakdown result={result} onLeadCapture={noop} onToggleCategory={noop} />
    );
    expect(
      screen.getByRole("button", { name: /add videography back/i })
    ).toBeInTheDocument();
  });

  it("renders no toggle controls when onToggleCategory is not provided", () => {
    const result = calculateWeddingBudget(100, "los-angeles", "moderate");
    render(<ResultsBreakdown result={result} onLeadCapture={noop} />);
    expect(screen.queryByRole("button", { name: /remove videography/i })).toBeNull();
  });

  it("uses the word 'remove' (not 'skip') on optional line controls", () => {
    const result = calculateWeddingBudget(100, "los-angeles", "moderate");
    render(<ResultsBreakdown result={result} onLeadCapture={noop} onToggleCategory={noop} />);
    expect(screen.queryByText("skip")).toBeNull();
    expect(screen.getAllByText("remove").length).toBeGreaterThan(0);
  });

  it("offers a DJ / Live band toggle on the Music line and fires the change", () => {
    const onMusic = jest.fn();
    const result = calculateWeddingBudget(100, "los-angeles", "moderate");
    render(
      <ResultsBreakdown result={result} onLeadCapture={noop} musicType="dj" onMusicTypeChange={onMusic} />
    );
    fireEvent.click(screen.getByRole("radio", { name: "Live band" }));
    expect(onMusic).toHaveBeenCalledWith("band");
  });

  it("offers the three planning packages and fires the change", () => {
    const onPlan = jest.fn();
    const result = calculateWeddingBudget(100, "los-angeles", "moderate");
    render(
      <ResultsBreakdown result={result} onLeadCapture={noop} planningPackage="partial" onPlanningPackageChange={onPlan} />
    );
    fireEvent.click(screen.getByRole("radio", { name: "Full-service planning" }));
    expect(onPlan).toHaveBeenCalledWith("full");
    // default selection is reflected
    expect(screen.getByRole("radio", { name: "Partial planning" })).toHaveAttribute("aria-checked", "true");
  });
});
