"use client"

import { Phone, MessageSquare } from "lucide-react"
import { BUSINESS, smsHref } from "@/lib/business-info"

export function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-foreground/95 backdrop-blur-sm border-t border-border safe-area-pb">
      <div className="grid grid-cols-2 divide-x divide-primary-foreground/20">
        <a
          href={BUSINESS.telHref}
          className="flex items-center justify-center gap-2 py-3.5 text-primary-foreground font-medium text-sm transition-colors active:bg-primary-foreground/10"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href={smsHref("Hi, I want to lock in the Summer Special weekly plan. My address is ____.")}
          className="flex items-center justify-center gap-2 py-3.5 text-primary font-medium text-sm transition-colors active:bg-primary-foreground/10"
        >
          <MessageSquare className="w-4 h-4" />
          Text Now
        </a>
      </div>
    </div>
  )
}
