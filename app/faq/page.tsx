import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { BUSINESS } from "@/lib/business-info"

export const metadata: Metadata = {
  title: "Lawn Care FAQ — Covington, GA | Lawn Masters V5",
  description:
    "Straight answers about lawn care in Covington, GA: pricing, mowing frequency, contracts, property refreshes, weather delays, guarantees, and Spanish-language service.",
  alternates: { canonical: "/faq" },
}

// Single source of truth for the page AND the FAQPage schema below.
// Answers are deliberately 40–60 words — the length featured snippets pull.
// ⚠️ Owner rule (7/14/2026): NO dollar amounts anywhere in these answers —
// point to the free on-site estimate instead. Do not add prices back.
const faqs: { question: string; answer: string }[] = [
  {
    question: "How much does lawn care cost in Covington, GA?",
    answer:
      "It depends on your property — lot size, condition, and what needs doing drive the number, so we don't quote flat rates sight-unseen. Every estimate is free: we look at the property in person, then text you an exact written quote with no obligation. Most quotes go out the same day.",
  },
  {
    question: "Do you require contracts for lawn service?",
    answer:
      "No. There are no contracts and you can cancel anytime. We keep customers by showing up on time and doing clean work — not by locking anyone in. And if we ever miss a scheduled service without notice, your next cut is 100% free.",
  },
  {
    question: "How often should I mow my lawn in a Georgia summer?",
    answer:
      "Weekly. Bermuda and Zoysia — the most common grasses in Newton County — grow fast in Georgia's hot, humid summers, and cutting more than a third of the blade at once stresses the lawn. Weekly mowing from April through October keeps it healthy; spring and fall usually need every one to two weeks.",
  },
  {
    question: "What's included in a property refresh?",
    answer:
      "A property refresh takes an overgrown or neglected yard back to clean, usually in one visit: full cleanup and haul-away, beds weeded and edged with fresh mulch, shrubs shaped, and pressure washing for the driveway or walkways. We quote it after walking the property, and we walk the finished work with you.",
  },
  {
    question: "What happens if it rains on my scheduled service day?",
    answer:
      "We reschedule to the next available day and let you know. Mowing wet grass damages the lawn and leaves ruts, so we don't cut in the rain. Weather delays don't count as missed services — your account stays active and your schedule picks back up as soon as conditions allow.",
  },
  {
    question: "What if I'm not happy with the work?",
    answer:
      "Tell us on the spot — we walk every finished job with you. Anything you don't love, we fix immediately at no charge, no questions asked. And if we ever miss a scheduled service without notifying you, your next cut is completely free. Your property looks right or we make it right.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Covington, Conyers, Oxford, Porterdale, Social Circle, and Monroe — Newton County, Georgia and its edges. If you're just outside those areas, call or text (407) 600-0301 anyway; if we can route you efficiently, we may still be able to help.",
  },
  {
    question: "How do I get a free estimate?",
    answer:
      "Tap a service on our quote page and leave your phone number — it takes about ten seconds. We text you back fast, usually within the hour, set up a free on-site walk-through, and send a written quote priced to your property. No obligation, and the quote is good for 14 days.",
  },
  {
    question: "Do you speak Spanish? ¿Hablan español?",
    answer:
      "Sí — hablamos español. You can call, text, or do the entire estimate in Spanish; there's no translator in the middle and nothing gets lost. Llámenos o envíe un mensaje de texto al (407) 600-0301 y le atendemos en español, con presupuestos gratis y sin compromiso.",
  },
  {
    question: "My lawn is really overgrown — can you still mow it?",
    answer:
      "Yes — overgrown yards are our specialty. Very tall grass may need multiple passes or a cleanup-level first visit, so the first cut can cost more than a regular one. After that reset, normal plan pricing applies. Send us a photo by text and we'll quote it accurately the first time.",
  },
  {
    question: "When should I pressure wash a driveway in Georgia?",
    answer:
      "Once a year keeps Georgia's humidity from winning. Algae, mold, and mildew build up fast on concrete here — most driveways show green or black staining by early summer. Late spring is the ideal slot, but if you can already see the staining, it's overdue. Estimates are free and take minutes.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Send us a neighbor and you both get money off — a credit toward your next service for you, and a discount on their first service for them. It applies after their first paid service is completed, once per unique referral. Just text us their name; no forms, no limit.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navigation />
      <main>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/tree-shrub-care-pruning.jpg"
            alt="Lawn care questions answered"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 inline-block">
            Straight Answers
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed">
            Pricing, scheduling, guarantees, and how lawn care actually works in Newton County, Georgia.
          </p>
        </div>
      </section>

      {/* Q&A list */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {faqs.map((f) => (
              <div key={f.question} className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-3">{f.question}</h2>
                <p className="text-muted-foreground leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-primary-foreground mb-6 text-balance">
            Still have a question?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Call or text {BUSINESS.phoneDisplay} — English or Spanish — or grab a free estimate in two taps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8"
            >
              <Link href="/quote">Get a Free Estimate</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 bg-transparent"
            >
              <a href={BUSINESS.telHref}>Call {BUSINESS.phoneDisplay}</a>
            </Button>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}
