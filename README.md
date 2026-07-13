# By Mosaic Wedding Budget Calculator

A flagship marketing asset for [By Mosaic Events](https://bymosaic.com) — a high-end LA wedding planning studio run by Kristina. The app estimates wedding costs from guest count + location + style tier, and captures warm leads for Kristina.

**Tech stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Resend · @react-pdf/renderer

---

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in your values (see Environment Variables below)

# 3. Run dev server
npm run dev

# 4. Run unit tests
npm test
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key for sending emails. Get one at resend.com. |
| `RECIPIENT_EMAIL` | Yes | Email address that receives lead notifications (Kristina's inbox). |
| `NEXT_PUBLIC_BOOKING_URL` | Yes | Calendly or booking page URL used in all "free consultation" CTAs. |

Create `.env.local` (never commit this file):

```
RESEND_API_KEY=re_...
RECIPIENT_EMAIL=kristina@bymosaic.com
NEXT_PUBLIC_BOOKING_URL=https://calendly.com/bymosaicevents
```

---

## Project Structure

```
app/
  layout.tsx            — Google Fonts (Fraunces + Hanken Grotesk), metadata
  page.tsx              — Multi-step calculator (landing → 4 steps → results)
  globals.css           — Design tokens, grain overlay, utility classes
  api/
    lead/route.ts       — Lead capture API: scores leads A/B/C, sends emails via Resend

components/
  GuestSlider.tsx       — Spring-animated roll-counting slider (stiffness 80, damping 20)
  LocationPicker.tsx    — Pill grid with Framer Motion layout animations
  TierPicker.tsx        — Three tall cards, selected lifts -4px with clay ring
  ResultsBreakdown.tsx  — Letterpress invoice, DIY/planner toggle, lead form
  FloatingRail.tsx      — Sticky right-rail with live totals (desktop only)

config/
  costModel.ts          — All cost coefficients + calculateWeddingBudget() function
  costModel.sources.md  — Research sources behind every coefficient (2026-07)

lib/
  generatePDF.tsx       — @react-pdf/renderer branded PDF document

__tests__/
  costModel.test.ts     — Jest unit tests validating the market anchors
```

---

## Recalibrating the Cost Model

All coefficients live in `config/costModel.ts`; every value is sourced and
explained in `config/costModel.sources.md` (recalibrated 2026-07 from 2025–2026
market data — re-run yearly). To adjust:

1. **Category cost tables** — Each entry in `categories` has a `fixed` and
   `perGuest` cost per tier (budget/moderate/luxury), at the national (US
   average) baseline. These replace the old global tier multiplier: tier gaps
   are set per category from real market pricing.

2. **Sensitivity weights** — Each category has `locationSensitivity`,
   `seasonalSensitivity`, and `dowSensitivity` (0–1): how fully the metro
   premium, seasonal demand curve, and day-of-week discount apply. Venue = 1.0
   on all three; service vendors (photography, attire) are much less sensitive.

3. **Location multipliers** — `locationMultipliers` is the venue/F&B-axis metro
   premium, calibrated to metro-level average-spend data. Services feel it
   scaled by their `locationSensitivity`.

4. **F&B factors** — `fnbFactors` is per-market (service charge 18–24% ×
   prepared-food sales tax: DC 10%, MD 6%, CA 7.75–9.5%…). Applied to
   Catering + Bar + Cake/Desserts.

5. **Seasonal curves** — `seasonalMultipliers` are venue-axis monthly demand
   curves per location (Palm Springs is inverted; DC has twin peaks).

6. **Day-of-week** — `dowBaseMultipliers` (Fri −15%, Sun −20%, midweek −35% on
   the venue axis, per venue pricing surveys).

7. **Contingency & range** — `CONTINGENCY_RATE` (0.09, from Zola's measured
   hidden-cost average) and `RANGE_LOW_FACTOR`/`RANGE_HIGH_FACTOR`
   (0.92/1.22 — asymmetric because ~78% of couples end up over budget).

**Estimates are "full-boat"**: every included line item at the tier's typical
market price. Published market averages include category-skippers and sit
~8–12% below full-boat totals at the same guest count — users can exclude
optional lines on the results screen (`excludedCategories`).

8. **Options** — `calculateWeddingBudget(guests, location, tier, month?,
   dayOfWeek?, opts?)` also takes `weddingYear` (inflation from
   `MODEL_VINTAGE` at ~3.5%/yr, 3-yr cap), `venueType`
   (all-inclusive/standard/raw-space line adjustments), `barStyle`
   (none/beer-wine/standard/premium per-guest rates), and
   `excludedCategories`. Micro-weddings (≤40 guests) taper fixed costs;
   200+ guests get volume pricing on per-guest F&B/rentals.

**After any change, run `npm test` — the validation anchors include:**
- 100 guests / moderate / los-angeles: $50,000–$55,000
- 150 guests / moderate / new-york-city: $88,000–$100,000
- 100 guests / moderate / us-average: $40,000–$45,000
- 150 guests / luxury / santa-barbara: $130,000–$160,000
- 20 guests / moderate / los-angeles: $18,000–$22,500 (micro taper)
- plus anchors for every named metro (SF, Chicago, Boston, Seattle, Miami,
  DFW, Atlanta, DC…) and scaling/inflation/venue-type/bar behaviors —
  see `__tests__/costModel.test.ts`

---

## Lead Capture & Scoring

The `/api/lead` route (`app/api/lead/route.ts`) handles lead submissions. It:

1. **Scores leads silently** (A/B/C):
   - **A** (hot): guests ≥ 120 AND tier = luxury, OR guests ≥ 100 AND venueStatus = "touring"
   - **B** (warm): guests ≥ 80 OR tier = luxury
   - **C** (early): everyone else

2. **Sends two emails via Resend:**
   - Kristina's notification with lead details, score, and a reply-to link
   - The couple's estimate email with their breakdown and a booking CTA

3. **Returns** `{ success: true, score }` — never surfaces the score to the user.

### Swapping the Lead Destination

To send leads to a CRM instead of email:
- Replace the `resend.emails.send()` calls with your CRM's API client
- Add a `WEBHOOK_URL` env var and POST the lead payload there
- Common integrations: HubSpot, Dubsado, Honeybook, Airtable

### Adding a Day 2/5/12 Email Sequence

Use Resend Broadcasts or your CRM's sequence feature:
1. On form submit, add the couple to a Resend contact list/audience
2. Set up automated emails at day 2 ("Did you have questions about your estimate?"), day 5 ("Here's where LA couples typically find savings"), and day 12 ("Kristina has a few open dates for consultations")
3. Unsubscribe link is required — Resend handles this automatically with their Broadcasts feature

---

## Design System

The app uses a warm, paper-inspired palette (no pure white or black):

| Token | Value | Usage |
|---|---|---|
| Alabaster | `#F6F1E9` | Page background |
| Bone | `#FBF8F3` | Cards, elevated surfaces |
| Ink | `#2B2622` | Body text |
| Clay | `#B07A57` | Primary accent, CTAs, numbers |
| Terracotta | `#9C5A3C` | Hover state |
| Olive | `#6E7253` | Secondary accent |
| Sand | `#E4DAC9` | Borders, dividers |
| Muted | `#8C8275` | Captions, labels |

**Fonts:** Fraunces (display) + Hanken Grotesk (body) — both via Google Fonts with `next/font/google`.

---

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Add the three env vars in the Vercel dashboard (Settings → Environment Variables).

The app requires no database. All state is client-side; leads are captured via the `/api/lead` serverless function.

---

## Brand Notes

- **Vocabulary:** mosaic, every detail big or small, your story, masterpiece, Kristina, est. 2022, LA-based, free consultation
- **CTA verb:** "Schedule a free consultation."
- **Never hard-gate results** — the estimate is always shown before asking for email
- Results are intentionally un-gated to build trust. The email form offers a PDF as a value exchange.
