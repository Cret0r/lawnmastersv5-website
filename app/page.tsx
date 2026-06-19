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
  CalendarIcon,
  MessageCircleIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Lawn Care & Mowing in Covington, GA — Lawn Masters V5",
  description:
    "Reliable weekly lawn care in Covington & Conyers, GA. Starting at $120/mo, no contracts, Se Habla Español. Call (407) 600-0301 for a free estimate.",
}

export default function Home() {
  const services = [
    {
      icon: Scissors,
      title: "Lawn Care & Mowing",
      description: "Regular mowing, edging, and trimming to keep your lawn pristine year-round.",
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
      icon: LeafyGreen,
      title: "Seasonal Cleanup",
      description: "Spring and fall cleanup, leaf removal, and garden bed preparation.",
    },
    {
      icon: SprayCan,
      title: "Pressure Washing",
      description: "Restore driveways, sidewalks, patios, and exterior surfaces to like-new condition.",
    },
  ]

  const sr = springRush

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navigation />

      {/* ════════════════ SPRING RUSH HERO ════════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-foreground">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-lawn-care-new.jpg"
            alt="Professional manicured lawn in Covington, Georgia"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground mb-4 text-balance leading-tight">
              Reliable Lawn Care in{" "}
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
              <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">Reliable Weekly Scheduling</span>
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

      {/* ═══��════════════ PRICING ════════════════ */}
      <section id="spring-rush-pricing" className="py-14 sm:py-18 bg-secondary scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Plans</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 mb-3">
              {sr.pricing.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {sr.pricing.plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary ring-2 ring-primary/20 shadow-lg md:scale-105 md:z-10"
                    : "border-border hover:border-primary/40 hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    {plan.badge}
                  </p>
                  <p className="text-lg font-semibold text-foreground mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">
                      {plan.price.replace(/\*$/, "")}
                    </span>
                    {plan.price.endsWith("*") && (
                      <span className="text-xs font-normal text-muted-foreground leading-none">*</span>
                    )}
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{plan.note}</p>

                  {plan.highlighted && (
                    <p className="text-xs text-muted-foreground mb-5 italic">
                      Less than the cost of one dinner out.
                    </p>
                  )}

                  <ul className="flex-1 space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-foreground hover:bg-foreground/90 text-background"
                    }`}
                  >
                    <a href="tel:+14076000301" className="inline-flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Lock In My Spot
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
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

      {/* ════════════════ REVIEWS ════════════════ */}
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

      {/* ═══════════════════════════════════════════
           EXISTING CONTENT (preserved, pushed below)
         ═══════════════════════════════════════════ */}

      {/* Original Hero (demoted) */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-landscaping-lush-garden.jpg"
            alt="Beautiful landscaped garden"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-foreground/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-block text-primary text-sm font-semibold uppercase tracking-wider mb-4 animate-fade-in-up">
              Full-Service Landscaping
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance animate-fade-in-up [animation-delay:100ms]">
              Your Landscape,{" "}
              <span className="text-primary">Perfected.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl text-pretty animate-fade-in-up [animation-delay:200ms]">
              From lawn care and pressure washing to complete landscape transformations, we bring expertise and passion to every project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 transition-all hover:scale-105"
              >
                <Link href="/quote">Get a Free Estimate</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base sm:text-lg px-8 bg-transparent transition-all"
              >
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center flex items-center justify-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary-foreground/80" />
              <div>
                <span className="text-2xl sm:text-3xl font-bold">130+</span>
                <span className="text-sm ml-2 text-primary-foreground/80">Local Projects Completed</span>
              </div>
            </div>
            <div className="text-center flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-primary-foreground/80" />
              <div>
                <span className="text-2xl sm:text-3xl font-bold">5+</span>
                <span className="text-sm ml-2 text-primary-foreground/80">Years Experience</span>
              </div>
            </div>
            <div className="text-center flex items-center justify-center gap-3">
              <Award className="w-5 h-5 text-primary-foreground/80" />
              <div>
                <span className="text-2xl sm:text-3xl font-bold">100%</span>
                <span className="text-sm ml-2 text-primary-foreground/80">Satisfaction Guaranteed</span>
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

      {/* CTA */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/tree-shrub-care-pruning.jpg" alt="Beautiful landscaped property" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground mb-6 text-balance">
            Ready to transform your{" "}
            <span className="text-primary">outdoor space?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Get a free, no-obligation estimate for your landscaping project today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 transition-all hover:scale-105">
              <a href="tel:+14076000301" className="inline-flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call (407) 600-0301
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-10 py-6 bg-transparent transition-all">
              <Link href="/quote">Request Free Estimate</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
