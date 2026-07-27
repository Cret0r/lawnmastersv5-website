// Single source of truth for gallery item categories — the admin Gallery
// tab's dropdown and the /gallery filter tabs both read from this list.
// To add/rename/remove a category: edit this array only. If you change it,
// also update the keyword-guess CASE in scripts/009_gallery_categories.sql
// so future backfills stay consistent (existing rows are unaffected either
// way — categories are stored as plain text on each row, not a DB enum).
export const GALLERY_CATEGORIES = ["Cleanups", "Mowing", "Pressure Washing", "Landscaping", "Other"] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export const DEFAULT_GALLERY_CATEGORY: GalleryCategory = "Other"

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value)
}
