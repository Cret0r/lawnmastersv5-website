// ═══════════════════════════════════════════════════
// PER-CITY LANDING PAGES — /lawn-care/[city]
// Local-SEO copy for each target city. Each entry gets unique,
// city-specific copy (not templated boilerplate) so the pages
// don't read as doorway pages.
// Repositioned July 2026: transformation-first (docs/OFFERS.md) —
// refreshes lead, mowing is the maintenance back end.
// h1 must keep the exact substring "Lawn Care in <City>, GA"
// (SEO keyword + asserted by cypress/e2e/city-pages.cy.ts).
// Neighborhood details sourced from SUMMER_CAMPAIGN_2026.md § 6.
// ═══════════════════════════════════════════════════

export interface CityPage {
  slug: string
  city: string
  /** Title tag — targets "lawn care <city> ga" searches */
  title: string
  description: string
  h1: string
  intro: string
  /** City-specific selling point paragraph */
  localAngle: string
  heroImage: string
  neighborhoodsLine: string
  /**
   * Question-phrased Q&As rendered as headings + emitted as FAQPage schema
   * (featured-snippet / AEO play). Keep answers 40–60 words and UNIQUE per
   * city. ⚠️ Owner rule: NO dollar amounts in answers — point to the free
   * on-site estimate instead.
   */
  faqs: { question: string; answer: string }[]
}

export const cityPages: CityPage[] = [
  {
    slug: "covington",
    city: "Covington",
    title: "Property Refresh & Lawn Care in Covington, GA | Lawn Masters V5",
    description:
      "We transform overgrown properties in Covington, GA — cleanups, mulch, pressure washing, shrub care — often in one day. Recurring maintenance available. Free estimates — Se Habla Español.",
    h1: "Property Transformations & Lawn Care in Covington, GA",
    intro:
      "Lawn Masters V5 is based right here in Covington — when you call, you're talking to the owner who shows up and does the work. We take yards that have gotten away from people and make them look new, usually in one day, then keep them that way with weekly and biweekly maintenance routes.",
    localAngle:
      "Covington's older homes along the Hwy 278 corridor are our home turf. Georgia humidity is hard on driveways and siding here — mildew staining shows up fast — so most Covington refreshes pair the yard cleanup with a driveway pressure wash. One visit, and the whole property reads new from the street.",
    heroImage: "/hero-lawn-care-new.jpg",
    neighborhoodsLine:
      "Serving all of Covington and Newton County, including the Hwy 278 corridor and downtown square area.",
    faqs: [
      {
        question: "How much does a property refresh cost in Covington, GA?",
        answer:
          "Every refresh is priced to the property — lot size, how far gone the yard is, and what needs hauling away drive the number, so we never quote flat rates sight-unseen. The estimate is free: we walk the property with you, then text a written quote, usually the same day.",
      },
      {
        question: "Do you offer pressure washing in Covington too?",
        answer:
          "Yes — driveway and exterior pressure washing is one of our most-booked Covington services, and it's built into our refresh packages. Georgia humidity puts mildew stains on the older concrete around the Hwy 278 corridor fast; washing it as part of the refresh makes the whole property read new at once.",
      },
    ],
  },
  {
    slug: "conyers",
    city: "Conyers",
    title: "Property Refresh & Lawn Care in Conyers, GA | Lawn Masters V5",
    description:
      "HOA-notice rescue, yard cleanups, mulch & pressure washing in Conyers, GA — then weekly maintenance to keep you inside the lines. Free estimates — Se Habla Español.",
    h1: "Property Transformations & Lawn Care in Conyers, GA",
    intro:
      "Conyers is where overgrown yards meet HOA letters — and that's exactly the work Lawn Masters V5 does best. We bring a property back under control in one visit: cleanup, beds, shrubs, pressure washing. Then our weekly routes keep it comfortably inside the lines.",
    localAngle:
      "The neighborhoods off Hwy 138 mean HOA standards — and a violation notice nobody wants. When one lands, we prioritize fixing exactly what's cited, fast, with before-and-after photos you can send straight back to the board. Because we route multiple homes per street here, maintenance stays efficient after the rescue.",
    heroImage: "/lawn-care-mowing-stripes.jpg",
    neighborhoodsLine:
      "Serving Conyers and Rockdale County, including the neighborhoods off Hwy 138.",
    faqs: [
      {
        question: "Can you fix an HOA violation notice in Conyers fast?",
        answer:
          "Yes — HOA rescues are a specialty. We prioritize the cited items — overgrowth, beds, edging, debris — usually within days, and send you before-and-after photos to forward to the board. After the rescue, most Conyers customers move onto a weekly route so a notice never lands again.",
      },
      {
        question: "How much is lawn care in Conyers, GA?",
        answer:
          "It depends on the property — lot size and condition set the number, so we quote after seeing it, never blind. Estimates are free and fast, and because we route multiple homes per street in Conyers, ongoing maintenance stays efficient. No contracts either way — you can cancel anytime.",
      },
    ],
  },
  {
    slug: "oxford",
    city: "Oxford",
    title: "Property Refresh & Lawn Care in Oxford, GA | Lawn Masters V5",
    description:
      "Bed rebuilds, overgrowth cleanups & tree-lined lot care in Oxford, GA — transformations first, weekly maintenance after. Free estimates — Se Habla Español.",
    h1: "Property Transformations & Lawn Care in Oxford, GA",
    intro:
      "Just up the road from our Covington base, Oxford's mature, tree-lined lots are beautiful — until the beds and borders get away from you. We rebuild them: weeding, edging, fresh mulch, shrub shaping, haul-away. Then weekly maintenance keeps the whole lot sharp.",
    localAngle:
      "Oxford's tree-lined lots near Oxford College fight back by June — leaf litter, shade-driven weeds, and overgrown borders are the jobs we see most here. A full bed refresh transforms these properties more than anything else, which is why it anchors most of our Oxford work before a mowing route takes over.",
    heroImage: "/hero-landscaping-lush-garden.jpg",
    neighborhoodsLine:
      "Serving Oxford and northern Newton County, including the streets around Oxford College.",
    faqs: [
      {
        question: "Do you clean up overgrown flower beds in Oxford, GA?",
        answer:
          "All the time — Oxford's tree-lined lots near the college fill beds with leaf litter and shade weeds by June. Our bed refreshes (weeding, edging, fresh mulch, defined borders) transform these properties in a single visit, and most Oxford customers pair one with a weekly plan so it never gets away again.",
      },
      {
        question: "How often should Oxford lawns be mowed in summer?",
        answer:
          "Weekly, April through October. Bermuda and Zoysia grow aggressively in Georgia heat, and Oxford's mature-tree shade invites moss and thin patches when grass is cut too short or too rarely. Weekly cuts at the right height keep the lawn thick enough to crowd out weeds on its own.",
      },
    ],
  },
]

export function getCityPage(slug: string): CityPage | undefined {
  return cityPages.find((c) => c.slug === slug)
}
