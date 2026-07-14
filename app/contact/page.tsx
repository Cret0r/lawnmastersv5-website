import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { QuickLeadForm } from "@/components/quick-lead-form"
import { Mail, Clock, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BUSINESS } from "@/lib/business-info"

export const metadata: Metadata = {
  title: "Contact Lawn Masters V5 — Lawn Care in Covington, GA",
  description: `Call or text ${BUSINESS.phoneDisplay} for lawn care, landscaping, and pressure washing in Covington, GA. Tap a service, leave your number, get a quote by text.`,
  alternates: { canonical: "/contact" },
}

const serviceAreas = BUSINESS.cities

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/lawn-care-mowing-stripes.jpg"
            alt="Contact us"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 inline-block">Reach Out</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">
            Get In Touch
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed">
            Have questions or ready to schedule a service? We are here to help.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left: Info cards */}
            <div className="space-y-5">
              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <a
                        href={BUSINESS.telHref}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {BUSINESS.phoneDisplay}
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">Call or text anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a
                        href={BUSINESS.mailtoHref}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {BUSINESS.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>24 Hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Service Area</h3>
                      <p className="text-sm text-muted-foreground">Covington, GA &amp; Surrounding Areas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/quote">Request a Free Estimate</Link>
              </Button>
            </div>

            {/* Right: Conversational quick-lead flow (one question at a time) */}
            <div className="lg:sticky lg:top-24 h-fit">
              <QuickLeadForm source="contact" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Coverage</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-foreground mt-2 mb-4">Service Area</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We proudly serve the Covington, GA area and surrounding communities. Free on-site consultations available for all new customers.
              </p>
            </div>

            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {serviceAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{area}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Don&apos;t see your area? Give us a call at{" "}
                  <a href={BUSINESS.telHref} className="text-primary hover:underline">{BUSINESS.phoneDisplay}</a>
                  {" "}-- we may still be able to help!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}
