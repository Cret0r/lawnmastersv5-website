import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Free Lawn Care Estimate — Covington, Conyers & Newton County, GA",
  description:
    "Get a free lawn care estimate in Covington, Conyers, Oxford, Monroe, and Newton County, GA. Quick response, no contracts.",
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
