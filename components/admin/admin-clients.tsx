"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  MoreVertical, 
  Plus, 
  Eye,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Phone,
  FolderKanban
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Client {
  id: string
  company: string | null
  phone: string | null
  address: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    isActive: boolean
    createdAt: string
  }
  _count: {
    projects: number
  }
}

export function AdminClients() {
  const { data: session } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  // Form state for creating new client
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    phone: "",
    sendWelcomeEmail: true,
  })

  useEffect(() => {
    fetchClients()
  }, [page, search])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      })
      const response = await fetch(`/api/admin/clients?${params}`)
      if (!response.ok) throw new Error("Failed to fetch clients")
      const data = await response.json()
      setClients(data.clients)
      setTotalPages(data.pagination.totalPages)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async () => {
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }
    
    if (!formData.name.trim()) {
      toast.error("Client name is required")
      return
    }

    try {
      setCreating(true)
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "CLIENT",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create client")
      }

      const result = await response.json()
      
      setIsCreateDialogOpen(false)
      setFormData({
        email: "",
        name: "",
        company: "",
        phone: "",
        sendWelcomeEmail: true,
      })
      fetchClients()
      
      toast.success(`Client "${result.user.name}" created successfully!`)
      
      // Show temp password in development
      if (result.tempPassword) {
        toast.info(`Temporary password: ${result.tempPassword}`, { duration: 10000 })
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create client")
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Client
        </Button>
      </div>

      {/* Clients Table */}
      <Card className="bg-gray-800 border-gray-700">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-700" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400">{error}</div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No clients yet</h3>
            <p className="text-gray-400 mb-4">Get started by creating your first client account.</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Client
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Client</TableHead>
                    <TableHead className="text-gray-400">Company</TableHead>
                    <TableHead className="text-gray-400">Contact</TableHead>
                    <TableHead className="text-gray-400">Projects</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Joined</TableHead>
                    <TableHead className="text-gray-400 w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="border-gray-700">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold">
                            {(client.user.name || client.user.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{client.user.name || "—"}</p>
                            <p className="text-sm text-gray-400">{client.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          {client.company || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.phone ? (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone className="w-4 h-4 text-gray-500" />
                            {client.phone}
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderKanban className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{client._count.projects}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={client.user.isActive 
                          ? "bg-green-500/20 text-green-400 border-green-500/50" 
                          : "bg-red-500/20 text-red-400 border-red-500/50"
                        }>
                          {client.user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(client.user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                              <FolderKanban className="mr-2 h-4 w-4" />
                              View Projects
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Client
                            </DropdownMenuItem>
                            {session?.user?.role === "SUPER_ADMIN" && (
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-gray-900 border-gray-700 text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="bg-gray-900 border-gray-700 text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Client Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              Create New Client
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new client account. They will receive login credentials via email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 pl-10"
                  placeholder="client@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-900 border-gray-700"
                placeholder="John Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-gray-900 border-gray-700 pl-10"
                  placeholder="Acme Corporation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-900 border-gray-700 pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="sendWelcomeEmail"
                checked={formData.sendWelcomeEmail}
                onChange={(e) => setFormData({ ...formData, sendWelcomeEmail: e.target.checked })}
                className="rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500"
              />
              <Label htmlFor="sendWelcomeEmail" className="text-sm text-gray-400 cursor-pointer">
                Send welcome email with login credentials
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateClient}
              disabled={creating}
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
            >
              {creating ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

