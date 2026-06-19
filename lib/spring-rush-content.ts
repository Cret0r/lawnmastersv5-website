// ═══════════════════════════════════════════════════
// SPRING RUSH LAWN PLAN — Central content config
// Update copy here; components will pull from this file.
// ═══════════════════════════════════════════════════

export const springRush = {
  // — Announcement Bar
  announcement: {
    text: "Summer Special — Now booking weekly routes",
    cta: "Lock In My Spot",
    href: "/",
  },

  // — Hero
  hero: {
    headline: "Secure Your Spot — Limited Availability",
    subheadline:
      "Recurring lawn service starting at $120/month*. Se Habla Español.",
    noContract: "No contracts. Cancel anytime.",
    ctaCall: { label: "Call Now", href: "tel:+14076000301" },
    ctaText: {
      label: "Text Now",
      href: "sms:+14076000301?body=Hi%2C%20I%20want%20to%20lock%20in%20the%20Summer%20Special%20weekly%20plan.%20My%20address%20is%20____.",
    },
    secondaryLink: {
      label: "Get a Fast Estimate",
      href: "/quote",
    },
  },

  // — Trust badges (only show if true)
  trust: {
    badges: [
      { label: "Locally Owned & Operated", show: true },
      { label: "Reliable Weekly Scheduling", show: true },
      { label: "Se Habla Español", show: true },
    ],
  },

  // — Proof section
  proof: {
    headline: "Real Before & After Transformations",
    transformations: [
      {
        beforeImage: "/real-before-backyard.jpg",
        afterImage: "/real-after-backyard.jpg",
        caption: "Backyard cleanup — Covington, GA",
      },
      {
        beforeImage: "/real-before-sideyard.jpg",
        afterImage: "/real-after-sideyard.jpg",
        caption: "Side yard overgrowth cleared — Conyers, GA",
      },
      {
        beforeImage: "/gallery/front-yard-before.jpg",
        afterImage: "/gallery/front-yard-after.jpg",
        caption: "Front yard lawn restoration — Covington, GA",
      },
    ],
  },

  // — Pricing
  pricing: {
    headline: "Simple, Transparent Pricing",
    plans: [
      {
        name: "Biweekly Service",
        badge: "Basic Maintenance",
        price: "$90*",
        period: "/month",
        note: "2 scheduled visits",
        features: [
          "Professional mowing",
          "Precision edging",
          "Full cleanup — no clippings left behind",
        ],
        highlighted: false,
      },
      {
        name: "Recurring Lawn Service",
        badge: "Most Popular",
        price: "$120*",
        period: "/month",
        note: "Typically 3–4 visits per month depending on season and growth.",
        features: [
          "Professional mowing every week",
          "Precision edging",
          "Full cleanup — no clippings left behind",
          "Priority scheduling",
        ],
        highlighted: true,
      },
      {
        name: "One-Time Cut",
        badge: "One-Time Reset",
        price: "$45–$55*",
        period: "",
        note: "per visit",
        features: [
          "Professional mowing",
          "Precision edging",
          "Full cleanup — no clippings left behind",
        ],
        highlighted: false,
      },
    ],
  },

  // — Guarantee
  guarantee: {
    intro: "Our promise to you:",
    text: "If we ever miss a scheduled service without notice, your next cut is 100% free.*",
  },

  // — Referral
  referral: {
    primary: "$20 off your next cut for every friend you send.*",
    secondary: "Send 2 neighbors, your next cut is free.*",
  },

  // — Service area (homepage compact version)
  serviceArea: {
    text: "Now booking weekly lawn service in Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe, GA, and surrounding neighborhoods.",
    cta: { label: "See If We Service Your Area", href: "/contact" },
  },

  // — Reviews (hidden until real reviews are added)
  reviews: {
    show: false, // flip to true once real reviews are provided
    items: [] as { name: string; text: string; rating: number }[],
  },
} as const
