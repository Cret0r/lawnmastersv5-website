"use server"

import { createAdminClient } from "@/lib/supabase/admin"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\d\s()+-]{7,20}$/

// Simple in-memory rate limiting (per server instance)
const submissions = new Map<string, number[]>()
const RATE_LIMIT = 3 // max submissions
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const attempts = submissions.get(ip) || []
  const recent = attempts.filter((t) => now - t < RATE_WINDOW)
  submissions.set(ip, recent)
  return recent.length >= RATE_LIMIT
}

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim()
}

export async function submitQuote(formData: FormData) {
  const supabase = createAdminClient()

  const firstName = sanitize((formData.get("firstName") as string) || "")
  const lastName = sanitize((formData.get("lastName") as string) || "")
  const email = sanitize((formData.get("email") as string) || "")
  const phone = sanitize((formData.get("phone") as string) || "")
  const address = sanitize((formData.get("address") as string) || "")
  const propertyType = sanitize((formData.get("propertyType") as string) || "")
  const propertySize = sanitize((formData.get("propertySize") as string) || "")
  const services = (formData.getAll("services") as string[]).map(sanitize)
  const timeline = sanitize((formData.get("timeline") as string) || "")
  const details = sanitize((formData.get("details") as string) || "")

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !address) {
    return { error: "Please fill in all required fields." }
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Please enter a valid email address." }
  }

  // Validate phone format
  if (!PHONE_REGEX.test(phone)) {
    return { error: "Please enter a valid phone number." }
  }

  // Rate limiting by email
  if (isRateLimited(email)) {
    return { error: "Too many submissions. Please try again later." }
  }

  // Record the attempt
  const attempts = submissions.get(email) || []
  attempts.push(Date.now())
  submissions.set(email, attempts)

  const { error } = await supabase.from("quote_submissions").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    address,
    property_type: propertyType || null,
    property_size: propertySize || null,
    services,
    timeline: timeline || null,
    details: details || null,
    status: "new",
  })

  if (error) {
    console.error("Supabase insert error:", error)
    return { error: "Something went wrong. Please try again." }
  }

  return { success: true }
}
