import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS, SITE } from "@/config/site";

// Social glyphs
function SocialIcon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "currentColor" } as const;
  if (name === "Instagram")
    return (
      <svg {...common}><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s-.01 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.9.07s-3.63-.01-4.9-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.21 8.9 3.2 9.25 3.2 12s.01 3.1.07 4.34c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.59.07-4.34s-.01-3.1-.07-4.34c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.5 4.01 15.15 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 16.94 4.94 4.94 0 0 1 12 7.06zm0 8.14A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm6.3-8.34a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z"/></svg>
    );
  if (name === "Facebook")
    return (
      <svg {...common}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
    );
  // TikTok
  return (
    <svg {...common}><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12v-3.2a5.7 5.7 0 0 0-.77-.05 5.69 5.69 0 1 0 5.69 5.69V9.4a7.33 7.33 0 0 0 4.29 1.37V7.68a4.28 4.28 0 0 1-3.24-1.86z"/></svg>
  );
}

export default function SiteFooterFull() {
  const year = new Date().getFullYear();
  const nav = NAV_LINKS;

  return (
    <footer style={{ marginTop: "auto", background: "var(--alabaster)", borderTop: "1px solid var(--sand)" }}>
      {/* ── 3-column bottom bar ──────────────────────────────────────────── */}
      <div className="footer-cols">
        {/* Left — nav */}
        <nav className="footer-col-left" aria-label="Footer">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={navLink}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Center — brand */}
        <div className="footer-col-center">
          <Link href="/" aria-label="By Mosaic — home" style={{ textDecoration: "none", display: "inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/bymosaic-mark.svg" alt="" aria-hidden="true" width={64} height={64} style={{ display: "block", margin: "0 auto 16px" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              By Mosaic
            </span>
          </Link>
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 17, color: "var(--muted)", margin: "12px 0 16px" }}>
            {SITE.tagline}
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.06em", color: "var(--muted)", opacity: 0.8 }}>
            © {year} By Mosaic LLC · Est. {SITE.established}
          </p>
        </div>

        {/* Right — social + email */}
        <div className="footer-col-right">
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
            {SOCIAL_LINKS.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ color: "var(--muted)" }}>
                <SocialIcon name={s.label} />
              </a>
            ))}
          </div>
          <a href={`mailto:${SITE.email}`} style={{ ...navLink, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 20, display: "inline-block" }}>
            {SITE.email}
          </a>
        </div>
      </div>
    </footer>
  );
}

const navLink: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ink)",
  textDecoration: "none",
  opacity: 0.8,
};
