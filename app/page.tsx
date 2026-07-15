import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import { ReviewCard } from "@/components/review-card"
import { springRush } from "@/lib/spring-rush-content"
import { reviews, googleReviewLink } from "@/lib/reviews-data"
import { BUSINESS } from "@/lib/business-info"
import {
  Scissors,
  Flower2,
  TreePine,
  Fence,
  Droplets,
  LeafyGreen,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  SprayCan,
  Phone,
  MessageSquare,
  Shield,
  MapPin,
  Star,
  Gift,
  MapPinIcon,
  MessageCircleIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Property Transformations & Lawn Care in Covington, GA — Lawn Masters V5",
  description: `We transform overgrown, neglected properties in Covington & Conyers, GA — cleanups, mulch, pressure washing, shrub care — often in one day. Free estimates, walk-through guarantee. Call ${BUSINESS.phoneDisplay}. Se Habla Español.`,
  alternates: { canonical: "/" },
}

export default function Home() {
  // Transformation-first order (docs/OFFERS.md) — maintenance deliberately last.
  const services = [
    {
      icon: LeafyGreen,
      title: "Property Refresh & Cleanups",
      description: "Full-yard cleanups, fresh mulch, defined beds, and haul-away — overgrown to impressive, often in one day.",
    },
    {
      icon: SprayCan,
      title: "Pressure Washing",
      description: "Restore driveways, sidewalks, patios, and exterior surfaces to like-new condition.",
    },
    {
      icon: Flower2,
      title: "Landscape Design",
      description: "Custom garden design, planting plans, and full landscape installations.",
    },
    {
      icon: TreePine,
      title: "Tree & Shrub Care",
      description: "Expert pruning, shaping, removal, and planting for healthy growth.",
    },
    {
      icon: Fence,
      title: "Hardscaping",
      description: "Patios, walkways, retaining walls, and outdoor living spaces built to last.",
    },
    {
      icon: Droplets,
      title: "Irrigation & Drainage",
      description: "Efficient sprinkler systems and drainage solutions for optimal water management.",
    },
    {
      icon: Scissors,
      title: "Recurring Maintenance",
      description: "Weekly and biweekly mowing routes that keep your refresh looking new. No contracts.",
    },
  ]

  const sr = springRush

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navigation />
      <main>

      {/* ════════════════ SPRING RUSH HERO ════════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-foreground">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 640px)" srcSet="/hero/hero-bg-mobile.jpg" />
            <source media="(max-width: 1024px)" srcSet="/hero/hero-bg-tablet.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/hero-bg-desktop.jpg"
              alt="Professional manicured lawn in Covington, Georgia"
              className="h-full w-full object-cover opacity-30"
              fetchPriority="high"
            />
          </picture>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground mb-4 text-balance leading-tight">
              We Transform Properties in{" "}
              <span className="text-primary">Covington & Conyers</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary-foreground/90 mb-4 text-balance">
              {sr.hero.headline}
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/70 mb-2 max-w-xl mx-auto">
              {sr.hero.subheadline}
            </p>
            <p className="text-sm text-primary/90 font-medium mb-8">
              {sr.hero.noContract}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 py-6 transition-all hover:scale-105"
              >
                <a href={sr.hero.ctaCall.href} className="inline-flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {sr.hero.ctaCall.label}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 text-base sm:text-lg px-8 py-6 transition-all hover:scale-105"
              >
                <a href={sr.hero.ctaText.href} className="inline-flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {sr.hero.ctaText.label}
                </a>
              </Button>
            </div>

            <Link
              href={sr.hero.secondaryLink.href}
              className="text-sm text-primary-foreground/60 underline underline-offset-4 hover:text-primary transition-colors"
            >
              {sr.hero.secondaryLink.label}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════ TRUST STRIP ════════════════ */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">Locally Owned & Operated</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">Walk-Through Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">Se Habla Español</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ PROOF / BEFORE & AFTER ════════════════ */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">See The Results</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 mb-3 text-balance">
              {sr.proof.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sr.proof.transformations.map((t, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium text-foreground">Slide to see the difference</p>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <BeforeAfterSlider beforeImage={t.beforeImage} afterImage={t.afterImage} />
                <p className="text-sm text-muted-foreground text-center">{t.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ REVIEWS / SOCIAL PROOF ════════════════ */}
      <section className="py-14 sm:py-18 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 mb-3 text-balance">
              What Your Neighbors Are Saying
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Real reviews from homeowners in Covington and Conyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-10">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6 transition-all hover:scale-105"
            >
              <a
                href={googleReviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Leave Us a Google Review
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Your feedback helps local businesses grow.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ GUARANTEE ════════════════ */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">
              {sr.guarantee.intro}
            </p>
            <p className="text-xl sm:text-2xl font-serif text-foreground leading-snug text-balance">
              {sr.guarantee.text}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ PRICING — REFRESH TIERS ════════════════ */}
      <section id="spring-rush-pricing" className="py-14 sm:py-18 bg-secondary scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Transformations</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 mb-3">
              {sr.refreshTiers.headline}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {sr.refreshTiers.subheadline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {sr.refreshTiers.tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "border-primary ring-2 ring-primary/20 shadow-lg md:scale-105 md:z-10"
                    : "border-border hover:border-primary/40 hover:shadow-md"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    {tier.badge}
                  </p>
                  <p className="text-lg font-semibold text-foreground mb-1">{tier.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">
                      {tier.price.replace(/\*$/, "")}
                    </span>
                    {tier.price.endsWith("*") && (
                      <span className="text-xs font-normal text-muted-foreground leading-none">*</span>
                    )}
                  </div>
                  <p className="text-sm text-primary italic mb-5">{tier.promise}</p>

                  <ul className="flex-1 space-y-2.5 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-foreground hover:bg-foreground/90 text-background"
                    }`}
                  >
                    <Link href="/quote" className="inline-flex items-center justify-center gap-2">
                      Get My Free Estimate
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-10 text-center">
            <p className="text-sm text-foreground bg-card border border-border rounded-xl px-6 py-4">
              {sr.refreshTiers.maintenanceNote}
            </p>
            <p className="text-xs text-muted-foreground mt-4">{sr.refreshTiers.disclaimer}</p>
          </div>
        </div>
      </section>

      {/* ════════════════ REFERRAL ════════════════ */}
      <section className="py-10 sm:py-12 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-4">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-1">
            {sr.referral.primary}
          </p>
          <p className="text-sm text-muted-foreground">{sr.referral.secondary}</p>
        </div>
      </section>

      {/* ════════════════ SERVICE AREA (compact) ════════════════ */}
      <section className="py-10 sm:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">Service Area</span>
          </div>
          <p className="text-base sm:text-lg text-foreground max-w-2xl mx-auto mb-4">
            {sr.serviceArea.text}
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent">
            <Link href={sr.serviceArea.cta.href}>{sr.serviceArea.cta.label}</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center flex items-center justify-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary-foreground/80" />
              <div>
                <span className="text-2xl sm:text-3xl font-bold">45+</span>
                <span className="text-sm ml-2 text-primary-foreground/80">Projects Completed</span>
              </div>
            </div>
            <div className="text-center flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-primary-foreground/80" />
              <div>
                <span className="text-2xl sm:text-3xl font-bold">3+</span>
                <span className="text-sm ml-2 text-primary-foreground/80">Years Experience</span>
              </div>
            </div>
            <div className="text-center flex items-center justify-center gap-3">
              <Award className="w-5 h-5 text-primary-foreground/80" />
              <div>
                <span className="text-2xl sm:text-3xl font-bold">Guaranteed</span>
                <span className="text-sm ml-2 text-primary-foreground/80">Not right? We redo it free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mt-2 mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive landscaping solutions tailored to your property and vision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent transition-all">
              <Link href="/services" className="inline-flex items-center gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Portfolio</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mt-2 mb-4">
              Our Gallery
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">See the transformations we have delivered.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10">
            <div className="relative aspect-[4/3] sm:col-span-2 sm:row-span-2 rounded-xl overflow-hidden group">
              <Image
                src="/backyard-transformation-complete.jpg"
                alt="Complete backyard transformation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
                <span className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Featured Project</span>
                <p className="text-primary-foreground font-bold text-xl sm:text-2xl mb-1">Complete Backyard Transformation</p>
                <p className="text-primary-foreground/70 text-sm">Landscape design, sod installation, and stone patio</p>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <Image src="/lawn-care-mowing-stripes.jpg" alt="Professional lawn care" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent flex items-end">
                <div className="p-4">
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">Lawn Care</span>
                  <p className="text-primary-foreground font-semibold text-sm sm:text-base">Professional Mowing & Edging</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <Image src="/hardscaping-stone-patio-walkway.jpg" alt="Stone patio and walkway" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent flex items-end">
                <div className="p-4">
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">Hardscaping</span>
                  <p className="text-primary-foreground font-semibold text-sm sm:text-base">Custom Stone Patio</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] sm:col-span-2 lg:col-span-1 rounded-xl overflow-hidden group">
              <Image src="/landscape-design-garden-planting.jpg" alt="Garden planting design" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent flex items-end">
                <div className="p-4">
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">Garden Design</span>
                  <p className="text-primary-foreground font-semibold text-sm sm:text-base">Perennial Garden Installation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent transition-all">
              <Link href="/gallery" className="inline-flex items-center gap-2">
                View Full Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}
