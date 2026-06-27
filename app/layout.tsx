import type React from "react"
import type { Metadata } from "next"
import { DM_Serif_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FloatingCTA } from "@/components/floating-cta"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" })

export const metadata: Metadata = {
  title: "Lawn Masters V5 — Lawn Care & Landscaping in Covington & Conyers, GA",
  description:
    "Professional lawn care and landscaping in Covington, Conyers, and the greater Georgia area. Weekly mowing from $120/mo. Landscape design, hardscaping, pressure washing, and more. Se Habla Espanol.",
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
  "@type": "LandscapeService",
  name: "Lawn Masters V5",
  description:
    "Professional landscaping services including lawn care, landscape design, hardscaping, tree care, irrigation, pressure washing, and seasonal cleanup.",
  url: "https://lawnmastersv5.com",
  telephone: "+1-407-600-0301",
  email: "lawnmastersv5@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Covington",
    addressRegion: "GA",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Covington" },
    { "@type": "City", name: "Conyers" },
    { "@type": "City", name: "Oxford" },
    { "@type": "City", name: "Porterdale" },
    { "@type": "City", name: "Social Circle" },
    { "@type": "City", name: "Monroe" },
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
  sameAs: ["https://www.instagram.com/lawnmasters_v5/"],
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
