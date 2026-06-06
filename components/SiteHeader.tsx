"use client";

interface Props {
  onLogoClick?: () => void;
  /** Show a back arrow icon (results page). Default: false */
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
  return (
    <header
      style={{
        background: "var(--bone)",
        borderBottom: "1px solid var(--sand)",
        position: "sticky",
        top: 0,
        zIndex: 40,
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
        {/* ── Left: logo mark + wordmark ── */}
        <button
          onClick={onLogoClick}
          aria-label="By Mosaic Events — home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: onLogoClick ? "pointer" : "default",
            padding: 0,
            flexShrink: 0,
          }}
        >
          {/* Circle mark — real brand SVG */}
          <img
            src="/logos/bymosaic-mark.svg"
            alt=""
            aria-hidden="true"
            style={{ width: 34, height: 34, flexShrink: 0 }}
          />
          {/* Wordmark */}
          <img
            src="/logos/bymosaic-wordmark.svg"
            alt="By Mosaic"
            style={{ height: 14, width: "auto", flexShrink: 0 }}
          />
        </button>

        {/* ── Right: actions ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Back arrow — icon only, no text, so it never crowds */}
          {showBack && onBack && (
            <button
              onClick={onBack}
              aria-label="Adjust answers"
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
              title="Adjust answers"
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
              padding: "8px 16px",
              borderRadius: 8,
              background: "var(--clay)",
              color: "var(--bone)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--clay)")}
          >
            Talk to Kristina
          </a>
        </div>
      </div>
    </header>
  );
}
