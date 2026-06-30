"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";

// Infinite, peek-style image carousel for the Services hero.
// A wide featured slide is centered with its neighbors peeking on each side;
// arrows, ← / → keys (when in view), and swipe gestures all advance the set,
// which loops seamlessly.
const IMAGES = [
  "/photos/samantha_and_luis-425.jpg",
  "/photos/kg004048.jpg",
  "/photos/l_and_b-168.jpg",
  "/photos/l_and_b-452.jpg",
  "/photos/nnn_4788.jpg",
  "/photos/dsc0404.jpg",
  "/photos/ldphotography31.jpg",
];

const EASE = [0.22, 1, 0.36, 1] as const;
const N = IMAGES.length;
const TRIPLED = [...IMAGES, ...IMAGES, ...IMAGES];
const SWIPE_THRESHOLD = 40; // px

export default function ServicesCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const idxRef = useRef(N); // logical index into TRIPLED (start in the middle copy)
  const busyRef = useRef(false);
  const dimsRef = useRef({ slide: 0, offset: 0 });
  const inViewRef = useRef(false);
  const pointerStartRef = useRef<number | null>(null);
  const [dims, setDims] = useState({ slide: 0, offset: 0 });
  const [ready, setReady] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      const d = dimsRef.current;
      if (!d.slide || busyRef.current) return;
      busyRef.current = true;
      const next = idxRef.current + dir;
      animate(x, d.offset - next * d.slide, {
        duration: 0.55,
        ease: EASE,
        onComplete: () => {
          let reset = next;
          if (next < N) reset = next + N;
          else if (next >= 2 * N) reset = next - N;
          if (reset !== next) x.set(d.offset - reset * d.slide);
          idxRef.current = reset;
          busyRef.current = false;
        },
      });
    },
    [x]
  );

  // Measure + track visibility
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const slide = mobile ? w : w * 0.56;
      const offset = (w - slide) / 2;
      dimsRef.current = { slide, offset };
      setDims({ slide, offset });
      x.set(offset - idxRef.current * slide);
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [x]);

  // Keyboard arrows (only while the carousel is on screen)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Swipe / drag
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = e.clientX;
  };
  const endPointer = (clientX: number | null) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start == null || clientX == null) return;
    const delta = clientX - start;
    if (delta <= -SWIPE_THRESHOLD) go(1);
    else if (delta >= SWIPE_THRESHOLD) go(-1);
  };

  return (
    <section className="svc-carousel">
      <div
        ref={wrapRef}
        style={{
          overflow: "hidden",
          height: "100%",
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
        <motion.div
          style={{ x, display: "flex", height: "100%", opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          {TRIPLED.map((src, i) => (
            <div
              key={i}
              style={{ position: "relative", height: "100%", flex: "0 0 auto", width: dims.slide || "56%" }}
            >
              <Image
                src={src}
                alt=""
                aria-hidden="true"
                fill
                sizes="60vw"
                draggable={false}
                style={{ objectFit: "cover", pointerEvents: "none" }}
                priority={i === N}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <button className="svc-arrow svc-arrow-left" onClick={() => go(-1)} aria-label="Previous image">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="svc-arrow svc-arrow-right" onClick={() => go(1)} aria-label="Next image">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
