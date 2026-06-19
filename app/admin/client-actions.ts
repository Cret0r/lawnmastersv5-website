"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export interface Client {
  id: string
  created_at: string
  updated_at: string
  name: string
  phone: string | null
  email: string | null
  address: string
  service_type: string
  frequency_days: number
  price: number | null
  last_service_date: string | null
  next_due_date: string | null
  notes: string | null
  hazards: string | null
  gate_code: string | null
  has_pets: boolean
  latitude: number | null
  longitude: number | null
  status: string
}

export async function getClients() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("next_due_date", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data as Client[]
}

export async function getClientsDueToday() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split("T")[0]
  
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("next_due_date", today)
    .eq("status", "active")
    .order("name")

  if (error) {
    console.error("Error fetching clients due today:", error)
    return []
  }

  return data as Client[]
}

export async function getClientsOverdue() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split("T")[0]
  
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .lt("next_due_date", today)
    .eq("status", "active")
    .order("next_due_date", { ascending: true })

  if (error) {
    console.error("Error fetching overdue clients:", error)
    return []
  }

  return data as Client[]
}

export async function getDashboardStats() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split("T")[0]
  
  const [totalResult, dueResult, overdueResult] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("clients").select("id", { count: "exact" }).eq("next_due_date", today).eq("status", "active"),
    supabase.from("clients").select("id", { count: "exact" }).lt("next_due_date", today).eq("status", "active"),
  ])

  return {
    totalClients: totalResult.count || 0,
    dueToday: dueResult.count || 0,
    overdue: overdueResult.count || 0,
  }
}

export async function addClient(formData: FormData) {
  const supabase = createAdminClient()
  
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  const service_type = formData.get("service_type") as string
  const frequency_days = parseInt(formData.get("frequency_days") as string) || 14
  const price = parseFloat(formData.get("price") as string) || null
  const notes = formData.get("notes") as string
  const hazards = formData.get("hazards") as string
  const gate_code = formData.get("gate_code") as string
  const has_pets = formData.get("has_pets") === "true"
  
  // Calculate next due date based on today
  const next_due_date = new Date()
  next_due_date.setDate(next_due_date.getDate() + frequency_days)

  const { error } = await supabase.from("clients").insert({
    name,
    phone: phone || null,
    email: email || null,
    address,
    service_type,
    frequency_days,
    price,
    notes: notes || null,
    hazards: hazards || null,
    gate_code: gate_code || null,
    has_pets,
    next_due_date: next_due_date.toISOString().split("T")[0],
    status: "active",
  })

  if (error) {
    console.error("Error adding client:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function updateClient(id: string, formData: FormData) {
  const supabase = createAdminClient()
  
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  const service_type = formData.get("service_type") as string
  const frequency_days = parseInt(formData.get("frequency_days") as string) || 14
  const price = parseFloat(formData.get("price") as string) || null
  const notes = formData.get("notes") as string
  const hazards = formData.get("hazards") as string
  const gate_code = formData.get("gate_code") as string
  const has_pets = formData.get("has_pets") === "true"

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      phone: phone || null,
      email: email || null,
      address,
      service_type,
      frequency_days,
      price,
      notes: notes || null,
      hazards: hazards || null,
      gate_code: gate_code || null,
      has_pets,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating client:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function markServiceComplete(id: string) {
  const supabase = createAdminClient()
  
  // Get client's frequency
  const { data: client } = await supabase
    .from("clients")
    .select("frequency_days")
    .eq("id", id)
    .single()

  if (!client) {
    return { success: false, error: "Client not found" }
  }

  const today = new Date()
  const next_due_date = new Date()
  next_due_date.setDate(today.getDate() + client.frequency_days)

  const { error } = await supabase
    .from("clients")
    .update({
      last_service_date: today.toISOString().split("T")[0],
      next_due_date: next_due_date.toISOString().split("T")[0],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error marking service complete:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteClient(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("clients")
    .update({ status: "inactive" })
    .eq("id", id)

  if (error) {
    console.error("Error deleting client:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}
