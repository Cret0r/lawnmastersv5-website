import { redirect } from "next/navigation"
import { isAdminAuthenticated, verifyAdminCredentials, createAdminSession } from "@/lib/admin-auth"
import Link from "next/link"
import styles from "./login.module.css"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const isAuth = await isAdminAuthenticated()
  if (isAuth) {
    redirect("/admin")
  }

  const params = await searchParams
  const error = params.error

  async function loginAction(formData: FormData) {
    "use server"
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const valid = await verifyAdminCredentials(email, password)
    if (!valid) {
      redirect("/admin/login?error=Invalid email or password")
    }

    await createAdminSession()
    redirect("/admin")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#171717",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <form action={loginAction} className={styles.form}>
        <p className={styles.heading}>🌿 Admin Portal</p>

        {error && (
          <div className={styles.errorBox}>{error}</div>
        )}

        {/* Email field */}
        <div className={styles.field}>
          <svg className={styles.inputIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <input
            type="email"
            name="email"
            className={styles.inputField}
            placeholder="Email Address"
            required
            autoComplete="email"
          />
        </div>

        {/* Password field */}
        <div className={styles.field}>
          <svg className={styles.inputIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <input
            type="password"
            name="password"
            className={styles.inputField}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Sign In + Cancel */}
        <div className={styles.btn}>
          <Link href="/" className={styles.button1}>
            Cancel
          </Link>
          <button type="submit" className={styles.button2}>
            Sign In
          </button>
        </div>

        {/* Back to website */}
        <Link href="/" className={styles.button3}>
          ← Back to Website
        </Link>
      </form>
    </div>
  )
}
