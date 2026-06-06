export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--sand)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <img
        src="/logos/bymosaic-mark.svg"
        alt="By Mosaic Events"
        style={{ width: 18, height: 18, opacity: 0.45 }}
      />
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--muted)",
          opacity: 0.55,
          letterSpacing: "0.04em",
        }}
      >
        Est. 2022 · Los Angeles · bymosaic.com
      </p>
    </footer>
  );
}
