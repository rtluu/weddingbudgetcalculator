"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// "View testimonial" button + lightbox overlay playing the Vimeo BTS/testimonial
// video. While the overlay is open the hero background video is paused (and
// resumed on close). The iframe is only mounted while open, so playback starts
// on open and stops on close.
const VIMEO_SRC =
  "https://player.vimeo.com/video/1023160171?h=5328fd80d7&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1";

// Height of the sticky SiteNav — the overlay sits below it so the nav stays
// visible and the video centers in the remaining space.
const NAV_H = 68;

function setHeroVideoPaused(paused: boolean) {
  const video = document.querySelector<HTMLVideoElement>("video[data-hero-video]");
  if (!video) return;
  if (paused) video.pause();
  else void video.play().catch(() => {});
}

export default function TestimonialModal() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    setHeroVideoPaused(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      setHeroVideoPaused(false);
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        style={{
          marginTop: 22,
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "11px 22px",
          background: "rgba(251,248,243,0.08)",
          border: "1px solid rgba(251,248,243,0.55)",
          borderRadius: 999,
          color: "var(--bone)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          backdropFilter: "blur(2px)",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(251,248,243,0.2)";
          e.currentTarget.style.borderColor = "var(--bone)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(251,248,243,0.08)";
          e.currentTarget.style.borderColor = "rgba(251,248,243,0.55)";
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <path d="M2 1.2v9.6a.6.6 0 0 0 .92.5l7.4-4.8a.6.6 0 0 0 0-1L2.92.7A.6.6 0 0 0 2 1.2z" />
        </svg>
        View testimonial
      </button>

      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="By Mosaic testimonial video"
          onClick={close}
          style={{
            position: "fixed",
            top: NAV_H,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            background: "rgba(20,17,15,0.86)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            ref={closeRef}
            onClick={close}
            aria-label="Close video"
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "rgba(251,248,243,0.12)",
              border: "1px solid rgba(251,248,243,0.4)",
              color: "var(--bone)",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(1000px, 100%)" }}
          >
            <div style={{ padding: "56.25% 0 0 0", position: "relative", borderRadius: 10, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
              <iframe
                src={VIMEO_SRC}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Kristina ByMosaic BTS & Testimonial Video"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <p
              style={{
                marginTop: 14,
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.02em",
                color: "rgba(251,248,243,0.55)",
              }}
            >
              Video Credit:{" "}
              <a
                href="https://jimmyshinfilms.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(251,248,243,0.85)", textDecoration: "underline", textUnderlineOffset: 2 }}
              >
                Jimmy Shin Films
              </a>
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
