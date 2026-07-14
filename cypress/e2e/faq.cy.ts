// /faq — content + FAQPage schema. No form on this page, so no submissions.

describe("FAQ Page", () => {
  beforeEach(() => {
    cy.visit("/faq")
  })

  it("loads with the right heading", () => {
    cy.get("h1").should("contain.text", "Frequently Asked Questions")
  })

  it("shows question-phrased headings", () => {
    cy.contains("h2", "How much does lawn care cost in Covington, GA?").should("be.visible")
    cy.contains("h2", "Do you require contracts for lawn service?").should("be.visible")
    cy.contains("h2", "What's included in a property refresh?").should("be.visible")
  })

  it("has FAQPage structured data matching the visible questions", () => {
    cy.get('script[type="application/ld+json"]').should(($scripts) => {
      const combined = $scripts
        .map((_, el) => el.textContent ?? "")
        .get()
        .join("")
      expect(combined).to.include('"FAQPage"')
      expect(combined).to.include("How much does lawn care cost in Covington, GA?")
      expect(combined).to.include("acceptedAnswer")
    })
  })

  it("is reachable from the desktop nav", () => {
    cy.viewport(1280, 800)
    cy.visit("/")
    cy.get("nav").contains("a", "FAQ").click()
    cy.url().should("include", "/faq")
  })

  it("has a CTA to the quote page", () => {
    cy.contains("a", "Get a Free Estimate").should("have.attr", "href", "/quote")
  })
})
