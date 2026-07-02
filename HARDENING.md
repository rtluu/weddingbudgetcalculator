# Hardening & maintainability roadmap

A living plan to keep the By Mosaic site + budget calculator sound, testable, and
easy to iterate on. Work top-down; each phase is independently shippable. Check
items off as they land.

## Phase 0 — Guardrails (foundation; do first)

The highest-leverage work: make correctness automatic instead of manual.

- [x] **Fix ESLint scope.** Add `.netlify/**` (and any other build output) to
      `globalIgnores` in `eslint.config.mjs`. Today `npx eslint .` = ~5,900 false
      problems from `.netlify/`, hiding ~29 real ones. `npm run lint` must be clean-signal.
- [x] **CI on every PR/push** (`.github/workflows/ci.yml`): `npm ci`, typecheck
      (`tsc --noEmit`), `npm run lint`, `npm test`, `npm run build`. Block merge on red.
- [x] **Pre-commit hook** (husky + lint-staged): run eslint --fix + tsc on staged files.
- [x] **Add `typecheck` script** (`tsc --noEmit`) and wire into CI + pre-commit.
- [x] **Enable jsdom test env** for component tests (`jest-environment-jsdom` is already
      installed) + `@testing-library/react` so we can test UI, not just pure logic.
- [x] **Deploy gate**: only `netlify deploy --prod` after CI is green (document in
      `deploy-workflow` memory; consider Netlify's own build checks).

## Phase 1 — Correctness & tests

- [x] Fix the 12 real ESLint errors: `react/no-unescaped-entities`, the 2×
      `setState`-in-effect (calculator), and 2× `Cannot create components during
      render` (`lib/generatePDF.tsx` — hoist component defs out of render).
- [x] Clear the 17 warnings (unused vars; `aria-expanded` on `role=radio`).
- [x] **Expand cost-model tests** (`config/costModel.ts`): seasonal multipliers,
      day-of-week adjustments, contingency, F&B service, every location/tier, edge
      guest counts. This is the money math — it deserves broad coverage.
- [ ] **Test the lead/contact API handlers** (`app/api/**`): payload validation,
      missing-env behavior, Resend failure paths (mock Resend).
- [ ] **Component smoke tests** for the calculator flow (step transitions, estimate
      updates) and the two portals (TestimonialModal, PortfolioGallery lightbox).
- [ ] **Add runtime validation** (zod) at API boundaries + form inputs; return typed errors.
- [x] **Error boundaries** around the calculator and the marketing route group; a
      friendly fallback instead of a white screen.
- [x] **Fail loud on missing env** in prod (Resend key, GA id, booking URL) — log/throw
      at startup rather than silently no-op'ing lead delivery.

## Phase 2 — Consolidation & dead-code removal

- [ ] Extract shared style tokens/among marketing pages: `bodyStyle`, `ctaButton`,
      `accentItalic` → one module (e.g. `components/marketing/styles.ts`).
- [x] Extract a **`<PageHeader eyebrow title subtitle />`** component for the
      Services/Portfolio/Blog/Contact heroes (min-height + flex centering in one place).
- [x] Remove dead CSS (`.home-collage*`, `.home-testimonial*`) and unused config keys
      (`bestFor`, `effortlessEyebrow`, `SERVICES_PAGE.title/intro`, `heroTitle/heroTagline`,
      `ABOUT.s1*/s2*`, `collageCaption*`) — or reinstate the sections that used them.
- [~] (in progress) Split the 1,147-line `app/calculator/page.tsx` into a state hook +
      per-step components; shrink the client boundary where possible.

## Phase 3 — SEO, metadata & performance

- [x] **Structured data (JSON-LD)**: `LocalBusiness` (site-wide), `FAQPage` (Services
      FAQs), `BlogPosting` (per post), `Review`/`AggregateRating` (testimonials).
- [x] **Per-page / per-post OG images** (dynamic `opengraph-image` in blog/[slug], etc.).
- [x] Set `metadataBase` from an env-driven site URL so canonical/OG match the live host
      (netlify subdomain now, `bymosaic.com` later) — no code change at domain switch.
- [ ] Audit client boundaries; lazy-load below-the-fold heavy client components
      (calculator band, carousels) and confirm framer-motion isn't blocking LCP.
- [ ] Lighthouse/Core-Web-Vitals pass; add `@next/third-parties` GA only in prod with a real id.

## Phase 4 — Ongoing agentic guardrails

- [x] `AGENTS.md`/`CLAUDE.md` house rules: "build+lint+test must pass; branch-first;
      no direct commits to main; no dead code left behind."
- [x] A `verify` script (`npm run verify` = typecheck + lint + test + build) as the
      single gate agents and humans run before shipping.
- [x] Dependabot/renovate for dependency freshness; pin Node in CI to match Netlify.
- [x] Keep this file updated as the source of truth for maintainability work.

---
_Audit baseline (2026-07-02): 1 test file; no CI/hooks; ESLint scanning `.netlify/`
(5,905 false problems) masking 29 real ones (12 errors); no JSON-LD; calculator is a
1,147-line monolith; API routes silently no-op without env vars._
