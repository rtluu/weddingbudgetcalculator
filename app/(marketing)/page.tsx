import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import Eyebrow from "@/components/marketing/Eyebrow";
import HeroVideo from "@/components/marketing/HeroVideo";
import Carousel from "@/components/marketing/Carousel";
import CTALink from "@/components/marketing/CTALink";
import { HOME } from "@/config/copy";

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
            <span style={{ width: 62, height: 62, borderRadius: "50%", background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/bymosaic-mark.svg" alt="" width={36} height={36} />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.18em", color: "var(--bone)" }}>2022</span>
          </div>

          <p style={{ ...accentItalic, fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "var(--bone)" }}>{HOME.heroEyebrow}</p>
          <hr style={{ border: "none", borderTop: "1px solid rgba(251,248,243,0.45)", width: 280, maxWidth: "70%", margin: "18px auto 0" }} />
        </div>
      </section>

      {/* ── 2 · Brand intro ──────────────────────────────────────────────── */}
      <section style={{ background: "var(--bone)", padding: "100px 24px 88px" }}>
        <Reveal>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <h2 className="display-caps" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", marginBottom: 30 }}>
              {HOME.introTitle}
            </h2>
            <hr className="rule-thin" style={{ color: "var(--muted)", marginBottom: 26 }} />
            <p style={{ ...accentItalic, fontSize: "clamp(1.15rem, 2vw, 1.5rem)", color: "var(--ink)", marginBottom: 26 }}>
              {HOME.introQuote}
            </p>
            <hr className="rule-thin" style={{ color: "var(--muted)", marginBottom: 34 }} />
            <p style={{ ...bodyStyle, textAlign: "center", maxWidth: 660, margin: "0 auto 36px" }}>{HOME.introBody}</p>
            <Link href="/services" style={ctaButton}>{HOME.introCta}</Link>
          </div>
        </Reveal>
      </section>

      {/* ── 3 · "Creating mosaic events since 2022" collage ──────────────── */}
      <section style={{ background: "var(--bone)", padding: "24px 24px 100px" }}>
        <div className="home-collage" style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal className="home-collage-l">
            <div className="home-collage-img" style={{ aspectRatio: "3 / 4" }}>
              <Image src="/photos/brownfoxcreative_clp_76.jpg" alt="" fill sizes="(max-width:760px) 100vw, 28vw" style={{ objectFit: "cover" }} />
            </div>
            <p style={{ ...accentItalic, fontSize: 19, color: "var(--muted)", textAlign: "center", marginTop: 22 }}>{HOME.collageCaptionLeft}</p>
          </Reveal>
          <Reveal className="home-collage-c" delay={0.08}>
            <div className="home-collage-img" style={{ aspectRatio: "3 / 4" }}>
              <Image src="/photos/280064243.jpg" alt="" fill sizes="(max-width:760px) 100vw, 40vw" style={{ objectFit: "cover" }} />
            </div>
          </Reveal>
          <Reveal className="home-collage-r" delay={0.16}>
            <div className="home-collage-img" style={{ aspectRatio: "3 / 4" }}>
              <Image src="/photos/kristina_luu3579.jpg" alt="" fill sizes="(max-width:760px) 100vw, 28vw" style={{ objectFit: "cover" }} />
            </div>
            <p style={{ ...accentItalic, fontSize: 19, color: "var(--muted)", textAlign: "center", marginTop: 22 }}>{HOME.collageCaptionRight}</p>
          </Reveal>
        </div>
      </section>

      {/* ── 4 · Portfolio — living mosaics ───────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "90px 24px 0" }}>
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

      {/* ── 5 · Calculator band (our addition) ───────────────────────────── */}
      <section style={{ background: "var(--sage-mist)", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
          <Reveal>
            <Eyebrow>{HOME.calcEyebrow}</Eyebrow>
            <h2 className="display-lg" style={{ marginBottom: 18 }}>{HOME.calcTitle}</h2>
            <p style={bodyStyle}>{HOME.calcBody}</p>
            <CTALink href="/calculator" location="home_calc_band" label={HOME.calcCta} className="btn-sage" style={{ marginTop: 26, padding: "14px 30px", fontSize: 16 }}>
              {HOME.calcCta} →
            </CTALink>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", borderRadius: 12, overflow: "hidden", background: "var(--sand)", boxShadow: "0 12px 40px rgba(43,38,34,0.10)" }}>
              <Image src="/photos/kristina_luu4052.jpg" alt="A thoughtfully styled reception tablescape" fill sizes="(max-width:700px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 6 · Meet the Planner ─────────────────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "96px 24px" }}>
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

      {/* ── 7 · Testimonial (full-bleed dark) ────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "96px 24px", background: "#4D5B5F" }}>
        <Image src="/photos/kristina_luu3579.jpg" alt="" aria-hidden fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.16 }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(57,69,72,0.7)" }} />
        <div className="home-testimonial" style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto" }}>
          <Reveal className="home-testimonial-img">
            <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden", background: "var(--sand)", boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}>
              <Image src="/photos/samantha_and_luis-487.jpg" alt="Samantha and Luis on their wedding day" fill sizes="(max-width:760px) 100vw, 38vw" style={{ objectFit: "cover" }} />
            </div>
          </Reveal>
          <Reveal className="home-testimonial-text" delay={0.1}>
            <blockquote className="display-caps" style={{ color: "var(--bone)", fontSize: "clamp(1.7rem, 3.6vw, 2.7rem)", margin: 0 }}>
              “{HOME.testimonialQuote}”
            </blockquote>
            <p style={{ ...accentItalic, fontSize: 20, color: "var(--alabaster)", marginTop: 22 }}>{HOME.testimonialAttribution}</p>
          </Reveal>
        </div>
      </section>

      {/* ── 8 · Closing CTA — masterpiece ────────────────────────────────── */}
      <section className="home-closing" style={{ position: "relative", overflow: "hidden", background: "var(--alabaster)" }}>
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
