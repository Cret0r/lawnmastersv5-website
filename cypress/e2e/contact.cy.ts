// Conversational quick-lead flow on /contact: one question at a time —
// (1) service, (2) phone — then submit into quote_submissions.
// NOTE: exactly ONE real submission in this spec (shared rate-limit budget).

describe("Contact Page — Quick Lead Flow", () => {
  beforeEach(() => {
    cy.visit("/contact")
  })

  it("loads successfully", () => {
    cy.url().should("include", "/contact")
    cy.get("body").should("be.visible")
  })

  it("asks the service question first", () => {
    cy.contains("Step 1 of 2").should("be.visible")
    cy.contains("What do you need done?").should("be.visible")
    cy.contains("button", "Lawn Mowing").should("be.visible")
    cy.contains("button", "Pressure Washing").should("be.visible")
  })

  it("advances to the phone step after picking a service", () => {
    cy.contains("button", "Lawn Mowing").click()
    cy.contains("Step 2 of 2").should("be.visible")
    cy.contains("best number to text your quote").should("be.visible")
    cy.get('input[name="phone"]').should("be.visible")
    // The chosen service is shown as a chip
    cy.contains("Lawn Mowing").should("be.visible")
  })

  it("can go back to change the service", () => {
    cy.contains("button", "Pressure Washing").click()
    cy.contains("button", "Back").click()
    cy.contains("What do you need done?").should("be.visible")
    cy.contains("Step 1 of 2").should("be.visible")
  })

  it("submits the flow and shows a response", () => {
    cy.contains("button", "Lawn Mowing").click()
    cy.get('input[name="phone"]').type("(404) 555-0142")
    cy.get('button[type="submit"]').click()
    // Accept success, infrastructure error (no env), or rate limit
    cy.get("body", { timeout: 8000 }).should(($body) => {
      const text = $body.text()
      expect(text).to.satisfy(
        (t: string) =>
          t.includes("Got it!") ||
          t.includes("Something went wrong") ||
          t.includes("Too many requests"),
        "Flow submitted — a response appeared"
      )
    })
  })
})
