import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export interface Service {
  slug: string;
  name: string;
  summary: string;
  timeline: string;
  image: string;
}

export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <Reveal as="div" delay={index * 0.08}>
      <article
        className="card-bone"
        style={{
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", background: "var(--sand)" }}>
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 700px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ padding: "26px 24px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--ink)",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            {service.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--muted)",
              marginBottom: 18,
              flex: 1,
            }}
          >
            {service.summary}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--sage-deep)",
              letterSpacing: "0.02em",
              marginBottom: 20,
            }}
          >
            {service.timeline}
          </p>
          <Link
            href="/contact"
            className="btn-sage-outline"
            style={{ alignSelf: "flex-start", fontSize: 13, padding: "8px 18px" }}
          >
            Inquire
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
