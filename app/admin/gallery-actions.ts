"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"
import { getEffectiveItemType, type GalleryItem, type GalleryItemType } from "@/lib/gallery"
import { DEFAULT_GALLERY_CATEGORY, isGalleryCategory } from "@/lib/gallery-categories"

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 MB per photo
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

function revalidateGalleryPaths() {
  revalidatePath("/gallery")
  revalidatePath("/")
  revalidatePath("/admin")
}

// Postgrest surfaces a missing column as e.g. `column "featured" does not
// exist` — translate that into an actionable message instead of a raw DB
// error, since the fix (run the migration) is the same every time.
function friendlyError(message: string): string {
  if (/column .* does not exist/i.test(message)) {
    return "This needs scripts/007_gallery_migration_and_features.sql run in Supabase first (see docs/sops/gallery-migration.md), then try again."
  }
  return message
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
    upsert: true,
  })
  if (error) {
    console.error("Gallery upload failed:", error.message)
    return { error: "Upload failed. Has scripts/006 been run (gallery bucket)?" }
  }
  const { data } = supabase.storage.from("gallery").getPublicUrl(fullPath)
  return { url: data.publicUrl }
}

// Migrated items (scripts/007) point at files under /public, not Supabase
// Storage — there's nothing to clean up there, and trying would just be a
// harmless no-op at best. Only ever remove URLs that are actually Storage
// objects.
async function deleteStorageObjects(supabase: ReturnType<typeof createAdminClient>, urls: (string | null)[]) {
  const paths = urls
    .filter((url): url is string => url !== null && url.startsWith("http"))
    .map((url) => url.split("/gallery/").pop())
    .filter((p): p is string => Boolean(p))
  if (paths.length > 0) {
    await supabase.storage.from("gallery").remove(paths)
  }
}

function parseServices(raw: string | null): string[] {
  const trimmed = (raw || "").trim()
  return trimmed ? trimmed.split(",").map((s) => s.trim()).filter(Boolean) : []
}

function parseCategory(raw: string | null): string {
  const trimmed = (raw || "").trim()
  return trimmed && isGalleryCategory(trimmed) ? trimmed : DEFAULT_GALLERY_CATEGORY
}

export async function addGalleryItem(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }

  const title = ((formData.get("title") as string) || "").trim()
  const description = ((formData.get("description") as string) || "").trim()
  const services = parseServices(formData.get("services") as string)
  const category = parseCategory(formData.get("category") as string)
  const itemType = ((formData.get("item_type") as string) || "before_after") as GalleryItemType

  if (!title) return { success: false, error: "Title is required." }
  if (itemType !== "before_after" && itemType !== "single") {
    return { success: false, error: "Invalid item type." }
  }

  const supabase = createAdminClient()
  const id = crypto.randomUUID()

  if (itemType === "single") {
    const photo = formData.get("photo") as File | null
    if (!photo || photo.size === 0) {
      return { success: false, error: "A photo is required." }
    }
    const upload = await uploadPhoto(supabase, photo, `${id}-single`)
    if (!upload.url) return { success: false, error: upload.error }

    const { error } = await supabase.from("gallery_items").insert({
      id,
      title,
      description: description || null,
      services,
      category,
      item_type: "single",
      before_url: upload.url,
      after_url: null,
      published: true,
      featured: false,
    })
    if (error) {
      console.error("Gallery insert failed:", error.message)
      return { success: false, error: friendlyError(error.message) }
    }
  } else {
    const before = formData.get("before") as File | null
    const after = formData.get("after") as File | null
    if (!before || before.size === 0 || !after || after.size === 0) {
      return { success: false, error: "Both a before photo and an after photo are required." }
    }

    const beforeUpload = await uploadPhoto(supabase, before, `${id}-before`)
    if (!beforeUpload.url) return { success: false, error: beforeUpload.error }
    const afterUpload = await uploadPhoto(supabase, after, `${id}-after`)
    if (!afterUpload.url) return { success: false, error: afterUpload.error }

    const { error } = await supabase.from("gallery_items").insert({
      id,
      title,
      description: description || null,
      services,
      category,
      item_type: "before_after",
      before_url: beforeUpload.url,
      after_url: afterUpload.url,
      published: true,
      featured: false,
    })
    if (error) {
      console.error("Gallery insert failed:", error.message)
      return { success: false, error: "Save failed. Has scripts/006 been run (gallery_items table)?" }
    }
  }

  revalidateGalleryPaths()
  return { success: true }
}

