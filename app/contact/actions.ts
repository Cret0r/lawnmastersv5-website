"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { isRateLimited } from "@/lib/rate-limit"
import { sendLeadNotification } from "@/lib/notify"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim()
}

export async function submitContactMessage(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? "unknown"

  if (isRateLimited(ip)) {
    return { error: "Too many requests. Please wait 15 minutes before trying again." }
  }

  const name = sanitize((formData.get("name") as string) || "")
  const email = sanitize((formData.get("email") as string) || "")
  const phone = sanitize((formData.get("phone") as string) || "")
  const subject = sanitize((formData.get("subject") as string) || "")
  const message = sanitize((formData.get("message") as string) || "")

  const validation = contactSchema.safeParse({ name, email, message })
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    return { error: "Something went wrong. Please try again." }
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  })

  if (error) {
    console.error("Contact form error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return { error: "Something went wrong. Please try again." }
  }

  await sendLeadNotification(`New contact message — ${name}`, [
    `Name: ${name}`,
    phone && `Phone: ${phone}`,
    `Email: ${email}`,
    subject && `Subject: ${subject}`,
    "",
    message,
    "",
    "Reply fast — speed to lead wins the job. Full details at lawnmastersv5.com/admin",
  ])

  return { success: true }
}
