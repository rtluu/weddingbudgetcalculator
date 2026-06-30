export default function Eyebrow({
  children,
  color = "var(--sage-deep)",
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        marginBottom: 16,
        textAlign: align,
      }}
    >
      {children}
    </p>
  );
}
