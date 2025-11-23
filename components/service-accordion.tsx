"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle } from "lucide-react"
import { serviceData, type ServiceDetail } from "@/lib/serviceData"
import { cn } from "@/lib/utils"

interface ServiceAccordionProps {
  selectedServices: string[]
  onServiceToggle: (service: string) => void
  error?: string
}

export function ServiceAccordion({ selectedServices, onServiceToggle, error }: ServiceAccordionProps) {
  // Group services by category
  const servicesByCategory = serviceData.reduce((acc, service) => {
    const category = service.category || "Other"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {} as Record<string, ServiceDetail[]>)

  // Sort categories for consistent display
  const categories = Object.keys(servicesByCategory).sort()

  // Count selected services per category
  const getCategorySelectedCount = (category: string) => {
    return servicesByCategory[category].filter(service => 
      selectedServices.includes(service.title)
    ).length
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={categories.slice(0, 2)}>
        {categories.map((category) => {
          const services = servicesByCategory[category]
          const selectedCount = getCategorySelectedCount(category)
          const totalCount = services.length

          return (
            <AccordionItem key={category} value={category} className="border border-gray-700 rounded-lg mb-3 px-4 bg-gray-800/50">
              <AccordionTrigger className="hover:no-underline py-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-white">{category}</span>
                  <span className="text-xs text-gray-400">
                    ({selectedCount} of {totalCount} selected)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                  {services.map((service) => {
                    const isSelected = selectedServices.includes(service.title)
                    return (
                      <div
                        key={service.slug}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "border-orange-500 bg-orange-500/20"
                            : "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                        )}
                        onClick={() => onServiceToggle(service.title)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onServiceToggle(service.title)
                          }
                        }}
                        aria-checked={isSelected}
                        aria-label={`${service.title} - ${isSelected ? "Selected" : "Not selected"}`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onServiceToggle(service.title)}
                            className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-800"
                            aria-label={service.title}
                            tabIndex={-1}
                          />
                          <span className={cn(
                            "text-sm font-medium flex-1",
                            isSelected ? "text-orange-300" : "text-white"
                          )}>
                            {service.title}
                          </span>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      
      {error && (
        <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>
      )}
      
      <div className="text-sm text-gray-400 mt-2">
        {selectedServices.length} {selectedServices.length !== 1 ? "services" : "service"} selected
      </div>
    </div>
  )
}

