"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { isRateLimited } from "@/lib/rate-limit"
import { sendLeadNotification } from "@/lib/notify"

// Conversational quick-lead flow: two questions (service + phone), minimal
// friction. Shared by /contact and /quote via components/quick-lead-form.tsx;
// writes into quote_submissions (admin Quotes tab + Resend speed-to-lead email).
// The table's NOT NULL name/email/address columns get readable sentinels —
// intentionally NOT a schema change (see docs/DECISIONS.md).

const quickLeadSchema = z.object({
  service: z.string().min(1, "Please pick a service"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim()
}

export async function submitQuickLead(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? "unknown"

  if (isRateLimited(ip)) {
    return { error: "Too many requests. Please wait 15 minutes before trying again." }
  }

  const service = sanitize((formData.get("service") as string) || "")
  const phone = sanitize((formData.get("phone") as string) || "")
  // Whitelisted, never interpolated raw — only two pages host this flow.
  const source = formData.get("source") === "quote" ? "quote page" : "contact page"

  const validation = quickLeadSchema.safeParse({ service, phone })
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    return { error: "Something went wrong. Please try again." }
  }

  const { error } = await supabase.from("quote_submissions").insert({
    first_name: "Quick",
    last_name: "Lead",
    email: "not-provided",
    phone,
    address: "Not provided — ask when texting",
    services: [service],
    details: `Submitted via the quick lead flow on the ${source} (service + phone only). Reply by text.`,
    status: "new",
  })

  if (error) {
    console.error("Quick lead insert error:", error)
    return { error: "Something went wrong. Please try again." }
  }

  await sendLeadNotification(`New quick lead — ${service}`, [
    `Service: ${service}`,
    `Phone: ${phone}`,
    "",
    `Source: quick lead flow on the ${source} (no name/email collected — reply by TEXT).`,
    "Reply fast — speed to lead wins the job. Full details at lawnmastersv5.com/admin",
  ])

  return { success: true }
}
