import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Contact Lawn Masters V5 — Covington, GA Lawn Service",
  description:
    "Contact Lawn Masters V5 for lawn care service in Covington, GA. Call, text, or fill out our quick estimate form. Se Habla Español.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
