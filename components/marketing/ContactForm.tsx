"use client";

import { useState } from "react";
import { trackLead } from "@/lib/analytics";

const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted)",
  fontWeight: 600,
};
const optHint: React.CSSProperties = {
  textTransform: "none",
  letterSpacing: 0,
  color: "var(--muted)",
  fontWeight: 400,
  opacity: 0.7,
};
const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 15,
  color: "var(--ink)",
  background: "var(--bone)",
  border: "1px solid var(--sand)",
  borderRadius: 8,
  padding: "11px 14px",
  outline: "none",
  width: "100%",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      trackLead("contact_form", { occasion: String(payload.occasion || "") });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="card-bone"
        style={{ padding: "40px 32px", textAlign: "center" }}
        role="status"
        aria-live="polite"
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--sage-mist)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="var(--sage-deep)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ink)", marginBottom: 12 }}>
          Thank you!
        </h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--muted)", maxWidth: 380, margin: "0 auto" }}>
          We have received your message and will get back to you as soon as possible within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div style={fieldWrap}>
        <label htmlFor="name" style={labelStyle}>First and last name *</label>
        <input id="name" name="name" required autoComplete="name" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        <div style={fieldWrap}>
          <label htmlFor="email" style={labelStyle}>Email address *</label>
          <input id="email" name="email" type="email" required autoComplete="email" style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label htmlFor="phone" style={labelStyle}>Phone number <span style={optHint}>(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        <div style={fieldWrap}>
          <label htmlFor="eventDate" style={labelStyle}>Event date or desired date</label>
          <input id="eventDate" name="eventDate" placeholder="e.g. October 2026" style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label htmlFor="guestCount" style={labelStyle}>Estimated guest count <span style={optHint}>(optional)</span></label>
          <input id="guestCount" name="guestCount" inputMode="numeric" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        <div style={fieldWrap}>
          <label htmlFor="occasion" style={labelStyle}>Occasion</label>
          <input id="occasion" name="occasion" placeholder="Wedding, birthday, proposal…" style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label htmlFor="hearAbout" style={labelStyle}>How did you hear about us? <span style={optHint}>(optional)</span></label>
          <input id="hearAbout" name="hearAbout" style={inputStyle} />
        </div>
      </div>

      <div style={fieldWrap}>
        <label htmlFor="message" style={labelStyle}>Tell us about your celebration <span style={optHint}>(optional)</span></label>
        <textarea id="message" name="message" rows={5} placeholder="Your vision, must-haves, anything on your mind…" style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      {status === "error" && (
        <p role="alert" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--terracotta)" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <button
          type="submit"
          className="btn-sage"
          disabled={status === "submitting"}
          style={{ alignSelf: "flex-start", padding: "13px 30px", fontSize: 15, opacity: status === "submitting" ? 0.65 : 1 }}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
