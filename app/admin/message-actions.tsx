"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, CheckCircle, CircleDot } from "lucide-react"
import { updateMessageRead, deleteMessage } from "./actions"

export function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2 pt-2 border-t border-border">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        className="text-xs border-primary text-primary hover:bg-primary/10 bg-transparent"
        onClick={() => {
          startTransition(async () => {
            await updateMessageRead(id, !isRead)
          })
        }}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin mr-1" />
        ) : isRead ? (
          <CircleDot className="w-3 h-3 mr-1" />
        ) : (
          <CheckCircle className="w-3 h-3 mr-1" />
        )}
        {isRead ? "Mark Unread" : "Mark Read"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
        onClick={() => {
          if (window.confirm("Delete this message? This cannot be undone.")) {
            startTransition(async () => {
              await deleteMessage(id)
            })
          }
        }}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        Delete
      </Button>
    </div>
  )
}
