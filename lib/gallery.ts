// Public gallery data access. Reads published admin-uploaded before/after
// items. Fails soft: if the table doesn't exist yet (migration 006 not run)
// or Supabase is unreachable, callers get [] and the page falls back to the
// hardcoded transformations.

import { createAdminClient } from "@/lib/supabase/admin"

export interface GalleryItem {
  id: string
  created_at: string
  title: string
  description: string | null
  services: string[]
  before_url: string
  after_url: string
  published: boolean
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
