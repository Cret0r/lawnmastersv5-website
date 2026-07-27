import { BeforeAfterSlider } from "@/components/before-after-slider"

interface GalleryMediaProps {
  itemType: "before_after" | "single"
  beforeImage: string
  afterImage?: string | null
  alt: string
}

// Renders the visual for one gallery item: a drag slider for before/after
// pairs, or a plain image card for single-photo items. Shared by /gallery
// and the homepage featured section so both stay visually consistent.
// Branches on afterImage presence (not just itemType) so it's correct even
// for rows where item_type isn't populated yet.
export function GalleryMedia({ itemType, beforeImage, afterImage, alt }: GalleryMediaProps) {
  if (itemType === "single" || !afterImage) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage || "/placeholder.svg"}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    )
  }

  return <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
}
