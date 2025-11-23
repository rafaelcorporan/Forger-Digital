"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { 
  Users, 
  Mail, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Shield,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen
} from "lucide-react"
import { AdminOverview } from "@/components/admin/admin-overview"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminSubmissions } from "@/components/admin/admin-submissions"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { AdminBlog } from "@/components/admin/admin-blog"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      // Check if user is admin
      if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [status, session, router])

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

  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome back, {session.user?.name || session.user?.email}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-white">
                  {session.user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800 p-1 rounded-lg border border-gray-700 mb-8">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="submissions"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submissions
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="blog"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Blog
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <AdminOverview />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-8">
              <AdminUsers />
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="mt-8">
              <AdminSubmissions />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-8">
              <AdminAnalytics />
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog" className="mt-8">
              <AdminBlog />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}
