"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Full-bleed background image with a subtle vertical parallax as the section
// scrolls through the viewport. The inner layer is oversized so the translate
// never reveals an edge. Honors prefers-reduced-motion (stays static).
export default function ParallaxImage({
  src,
  opacity = 1,
  objectPosition = "center",
}: {
  src: string;
  opacity?: number;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["7.7%", "-7.7%"]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
    >
      <motion.div style={{ position: "absolute", top: "-20%", left: 0, right: 0, height: "140%", y }}>
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition, opacity }}
        />
      </motion.div>
    </div>
  );
}
