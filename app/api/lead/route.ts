import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { Tier, Location, DayOfWeek, VenueType, BarStyle, locationLabels, calculateWeddingBudget } from "@/config/costModel";
import { EstimatePDF } from "./EstimatePDF";

// Lazy-initialize so build doesn't fail without env vars
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) console.error("[email] RESEND_API_KEY is not set - notification emails will NOT be delivered.");
  return new Resend(key ?? "placeholder");
}

type LeadScore = "A" | "B" | "C";

function scoreLead(
  guests: number,
  tier: Tier,
  venueStatus: string
): LeadScore {
  // A: guests >= 120 AND tier = luxury, OR (guests >= 100 AND venueStatus = "touring")
  if (
    (guests >= 120 && tier === "luxury") ||
    (guests >= 100 && venueStatus === "touring")
  ) {
    return "A";
  }
  // B: guests >= 80 OR tier = luxury
  if (guests >= 80 || tier === "luxury") {
    return "B";
  }
  // C: everyone else
  return "C";
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const tierLabel: Record<Tier, string> = {
  budget: "Budget / Intimate",
  moderate: "Moderate / Signature",
  luxury: "Luxury / Editorial",
};

const dateLabel: Record<string, string> = {
  yes: "Date confirmed",
  season: "Season only",
  "not-sure": "Not sure yet",
};

const venueLabel: Record<string, string> = {
  booked: "Venue booked",
  touring: "Currently touring venues",
  none: "Haven't started venue search",
};

const scoreLabel: Record<LeadScore, string> = {
  A: "🔥 Score A — High-intent lead",
  B: "⭐ Score B — Warm lead",
  C: "💛 Score C — Early-stage lead",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      guestCount,
      location,
      tier,
      dateStatus,
      venueStatus,
      venueName,
      timingMonth,
      timingDow,
      venueType,
      barStyle,
      excludedCategories,
      weddingYear,
      calculatedTotal,
    } = body as {
      name: string;
      email: string;
      phone?: string;
      guestCount: number;
      location: Location;
      tier: Tier;
      dateStatus: string;
      venueStatus: string;
      venueName?: string;
      timingMonth?: number;
      timingDow?: DayOfWeek;
      venueType?: VenueType;
      barStyle?: BarStyle;
      excludedCategories?: string[];
      weddingYear?: number;
      calculatedTotal: number;
    };

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const score = scoreLead(guestCount, tier, venueStatus);
    const recipientEmail = process.env.RECIPIENT_EMAIL || "kristina@bymosaic.com";
    const locationName = locationLabels[location] ?? location;

    // Generate PDF
    const budgetResult = calculateWeddingBudget(guestCount, location, tier, timingMonth, timingDow, {
      venueType,
      barStyle,
      excludedCategories,
      weddingYear,
    });
    const pdfBuffer = await renderToBuffer(
      React.createElement(EstimatePDF, { name, result: budgetResult, venueName }) as React.ReactElement<DocumentProps>
    );
    const pdfBase64 = pdfBuffer.toString("base64");

    // ─── Email to Kristina ─────────────────────────────────────────────────
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #F6F1E9; color: #2B2622; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
    .header { border-bottom: 2px solid #4F6F57; padding-bottom: 16px; margin-bottom: 24px; }
    .score { display: inline-block; padding: 6px 14px; border-radius: 4px; font-size: 14px; font-family: 'Helvetica Neue', sans-serif; margin-bottom: 20px; }
    .score-a { background: #FDE8D8; color: #9C5A3C; border: 1px solid #B07A57; }
    .score-b { background: #EDF5E0; color: #4A5224; border: 1px solid #6E7253; }
    .score-c { background: #F0EDE8; color: #8C8275; border: 1px solid #E4DAC9; }
    .field { margin-bottom: 12px; }
    .field-label { font-family: 'Helvetica Neue', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8275; margin-bottom: 2px; }
    .field-value { font-size: 16px; color: #2B2622; }
    .total { font-size: 28px; font-weight: 600; color: #4F6F57; margin: 16px 0; }
    .cta { display: inline-block; padding: 12px 24px; background: #4F6F57; color: #FBF8F3; text-decoration: none; border-radius: 6px; font-family: 'Helvetica Neue', sans-serif; font-size: 14px; margin-top: 16px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E4DAC9; font-family: 'Helvetica Neue', sans-serif; font-size: 12px; color: #8C8275; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p style="font-size: 12px; font-family: 'Helvetica Neue', sans-serif; color: #8C8275; margin: 0 0 4px 0;">BY MOSAIC EVENTS · LEAD NOTIFICATION</p>
      <h1 style="font-size: 24px; margin: 0; color: #2B2622;">New inquiry from the budget calculator</h1>
    </div>

    <div class="score score-${score.toLowerCase()}">${scoreLabel[score]}</div>

    <div class="field">
      <div class="field-label">Name</div>
      <div class="field-value">${name}</div>
    </div>
    <div class="field">
      <div class="field-label">Email</div>
      <div class="field-value"><a href="mailto:${email}" style="color: #4F6F57;">${email}</a></div>
    </div>
    ${phone ? `<div class="field"><div class="field-label">Phone</div><div class="field-value">${phone}</div></div>` : ""}

    <div style="height: 1px; background: #E4DAC9; margin: 20px 0;"></div>

    <div class="field">
      <div class="field-label">Estimated budget</div>
      <div class="total">${fmt(calculatedTotal)}</div>
    </div>
    <div class="field">
      <div class="field-label">Guest count</div>
      <div class="field-value">${guestCount} guests</div>
    </div>
    <div class="field">
      <div class="field-label">Location</div>
      <div class="field-value">${locationName}</div>
    </div>
    <div class="field">
      <div class="field-label">Style tier</div>
      <div class="field-value">${tierLabel[tier]}</div>
    </div>
    <div class="field">
      <div class="field-label">Date status</div>
      <div class="field-value">${dateLabel[dateStatus] ?? dateStatus}</div>
    </div>
    <div class="field">
      <div class="field-label">Venue status</div>
      <div class="field-value">${venueLabel[venueStatus] ?? venueStatus}</div>
    </div>
    ${venueName ? `<div class="field"><div class="field-label">Venue name</div><div class="field-value" style="font-weight:500;">${venueName}</div></div>` : ""}

    <a href="mailto:${email}?subject=Your By Mosaic wedding estimate&body=Hi ${name}," class="cta">Reply to ${name} →</a>

    <div class="footer">
      <p>By Mosaic Wedding Budget Calculator · bymosaic.com<br>
      This notification was triggered automatically. Reply directly to connect with the couple.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // ─── Email to couple (with PDF attachment placeholder) ─────────────────
    const coupleEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #F6F1E9; color: #2B2622; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 0 auto; padding: 32px 24px; }
    .logo { font-size: 12px; font-family: 'Helvetica Neue', sans-serif; color: #8C8275; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; }
    h1 { font-size: 28px; line-height: 1.2; margin: 0 0 12px 0; }
    .total { font-size: 36px; font-weight: 600; color: #4F6F57; margin: 20px 0; }
    .range { font-size: 14px; font-family: 'Helvetica Neue', sans-serif; color: #8C8275; }
    .divider { height: 1px; background: #E4DAC9; margin: 24px 0; }
    .note { font-style: italic; color: #8C8275; font-size: 16px; line-height: 1.6; }
    .cta { display: inline-block; padding: 14px 28px; background: #4F6F57; color: #FBF8F3; text-decoration: none; border-radius: 6px; font-family: 'Helvetica Neue', sans-serif; font-size: 15px; margin: 8px 4px 8px 0; }
    .cta-outline { display: inline-block; padding: 13px 24px; background: transparent; color: #4F6F57; text-decoration: none; border-radius: 6px; border: 1px solid #4F6F57; font-family: 'Helvetica Neue', sans-serif; font-size: 14px; margin: 8px 4px; }
    .detail { font-family: 'Helvetica Neue', sans-serif; font-size: 13px; color: #8C8275; }
    .detail-row { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0; border-bottom: 1px solid #E4DAC9; gap: 16px; }
    .footer { margin-top: 32px; font-family: 'Helvetica Neue', sans-serif; font-size: 12px; color: #8C8275; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">By Mosaic LLC · Los Angeles</div>

    <h1>Your wedding estimate, ${name.split(" ")[0]}.</h1>
    <p style="color: #8C8275; font-size: 15px; margin-bottom: 20px;">Built from real LA vendor data. Here's what your mosaic looks like.</p>

    <div class="total">${fmt(calculatedTotal)}</div>
    <div class="range">Realistic range: ${fmt(calculatedTotal * 0.9)} – ${fmt(calculatedTotal * 1.15)}</div>

    <div class="divider"></div>

    <div>
      <div class="detail-row">
        <span class="detail">Guests:</span>
        <span class="detail" style="color: #2B2622; font-weight: 500;">${guestCount}</span>
      </div>
      <div class="detail-row">
        <span class="detail">Location:</span>
        <span class="detail" style="color: #2B2622; font-weight: 500;">${locationName}</span>
      </div>
      <div class="detail-row">
        <span class="detail">Style:</span>
        <span class="detail" style="color: #2B2622; font-weight: 500;">${tierLabel[tier]}</span>
      </div>
      ${venueName ? `<div class="detail-row"><span class="detail">Venue:</span><span class="detail" style="color: #2B2622; font-weight: 500;">${venueName}</span></div>` : ""}
    </div>

    <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 15px; color: #2B2622; line-height: 1.6; margin: 24px 0 8px 0;">
      Your PDF is attached to this message and if you&apos;d like to talk with a wedding professional we&apos;re here to help!
    </p>

    <div style="margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_BOOKING_URL || "https://bymosaic.com"}" class="cta">Schedule a free consultation</a>
      <a href="mailto:${recipientEmail}" class="cta-outline">Reply directly to Kristina</a>
    </div>

    <div class="footer">
      <p>By Mosaic LLC · bymosaic.com<br>
      Numbers reflect current LA market rates. Individual quotes will vary.<br>
      You received this because you requested it from our budget calculator.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const resend = getResend();

    // Send emails in parallel
    const emailPromises: Promise<unknown>[] = [];

    // Send to Kristina
    emailPromises.push(
      resend.emails.send({
        from: "By Mosaic Calculator <noreply@bymosaic.com>",
        to: [recipientEmail],
        subject: `[${score}] New lead: ${name} · ${guestCount}g · ${locationName} · ${fmt(calculatedTotal)}`,
        html: adminEmailHtml,
        replyTo: email,
      })
    );

    // Send PDF estimate to couple
    emailPromises.push(
      resend.emails.send({
        from: "Kristina at By Mosaic <kristina@bymosaic.com>",
        to: [email],
        subject: "Your By Mosaic wedding estimate",
        html: coupleEmailHtml,
        replyTo: recipientEmail,
        attachments: [
          {
            filename: "your-mosaic-estimate.pdf",
            content: pdfBase64,
          },
        ],
      })
    );

    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
