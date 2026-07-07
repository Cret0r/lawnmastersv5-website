import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Before & After Lawn Care Gallery — Covington, GA",
  description:
    "See real before and after lawn transformations by Lawn Masters V5 in Covington and Conyers, GA.",
}

const transformations = [
  {
    title: "Complete Backyard Cleanup & Clearing",
    description:
      "This overgrown, neglected backyard was completely cleared of weeds, debris, and dead vegetation. We restored the entire yard to a clean, maintained state ready for the homeowner to enjoy their outdoor space again.",
    beforeImage: "/real-before-backyard.jpg",
    afterImage: "/real-after-backyard.jpg",
    services: ["Lawn Care", "Weed Removal", "Debris Cleanup", "Mowing"],
  },
  {
    title: "Side Yard Overgrowth Removal",
    description:
      "Waist-high grass and dense weeds had completely taken over this side yard. Our crew cleared all the overgrowth, cut everything down to ground level, and restored full access to the property.",
    beforeImage: "/real-before-sideyard.jpg",
    afterImage: "/real-after-sideyard.jpg",
    services: ["Weed Removal", "Mowing", "Brush Clearing", "Cleanup"],
  },
  {
    title: "Front Yard Lawn Restoration",
    description:
      "Overgrown front lawn with tall grass and weeds growing into the sidewalk transformed into a neatly mowed, clean-edged property. Professional mowing and edging restored the curb appeal.",
    beforeImage: "/gallery/front-yard-before.jpg",
    afterImage: "/gallery/front-yard-after.jpg",
    services: ["Professional Mowing", "Edging", "Cleanup", "Lawn Care"],
  },
  {
    title: "Brick Paver Walkway Pressure Washing",
    description:
      "Years of moss and algae buildup had darkened this brick paver walkway. Our pressure washing service restored the bright red color and removed all organic growth from between the pavers.",
    beforeImage: "/gallery/brick-paver-before.jpg",
    afterImage: "/gallery/brick-paver-after.jpg",
    services: ["Pressure Washing", "Paver Cleaning", "Moss Removal"],
  },
  {
    title: "Mailbox Lawn Strip Maintenance",
    description:
      "Overgrown grass around the mailbox area was professionally mowed and edged. Clean lines along the sidewalk and curb restored the neat appearance of the property entrance.",
    beforeImage: "/gallery/mailbox-before.jpg",
    afterImage: "/gallery/mailbox-after.jpg",
    services: ["Professional Mowing", "Edging", "Lawn Care"],
  },
  {
    title: "Driveway Pressure Washing",
    description:
      "Heavy moss and algae staining had turned this concrete driveway dark and slippery. Professional pressure washing removed all buildup and restored the clean gray concrete surface.",
    beforeImage: "/gallery/driveway-before.jpg",
    afterImage: "/gallery/driveway-after.jpg",
    services: ["Pressure Washing", "Driveway Cleaning", "Surface Restoration"],
  },
  {
    title: "Side Yard Lawn Restoration",
    description:
      "Weeds and overgrown grass had taken over this narrow side yard between properties. Professional mowing and cleanup restored the space to a well-maintained condition.",
    beforeImage: "/gallery/sideyard2-before.jpg",
    afterImage: "/gallery/sideyard2-after.jpg",
    services: ["Mowing", "Weed Removal", "Cleanup", "Edging"],
  },
  {
    title: "Large Backyard Mowing",
    description:
      "This spacious fenced backyard had tall, uneven grass with debris scattered throughout. Our team mowed the entire area to a uniform height and cleaned up all debris.",
    beforeImage: "/gallery/backyard2-before.jpg",
    afterImage: "/gallery/backyard2-after.jpg",
    services: ["Professional Mowing", "Debris Cleanup", "Lawn Care"],
  },
  {
    title: "AC Unit Side Yard Cleanup",
    description:
      "Tall overgrown grass along the white vinyl fence near the AC unit was professionally mowed and trimmed. The area is now neat and accessible for maintenance.",
    beforeImage: "/gallery/ac-unit-before.jpg",
    afterImage: "/gallery/ac-unit-after.jpg",
    services: ["Mowing", "Trimming", "Side Yard Cleanup"],
  },
  {
    title: "Mulch Bed Refresh & Edging",
    description:
      "Sparse, weedy mulch bed around the agave and sago palms was refreshed with fresh mulch and clean edging along the driveway for a polished look.",
    beforeImage: "/gallery/mulch-before.jpg",
    afterImage: "/gallery/mulch-after.jpg",
    services: ["Mulching", "Bed Edging", "Weed Removal", "Landscaping"],
  },
  {
    title: "Fenced Backyard Restoration",
    description:
      "Overgrown and uneven grass in this spacious fenced backyard was professionally mowed to a uniform height with clean lines along the paver walkway.",
    beforeImage: "/gallery/fenced-backyard-before.jpg",
    afterImage: "/gallery/fenced-backyard-after.jpg",
    services: ["Professional Mowing", "Lawn Care", "Edging"],
  },
  {
    title: "Overgrown Lot Clearing",
    description:
      "Severely overgrown lot with waist-high weeds and debris was completely cleared down to bare ground. Brush was piled and removed to prepare the property for future use.",
    beforeImage: "/gallery/lot-clearing-before.jpg",
    afterImage: "/gallery/lot-clearing-after.jpg",
    services: ["Lot Clearing", "Brush Removal", "Weed Removal", "Debris Cleanup"],
  },
]

export default function ProjectsPage() {
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
            Drag the slider to see the dramatic before and after transformations we deliver for our clients.
          </p>
        </div>
      </section>

      {/* Before / After Comparisons */}
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
              Slide to reveal the transformation. Every project showcases our commitment to quality craftsmanship.
            </p>
          </div>

          <div className="flex flex-col gap-16 sm:gap-20 max-w-5xl mx-auto">
            {transformations.map((project, index) => (
              <div key={index} className="flex flex-col gap-6">
                <BeforeAfterSlider
                  beforeImage={project.beforeImage}
                  afterImage={project.afterImage}
                />
                <div className="px-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 font-serif">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Services performed:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-serif">
                2,500+
              </div>
              <div className="text-muted-foreground text-sm">Properties Maintained</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-serif">
                5+
              </div>
              <div className="text-muted-foreground text-sm">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-serif">
                100%
              </div>
              <div className="text-muted-foreground text-sm">Customer Satisfaction</div>
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
