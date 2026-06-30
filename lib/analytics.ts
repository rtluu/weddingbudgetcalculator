// Lightweight GA event helper. Safe to call anywhere — no-ops if gtag isn't
// loaded (e.g. when NEXT_PUBLIC_GA_ID is unset in dev).

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: GtagParams) => void;
  }
}

export function track(action: string, params: GtagParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}

// Standardized conversion event for any lead-generating action.
export function trackLead(method: string, params: GtagParams = {}) {
  track("generate_lead", { method, ...params });
}
