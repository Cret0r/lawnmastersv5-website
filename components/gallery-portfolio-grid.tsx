"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { GalleryThumbnailCard } from "@/components/gallery-thumbnail-card"
import { GalleryItemCard } from "@/components/gallery-item-card"
import type { GalleryItemType } from "@/lib/gallery"

export interface PortfolioItem {
  id: string
  title: string
  description: string
  itemType: GalleryItemType
  beforeImage: string
  afterImage: string | null
  services: string[]
}

// Filter tabs are derived straight from real service tags (not hand-picked
// categories) so they never drift out of sync with what's actually in the
// database — only tags that appear on 2+ items become a tab, capped so the
// row doesn't overflow.
const MAX_FILTER_TABS = 6
const MIN_TAG_FREQUENCY = 2

function deriveFilterTags(items: PortfolioItem[]): string[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const service of item.services) {
      counts.set(service, (counts.get(service) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= MIN_TAG_FREQUENCY)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_FILTER_TABS)
    .map(([tag]) => tag)
}

export function GalleryPortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null)

  const filterTags = useMemo(() => deriveFilterTags(items), [items])
  const filtered = activeFilter ? items.filter((item) => item.services.includes(activeFilter)) : items

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground max-w-2xl mx-auto">
        New before-and-after photos are on the way — check back soon.
      </p>
    )
  }

  return (
    <div>
      {filterTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Filter by service">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === null}
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-input hover:bg-secondary"
            }`}
          >
            All
          </button>
          {filterTags.map((tag) => (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={activeFilter === tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeFilter === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-input hover:bg-secondary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          No projects tagged &ldquo;{activeFilter}&rdquo; yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto" data-testid="gallery-grid">
          {filtered.map((item) => (
            <GalleryThumbnailCard
              key={item.id}
              itemType={item.itemType}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              title={item.title}
              subtitle={item.services.slice(0, 2).join(" · ")}
              onClick={() => setOpenItem(item)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!openItem} onOpenChange={(open) => !open && setOpenItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="gallery-lightbox">
          <DialogTitle className="sr-only">{openItem?.title}</DialogTitle>
          {openItem && (
            <GalleryItemCard
              itemType={openItem.itemType}
              beforeImage={openItem.beforeImage}
              afterImage={openItem.afterImage}
              title={openItem.title}
              description={openItem.description}
              services={openItem.services}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
