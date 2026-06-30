"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  onLogoClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  bookingUrl?: string;
}

export default function SiteHeader({
  onLogoClick,
  showBack = false,
  onBack,
  bookingUrl = "#",
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <header
      style={{
        background: "var(--bone)",
        borderBottom: "1px solid var(--sand)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "0 -50vh 0 50vh var(--bone)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* ── Left: back-to-site + product name ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 1, minWidth: 0 }}>
          <Link
            href="/"
            aria-label="By Mosaic — home"
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/bymosaic-mark.svg" alt="By Mosaic" width={26} height={26} style={{ display: "block" }} />
          </Link>
          <button
            onClick={onLogoClick}
            aria-label="Wedding Budget Calculator — restart"
            style={{
              background: "none",
              border: "none",
              cursor: onLogoClick ? "pointer" : "default",
              padding: 0,
              flexShrink: 1,
              minWidth: 0,
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--ink)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Wedding Budget Calculator
            </span>
          </button>
        </div>

        {/* ── Right: actions ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Back arrow — results page only */}
          {showBack && onBack && (
            <button
              onClick={onBack}
              aria-label="Adjust answers"
              title="Adjust answers"
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid var(--sand)",
                background: "transparent",
                cursor: "pointer",
                color: "var(--ink)",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--alabaster)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Primary CTA */}
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 500,
              padding: isMobile ? "7px 12px" : "8px 16px",
              borderRadius: 8,
              background: "var(--clay)",
              color: "var(--bone)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--clay)")}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="currentColor"/>
            </svg>
            {isMobile ? "Chat" : "Talk to Kristina"}
          </a>
        </div>
      </div>
    </header>
  );
}
