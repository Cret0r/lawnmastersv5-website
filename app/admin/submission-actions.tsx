"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { updateSubmissionStatus, deleteSubmission } from "./actions"

const statusFlow = ["new", "contacted", "quoted", "completed"]

const nextStatusLabel: Record<string, string> = {
  new: "Mark Contacted",
  contacted: "Mark Quoted",
  quoted: "Mark Completed",
}

export function SubmissionActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const nextStatus = statusFlow[statusFlow.indexOf(currentStatus) + 1]

  return (
    <div className="flex items-center gap-2 pt-2 border-t border-border">
      {nextStatus && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          className="text-xs border-primary text-primary hover:bg-primary/10 bg-transparent"
          onClick={() => {
            startTransition(async () => {
              await updateSubmissionStatus(id, nextStatus)
            })
          }}
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          {nextStatusLabel[currentStatus] || "Advance"}
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
        onClick={() => {
          if (window.confirm("Delete this submission? This cannot be undone.")) {
            startTransition(async () => {
              await deleteSubmission(id)
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
