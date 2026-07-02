"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { destroyAdminSession, isAdminAuthenticated } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export async function updateSubmissionStatus(id: string, status: string) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("quote_submissions")
    .update({ status })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteSubmission(id: string) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("quote_submissions")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function updateMessageRead(id: string, read: boolean) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteMessage(id: string) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function signOutAction() {
  await destroyAdminSession()
}
