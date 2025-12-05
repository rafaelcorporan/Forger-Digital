"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { User, Settings, LogOut, Shield, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { StaffAssignments } from "@/components/dashboard/staff-assignments"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      setIsLoading(false)
    }
  }, [status, router])

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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {session.user?.name || session.user?.email}</p>
          </div>

          {/* User Info Card */}
          <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{session.user?.name || "User"}</h2>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {session.user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-400 capitalize">{session.user?.role || "USER"}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card
              className="bg-gray-800 border-gray-700 p-6 hover:border-orange-500 transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/profile")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Profile Settings</h3>
                  <p className="text-sm text-gray-400">Update your profile information</p>
                </div>
              </div>
            </Card>

            <Card
              className="bg-gray-800 border-gray-700 p-6 hover:border-orange-500 transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/account")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Account Settings</h3>
                  <p className="text-sm text-gray-400">Manage your account preferences</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Admin Access */}
          {(session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN") && (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Admin Panel</h3>
                  <p className="text-sm text-gray-400">Access administrative features</p>
                </div>
                <Button
                  onClick={() => router.push("/admin")}
                  className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                >
                  Go to Admin Panel
                </Button>
              </div>
            </Card>
          )}

          {/* Staff Assignments */}
          {(session.user?.role === "STAFF" || session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN") && (
            <div className="mt-8">
              <StaffAssignments />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

