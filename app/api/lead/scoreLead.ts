// Lead scoring, extracted from the route handler so it can be unit-tested
// without pulling in next/server.
import type { Tier, Location, BarStyle } from "@/config/costModel";

export type LeadScore = "A" | "B" | "C";

const SOCAL_LOCATIONS = new Set<Location>([
  "los-angeles", "santa-barbara", "orange-county",
  "san-diego", "palm-springs", "socal-suburbs",
]);

export interface LeadSignalInput {
  guests: number;
  tier: Tier;
  venueStatus: string;
  dateStatus?: string;
  location: Location;
  estimate: number;
  barStyle?: BarStyle;
  weddingYear?: number;
  venueId?: string;
}

// Points-based scoring over the full payload. Budget and intent carry the
// score; market fit only ever boosts (out-of-market leads score on merit).
// The signals list makes the grade explainable in Kristina's notification.
export function scoreLead(input: LeadSignalInput): { score: LeadScore; signals: string[] } {
  let points = 0;
  const signals: string[] = [];
  const add = (pts: number, label: string) => {
    points += pts;
    signals.push(label);
  };

  // Budget signals
  if (input.estimate >= 80000) add(3, `${Math.round(input.estimate / 1000)}K estimate`);
  else if (input.estimate >= 50000) add(2, `${Math.round(input.estimate / 1000)}K estimate`);
  else if (input.estimate >= 35000) add(1, `${Math.round(input.estimate / 1000)}K estimate`);
  if (input.tier === "luxury") add(2, "luxury tier");
  if (input.barStyle === "premium") add(1, "top-shelf bar");

  // Intent signals
  if (input.venueStatus === "touring") add(2, "touring venues");
  else if (input.venueStatus === "booked") add(1, "venue booked");
  if (input.dateStatus === "yes") add(1, "date confirmed");
  if (input.weddingYear !== undefined) {
    const yearsOut = input.weddingYear - new Date().getFullYear();
    if (yearsOut === 0 || yearsOut === 1) add(1, `wedding in ${input.weddingYear}`);
  }
  if (input.venueId) add(1, "picked a known venue");

  // Fit signals (boost-only — never penalize other markets)
  if (SOCAL_LOCATIONS.has(input.location)) add(2, "SoCal");
  if (input.guests >= 120) add(1, `${input.guests} guests`);

  const score: LeadScore = points >= 8 ? "A" : points >= 4 ? "B" : "C";
  return { score, signals };
}
