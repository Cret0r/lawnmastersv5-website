// Admin auth edge cases — complements the smoke tests in admin.cy.ts.

describe("Admin Auth Edge Cases", () => {
  it("rejects wrong credentials and stays on the login page", () => {
    cy.visit("/admin/login")
    // Dev-mode hydration recovery replaces the form DOM shortly after load,
    // detaching inputs mid-type. Wait for the recovery re-render to settle
    // before interacting (no clean readiness signal exists for this).
    cy.get('input[name="email"]').should("be.visible")
    cy.wait(1500)
    cy.get('input[name="email"]').should("be.enabled").type("wrong@example.com")
    cy.get('input[name="password"]').should("be.enabled").type("definitely-not-the-password")
    cy.get('button[type="submit"]').click()
    // Login action redirects back to the login page with an error param
    cy.url({ timeout: 8000 }).should("include", "/admin/login")
    cy.url().should("include", "error")
  })

  it("rejects a forged session cookie", () => {
    cy.setCookie("admin_session", "forged-token-value")
    cy.visit("/admin")
    cy.url().should("include", "/admin/login")
  })

  it("masks the password input", () => {
    cy.visit("/admin/login")
    cy.get('input[name="password"]').should("have.attr", "type", "password")
  })
})
