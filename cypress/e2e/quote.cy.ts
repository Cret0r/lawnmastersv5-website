describe("Quote Page", () => {
  beforeEach(() => {
    cy.visit("/quote")
  })

  it("loads successfully", () => {
    cy.url().should("include", "/quote")
    cy.get("body").should("be.visible")
  })

  it("has a first name field", () => {
    cy.get('input[name="firstName"]').should("exist")
  })

  it("has a last name field", () => {
    cy.get('input[name="lastName"]').should("exist")
  })

  it("has an email field", () => {
    cy.get('input[name="email"]').should("exist")
  })

  it("has a phone field", () => {
    cy.get('input[name="phone"]').should("exist")
  })

  it("has an address field", () => {
    cy.get('input[name="address"]').should("exist")
  })

  it("submits the form successfully with valid data", () => {
    cy.get('input[name="firstName"]').type("Test")
    cy.get('input[name="lastName"]').type("User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="phone"]').type("4076000301")
    cy.get('input[name="address"]').type("123 Test St, Covington, GA")
    cy.get('button[type="submit"]').click()
    cy.contains("success", { matchCase: false }).should("exist")
  })
})
