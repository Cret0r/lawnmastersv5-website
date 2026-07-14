import type React from "react"
import type { Metadata } from "next"
import { DM_Serif_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FloatingCTA } from "@/components/floating-cta"
import { BUSINESS } from "@/lib/business-info"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" })

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BUSINESS.domain}`),
  title: "Lawn Masters V5 — Lawn Care & Landscaping in Covington & Conyers, GA",
  description:
    "Professional lawn care and landscaping in Covington, Conyers, and the greater Georgia area. Weekly mowing from $120/mo. Landscape design, hardscaping, pressure washing, and more. Se Habla Espanol.",
  openGraph: {
    type: "website",
    siteName: BUSINESS.shortName,
    title: "Lawn Masters V5 — Lawn Care & Landscaping in Covington & Conyers, GA",
    description:
      "Professional lawn care, landscaping, and pressure washing in Covington, Conyers, and Newton County, GA. Free estimates. Se Habla Español.",
    url: `https://${BUSINESS.domain}`,
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lawn Masters V5 — lawn care and landscaping in Covington, GA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lawn Masters V5 — Lawn Care & Landscaping in Covington, GA",
    description:
      "Professional lawn care, landscaping, and pressure washing in Covington and Newton County, GA. Free estimates. Se Habla Español.",
    images: ["/og-image.jpg"],
  },
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  // LandscapeService is not a schema.org type — HomeAndConstructionBusiness is
  // the closest valid LocalBusiness subtype Google recognizes.
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": `https://${BUSINESS.domain}/#business`,
  image: `https://${BUSINESS.domain}/logo-color.png`,
  logo: `https://${BUSINESS.domain}/logo-color.png`,
  name: BUSINESS.shortName,
  description:
    "Professional landscaping services including lawn care, landscape design, hardscaping, tree care, irrigation, pressure washing, and seasonal cleanup.",
  url: `https://${BUSINESS.domain}`,
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Covington",
    addressRegion: "GA",
    addressCountry: "US",
  },
  areaServed: [
    ...BUSINESS.cities.map((name) => ({ "@type": "City", name })),
    { "@type": "County", name: "Newton County" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  serviceType: [
    "Lawn Care",
    "Landscape Design",
    "Hardscaping",
    "Tree & Shrub Care",
    "Irrigation & Drainage",
    "Pressure Washing",
    "Seasonal Cleanup",
  ],
  priceRange: "$45–$120/mo",
  sameAs: [BUSINESS.instagramUrl, BUSINESS.facebookUrl],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${_inter.variable} ${_dmSerif.variable} font-sans antialiased`}>
        {children}
        <FloatingCTA />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
