import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";

// Shared hero header for the Services / Portfolio / Blog / Contact pages:
// an eyebrow, a display headline (with an italic accent word), and a subtitle,
// vertically centered in a fixed-height band.
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  containerMaxWidth = 820,
  subtitleMaxWidth = 600,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  containerMaxWidth?: number;
  subtitleMaxWidth?: number;
}) {
  return (
    <section
      style={{
        background: "var(--alabaster)",
        minHeight: "clamp(360px, 46vh, 520px)",
        padding: "56px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: containerMaxWidth, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow align="center">{eyebrow}</Eyebrow>
          <h1 className="display-xl" style={{ marginBottom: 22 }}>
            {title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: subtitleMaxWidth,
              margin: "0 auto",
            }}
          >
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// Small helper for the italic sage accent word used in headlines.
export function Accent({ children }: { children: React.ReactNode }) {
  return (
    <em className="italic-serif" style={{ color: "var(--sage-deep)" }}>
      {children}
    </em>
  );
}
