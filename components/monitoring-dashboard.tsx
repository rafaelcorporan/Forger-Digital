"use client"

/**
 * Monitoring Dashboard Component
 * Displays system health and error metrics
 * Note: This is a client-side component that can be used in admin dashboard
 */

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface HealthMetrics {
  status: "healthy" | "degraded" | "unhealthy"
  uptime: number
  errorRate: number
  responseTime: number
  lastChecked: string
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/health")
        if (response.ok) {
          const data = await response.json()
          setMetrics({
            status: "healthy",
            uptime: data.uptime || 0,
            errorRate: 0, // Would come from monitoring service
            responseTime: 0, // Would come from monitoring service
            lastChecked: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Failed to fetch health metrics:", error)
        setMetrics({
          status: "unhealthy",
          uptime: 0,
          errorRate: 0,
          responseTime: 0,
          lastChecked: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-6">
        <div className="text-gray-400">Loading monitoring data...</div>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400"
      case "degraded":
        return "text-yellow-400"
      case "unhealthy":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "unhealthy":
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Health</h3>
          {metrics && getStatusIcon(metrics.status)}
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <p className={`text-lg font-semibold ${getStatusColor(metrics?.status || "unknown")}`}>
              {metrics?.status.toUpperCase() || "UNKNOWN"}
            </p>
          </div>
          {metrics && (
            <>
              <div>
                <p className="text-sm text-gray-400 mb-1">Uptime</p>
                <p className="text-lg font-semibold text-white">
                  {Math.floor(metrics.uptime / 3600)}h {Math.floor((metrics.uptime % 3600) / 60)}m
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Checked</p>
                <p className="text-sm text-gray-300">
                  {new Date(metrics.lastChecked).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Average Response Time</span>
            </div>
            <span className="text-white font-semibold">
              {metrics?.responseTime || 0}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Error Rate</span>
            </div>
            <span className="text-white font-semibold">
              {metrics?.errorRate || 0}%
            </span>
          </div>
        </div>
      </Card>

      <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-lg">
        <p className="text-blue-400 text-sm">
          💡 <strong>Note:</strong> Full monitoring metrics require Sentry integration.
          Configure <code className="text-blue-300">NEXT_PUBLIC_SENTRY_DSN</code> in your environment variables.
        </p>
      </div>
    </div>
  )
}

