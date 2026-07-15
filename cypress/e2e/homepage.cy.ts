describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("loads successfully", () => {
    cy.url().should("include", "/")
    cy.get("body").should("be.visible")
  })

  it("displays the transformation-first hero", () => {
    cy.contains("We Transform Properties").should("be.visible")
    cy.contains("From Overgrown to Impressive").should("be.visible")
  })

  it("shows the refresh tiers with maintenance demoted below", () => {
    cy.contains("Full Property Refresh").should("exist")
    cy.contains("Curb Appeal Refresh").should("exist")
    cy.contains("Total Transformation").should("exist")
    cy.contains("Recurring maintenance routes are available after your refresh").should("exist")
  })

  it("has a Call Now button", () => {
    cy.contains("Call Now").should("exist")
  })

  it("has a Text Now button", () => {
    cy.contains("Text Now").should("exist")
  })
})
