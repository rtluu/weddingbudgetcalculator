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
