"use client"

import { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface LoadingWrapperProps {
  isLoading: boolean
  children: ReactNode
  skeleton?: ReactNode
  spinner?: ReactNode
  className?: string
  minHeight?: string
  fullScreen?: boolean
}

export function LoadingWrapper({
  isLoading,
  children,
  skeleton,
  spinner,
  className,
  minHeight = "200px",
  fullScreen = false,
}: LoadingWrapperProps) {
  if (isLoading) {
    if (fullScreen) {
      return (
        <div className={cn("flex items-center justify-center", className)} style={{ minHeight: "100vh" }}>
          {spinner || (
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8 text-orange-500" />
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          )}
        </div>
      )
    }

    if (skeleton) {
      return <div className={className}>{skeleton}</div>
    }

    return (
      <div 
        className={cn("flex items-center justify-center", className)} 
        style={{ minHeight }}
      >
        {spinner || (
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-6 w-6 text-orange-500" />
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        )}
      </div>
    )
  }

  return <div className={className}>{children}</div>
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: ReactNode
  message?: string
}

export function LoadingOverlay({ isLoading, children, message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-orange-500" />
            <p className="text-white text-sm font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: ReactNode
  loadingText?: string
  className?: string
}

export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = "Loading...",
  className 
}: LoadingButtonProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-md">
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4 text-white" />
            <span className="text-sm text-white">{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  )
}

