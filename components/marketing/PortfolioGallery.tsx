"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function PortfolioGallery({
  images,
  couple,
}: {
  images: readonly string[];
  couple: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <>
      <div className="pf-gallery">
        {images.map((src, i) => (
          <button
            key={src}
            className="pf-gallery-item"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            aria-label={`View photo ${i + 1} of ${images.length} from ${couple}`}
            style={{
              position: "relative",
              aspectRatio: i % 5 === 0 ? "1 / 1" : "3 / 4",
              border: "1px solid var(--sand)",
              borderRadius: 8,
              overflow: "hidden",
              cursor: "zoom-in",
              padding: 0,
              background: "var(--sand)",
            }}
          >
            <Image
              src={src}
              alt={`${couple} — photo ${i + 1}`}
              fill
              sizes="(max-width: 700px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${couple} gallery`}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(43,38,34,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Close gallery"
            style={{ ...navBtn, top: 20, right: 20, left: "auto" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            style={{ ...navBtn, left: 20, top: "50%", transform: "translateY(-50%)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "min(92vw, 1100px)", height: "min(86vh, 1100px)" }}
          >
            <Image
              src={images[index]}
              alt={`${couple} — photo ${index + 1} of ${images.length}`}
              fill
              sizes="92vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            style={{ ...navBtn, right: 20, top: "50%", transform: "translateY(-50%)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* Counter */}
          <p
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              color: "var(--sand)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              letterSpacing: "0.08em",
            }}
          >
            {index + 1} / {images.length}
          </p>
        </div>,
        document.body
      )}
    </>
  );
}

const navBtn: React.CSSProperties = {
  position: "absolute",
  zIndex: 2,
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "1px solid rgba(228,218,201,0.4)",
  background: "rgba(43,38,34,0.5)",
  color: "var(--bone)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
