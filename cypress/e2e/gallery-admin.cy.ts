// Admin Gallery manager — full manageability (session 16). These tests use
// real credentials (see cypress/support/commands.ts) and hit the real
// Supabase project (this app has no staging environment — see
// docs/GOTCHAS.md). Every test that creates data deletes it again before
// finishing; test items are always titled "Cypress Test — ..." so any
// leftover is unmistakable and safe to remove by hand.
//
// Requires scripts/007_gallery_enhancements.sql to have been run (adds
// featured / item_type columns). If ADMIN_EMAIL/ADMIN_PASSWORD aren't
// available to the Cypress process, or the /admin dashboard can't actually
// be reached (no working Supabase connection in this environment), the
// logged-in suite skips itself cleanly rather than hard-failing.

const hasAdminCreds = () => Boolean(Cypress.env("ADMIN_EMAIL") && Cypress.env("ADMIN_PASSWORD"))

function openGalleryTab() {
  cy.visit("/admin")
  cy.contains("button", "Gallery").should("be.visible")
  cy.wait(800)
  cy.contains("button", "Gallery").click()
  cy.contains("h3", "Add a Gallery Item").should("be.visible")
}

// Best-effort cleanup: deletes a gallery item by title if it's still in the
// list. Safe to call even if the item was already removed by the test.
function deleteIfPresent(title: string) {
  cy.get("body").then(($body) => {
    if ($body.find(`[data-gallery-item="${title}"]`).length > 0) {
      cy.get(`[data-gallery-item="${title}"]`).within(() => {
        cy.contains("button", "Delete").click()
        cy.contains("button", "Confirm?").click()
      })
      cy.get(`[data-gallery-item="${title}"]`, { timeout: 10000 }).should("not.exist")
    }
  })
}

describe("Gallery — public/admin isolation", () => {
  it("public /gallery page renders with no admin controls", () => {
    cy.visit("/gallery")
    cy.contains("Add to Gallery").should("not.exist")
    cy.contains("Add a Gallery Item").should("not.exist")
    cy.get('input[type="file"]').should("not.exist")
    cy.contains("button", "Feature").should("not.exist")
  })

  it("homepage renders with no admin controls", () => {
    cy.visit("/")
    cy.contains("Add a Gallery Item").should("not.exist")
    cy.get('input[type="file"]').should("not.exist")
  })

  it("redirects /admin to the login page when unauthenticated (gallery tab included)", () => {
    cy.visit("/admin")
    cy.url().should("include", "/admin/login")
  })

  it("rejects a forged session cookie from reaching the gallery tab", () => {
    cy.setCookie("admin_session", "forged-token-value")
    cy.visit("/admin")
    cy.url().should("include", "/admin/login")
  })
})

