"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Full-bleed autoplaying background video for the homepage hero.
// Falls back to a static poster image for prefers-reduced-motion users.
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Image src={poster} alt="" aria-hidden fill priority sizes="100vw" style={{ objectFit: "cover" }} />
    );
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
