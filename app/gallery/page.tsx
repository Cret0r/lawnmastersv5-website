import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GalleryPortfolioGrid } from "@/components/gallery-portfolio-grid"
import { getPublishedGalleryItems } from "@/lib/gallery"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Before & After Lawn Care Gallery — Covington, GA",
  description:
    "See real before and after lawn transformations by Lawn Masters V5 in Covington and Conyers, GA.",
  alternates: { canonical: "/gallery" },
}

export default async function ProjectsPage() {
  // gallery_items is the single source of truth (session 17) — every item,
  // including the original set, lives in Supabase and is fully admin-
  // editable. Falls back to an empty array (not an error) if scripts/007
  // hasn't been run yet.
  const allTransformations = (await getPublishedGalleryItems()).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    itemType: item.item_type,
    beforeImage: item.before_url,
    afterImage: item.after_url,
    services: item.services,
    category: item.category,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/backyard-transformation-complete.jpg"
            alt="Our landscaping projects"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 inline-block">
            Our Work
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">
            Our Gallery
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed">
            Drag any slider to see the before and after transformation.
          </p>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Transformations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mt-2 mb-4">
              Before & After
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Every project showcases our commitment to quality craftsmanship. Drag a slider to reveal the transformation.
            </p>
          </div>

          <GalleryPortfolioGrid items={allTransformations} />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-serif">
                40+
              </div>
              <div className="text-muted-foreground text-sm">Properties Maintained</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-serif">
                3+
              </div>
              <div className="text-muted-foreground text-sm">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-serif">
                Guaranteed
              </div>
              <div className="text-muted-foreground text-sm">Not right? We redo it free</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary-foreground mb-6 text-balance">
            Want results like these?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let us transform your outdoor space. Request a free estimate today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8"
          >
            <Link href="/quote">Get a Free Estimate</Link>
          </Button>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}