export async function updateGalleryItem(id: string, formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }

  const title = ((formData.get("title") as string) || "").trim()
  const description = ((formData.get("description") as string) || "").trim()
  const services = parseServices(formData.get("services") as string)

  if (!title) return { success: false, error: "Title is required." }

  const supabase = createAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !existing) {
    return { success: false, error: "Item not found." }
  }

  const item = existing as GalleryItem
  const update: Record<string, unknown> = {
    title,
    description: description || null,
    services,
  }
  const orphanedUrls: (string | null)[] = []

  if (getEffectiveItemType(item) === "single") {
    const photo = formData.get("photo") as File | null
    if (photo && photo.size > 0) {
      const upload = await uploadPhoto(supabase, photo, `${id}-single`)
      if (!upload.url) return { success: false, error: upload.error }
      if (upload.url !== item.before_url) orphanedUrls.push(item.before_url)
      update.before_url = upload.url
    }
  } else {
    const before = formData.get("before") as File | null
    const after = formData.get("after") as File | null

    if (before && before.size > 0) {
      const upload = await uploadPhoto(supabase, before, `${id}-before`)
      if (!upload.url) return { success: false, error: upload.error }
      if (upload.url !== item.before_url) orphanedUrls.push(item.before_url)
      update.before_url = upload.url
    }
    if (after && after.size > 0) {
      const upload = await uploadPhoto(supabase, after, `${id}-after`)
      if (!upload.url) return { success: false, error: upload.error }
      if (upload.url !== item.after_url) orphanedUrls.push(item.after_url)
      update.after_url = upload.url
    }
  }

  const { error } = await supabase.from("gallery_items").update(update).eq("id", id)
  if (error) {
    console.error("Gallery update failed:", error.message)
    return { success: false, error: friendlyError(error.message) }
  }

  // Clean up the old file only after the row update succeeds, and only when
  // the replacement got a different extension (upsert already overwrote it
  // in place otherwise) — matches how deleteGalleryItem cleans up storage.
  if (orphanedUrls.length > 0) {
    await deleteStorageObjects(supabase, orphanedUrls)
  }

  revalidateGalleryPaths()
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
    await deleteStorageObjects(supabase, [item.before_url, item.after_url])
  }

  const { error } = await supabase.from("gallery_items").delete().eq("id", id)
  if (error) {
    return { success: false, error: friendlyError(error.message) }
  }

  revalidateGalleryPaths()
  return { success: true }
}

export async function setGalleryItemFeatured(id: string, featured: boolean) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from("gallery_items").update({ featured }).eq("id", id)
  if (error) {
    return { success: false, error: friendlyError(error.message) }
  }
  revalidateGalleryPaths()
  return { success: true }
}

export async function setGalleryItemCategory(id: string, category: string) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }
  if (!isGalleryCategory(category)) {
    return { success: false, error: "Invalid category." }
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from("gallery_items").update({ category }).eq("id", id)
  if (error) {
    return { success: false, error: friendlyError(error.message) }
  }
  revalidateGalleryPaths()
  return { success: true }
}

export async function setGalleryItemPublished(id: string, published: boolean) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }
  const supabase = createAdminClient()
  // Unpublishing also un-features — an unpublished item has no business
  // showing up on the homepage.
  const update: Record<string, unknown> = { published }
  if (!published) update.featured = false
  const { error } = await supabase.from("gallery_items").update(update).eq("id", id)
  if (error) {
    return { success: false, error: friendlyError(error.message) }
  }
  revalidateGalleryPaths()
  return { success: true }
}

// Shared reorder engine. Fetches ONLY the rows matching `filterColumn = true`
// (the subset that actually renders wherever `orderColumn` is used — the
// featured items on the homepage, or the published items on /gallery),
// normalizes that subset to sequential order values matching its current
// display order, then swaps the target item with its neighbor WITHIN that
// subset. Operating on the filtered subset (not the whole table) matters:
// swapping with an invisible neighbor (e.g. an unfeatured item) would move
// data around with no visible effect, which is exactly the "button doesn't
// do anything" bug from the previous attempt at this feature.
async function moveWithinSubset(
  supabase: ReturnType<typeof createAdminClient>,
  id: string,
  direction: "up" | "down",
  filterColumn: "featured" | "published",
  orderColumn: "sort_order" | "gallery_order",
) {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, created_at")
    .eq(filterColumn, true)
    .order(orderColumn, { ascending: true })
    .order("created_at", { ascending: false })

  if (error || !data) {
    return { success: false, error: friendlyError(error?.message || "Could not load items.") }
  }

  const index = data.findIndex((row) => row.id === id)
  if (index === -1) return { success: true } // not in this subset — nothing to do

  const swapIndex = direction === "up" ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= data.length) {
    return { success: true } // already at the edge, nothing to do
  }

  const updates = data.map((row, i) => ({ id: row.id, value: i }))
  const tmp = updates[index].value
  updates[index].value = updates[swapIndex].value
  updates[swapIndex].value = tmp

  const results = await Promise.all(
    updates.map((u) => supabase.from("gallery_items").update({ [orderColumn]: u.value }).eq("id", u.id)),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) {
    return { success: false, error: friendlyError(failed.error.message) }
  }

  return { success: true }
}

// Reorders the /gallery page — independent of the homepage order (session
// 18). Only meaningful among published items (unpublished ones don't
// render on /gallery at all).
export async function moveItemInGalleryOrder(id: string, direction: "up" | "down") {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }
  const supabase = createAdminClient()
  const result = await moveWithinSubset(supabase, id, direction, "published", "gallery_order")
  if (result.success) revalidateGalleryPaths()
  return result
}

// Reorders the homepage's featured section — independent of the /gallery
// order. Only meaningful among featured items.
export async function moveItemInHomepageOrder(id: string, direction: "up" | "down") {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Unauthorized" }
  }
  const supabase = createAdminClient()
  const result = await moveWithinSubset(supabase, id, direction, "featured", "sort_order")
  if (result.success) revalidateGalleryPaths()
  return result
}
