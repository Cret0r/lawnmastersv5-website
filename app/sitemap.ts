import type { MetadataRoute } from "next"
import { BUSINESS } from "@/lib/business-info"
import { cityPages } from "@/lib/city-pages"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${BUSINESS.domain}`

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/services`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/quote`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/summer`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${base}/gallery`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/about`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/contact`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/service-policies`, priority: 0.3, changeFrequency: "yearly" },
  ]

  const cityRoutes: MetadataRoute.Sitemap = cityPages.map((c) => ({
    url: `${base}/lawn-care/${c.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }))

  return [...staticRoutes, ...cityRoutes]
}
