import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Service Policies — Lawn Masters V5 Covington, GA",
  description:
    "Learn about Lawn Masters V5 service policies including missed cuts, weather delays, and cancellation terms in Covington, GA.",
}

export default function ServicePolicies() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="text-sm text-primary hover:text-primary/80 mb-6 inline-block">
              ← Back to home
            </Link>
            <h1 className="text-4xl sm:text-5xl font-serif text-foreground mb-3">Service Policies</h1>
            <p className="text-lg text-muted-foreground">
              Clear, friendly guidelines for working with Lawn Masters V5.
            </p>
          </div>

          <div className="space-y-10">
            {/* Pricing & Property Condition */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Pricing & Property Condition</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our pricing is based on typical residential lawn sizes. If your property is significantly larger, has challenging terrain, or requires extra work due to overgrowth or poor conditions, we may adjust the price after an initial assessment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For one-time cuts or first visits, we&apos;ll provide a quote after seeing the lawn. Visit frequency may adjust based on growth rate and weather conditions.
              </p>
            </section>

            {/* Service Access */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service Access</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To keep our routes running smoothly, we ask that gates remain accessible on service days. If a gate is locked, we may need to reschedule your service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Please let us know in advance if there are any access issues or safety concerns with your property.
              </p>
            </section>

            {/* Weather Delays */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Weather Delays</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may reschedule services if weather makes it unsafe to work (heavy rain, lightning, extreme heat, etc.). We&apos;ll contact you to find a new date that works.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Rescheduled visits don&apos;t count as missed services, so our guarantee doesn&apos;t apply. Your account remains active and we&apos;ll get you on the schedule as soon as conditions improve.
              </p>
            </section>

            {/* Overgrowth or First-Cut Conditions */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Overgrowth or First-Cut Conditions</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If grass is significantly overgrown or hasn&apos;t been mowed in a long time, we may charge extra for the first cut or need to make multiple passes to bring it back to normal.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                After the initial reset, regular pricing applies on our weekly or biweekly schedule.
              </p>
            </section>

            {/* Referral Credits */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Referral Credits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>$20 off your next cut for every friend you send.*</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Send 2 neighbors, your next cut is free.*</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm italic">
                *Credit is applied after your referred friend completes their first paid service. Referral offer applies once per unique referral.
              </p>
            </section>

            {/* Guarantee Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Guarantee Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>If we miss a scheduled service without notice, your next cut is 100% free.*</strong> This guarantee ensures you can count on us.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you cancel or reschedule, we&apos;ll adjust your schedule accordingly. Weather delays, unsafe conditions, or access issues may result in us rescheduling — these don&apos;t trigger the guarantee.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm italic">
                *Applies to verified missed services without prior notice from us. Rescheduled or customer-canceled visits do not qualify.
              </p>
            </section>

            {/* Scheduling Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Scheduling Changes</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can pause, cancel, or modify your plan anytime with 48 hours notice. No long-term contracts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you need to reschedule a service, let us know as soon as possible. We&apos;ll work with you to find a time that fits your schedule.
              </p>
            </section>
          </div>

          {/* CTA Section */}
          <div className="mt-16 pt-10 border-t border-border text-center">
            <p className="text-muted-foreground mb-6">Questions about our policies?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="tel:+14076000301"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Call Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
