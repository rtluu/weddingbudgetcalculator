import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import Eyebrow from "@/components/marketing/Eyebrow";
import { SERVICES, SERVICES_PAGE, SERVICES_FAQ } from "@/config/copy";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-Service Wedding Planning, Event Management (Day-of Coordination), and Social Event Planning with By Mosaic — thoughtful planning for a stress-free celebration.",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 17,
  lineHeight: 1.8,
  color: "var(--ink)",
  opacity: 0.86,
};

export default function ServicesPage() {
  return (
    <div className="services-page">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", minHeight: "clamp(360px, 46vh, 520px)", padding: "56px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Eyebrow align="center">Wedding &amp; social event planning</Eyebrow>
            <h1 className="display-xl" style={{ marginBottom: 22 }}>
              Let&apos;s create your{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                <em className="italic-serif" style={{ color: "var(--sage-deep)" }}>mosaic</em> event
              </span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              {SERVICES_PAGE.heroTagline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── My Services (alternating image/text rows) ────────────────────── */}
      <section style={{ background: "var(--bone)", padding: "80px 24px 88px", borderTop: "1px solid var(--sand)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
            {SERVICES.map((s, i) => (
              <Reveal as="div" key={s.slug}>
                <article id={s.slug} style={{ scrollMarginTop: 100 }} className={`svc-row ${i % 2 === 1 ? "svc-row--right" : "svc-row--left"}`}>
                  {/* Number + service name */}
                  <div className="svc-head">
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-deep)", marginBottom: 12 }}>
                      0{i + 1}
                    </p>
                    <h3 className="display-lg" style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", margin: 0 }}>
                      {s.name}
                    </h3>
                  </div>
                  {/* Image */}
                  <div className="svc-media">
                    <div className="svc-media-frame">
                      <Image src={s.image} alt={s.name} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                    </div>
                  </div>
                  {/* Details + inquire */}
                  <div className="svc-body">
                    <p style={bodyStyle}>{s.full}</p>

                    <details className="svc-included">
                      <summary className="svc-included-summary">What&apos;s included</summary>
                      <ul style={{ listStyle: "none", padding: "0 0 18px", margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {s.included.map((item) => (
                          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.5, color: "var(--ink)", opacity: 0.9 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3, color: "var(--sage-deep)" }} aria-hidden="true">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </details>

                    <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)", marginTop: 26 }}>
                      {s.investment}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--sage-deep)", marginTop: 6 }}>
                      {s.timeline}
                    </p>
                    <Link href="/contact" className="btn-sage-outline" style={{ marginTop: 24, fontSize: 14 }}>
                      Inquire
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 · FAQs (accordion) ─────────────────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "88px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <h2 className="display-caps" style={{ textAlign: "center", fontSize: "clamp(1.8rem, 3.6vw, 2.5rem)", marginBottom: 44 }}>
              {SERVICES_PAGE.faqHeader}
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {SERVICES_FAQ.map((item) => (
              <details key={item.q} style={{ borderBottom: "1px solid var(--sand)", padding: "20px 4px" }}>
                <summary
                  className="font-accent faq-summary"
                  style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 21, color: "var(--ink)", cursor: "pointer" }}
                >
                  {item.q}
                </summary>
                <p style={{ ...bodyStyle, fontSize: 16, marginTop: 14 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · Testimonial (full-bleed) ─────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "110px 24px", background: "var(--ink)" }}>
        <Image src="/photos/280064253.jpg" alt="" aria-hidden="true" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(43,38,34,0.72), rgba(43,38,34,0.32))" }} />
        <Reveal>
          <figure style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", color: "var(--bone)" }}>
            <blockquote className="display-caps" style={{ color: "var(--bone)", fontSize: "clamp(1.7rem, 3.6vw, 2.7rem)", margin: 0, maxWidth: 620 }}>
              “{SERVICES_PAGE.testimonialQuote}”
            </blockquote>
            <p
              className="font-accent"
              style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 18, lineHeight: 1.6, color: "var(--alabaster)", maxWidth: 460, marginTop: 22 }}
            >
              {SERVICES_PAGE.testimonialBody}
            </p>
            <figcaption
              style={{ marginTop: 22, fontFamily: "var(--font-body)", fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sage)" }}
            >
              {SERVICES_PAGE.testimonialAttribution}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ── 7 · Closing CTA — effortless-style frosted panel + accents ───── */}
      <section className="svc-effortless" style={{ position: "relative", overflow: "hidden", background: "var(--alabaster)" }}>
        {/* Full-block background image — shown at hamburger/mobile sizes */}
        <div className="svc-eff-bg" aria-hidden="true">
          <Image src="/photos/kg004048.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        {/* Floating accent photos — shown above the hamburger breakpoint */}
        <div className="svc-eff-img svc-eff-img-1">
          <Image src="/photos/13.jpg" alt="" aria-hidden="true" fill sizes="280px" style={{ objectFit: "cover" }} />
        </div>
        <div className="svc-eff-img svc-eff-img-2">
          <Image src="/photos/kg004048.jpg" alt="" aria-hidden="true" fill sizes="320px" style={{ objectFit: "cover" }} />
        </div>
        <div
          className="svc-eff-text"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 660,
            margin: "0 auto",
            padding: "44px 48px",
            borderRadius: 12,
            background: "rgba(246, 241, 233, 0.6)",
            backdropFilter: "blur(14px) saturate(1.08)",
            WebkitBackdropFilter: "blur(14px) saturate(1.08)",
            boxShadow: "0 12px 48px rgba(43, 38, 34, 0.06)",
            textAlign: "center",
          }}
        >
          <Reveal>
            <h2 className="display-caps" style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", marginBottom: 26 }}>
              {SERVICES_PAGE.ctaTitle}
            </h2>
            <hr className="rule-thin" style={{ color: "var(--muted)", marginBottom: 28 }} />
            <p style={{ ...bodyStyle, textAlign: "center", maxWidth: 520, margin: "0 auto 32px" }}>
              {SERVICES_PAGE.ctaBody}
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                background: "var(--sage-deep)",
                color: "var(--bone)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "15px 34px",
                textDecoration: "none",
              }}
            >
              {SERVICES_PAGE.cta}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
