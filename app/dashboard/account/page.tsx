"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, ArrowLeft, Lock, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"

export default function AccountSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [csrfToken, setCsrfToken] = useState<string>("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      setIsLoading(false)
    }
  }, [status, router])

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrf-token", {
          method: "GET",
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.token) {
            setCsrfToken(data.token)
          }
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      }
    }
    if (status === "authenticated") {
      fetchCsrfToken()
    }
  }, [status])

  if (status === "loading" || isLoading) {
    return (
      <main className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!session) {
    return null
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const validatePassword = (): boolean => {
    if (!passwordData.newPassword) {
      setError("New password is required")
      return false
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      setError("Password must contain at least one uppercase letter")
      return false
    }
    if (!/[a-z]/.test(passwordData.newPassword)) {
      setError("Password must contain at least one lowercase letter")
      return false
    }
    if (!/[0-9]/.test(passwordData.newPassword)) {
      setError("Password must contain at least one number")
      return false
    }
    if (!/[^A-Za-z0-9]/.test(passwordData.newPassword)) {
      setError("Password must contain at least one special character")
      return false
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validatePassword()) {
      return
    }

    setIsChangingPassword(true)

    try {
      // Ensure CSRF token is available
      let token = csrfToken
      if (!token) {
        const tokenResponse = await fetch("/api/csrf-token", {
          method: "GET",
          credentials: "include",
        })
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json()
          if (tokenData.success && tokenData.token) {
            token = tokenData.token
            setCsrfToken(token)
          } else {
            throw new Error("Failed to retrieve CSRF token")
          }
        } else {
          throw new Error("Failed to retrieve CSRF token")
        }
      }

      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to change password")
      }

      setSuccess("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    if (!confirm("This will permanently delete your account and all associated data. Type 'DELETE' to confirm.")) {
      return
    }

    setIsDeletingAccount(true)
    setError("")
    setSuccess("")

    try {
      // Ensure CSRF token is available
      let token = csrfToken
      if (!token) {
        const tokenResponse = await fetch("/api/csrf-token", {
          method: "GET",
          credentials: "include",
        })
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json()
          if (tokenData.success && tokenData.token) {
            token = tokenData.token
            setCsrfToken(token)
          } else {
            throw new Error("Failed to retrieve CSRF token")
          }
        } else {
          throw new Error("Failed to retrieve CSRF token")
        }
      }

      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to delete account")
      }

      // Sign out and redirect
      await signOut({ callbackUrl: "/" })
    } catch (err: any) {
      setError(err.message || "Failed to delete account. Please try again.")
      setIsDeletingAccount(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-gray-400">Manage your account preferences and security</p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 bg-green-500/10 border-green-500/50">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Change Password Card */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Current Password */}
                <div>
                  <Label htmlFor="currentPassword" className="text-white">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-900 border-gray-700 text-white mt-2"
                    placeholder="Enter your current password"
                    disabled={isChangingPassword}
                    required
                  />
                </div>

                {/* New Password */}
                <div>
                  <Label htmlFor="newPassword" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-900 border-gray-700 text-white mt-2"
                    placeholder="Enter your new password"
                    disabled={isChangingPassword}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-900 border-gray-700 text-white mt-2"
                    placeholder="Confirm your new password"
                    disabled={isChangingPassword}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                >
                  {isChangingPassword ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account Card */}
          <Card className="bg-gray-800 border-gray-700 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </CardTitle>
              <CardDescription className="text-gray-400">
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeletingAccount ? "Deleting Account..." : "Delete Account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}

