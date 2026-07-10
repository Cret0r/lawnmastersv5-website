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

describe("Contact Quick-Lead Flow Validation", () => {
  beforeEach(() => {
    cy.visit("/contact")
    // Advance to the phone step
    cy.contains("button", "Lawn Mowing").click()
  })

  it("blocks submission when the phone is empty", () => {
    cy.get('button[type="submit"]').click()
    cy.get('input[name="phone"]:invalid').should("exist")
    cy.contains("Got it!").should("not.exist")
  })

  it("blocks a too-short phone number", () => {
    cy.get('input[name="phone"]').type("123")
    cy.get('button[type="submit"]').click()
    cy.get('input[name="phone"]:invalid').should("exist")
    cy.contains("Got it!").should("not.exist")
  })

  it("phone input is required and uses the tel keyboard", () => {
    // Separate assertions — after have.attr the subject becomes the attr
    // value, so chaining .and("have.attr", ...) breaks.
    cy.get('input[name="phone"]').should("have.attr", "required")
    cy.get('input[name="phone"]').should("have.attr", "type", "tel")
    cy.get('input[name="phone"]').should("have.attr", "inputmode", "tel")
  })
})
