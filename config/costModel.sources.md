# Cost model — research sources & calibration notes

Recalibrated **2026-07** from 2025–2026 market data. Every coefficient in
`costModel.ts` traces to the sources below. Re-run this exercise yearly; wedding
prices move ~3–8%/yr.

## Model semantics: "full-boat" estimates

Published market **averages include couples who skip categories** (roughly half
skip videography, most skip full planning, many skip transportation/favors).
This calculator itemizes all 17 categories, so its totals represent buying every
line at the tier's typical market price — by construction they land **~8–12%
above** skip-inclusive market averages at the same guest count. Each line item
matches real median vendor pricing, which is what users compare against quotes.

## Primary sources

| Source | What it anchored |
|---|---|
| The Knot 2026 Real Weddings Study (10,474 US couples married 2025) | National avg $34K–$34.2K; 117 guests avg; $292/guest; venue $12.9K (incl. rentals 74% / catering 41% of the time); photographer $3.0K; flowers $2.8K; catering $80/pp (regional range $62–$123); videographer $2.3K; DJ $1.8K; band $4.5K; dress $2.1K |
| Zola 2026 First Look Report (11,500+ couples) | National avg $36K; venue $8,573 (site-oriented); catering $6,927; bar $5,541; hidden costs $3,314 ≈ 9% of spend; SF 150-guest $84,649 vs Milwaukee $42,571 |
| The Wedding Report (wedding.report, county/metro estimates 2024–2026) | LA guest-count bands; San Diego bands ($28–35K @50–100 → $53–65K @150–200); Palm Springs ($26–32K @50–100, $43–52K @100–150, ~$390/guest); Orange County avg $49.9K at 186–222 guests (~$348/guest); Santa Barbara $72–88K @200–300; DMV avg $33.1K |
| The Knot / Zola LA market pages | LA avg $48K; LA 50/150/200-guest ≈ $29.1K / $66.8K / $83.2K; LA venue avg $16.4K; LA photographer avg $3,180 (only ~6% above national — key evidence that service-vendor prices vary far less by metro than venue/F&B) |
| WeddingWire cost guides; withjoy.com; planner blogs (Monica Browne, Blue Sapphire, Jenna Leigh) | Planner tiers (day-of $1.2–2.5K, month-of $1.5–4K, full-service $5.5K natl / $7–12K majors); DC-market 100–150-guest range $32–95K; MD ~$34.5–42K @100–150; NoVA between MD and DC; HMU (bride ~$300, full party avg $982); rentals ($425–1,000 basic; $12–20/guest full settings); decor ($2–10K); cake avg $917; invitations $5–8/guest; transport $500–1,500; officiant $300–800; favors $200–600 |
| Open-bar guides (Zola, The Knot, curatedevents, alchemiq) | Bar per-person tiers: basic $15–30, standard $30–50, premium $50–90 |
| Catering guides (chefbillblackburn, kanteensf, californiacookout) | Buffet $40–65/pp vs plated $90–150; CA $85–150/pp ($150–200 high-end); SF $85–250/pp; hidden fees add 25–40% (service 18–24% + gratuity + cake-cutting etc.) |
| Tax authorities (DC OCFO, MD Comptroller, VA Tax, CA CDTFA rates) | Prepared-food/catering tax: DC 10%, MD 6%, VA 5.3% + local meals tax (up to ~4–6.5% in NoVA cities), CA 7.75–9.5% by county, NYC 8.875% |
| Seasonality (The Knot, caratsandcake, venue/planner guides) | Sep ~15% of weddings (single busiest); Oct/Jun ~13–16%; Jan 2.0% / Feb 2.8% / Dec 3.4%; peak-Sat venue minimums 30–50% above deep winter in NY/CA; Palm Springs inverted (Nov–Apr peak; summer venue rates drop 30–50%) |
| Day-of-week (venue surveys, theperfectwedding, bridalplusessentials) | Fri/Sun 15–25% below Saturday; Mon–Thu 20–40%+ below (venue/entertainment) |
| Budget-overrun data (wedstay 200-budget analysis, The Knot) | 74–78% of couples exceed budget, average overrun ~31%; planners recommend 8–10% contingency |

## How the structure follows the data

- **Per-tier fixed + per-guest tables** (replacing the old global 0.70/1.75 tier
  scalar): tier gaps differ hugely by category — a luxury photographer is ~2×
  moderate, but luxury florals are ~4× and planning ~3.3×. Tables encode each
  category's real budget/moderate/luxury market prices.
- **`locationSensitivity`**: LA venue/F&B run 25–35% above national while LA
  photographers run ~6% above. One scalar per metro overprices services in
  expensive markets; each category now takes `1 + (locMult − 1) × sensitivity`.
- **Venue = site fee only** with a per-guest capacity component. The Knot's
  $12.9K "venue" average bundles rentals/catering for most respondents; the
  model prices catering/bar/rentals separately, so venue uses venue-only data
  ($3–11K national, scaling with capacity).
