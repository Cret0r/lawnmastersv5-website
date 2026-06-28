describe("Navigation", () => {
  beforeEach(() => {
    cy.viewport(1280, 800)
    cy.visit("/")
  })

  it("has a Services link that navigates correctly", () => {
    cy.get('a[href="/services"]').first().click({ force: true })
    cy.url().should("include", "/services")
  })

  it("has a Gallery link that navigates correctly", () => {
    cy.get('a[href="/gallery"]').first().click({ force: true })
    cy.url().should("include", "/gallery")
  })

  it("has an About link that navigates correctly", () => {
    cy.get('a[href="/about"]').first().click({ force: true })
    cy.url().should("include", "/about")
  })

  it("has a Contact link that navigates correctly", () => {
    cy.get('a[href="/contact"]').first().click({ force: true })
    cy.url().should("include", "/contact")
  })

  it("has a Free Estimate link that navigates correctly", () => {
    cy.get('a[href="/quote"]').first().click({ force: true })
    cy.url().should("include", "/quote")
  })
})
