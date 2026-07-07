# SOP: Swapping Hero Background Images

Context: `images.unoptimized` is on, so next/image makes no srcset. Heroes use pre-generated variants + `<picture>` art direction (ARCHITECTURE.md § 6).

1. Drop the new source image into `public/` (keep or update the existing filename; sources currently: `hero-bg.jpg` → homepage, `hero-landscaping-lush-garden.jpg` → /summer + demoted homepage section).
2. If the filename changed, update the `jobs` array in `scripts/generate-hero-images.mjs`.
3. Run: `node scripts/generate-hero-images.mjs` — outputs `public/hero/{base}-{mobile,tablet,desktop}.jpg` (828×1104 / 1536×1152 / 1920×1080, quality 72 mozjpeg, "attention" smart-crop). Check the printed sizes (expect ~100–260 KB each).
4. Eyeball the mobile portrait crop — "attention" cropping occasionally picks an odd focus; change `position` in the script to `"centre"` if so and re-run.
5. The `<picture>` markup in `app/page.tsx` / `app/summer/page.tsx` references the variant paths — only touch it if the base name changed.
6. Commit the regenerated `public/hero/` files together with any source change.
7. Cypress + push as usual.

New hero on a new page? Copy the `<picture>` pattern from `app/page.tsx` (two `<source media>` + default img with `fetchPriority="high"`), never a bare 2 MB `<Image fill>`.
