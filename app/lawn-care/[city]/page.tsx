import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ReviewCard } from "@/components/review-card"
import { springRush } from "@/lib/spring-rush-content"
import { reviews } from "@/lib/reviews-data"
import { BUSINESS, smsHref } from "@/lib/business-info"
import { cityPages, getCityPage } from "@/lib/city-pages"
import { Phone, MessageSquare, CheckCircle, MapPin, Scissors, Flower2, SprayCan, LeafyGreen } from "lucide-react"

export function generateStaticParams() {
  return cityPages.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const page = getCityPage(city)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://${BUSINESS.domain}/lawn-care/${page.slug}` },
  }
}

const cityServices = [
  { icon: Scissors, title: "Weekly & Biweekly Mowing", description: "Professional mowing, precision edging, full cleanup — no clippings left behind." },
  { icon: Flower2, title: "Landscaping Cleanups", description: "Bed refresh, mulch, weeding, shrub trimming, and debris haul-away." },
  { icon: SprayCan, title: "Pressure Washing", description: "Driveways, siding, walkways, and fences — from $197." },
  { icon: LeafyGreen, title: "Seasonal Cleanup", description: "Spring and fall cleanups, leaf removal, and gutter cleaning." },
]

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const page = getCityPage(city)
  if (!page) notFound()

  const cityReviews = reviews.filter((r) => r.location.startsWith(page.city))
  const displayReviews = cityReviews.length > 0 ? cityReviews : reviews

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Lawn Care",
    name: `Lawn Care in ${page.city}, GA`,
    description: page.description,
    url: `https://${BUSINESS.domain}/lawn-care/${page.slug}`,
    areaServed: { "@type": "City", name: page.city, containedInPlace: { "@type": "State", name: "Georgia" } },
    provider: { "@id": `https://${BUSINESS.domain}/#business` },
    offers: springRush.pricing.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price.replace(/[^0-9–\-]/g, "").split(/[–-]/)[0],
      priceCurrency: "USD",
      description: `${plan.name} — ${plan.note}`,
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-foreground">
          <div className="absolute inset-0 z-0">
            <Image src={page.heroImage} alt={`Lawn care in ${page.city}, Georgia`} fill className="object-cover opacity-25" priority />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {page.city}, Georgia
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">{page.h1}</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8 leading-relaxed">{page.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 py-6 transition-all hover:scale-105">
                <a href={BUSINESS.telHref} className="inline-flex items-center gap-2">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </a>
              </Button>
              <Button asChild size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 text-base sm:text-lg px-8 py-6 transition-all hover:scale-105">
                <a href={smsHref(`Hi, I'd like a free lawn care quote in ${page.city}. My address is ____.`)} className="inline-flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  Text for a Free Quote
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Local angle */}
        <section className="py-14 sm:py-18 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why {page.city} homeowners choose us</span>
              <p className="text-lg sm:text-xl text-foreground mt-4 leading-relaxed">{page.localAngle}</p>
              <p className="text-sm text-muted-foreground mt-4">{page.neighborhoodsLine}</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-14 sm:py-18 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground text-balance">
                What we do in {page.city}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {cityServices.map((service) => (
                <Card key={service.title} className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent">
                <Link href="/services">See All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-14 sm:py-18 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground">
                {page.city} Mowing Plans
              </h2>
              <p className="text-muted-foreground mt-2">No contracts. Cancel anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              {springRush.pricing.plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={
                    plan.highlighted
                      ? "relative flex flex-col border-primary ring-2 ring-primary/20 shadow-lg"
                      : "relative flex flex-col border-border hover:border-primary/40 hover:shadow-md transition-all"
                  }
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                    <p className="text-lg font-semibold text-foreground mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-5">{plan.note}</p>
                    <ul className="flex-1 space-y-2.5 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className={plan.highlighted ? "w-full bg-primary hover:bg-primary/90 text-primary-foreground" : "w-full bg-foreground hover:bg-foreground/90 text-background"}>
                      <a href={BUSINESS.telHref} className="inline-flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        Lock In My Spot
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-14 sm:py-18 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground text-balance">
                What your neighbors are saying
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {displayReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-20 bg-foreground">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif text-primary-foreground mb-4 text-balance">
              Ready for a better lawn in {page.city}?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Free estimates, fast replies, and no contracts. Call, text, or request a quote online — English or Spanish.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 transition-all hover:scale-105">
                <a href={BUSINESS.telHref} className="inline-flex items-center gap-2">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-10 py-6 bg-transparent transition-all">
                <Link href="/quote">Request Free Estimate</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
