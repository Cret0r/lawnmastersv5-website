"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"
import type { GalleryItem } from "@/lib/gallery"

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 MB per photo
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export async function getGalleryItemsAdmin(): Promise<GalleryItem[]> {
  if (!(await isAdminAuthenticated())) {
    return []
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Admin gallery fetch failed:", error.message)
    return []
  }
  return (data as GalleryItem[]) ?? []
}

async function uploadPhoto(
  supabase: ReturnType<typeof createAdminClient>,
  file: File,
  path: string,
): Promise<{ url?: string; error?: string }> {
  const ext = ALLOWED_TYPES[file.type]
  if (!ext) return { error: "Photos must be JPG, PNG, or WebP." }
  if (file.size > MAX_FILE_BYTES) return { error: "Each photo must be under 8 MB." }

  const fullPath = `${path}.${ext}`
  const { error } = await supabase.storage.from("gallery").upload(fullPath, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  })
  if (error) {
    console.error("Gallery upload failed:", error.message)
    return { error: "Upload failed. Has scripts/006 been run (gallery bucket)?" }
  }
  const { data } = supabase.storage.from("gallery").getPublicUrl(fullPath)
  return { url: data.publicUrl }
}

export async function addGalleryItem(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }

  const title = ((formData.get("title") as string) || "").trim()
  const description = ((formData.get("description") as string) || "").trim()
  const servicesRaw = ((formData.get("services") as string) || "").trim()
  const before = formData.get("before") as File | null
  const after = formData.get("after") as File | null

  if (!title) return { success: false, error: "Title is required." }
  if (!before || before.size === 0 || !after || after.size === 0) {
    return { success: false, error: "Both a before photo and an after photo are required." }
  }

  const services = servicesRaw
    ? servicesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const supabase = createAdminClient()
  const id = crypto.randomUUID()

  const beforeUpload = await uploadPhoto(supabase, before, `${id}-before`)
  if (!beforeUpload.url) return { success: false, error: beforeUpload.error }
  const afterUpload = await uploadPhoto(supabase, after, `${id}-after`)
  if (!afterUpload.url) return { success: false, error: afterUpload.error }

  const { error } = await supabase.from("gallery_items").insert({
    id,
    title,
    description: description || null,
    services,
    before_url: beforeUpload.url,
    after_url: afterUpload.url,
    published: true,
  })

  if (error) {
    console.error("Gallery insert failed:", error.message)
    return { success: false, error: "Save failed. Has scripts/006 been run (gallery_items table)?" }
  }

  revalidatePath("/gallery")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }

  const supabase = createAdminClient()

  // Remove the storage objects first (ignore not-found so a half-deleted
  // item can still be cleaned up), then the row.
  const { data: item } = await supabase
    .from("gallery_items")
    .select("before_url, after_url")
    .eq("id", id)
    .single()

  if (item) {
    const paths = [item.before_url, item.after_url]
      .map((url: string) => url.split("/gallery/").pop())
      .filter((p): p is string => Boolean(p))
    if (paths.length > 0) {
      await supabase.storage.from("gallery").remove(paths)
    }
  }

  const { error } = await supabase.from("gallery_items").delete().eq("id", id)
  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/gallery")
  revalidatePath("/admin")
  return { success: true }
}
