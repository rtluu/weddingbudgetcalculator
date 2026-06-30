import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS, SITE } from "@/config/site";

export default function SiteFooterFull() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "var(--alabaster)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 24px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/bymosaic-mark.svg" alt="" aria-hidden="true" width={34} height={34} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>
                By Mosaic
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontStyle: "italic",
                fontSize: 18,
                lineHeight: 1.4,
                color: "var(--sand)",
                opacity: 0.9,
              }}
            >
              Crafting events as unique as mosaics.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h2 style={footerHeadingStyle}>Explore</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={footerLinkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/calculator" style={footerLinkStyle}>
                  Budget Calculator
                </Link>
              </li>
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h2 style={footerHeadingStyle}>Connect</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <a href={`mailto:${SITE.email}`} style={footerLinkStyle}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} style={footerLinkStyle}>
                  {SITE.phone}
                </a>
              </li>
              {SOCIAL_LINKS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(228, 218, 201, 0.18)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.04em",
            color: "var(--sand)",
            opacity: 0.7,
          }}
        >
          <span>© {year} By Mosaic LLC · Est. {SITE.established}</span>
          <span>{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

const footerHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--sage)",
  marginBottom: 16,
};

const footerLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--alabaster)",
  textDecoration: "none",
  opacity: 0.85,
};
