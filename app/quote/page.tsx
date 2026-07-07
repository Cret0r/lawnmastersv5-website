"use client"

import React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle2, Leaf, Ruler, Trees, Droplets, Snowflake, Pickaxe, SprayCan, Loader2 } from "lucide-react"
import Image from "next/image"
import { submitQuote } from "./actions"
import { BUSINESS } from "@/lib/business-info"

const serviceOptions = [
  { id: "lawn-care", label: "Lawn Care & Mowing", icon: Leaf },
  { id: "landscape-design", label: "Landscape Design & Installation", icon: Ruler },
  { id: "tree-shrub", label: "Tree & Shrub Care", icon: Trees },
  { id: "hardscaping", label: "Hardscaping", icon: Pickaxe },
  { id: "irrigation", label: "Irrigation & Drainage", icon: Droplets },
  { id: "seasonal", label: "Seasonal Cleanup", icon: Snowflake },
  { id: "pressure-washing", label: "Pressure Washing", icon: SprayCan },
  { id: "summer-special", label: "Summer Special (Weekly / Biweekly / One-Time)", icon: Leaf },
]

export default function QuotePage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    for (const service of selectedServices) {
      formData.append("services", service)
    }

    startTransition(async () => {
      const result = await submitQuote(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSubmitted(true)
      }
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-4">
                Thank You!
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Your estimate request has been received. We will review the details and get back to you within 24 hours with a customized quote for your project.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setSelectedServices([])
                }}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
            Tell us about your project and we will provide a detailed, no-obligation estimate tailored to your needs.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-5 font-serif">
                  Your Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">
                      Last Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={BUSINESS.phoneDisplay}
                    />
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-5 font-serif">
                  Property Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1.5">
                      Property Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="123 Main Street, Covington, GA"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-foreground mb-1.5">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="hoa">HOA / Community</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="propertySize" className="block text-sm font-medium text-foreground mb-1.5">
                      Approximate Lot Size
                    </label>
                    <select
                      id="propertySize"
                      name="propertySize"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select size</option>
                      <option value="small">{"Small (under 1/4 acre)"}</option>
                      <option value="medium">{"Medium (1/4 - 1/2 acre)"}</option>
                      <option value="large">{"Large (1/2 - 1 acre)"}</option>
                      <option value="xlarge">{"Extra Large (1+ acre)"}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Selection */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2 font-serif">
                  Services Needed
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Select all that apply
                </p>
                <p className="text-xs text-primary mb-5">
                  For fastest booking, call or text us at{" "}
                  <a href={BUSINESS.telHref} className="underline font-medium">{BUSINESS.phoneDisplay}</a>.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {serviceOptions.map((service) => {
                    const Icon = service.icon
                    const isSelected = selectedServices.includes(service.id)
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-input bg-card hover:border-primary/40"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {service.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-5 font-serif">
                  Additional Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-1.5">
                      Preferred Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1month">Within 1 month</option>
                      <option value="3months">Within 3 months</option>
                      <option value="flexible">Flexible / No rush</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-foreground mb-1.5">
                      Tell us about your project
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Describe your vision, any challenges with your property, specific requests, etc."
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Estimate Request"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="bg-primary/10 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">What Happens Next?</h3>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5">
                      <li>1. We review your request and reach out within 24 hours.</li>
                      <li>2. We schedule a free on-site consultation at your convenience.</li>
                      <li>3. You receive a detailed written estimate with no obligation.</li>
                      <li>4. If approved, we plan and schedule your project.</li>
                    </ul>
                  </div>
                </div>
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
