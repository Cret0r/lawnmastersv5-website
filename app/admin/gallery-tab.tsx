"use client"

import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ImagePlus,
  Loader2,
  Trash2,
  Pencil,
  Star,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Images,
  Image as ImageIcon,
} from "lucide-react"
import {
  getGalleryItemsAdmin,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  setGalleryItemFeatured,
  setGalleryItemPublished,
  moveGalleryItem,
} from "./gallery-actions"
import { getEffectiveItemType, type GalleryItem, type GalleryItemType } from "@/lib/gallery"

const fileInputClasses =
  "w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"

// A single file input with a live thumbnail preview (or the current photo,
// when editing) — used by both the Add form and the Edit dialog so the
// preview behavior matches everywhere. Keyed by the parent to force a clean
// remount (and preview reset) after a successful submit or dialog close.
function PhotoInput({
  id,
  name,
  label,
  required,
  currentUrl,
}: {
  id: string
  name: string
  label: string
  required?: boolean
  currentUrl?: string | null
}) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (preview) URL.revokeObjectURL(preview)
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const displaySrc = preview || currentUrl || null

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required={required}
        onChange={handleChange}
        className={fileInputClasses}
      />
      {displaySrc && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">
            {preview ? "New photo:" : "Current photo (choose a file to replace):"}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt={`${label} preview`}
            className="w-32 h-24 object-cover rounded border border-border"
          />
        </div>
      )}
    </div>
  )
}

export function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [itemType, setItemType] = useState<GalleryItemType>("before_after")
  const [formKey, setFormKey] = useState(0)

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [isEditPending, startEditTransition] = useTransition()

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
        setFormKey((k) => k + 1)
        toast.success("Added to gallery.")
        await refresh()
      } else {
        const message = result.error ?? "Something went wrong."
        setError(message)
        toast.error(message)
      }
    })
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingItem) return
    setEditError(null)
    const formData = new FormData(e.currentTarget)

    startEditTransition(async () => {
      const result = await updateGalleryItem(editingItem.id, formData)
      if (result.success) {
        setEditingItem(null)
        toast.success("Saved.")
        await refresh()
      } else {
        const message = result.error ?? "Something went wrong."
        setEditError(message)
        toast.error(message)
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
      if (result.success) {
        toast.success("Deleted.")
      } else {
        toast.error(result.error ?? "Delete failed.")
      }
      await refresh()
    })
  }

  const handleToggleFeatured = (item: GalleryItem) => {
    const next = !item.featured
    startTransition(async () => {
      const result = await setGalleryItemFeatured(item.id, next)
      if (result.success) {
        toast.success(next ? "Featured on homepage." : "Removed from homepage.")
      } else {
        toast.error(result.error ?? "Could not update featured status.")
      }
      await refresh()
    })
  }

  const handleTogglePublished = (item: GalleryItem) => {
    const next = !item.published
    startTransition(async () => {
      const result = await setGalleryItemPublished(item.id, next)
      if (result.success) {
        toast.success(next ? "Published to /gallery." : "Hidden from /gallery.")
      } else {
        toast.error(result.error ?? "Could not update published status.")
      }
      await refresh()
    })
  }

  const handleMove = (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await moveGalleryItem(id, direction)
      if (!result.success) toast.error(result.error ?? "Could not reorder.")
      await refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-primary" aria-hidden="true" />
            Add a Gallery Item
          </h3>
          <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <p className="block text-sm font-medium text-foreground mb-1.5">Item type</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setItemType("before_after")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    itemType === "before_after"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-input hover:bg-secondary"
                  }`}
                >
                  <Images className="w-4 h-4" aria-hidden="true" />
                  Before / After
                </button>
                <button
                  type="button"
                  onClick={() => setItemType("single")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    itemType === "single"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-input hover:bg-secondary"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                  Single Image
                </button>
              </div>
              <input type="hidden" name="item_type" value={itemType} />
            </div>

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

              {itemType === "before_after" ? (
                <>
                  <PhotoInput id="gallery-before" name="before" label="Before photo" required />
                  <PhotoInput id="gallery-after" name="after" label="After photo" required />
                </>
              ) : (
                <div className="sm:col-span-2">
                  <PhotoInput id="gallery-photo" name="photo" label="Photo" required />
                </div>
              )}
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
              No uploaded items yet. Items added here appear on /gallery above the built-in transformations, and can be featured on the homepage.
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card
              key={item.id}
              data-gallery-item={item.title}
              className={!item.published ? "opacity-60" : undefined}
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.before_url} alt={`${item.title} — ${getEffectiveItemType(item) === "single" ? "photo" : "before"}`} loading="lazy" className="w-20 h-14 object-cover rounded" />
                  {getEffectiveItemType(item) === "before_after" && item.after_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.after_url} alt={`${item.title} — after`} loading="lazy" className="w-20 h-14 object-cover rounded" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        <Star className="w-3 h-3 fill-primary" aria-hidden="true" />
                        Featured
                      </span>
                    )}
                    {!item.published && (
                      <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.services.join(", ") || "No services tagged"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending || index === 0}
                    onClick={() => handleMove(item.id, "up")}
                    title="Move up"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending || index === items.length - 1}
                    onClick={() => handleMove(item.id, "down")}
                    title="Move down"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant={item.featured ? "default" : "outline"}
                    size="sm"
                    disabled={isPending || !item.published}
                    onClick={() => handleToggleFeatured(item)}
                    title={item.featured ? "Remove from homepage" : "Feature on homepage"}
                  >
                    <Star className={`w-4 h-4 ${item.featured ? "fill-current" : ""}`} aria-hidden="true" />
                    <span className="ml-1 hidden md:inline">{item.featured ? "Featured" : "Feature"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleTogglePublished(item)}
                    title={item.published ? "Hide from /gallery" : "Publish to /gallery"}
                  >
                    {item.published ? <Eye className="w-4 h-4" aria-hidden="true" /> : <EyeOff className="w-4 h-4" aria-hidden="true" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      setEditError(null)
                      setEditingItem(item)
                    }}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </Button>
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form key={editingItem.id} onSubmit={handleEditSubmit} className="space-y-4">
              {editError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {editError}
                </div>
              )}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-foreground mb-1.5">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  required
                  defaultValue={editingItem.title}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={2}
                  defaultValue={editingItem.description ?? ""}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="edit-services" className="block text-sm font-medium text-foreground mb-1.5">
                  Services (comma-separated)
                </label>
                <input
                  id="edit-services"
                  name="services"
                  type="text"
                  defaultValue={editingItem.services.join(", ")}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {getEffectiveItemType(editingItem) === "before_after" ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <PhotoInput id="edit-before" name="before" label="Before photo" currentUrl={editingItem.before_url} />
                  <PhotoInput id="edit-after" name="after" label="After photo" currentUrl={editingItem.after_url} />
                </div>
              ) : (
                <PhotoInput id="edit-photo" name="photo" label="Photo" currentUrl={editingItem.before_url} />
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)} disabled={isEditPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isEditPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isEditPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
