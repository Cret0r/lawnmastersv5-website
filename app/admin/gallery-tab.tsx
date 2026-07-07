"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import { getGalleryItemsAdmin, addGalleryItem, deleteGalleryItem } from "./gallery-actions"
import type { GalleryItem } from "@/lib/gallery"

export function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const refresh = async () => {
    const data = await getGalleryItemsAdmin()
    setItems(data)
    setLoaded(true)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await addGalleryItem(formData)
      if (result.success) {
        form.reset()
        await refresh()
      } else {
        setError(result.error ?? "Something went wrong.")
      }
    })
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setConfirmDeleteId(null)
    startTransition(async () => {
      const result = await deleteGalleryItem(id)
      if (!result.success) setError(result.error ?? "Delete failed.")
      await refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-primary" aria-hidden="true" />
            Add Before / After Photos
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="gallery-title" className="block text-sm font-medium text-foreground mb-1.5">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  id="gallery-title"
                  name="title"
                  type="text"
                  required
                  placeholder="Driveway Pressure Washing — Covington"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="gallery-description" className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  id="gallery-description"
                  name="description"
                  rows={2}
                  placeholder="What was done, in a sentence or two"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="gallery-services" className="block text-sm font-medium text-foreground mb-1.5">
                  Services (comma-separated)
                </label>
                <input
                  id="gallery-services"
                  name="services"
                  type="text"
                  placeholder="Pressure Washing, Driveway Cleaning"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="gallery-before" className="block text-sm font-medium text-foreground mb-1.5">
                  Before photo <span className="text-destructive">*</span>
                </label>
                <input
                  id="gallery-before"
                  name="before"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              <div>
                <label htmlFor="gallery-after" className="block text-sm font-medium text-foreground mb-1.5">
                  After photo <span className="text-destructive">*</span>
                </label>
                <input
                  id="gallery-after"
                  name="after"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG, or WebP · max 8 MB per photo · published to /gallery immediately</p>
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Uploading...
                </>
              ) : (
                "Add to Gallery"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing items */}
      <div className="space-y-3">
        {!loaded ? (
          <p className="text-sm text-muted-foreground">Loading gallery…</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              No uploaded items yet. Items added here appear on /gallery above the built-in transformations.
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.before_url} alt={`${item.title} — before`} loading="lazy" className="w-20 h-14 object-cover rounded" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.after_url} alt={`${item.title} — after`} loading="lazy" className="w-20 h-14 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.services.join(", ") || "No services tagged"}
                  </p>
                </div>
                <Button
                  variant={confirmDeleteId === item.id ? "destructive" : "outline"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id)}
                  onBlur={() => setConfirmDeleteId(null)}
                >
                  <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                  {confirmDeleteId === item.id ? "Confirm?" : "Delete"}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
