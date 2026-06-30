import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export interface PortfolioItem {
  slug: string;
  couple: string;
  location: string;
  type: string;
  cover: string;
}

export default function PortfolioGrid({
  items,
}: {
  items: readonly PortfolioItem[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
      }}
    >
      {items.map((item, i) => (
        <Reveal as="div" key={item.slug} delay={(i % 3) * 0.08}>
          <Link href={`/portfolio#${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <figure style={{ margin: 0 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--sand)",
                  border: "1px solid var(--sand)",
                }}
              >
                <Image
                  src={item.cover}
                  alt={`${item.couple} — ${item.location}`}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <figcaption style={{ marginTop: 16 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  {item.couple}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--sage-deep)",
                  }}
                >
                  {item.type} · {item.location}
                </p>
              </figcaption>
            </figure>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
