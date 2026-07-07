// Mobile navigation — hamburger menu, drawer, and mobile CTA bar.

describe("Mobile Navigation", () => {
  beforeEach(() => {
    cy.viewport("iphone-x")
    // No announcement-bar workaround: the nav offsets itself below the
    // bar via --announcement-height, so the hamburger must be clickable
    // even while the bar is showing.
    cy.visit("/")
  })

  it("shows the hamburger button on mobile, collapsed by default", () => {
    cy.get('button[aria-label="Toggle menu"]')
      .should("be.visible")
      .and("have.attr", "aria-expanded", "false")
  })

  it("opens the drawer and exposes nav links", () => {
    cy.get('button[aria-label="Toggle menu"]').click()
    cy.get('button[aria-label="Toggle menu"]').should("have.attr", "aria-expanded", "true")
    cy.get("#mobile-menu").contains("Services").should("be.visible")
    cy.get("#mobile-menu").contains("Gallery").should("be.visible")
    cy.get("#mobile-menu").contains("Free Estimate").should("be.visible")
  })

  it("navigates from a drawer link", () => {
    cy.get('button[aria-label="Toggle menu"]').click()
    cy.get("#mobile-menu").contains("Services").click()
    cy.url().should("include", "/services")
  })

  it("closes the drawer when tapping outside it", () => {
    cy.get('button[aria-label="Toggle menu"]').click()
    cy.get('button[aria-label="Toggle menu"]').should("have.attr", "aria-expanded", "true")
    // The full-screen overlay sits above the header while the drawer is
    // open — tapping it (outside the drawer) is the real close gesture.
    cy.get('div[aria-hidden="true"].md\\:hidden').click(20, 300)
    cy.get('button[aria-label="Toggle menu"]').should("have.attr", "aria-expanded", "false")
  })

  it("shows the floating call/text bar on mobile", () => {
    cy.contains("a", "Call Now").should("be.visible")
    cy.contains("a", "Text Now").should("be.visible")
  })
})
