"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  MoreVertical, 
  Shield, 
  User, 
  Trash2, 
  Pencil, 
  KeyRound, 
  UserX, 
  UserCheck,
  Mail
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { CreateUserDialog } from "./create-user-dialog"
import { toast } from "sonner"

// Custom User Actions Menu Component using fixed positioning
function UserActionsMenu({ 
  user,
  currentUserId,
  currentUserRole,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onChangeRole,
  onDelete,
  isUpdating
}: { 
  user: {
    id: string
    name: string | null
    email: string
    role: string
    isActive?: boolean
  }
  currentUserId?: string
  currentUserRole?: string
  onEdit: () => void
  onResetPassword: () => void
  onToggleStatus: () => void
  onChangeRole: (role: string) => void
  onDelete: () => void
  isUpdating: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const menu = document.getElementById(`user-menu-${user.id}`)
        if (menu && !menu.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
    }
    
    function handleScroll() {
      setIsOpen(false)
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("scroll", handleScroll, true)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("scroll", handleScroll, true)
      }
    }
  }, [isOpen, user.id])

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 200,
      })
    }
    setIsOpen(!isOpen)
  }

  const isSelf = user.id === currentUserId
  const canManageRoles = currentUserRole === "SUPER_ADMIN"
  const canDelete = currentUserRole === "SUPER_ADMIN" && !isSelf

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        disabled={isUpdating}
        className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <MoreVertical className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div 
          id={`user-menu-${user.id}`}
          className="fixed w-[200px] bg-gray-800 border border-gray-700 rounded-md shadow-2xl py-1"
          style={{ 
            top: menuPosition.top, 
            left: menuPosition.left,
            zIndex: 99999,
          }}
        >
          {/* Edit Account */}
          <button
            onClick={() => { onEdit(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
          >
            <Pencil className="h-4 w-4 flex-shrink-0" />
            Edit Account
          </button>
          
          {/* Reset Password */}
          <button
            onClick={() => { onResetPassword(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
          >
            <KeyRound className="h-4 w-4 flex-shrink-0" />
            Reset Password
          </button>
          
          <div className="h-px bg-gray-700 my-1" />
          
          {/* Change Role - Only for Super Admin */}
          {canManageRoles && !isSelf && (
            <>
              <div className="px-3 py-1 text-xs text-gray-500 uppercase">Change Role</div>
              {user.role !== "USER" && (
                <button
                  onClick={() => { onChangeRole("USER"); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  Set as User
                </button>
              )}
              {user.role !== "CLIENT" && (
                <button
                  onClick={() => { onChangeRole("CLIENT"); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-green-500/20 transition-colors text-left"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  Set as Client
                </button>
              )}
              {user.role !== "STAFF" && (
                <button
                  onClick={() => { onChangeRole("STAFF"); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/20 transition-colors text-left"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  Set as Staff
                </button>
              )}
              {user.role !== "ADMIN" && (
                <button
                  onClick={() => { onChangeRole("ADMIN"); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-400 hover:bg-orange-500/20 transition-colors text-left"
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  Set as Admin
                </button>
              )}
              {user.role !== "SUPER_ADMIN" && (
                <button
                  onClick={() => { onChangeRole("SUPER_ADMIN"); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left"
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  Set as Super Admin
                </button>
              )}
              <div className="h-px bg-gray-700 my-1" />
            </>
          )}
          
          {/* Disable/Enable Account */}
          {!isSelf && (
            <button
              onClick={() => { onToggleStatus(); setIsOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left ${
                user.isActive !== false 
                  ? "text-yellow-400 hover:bg-yellow-500/20" 
                  : "text-green-400 hover:bg-green-500/20"
              }`}
            >
              {user.isActive !== false ? (
                <>
                  <UserX className="h-4 w-4 flex-shrink-0" />
                  Disable Account
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 flex-shrink-0" />
                  Enable Account
                </>
              )}
            </button>
          )}
          
          {/* Delete Account */}
          {canDelete && (
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left"
            >
              <Trash2 className="h-4 w-4 flex-shrink-0" />
              Delete Account
            </button>
          )}
        </div>
      )}
    </>
  )
}

interface UserData {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: boolean | null
  isActive?: boolean
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
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ name: "", email: "" })
  const [newPassword, setNewPassword] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

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
        const data = await response.json()
        throw new Error(data.error || "Failed to update user role")
      }
      await fetchUsers()
      toast.success(`User role updated to ${newRole}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update user role")
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
      toast.success("User deleted successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user)
    setEditFormData({ name: user.name || "", email: user.email })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return
    
    try {
      setActionLoading(true)
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: selectedUser.id, 
          name: editFormData.name,
          email: editFormData.email 
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update user")
      }
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
      toast.success("User updated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to update user")
    } finally {
      setActionLoading(false)
    }
  }

  const handleResetPassword = (user: UserData) => {
    setSelectedUser(user)
    setNewPassword("")
    setIsResetPasswordDialogOpen(true)
  }

  const handleSavePassword = async () => {
    if (!selectedUser || !newPassword) return
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    
    try {
      setActionLoading(true)
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: selectedUser.id, 
          password: newPassword 
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to reset password")
      }
      setIsResetPasswordDialogOpen(false)
      setSelectedUser(null)
      setNewPassword("")
      toast.success("Password reset successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password")
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (user: UserData) => {
    try {
      setUpdating(user.id)
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          isActive: user.isActive === false ? true : false 
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update user status")
      }
      await fetchUsers()
      toast.success(user.isActive === false ? "Account enabled" : "Account disabled")
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status")
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteClick = (user: UserData) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "ADMIN":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "STAFF":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "CLIENT":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
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
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          </div>
          <CreateUserDialog onSuccess={fetchUsers} />
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
                    <TableRow 
                      key={user.id} 
                      className={`border-gray-700 ${user.isActive === false ? "opacity-60 bg-red-900/10" : ""}`}
                    >
                      <TableCell>
                        <div>
                          <p className={`font-medium ${user.isActive === false ? "text-gray-400 line-through" : "text-white"}`}>
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
                        <div className="flex flex-col gap-1">
                          {user.isActive === false ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                              Disabled
                            </Badge>
                          ) : user.emailVerified ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                              Unverified
                            </Badge>
                          )}
                        </div>
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
                        <UserActionsMenu
                          user={user}
                          currentUserId={session?.user?.id}
                          currentUserRole={session?.user?.role}
                          onEdit={() => handleEditUser(user)}
                          onResetPassword={() => handleResetPassword(user)}
                          onToggleStatus={() => handleToggleStatus(user)}
                          onChangeRole={(role) => handleRoleChange(user.id, role)}
                          onDelete={() => handleDeleteClick(user)}
                          isUpdating={updating === user.id}
                        />
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-orange-500" />
              Edit Account
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Update user account details for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="bg-gray-900 border-gray-700"
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 pl-10"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={actionLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-yellow-500" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Set a new password for {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-900 border-gray-700"
                placeholder="Enter new password (min 8 characters)"
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-md">
              <p className="text-sm text-yellow-300">
                ⚠️ The user will need to use this new password to log in. 
                Make sure to communicate it securely.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePassword}
              disabled={actionLoading || newPassword.length < 8}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {actionLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete the account for{" "}
              <strong className="text-white">{selectedUser?.name || selectedUser?.email}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-md">
              <p className="text-sm text-red-300">
                ⚠️ This will permanently delete:
              </p>
              <ul className="text-sm text-red-300 list-disc list-inside mt-2">
                <li>User account and profile data</li>
                <li>All sessions and authentication data</li>
                <li>Associated projects and contracts may be affected</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

