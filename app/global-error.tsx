"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"
import { BUSINESS } from "@/lib/business-info"

// Root error boundary — catches render errors anywhere in the app,
// reports them to Sentry, and shows a branded fallback.
// Must render its own <html>/<body> because it replaces the root layout.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f7f3",
          color: "#2a2520",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#7a7673", marginBottom: "1.5rem" }}>
            Sorry about that. Please try again, or call us at{" "}
            <a href={BUSINESS.telHref} style={{ color: "#2d7a3a" }}>
              {BUSINESS.phoneDisplay}
            </a>
            .
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#2d7a3a",
              color: "#fefefe",
              border: "none",
              borderRadius: "0.625rem",
              padding: "0.6rem 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
