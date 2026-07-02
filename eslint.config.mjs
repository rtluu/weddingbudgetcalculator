import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Compiler advisory rules. These flag legitimate, working patterns in
    // the existing calculator/date-picker (one-time URL hydration, derived state
    // computed in an effect, manual memoization). Keep them visible as warnings;
    // the proper refactor (derived state → useMemo) is tracked in HARDENING.md
    // under the calculator cleanup. Everything else stays an error.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build/deploy artifacts that must not be linted:
    ".netlify/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
