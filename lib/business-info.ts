// ═══════════════════════════════════════════════════
// BUSINESS INFO — single source of truth
// Phone, email, cities, and socials for the whole site.
// Change values HERE — never hardcode them in pages/components.
// (AGENTS.md rules still apply: get owner confirmation before
// changing the phone number or the service-area city list.)
// ═══════════════════════════════════════════════════

export const BUSINESS = {
  name: "Lawn Masters V5 INC",
  shortName: "Lawn Masters V5",
  // www is the PRIMARY domain in Vercel (apex 307-redirects to it) — canonicals,
  // schema @id, OG urls, sitemap and robots must all use www (GOTCHAS #33).
  domain: "www.lawnmastersv5.com",

  phoneDisplay: "(407) 600-0301",
  phoneE164: "+14076000301",
  telHref: "tel:+14076000301",

  email: "lawnmastersv5@gmail.com",
  mailtoHref: "mailto:lawnmastersv5@gmail.com",

  // E-E-A-T: the owner's first name for the About page + founder schema.
  // ⚠️ Not on record — owner must supply it. Leave "" until then; the
  // founder markup in app/layout.tsx activates automatically once set.
  ownerFirstName: "",

  instagramHandle: "@lawnmasters_v5",
  instagramUrl: "https://www.instagram.com/lawnmasters_v5",
  facebookUrl: "https://www.facebook.com/profile.php?id=61590265813532",

  // Canonical service-area list (Newton County, GA + neighbors).
  cities: ["Covington", "Conyers", "Oxford", "Porterdale", "Social Circle", "Monroe"],
} as const

// "Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe"
export const CITIES_LINE = BUSINESS.cities.join(", ")

/** Builds an sms: link to the business number with a pre-filled body. */
export function smsHref(body: string): string {
  return `sms:${BUSINESS.phoneE164}?body=${encodeURIComponent(body)}`
}

/** Builds a WhatsApp chat link with a pre-filled message. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${BUSINESS.phoneE164.replace("+", "")}?text=${encodeURIComponent(message)}`
}
