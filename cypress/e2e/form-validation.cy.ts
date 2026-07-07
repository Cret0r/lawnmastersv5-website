// Client-side validation edge cases. These tests deliberately never reach the
// server: submissions are blocked by HTML5 validation, so they don't consume
// the shared 3-requests-per-15-min rate-limit budget the real submission
// tests in quote.cy.ts / contact.cy.ts depend on.

describe("Quote Form Validation", () => {
  beforeEach(() => {
    cy.visit("/quote")
  })

  it("blocks submission when required fields are empty", () => {
    cy.get('button[type="submit"]').click()
    cy.get("input:invalid").should("have.length.at.least", 1)
    cy.url().should("include", "/quote")
    cy.contains("Thank You!").should("not.exist")
  })

  it("flags a malformed email address", () => {
    cy.get('input[name="email"]').type("not-an-email")
    cy.get('button[type="submit"]').click()
    cy.get('input[name="email"]:invalid').should("exist")
    cy.contains("Thank You!").should("not.exist")
  })

  it("requires first name, last name, email, phone, and address", () => {
    for (const name of ["firstName", "lastName", "email", "phone", "address"]) {
      cy.get(`input[name="${name}"]`).should("have.attr", "required")
    }
  })
})

describe("Contact Form Validation", () => {
  beforeEach(() => {
    cy.visit("/contact")
  })

  it("blocks submission when required fields are empty", () => {
    cy.get('button[type="submit"]').click()
    cy.get(":invalid").should("have.length.at.least", 1)
    cy.url().should("include", "/contact")
    cy.contains("Message Sent!").should("not.exist")
  })

  it("flags a malformed email address", () => {
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("missing-at-sign.com")
    cy.get('textarea[name="message"]').type("A long enough test message.")
    cy.get('button[type="submit"]').click()
    cy.get('input[name="email"]:invalid').should("exist")
    cy.contains("Message Sent!").should("not.exist")
  })

  it("requires the message field", () => {
    cy.get('textarea[name="message"]').should("have.attr", "required")
  })
})
