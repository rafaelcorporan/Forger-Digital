"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { StaffMember } from "@/lib/teamData"

interface StaffCardProps {
  staff: StaffMember
  onLearnMore?: (staff: StaffMember) => void
}

export function StaffCard({ staff, onLearnMore }: StaffCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <Card
      className="group relative overflow-hidden rounded-3xl border-0 bg-[#F7F2EA] shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      {/* Base container manages hover expansion via max-height */}
      <div className="relative flex flex-col p-6">
        {/* Top: Image and Name */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-56 w-56 overflow-hidden rounded-2xl shadow-md">
            <Image
              src={imgError ? "/placeholder-user.jpg" : staff.profileImage}
              alt={`${staff.name} profile photo`}
              width={224}
              height={224}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
              priority={false}
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">{staff.name}</h3>
          {/* Role tags */}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
            {staff.roleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover-revealed section */}
        <div
          className="mt-4 grid gap-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-80 group-hover:opacity-100"
          aria-hidden
        >
          <div className="text-sm text-gray-700"><span className="font-semibold">Resume:</span> {staff.resume}</div>
          <div className="text-sm text-gray-700"><span className="font-semibold">Profile:</span> {staff.profile}</div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Hobbies:</span> {staff.hobbies.join(", ")}
          </div>

          {/* Learn More Button */}
          <button
            type="button"
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 hover:border-gray-400 relative z-10"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onLearnMore?.(staff)
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </Card>
  )
}
