"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Calendar,
  AlertTriangle,
  Plus,
  Phone,
  MapPin,
  Check,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Clock,
  Dog,
  Key,
} from "lucide-react"
import {
  getClients,
  getDashboardStats,
  addClient,
  updateClient,
  markServiceComplete,
  deleteClient,
  type Client,
} from "./client-actions"

export function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({ totalClients: 0, dueToday: 0, overdue: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "due" | "overdue">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isPending, startTransition] = useTransition()

  const loadData = async () => {
    const [clientsData, statsData] = await Promise.all([
      getClients(),
      getDashboardStats(),
    ])
    setClients(clientsData)
    setStats(statsData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddClient = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addClient(formData)
      if (result.success) {
        setIsAddDialogOpen(false)
        loadData()
      }
    })
  }

  const handleUpdateClient = async (formData: FormData) => {
    if (!editingClient) return
    startTransition(async () => {
      const result = await updateClient(editingClient.id, formData)
      if (result.success) {
        setEditingClient(null)
        loadData()
      }
    })
  }

  const handleMarkComplete = async (id: string) => {
    startTransition(async () => {
      await markServiceComplete(id)
      loadData()
    })
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to remove this client?")) return
    startTransition(async () => {
      await deleteClient(id)
      loadData()
    })
  }

  const today = new Date().toISOString().split("T")[0]

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm))

    if (!matchesSearch) return false

    if (filterStatus === "due") {
      return client.next_due_date === today
    }
    if (filterStatus === "overdue") {
      return client.next_due_date && client.next_due_date < today
    }
    return true
  })

  const getStatusColor = (nextDue: string | null) => {
    if (!nextDue) return "bg-muted"
    if (nextDue < today) return "bg-red-100 border-red-300 text-red-800"
    if (nextDue === today) return "bg-yellow-100 border-yellow-300 text-yellow-800"
    return "bg-green-100 border-green-300 text-green-800"
  }

  const getStatusText = (nextDue: string | null) => {
    if (!nextDue) return "Not scheduled"
    if (nextDue < today) return "Overdue"
    if (nextDue === today) return "Due Today"
    const days = Math.ceil((new Date(nextDue).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))
    return `Due in ${days} day${days > 1 ? "s" : ""}`
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${filterStatus === "due" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setFilterStatus(filterStatus === "due" ? "all" : "due")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.dueToday}</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${filterStatus === "overdue" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setFilterStatus(filterStatus === "overdue" ? "all" : "overdue")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, address, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={handleAddClient} isPending={isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Client List */}
      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {clients.length === 0
                ? "No clients yet. Add your first client to get started."
                : "No clients match your search."}
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(client.next_due_date)}`}
                      >
                        {getStatusText(client.next_due_date)}
                      </span>
                      {client.has_pets && (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800">
                          <Dog className="h-3 w-3 inline mr-1" />
                          Pets
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {client.address}
                      </span>
                      {client.phone && (
                        <a
                          href={`tel:${client.phone}`}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </a>
                      )}
                      {client.price && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${client.price}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Every {client.frequency_days} days
                      </span>
                      {client.gate_code && (
                        <span className="flex items-center gap-1">
                          <Key className="h-4 w-4" />
                          {client.gate_code}
                        </span>
                      )}
                    </div>
                    {(client.notes || client.hazards) && (
                      <div className="text-sm space-y-1 pt-2 border-t">
                        {client.notes && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Notes:</span> {client.notes}
                          </p>
                        )}
                        {client.hazards && (
                          <p className="text-red-600">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            <span className="font-medium">Hazards:</span> {client.hazards}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(client.id)}
                      disabled={isPending}
                      className="gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Done
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingClient(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClient(client.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              onSubmit={handleUpdateClient}
              isPending={isPending}
              defaultValues={editingClient}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ClientForm({
  onSubmit,
  isPending,
  defaultValues,
}: {
  onSubmit: (formData: FormData) => void
  isPending: boolean
  defaultValues?: Client
}) {
  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Client Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={defaultValues?.name}
            placeholder="John Smith"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues?.phone || ""}
            placeholder="(407) 555-1234"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email || ""}
            placeholder="john@email.com"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            required
            defaultValue={defaultValues?.address}
            placeholder="123 Main St, Covington, GA"
          />
        </div>
        <div>
          <Label htmlFor="service_type">Service Type</Label>
          <Select name="service_type" defaultValue={defaultValues?.service_type || "Full Service"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Service">Full Service</SelectItem>
              <SelectItem value="Mowing Only">Mowing Only</SelectItem>
              <SelectItem value="Lawn + Edging">Lawn + Edging</SelectItem>
              <SelectItem value="One-Time">One-Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="frequency_days">Frequency (Days)</Label>
          <Select name="frequency_days" defaultValue={String(defaultValues?.frequency_days || 14)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Weekly (7 days)</SelectItem>
              <SelectItem value="14">Bi-weekly (14 days)</SelectItem>
              <SelectItem value="21">Every 3 weeks</SelectItem>
              <SelectItem value="30">Monthly (30 days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={defaultValues?.price || ""}
            placeholder="45.00"
          />
        </div>
        <div>
          <Label htmlFor="gate_code">Gate Code</Label>
          <Input
            id="gate_code"
            name="gate_code"
            defaultValue={defaultValues?.gate_code || ""}
            placeholder="1234#"
          />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="has_pets"
            name="has_pets"
            value="true"
            defaultChecked={defaultValues?.has_pets}
            className="rounded border-gray-300"
          />
          <Label htmlFor="has_pets" className="font-normal">
            Property has pets (dogs, etc.)
          </Label>
        </div>
        <div className="col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={defaultValues?.notes || ""}
            placeholder="Special instructions, preferences, etc."
            rows={2}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="hazards" className="text-red-600">
            Hazards / Warnings
          </Label>
          <Textarea
            id="hazards"
            name="hazards"
            defaultValue={defaultValues?.hazards || ""}
            placeholder="Low branches, sprinkler heads, aggressive dog, etc."
            rows={2}
            className="border-red-200 focus:border-red-400"
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : defaultValues ? "Update Client" : "Add Client"}
      </Button>
    </form>
  )
}
