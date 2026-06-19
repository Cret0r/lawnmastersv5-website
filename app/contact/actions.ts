"use server"

import { createAdminClient } from "@/lib/supabase/admin"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim()
}

export async function submitContactMessage(formData: FormData) {
  const name = sanitize((formData.get("name") as string) || "")
  const email = sanitize((formData.get("email") as string) || "")
  const phone = sanitize((formData.get("phone") as string) || "")
  const subject = sanitize((formData.get("subject") as string) || "")
  const message = sanitize((formData.get("message") as string) || "")

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields." }
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Please enter a valid email address." }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  })

  if (error) {
    console.error("Contact form error:", error)
    return { error: "Something went wrong. Please try again." }
  }

  return { success: true }
}
