"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import type { StaffMember } from "@/lib/teamData"
import { Badge } from "@/components/ui/badge"
import { ResumeView } from "@/components/resume-view"

interface StaffDetailModalProps {
  staff: StaffMember | null
  isOpen: boolean
  onClose: () => void
}

export function StaffDetailModal({ staff, isOpen, onClose }: StaffDetailModalProps) {
  if (!staff) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-full !w-screen !h-screen !max-h-screen overflow-hidden flex flex-col p-0 m-0 !rounded-none !fixed !inset-0 !translate-x-0 !translate-y-0 !top-0 !left-0 z-[100]"
        showCloseButton={true}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header Section with Image */}
          <div className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src={staff.profileImage}
                  alt={`${staff.name} profile photo`}
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder-user.jpg"
                  }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <DialogTitle className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  {staff.name}
                </DialogTitle>
                {staff.title && (
                  <p className="text-xl md:text-2xl text-white/90 mb-4">{staff.title}</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {staff.roleTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section with Tabs */}
          <div className="flex-1 p-6 md:p-8 bg-white">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Resume Summary */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{staff.resume}</p>
                </section>

                {/* Profile */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
                  <p className="text-gray-700 leading-relaxed">{staff.profile}</p>
                </section>

                {/* Detailed Content */}
                {staff.accordionContent && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Details</h3>
                    <p className="text-gray-700 leading-relaxed">{staff.accordionContent}</p>
                  </section>
                )}

                {/* Skills */}
                {staff.skills && staff.skills.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {staff.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-sm py-1.5 px-4 rounded-full border border-gray-900 bg-sky-100 text-sky-700 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Service Alignment */}
                {staff.serviceAlignment && staff.serviceAlignment.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Alignment</h3>
                    <div className="flex flex-wrap gap-2">
                      {staff.serviceAlignment.map((service) => (
                        <Badge key={service} variant="secondary" className="text-sm">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Hobbies */}
                {staff.hobbies && staff.hobbies.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Hobbies</h3>
                    <p className="text-gray-700">{staff.hobbies.join(", ")}</p>
                  </section>
                )}
              </TabsContent>

              {/* Resume Tab */}
              <TabsContent value="resume" className="mt-0">
                <ResumeView staff={staff} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
