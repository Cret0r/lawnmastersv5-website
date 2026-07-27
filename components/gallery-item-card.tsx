import { GalleryMedia } from "@/components/gallery-media"

interface GalleryItemCardProps {
  itemType: "before_after" | "single"
  beforeImage: string
  afterImage?: string | null
  title: string
  description?: string | null
  services: string[]
}

// The full gallery card: media (slider or single image) + title +
// description + service tags. Shared by /gallery and the homepage's
// featured section so a card looks and behaves identically in both places
// — only the surrounding grid/layout differs per page.
export function GalleryItemCard({ itemType, beforeImage, afterImage, title, description, services }: GalleryItemCardProps) {
  return (
    <div className="flex flex-col gap-6" data-gallery-card={title}>
      <GalleryMedia itemType={itemType} beforeImage={beforeImage} afterImage={afterImage} alt={title} />
      <div className="px-1">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 font-serif">{title}</h3>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed max-w-3xl">{description}</p>
        )}
        {services.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Services performed:
            </h4>
            <div className="flex flex-wrap gap-2">
              {services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
