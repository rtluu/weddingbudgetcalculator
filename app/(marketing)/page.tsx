import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import Eyebrow from "@/components/marketing/Eyebrow";
import ServiceCard from "@/components/marketing/ServiceCard";
import PortfolioGrid from "@/components/marketing/PortfolioGrid";
import SocialProof from "@/components/marketing/SocialProof";
import CTALink from "@/components/marketing/CTALink";
import { HOME, SERVICES, PORTFOLIO, PRIMARY_CTA, SECONDARY_CTA } from "@/config/copy";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "86vh", display: "flex", alignItems: "flex-end" }}>
        <Image
          src="/photos/samantha_and_luis-460.jpg"
          alt="A golden-hour wedding in Rome"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(43,38,34,0.66) 0%, rgba(43,38,34,0.18) 45%, rgba(43,38,34,0.10) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            padding: "0 24px 72px",
            color: "var(--bone)",
          }}
        >
          <Reveal>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.9,
                marginBottom: 18,
              }}
            >
              {HOME.heroEyebrow}
            </p>
            <h1
              className="display-xl"
              style={{ color: "var(--bone)", maxWidth: 920, marginBottom: 22 }}
            >
              Crafting events as unique as{" "}
              <em className="italic-serif" style={{ color: "var(--sage)" }}>
                mosaics
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 19,
                lineHeight: 1.6,
                maxWidth: 560,
                opacity: 0.92,
                marginBottom: 34,
              }}
            >
              {HOME.heroSub}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <CTALink
                href={PRIMARY_CTA.href}
                location="home_hero"
                label={PRIMARY_CTA.label}
                className="btn-sage"
                style={{ padding: "15px 30px", fontSize: 16 }}
              >
                {PRIMARY_CTA.label} →
              </CTALink>
              <CTALink
                href={SECONDARY_CTA.href}
                location="home_hero"
                label={SECONDARY_CTA.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "15px 28px",
                  fontSize: 15,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  color: "var(--bone)",
                  border: "1px solid rgba(251,248,243,0.6)",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                {SECONDARY_CTA.label}
              </CTALink>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--sage)",
                marginTop: 18,
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              Free, instant, and no email needed to see your number.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Brand intro ──────────────────────────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "100px 24px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 56,
            alignItems: "center",
          }}
        >
          <Reveal>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 5",
                borderRadius: 12,
                overflow: "hidden",
                background: "var(--sand)",
              }}
            >
              <Image
                src="/photos/kristina_luu3226.jpg"
                alt="Kristina, owner and lead planner at By Mosaic"
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>{HOME.introEyebrow}</Eyebrow>
            <p
              className="font-accent"
              style={{
                fontFamily: "var(--font-accent)",
                fontStyle: "italic",
                fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
                lineHeight: 1.25,
                color: "var(--ink)",
                marginBottom: 26,
              }}
            >
              {HOME.introQuote}
            </p>
            <p style={bodyStyle}>{HOME.introBody}</p>
            <p style={{ ...bodyStyle, marginTop: 16 }}>{HOME.introBody2}</p>
            <Link
              href="/about"
              className="btn-sage-outline"
              style={{ marginTop: 28, fontSize: 14 }}
            >
              {HOME.introCta}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── Social proof ─────────────────────────────────────────────────── */}
      <SocialProof background="var(--bone)" />

      {/* ─── Services ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bone)", padding: "100px 24px", borderTop: "1px solid var(--sand)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow align="center">{HOME.servicesEyebrow}</Eyebrow>
            <h2 className="display-lg" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
              {HOME.servicesTitle}
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/services" className="btn-sage" style={{ padding: "13px 30px", fontSize: 15 }}>
              {HOME.servicesCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Calculator promo band (the bridge) ───────────────────────────── */}
      <section style={{ background: "var(--sage-mist)", padding: "88px 24px" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <Reveal>
            <Eyebrow>{HOME.calcEyebrow}</Eyebrow>
            <h2 className="display-lg" style={{ marginBottom: 18 }}>
              {HOME.calcTitle}
            </h2>
            <p style={bodyStyle}>{HOME.calcBody}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Real Southern California & DC-metro vendor data", "A full category-by-category breakdown", "Free, instant, no email required to see it"].map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M5 13l4 4L19 7" stroke="var(--sage-deep)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <CTALink
              href={PRIMARY_CTA.href}
              location="home_calc_band"
              label={PRIMARY_CTA.label}
              className="btn-sage"
              style={{ marginTop: 28, padding: "14px 30px", fontSize: 16 }}
            >
              {PRIMARY_CTA.label} →
            </CTALink>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 2",
                borderRadius: 12,
                overflow: "hidden",
                background: "var(--sand)",
                boxShadow: "0 12px 40px rgba(43,38,34,0.10)",
              }}
            >
              <Image
                src="/photos/kristina_luu4052.jpg"
                alt="A thoughtfully styled reception tablescape"
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Portfolio teaser ─────────────────────────────────────────────── */}
      <section style={{ background: "var(--alabaster)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>{HOME.portfolioEyebrow}</Eyebrow>
            <h2 className="display-lg" style={{ maxWidth: 760, marginBottom: 48 }}>
              {HOME.portfolioTitle}
            </h2>
          </Reveal>
          <PortfolioGrid items={PORTFOLIO.slice(0, 3)} />
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/portfolio" className="btn-sage-outline" style={{ padding: "13px 30px", fontSize: 15 }}>
              {HOME.portfolioCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Scarcity / positioning ───────────────────────────────────────── */}
      <section style={{ background: "var(--ink)", color: "var(--bone)", padding: "96px 24px" }}>
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <Eyebrow align="center" color="var(--sage)">Fully present, fully yours</Eyebrow>
            <h2
              className="font-accent"
              style={{
                fontFamily: "var(--font-accent)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                lineHeight: 1.25,
                color: "var(--bone)",
                marginBottom: 22,
              }}
            >
              One celebration at a time.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 17,
                lineHeight: 1.75,
                color: "var(--sand)",
                maxWidth: 560,
                margin: "0 auto 32px",
              }}
            >
              I keep my calendar intentionally intimate, so every couple has my full attention
              and care — from our very first conversation through your last dance. No rushing,
              no divided focus. Just you, your story, and a day that feels entirely yours.
            </p>
            <CTALink
              href={SECONDARY_CTA.href}
              location="home_scarcity"
              label={SECONDARY_CTA.label}
              className="btn-sage"
              style={{ padding: "14px 32px", fontSize: 15 }}
            >
              {SECONDARY_CTA.label}
            </CTALink>
          </div>
        </Reveal>
      </section>

      {/* ─── Closing CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bone)", padding: "110px 24px", textAlign: "center" }}>
        <Reveal>
          <h2 className="display-xl" style={{ marginBottom: 20 }}>
            Let&apos;s create your{" "}
            <em className="italic-serif" style={{ color: "var(--sage-deep)" }}>
              masterpiece
            </em>
          </h2>
          <p style={{ ...bodyStyle, maxWidth: 540, margin: "0 auto 32px", textAlign: "center" }}>
            {HOME.closingBody}
          </p>
          <CTALink
            href={SECONDARY_CTA.href}
            location="home_closing"
            label={HOME.closingCta}
            className="btn-sage"
            style={{ padding: "15px 34px", fontSize: 16 }}
          >
            {HOME.closingCta}
          </CTALink>
        </Reveal>
      </section>
    </>
  );
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 17,
  lineHeight: 1.75,
  color: "var(--ink)",
  opacity: 0.85,
};
