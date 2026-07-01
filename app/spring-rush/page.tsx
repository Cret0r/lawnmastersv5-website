import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import { springRush } from "@/lib/spring-rush-content"
import {
  Phone,
  MessageSquare,
  Shield,
  CheckCircle,
  MapPin,
  Gift,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Summer Special — Weekly Lawn Service | Lawn Masters V5 Covington, GA",
  description:
    "Summer lawn care special in Covington, GA. Lock in weekly service before summer spots fill up. Lawn Masters V5 — Se Habla Español.",
}

export default function SpringRushPage() {
  const sr = springRush

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <nav className="bg-foreground/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary-foreground text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <img src="/logo-contrast.png" alt="Lawn Masters V5" className="h-10 w-auto" />
          </Link>
          <a
            href="tel:+14076000301"
            className="text-primary font-semibold text-sm hover:underline"
          >
            (407) 600-0301
          </a>
        </div>
      </nav>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-landscaping-lush-garden.jpg"
            alt="Freshly mowed Georgia lawn"
            fill
            className="object-cover opacity-25"
            priority
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground mb-4 text-balance leading-tight">
              {sr.hero.headline}
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/70 mb-2 max-w-xl mx-auto">
              {sr.hero.subheadline}
            </p>
            <p className="text-sm text-primary/90 font-medium mb-8">
              {sr.hero.noContract}
            </p>

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
            {sr.trust.badges
              .filter((b) => b.show)
              .map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PROOF ════════════════ */}
      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-3 text-balance">
              {sr.proof.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sr.proof.transformations.map((t, i) => (
              <div key={i} className="flex flex-col gap-3">
                <BeforeAfterSlider beforeImage={t.beforeImage} afterImage={t.afterImage} />
                <p className="text-sm text-muted-foreground text-center">{t.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PRICING ════════════════ */}
      <section className="py-14 sm:py-18 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-3">
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">{plan.badge}</p>
                  <p className="text-lg font-semibold text-foreground mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{plan.note}</p>
                  {plan.highlighted && (
                    <p className="text-xs text-muted-foreground mb-5 italic">Less than the cost of one dinner out.</p>
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
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">{sr.guarantee.intro}</p>
            <p className="text-xl sm:text-2xl font-serif text-foreground leading-snug text-balance">{sr.guarantee.text}</p>
          </div>
        </div>
      </section>

      {/* ════════════════ REFERRAL ════════════════ */}
      <section className="py-10 sm:py-12 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-4">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-1">{sr.referral.primary}</p>
          <p className="text-sm text-muted-foreground">{sr.referral.secondary}</p>
        </div>
      </section>

      {/* ════════════════ SERVICE AREA ════════════════ */}
      <section className="py-10 sm:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">Service Area</span>
          </div>
          <p className="text-base sm:text-lg text-foreground max-w-2xl mx-auto mb-4">{sr.serviceArea.text}</p>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-16 sm:py-20 bg-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-primary-foreground mb-4 text-balance">
            Ready to lock in your spot?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Spots fill up fast this summer. Call or text now to get on the schedule before we&apos;re booked out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 transition-all hover:scale-105"
            >
              <a href="tel:+14076000301" className="inline-flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call (407) 600-0301
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 text-lg px-10 py-6 transition-all hover:scale-105"
            >
              <a
                href="sms:+14076000301?body=Hi%2C%20I%20want%20to%20lock%20in%20the%20Summer%20Special%20weekly%20plan.%20My%20address%20is%20____."
                className="inline-flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Text Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="bg-foreground border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary-foreground/50">
            Lawn Masters V5 &middot; Serving Covington, GA &amp; Surrounding Areas &middot;{" "}
            <a href="tel:+14076000301" className="hover:text-primary transition-colors">(407) 600-0301</a>
            {" "}&middot;{" "}
            <Link href="/" className="hover:text-primary transition-colors">Back to Main Site</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
