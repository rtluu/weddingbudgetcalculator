import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import HeroVideo from "@/components/marketing/HeroVideo";
import TestimonialModal from "@/components/marketing/TestimonialModal";
import SocialProof from "@/components/marketing/SocialProof";
import Carousel from "@/components/marketing/Carousel";
import CTALink from "@/components/marketing/CTALink";
import { HOME, SERVICES } from "@/config/copy";

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 17,
  lineHeight: 1.8,
  color: "var(--ink)",
  opacity: 0.86,
};

const accentItalic: React.CSSProperties = {
  fontFamily: "var(--font-accent)",
  fontStyle: "italic",
};

const PORTFOLIO_CAROUSEL = [
  "/photos/samantha_and_luis-460.jpg",
  "/photos/l_and_b-396.jpg",
  "/photos/280064253.jpg",
  "/photos/kristina_luu4052.jpg",
  "/photos/094a9323.jpg",
  "/photos/4.jpg",
];

// Filled button matching the original's pill (sage-deep, uppercase)
const ctaButton: React.CSSProperties = {
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
};

export default function HomePage() {
  return (
    <>
      {/* ── 1 · Hero (video) ─────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "92vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <HeroVideo src="/photos/hero.mp4" poster="/photos/l_and_b-168.jpg" />
        <div style={{ position: "absolute", inset: 0, background: "rgba(43,38,34,0.34)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "var(--bone)", padding: "0 24px" }}>
          <h1 className="display-caps" style={{ color: "var(--bone)", fontSize: "clamp(2.6rem, 8vw, 5.5rem)", lineHeight: 1.02, margin: 0 }}>
            {HOME.heroBrand}
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 2.4vw, 1.6rem)", letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--bone)", margin: "10px 0 0", paddingLeft: "0.42em" }}>
            {HOME.heroBrandSub}
          </p>

          {/* EST 2022 seal */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "40px 0 30px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--bone)" }}>Est</span>
            <span style={{ width: 62, height: 62, borderRadius: "50%", background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/bymosaic-mark.svg" alt="" width={62} height={62} style={{ display: "block" }} />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.18em", color: "var(--bone)" }}>2022</span>
          </div>

          <p style={{ ...accentItalic, fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "var(--bone)" }}>{HOME.heroEyebrow}</p>
          <TestimonialModal />
        </div>
      </section>

      {/* ── 2 · Services preview (mirrors /services "My Services") ───────── */}
      <section style={{ background: "var(--alabaster)", padding: "100px 24px 96px" }}>
        <Reveal>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <h2 className="display-caps" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", marginBottom: 26 }}>
              {HOME.introTitle}
            </h2>
            <hr className="rule-thin" style={{ color: "var(--muted)", marginBottom: 26 }} />
            <p style={{ ...accentItalic, fontSize: "clamp(1.15rem, 2vw, 1.5rem)", color: "var(--ink)" }}>
              {HOME.introQuote}
            </p>
          </div>
        </Reveal>

        <div className="home-services-grid">
          {SERVICES.map((s, i) => (
            <Reveal as="div" key={s.slug} delay={i * 0.08}>
              <Link href={`/services#${s.slug}`} className="home-service-card">
                <div className="home-service-img" style={{ position: "relative", aspectRatio: "4 / 5", background: "var(--sand)" }}>
                  <Image src={s.image} alt={s.name} fill sizes="(max-width:820px) 40vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <div className="home-service-body">
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sage-deep)" }}>
                    0{i + 1}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 2vw, 1.5rem)", fontWeight: 500, color: "var(--ink)", lineHeight: 1.2, marginTop: 8 }}>
                    {s.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.7, color: "var(--muted)", marginTop: 12 }}>
                    {s.summary}
                  </p>
                  <span style={{ display: "inline-block", marginTop: 16, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: "var(--sage-deep)" }}>
                    Learn more →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Link href="/services" style={ctaButton}>{HOME.introCta}</Link>
        </div>
      </section>

      {/* ── 4 · Portfolio — living mosaics ───────────────────────────────── */}
      <section style={{ background: "var(--bone)", padding: "90px 24px 0" }}>
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <h2 className="display-caps" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", marginBottom: 28 }}>
              {HOME.portfolioTitle}
            </h2>
            <p style={{ ...accentItalic, fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)", color: "var(--muted)", lineHeight: 1.6, marginBottom: 30 }}>
              {HOME.portfolioBody}
            </p>
            <hr className="rule-thin" style={{ color: "var(--muted)", marginBottom: 36 }} />
            <Link href="/portfolio" style={ctaButton}>{HOME.portfolioCta}</Link>
          </div>
        </Reveal>
        <div style={{ marginTop: 96, width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
          <Carousel images={PORTFOLIO_CAROUSEL} variant="monogram" height={560} gap={20} />
        </div>
      </section>

      {/* ── 6 · Meet the Planner ─────────────────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "96px 24px 40px" }}>
        <div className="home-planner" style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal className="home-planner-text">
            <p style={{ ...accentItalic, fontSize: 22, color: "var(--sage-deep)", marginBottom: 14 }}>{HOME.plannerEyebrow}</p>
            <h2 className="display-caps" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 28 }}>{HOME.plannerName}</h2>
            <p style={bodyStyle}>{HOME.plannerBody}</p>
            <Link href="/about" style={{ ...ctaButton, marginTop: 32 }}>{HOME.plannerCta}</Link>
          </Reveal>
          <Reveal className="home-planner-img" delay={0.1}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden", background: "var(--sand)" }}>
              <Image src="/photos/kristina_luu3747.jpg" alt="Kristina Luu, owner and lead planner at By Mosaic" fill sizes="(max-width:760px) 100vw, 45vw" style={{ objectFit: "cover" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7 · Testimonials row ─────────────────────────────────────────── */}
      <SocialProof showStats={false} bordered={false} background="var(--alabaster)" padding="40px 24px 72px" />

      {/* ── 8 · Closing CTA — masterpiece ────────────────────────────────── */}
      <section className="home-closing" style={{ position: "relative", overflow: "hidden", background: "var(--bone)" }}>
        {/* Full-block background image — shown at hamburger/mobile sizes */}
        <div className="home-closing-bg" aria-hidden="true">
          <Image src="/photos/bridal_bouquet.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="home-closing-img home-closing-img-1">
          <Image src="/photos/kg004048.jpg" alt="" aria-hidden fill sizes="300px" style={{ objectFit: "cover" }} />
        </div>
        <div className="home-closing-img home-closing-img-2">
          <Image src="/photos/bridal_bouquet.jpg" alt="" aria-hidden fill sizes="260px" style={{ objectFit: "cover" }} />
        </div>
        <div
          className="home-closing-text"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            margin: "0 auto",
            padding: "44px 48px",
            borderRadius: 12,
            background: "rgba(246, 241, 233, 0.6)",
            backdropFilter: "blur(14px) saturate(1.08)",
            WebkitBackdropFilter: "blur(14px) saturate(1.08)",
            boxShadow: "0 12px 48px rgba(43, 38, 34, 0.06)",
          }}
        >
          <Reveal>
            <p style={{ ...accentItalic, fontSize: 22, color: "var(--sage-deep)", marginBottom: 14 }}>{HOME.closingEyebrow}</p>
            <h2 className="display-caps" style={{ fontSize: "clamp(2rem, 4.6vw, 3rem)", marginBottom: 28 }}>{HOME.closingTitle}</h2>
            <p style={bodyStyle}>{HOME.closingBody}</p>
            <CTALink href="/contact" location="home_closing" label={HOME.closingCta} style={{ ...ctaButton, marginTop: 32 }}>
              {HOME.closingCta}
            </CTALink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
