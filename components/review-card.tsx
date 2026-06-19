import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Review } from "@/lib/reviews-data"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        {/* Star Rating */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < review.rating
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-foreground text-base leading-relaxed mb-4">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Customer Info */}
        <p className="text-sm text-muted-foreground">
          — {review.customerName}, {review.location}
        </p>
      </CardContent>
    </Card>
  )
}
