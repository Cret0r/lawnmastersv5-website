import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { QuickLeadForm } from "@/components/quick-lead-form"
import { MessageSquare, CalendarCheck, FileText, Sparkles } from "lucide-react"
import Image from "next/image"
import { BUSINESS } from "@/lib/business-info"

export const metadata: Metadata = {
  title: "Free Estimate — Lawn Care & Cleanups | Covington, GA",
  description:
    "Get a free lawn care estimate in Covington, GA in two taps: pick a service, leave your number, and we text your quote — usually within the hour. No obligation.",
  alternates: { canonical: "/quote" },
}

// The 4-step "What Happens Next" process. Rendered on the page AND emitted as
// HowTo schema below — keep the two in sync by editing this array only.
const steps = [
  {
    icon: MessageSquare,
    title: "Tell us what you need",
    text: "Tap the service and leave your number — it takes about 10 seconds. No forms, no email required.",
  },
  {
    icon: CalendarCheck,
    title: "We text you back fast",
    text: "Usually within the hour. We'll ask for your address and set up a free on-site walk-through at a time that works for you.",
  },
  {
    icon: FileText,
    title: "You get a written quote",
    text: "Priced to your property after we've seen it — never a blind flat rate. No obligation, and the quote is good for 14 days.",
  },
  {
    icon: Sparkles,
    title: "We do the work, guaranteed",
    text: "We schedule the job and walk the finished property with you. Anything you don't love, we fix on the spot — free.",
  },
]

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to get a free lawn care estimate from Lawn Masters V5",
  description:
    "Getting a free, no-obligation lawn care or property cleanup estimate in Covington, GA takes about 10 seconds to start.",
  totalTime: "P1D",
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.text,
  })),
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <Navigation />
      <main>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/backyard-transformation-complete.jpg"
            alt="Beautiful landscaped backyard"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 inline-block">
            No Obligation
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">
            Request a Free Estimate
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed">
            Two taps and you&apos;re done — pick a service, leave your number, and we&apos;ll text
            your quote. Usually within the hour.
          </p>
        </div>
      </section>

      {/* Quick lead flow */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <QuickLeadForm source="quote" />
            <p className="text-xs text-muted-foreground text-center mt-4">
              Prefer email? Reach us at{" "}
              <a href={BUSINESS.mailtoHref} className="text-primary hover:underline">
                {BUSINESS.email}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Simple &amp; Fast</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground mt-2 mb-4">What Happens Next?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From first text to finished yard — here&apos;s the whole process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-card border border-border rounded-xl p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-primary/30">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}
