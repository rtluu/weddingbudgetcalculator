import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/marketing/Reveal";
import PortfolioGallery from "@/components/marketing/PortfolioGallery";
import { PORTFOLIO } from "@/config/copy";

type EventParams = { slug: string };

const getEvent = (slug: string) => PORTFOLIO.find((e) => e.slug === slug);

export function generateStaticParams(): EventParams[] {
  return PORTFOLIO.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EventParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Portfolio" };
  return {
    title: `${event.couple} — ${event.location}`,
    description: `${event.type} in ${event.location} by By Mosaic. ${event.caption.slice(0, 140)}`,
  };
}

export default async function PortfolioEventPage({
  params,
}: {
  params: Promise<EventParams>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      {/* Event header */}
      <section
        style={{
          background: "var(--alabaster)",
          padding: "56px 24px 40px",
          borderBottom: "1px solid var(--sand)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <Link
              href="/portfolio"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.06em",
                color: "var(--sage-deep)",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: 28,
              }}
            >
              ← Back to portfolio
            </Link>
            <div style={{ maxWidth: 760 }}>
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
              <h1 className="display-lg" style={{ marginBottom: 20 }}>
                {event.couple}
              </h1>
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
        </div>
      </section>

      {/* Gallery + vendor team */}
      <section style={{ background: "var(--bone)", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <PortfolioGallery images={event.gallery} couple={event.couple} />
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 44 }}>
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
