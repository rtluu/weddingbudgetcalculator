import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import Eyebrow from "@/components/marketing/Eyebrow";
import ContactForm from "@/components/marketing/ContactForm";
import CalendlyEmbed from "@/components/marketing/CalendlyEmbed";
import SocialProof from "@/components/marketing/SocialProof";
import { SITE, SOCIAL_LINKS } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Interested in working with By Mosaic? Reach out using our contact form or schedule a free consultation with Kristina.",
};

export default function ContactPage() {
  return (
    <>
      <section style={{ background: "var(--alabaster)", padding: "88px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow align="center">Inquire with By Mosaic</Eyebrow>
            <h1 className="display-xl" style={{ marginBottom: 20 }}>
              Let&apos;s create your{" "}
              <em className="italic-serif" style={{ color: "var(--sage-deep)" }}>
                masterpiece
              </em>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.7, color: "var(--muted)", maxWidth: 560, margin: "0 auto" }}>
              Interested in working with us? Reach out using the contact form or schedule a free
              consultation with Kristina.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + info */}
      <section style={{ background: "var(--bone)", padding: "56px 24px 88px", borderTop: "1px solid var(--sand)" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
            gap: 56,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <aside style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <p style={infoLabel}>Email</p>
                <a href={`mailto:${SITE.email}`} style={infoValue}>{SITE.email}</a>
              </div>
              <div>
                <p style={infoLabel}>Phone</p>
                <a href={SITE.phoneHref} style={infoValue}>{SITE.phone}</a>
              </div>
              <div>
                <p style={infoLabel}>Based in</p>
                <span style={{ ...infoValue, cursor: "default" }}>Los Angeles, California</span>
              </div>
              <div>
                <p style={infoLabel}>Follow along</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SOCIAL_LINKS.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={infoValue}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "var(--muted)", borderTop: "1px solid var(--sand)", paddingTop: 20 }}>
                We respond to every inquiry within 2 business days.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Calendly */}
      <section style={{ background: "var(--sage-mist)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow align="center">Prefer to book directly?</Eyebrow>
            <h2 className="display-lg" style={{ textAlign: "center", marginBottom: 36 }}>
              Schedule your consultation
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card-bone-elevated" style={{ overflow: "hidden", padding: 8 }}>
              <CalendlyEmbed />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reassurance / proof */}
      <SocialProof background="var(--alabaster)" showStats={false} />
    </>
  );
}

const infoLabel: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--sage-deep)",
  fontWeight: 600,
  marginBottom: 6,
};

const infoValue: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 19,
  color: "var(--ink)",
  textDecoration: "none",
};
