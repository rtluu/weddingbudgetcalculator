"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";

// Infinite, peek-style image carousel: a wide featured slide is centered with
// its neighbors peeking on each side. Arrows, ← / → keys (when in view), and
// swipe gestures all advance it; the set loops seamlessly.
//   variant="edge"     — circular arrows on the left/right edges
//   variant="monogram" — centered ← [BM] → control above the strip
const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 40;

export default function Carousel({
  images,
  variant = "edge",
  height = 520,
  gap = 0,
}: {
  images: readonly string[];
  variant?: "edge" | "monogram";
  height?: number;
  gap?: number;
}) {
  const N = images.length;
  const tripled = [...images, ...images, ...images];
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const idxRef = useRef(N);
  const busyRef = useRef(false);
  const dimsRef = useRef({ imageWidth: 0, step: 0, offset: 0 });
  const inViewRef = useRef(false);
  const pointerStartRef = useRef<number | null>(null);
  const [dims, setDims] = useState({ imageWidth: 0, step: 0, offset: 0 });
  const [ready, setReady] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      const d = dimsRef.current;
      if (!d.step || busyRef.current) return;
      busyRef.current = true;
      const next = idxRef.current + dir;
      animate(x, d.offset - next * d.step, {
        duration: 0.55,
        ease: EASE,
        onComplete: () => {
          let reset = next;
          if (next < N) reset = next + N;
          else if (next >= 2 * N) reset = next - N;
          if (reset !== next) x.set(d.offset - reset * d.step);
          idxRef.current = reset;
          busyRef.current = false;
        },
      });
    },
    [x, N]
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const imageWidth = mobile ? w - gap : w * 0.56;
      const step = imageWidth + gap;
      const offset = (w - imageWidth) / 2;
      dimsRef.current = { imageWidth, step, offset };
      setDims({ imageWidth, step, offset });
      x.set(offset - idxRef.current * step);
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { inViewRef.current = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [x, gap]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (e: React.PointerEvent) => { pointerStartRef.current = e.clientX; };
  const endPointer = (clientX: number | null) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start == null || clientX == null) return;
    const delta = clientX - start;
    if (delta <= -SWIPE_THRESHOLD) go(1);
    else if (delta >= SWIPE_THRESHOLD) go(-1);
  };

  const arrow = (dir: 1 | -1) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d={dir === -1 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="carousel" style={{ position: "relative", ["--carousel-h" as string]: `${height}px` }}>
      {variant === "monogram" && (
        <div className="carousel-monogram">
          <button className="carousel-mono-arrow" onClick={() => go(-1)} aria-label="Previous image">{arrow(-1)}</button>
          <div className="carousel-mono-seal">
            <span style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1 }}>B</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1 }}>M</span>
          </div>
          <button className="carousel-mono-arrow" onClick={() => go(1)} aria-label="Next image">{arrow(1)}</button>
        </div>
      )}

      <div
        ref={wrapRef}
        className="carousel-viewport"
        style={{
          overflow: "hidden",
          touchAction: "pan-y",
          cursor: "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onPointerDown={onPointerDown}
        onPointerUp={(e) => endPointer(e.clientX)}
        onPointerLeave={() => endPointer(null)}
        onPointerCancel={() => endPointer(null)}
      >
        <motion.div style={{ x, display: "flex", gap, height: "100%", opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}>
          {tripled.map((src, i) => (
            <div key={i} style={{ position: "relative", height: "100%", flex: "0 0 auto", width: dims.imageWidth || "56%" }}>
              <Image src={src} alt="" aria-hidden="true" fill sizes="60vw" draggable={false} style={{ objectFit: "cover", pointerEvents: "none" }} priority={i === N} />
            </div>
          ))}
        </motion.div>
      </div>

      {variant === "edge" && (
        <>
          <button className="svc-arrow svc-arrow-left" onClick={() => go(-1)} aria-label="Previous image">{arrow(-1)}</button>
          <button className="svc-arrow svc-arrow-right" onClick={() => go(1)} aria-label="Next image">{arrow(1)}</button>
        </>
      )}
    </div>
  );
}
