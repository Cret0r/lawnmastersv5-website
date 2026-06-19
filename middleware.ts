import { type NextRequest, NextResponse } from "next/server"

const SESSION_TOKEN = "lm5-admin-authenticated-2026"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get("admin_session")
  const isLoggedIn = session?.value === SESSION_TOKEN

  // Protect /admin routes (but not /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Redirect to dashboard if already logged in and visiting login page
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
