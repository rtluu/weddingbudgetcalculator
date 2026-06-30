"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/config/site";
import { trackLead } from "@/lib/analytics";

// Inline Calendly scheduling widget. Loads the Calendly script once and
// renders the inline widget pointed at Kristina's 30-min consultation.
export default function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SRC = "https://assets.calendly.com/assets/external/widget.js";
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    // Fire a lead conversion when a consultation is actually booked.
    const onMessage = (e: MessageEvent) => {
      if (e.origin.includes("calendly.com") && e.data?.event === "calendly.event_scheduled") {
        trackLead("calendly_booking");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      ref={ref}
      className="calendly-inline-widget"
      data-url={`${SITE.calendlyUrl}?hide_gdpr_banner=1&background_color=fbf8f3&primary_color=4f6f57&text_color=2b2622`}
      style={{ minWidth: 320, height: 660, width: "100%" }}
    />
  );
}
