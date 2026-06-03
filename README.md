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

lib/
  generatePDF.tsx       — @react-pdf/renderer branded PDF document

__tests__/
  costModel.test.ts     — Jest unit tests validating all 3 cost targets
```

---

## Recalibrating the Cost Model

All coefficients live in `config/costModel.ts`. To adjust:

1. **Per-guest rates** — Edit `perGuestByTier` for Catering, Bar, Rentals, Cake/Desserts, Stationery, or Favors. These have tier-specific rates (budget/moderate/luxury).

2. **Fixed base costs** — Edit the `fixedBase` on each entry in the `categories` array. These are national baselines before tier and location multipliers.

3. **Tier multipliers** — Edit `tierMultipliers` (currently budget=0.70, moderate=1.00, luxury=1.75). These apply to all non-override categories.

4. **Location multipliers** — Edit `locationMultipliers`. Based on CWPI (Cost of Wedding Price Index) relative to national average.

5. **F&B factor** — Edit `FNB_FACTOR` (currently 1.30). Applied to Catering + Bar + Cake/Desserts to account for service charges and tax.

6. **Contingency** — Edit `contingencyRate` inside `calculateWeddingBudget()` (currently 0.08).

7. **Range spread** — Edit `rangeLow = total * 0.9` and `rangeHigh = total * 1.15`.

**After any change, run `npm test` to verify the three validation targets still pass:**
- 100 guests / moderate / los-angeles: $44,000–$47,000
- 150 guests / luxury / santa-barbara: $90,000–$115,000
- 75 guests / budget / socal-suburbs: $22,000–$27,000

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
