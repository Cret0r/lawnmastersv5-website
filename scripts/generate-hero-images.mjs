// Generates responsive hero background variants (mobile/tablet/desktop).
// The site ships images unoptimized (next.config.mjs images.unoptimized),
// so next/image produces no srcset — these pre-sized variants are served
// via <picture> art direction in the hero sections instead.
//
// Run from the project root:  node scripts/generate-hero-images.mjs
// (sharp is available as a transitive dependency of Next.js)

import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const jobs = [
  { src: "public/hero-bg.jpg", base: "hero-bg" },
  { src: "public/hero-landscaping-lush-garden.jpg", base: "hero-garden" },
]

// Portrait crop for phones, landscape for larger screens.
const variants = [
  { suffix: "mobile", width: 828, height: 1104 },
  { suffix: "tablet", width: 1536, height: 1152 },
  { suffix: "desktop", width: 1920, height: 1080 },
]

const outDir = "public/hero"
await mkdir(outDir, { recursive: true })

for (const job of jobs) {
  for (const v of variants) {
    const out = path.join(outDir, `${job.base}-${v.suffix}.jpg`)
    const info = await sharp(job.src)
      .resize(v.width, v.height, { fit: "cover", position: "attention" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(out)
    console.log(`${out}  ${v.width}x${v.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
}
