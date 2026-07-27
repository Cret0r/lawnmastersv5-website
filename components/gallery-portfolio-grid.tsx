"use client"

import { useState } from "react"
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
  category: string
}

// Every card is the full interactive slider (or enlarged single image) —
// no click-to-expand, no modal (session 19). Filter tabs come from each
// item's admin-assigned category, not derived service tags.
export function GalleryPortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground max-w-2xl mx-auto">
        New before-and-after photos are on the way — check back soon.
      </p>
    )
  }

  // Only categories that actually have at least one item become a tab, in a
  // stable order (first-seen), so the row never shows an empty filter.
  const categories = [...new Set(items.map((item) => item.category))]
  const filtered = activeCategory ? items.filter((item) => item.category === activeCategory) : items

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Filter by category">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === null}
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-input hover:bg-secondary"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-input hover:bg-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          No projects in &ldquo;{activeCategory}&rdquo; yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-14 max-w-5xl mx-auto" data-testid="gallery-grid">
          {filtered.map((item) => (
            <GalleryItemCard
              key={item.id}
              itemType={item.itemType}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              title={item.title}
              description={item.description}
              services={item.services}
            />
          ))}
        </div>
      )}
    </div>
  )
}
