"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/config/copy";
import { track } from "@/lib/analytics";

export default function StickyCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDismissed = () => sessionStorage.getItem("bm-sticky-dismissed") === "1";
    const onScroll = () => setVisible(!isDismissed() && window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't show on the contact page (they're already converting there)
  if (pathname.startsWith("/contact")) return null;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
        transform: visible ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.35s var(--ease-out-quart)",
        background: "var(--ink)",
        borderTop: "1px solid rgba(228,218,201,0.18)",
        boxShadow: "0 -8px 30px rgba(43,38,34,0.18)",
      }}
    >
      <div
        className="sticky-cta-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <p
          className="sticky-cta-msg"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--alabaster)",
            margin: 0,
          }}
        >
          <span style={{ color: "var(--sage)", fontWeight: 600 }}>Curious what your wedding might cost?</span>{" "}
          See your estimate — free, in 60 seconds.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link
            href={PRIMARY_CTA.href}
            className="btn-sage"
            onClick={() => track("cta_click", { location: "sticky_bar", label: PRIMARY_CTA.label })}
            style={{ padding: "9px 18px", fontSize: 13, whiteSpace: "nowrap" }}
          >
            {PRIMARY_CTA.label} →
          </Link>
          <Link
            href={SECONDARY_CTA.href}
            className="sticky-cta-secondary"
            onClick={() => track("cta_click", { location: "sticky_bar", label: SECONDARY_CTA.label })}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--sand)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {SECONDARY_CTA.label}
          </Link>
          <button
            onClick={() => {
              sessionStorage.setItem("bm-sticky-dismissed", "1");
              setVisible(false);
            }}
            aria-label="Dismiss"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--sand)",
              padding: 6,
              display: "flex",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
