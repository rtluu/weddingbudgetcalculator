import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ParallaxImage from "@/components/marketing/ParallaxImage";
import { ABOUT, ABOUT_EXPLORE } from "@/config/copy";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Kristina, owner and lead planner at By Mosaic — a Los Angeles wedding & social event planner who turns events into living mosaics.",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 16.5,
  lineHeight: 1.85,
  color: "var(--ink)",
  opacity: 0.86,
};

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* ── 1 · The love of bringing people together ─────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "84px 24px 96px" }}>
        <div className="about-intro-grid" style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Eyebrow + headline */}
          <Reveal className="ai-head">
            <p
              className="font-accent"
              style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 22, color: "var(--sage-deep)", marginBottom: 18 }}
            >
              {ABOUT.s1Eyebrow}
            </p>
            <h1 className="display-caps" style={{ fontSize: "clamp(2rem, 4vw, 3.1rem)", margin: 0 }}>
              {ABOUT.s1Title}
            </h1>
          </Reveal>

          {/* Image */}
          <Reveal className="ai-image" delay={0.05}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 4",
                background: "var(--sand)",
                overflow: "hidden",
              }}
            >
              <Image
                src="/photos/samantha_and_luis-504.jpg"
                alt="A couple at their golden-hour reception, beneath a palm tree"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </Reveal>

          {/* Body */}
          <Reveal className="ai-body" delay={0.1}>
            <p style={bodyStyle}>{ABOUT.s1Body}</p>
          </Reveal>
        </div>
      </section>

      {/* ── 2 · Personalized service, heartfelt dedication (dark band) ───── */}
      <section style={{ position: "relative", padding: "132px 24px", overflow: "hidden", backgroundColor: "rgba(77, 91, 95, 1)" }}>
        {/* Veil image at 50% over the slate background — parallax on scroll */}
        <ParallaxImage src="/photos/samantha_and_luis-055.jpg" opacity={0.5} objectPosition="center 55%" />
        <Reveal>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", textAlign: "center", color: "var(--bone)" }}>
            <h2 className="display-caps" style={{ color: "var(--bone)", fontSize: "clamp(1.8rem, 4vw, 3rem)", marginBottom: 34 }}>
              {ABOUT.s2Title}
            </h2>
            <hr className="rule-thin" style={{ color: "var(--sand)", marginBottom: 26 }} />
            <p
              className="font-accent"
              style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: "clamp(1.15rem, 2vw, 1.45rem)", lineHeight: 1.55, color: "var(--alabaster)", maxWidth: 620, margin: "0 auto" }}
            >
              {ABOUT.s2Sub}
            </p>
            <hr className="rule-thin" style={{ color: "var(--sand)", marginTop: 26, marginBottom: 40 }} />
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                background: "var(--bone)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "15px 34px",
                textDecoration: "none",
              }}
            >
              {ABOUT.s2Cta}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── 3 · Hi, I'm Kristina! ────────────────────────────────────────── */}
      <section style={{ background: "var(--bone)", padding: "96px 24px" }}>
        <div
          className="about-kristina"
          style={{ maxWidth: 1180, margin: "0 auto" }}
        >
          {/* Heading */}
          <div className="ak-heading">
            <Reveal>
              <h2 className="display-caps" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.7rem)", margin: 0 }}>
                {ABOUT.greeting}
              </h2>
            </Reveal>
          </div>

          {/* Image cluster */}
          <div className="ak-images">
            <Reveal delay={0.1}>
              <div className="ak-img-wrap" style={{ position: "relative" }}>
                {/* Secondary portrait, offset up-right — sits BEHIND the main image */}
                <div
                  className="about-offset-img"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "46%",
                    aspectRatio: "3 / 4",
                    background: "var(--sand)",
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  <Image src="/photos/kristina_luu3738.jpg" alt="Kristina flipping through a wedding album" fill sizes="30vw" style={{ objectFit: "cover" }} />
                </div>
                {/* Main portrait — sits IN FRONT */}
                <div
                  className="ak-img-main"
                  style={{
                    position: "relative",
                    width: "82%",
                    aspectRatio: "4 / 5",
                    background: "var(--sand)",
                    overflow: "hidden",
                    zIndex: 2,
                    boxShadow: "0 12px 40px rgba(43,38,34,0.14)",
                  }}
                >
                  <Image src="/photos/kristina_luu3226.jpg" alt="Kristina, owner and lead planner at By Mosaic" fill sizes="40vw" style={{ objectFit: "cover" }} />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Body text */}
          <div className="ak-body">
            <Reveal>
              <div>
                <p
                  className="font-accent"
                  style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 21, lineHeight: 1.5, color: "var(--ink)", marginBottom: 24, maxWidth: 460 }}
                >
                  {ABOUT.kristinaIntro}
                </p>
                <hr style={{ border: "none", borderTop: "1px solid var(--sand)", margin: "0 0 28px" }} />
                <p style={bodyStyle}>{ABOUT.story1}</p>
                <p style={{ ...bodyStyle, marginTop: 18 }}>{ABOUT.story2}</p>
                <p style={{ ...bodyStyle, marginTop: 18 }}>{ABOUT.philosophy}</p>
                <p
                  className="font-accent"
                  style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 24, color: "var(--sage-deep)", marginTop: 28 }}
                >
                  {ABOUT.signoff}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4 · Testimonial band ─────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "0 24px 64px", overflow: "hidden", background: "var(--alabaster)" }}>
        {/* Faded Santa Anita venue as a top band, fading into the alabaster below */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 330, overflow: "hidden" }}>
          <Image
            src="/photos/l_and_b-168.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 35%", opacity: 0.16 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, var(--alabaster) 100%)" }} />
        </div>
        <Reveal>
          <figure style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center", paddingTop: 64 }}>
            <div
              style={{
                position: "relative",
                width: "min(290px, 62%)",
                aspectRatio: "3 / 4",
                margin: "0 auto 30px",
                background: "var(--sand)",
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(43,38,34,0.18)",
              }}
            >
              <Image src="/photos/l_and_b-400.jpg" alt="Lauren and Brendan on their wedding day" fill sizes="290px" style={{ objectFit: "cover" }} />
            </div>
            <blockquote className="display-caps" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.5rem)", margin: 0, color: "var(--ink)" }}>
              “{ABOUT.testimonialQuote}”
            </blockquote>
            <figcaption
              className="font-accent"
              style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 22, color: "var(--muted)", marginTop: 16, marginBottom: 30 }}
            >
              {ABOUT.testimonialAttribution}
            </figcaption>
            <Link
              href="/portfolio"
              style={{
                display: "inline-block",
                background: "var(--olive)",
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
              {ABOUT.testimonialCta}
            </Link>
          </figure>
        </Reveal>
      </section>

      {/* ── 5 · Explore cards (sage-tinted photo) ────────────────────────── */}
      <section style={{ position: "relative", padding: "84px 24px", overflow: "hidden", background: "#74A37D" }}>
        {/* Layered background: faded tablescape under a translucent sage tint (richer, ~10% darker than --sage) */}
        <Image
          src="/photos/kg004062.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "#74A37D", opacity: 0.8 }} />
        <div
          className="about-explore-grid"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
          }}
        >
          {ABOUT_EXPLORE.map((card, i) => {
            const inner = (
              <article style={{ background: "var(--bone)", boxShadow: "0 14px 40px rgba(43,38,34,0.16)", height: "100%" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", background: "var(--sand)" }}>
                  <Image src={card.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "28px 24px 32px", textAlign: "center" }}>
                  <p
                    className="font-accent"
                    style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 21, lineHeight: 1.4, color: "var(--ink)", marginBottom: 18 }}
                  >
                    {card.label}
                  </p>
                  <svg width="40" height="14" viewBox="0 0 40 14" fill="none" style={{ display: "inline-block" }}>
                    <path d="M0 7h37M31 1l6 6-6 6" stroke="var(--sage-deep)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </article>
            );
            return (
              <Reveal as="div" key={card.label} delay={i * 0.08}>
                {card.external ? (
                  <a href={card.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                    {inner}
                  </a>
                ) : (
                  <Link href={card.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
