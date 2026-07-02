import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Lazy-initialize so the build doesn't fail without env vars
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) console.error("[email] RESEND_API_KEY is not set - notification emails will NOT be delivered.");
  return new Resend(key ?? "placeholder");
}

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  guestCount?: string;
  occasion?: string;
  hearAbout?: string;
  message?: string;
  company?: string; // honeypot — must stay empty
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 16px 8px 0;color:#8C8275;font:13px/1.4 -apple-system,Segoe UI,sans-serif;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;color:#2B2622;font:15px/1.5 -apple-system,Segoe UI,sans-serif;">${esc(value)}</td>
  </tr>`;
}

export async function POST(req: NextRequest) {
  let data: ContactPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept bots without sending
  if (data.company && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide your name and a valid email address." },
      { status: 400 }
    );
  }

  const recipientEmail = process.env.RECIPIENT_EMAIL || "kristina@bymosaic.com";

  const html = `<!DOCTYPE html>
<html><body style="margin:0;background:#F6F1E9;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#FBF8F3;border:1px solid #E4DAC9;border-radius:10px;overflow:hidden;">
    <div style="background:#4F6F57;padding:20px 28px;">
      <p style="margin:0;color:#F6F1E9;font:600 12px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:0.14em;text-transform:uppercase;">By Mosaic — New Inquiry</p>
    </div>
    <div style="padding:24px 28px;">
      <h1 style="margin:0 0 18px;color:#2B2622;font:500 22px/1.2 Georgia,serif;">${esc(name)} reached out</h1>
      <table style="border-collapse:collapse;width:100%;">
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Phone", data.phone)}
        ${row("Event date", data.eventDate)}
        ${row("Guest count", data.guestCount)}
        ${row("Occasion", data.occasion)}
        ${row("Heard via", data.hearAbout)}
      </table>
      ${
        data.message
          ? `<div style="margin-top:18px;padding-top:18px;border-top:1px solid #E4DAC9;">
              <p style="margin:0 0 6px;color:#8C8275;font:13px -apple-system,Segoe UI,sans-serif;">Message</p>
              <p style="margin:0;color:#2B2622;font:15px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap;">${esc(data.message)}</p>
            </div>`
          : ""
      }
      <a href="mailto:${esc(email)}?subject=Re:%20Your%20By%20Mosaic%20inquiry&body=Hi%20${encodeURIComponent(name)},"
         style="display:inline-block;margin-top:24px;background:#4F6F57;color:#FBF8F3;text-decoration:none;padding:11px 22px;border-radius:6px;font:500 14px -apple-system,Segoe UI,sans-serif;">
        Reply to ${esc(name)} →
      </a>
    </div>
  </div>
</body></html>`;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: "By Mosaic Website <noreply@bymosaic.com>",
      to: [recipientEmail],
      subject: `New inquiry from ${name}${data.occasion ? ` · ${data.occasion}` : ""}`,
      replyTo: email,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message. Please email info@bymosaic.com." },
      { status: 500 }
    );
  }
}
