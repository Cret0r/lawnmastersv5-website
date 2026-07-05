// Speed-to-lead notification — emails the owner the moment a form is submitted
// so leads can be answered in minutes instead of waiting for an /admin check.
//
// Uses the Resend REST API directly (no SDK dependency).
// Required env vars (Vercel + .env.local):
//   RESEND_API_KEY     — from resend.com → API Keys
//   LEAD_NOTIFY_EMAIL  — where lead alerts go (e.g. lawnmastersv5@gmail.com)
// Optional:
//   LEAD_NOTIFY_FROM   — verified sender; defaults to Resend's onboarding
//                        address, which can only deliver to the Resend
//                        account owner's email until a domain is verified.
//
// Fails soft by design: if unconfigured or Resend is down, the lead is still
// saved to Supabase and the form still succeeds — only the alert is skipped.

// `lines` accepts falsy entries so callers can write `value && "Label: ..."` —
// they are filtered out before sending.
export async function sendLeadNotification(subject: string, lines: Array<string | false>) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAIL

  if (!apiKey || !to) {
    console.warn("Lead notification skipped: RESEND_API_KEY / LEAD_NOTIFY_EMAIL not set")
    return
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_NOTIFY_FROM ?? "Lawn Masters V5 Leads <onboarding@resend.dev>",
        to: [to],
        subject,
        text: lines.filter(Boolean).join("\n"),
      }),
    })

    if (!res.ok) {
      console.error("Lead notification failed:", res.status, await res.text())
    }
  } catch (err) {
    console.error("Lead notification failed:", err)
  }
}
