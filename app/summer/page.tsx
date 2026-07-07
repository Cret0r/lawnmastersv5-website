import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import { ReviewCard } from "@/components/review-card"
import { summerRefresh } from "@/lib/summer-content"
import { springRush } from "@/lib/spring-rush-content"
import { reviews } from "@/lib/reviews-data"
import { BUSINESS } from "@/lib/business-info"
import {
  Phone,
  MessageSquare,
  Shield,
  CheckCircle,
  MapPin,
  Gift,
  ArrowLeft,
  Clock,
  Languages,
  SprayCan,
  Flower2,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: summerRefresh.meta.title,
  description: summerRefresh.meta.description,
}

export default function SummerPage() {
  const c = summerRefresh
  const mowingPlans = springRush.pricing.plans

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <nav className="bg-foreground/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-foreground text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <img src="/logo-contrast.png" alt="Lawn Masters V5" width={1638} height={497} className="h-10 w-auto" />
          </Link>
          <a href={BUSINESS.telHref} className="text-primary font-semibold text-sm hover:underline">
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </nav>
      <main>

      {/* ════════════ 1. HERO ════════════ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 640px)" srcSet="/hero/hero-garden-mobile.jpg" />
            <source media="(max-width: 1024px)" srcSet="/hero/hero-garden-tablet.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/hero-garden-desktop.jpg"
              alt="Freshly landscaped Georgia property"
              className="h-full w-full object-cover opacity-25"
              fetchPriority="high"
            />
          </picture>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Languages className="w-4 h-4 text-primary" />
              {c.hero.bilingualBadge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground mb-4 text-balance leading-tight">
              {c.hero.headline}
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              {c.hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 py-6 transition-all hover:scale-105"
              >
                <a href={c.hero.ctaCall.href} className="inline-flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {c.hero.ctaCall.label}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 text-base sm:text-lg px-8 py-6 transition-all hover:scale-105"
              >
                <a href={c.hero.ctaText.href} className="inline-flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {c.hero.ctaText.label}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ 2. TRUST BAR ════════════ */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {c.trustBar.map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3. TRANSFORMATION SYSTEM ════════════ */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{c.system.eyebrow}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              {c.system.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {c.system.steps.map((step, i) => (
              <Card key={step.title} className="border-border text-center">
                <CardContent className="p-6 sm:p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 4. SCARCITY BANNER ════════════ */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center gap-3 text-center">
          <Clock className="w-5 h-5 text-primary-foreground/80 flex-shrink-0 hidden sm:block" />
          <p className="text-sm sm:text-base font-medium text-primary-foreground">{c.scarcity}</p>
        </div>
      </section>

      {/* ════════════ 5. PRESSURE WASHING PACKAGES ════════════ */}
      <section className="py-14 sm:py-18 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
              <SprayCan className="w-4 h-4" />
              {c.pressureWashing.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              {c.pressureWashing.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {c.pressureWashing.packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={
                  pkg.highlighted
                    ? "relative flex flex-col transition-all duration-300 border-primary ring-2 ring-primary/20 shadow-lg"
                    : "relative flex flex-col transition-all duration-300 border-border hover:border-primary/40 hover:shadow-md"
                }
              >
                {pkg.highlighted && "tag" in pkg && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {pkg.tag}
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{pkg.description}</p>
                  <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">{c.pricingNote}</p>
        </div>
      </section>

      {/* ════════════ 6. LANDSCAPING PACKAGES ════════════ */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
              <Flower2 className="w-4 h-4" />
              {c.landscaping.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              {c.landscaping.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {c.landscaping.packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={
                  pkg.highlighted
                    ? "relative flex flex-col transition-all duration-300 border-primary ring-2 ring-primary/20 shadow-lg"
                    : "relative flex flex-col transition-all duration-300 border-border hover:border-primary/40 hover:shadow-md"
                }
              >
                {pkg.highlighted && "tag" in pkg && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {pkg.tag}
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{pkg.description}</p>
                  <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">{c.pricingNote}</p>
        </div>
      </section>

      {/* ════════════ 7. HIGH-TICKET GUARANTEE ════════════ */}
      <section className="py-14 sm:py-18 bg-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-5">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-3">{c.guarantee.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-foreground leading-snug text-balance mb-4">
              {c.guarantee.headline}
            </h2>
            <p className="text-primary-foreground/70 text-base sm:text-lg">{c.guarantee.text}</p>
          </div>
        </div>
      </section>

      {/* ════════════ 8. CONVERSION BRIDGE — SUMMER STARTER CUT + MOWING PLANS ════════════ */}
      <section className="py-14 sm:py-18 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{c.bridge.eyebrow}</span>
            <div className="inline-flex items-center justify-center gap-3 mt-3 mb-4">
              <Gift className="w-8 h-8 text-primary" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground text-balance">
                {c.bridge.headline}
              </h2>
            </div>
            <p className="text-base sm:text-lg text-foreground max-w-2xl mx-auto">{c.bridge.text}</p>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-foreground text-center mb-8">
            {c.bridge.plansHeadline}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {mowingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative flex flex-col transition-all duration-300 border-primary ring-2 ring-primary/20 shadow-lg md:scale-105 md:z-10"
                    : "relative flex flex-col transition-all duration-300 border-border hover:border-primary/40 hover:shadow-md"
                }
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
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{plan.note}</p>
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
                    className={
                      plan.highlighted
                        ? "w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "w-full bg-foreground hover:bg-foreground/90 text-background"
                    }
                  >
                    <a href={BUSINESS.telHref} className="inline-flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Lock In My Spot
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            {c.bridge.mowingGuarantee}
          </p>
        </div>
      </section>

      {/* ════════════ 9. BEFORE / AFTER PROOF ════════════ */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{c.proof.eyebrow}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              {c.proof.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {c.proof.transformations.map((t, i) => (
              <div key={i} className="flex flex-col gap-3">
                <BeforeAfterSlider beforeImage={t.beforeImage} afterImage={t.afterImage} />
                <p className="text-sm text-muted-foreground text-center">{t.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 10. HOW IT WORKS ════════════ */}
      <section className="py-14 sm:py-18 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{c.howItWorks.eyebrow}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              {c.howItWorks.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {c.howItWorks.steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 11. REVIEWS ════════════ */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              What Your Neighbors Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 12. SERVICE AREA GRID ════════════ */}
      <section className="py-14 sm:py-18 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{c.serviceArea.eyebrow}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mt-2 text-balance">
              {c.serviceArea.headline}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {c.serviceArea.cities.map((city) => (
              <div
                key={city}
                className="flex items-center justify-center gap-2 bg-card border border-border rounded-lg py-4 px-3"
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground text-sm sm:text-base">{city}, GA</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 13. BILINGUAL CTA ════════════ */}
      <section className="py-14 sm:py-18 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/15 mb-5">
              <Languages className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-foreground mb-4 text-balance">
              {c.bilingual.headline}
            </h2>
            <p className="text-primary-foreground/85 text-base sm:text-lg mb-2">{c.bilingual.text}</p>
            <p className="text-primary-foreground/60 text-sm mb-8">{c.bilingual.textEn}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base sm:text-lg px-8 py-6 transition-all hover:scale-105"
              >
                <a href={c.bilingual.ctaCall.href} className="inline-flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {c.bilingual.ctaCall.label}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 text-base sm:text-lg px-8 py-6 bg-transparent transition-all"
              >
                <a href={c.bilingual.ctaText.href} className="inline-flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {c.bilingual.ctaText.label}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ 14. FINAL CTA ════════════ */}
      <section className="py-16 sm:py-20 bg-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-primary-foreground mb-4 text-balance">
            {c.finalCta.headline}
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">{c.finalCta.text}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 transition-all hover:scale-105"
            >
              <a href={c.finalCta.ctaCall.href} className="inline-flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {c.finalCta.ctaCall.label}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 text-lg px-10 py-6 transition-all hover:scale-105"
            >
              <a href={c.finalCta.ctaText.href} className="inline-flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {c.finalCta.ctaText.label}
              </a>
            </Button>
          </div>
        </div>
      </section>

      </main>

      {/* Simple footer */}
      <footer className="bg-foreground border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary-foreground/50">
            Lawn Masters V5 &middot; Serving Covington, GA &amp; Surrounding Areas &middot;{" "}
            <a href={BUSINESS.telHref} className="hover:text-primary transition-colors">
              {BUSINESS.phoneDisplay}
            </a>{" "}
            &middot;{" "}
            <Link href="/" className="hover:text-primary transition-colors">
              Back to Main Site
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
