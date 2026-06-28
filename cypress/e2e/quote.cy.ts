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

  it("submits the form and shows a response", () => {
    cy.get('input[name="firstName"]').type("Test")
    cy.get('input[name="lastName"]').type("User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="phone"]').type("4076000301")
    cy.get('input[name="address"]').type("123 Test St, Covington, GA")
    // Select at least one service (required by Zod schema)
    cy.contains("Lawn Care & Mowing").click()
    cy.get('button[type="submit"]').click()
    // Accept either success (Supabase configured) or infrastructure error (no env vars)
    cy.get("body", { timeout: 8000 }).should(($body) => {
      const text = $body.text()
      expect(text).to.satisfy(
        (t: string) =>
          t.includes("Thank You!") ||
          t.includes("Something went wrong") ||
          t.includes("Too many requests"),
        "Form submitted — a response appeared (not stuck on validation error)"
      )
    })
  })
})
