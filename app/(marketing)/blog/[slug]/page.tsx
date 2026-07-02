import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/marketing/Reveal";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/config/site";
import { BLOG_POSTS, getPost, AUTHOR_BIO } from "@/content/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.coverImage],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.coverImage}`,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "By Mosaic",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logos/bymosaic-mark.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
    articleSection: post.category,
  };

  return (
    <article style={{ background: "var(--alabaster)" }}>
      <JsonLd data={blogPostingJsonLd} />
      {/* Header */}
      <header style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 40px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--sage-deep)",
            marginBottom: 18,
          }}
        >
          {post.category} · {formatDate(post.publishedAt)}
        </p>
        <h1 className="display-lg" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 16 }}>
          {post.title}
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>
          By {post.author}
        </p>
      </header>

      {/* Cover */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--sand)",
          }}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1000px) 100vw, 980px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 72px" }}>
        {post.intro && <p style={bodyStyle}>{post.intro}</p>}
        {post.sections.map((section) => (
          <section key={section.heading} style={{ marginBottom: 36 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 500,
                color: "var(--ink)",
                marginBottom: 14,
              }}
            >
              {section.heading}
            </h2>
            <p style={bodyStyle}>{section.body}</p>
          </section>
        ))}
        <p
          className="font-accent"
          style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            fontSize: 24,
            lineHeight: 1.4,
            color: "var(--sage-deep)",
            marginTop: 40,
          }}
        >
          {post.closing}
        </p>

        {/* Author */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: "1px solid var(--sand)",
            display: "flex",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 72,
              height: 72,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: "var(--sand)",
            }}
          >
            <Image src="/photos/kristina_luu3747.jpg" alt="Kristina" fill sizes="72px" style={{ objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>
              {post.author}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
              {AUTHOR_BIO}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section style={{ background: "var(--bone)", padding: "72px 24px", textAlign: "center", borderTop: "1px solid var(--sand)" }}>
        <Reveal>
          <h2 className="display-lg" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: 22 }}>
            Planning a celebration of your own?
          </h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-sage" style={{ padding: "13px 28px", fontSize: 15 }}>
              Schedule a consultation
            </Link>
            <Link href="/blog" className="btn-sage-outline" style={{ padding: "13px 28px", fontSize: 15 }}>
              Back to the blog
            </Link>
          </div>
        </Reveal>
      </section>
    </article>
  );
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 17,
  lineHeight: 1.8,
  color: "var(--ink)",
  opacity: 0.88,
  marginBottom: 18,
};
