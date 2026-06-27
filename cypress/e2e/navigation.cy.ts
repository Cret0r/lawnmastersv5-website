describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("has a Services link that navigates correctly", () => {
    cy.contains("a", "Services").click()
    cy.url().should("include", "/services")
  })

  it("has a Gallery link that navigates correctly", () => {
    cy.visit("/")
    cy.contains("a", "Gallery").click()
    cy.url().should("include", "/gallery")
  })

  it("has an About link that navigates correctly", () => {
    cy.visit("/")
    cy.contains("a", "About").click()
    cy.url().should("include", "/about")
  })

  it("has a Contact link that navigates correctly", () => {
    cy.visit("/")
    cy.contains("a", "Contact").click()
    cy.url().should("include", "/contact")
  })

  it("has a Free Estimate link that navigates correctly", () => {
    cy.visit("/")
    cy.contains("a", "Free Estimate").click()
    cy.url().should("include", "/quote")
  })
})
