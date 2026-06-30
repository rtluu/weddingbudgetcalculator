"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/site";

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bone)",
        borderBottom: "1px solid var(--sand)",
        boxShadow: scrolled ? "0 4px 20px rgba(43,38,34,0.05)" : "none",
        transition: "box-shadow 0.25s ease",
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="By Mosaic — home"
          style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/bymosaic-mark.svg"
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            style={{ display: "block" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            By Mosaic
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: isActive(link.href) ? "var(--sage-deep)" : "var(--muted)",
                textDecoration: "none",
                fontWeight: isActive(link.href) ? 600 : 500,
                transition: "color 0.15s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/calculator" className="btn-sage" style={{ padding: "8px 16px", fontSize: 13 }}>
            Budget Calculator
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: "var(--ink)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="nav-mobile"
          style={{
            borderTop: "1px solid var(--sand)",
            background: "var(--bone)",
            padding: "12px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                letterSpacing: "0.04em",
                color: isActive(link.href) ? "var(--sage-deep)" : "var(--ink)",
                textDecoration: "none",
                fontWeight: isActive(link.href) ? 600 : 500,
                padding: "10px 0",
                borderBottom: "1px solid var(--sand)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/calculator"
            className="btn-sage"
            onClick={() => setOpen(false)}
            style={{ marginTop: 14, width: "100%" }}
          >
            Budget Calculator
          </Link>
        </div>
      )}
    </header>
  );
}
