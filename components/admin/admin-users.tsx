"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MoreVertical, Shield, User, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: boolean | null
  createdAt: string
  updatedAt: string
  _count: {
    accounts: number
    sessions: number
    payments: number
    subscriptions: number
  }
}

export function AdminUsers() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [page, search, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(roleFilter && roleFilter !== "all" && { role: roleFilter }),
      })
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId)
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!response.ok) {
        throw new Error("Failed to update user role")
      }
      await fetchUsers()
    } catch (err: any) {
      alert(`Error updating user: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    try {
      setUpdating(userId)
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete user")
      }
      await fetchUsers()
    } catch (err: any) {
      alert(`Error deleting user: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "ADMIN":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value) => {
            setRoleFilter(value)
            setPage(1)
          }}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6">
            <p className="text-red-400">Error loading users: {error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Accounts</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">
                            {user.name || "No name"}
                          </p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="text-sm">
                          <p>OAuth: {user._count.accounts}</p>
                          <p>Sessions: {user._count.sessions}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={updating === user.id}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                            {user.role !== "USER" && (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, "USER")}
                                className="text-white hover:bg-gray-700"
                              >
                                <User className="mr-2 h-4 w-4" />
                                Set as User
                              </DropdownMenuItem>
                            )}
                            {user.role !== "ADMIN" && session?.user?.role === "SUPER_ADMIN" && (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, "ADMIN")}
                                className="text-white hover:bg-gray-700"
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Set as Admin
                              </DropdownMenuItem>
                            )}
                            {user.role !== "SUPER_ADMIN" && session?.user?.role === "SUPER_ADMIN" && (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, "SUPER_ADMIN")}
                                className="text-white hover:bg-gray-700"
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Set as Super Admin
                              </DropdownMenuItem>
                            )}
                            {session?.user?.role === "SUPER_ADMIN" && user.id !== session.user.id && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
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
                <p className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-gray-900 border-gray-700 text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
    </div>
  )
}

