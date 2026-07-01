"use client";

import { useSyncExternalStore } from "react";

// SSR-safe media-query subscription (avoids setState-in-effect).
function useIsMobile(query = "(max-width: 600px)") {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

interface Props {
  step: number;            // 1-4 questions, 5 soft-gate, 6 results
  onBack: () => void;
  onRestart: () => void;
  bookingUrl?: string;
}

// Slim calculator toolbar that sits directly beneath the site nav. Carries the
// tool identity and the app controls (back / step progress / start over / booking)
// that used to live in the standalone SiteHeader.
export default function CalcToolbar({ step, onBack, onRestart, bookingUrl = "#" }: Props) {
  const isMobile = useIsMobile();
  const showProgress = step >= 1 && step <= 4;

  return (
    <div
      style={{
        position: "sticky",
        top: 68, // sits under the 68px-tall SiteNav
        zIndex: 40,
        background: "var(--bone)",
        borderBottom: "1px solid var(--sand)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left — back + tool identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button onClick={onBack} aria-label="Go back" style={ghostBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!isMobile && <span>Back</span>}
          </button>
          {!isMobile && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "var(--ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Wedding Budget Calculator
            </span>
          )}
        </div>

        {/* Center — progress */}
        {showProgress && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--sage-deep)",
              whiteSpace: "nowrap",
            }}
          >
            Step {step} of 4
          </span>
        )}

        {/* Right — start over + booking */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={onRestart} style={ghostBtn}>
            {isMobile ? "Reset" : "Start over"}
          </button>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 500,
              padding: isMobile ? "6px 12px" : "7px 16px",
              borderRadius: 6,
              background: "var(--sage-deep)",
              color: "var(--bone)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#43604B")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--sage-deep)")}
          >
            {isMobile ? "Chat" : "Talk to Kristina"}
          </a>
        </div>
      </div>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "6px 4px",
  fontFamily: "var(--font-body)",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--muted)",
  whiteSpace: "nowrap",
};
