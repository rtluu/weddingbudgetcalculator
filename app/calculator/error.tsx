"use client";

import { useEffect } from "react";
import Link from "next/link";

// Error boundary for the budget calculator so a runtime error shows a friendly
// recovery screen instead of a blank page mid-estimate.
export default function CalculatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Calculator error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        background: "var(--alabaster)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <h1 className="display-caps" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginBottom: 16 }}>
          The calculator hit a snag
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--muted)", marginBottom: 28 }}>
          Sorry about that — your inputs weren&apos;t lost. Try again, or head back and we&apos;ll pick up where you left off.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} className="btn-sage" style={{ padding: "12px 28px", fontSize: 14 }}>
            Try again
          </button>
          <Link href="/" className="btn-sage-outline" style={{ padding: "12px 28px", fontSize: 14 }}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
