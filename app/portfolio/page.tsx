"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PlaybookContent } from "@/components/playbook-content"
import { useTranslation } from "@/lib/i18n/context"

function BackButton() {
  const { t } = useTranslation('common')
  return (
    <Link 
      href="/" 
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs bg-[#FF4500] text-white hover:bg-[#E63E00] hover:text-black border-0 shadow-[0_8px_30px_rgba(255,69,0,0.3)] hover:shadow-[0_8px_40px_rgba(255,69,0,0.5)] font-semibold"
    >
      <ArrowLeft className="w-3 h-3" />
      {t('back')}
    </Link>
  )
}

export default function PortfolioPage() {
  useEffect(() => {
    // Handle scroll to section on page load if hash is present
    const hash = window.location.hash
    if (hash) {
      // Wait for content to render
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          const headerOffset = 80 // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, [])

  return (
    <main className="min-h-screen">
      {/* Back Button - Small Tab Style */}
      <div className="fixed top-4 left-4 z-50">
        <BackButton />
      </div>
      
      <PlaybookContent />
    </main>
  )
}

