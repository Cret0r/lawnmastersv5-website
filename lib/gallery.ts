// Public gallery data access. Reads published admin-uploaded before/after
// items. Fails soft: if the table doesn't exist yet (migration 006 not run)
// or Supabase is unreachable, callers get [] and the page falls back to the
// hardcoded transformations.

import { createAdminClient } from "@/lib/supabase/admin"

export type GalleryItemType = "before_after" | "single"

export interface GalleryItem {
  id: string
  created_at: string
  title: string
  description: string | null
  services: string[]
  item_type: GalleryItemType
  before_url: string
  after_url: string | null
  published: boolean
  featured: boolean
  sort_order: number
}

export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Gallery fetch failed (run scripts/006?):", error.message)
      return []
    }
    return (data as GalleryItem[]) ?? []
  } catch {
    return []
  }
}

// Homepage "Real Before & After Transformations" section — admin-controlled
// via the Feature star in /admin's Gallery tab (scripts/007). Ordered by the
// same sort_order the Move Up/Down buttons write. Empty on purpose if
// nothing is featured yet — the caller hides the section rather than
// showing placeholder content.
// item_type is missing (undefined) on any row created before scripts/007 was
// run, or before the column existed at all — after_url presence is a fully
// reliable signal regardless of migration state (single-image items never
// have one; before/after pairs always do), so every place that needs to
// branch on item shape should use this instead of trusting item_type alone.
export function getEffectiveItemType(item: Pick<GalleryItem, "item_type" | "after_url">): GalleryItemType {
  return item.after_url ? "before_after" : "single"
}

export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Featured gallery fetch failed (run scripts/007?):", error.message)
      return []
    }
    return (data as GalleryItem[]) ?? []
  } catch {
    return []
  }
}
