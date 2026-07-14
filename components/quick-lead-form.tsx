"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  Loader2,
  Leaf,
  SprayCan,
  Flower2,
  Trees,
  LeafyGreen,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import { submitQuickLead } from "@/app/contact/actions"
import { BUSINESS } from "@/lib/business-info"

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

/**
 * Conversational two-step lead capture (service → phone) shared by /contact
 * and /quote. Writes to quote_submissions via submitQuickLead; `source` tags
 * which page the lead came from in the admin details + notification email.
 */
export function QuickLeadForm({ source }: { source: "contact" | "quote" }) {
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
    formData.set("source", source)

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
  )
}
