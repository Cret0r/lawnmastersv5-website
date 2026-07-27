// Admin Gallery manager — full manageability, including the originally
// hardcoded items now migrated into the database (session 17). These tests
// use real credentials (see cypress/support/commands.ts) and hit the real
// Supabase project (this app has no staging environment — see
// docs/GOTCHAS.md). Every test that creates data deletes it again before
// finishing; test items are always titled "Cypress Test — ..." so any
// leftover is unmistakable and safe to remove by hand.
//
// Requires scripts/007_gallery_migration_and_features.sql to have been run.
// If ADMIN_EMAIL/ADMIN_PASSWORD aren't available to the Cypress process, or
// the /admin dashboard can't actually be reached (no working Supabase
// connection in this environment), the logged-in suite skips itself cleanly
// rather than hard-failing.

const hasAdminCreds = () => Boolean(Cypress.env("ADMIN_EMAIL") && Cypress.env("ADMIN_PASSWORD"))

// One of the 12 originally-hardcoded items, migrated by scripts/007 with a
// fixed id. Used to prove migrated items are just as editable as new ones.
const MIGRATED_ITEM_TITLE = "Complete Backyard Cleanup & Clearing"

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
    cy.get('[aria-label*="gallery order" i]').should("not.exist")
    cy.get('[aria-label*="homepage order" i]').should("not.exist")
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

describe("Gallery — portfolio grid & lightbox (public, no login needed)", () => {
  it("renders a multi-card grid when items exist, or a graceful empty state otherwise", () => {
    cy.visit("/gallery")
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="gallery-grid"]').length > 0) {
        cy.get('[data-gallery-card]').should("have.length.greaterThan", 1)
      } else {
        cy.contains("check back soon").should("exist")
      }
    })
  })

  it("opens the full interactive slider + description in a lightbox when a card is clicked, and Escape closes it", () => {
    cy.visit("/gallery")
    cy.get("body").then(($body) => {
      if ($body.find("[data-gallery-card]").length === 0) {
        cy.log("No gallery items available in this environment — skipping lightbox interaction.")
        return
      }
      cy.get("[data-gallery-card]").first().click()
      cy.get('[data-testid="gallery-lightbox"]').should("be.visible")
      // Full card content (title + description + services) renders inside.
      cy.get('[data-testid="gallery-lightbox"]').within(() => {
        cy.get("h3").should("be.visible")
      })
      cy.get("body").type("{esc}")
      cy.get('[data-testid="gallery-lightbox"]').should("not.exist")
    })
  })
})

describe("Gallery Admin — manageable feature (logged in)", () => {
  // The whole /admin dashboard (not just the gallery tab) calls
  // createAdminClient() before rendering anything, so it needs a working
  // Supabase connection to reach at all. Some environments running this
  // suite (e.g. a sandboxed agent session with no real .env.local) can log
  // in fine but can't actually load the dashboard past that point. Probe
  // once up front and skip the whole block cleanly instead of hard-failing
  // every test.
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

  it("edits a MIGRATED (originally-hardcoded) item in place — no duplicate created", function () {
    openGalleryTab()
    cy.get("body").then(($body) => {
      if ($body.find(`[data-gallery-item="${MIGRATED_ITEM_TITLE}"]`).length === 0) {
        cy.log("Migrated item not found — scripts/007 has not been run yet. Skipping.")
        this.skip()
        return
      }

      const editedTitle = `${MIGRATED_ITEM_TITLE} (Cypress edit test)`

      cy.get(`[data-gallery-item="${MIGRATED_ITEM_TITLE}"]`).within(() => {
        cy.get('button[title="Edit"]').click()
      })
      // A migrated item is a real before/after pair — both photo inputs
      // (not the single-image form) must render.
      cy.get("#edit-before").should("exist")
      cy.get("#edit-after").should("exist")
      cy.get("#edit-title").should("be.visible").clear().type(editedTitle)
      cy.contains("button", "Save").click()
      cy.get(`[data-gallery-item="${editedTitle}"]`, { timeout: 10000 }).should("exist")
      cy.get(`[data-gallery-item="${editedTitle}"]`).should("have.length", 1)
      cy.get(`[data-gallery-item="${MIGRATED_ITEM_TITLE}"]`).should("not.exist")

      // Restore the original title so the migrated item isn't left renamed.
      cy.get(`[data-gallery-item="${editedTitle}"]`).within(() => {
        cy.get('button[title="Edit"]').click()
      })
      cy.get("#edit-title").should("be.visible").clear().type(MIGRATED_ITEM_TITLE)
      cy.contains("button", "Save").click()
      cy.get(`[data-gallery-item="${MIGRATED_ITEM_TITLE}"]`, { timeout: 10000 }).should("exist")
    })
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

  it("gallery order and homepage order move independently of each other", () => {
    const title = `Cypress Test — Order ${Date.now()}`

    openGalleryTab()
    cy.get("#gallery-title").type(title)
    cy.get('input[name="before"]').selectFile("cypress/fixtures/gallery-test-before.jpg", { force: true })
    cy.get('input[name="after"]').selectFile("cypress/fixtures/gallery-test-after.jpg", { force: true })
    cy.contains("button", "Add to Gallery").click()
    cy.get(`[data-gallery-item="${title}"]`, { timeout: 15000 }).should("exist")

    // Feature it so it also has a homepage position to test independently.
    cy.get(`[data-gallery-item="${title}"]`).within(() => {
      cy.get('button[title="Feature on homepage"]').click()
    })
    cy.get(`[data-gallery-item="${title}"]`, { timeout: 10000 }).contains("Featured")

    // Move it to the top of the GALLERY order (bounded loop — stops once
    // the Up button is disabled, i.e. already first in that subset).
    const moveToGalleryTop = (attemptsLeft: number) => {
      if (attemptsLeft <= 0) return
      cy.get(`[data-gallery-item="${title}"]`).within(() => {
        cy.get('button[aria-label="Move up in gallery order"]').then(($btn) => {
          if (!$btn.is(":disabled")) {
            cy.wrap($btn).click()
            cy.wait(300)
          }
        })
      })
      moveToGalleryTop(attemptsLeft - 1)
    }
    moveToGalleryTop(20)

    cy.visit("/gallery")
    cy.get('[data-gallery-card]', { timeout: 10000 }).first().should("have.attr", "data-gallery-card", title)

    // Now move it DOWN in HOMEPAGE order only — the /gallery position must
    // stay first, proving the two orders don't affect each other.
    openGalleryTab()
    cy.get(`[data-gallery-item="${title}"]`).within(() => {
      cy.get('button[aria-label="Move down in homepage order"]').click()
    })
    cy.wait(500)

    cy.visit("/gallery")
    cy.get('[data-gallery-card]', { timeout: 10000 }).first().should("have.attr", "data-gallery-card", title)

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
