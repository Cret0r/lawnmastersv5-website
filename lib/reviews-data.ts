// Reviews data - Easy to edit and add new reviews
// To add a new review, simply add a new object to the array below

export interface Review {
  id: number
  rating: number // 1-5 stars
  text: string
  customerName: string // First name + last initial (e.g., "Carlos M.")
  location: string // City, GA
}

export const reviews: Review[] = [
  {
    id: 1,
    rating: 5,
    text: "Great service, always on time and very professional.",
    customerName: "Carlos M.",
    location: "Covington, GA",
  },
  {
    id: 2,
    rating: 5,
    text: "Yard looks amazing after every visit. Highly recommend.",
    customerName: "Maria G.",
    location: "Conyers, GA",
  },
  {
    id: 3,
    rating: 5,
    text: "Very reliable and easy to work with.",
    customerName: "James R.",
    location: "Covington, GA",
  },
]

// Google review link — points to the approved GEORGIA (Covington) Business
// Profile. The old g.page link pointed at the Florida profile; do not revert.
// (Owner-provided share link; resolves to the Lawn Masters V5 INC panel.)
export const googleReviewLink = "https://share.google/AM7DCDpim0yALiqCR"

// Business name for display
export const businessName = "Lawn Masters V5 INC"
