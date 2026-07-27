import { createAdminClient } from "@/lib/supabase/admin"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Mail, Phone, MapPin, Inbox, MessageSquareOff } from "lucide-react"
import { SubmissionActions } from "./submission-actions"
import { MessageActions } from "./message-actions"
import { SignOutButton } from "./sign-out-button"
import { AdminTabs } from "./admin-tabs"

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  quoted: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
}

const serviceLabels: Record<string, string> = {
  "lawn-care": "Lawn Care",
  "landscape-design": "Landscape Design",
  "tree-shrub": "Tree & Shrub",
  hardscaping: "Hardscaping",
  irrigation: "Irrigation",
  seasonal: "Seasonal Cleanup",
  "pressure-washing": "Pressure Washing",
}

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect("/admin/login")
  }

  const adminClient = createAdminClient()

  const [quotesResult, messagesResult] = await Promise.all([
    adminClient
      .from("quote_submissions")
      .select("*")
      .order("created_at", { ascending: false }),
    adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false }),
  ])

  const submissions = quotesResult.data || []
  const messages = messagesResult.data || []
  const newQuoteCount = submissions.filter((s) => s.status === "new").length
  const unreadMsgCount = messages.filter((m) => !m.read).length

  const quotesContent = (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Quote Requests Yet</h2>
            <p className="text-sm text-muted-foreground">
              When customers submit quote requests, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.id} className="bg-card border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {submission.first_name} {submission.last_name}
                    </h3>
                    <Badge className={`text-xs ${statusColors[submission.status] || "bg-secondary text-muted-foreground"}`}>
                      {submission.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {submission.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {submission.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(submission.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {submission.address && (
                <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{submission.address}</span>
                </div>
              )}

              {submission.services && submission.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {submission.services.map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-xs font-normal">
                      {serviceLabels[s] || s}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                {submission.property_type && (
                  <span>Type: <span className="text-foreground capitalize">{submission.property_type}</span></span>
                )}
                {submission.property_size && (
                  <span>Size: <span className="text-foreground capitalize">{submission.property_size}</span></span>
                )}
                {submission.timeline && (
                  <span>Timeline: <span className="text-foreground capitalize">{submission.timeline}</span></span>
                )}
              </div>

              {submission.details && (
                <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-4">
                  {submission.details}
                </p>
              )}

              <SubmissionActions id={submission.id} currentStatus={submission.status} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  const messagesContent = (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareOff className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Messages Yet</h2>
            <p className="text-sm text-muted-foreground">
              When customers send messages from the contact page, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        messages.map((msg) => (
          <Card
            key={msg.id}
            className={`bg-card border-border hover:border-primary/20 transition-colors ${!msg.read ? "border-l-4 border-l-primary" : ""}`}
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{msg.name}</h3>
                    {!msg.read && (
                      <Badge className="bg-primary/10 text-primary text-xs">New</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(msg.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {msg.subject && (
                <p className="text-sm font-medium text-foreground mb-2">
                  Subject: {msg.subject}
                </p>
              )}

              <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-4">
                {msg.message}
              </p>

              <MessageActions id={msg.id} isRead={msg.read} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-2 inline-block">
                  Dashboard
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif text-foreground">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                {newQuoteCount > 0 && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-xs text-primary font-medium">
                    {newQuoteCount} new quote{newQuoteCount > 1 ? "s" : ""}
                  </div>
                )}
                {unreadMsgCount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium">
                    {unreadMsgCount} unread msg{unreadMsgCount > 1 ? "s" : ""}
                  </div>
                )}
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AdminTabs
              quoteCount={newQuoteCount}
              messageCount={unreadMsgCount}
              quotesContent={quotesContent}
              messagesContent={messagesContent}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
