"use client";

import { useState } from "react";

// ─── Copy Link Button ──────────────────────────────────────────────────────────
export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-body)",
        fontSize: 12,
        color: copied ? "var(--olive)" : "var(--muted)",
        background: "none",
        border: "1px solid var(--sand)",
        borderRadius: 6,
        padding: "4px 10px",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        {copied
          ? <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
      {copied ? "Copied!" : "Share estimate"}
    </button>
  );
}
