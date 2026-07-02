<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working agreements (humans + agents)

These keep the site sound and easy to maintain. Follow them by default.

- **Ship only green.** Run `npm run verify` (typecheck + lint + test + build) before
  committing anything non-trivial. CI runs the same gate on every push/PR to `main`
  and must pass. A pre-commit hook auto-lints staged files.
- **Branch first.** Never commit directly to `main`. Cut a feature branch, then
  fast-forward merge into `main` once `verify` is green.
- **Test the logic.** Any change to `config/costModel.ts` (the money math) or the
  API routes (`app/api/**`) needs test coverage. Component behavior changes should
  get at least a smoke test (`@testing-library/react`, jsdom).
- **No dead code.** Remove unused imports/CSS/config as you go; don't leave orphans.
  If you remove a section "for now," save the JSX + copy to the project memory so it's
  restorable.
- **Prevent errors, don't silence them.** Fix lint errors rather than disabling rules;
  if a rule is genuinely wrong for a case, disable it narrowly with a comment saying why.
- **Env-driven config.** Read hosts/keys from env (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`,
  `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_BOOKING_URL`); fail loud when a required one is missing.
- **Keep the roadmap current.** `HARDENING.md` is the source of truth for maintainability
  work — check items off and add findings there.
- **CSS caveat.** After editing `app/globals.css`, restart `next dev` (Turbopack CSS HMR
  is unreliable). Component/page edits hot-reload fine.
