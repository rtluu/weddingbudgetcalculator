"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

// A Link that records a GA cta_click event with where it lives, so we can see
// which CTAs actually drive the calculator / consultation.
export default function CTALink({
  href,
  location,
  label,
  className,
  style,
  children,
}: {
  href: string;
  location: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={() => track("cta_click", { location, label })}
    >
      {children}
    </Link>
  );
}
