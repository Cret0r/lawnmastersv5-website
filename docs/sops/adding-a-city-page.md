# SOP: Adding a New City Landing Page

The `/lawn-care/[city]` route statically generates one page per entry in `lib/city-pages.ts`. Adding a city = adding one data object.

1. **Confirm the city is in the owner-locked service area** (`BUSINESS.cities` in `lib/business-info.ts`). Never create a page for a city outside it without owner confirmation.
2. Add an entry to the `cityPages` array in `lib/city-pages.ts`: `slug`, `city`, `title` (target "lawn care <city> ga"), `description`, `h1`, `intro`, `localAngle`, `heroImage` (existing public/ image), `neighborhoodsLine`.
   - **Copy must be city-specific, not templated** — generic filler reads as a doorway page to Google. Neighborhood hooks live in docs/BUSINESS_PLAYBOOK.md § 2 / SUMMER_CAMPAIGN_2026.md § 6 (Porterdale: budget-conscious $150 cleanup entry; Social Circle: bilingual angle; Monroe: PW + gutter convenience).
3. That's it for code — `generateStaticParams`, metadata, JSON-LD, and `app/sitemap.ts` all derive from the array.
4. Add a footer link (`components/footer.tsx`, the city-links `<p>`) for crawlability.
5. Add a test case to `cypress/e2e/city-pages.cy.ts` (extend the `cities` array — h1 must equal "Lawn Care in <City>, GA").
6. Verify locally: page 200s with correct h1, `/sitemap.xml` includes it, unknown slug still 404s.
7. Cypress suite → commit → push.
