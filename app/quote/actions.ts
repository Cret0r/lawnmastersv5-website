"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { isRateLimited } from "@/lib/rate-limit"

const quoteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
})

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim()
}

export async function submitQuote(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? "unknown"

  if (isRateLimited(ip)) {
    return { error: "Too many requests. Please wait 15 minutes before trying again." }
  }

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

  const validation = quoteSchema.safeParse({ firstName, lastName, email, phone, address, services })
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const supabase = createAdminClient()

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
