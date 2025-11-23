"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FormProgressProps {
  steps: string[]
  currentStep: number
  completedSteps?: number[]
  className?: string
  showLabels?: boolean
}

export function FormProgress({
  steps,
  currentStep,
  completedSteps = [],
  className,
  showLabels = true,
}: FormProgressProps) {
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className={cn("space-y-5", className)}>
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-white/90">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-white font-bold">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-3 bg-white/20" />
      </div>

      {/* Step Indicators */}
      {showLabels && (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index) || index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg",
                    isCompleted
                      ? "bg-purple-800 border-purple-700 text-white shadow-purple-800/40 scale-110"
                      : isCurrent
                      ? "bg-white border-white/50 text-gray-800 shadow-white/40 scale-110 ring-2 ring-white/30"
                      : "bg-white/10 border-white/30 text-white/60 shadow-none"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs text-center max-w-[90px] font-semibold transition-colors",
                    isCurrent
                      ? "text-white font-bold"
                      : isCompleted
                      ? "text-white"
                      : "text-white/60"
                  )}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

