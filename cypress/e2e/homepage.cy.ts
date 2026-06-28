describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("loads successfully", () => {
    cy.url().should("include", "/")
    cy.get("body").should("be.visible")
  })

  it("displays hero text", () => {
    cy.contains("Secure Your Spot").should("be.visible")
  })

  it("has a Call Now button", () => {
    cy.contains("Call Now").should("exist")
  })

  it("has a Text Now button", () => {
    cy.contains("Text Now").should("exist")
  })
})
