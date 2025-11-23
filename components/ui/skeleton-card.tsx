import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  showImage?: boolean
  showFooter?: boolean
  lines?: number
}

export function SkeletonCard({ 
  className, 
  showImage = true, 
  showFooter = false,
  lines = 3 
}: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border border-gray-800 bg-gray-900 p-6", className)}>
      {showImage && (
        <Skeleton className="h-48 w-full rounded-lg mb-4 bg-gray-800" />
      )}
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 bg-gray-800" />
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-5/6 bg-gray-800" />
        {lines > 3 && (
          <>
            {Array.from({ length: lines - 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-800" />
            ))}
          </>
        )}
      </div>
      {showFooter && (
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
          <Skeleton className="h-4 w-24 bg-gray-800" />
        </div>
      )}
    </div>
  )
}

interface SkeletonListProps {
  items?: number
  className?: string
  showAvatar?: boolean
}

export function SkeletonList({ items = 5, className, showAvatar = true }: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900">
          {showAvatar && (
            <Skeleton className="h-12 w-12 rounded-full bg-gray-800 flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3 bg-gray-800" />
            <Skeleton className="h-4 w-2/3 bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface SkeletonFormProps {
  fields?: number
  className?: string
}

export function SkeletonForm({ fields = 5, className }: SkeletonFormProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-800" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-800" />
        </div>
      ))}
      <Skeleton className="h-12 w-32 rounded-md bg-gray-800" />
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full bg-gray-800" />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-10 w-full bg-gray-800" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

