// Extends Jest's `expect` with DOM matchers (toBeInTheDocument, etc.) for
// component tests via @testing-library/react.
import "@testing-library/jest-dom";

// jsdom doesn't implement scrollTo; stub it so components/hooks that call it
// (e.g. the calculator's step navigation) don't throw in tests.
window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
