"use client";

import { useState, useEffect } from "react";

const words = ["Events", "Weddings", "Parties", "Showers", "Engagements", "Mitzvahs", "Quinceañeras", "Picnics"];
const DISPLAY_MS = 2500;
const FADE_MS = 350;

export default function SiteFooter() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, FADE_MS);
    }, DISPLAY_MS + FADE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      style={{
        borderTop: "1px solid var(--sand)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: "var(--alabaster)",
        boxShadow: "0 50vh 0 50vh var(--alabaster)",
      }}
    >
      <a
        href="https://bymosaic.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--muted)",
            letterSpacing: "0.04em",
            minWidth: "7.5em",
            textAlign: "right",
            opacity: visible ? 0.55 : 0,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        >
          {words[index]}
        </p>
        <img
          src="/logos/bymosaic-mark.svg"
          alt="By Mosaic Events"
          style={{ width: 18, height: 18, opacity: 0.45 }}
        />
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", opacity: 0.55, letterSpacing: "0.04em" }}>
          By Mosaic <span style={{ fontSize: 11 }}>LLC</span>
        </p>
      </a>
    </footer>
  );
}
