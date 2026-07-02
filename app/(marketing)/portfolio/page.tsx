import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import PageHeader, { Accent } from "@/components/marketing/PageHeader";
import PortfolioGrid from "@/components/marketing/PortfolioGrid";
import PortfolioGallery from "@/components/marketing/PortfolioGallery";
import { PORTFOLIO, PORTFOLIO_HEADER } from "@/config/copy";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Featured weddings and celebrations by By Mosaic — from a destination wedding in Rome to celebrations across Southern California, Texas, and Virginia.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <PageHeader
        eyebrow={PORTFOLIO_HEADER.eyebrow}
        title={
          <>
            Carefully curated, flawlessly <Accent>executed</Accent>
          </>
        }
        subtitle={PORTFOLIO_HEADER.intro}
      />

      {/* Featured grid */}
      <section style={{ background: "var(--bone)", padding: "56px 24px 80px", borderTop: "1px solid var(--sand)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <PortfolioGrid items={PORTFOLIO} />
        </div>
      </section>

      {/* Per-event galleries */}
      {PORTFOLIO.map((event, i) => (
        <section
          key={event.slug}
          id={event.slug}
          style={{
            scrollMarginTop: 80,
            background: i % 2 === 0 ? "var(--alabaster)" : "var(--bone)",
            padding: "80px 24px",
            borderTop: "1px solid var(--sand)",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ maxWidth: 760, marginBottom: 36 }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--sage-deep)",
                    marginBottom: 12,
                  }}
                >
                  {event.type} · {event.location}
                </p>
                <h2 className="display-lg" style={{ marginBottom: 20 }}>
                  {event.couple}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 17,
                    lineHeight: 1.8,
                    color: "var(--ink)",
                    opacity: 0.85,
                  }}
                >
                  {event.caption}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <PortfolioGallery images={event.gallery} couple={event.couple} />
            </Reveal>

            {/* Vendor team */}
            <Reveal delay={0.1}>
              <div style={{ marginTop: 36 }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--sage-deep)",
                    marginBottom: 14,
                  }}
                >
                  Vendor Team
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 0",
                    columnGap: 0,
                  }}
                >
                  {event.vendors.map((v, vi) => (
                    <li
                      key={v}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: "var(--muted)",
                        paddingRight: 16,
                        marginRight: 16,
                        borderRight: vi < event.vendors.length - 1 ? "1px solid var(--sand)" : "none",
                      }}
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: "var(--ink)", color: "var(--bone)", padding: "90px 24px", textAlign: "center" }}>
        <Reveal>
          <h2 className="display-lg" style={{ color: "var(--bone)", marginBottom: 18 }}>
            Your celebration, next
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--sand)",
              maxWidth: 520,
              margin: "0 auto 30px",
            }}
          >
            Complete the inquiry form to get in touch and schedule a consultation with Kristina.
          </p>
          <Link href="/contact" className="btn-sage" style={{ padding: "15px 34px", fontSize: 16 }}>
            Inquire with By Mosaic
          </Link>
        </Reveal>
      </section>
    </>
  );
}
