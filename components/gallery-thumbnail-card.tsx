interface GalleryThumbnailCardProps {
  itemType: "before_after" | "single"
  beforeImage: string
  afterImage?: string | null
  title: string
  subtitle: string
  onClick: () => void
}

// Compact, non-interactive portfolio card for the /gallery grid. A
// before/after item gets a static side-by-side preview (not the drag
// slider — that only appears in the lightbox); a single-image item gets
// the one photo. Clicking opens the full interactive view.
export function GalleryThumbnailCard({
  itemType,
  beforeImage,
  afterImage,
  title,
  subtitle,
  onClick,
}: GalleryThumbnailCardProps) {
  const isBeforeAfter = itemType === "before_after" && Boolean(afterImage)

  return (
    <button
      type="button"
      onClick={onClick}
      data-gallery-card={title}
      className="group text-left rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {isBeforeAfter ? (
          <div className="absolute inset-0 flex">
            <div className="relative w-1/2 h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforeImage || "/placeholder.svg"}
                alt={`${title} — before`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-sm bg-foreground/70 text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
                Before
              </span>
            </div>
            <div className="relative w-1/2 h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterImage || "/placeholder.svg"}
                alt={`${title} — after`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-sm bg-primary/80 text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
                After
              </span>
            </div>
            <div className="absolute inset-y-0 left-1/2 w-px bg-primary-foreground/70 -translate-x-1/2" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={beforeImage || "/placeholder.svg"}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-background/90 text-foreground text-xs font-semibold shadow">
            {isBeforeAfter ? "View slider" : "View photo"}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground font-serif line-clamp-1">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{subtitle}</p>}
      </div>
    </button>
  )
}
