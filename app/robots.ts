import type { MetadataRoute } from "next"
import { BUSINESS } from "@/lib/business-info"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `https://${BUSINESS.domain}/sitemap.xml`,
  }
}
