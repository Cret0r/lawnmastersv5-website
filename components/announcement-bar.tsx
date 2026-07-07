"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { springRush } from "@/lib/spring-rush-content"
import Link from "next/link"

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("sr-bar-dismissed")
    setDismissed(stored === "true")
  }, [])

  // Publish the bar's measured height as a CSS variable so the fixed
  // Navigation (and its mobile drawer) can sit below it instead of being
  // overlapped. Resets to 0 on dismiss and on unmount.
  useEffect(() => {
    const setHeight = () => {
      const h = !dismissed && barRef.current ? barRef.current.offsetHeight : 0
      document.documentElement.style.setProperty("--announcement-height", `${h}px`)
    }
    setHeight()
    window.addEventListener("resize", setHeight)
    return () => {
      window.removeEventListener("resize", setHeight)
      document.documentElement.style.setProperty("--announcement-height", "0px")
    }
  }, [dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem("sr-bar-dismissed", "true")
  }

  if (dismissed) return null

  const { text, cta, href } = springRush.announcement

  return (
    <div ref={barRef} className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <div className="flex-1 flex items-center justify-center gap-3">
          <span className="hidden sm:inline font-medium">{text}</span>
          <span className="sm:hidden font-medium">Summer Special — Now Booking</span>
          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-primary-foreground text-primary px-4 py-1 text-xs font-bold hover:bg-primary-foreground/90 transition-colors"
          >
            {cta}
          </Link>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
