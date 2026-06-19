"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Map,
  Navigation,
  Search,
  X,
  MapPin,
  Clock,
  AlertTriangle,
  Dog,
  ExternalLink,
  RotateCcw,
} from "lucide-react"
import { getClients, updateClientCoordinates, type Client } from "./client-actions"
import dynamic from "next/dynamic"

// Dynamically import the map to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import("./route-map").then((mod) => mod.RouteMap), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Map className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

export function RoutePlannerTab() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [filterDue, setFilterDue] = useState(false)

  const loadClients = async () => {
    const data = await getClients()
    setClients(data)
  }

  useEffect(() => {
    loadClients()
  }, [])

  const today = new Date().toISOString().split("T")[0]

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filterDue) {
      return client.next_due_date && client.next_due_date <= today
    }
    return true
  })

  const mappedClients = clients.filter((c) => c.latitude && c.longitude)
  const selectedClientData = clients.filter((c) => selectedClients.includes(c.id))

  const toggleClientSelection = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const clearRoute = () => {
    setSelectedClients([])
  }

  const openInGoogleMaps = () => {
    if (selectedClientData.length === 0) return

    const waypoints = selectedClientData
      .filter((c) => c.latitude && c.longitude)
      .map((c) => `${c.latitude},${c.longitude}`)
      .join("/")

    const url = `https://www.google.com/maps/dir/${waypoints}`
    window.open(url, "_blank")
  }

  const getStatusColor = (nextDue: string | null) => {
    if (!nextDue) return "bg-muted"
    if (nextDue < today) return "bg-red-500"
    if (nextDue === today) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleGeocodeClient = async (clientId: string, lat: number, lng: number) => {
    await updateClientCoordinates(clientId, lat, lng)
    loadClients()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Client List Panel */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <Card className="flex-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Route Planner</span>
              <span className="text-xs font-normal text-muted-foreground">
                {mappedClients.length} mapped / {clients.length} total
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterDue ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDue(!filterDue)}
                className="text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                Due Today/Overdue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Route */}
        {selectedClients.length > 0 && (
          <Card className="flex-none border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  Route ({selectedClients.length} stops)
                </span>
                <Button variant="ghost" size="sm" onClick={clearRoute} className="h-6 px-2">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedClientData.map((client, index) => (
                <div
                  key={client.id}
                  className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded"
                >
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate">{client.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleClientSelection(client.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={openInGoogleMaps}
                className="w-full mt-2 gap-2"
                disabled={selectedClientData.filter((c) => c.latitude).length === 0}
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Client List */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                {clients.length === 0
                  ? "No clients yet. Add clients in the Clients tab."
                  : "No clients match your filters."}
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const isSelected = selectedClients.includes(client.id)
              const selectionIndex = selectedClients.indexOf(client.id)

              return (
                <Card
                  key={client.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => toggleClientSelection(client.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium flex-shrink-0">
                          {selectionIndex + 1}
                        </span>
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${getStatusColor(client.next_due_date)}`}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{client.name}</span>
                          {client.has_pets && (
                            <Dog className="h-3 w-3 text-orange-500 flex-shrink-0" />
                          )}
                          {client.hazards && (
                            <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          )}
                          {!client.latitude && (
                            <span className="text-xs text-muted-foreground">(not mapped)</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {client.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Map Panel */}
      <Card className="lg:col-span-2 overflow-hidden">
        <CardContent className="p-0 h-full">
          <RouteMap
            clients={mappedClients}
            selectedClientIds={selectedClients}
            onClientSelect={toggleClientSelection}
            onGeocodeClient={handleGeocodeClient}
          />
        </CardContent>
      </Card>
    </div>
  )
}
