'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  'aria-label'?: string
  'aria-labelledby'?: string
}

function Tabs({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    />
  )
}

function TabsList({
  className,
  role = "tablist",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { role?: string }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      role={role}
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className,
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  'aria-label'?: string
}

function TabsTrigger({
  className,
  'aria-label': ariaLabel,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      role="tab"
      aria-label={ariaLabel}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-orange-500 focus-visible:outline-1 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      role="tabpanel"
      className={cn('flex-1 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2', className)}
      tabIndex={0}
      {...props}
    />
  )
}

interface TabsContentWithLoadingProps extends React.ComponentProps<typeof TabsPrimitive.Content> {
  isLoading?: boolean
  skeleton?: React.ReactNode
  loadingMessage?: string
}

function TabsContentWithLoading({
  isLoading = false,
  skeleton,
  loadingMessage = "Loading...",
  className,
  children,
  ...props
}: TabsContentWithLoadingProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      role="tabpanel"
      aria-busy={isLoading}
      aria-live="polite"
      className={cn('flex-1 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2', className)}
      tabIndex={0}
      {...props}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 min-h-[200px]">
          {skeleton || (
            <>
              <Spinner className="h-8 w-8 text-orange-500 mb-4" aria-hidden="true" />
              <p className="text-gray-400 text-sm">{loadingMessage}</p>
            </>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsContentWithLoading }
