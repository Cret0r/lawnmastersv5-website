"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ClipboardList, MessageSquare, Users } from "lucide-react"
import { ClientsTab } from "./clients-tab"

export function AdminTabs({
  quoteCount,
  messageCount,
  quotesContent,
  messagesContent,
}: {
  quoteCount: number
  messageCount: number
  quotesContent: React.ReactNode
  messagesContent: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState<"clients" | "quotes" | "messages">("clients")

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === "clients" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("clients")}
          className={activeTab === "clients" ? "" : "bg-transparent"}
        >
          <Users className="w-4 h-4 mr-2" />
          Clients
        </Button>
        <Button
          variant={activeTab === "quotes" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("quotes")}
          className={activeTab === "quotes" ? "" : "bg-transparent"}
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          Quote Requests
          {quoteCount > 0 && (
            <span className="ml-2 bg-primary-foreground/20 text-xs px-1.5 py-0.5 rounded-full">
              {quoteCount}
            </span>
          )}
        </Button>
        <Button
          variant={activeTab === "messages" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("messages")}
          className={activeTab === "messages" ? "" : "bg-transparent"}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Messages
          {messageCount > 0 && (
            <span className="ml-2 bg-primary-foreground/20 text-xs px-1.5 py-0.5 rounded-full">
              {messageCount}
            </span>
          )}
        </Button>
      </div>

      {activeTab === "clients" && <ClientsTab />}
      {activeTab === "quotes" && quotesContent}
      {activeTab === "messages" && messagesContent}
    </>
  )
}
