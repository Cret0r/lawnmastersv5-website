import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Award, Users, Leaf, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Lawn Masters V5 — Local Lawn Care in Covington, GA",
  description:
    "Family-owned lawn care company serving Covington, GA and surrounding areas. Reliable, affordable, and bilingual. Learn more about Lawn Masters V5.",
}

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Quality Work",
      description: "Every lawn and property we service is treated with care and attention to detail. Clean edges, proper mowing, and thorough cleanup are part of every visit.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Clear communication, honest pricing, and dependable service are the foundation of our business.",
    },
    {
      icon: Leaf,
      title: "Local Focus",
      description: "We proudly serve homeowners throughout Covington and Conyers, building strong relationships within our community.",
    },
    {
      icon: Heart,
      title: "Pride in the Work",
      description: "Outdoor work is what we enjoy doing. Taking a property from messy to clean is what motivates us every day.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-landscaping-lush-garden.jpg"
            alt="About Lawn Masters V5"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 inline-block">Our Story</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground mb-6 text-balance">
            About Lawn Masters V5
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed">
            Local lawn care and exterior cleaning services for homeowners in Covington and Conyers.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Lawn Masters V5 started with a simple goal: provide reliable, high-quality lawn care that homeowners can count on.
                  </p>
                  <p>
                    What began as a small mowing operation has grown into a trusted local service helping homeowners maintain clean, healthy, and great-looking outdoor spaces.
                  </p>
                  <p>
                    With 5+ years of experience in lawn and property care, we understand what it takes to keep Georgia lawns looking their best through every season.
                  </p>
                  <p>
                    From routine mowing and edging to driveway pressure washing and exterior cleaning, every job is completed with the same focus on detail, reliability, and customer satisfaction.
                  </p>
                  <p>
                    We believe your lawn should be something you're proud of every time you pull into your driveway.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground mt-2 mb-4">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif text-foreground">Why Choose Lawn Masters V5?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Reliable Lawn Service</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Consistent mowing schedules, clean edging, and dependable service you can trust.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Straightforward Pricing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Transparent pricing with no surprises. You'll always know what to expect before we begin.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Professional Equipment</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use professional equipment and proven techniques to deliver clean, consistent results.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Local & Responsive</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    As a local service business, we respond quickly and take pride in helping our neighbors keep their homes looking great.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary-foreground mb-6 text-balance">
            Ready to get started?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Contact us or request a free estimate for your lawn care project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8"
            >
              <Link href="/quote">Free Estimate</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-6">Service Area</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Lawn Masters V5 proudly serves homeowners in:
            </p>
            <ul className="space-y-3 text-base text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Covington
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Conyers
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Oxford
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Porterdale
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Social Circle
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Monroe, GA
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
