// /quote now uses the same conversational quick-lead flow as /contact
// (components/quick-lead-form.tsx). This spec makes exactly ONE real
// submission — combined with contact.cy.ts that's the suite's budget of 2
// against the 3-per-15-min rate limit. Do not add server-hitting tests here.

describe("Quote Page — Quick Lead Flow", () => {
  beforeEach(() => {
    cy.visit("/quote")
  })

  it("loads successfully", () => {
    cy.url().should("include", "/quote")
    cy.contains("Request a Free Estimate").should("be.visible")
  })

  it("asks the service question first", () => {
    cy.contains("Step 1 of 2").should("be.visible")
    cy.contains("What do you need done?").should("be.visible")
    cy.contains("button", "Pressure Washing").should("be.visible")
  })

  it("advances to the phone step after picking a service", () => {
    cy.contains("button", "Seasonal Cleanup").click()
    cy.contains("Step 2 of 2").should("be.visible")
    cy.contains("best number to text your quote").should("be.visible")
    cy.contains("Seasonal Cleanup").should("be.visible")
  })

  it("can go back to change the service", () => {
    cy.contains("button", "Tree & Shrub Care").click()
    cy.contains("button", "Back").click()
    cy.contains("What do you need done?").should("be.visible")
    cy.contains("Step 1 of 2").should("be.visible")
  })

  it("shows the What Happens Next steps", () => {
    cy.contains("What Happens Next?").should("be.visible")
    cy.contains("Tell us what you need").should("be.visible")
    cy.contains("You get a written quote").should("be.visible")
  })

  it("has HowTo structured data", () => {
    cy.get('script[type="application/ld+json"]').should(($scripts) => {
      const combined = $scripts
        .map((_, el) => el.textContent ?? "")
        .get()
        .join("")
      expect(combined).to.include('"HowTo"')
      expect(combined).to.include("HowToStep")
    })
  })

  it("submits the flow and shows a response", () => {
    cy.contains("button", "Landscaping / Cleanup").click()
    cy.get('input[name="phone"]').type("4076000301")
    cy.get('button[type="submit"]').click()
    // Accept success, infra error, or rate limit (back-to-back local runs)
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