- **Guest scaling**: LA totals from The Wedding Report/Zola fit ≈ $11–15K fixed
  + ~$350/guest. The old model priced a 300-guest venue the same as a 50-guest
  one; per-guest components on venue/photography/florals/etc. reproduce the
  observed slope (model: LA moderate ≈ $36.8K @50 → $86.6K @200).
- **Per-market F&B factor** (was a flat 1.30): service charge ~18–24% compounded
  with local prepared-food tax → 1.28 (US) to 1.36 (NYC/SF); DC 1.34; MD 1.29.
- **Seasonal/DoW as venue-axis curves × per-category sensitivity** (was applied
  to the whole total): venues swing 30–50% seasonally, stationery not at all.
  Effective whole-budget swing lands at ≈ ±6–8% seasonal and −6% (Sun) to −10%
  (midweek) DoW — consistent with observed total-budget differences.
- **Contingency 9%** (was 8%): Zola's measured hidden-cost average.
- **Asymmetric range −8%/+22%** (was −10%/+15%): three-quarters of couples end
  up over, not under, their estimate (avg +31%); the distribution's right tail
  is much fatter.

## Calibration anchors (all pass in `__tests__/costModel.test.ts`)

Moderate, Saturday, annual-average unless noted:

| Case | Model | Research window |
|---|---|---|
| US 100 | $43.6K | $40–45K (full-boat over $34–36K avg) |
| LA 100 | $53.4K | $50–55K (Knot LA avg $48K + full-boat) |
| LA 50 / 150 / 200 | $36.8K / $70.0K / $86.6K | $33–38K / $65–72K / $82–92K |
| San Diego 120 | $53.6K | $48–56K |
| Palm Springs 120 | $54.4K | $47–57K |
| Orange County 120 | $57.0K | $50–60K |
| Santa Barbara 125 | $67.0K | $60–70K |
| Other major metro 150 | $78.6K | $75–90K (SF $84.6K) |
| Washington DC 125 | $63.1K | $58–68K |
| SoCal suburbs 150 | $56.8K | $50–60K (Temecula winery $45–55K + full-boat) |
| US 100 budget | $23.5K | $22–27K |
| LA 100 luxury | $108.4K | $95–115K (~$1,000+/guest luxury markets) |
| SB 150 luxury | $150.5K | $130–160K |

Calibration harness (drafts + anchor checks) lived in the session scratchpad;
the same anchors are enforced by the validation tests.

---

# v2 addendum (2026-07): metro expansion, scale effects, new inputs

## New metro research

| Metro | Spend anchors | Multiplier | F&B factor (tax basis) |
|---|---|---|---|
| New York City | Knot NYC avg $75.0K; Zola $99.5K@150 ($663/pp); Manhattan $87.7K vs outer boroughs $62.3K | 1.75 | 1.36 (8.875%) |
| SF Bay Area | Zola SF $84.6K@150 ($564/pp); Bay Area ~$524/pp; Wine Country catering from $175/pp | 1.67 | 1.36 (8.63% + SF mandates) |
| Chicago | Zola $81K@150 (city-skewed); suburbs $30–55K@100–150; ~$250+/pp | 1.28 | 1.36 (11.25–11.75% — highest US meal tax) |
| Boston | WR $42.9–52.4K@100–150; ~$381/pp; catering+bar $125–225/pp | 1.30 | 1.30 (7.0% MA meals) |
| Seattle | Metro avg $53.1K; WR $54.2–66.2K@150–200; ~$344/pp | 1.18 | 1.35 (10.35%) |
| Miami | $45–60K avg; WR $33.4–40.8K@125 (low-bias) | 1.18 | 1.30 (7.0%) |
| Dallas–Fort Worth | $25–50K range | 0.98 | 1.31 (8.25%) |
| Atlanta | Urban $30–50K; GA avg $32K | 0.95 | 1.32 (~8.9%) |
| Other US Metro (fallback) | recalibrated to mid-tier (Denver/Philly/Nashville class) | 1.25 | 1.32 |

Seasonal shapes: NYC/Chicago/Boston have hard winter valleys with Jun +
Sep/Oct peaks; Seattle peaks sharply Jul–Aug (dry season); Miami is
inverted (Nov–Apr peak; Jun–Sep heat + hurricane trough); DFW/Atlanta have
spring + fall twin peaks with hot-summer dips.

## Scale effects

- **Micro taper (≤40 guests)**: fixed costs ×(0.52 + 0.48·g/40). LA
  elopement/micro packages run $4.5–9.5K plus venue and F&B; real 20–30-guest
  LA weddings land ~$15–25K, not the ~$27K a full-vendor lineup implies.
- **Volume pricing (>200 guests)**: per-guest rates on Catering/Bar/Rentals/
  Cake slide to −10% by 300 (caterers quote volume discounts at 150+).

## New inputs

