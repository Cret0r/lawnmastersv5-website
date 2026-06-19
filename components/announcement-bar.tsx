"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { springRush } from "@/lib/spring-rush-content"
import Link from "next/link"

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash

  useEffect(() => {
    const stored = localStorage.getItem("sr-bar-dismissed")
    setDismissed(stored === "true")
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem("sr-bar-dismissed", "true")
  }

  if (dismissed) return null

  const { text, cta, href } = springRush.announcement

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
        <span className="hidden sm:inline font-medium">{text}</span>
        <span className="sm:hidden font-medium">Summer Special — Now Booking</span>
        <Link
          href={href}
          className="inline-flex items-center rounded-full bg-primary-foreground text-primary px-4 py-1 text-xs font-bold hover:bg-primary-foreground/90 transition-colors"
        >
          {cta}
        </Link>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
