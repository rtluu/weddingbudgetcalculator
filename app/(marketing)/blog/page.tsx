import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import Eyebrow from "@/components/marketing/Eyebrow";
import { BLOG_POSTS } from "@/content/blog";

export const metadata: Metadata = {
  title: "Wedding Wisdom — Blog",
  description:
    "Expert tips, creative ideas, and insider advice from By Mosaic to help you plan your wedding — or any special event — with confidence and ease.",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  return (
    <>
      <section style={{ background: "var(--alabaster)", minHeight: "clamp(360px, 46vh, 520px)", padding: "56px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Eyebrow align="center">Wedding Wisdom</Eyebrow>
            <h1 className="display-xl" style={{ marginBottom: 20 }}>
              The{" "}
              <em className="italic-serif" style={{ color: "var(--sage-deep)" }}>
                journal
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Expert tips, creative ideas, and insider advice to help you plan not just your
              wedding, but any special event with confidence and ease.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--bone)", padding: "56px 24px 96px", borderTop: "1px solid var(--sand)" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {BLOG_POSTS.map((post, i) => (
            <Reveal as="div" key={post.slug} delay={(i % 3) * 0.08}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <article className="card-bone" style={{ overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", background: "var(--sand)" }}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "24px 24px 28px" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--sage-deep)",
                        marginBottom: 12,
                      }}
                    >
                      {post.category} · {formatDate(post.publishedAt)}
                    </p>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 24,
                        fontWeight: 500,
                        color: "var(--ink)",
                        marginBottom: 12,
                        lineHeight: 1.25,
                      }}
                    >
                      {post.title}
                    </h2>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.65, color: "var(--muted)" }}>
                      {post.excerpt}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 18,
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        color: "var(--sage-deep)",
                      }}
                    >
                      Read more →
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
