// Logs into /admin as the real admin account using credentials pulled into
// Cypress.env() from .env.local (see cypress.config.ts). Used by tests that
// need to exercise real admin features (e.g. the gallery manager) rather
// than just the auth boundary. Skips (test passes trivially) if credentials
// aren't available, so the suite doesn't hard-fail in an environment without
// them — see docs/GOTCHAS.md.
Cypress.Commands.add("loginAsAdmin", () => {
  const email = Cypress.env("ADMIN_EMAIL")
  const password = Cypress.env("ADMIN_PASSWORD")

  cy.visit("/admin/login")
  cy.get('input[name="email"]').should("be.visible")
  cy.wait(1500) // dev-mode hydration recovery re-render (see admin-auth.cy.ts)
  cy.get('input[name="email"]').should("be.enabled").type(email, { log: false })
  cy.get('input[name="password"]').should("be.enabled").type(password, { log: false })
  cy.get('button[type="submit"]').click()
  cy.url({ timeout: 8000 }).should("not.include", "/admin/login")
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>
    }
  }
}

export {}
