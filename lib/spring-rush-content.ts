// ═══════════════════════════════════════════════════
// HOMEPAGE CAMPAIGN CONTENT — Central content config
// Repositioned July 2026: transformation-first (docs/OFFERS.md).
// Refresh tiers are the front end; recurring mowing is the back end,
// mentioned small below the tiers and pitched at the walk-through.
// The legacy `pricing.plans` (mowing) stays exported — /summer's
// conversion bridge still renders it as the back-end upsell.
// Phone/cities come from lib/business-info.ts — edit them THERE.
// File keeps its legacy name (see docs/DECISIONS.md — rename = churn).
// ═══════════════════════════════════════════════════

import { BUSINESS, CITIES_LINE, smsHref } from "./business-info"

export const springRush = {
  // — Announcement Bar
  announcement: {
    text: "Now booking property refreshes in Newton County",
    cta: "Get My Free Estimate",
    href: "/quote",
  },

  // — Hero (transformation-first)
  hero: {
    headline: "From Overgrown to Impressive — Often in One Day",
    subheadline:
      "Cleanups, mulch, pressure washing & shrub care in Covington & Conyers, GA. Recurring maintenance available to keep it looking new.",
    noContract: "Free on-site estimates · Walk-through guarantee · Se Habla Español",
    ctaCall: { label: "Call Now", href: BUSINESS.telHref },
    ctaText: {
      label: "Text Now",
      href: smsHref("Hi, I'd like a free estimate for a property refresh. My address is ____."),
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
      { label: "Walk-Through Guarantee", show: true },
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

  // — THE FRONT END: Refresh tiers (owner-confirmed prices, 7/14/2026;
  //   Total Transformation deliberately shows Custom Quote on the site)
  refreshTiers: {
    headline: "Property Refresh Packages",
    subheadline:
      "Every package is quoted free, in person, to your property — these are starting points, not flat rates.",
    tiers: [
      {
        name: "Curb Appeal Refresh",
        badge: "Front of House",
        price: "from $349*",
        promise: "The front of your house looks new by dinner.",
        features: [
          "Front beds weeded, edged & mulched",
          "Shrubs shaped",
          "Walkway & porch pressure washed",
        ],
        highlighted: false,
      },
      {
        name: "Full Property Refresh",
        badge: "Most Popular",
        price: "from $749*",
        promise: "Your whole property, back under control, in one day.",
        features: [
          "Full yard cleanup & haul-away",
          "Every bed weeded, edged & mulched",
          "All shrubs shaped",
          "Driveway pressure washed",
        ],
        highlighted: true,
      },
      {
        name: "Total Transformation",
        badge: "Overgrown & Pre-Sale",
        price: "Custom Quote",
        promise: "Neglected to knockout — usually within 48 hours.",
        features: [
          "Lot-level clearing & haul-away",
          "Beds rebuilt with fabric & fresh mulch",
          "Full pressure wash — driveway, house, walkways",
          "Gutters cleaned",
        ],
        highlighted: false,
      },
    ],
    maintenanceNote:
      "Want it to stay this way? Recurring maintenance routes are available after your refresh — priced to your property at your free estimate. No contracts, and if we ever miss a scheduled visit without notice, the next one's free.",
    disclaimer:
      "*Starting prices. Final quote is always given after we see the property — never a surprise, always before we start.",
  },

  // — LEGACY: mowing plans (back end). Still rendered on /summer's
  //   conversion bridge. ⚠️ Florida-era prices — GA repricing pending
  //   (docs/ROADMAP.md). Not shown on the homepage anymore.
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

  // — Guarantees
  guarantee: {
    // The transformation guarantee — said BEFORE the price, always.
    intro: "Our promise to you:",
    text: "When we finish, we walk the property with you. Anything you don't love, we fix on the spot — free.",
    // The maintenance guarantee — lives with the maintenance mention.
    missedCut:
      "If we ever miss a scheduled service without notice, your next visit is 100% free.*",
  },

  // — Referral
  referral: {
    primary: "$30 off your next service for every neighbor you send.*",
    secondary: "And your neighbor gets $30 off their first service too.*",
  },

  // — Service area (homepage compact version)
  serviceArea: {
    text: `Now booking property refreshes and maintenance routes in ${CITIES_LINE}, GA, and surrounding neighborhoods.`,
    cta: { label: "See If We Service Your Area", href: "/contact" },
  },

  // — Reviews (hidden until real reviews are added)
  reviews: {
    show: false, // flip to true once real reviews are provided
    items: [] as { name: string; text: string; rating: number }[],
  },
} as const
