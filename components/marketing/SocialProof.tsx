import Reveal from "./Reveal";
import { TESTIMONIALS, PROOF_STATS } from "@/config/copy";

export default function SocialProof({
  background = "var(--bone)",
  showStats = true,
  bordered = true,
  padding = "72px 24px",
}: {
  background?: string;
  showStats?: boolean;
  bordered?: boolean;
  padding?: string;
}) {
  return (
    <section style={{ background, padding, borderTop: bordered ? "1px solid var(--sand)" : "none" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Testimonials */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="div" key={t.name} delay={i * 0.08}>
              <figure style={{ margin: 0, height: "100%", display: "flex", flexDirection: "column" }}>
                <div aria-hidden="true" style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="var(--sage-deep)">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-accent)",
                    fontStyle: "italic",
                    fontSize: 21,
                    lineHeight: 1.4,
                    color: "var(--ink)",
                    flex: 1,
                  }}
                >
                  “{t.quote}”
                </blockquote>
                <figcaption
                  style={{
                    marginTop: 16,
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--sage-deep)",
                    fontWeight: 600,
                  }}
                >
                  {t.name}
                  {t.detail && <span style={{ color: "var(--muted)", fontWeight: 400 }}> · {t.detail}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        {showStats && (
          <Reveal>
            <div
              style={{
                marginTop: 56,
                paddingTop: 40,
                borderTop: "1px solid var(--sand)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 24,
                textAlign: "center",
              }}
            >
              {PROOF_STATS.map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                    {stat.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--ink)" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
