"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// "View testimonial" button + lightbox overlay playing the Vimeo BTS/testimonial
// video. While the overlay is open the hero background video is paused (and
// resumed on close). The iframe is only mounted while open, so playback starts
// on open and stops on close.
const VIMEO_SRC =
  "https://player.vimeo.com/video/1023160171?h=5328fd80d7&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0";

const VIMEO_ORIGIN = "https://player.vimeo.com";

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
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Track the mobile breakpoint so the video can go full-bleed edge-to-edge on
  // phones (matches the site's other responsive components, which read widths
  // at runtime rather than via CSS media queries on these inline-styled nodes).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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

  // Start the testimonial with sound. The Vimeo embed autoplays; once the player
  // signals "ready" over postMessage we set full volume and (re)issue play so it
  // begins unmuted wherever the browser's autoplay policy permits it. iOS Safari
  // still forces a tap to unmute embedded cross-origin video — that's an Apple
  // platform restriction we can't override from here.
  useEffect(() => {
    if (!open) return;
    const post = (method: string, value?: unknown) =>
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify(value === undefined ? { method } : { method, value }),
        VIMEO_ORIGIN
      );
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== VIMEO_ORIGIN) return;
      let data: { event?: string } | undefined;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.event === "ready") {
        post("setVolume", 1);
        post("play");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open]);

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
            padding: isMobile ? 0 : 24,
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
            style={{ width: isMobile ? "100%" : "min(1000px, 100%)" }}
          >
            <div style={{ padding: "56.25% 0 0 0", position: "relative", borderRadius: isMobile ? 0 : 10, overflow: "hidden", boxShadow: isMobile ? "none" : "0 24px 80px rgba(0,0,0,0.5)" }}>
              <iframe
                ref={iframeRef}
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
                paddingInline: isMobile ? 16 : 0,
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
