"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StaffCard } from "@/components/staff-card"
import { StaffDetailModal } from "@/components/staff-detail-modal"
import { teamMembers } from "@/lib/teamData"
import type { StaffMember } from "@/lib/teamData"

export default function TeamPage() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLearnMore = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Title Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Meet the Team
            </h1>
            <p className="text-muted-foreground">Hover a card to learn more. Click "Learn More" for details.</p>
          </div>

          {/* Team Member Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((m) => (
              <StaffCard key={m.id} staff={m} onLearnMore={handleLearnMore} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Staff Detail Modal - Outside card to avoid positioning issues */}
      <StaffDetailModal
        staff={selectedStaff}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedStaff(null)
        }}
      />
    </main>
  )
}
