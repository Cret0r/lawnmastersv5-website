import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Scissors,
  Flower2,
  TreePine,
  Fence,
  Droplets,
  LeafyGreen,
  SprayCan,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BUSINESS } from "@/lib/business-info"

export const metadata: Metadata = {
  title: "Lawn Care, Landscaping & Pressure Washing — Covington & Conyers, GA",
  description:
    "Professional lawn mowing, pressure washing, and landscaping in Covington, GA. Serving Newton County and surrounding areas. Free estimates available.",
}

export default function ServicesPage() {
  const services = [
    {
      icon: Scissors,
      title: "Lawn Care & Mowing",
      description:
        "Keep your lawn looking its best with our professional lawn care services. We provide regular mowing, edging, and trimming to maintain a lush, healthy lawn throughout the growing season.",
      features: [
        "Weekly or bi-weekly mowing schedules",
        "Precision edging along walkways and beds",
        "String trimming for hard-to-reach areas",
        "Fertilization and weed control programs",
        "Aeration and overseeding services",
      ],
    },
    {
      icon: Flower2,
      title: "Landscape Design & Installation",
      description:
        "Transform your property with custom landscape designs that reflect your style and enhance your home's curb appeal. From concept to completion, we handle every detail.",
      features: [
        "Custom design consultations",
        "3D landscape visualization",
        "Plant selection for your climate zone",
        "Complete garden bed installation",
        "Mulching and soil amendment",
      ],
    },
    {
      icon: TreePine,
      title: "Tree & Shrub Care",
      description:
        "Healthy trees and shrubs are the backbone of any great landscape. Our certified arborists provide expert care to keep your plants thriving and looking their best.",
      features: [
        "Professional pruning and shaping",
        "Tree and stump removal",
        "Disease and pest treatment",
        "New tree and shrub planting",
        "Hedge trimming and maintenance",
      ],
    },
    {
      icon: Fence,
      title: "Hardscaping",
      description:
        "Create stunning outdoor living spaces with our hardscaping services. We design and build durable patios, walkways, and retaining walls that add value and beauty to your property.",
      features: [
        "Custom patio design and construction",
        "Natural stone and paver walkways",
        "Retaining walls and garden borders",
        "Outdoor fire pits and seating areas",
        "Decorative stone and gravel features",
      ],
    },
    {
      icon: Droplets,
      title: "Irrigation & Drainage",
      description:
        "Efficient water management is essential for a healthy landscape. We install and maintain irrigation systems that save water while keeping your lawn and gardens thriving.",
      features: [
        "Sprinkler system design and installation",
        "Drip irrigation for garden beds",
        "Smart controller programming",
        "Drainage solutions for problem areas",
        "System winterization and spring startup",
      ],
    },
    {
      icon: LeafyGreen,
      title: "Seasonal Cleanup",
      description:
        "Keep your property looking great all year long with our seasonal cleanup services. We handle the heavy lifting so you can enjoy your outdoor space without the work.",
      features: [
        "Spring cleanup and bed preparation",
        "Fall leaf removal and disposal",
        "Garden bed cut-back and cleanup",
        "Gutter cleaning and debris removal",
        "Winter preparation and protection",
      ],
    },
    {
      icon: SprayCan,
      title: "Pressure Washing",
      description:
        "Bring your outdoor surfaces back to life with our professional pressure washing services. We remove years of dirt, grime, mold, and stains from driveways, sidewalks, patios, decks, and building exteriors.",
      features: [
        "Driveway and sidewalk cleaning",
        "Patio and deck restoration",
        "Building exterior and siding wash",
        "Fence and retaining wall cleaning",
        "Pre-paint surface preparation",
      ],
    },
  ]

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, i) => ({
      "@type": "Service",
      position: i + 1,
      serviceType: service.title,
      name: service.title,
      description: service.description,
      provider: { "@id": `https://${BUSINESS.domain}/#business` },
      areaServed: BUSINESS.cities.map((name) => ({ "@type": "City", name })),
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/landscape-design-garden-planting.jpg"
            alt="Our landscaping services"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 inline-block">What We Offer</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">Our Services</h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed">
            From routine lawn maintenance to exterior cleaning and property upkeep, Lawn Masters V5 serves Covington, GA and Newton County with 5+ years of experience.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="bg-card border-border overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-6 p-6 sm:p-8">
                    <div className="md:col-span-1">
                      <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 font-serif">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">What we provide:</h4>
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary-foreground mb-6 text-balance">
            Interested in our services?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Request a free estimate today and discover what we can do for your property.
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

      <Footer />
    </div>
  )
}
