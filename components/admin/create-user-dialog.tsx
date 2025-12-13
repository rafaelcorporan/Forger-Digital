"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, UserPlus, Building2, Briefcase } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CreateUserDialogProps {
  onSuccess?: () => void
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [userType, setUserType] = useState<"CLIENT" | "STAFF">("CLIENT")
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    // Client fields
    company: "",
    phone: "",
    // Staff fields
    department: "",
    title: "",
    skills: "",
    hourlyRate: "",
    // Options
    sendWelcomeEmail: true,
  })

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      company: "",
      phone: "",
      department: "",
      title: "",
      skills: "",
      hourlyRate: "",
      sendWelcomeEmail: true,
    })
    setTempPassword(null)
    setUserType("CLIENT")
  }

  const handleCreate = async () => {
    if (!formData.email || !formData.name) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setCreating(true)
      const payload: any = {
        email: formData.email,
        name: formData.name,
        role: userType,
        sendWelcomeEmail: formData.sendWelcomeEmail,
      }

      if (userType === "CLIENT") {
        if (formData.company) payload.company = formData.company
        if (formData.phone) payload.phone = formData.phone
      } else {
        if (formData.department) payload.department = formData.department
        if (formData.title) payload.title = formData.title
        if (formData.skills) payload.skills = formData.skills.split(",").map(s => s.trim()).filter(s => s)
        if (formData.hourlyRate) payload.hourlyRate = parseInt(formData.hourlyRate) * 100 // Convert to cents
      }

      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user")
      }

      // Show temp password if in development
      if (data.tempPassword) {
        setTempPassword(data.tempPassword)
      } else {
        setOpen(false)
        resetForm()
        onSuccess?.()
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
    if (tempPassword) {
      onSuccess?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
      else setOpen(true)
    }}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
        {tempPassword ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-400">User Created Successfully!</DialogTitle>
              <DialogDescription className="text-gray-400">
                The user account has been created. Share these credentials with the user.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white font-medium">{formData.email}</p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-orange-500/50">
                <p className="text-sm text-gray-400 mb-1">Temporary Password</p>
                <p className="text-orange-400 font-mono text-lg">{tempPassword}</p>
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ This password will only be shown once. The user should change it after first login.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`Email: ${formData.email}\nPassword: ${tempPassword}`)
                  alert("Credentials copied to clipboard!")
                }}
                variant="outline"
                className="bg-gray-700 border-gray-600"
              >
                Copy Credentials
              </Button>
              <Button onClick={handleClose} className="bg-orange-500 hover:bg-orange-600">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a client or staff account. A temporary password will be generated.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={userType} onValueChange={(v) => setUserType(v as "CLIENT" | "STAFF")} className="mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                <TabsTrigger value="CLIENT" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="STAFF" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Staff
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4 py-4">
                {/* Common fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-900 border-gray-700"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-900 border-gray-700"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <TabsContent value="CLIENT" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="STAFF" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                        placeholder="Engineering"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                        placeholder="Senior Developer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                        placeholder="React, Node.js, Python"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                        placeholder="150"
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendEmail">Send welcome email</Label>
                    <p className="text-xs text-gray-500">Send login credentials to the user</p>
                  </div>
                  <Switch
                    id="sendEmail"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => setFormData({ ...formData, sendWelcomeEmail: checked })}
                  />
                </div>
              </div>
            </Tabs>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-gray-700 border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {creating ? "Creating..." : `Create ${userType === "CLIENT" ? "Client" : "Staff"}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

