import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import PageHeader, { Accent } from "@/components/marketing/PageHeader";
import PortfolioGrid from "@/components/marketing/PortfolioGrid";
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

      {/* Featured grid — each card opens its own event page */}
      <section style={{ background: "var(--bone)", padding: "56px 24px 80px", borderTop: "1px solid var(--sand)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <PortfolioGrid items={PORTFOLIO} />
        </div>
      </section>

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
