"use client";

import { useEffect } from "react";
import Link from "next/link";

// Route-level error boundary for the marketing pages: a friendly fallback
// instead of a broken screen, with a way to recover.
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Marketing route error:", error);
  }, [error]);

  return (
    <section
      style={{
        minHeight: "60vh",
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
          Something went wrong
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--muted)", marginBottom: 28 }}>
          We hit an unexpected error. Please try again — and if it keeps happening, reach out and we&apos;ll help.
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
    </section>
  );
}
