import { defineConfig } from "cypress"
import dotenv from "dotenv"

// Cypress runs as its own Node process — unlike `next dev`, it does not read
// .env.local automatically. Load it here so cy.loginAsAdmin() can fill the
// real login form (values never printed/logged, only used to type into the
// form fields).
dotenv.config({ path: ".env.local" })

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      config.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL
      config.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
      return config
    },
  },
})
