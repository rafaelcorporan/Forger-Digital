"use client"

import { HelpCircle, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface FieldHelpProps {
  helpText: string
  tooltip?: string
  className?: string
  variant?: "info" | "help"
}

export function FieldHelp({
  helpText,
  tooltip,
  className,
  variant = "help",
}: FieldHelpProps) {
  const Icon = variant === "info" ? Info : HelpCircle

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400/50 rounded-full p-0.5"
              aria-label="Help"
            >
              <Icon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <p className={className || "text-xs text-white/70 mt-1.5 font-medium"}>
      {helpText}
    </p>
  )
}

