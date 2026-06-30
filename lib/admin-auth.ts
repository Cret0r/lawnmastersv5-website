import { cookies } from "next/headers"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ""
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ""
const SESSION_COOKIE = "admin_session"
const SESSION_TOKEN = process.env.SESSION_TOKEN ?? ""

export async function verifyAdminCredentials(email: string, password: string) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export async function createAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value === SESSION_TOKEN
}
