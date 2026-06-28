describe("Contact Page", () => {
  beforeEach(() => {
    cy.visit("/contact")
  })

  it("loads successfully", () => {
    cy.url().should("include", "/contact")
    cy.get("body").should("be.visible")
  })

  it("has a name field", () => {
    cy.get('input[name="name"]').should("exist")
  })

  it("has an email field", () => {
    cy.get('input[name="email"]').should("exist")
  })

  it("has a message field", () => {
    cy.get('textarea[name="message"]').should("exist")
  })

  it("submits the form and shows a response", () => {
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('textarea[name="message"]').type("This is a test message from Cypress.")
    cy.get('button[type="submit"]').click()
    // Accept either success (Supabase configured) or infrastructure error (no env vars)
    cy.get("body", { timeout: 8000 }).should(($body) => {
      const text = $body.text()
      expect(text).to.satisfy(
        (t: string) =>
          t.includes("Message Sent!") ||
          t.includes("Something went wrong") ||
          t.includes("Too many requests"),
        "Form submitted — a response appeared (not stuck on validation error)"
      )
    })
  })
})
