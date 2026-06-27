describe("Admin Portal", () => {
  it("redirects /admin to /admin/login when not authenticated", () => {
    cy.visit("/admin")
    cy.url().should("include", "/admin/login")
  })

  it("shows the login form on /admin/login", () => {
    cy.visit("/admin/login")
    cy.get("form").should("exist")
  })

  it("has a username input", () => {
    cy.visit("/admin/login")
    cy.get('input[name="email"]').should("exist")
  })

  it("has a password input", () => {
    cy.visit("/admin/login")
    cy.get('input[name="password"]').should("exist")
  })

  it("has a submit button", () => {
    cy.visit("/admin/login")
    cy.get('button[type="submit"]').should("exist")
  })
})
