// Client-side validation edge cases. These tests deliberately never reach the
// server: submissions are blocked by HTML5 validation, so they don't consume
// the shared 3-requests-per-15-min rate-limit budget the real submission
// tests in quote.cy.ts / contact.cy.ts depend on.

describe("Quote Quick-Lead Flow Validation", () => {
  beforeEach(() => {
    cy.visit("/quote")
    // Dev-mode hydration guard (same pattern as admin-auth / GOTCHAS #16):
    // clicking the instant the button renders can land before React hydrates
    // the client island, so the click silently does nothing.
    cy.contains("button", "Lawn Mowing").should("be.visible")
    cy.wait(800)
    // Advance to the phone step
    cy.contains("button", "Lawn Mowing").click()
    cy.contains("Step 2 of 2").should("be.visible")
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
    cy.get('input[name="phone"]').should("have.attr", "required")
    cy.get('input[name="phone"]').should("have.attr", "type", "tel")
    cy.get('input[name="phone"]').should("have.attr", "inputmode", "tel")
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
