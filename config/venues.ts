// Known-venue pricing table — real published rates for popular SoCal venues.
// When a couple selects one of these, the estimate swaps modeled venue costs
// for the venue's actual site fee, enforces its F&B minimum, and applies its
// bundling style. All figures come from public listings (Wedding Spot, Here
// Comes The Guide, The Knot, Zola, venue sites) — see each sourceNote and the
// v3 addendum in costModel.sources.md. Prices are Saturday-peak unless noted;
// "~" figures are midpoints of published ranges. Reverify yearly with the
// model recalibration.

import type { Location, VenueType } from "./costModel";

export interface KnownVenue {
  id: string;
  name: string;
  aliases: string[];        // lowercase match terms beyond the name itself
  location: Location;       // market whose multipliers/curves apply
  venueType: VenueType;
  siteFee: number;          // Saturday site/rental fee (USD)
  fnbMinimum: number | null; // Saturday food & beverage minimum, pre-tax/service
  cateringPerGuest?: number; // in-house per-plate where published (food only)
  capacity?: number;
  sourceNote: string;
}

export const venues: KnownVenue[] = [
  // ─── Los Angeles ────────────────────────────────────────────────────────────
  {
    id: "vibiana",
    name: "Vibiana",
    aliases: ["vibiana"],
    location: "los-angeles",
    venueType: "all-inclusive",
    siteFee: 8000,
    fnbMinimum: 43750,
    cateringPerGuest: 175,
    capacity: 300,
    sourceNote: "2025 packages $250/pp with 150-guest min → $43,750 Sat minimum; venue fee $4K weekday–$8K Sat; in-house catering (HCTG/venue PDF, 2025)",
  },
  {
    id: "greystone-mansion",
    name: "Greystone Mansion & Gardens",
    aliases: ["greystone", "doheny estate"],
    location: "los-angeles",
    venueType: "raw-space",
    siteFee: 9000,
    fnbMinimum: null,
    capacity: 150,
    sourceNote: "City of Beverly Hills rental $5–15K by hours/areas (~$7.3–9.6K for 5–6hr non-resident); outside catering required (beverlyhills.org, 2025)",
  },
  {
    id: "ebell-la",
    name: "The Ebell of Los Angeles",
    aliases: ["ebell", "wilshire ebell"],
    location: "los-angeles",
    venueType: "all-inclusive",
    siteFee: 12000,
    fnbMinimum: 30000,
    capacity: 300,
    sourceNote: "$12K venue hire + $30K minimum spend, in-house catering & beverage, 21% service (Breezit/venue, 2025-26)",
  },
  {
    id: "calamigos-ranch",
    name: "Calamigos Ranch",
    aliases: ["calamigos"],
    location: "los-angeles",
    venueType: "all-inclusive",
    siteFee: 8000,
    fnbMinimum: 20000,
    cateringPerGuest: 158,
    capacity: 350,
    sourceNote: "Packages from $28K all-in at ~$156–160/pp incl. venue share (The Knot/Zola, 2025-26); fee/minimum split approximated from package floor",
  },
  {
    id: "malibou-lake",
    name: "The Lodge at Malibou Lake",
    aliases: ["malibou lake", "malibou"],
    location: "los-angeles",
    venueType: "standard",
    siteFee: 6000,
    fnbMinimum: null,
    cateringPerGuest: 165,
    capacity: 200,
    sourceNote: "$150–250/pp all-in reported (jasmineruiz venue guide, 2025); site-fee share approximated at the range floor",
  },
  {
    id: "millwick",
    name: "Millwick",
    aliases: ["millwick"],
    location: "los-angeles",
    venueType: "raw-space",
    siteFee: 7595,
    fnbMinimum: null,
    capacity: 200,
    sourceNote: "12-hour rental $6.5–9.5K, starts $7,595; outside vendors (Breezit/Marvimon, 2025)",
  },
  {
    id: "smogshoppe",
    name: "SmogShoppe",
    aliases: ["smog shoppe", "smogshoppe"],
    location: "los-angeles",
    venueType: "raw-space",
    siteFee: 8000,
    fnbMinimum: null,
    capacity: 150,
    sourceNote: "Same 12-hour rental structure as sister venue Millwick, $6.5–9.5K (Marvimon, 2025)",
  },
  {
    id: "hummingbird-nest",
    name: "Hummingbird Nest Ranch",
    aliases: ["hummingbird nest", "hummingbird"],
    location: "socal-suburbs",
    venueType: "raw-space",
    siteFee: 19000,
    fnbMinimum: null,
    capacity: 300,
    sourceNote: "Site rental $19K Sat / $17K Fri–Sun / $15K weekday, 24-hour access, outside vendors (WeddingWire/Zola, 2025-26)",
  },
  {
    id: "saddlerock-ranch",
    name: "Saddlerock Ranch",
    aliases: ["saddlerock", "saddle rock"],
    location: "los-angeles",
    venueType: "raw-space",
    siteFee: 12000,
    fnbMinimum: null,
    capacity: 500,
    sourceNote: "Area-based 24-hour facility rental, Fri/Sun −$1K; ~$27K average base at 100 guests (womangettingmarried/Wedding Spot, 2025); fee approximated",
  },
  {
    id: "beverly-hills-hotel",
    name: "The Beverly Hills Hotel",
    aliases: ["beverly hills hotel", "bhh"],
    location: "los-angeles",
    venueType: "all-inclusive",
    siteFee: 5000,
    fnbMinimum: 52000,
    capacity: 500,
    sourceNote: "Basic packages from ~$52K for 150 guests before staffing extras (Breezit/Quora venue reports, 2025-26); luxury hotel ballroom",
  },
  {
    id: "terranea",
    name: "Terranea Resort",
    aliases: ["terranea"],
    location: "los-angeles",
    venueType: "all-inclusive",
    siteFee: 11000,
    fnbMinimum: 65000,
    capacity: 400,
    sourceNote: "F&B minimums $55–80K + venue rental $7–15K; documented 2025 all-in ≈ $103K at $75K minimum (venue guides, 2025)",
  },
  // ─── Orange County ──────────────────────────────────────────────────────────
  {
    id: "rancho-las-lomas",
    name: "Rancho Las Lomas",
    aliases: ["rancho las lomas"],
    location: "orange-county",
    venueType: "standard",
    siteFee: 7000,
    fnbMinimum: null,
    capacity: 300,
    sourceNote: "~$7K venue fee for the space (photographer/planner guides, 2025); catering via approved list",
  },
  {
    id: "casino-san-clemente",
    name: "The Casino San Clemente",
    aliases: ["casino san clemente"],
    location: "orange-county",
    venueType: "raw-space",
    siteFee: 8000,
    fnbMinimum: null,
    capacity: 275,
    sourceNote: "Rental $4.2–8.5K by day/spaces; ~$27K average wedding (ryanhorban pricing guide, 2023–25); outside catering",
  },
  {
    id: "ritz-laguna-niguel",
    name: "The Ritz-Carlton, Laguna Niguel",
    aliases: ["ritz carlton laguna", "ritz laguna", "laguna niguel ritz"],
    location: "orange-county",
    venueType: "all-inclusive",
    siteFee: 17000,
    fnbMinimum: 80000,
    capacity: 350,
    sourceNote: "2025 ceremony+reception rental $16–18K; Sat peak F&B minimums $75–95K; ~$650–850/pp all-in (One Story/planner guides, 2025)",
  },
  // ─── San Diego ──────────────────────────────────────────────────────────────
  {
    id: "prado-balboa",
    name: "The Prado at Balboa Park",
    aliases: ["prado", "balboa park prado"],
    location: "san-diego",
    venueType: "all-inclusive",
    siteFee: 1400,
    fnbMinimum: 25000,
    capacity: 400,
    sourceNote: "Ceremony site $1,400 + banquet F&B minimums $3–30K (≈$25K for 125-guest Saturday), 22% service (venue/womangettingmarried, 2025)",
  },
  {
    id: "hotel-del-coronado",
    name: "Hotel del Coronado",
    aliases: ["hotel del", "del coronado", "the del"],
    location: "san-diego",
    venueType: "all-inclusive",
    siteFee: 20000,
    fnbMinimum: null,
    capacity: 400,
    sourceNote: "Venue rental $10–30K+ excl. catering (SD venue cost guides, 2025); minimums vary by space — quote required",
  },
  // ─── Santa Barbara ──────────────────────────────────────────────────────────
  {
    id: "san-ysidro-ranch",
    name: "San Ysidro Ranch",
    aliases: ["san ysidro"],
    location: "santa-barbara",
    venueType: "standard",
    siteFee: 16000,
    fnbMinimum: null,
    cateringPerGuest: 250,
    capacity: 200,
    sourceNote: "Reception rental $2.5–30K by space, 6-hr event (Wedding Spot, 2025); Montecito ultra-premium in-house dining",
  },
  {
    id: "el-encanto",
    name: "Belmond El Encanto",
    aliases: ["el encanto", "belmond"],
    location: "santa-barbara",
    venueType: "all-inclusive",
    siteFee: 8000,
    fnbMinimum: null,
    cateringPerGuest: 250,
    capacity: 200,
    sourceNote: "All-inclusive service $75–600/pp by package (Carats & Cake, 2025); mid-package plate approximated",
  },
  // ─── Palm Springs ───────────────────────────────────────────────────────────
  {
    id: "colony-29",
    name: "Colony 29",
    aliases: ["colony 29", "colony29"],
    location: "palm-springs",
    venueType: "raw-space",
    siteFee: 10500,
    fnbMinimum: null,
    capacity: 150,
    sourceNote: "Event fee $9.5–11K + 3-night estate buyout (~$4K/night prime season) (Wedding Spot/Venue Report, 2025)",
  },
  {
    id: "parker-palm-springs",
    name: "Parker Palm Springs",
    aliases: ["parker", "the parker"],
    location: "palm-springs",
    venueType: "standard",
    siteFee: 3500,
    fnbMinimum: null,
    capacity: 250,
    sourceNote: "$3,500 ceremony + ballroom area incl. chairs/sound (venue guides, 2025); catering minimums quoted per event",
  },
  // ─── Temecula wine country ──────────────────────────────────────────────────
  {
    id: "ponte-winery",
    name: "Ponte Winery",
    aliases: ["ponte"],
    location: "socal-suburbs",
    venueType: "all-inclusive",
    siteFee: 6000,
    fnbMinimum: 10000,
    capacity: 300,
    sourceNote: "Packages from $10K varying by season/guests (The Knot, 2025-26); fee/minimum split approximated from package floor",
  },
  {
    id: "wilson-creek",
    name: "Wilson Creek Winery",
    aliases: ["wilson creek"],
    location: "socal-suburbs",
    venueType: "all-inclusive",
    siteFee: 3000,
    fnbMinimum: null,
    cateringPerGuest: 130,
    capacity: 300,
    sourceNote: "Weekend packages $120–140/pp (5hr, apps + dinner + toast), weekday $85–105/pp (venue pricing page, 2025)",
  },
  {
    id: "south-coast-winery",
    name: "South Coast Winery Resort",
    aliases: ["south coast winery", "south coast"],
    location: "socal-suburbs",
    venueType: "all-inclusive",
    siteFee: 5000,
    fnbMinimum: null,
    capacity: 300,
    sourceNote: "Site fee $5K; weddings from $14.5K at 50 guests; bar $25–89/pp by package (Wedding Spot, 2025)",
  },
];

// Case-insensitive lookup by id, exact name, or alias/name substring.
export function findVenueById(id: string): KnownVenue | undefined {
  return venues.find((v) => v.id === id);
}

export function searchVenues(query: string, limit = 5): KnownVenue[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return venues
    .filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.aliases.some((a) => a.includes(q) || q.includes(a))
    )
    .slice(0, limit);
}
