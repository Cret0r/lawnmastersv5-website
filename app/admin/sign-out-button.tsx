"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { signOutAction } from "./actions"

export function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOutAction()
          router.push("/admin/login")
        })
      }}
      className="text-xs border-border text-muted-foreground hover:text-foreground bg-transparent"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5 mr-1.5" />
      )}
      Sign Out
    </Button>
  )
}