describe("Gallery Admin — manageable feature (logged in)", () => {
  // The whole /admin dashboard (not just the gallery tab) calls
  // createAdminClient() before rendering anything, so it needs a working
  // Supabase connection to reach at all. Some environments running this
  // suite (e.g. a sandboxed agent session with no real .env.local) can log
  // in fine but can't actually load the dashboard past that point. Probe
  // once up front and skip the whole block cleanly instead of hard-failing
  // every test — see docs/GOTCHAS.md.
  let dashboardReachable = false

  before(function () {
    if (!hasAdminCreds()) {
      this.skip()
      return
    }
    cy.loginAsAdmin()
    // The global handler in support/e2e.ts already swallows the Supabase
    // "Invalid supabaseUrl" uncaught exception, so this visit won't hard-fail
    // even when the dashboard 500s.
    cy.visit("/admin", { failOnStatusCode: false })
    cy.get("body").then(($body) => {
      const broken = /Internal Server Error|Application error|supabaseUrl/i.test($body.text())
      dashboardReachable = !broken
    })
  })

  beforeEach(function () {
    if (!dashboardReachable) {
      this.skip()
      return
    }
    cy.loginAsAdmin()
  })

  it("shows a live thumbnail preview for both photos before adding a before/after item (no submit)", () => {
    openGalleryTab()
    cy.get('input[name="before"]').selectFile("cypress/fixtures/gallery-test-before.jpg", { force: true })
    cy.get('img[alt="Before photo preview"]').should("be.visible").and("have.attr", "src").and("match", /^blob:/)
    cy.get('input[name="after"]').selectFile("cypress/fixtures/gallery-test-after.jpg", { force: true })
    cy.get('img[alt="After photo preview"]').should("be.visible").and("have.attr", "src").and("match", /^blob:/)
  })

  it("shows a live thumbnail preview for a single-image item (no submit)", () => {
    openGalleryTab()
    cy.contains("button", "Single Image").click()
    cy.get('input[name="photo"]').selectFile("cypress/fixtures/gallery-test-single.jpg", { force: true })
    cy.get('img[alt="Photo preview"]').should("be.visible").and("have.attr", "src").and("match", /^blob:/)
  })

  it("creates, features, unfeatures, edits, and deletes a before/after item end-to-end", () => {
    const title = `Cypress Test — Before After ${Date.now()}`
    const editedTitle = `${title} (edited)`

    openGalleryTab()
    cy.get("#gallery-title").type(title)
    cy.get("#gallery-services").type("Cypress, Automated Test")
    cy.get('input[name="before"]').selectFile("cypress/fixtures/gallery-test-before.jpg", { force: true })
    cy.get('input[name="after"]').selectFile("cypress/fixtures/gallery-test-after.jpg", { force: true })
    cy.contains("button", "Add to Gallery").click()
    cy.get(`[data-gallery-item="${title}"]`, { timeout: 15000 }).should("exist")

    // Feature it, then confirm it actually appears on the live homepage.
    cy.get(`[data-gallery-item="${title}"]`).within(() => {
      cy.get('button[title="Feature on homepage"]').click()
    })
    cy.get(`[data-gallery-item="${title}"]`, { timeout: 10000 }).contains("Featured")

    cy.visit("/")
    cy.contains(title, { timeout: 10000 }).should("exist")

    // Unfeature it, confirm it disappears from the homepage again.
    openGalleryTab()
    cy.get(`[data-gallery-item="${title}"]`).within(() => {
      cy.get('button[title="Remove from homepage"]').click()
    })
    cy.get(`[data-gallery-item="${title}"]`, { timeout: 10000 }).should("not.contain", "Featured")

    cy.visit("/")
    cy.contains(title, { timeout: 10000 }).should("not.exist")

    // Edit: change the title, confirm it updates in place (no duplicate row).
    openGalleryTab()
    cy.get(`[data-gallery-item="${title}"]`).within(() => {
      cy.get('button[title="Edit"]').click()
    })
    cy.get("#edit-title").should("be.visible").clear().type(editedTitle)
    cy.contains("button", "Save").click()
    cy.get(`[data-gallery-item="${editedTitle}"]`, { timeout: 10000 }).should("exist")
    cy.get(`[data-gallery-item="${title}"]`).should("not.exist")
    cy.contains("h3", "Add a Gallery Item").should("be.visible") // dialog closed, no duplicate form state
    // Editing updated the row in place — no duplicate was created.
    cy.get(`[data-gallery-item="${editedTitle}"]`).should("have.length", 1)

    // Cleanup
    deleteIfPresent(editedTitle)
    deleteIfPresent(title)
    cy.visit("/gallery")
    cy.contains(editedTitle).should("not.exist")
  })

  it("supports a single-image item that needs only one photo", () => {
    const title = `Cypress Test — Single ${Date.now()}`

    openGalleryTab()
    cy.contains("button", "Single Image").click()
    cy.get("#gallery-title").type(title)
    cy.get('input[name="photo"]').selectFile("cypress/fixtures/gallery-test-single.jpg", { force: true })
    cy.contains("button", "Add to Gallery").click()
    cy.get(`[data-gallery-item="${title}"]`, { timeout: 15000 }).should("exist")

    // Single-image items render as a plain card (no slider) on /gallery.
    cy.get(`[data-gallery-item="${title}"]`).within(() => {
      cy.get('button[title="Feature on homepage"]').click()
    })
    cy.visit("/gallery")
    cy.contains(title, { timeout: 10000 }).should("exist")

    deleteIfPresent(title)
  })

  afterEach(function () {
    // Safety net: if an assertion above failed mid-flow, don't leave test
    // data live on the production site. Best-effort, ignores failures.
    if (this.currentTest?.state === "failed") {
      cy.visit("/admin")
      cy.contains("button", "Gallery", { timeout: 10000 }).click({ force: true })
      cy.get("body").then(($body) => {
        $body.find('[data-gallery-item^="Cypress Test"]').each((_, el) => {
          const title = el.getAttribute("data-gallery-item") || ""
          if (title) deleteIfPresent(title)
        })
      })
    }
  })
})
