// Suppress known non-test errors so Cypress doesn't fail on infrastructure issues
Cypress.on("uncaught:exception", (err) => {
  // React hydration mismatch in dev mode (JSON-LD script in layout.tsx)
  if (err.message.includes("Hydration failed") || err.message.includes("hydration")) {
    return false
  }
  // Supabase not configured locally — expected in CI without env vars
  if (err.message.includes("supabaseUrl is required")) {
    return false
  }
})
