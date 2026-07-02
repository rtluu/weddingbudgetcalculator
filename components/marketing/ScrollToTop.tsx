"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Reset scroll to the top on client-side page navigation. Next.js normally does
// this, but the global `scroll-behavior: smooth` interferes and can leave the
// new page scrolled down (its top section then hidden under the sticky nav).
// Force an instant reset — but skip it when the URL has a hash so in-page and
// cross-page anchor links (e.g. /services#slug) still land on their target.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto"; // override CSS smooth so the reset is instant
    window.scrollTo(0, 0);
    el.style.scrollBehavior = prev;
  }, [pathname]);

  return null;
}
