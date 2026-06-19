import { redirect } from "next/navigation"
import { isAdminAuthenticated, verifyAdminCredentials, createAdminSession } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-serif text-foreground">
                Lawn Masters V5
              </span>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Admin Portal</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in to manage quote submissions
            </p>
          </div>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <form action={loginAction} className="flex flex-col gap-5">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-foreground text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@test.com"
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-foreground text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="bg-background border-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-1"
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
