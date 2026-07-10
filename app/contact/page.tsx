"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Mail,
  Clock,
  Phone,
  CheckCircle2,
  Loader2,
  MapPin,
  Leaf,
  SprayCan,
  Flower2,
  Trees,
  LeafyGreen,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { submitQuickLead } from "./actions"
import { BUSINESS } from "@/lib/business-info"

const serviceAreas = BUSINESS.cities

// One-tap options for the conversational flow. Deliberately short — every
// extra choice or field costs leads.
const quickServices = [
  { label: "Lawn Mowing", icon: Leaf },
  { label: "Pressure Washing", icon: SprayCan },
  { label: "Landscaping / Cleanup", icon: Flower2 },
  { label: "Tree & Shrub Care", icon: Trees },
  { label: "Seasonal Cleanup", icon: LeafyGreen },
  { label: "Something Else", icon: MessageSquare },
]

export default function ContactPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [service, setService] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const chooseService = (label: string) => {
    setService(label)
    setError(null)
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!service) return
    setError(null)

    const formData = new FormData()
    formData.set("service", service)
    formData.set("phone", phone)

    startTransition(async () => {
      const result = await submitQuickLead(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSubmitted(true)
      }
    })
  }

  const resetFlow = () => {
    setSubmitted(false)
    setStep(1)
    setService(null)
    setPhone("")
    setError(null)
  }

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
              <Card className="bg-card border-border">
                <CardContent className="p-6 sm:p-8">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-7 h-7 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">Got it!</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        We&apos;ll text your {service?.toLowerCase()} quote to{" "}
                        <span className="font-medium text-foreground">{phone}</span> shortly.
                      </p>
                      <p className="text-xs text-muted-foreground mb-6">
                        In a hurry? Call us right now at{" "}
                        <a href={BUSINESS.telHref} className="text-primary hover:underline">
                          {BUSINESS.phoneDisplay}
                        </a>
                        .
                      </p>
                      <Button
                        onClick={resetFlow}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                      >
                        Ask About Another Service
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-4">
                        Step {step} of 2
                      </p>

                      {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
                          {error}
                        </div>
                      )}

                      {step === 1 && (
                        <div>
                          <h2 className="text-xl font-semibold text-foreground font-serif mb-1">
                            What do you need done?
                          </h2>
                          <p className="text-sm text-muted-foreground mb-5">
                            Tap one — takes 10 seconds total.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {quickServices.map((s) => (
                              <button
                                key={s.label}
                                type="button"
                                onClick={() => chooseService(s.label)}
                                className="flex flex-col items-center gap-2 rounded-lg border border-input bg-background p-4 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-ring"
                              >
                                <s.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3"
                          >
                            <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                            Back
                          </button>
                          <span className="block mb-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                              {service}
                            </span>
                          </span>
                          <h2 className="text-xl font-semibold text-foreground font-serif mb-1">
                            What&apos;s the best number to text your quote to?
                          </h2>
                          <p className="text-sm text-muted-foreground mb-5">
                            No spam — just your quote, usually within the hour.
                          </p>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <label htmlFor="quick-phone" className="sr-only">
                                Phone number
                              </label>
                              <input
                                type="tel"
                                id="quick-phone"
                                name="phone"
                                inputMode="tel"
                                autoComplete="tel"
                                required
                                pattern="[\d\s\(\)\+\.\-]{10,}"
                                title="Please enter a valid phone number (at least 10 digits)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder={BUSINESS.phoneDisplay}
                                autoFocus
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={isPending}
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
                            >
                              {isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                                  Sending...
                                </>
                              ) : (
                                "Text Me My Quote"
                              )}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                              Prefer to talk?{" "}
                              <a href={BUSINESS.telHref} className="text-primary hover:underline">
                                Call {BUSINESS.phoneDisplay}
                              </a>
                            </p>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
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
