export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--sand)",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* Mark + wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="/logos/bymosaic-mark.svg"
          alt=""
          aria-hidden="true"
          style={{ width: 24, height: 24, opacity: 0.7 }}
        />
        <img
          src="/logos/bymosaic-wordmark.svg"
          alt="By Mosaic"
          style={{ height: 11, width: "auto", opacity: 0.55 }}
        />
      </div>

      {/* Attribution lines */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted)",
          opacity: 0.7,
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        Est. 2022 · Los Angeles · bymosaic.com
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 10,
          color: "var(--muted)",
          opacity: 0.5,
          textAlign: "center",
        }}
      >
        Estimates reflect real LA market data. Individual vendor quotes will vary.
      </p>
    </footer>
  );
}
