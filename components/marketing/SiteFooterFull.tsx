import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS, SITE } from "@/config/site";
import SocialIcon from "./SocialIcon";

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
