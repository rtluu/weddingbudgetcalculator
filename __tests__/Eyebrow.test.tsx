import { render, screen } from "@testing-library/react";
import Eyebrow from "@/components/marketing/Eyebrow";

// Smoke test that also validates the jsdom + Testing Library setup end-to-end.
describe("Eyebrow", () => {
  it("renders its children", () => {
    render(<Eyebrow>Wedding &amp; social event planning</Eyebrow>);
    expect(screen.getByText(/wedding & social event planning/i)).toBeInTheDocument();
  });

  it("supports centered alignment", () => {
    render(<Eyebrow align="center">Centered</Eyebrow>);
    expect(screen.getByText("Centered")).toHaveStyle({ textAlign: "center" });
  });
});
