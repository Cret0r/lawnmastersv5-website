// Public gallery data access. The gallery_items table is the SINGLE SOURCE
// OF TRUTH for both /gallery and the homepage's featured section — there is
// no hardcoded fallback array in code (session 17; see docs/DECISIONS.md).
// Fails soft: if the table doesn't exist yet or Supabase is unreachable,
// callers get [] rather than throwing.

import { createAdminClient } from "@/lib/supabase/admin"
import type { GalleryCategory } from "@/lib/gallery-categories"

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
  sort_order: number // homepage/featured order (session 17)
  gallery_order: number // /gallery page order, independent (session 18)
  category: GalleryCategory // admin-assigned, drives /gallery filter tabs (session 19)
}

// item_type is missing (undefined, via the DB default 'before_after' — but
// treat it defensively anyway) on any row inserted before this column
// existed. after_url presence is a fully reliable signal regardless of
// migration state: single-image items never have one, before/after pairs
// always do. Every place that needs to branch on item shape should use
// this instead of trusting item_type alone.
export function getEffectiveItemType(item: Pick<GalleryItem, "item_type" | "after_url">): GalleryItemType {
  return item.after_url ? "before_after" : "single"
}

// /gallery page — ordered by gallery_order, which is independent of the
// homepage's sort_order (session 18; see docs/DECISIONS.md). Admin
// controls it via the Gallery-order Move Up/Down buttons.
export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .order("gallery_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Gallery fetch failed (run scripts/008?):", error.message)
      return []
    }
    return (data as GalleryItem[]) ?? []
  } catch {
    return []
  }
}

// Homepage "Real Before & After Transformations" section — admin-controlled
// via the Feature star in /admin's Gallery tab. Ordered by sort_order,
// which the Homepage-order Move Up/Down buttons write — independent of
// gallery_order (session 18). Empty on purpose if nothing is featured yet
// — the caller hides the section rather than showing placeholder content.
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
