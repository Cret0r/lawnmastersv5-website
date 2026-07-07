// Per-city SEO landing pages (/lawn-care/[city]).

describe("City Landing Pages", () => {
  const cities = [
    { slug: "covington", name: "Covington" },
    { slug: "conyers", name: "Conyers" },
    { slug: "oxford", name: "Oxford" },
  ]

  for (const city of cities) {
    it(`loads /lawn-care/${city.slug} with the right heading`, () => {
      cy.visit(`/lawn-care/${city.slug}`)
      cy.get("h1").should("contain.text", `Lawn Care in ${city.name}, GA`)
      cy.get('script[type="application/ld+json"]').should("exist")
    })
  }

  it("returns 404 for a city outside the service area", () => {
    cy.request({ url: "/lawn-care/atlanta", failOnStatusCode: false })
      .its("status")
      .should("eq", 404)
  })

  it("has call and quote CTAs on a city page", () => {
    cy.visit("/lawn-care/covington")
    cy.get('a[href^="tel:"]').should("exist")
    cy.get('a[href="/quote"]').should("exist")
  })
})