- **Venue type**: all-inclusive venues bundle rentals (74% of venues) and
  catering overhead — Rentals ×0.35, Decor ×0.8, Venue fixed ×1.15, Catering
  fixed ×0.5. Raw spaces: Venue ×0.7, Rentals ×1.6, Catering fixed ×1.3,
  Transportation ×1.2 (forum/planner consensus: raw-space totals often match
  or exceed all-inclusive once rentals and fees land).
- **Bar style** per-guest rates: beer & wine $14/18/24, standard $19/34/56,
  premium $40/55/75 (by tier), none = $0 — from open-bar tier guides
  (basic $15–30, standard $30–50, premium $50–90).

## Other v2 changes

- **Inflation**: MODEL_VINTAGE 2025.5, ~3.5%/yr escalation to the wedding
  year, capped at 3 years.
- **Cake** now carries sales tax + a cutting-fee allowance instead of the
  full 22% venue service charge.
- **Timing cap**: combined seasonal × day-of-week venue-axis swing clamped
  to [0.55, 1.25] to avoid demand double-counting.
- **Ranges**: −8%/+22% in calibrated metros; −12%/+30% in fallback buckets
  (other-major-metro, us-average) where point estimates are least certain.
- **Luxury service premium**: Photography/Videography/Planning/HMU location
  sensitivity floors at 0.7 in the luxury tier (NYC/SF luxury photographers
  run 1.6–2.5× other metros, far above the dampened moderate premium).
- Dead `perGuestRate`/`fixedBase` fields removed from `CategoryResult`;
  replaced by `included` (line-exclusion support).

---

# v3 addendum (2026-07): known-venue pricing

`config/venues.ts` carries real published pricing for ~23 popular SoCal venues
(site fees, Saturday F&B minimums, in-house per-plate rates, capacity), each
with a per-venue `sourceNote` citing where the figure came from. Sources:
venue pricing pages and PDFs, Wedding Spot, Here Comes The Guide, The Knot/
Zola listings, Breezit, and planner/photographer pricing guides (2025–26).

How venue pricing enters the estimate (`CalcOptions.venue`):
- The Venue line becomes the venue's published site fee (already local — no
  location multiplier or micro-taper; day/season demand and inflation still
  apply).
- The venue's bundling style (`venueType`) overrides the manual pick.
- Published in-house per-plate rates replace the tier catering rate.
- **F&B minimums are enforced**: if pre-tax/service catering+bar spend falls
  below the venue's minimum (× day-of-week discount × inflation), both lines
  scale up to meet it and the estimate explains why (`venueNote`,
  `fnbMinimumApplied`).
- Guest counts above the venue's listed capacity add a caution to the note.

Anchor sanity: 60 guests at Vibiana ($43,750 Sat minimum) forces the F&B
lines to the minimum; 150 guests at Greystone Mansion uses the ~$9K city
rental with outside catering modeled normally.

Reverify venue rows yearly alongside the model recalibration — venues
reprice often; each row's `sourceNote` carries its vintage.

---

# v4 addendum (2026-07): entertainment + planning packages (Kristina feedback)

By Mosaic's Kristina reviewed the estimates and corrected two lines:

## Music (DJ vs live band)

Entertainment is a **flat vendor fee** — it does not scale with guest count.
Low-end anchors per Kristina: **DJ ~$2,500, live band ~$8,000**. Higher style
tiers add production/lighting/hours. Default is DJ; the results screen lets a
couple flip to a live band. `musicRates` (config/costModel.ts):

| | Budget | Moderate | Luxury |
|---|---|---|---|
| DJ | $2,500 | $3,000 | $4,200 |
| Band | $8,000 | $9,500 | $12,500 |

Music location sensitivity dropped to 0.25 (bands/DJs are portable and vary
far less by metro than venue/F&B), so LA figures stay close to Kristina's
stated low end. The old model priced music at ~$1,900 (moderate) with a
per-guest component — both wrong per her feedback.

## Planning packages (By Mosaic Services page)

The planning line now maps to By Mosaic's three published packages (starting
prices from config/copy.ts), **tier-independent**, defaulting to **Partial**:

| Package | Starting price | Per-guest scaling |
|---|---|---|
| Month-of coordination | $2,500 | $8 |
| Partial planning (default) | $4,000 | $12 |
| Full-service planning | $6,000 | $22 |

The starting price is a floor (no micro-taper); a per-guest component scales
the fee with the event's logistical load (larger guest lists → more staff,
hours, complexity — consistent with planner-pricing guides). Location scaling
still applies (locSens 0.6), so non-SoCal markets adjust off Kristina's SoCal
anchor. Couples pick their package on the results screen.

## Anchor impact

Because the moderate **default is now Partial planning** (a real By Mosaic
anchor) plus the corrected DJ floor, moderate estimates run ~$5K above the
bare-survey averages the v1–v2 anchors targeted. The validation anchors were
re-tuned accordingly: moderate uses the DJ + Partial default; budget anchors
use Month-of; luxury anchors use Full. Flat-fee vendors (DJ, planner floor)
also legitimately keep micro-weddings higher than a pure per-guest model
(a DJ costs ~$2,500 for 20 guests or 200).
