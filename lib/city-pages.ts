// ═══════════════════════════════════════════════════
// PER-CITY LANDING PAGES — /lawn-care/[city]
// Local-SEO copy for each target city. Each entry gets unique,
// city-specific copy (not templated boilerplate) so the pages
// don't read as doorway pages.
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
}

export const cityPages: CityPage[] = [
  {
    slug: "covington",
    city: "Covington",
    title: "Lawn Care & Mowing in Covington, GA | Lawn Masters V5",
    description:
      "Local lawn mowing, landscaping & pressure washing in Covington, GA. Weekly plans from $90/mo, no contracts. Free estimates — Se Habla Español.",
    h1: "Lawn Care in Covington, GA",
    intro:
      "Lawn Masters V5 is based right here in Covington — when you call, you're talking to the crew that shows up. We run weekly and biweekly mowing routes across Newton County, plus landscaping cleanups and pressure washing.",
    localAngle:
      "Covington's older homes along the Hwy 278 corridor are our home turf. Georgia humidity is hard on driveways and siding here — mildew staining shows up fast — so many of our mowing customers add a driveway pressure wash once a season to keep the whole property sharp.",
    heroImage: "/hero-lawn-care-new.jpg",
    neighborhoodsLine:
      "Serving all of Covington and Newton County, including the Hwy 278 corridor and downtown square area.",
  },
  {
    slug: "conyers",
    city: "Conyers",
    title: "Lawn Care & Mowing in Conyers, GA | Lawn Masters V5",
    description:
      "Reliable weekly lawn mowing & landscaping in Conyers, GA. HOA-friendly service from $90/mo, no contracts. Free estimates — Se Habla Español.",
    h1: "Lawn Care in Conyers, GA",
    intro:
      "Lawn Masters V5 runs regular mowing routes through Conyers every week. Professional mowing, precision edging, and full cleanup — no clippings left behind, and no contracts to sign.",
    localAngle:
      "Conyers neighborhoods off Hwy 138 mean HOA standards — and an overgrown lawn letter nobody wants. Our weekly plan keeps you comfortably inside the lines, and because we route multiple homes per street, we can hold pricing that one-off services can't match.",
    heroImage: "/lawn-care-mowing-stripes.jpg",
    neighborhoodsLine:
      "Serving Conyers and Rockdale County, including the neighborhoods off Hwy 138.",
  },
  {
    slug: "oxford",
    city: "Oxford",
    title: "Lawn Care & Mowing in Oxford, GA | Lawn Masters V5",
    description:
      "Lawn mowing, bed cleanups & tree-lined lot care in Oxford, GA. Weekly plans from $90/mo, no contracts. Free estimates — Se Habla Español.",
    h1: "Lawn Care in Oxford, GA",
    intro:
      "Just up the road from our Covington base, Oxford is on our core weekly route. We handle mowing, edging, shrub trimming, and the seasonal cleanups that Oxford's mature lots demand.",
    localAngle:
      "Oxford's tree-lined lots near Oxford College are beautiful — and by June, the beds are usually fighting back. Leaf litter, shade-driven weeds, and overgrown borders are the jobs we see most here, which is why our Full Bed Refresh pairs so well with a weekly mowing plan in this area.",
    heroImage: "/hero-landscaping-lush-garden.jpg",
    neighborhoodsLine:
      "Serving Oxford and northern Newton County, including the streets around Oxford College.",
  },
]

export function getCityPage(slug: string): CityPage | undefined {
  return cityPages.find((c) => c.slug === slug)
}
