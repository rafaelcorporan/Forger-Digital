"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight, ChevronDown, Search } from "lucide-react"
import { useState } from "react"
import { VideoModal } from "@/components/video-modal"
import { SearchModal } from "@/components/search-modal"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useTranslation } from "@/lib/i18n/context"

const workItems = [
  { title: "Enterprise Network Monitoring Dashboard", videoUrl: "/1.webm" },
  { title: "Cloud Migration Management Portal", videoUrl: "/2.webm" },
  { title: "Secure IoT Device Management Platform", videoUrl: "/3.webm" },
  { title: "Predictive Network Maintenance System", videoUrl: "/4.webm" },
  { title: "Intelligent Customer Support Chatbot", videoUrl: "/5.webm" },
  { title: "AI-Powered Security Threat Detection", videoUrl: "/6.webm" },
  { title: "Data Graphs Converter", videoUrl: "/7.webm" },
  { title: "Financial Dashboard", videoUrl: "/8.webm" },
  { title: "IoT-Dashboard", videoUrl: "/9.webm" },
  { title: "URL Shorter - Yuupi", videoUrl: "/10.webm" },
  { title: "Online Video Converter", videoUrl: "/11.webm" },
  { title: "WePay - Crypto Wallet", videoUrl: "/12.webm" },
]

const portfolioCategories = [
  { title: "Infrastructure & Networking", url: "/portfolio#infrastructure-networking" },
  { title: "AI & Automation", url: "/portfolio#ai-automation" },
  { title: "Web & Utilities / Blockchain", url: "/portfolio#web-utilities-blockchain" },
  { title: "All Projects", url: "/portfolio" },
]

export function Navigation() {
  const { t } = useTranslation('navigation')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false)
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav 
      id="navigation"
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 z-10">
            <div className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
              Forger Digital
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 text-sm text-white transition-colors hover:text-orange-500 px-3 py-1.5 rounded-lg hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              title={`${t('search')} (Ctrl+K)`}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            
            <Link 
              href="/#services" 
              className="text-sm text-white transition-colors hover:text-orange-500 scroll-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded px-2 py-1"
              aria-label={`Navigate to ${t('services')} section`}
            >
              {t('services')}
            </Link>
            
            <LanguageSwitcher />
            
            {/* Work Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setWorkDropdownOpen(true)}
              onMouseLeave={() => setWorkDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-sm text-white transition-colors hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded px-2 py-1"
                aria-expanded={workDropdownOpen}
                aria-haspopup="true"
                aria-label="Work portfolio menu"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setWorkDropdownOpen(!workDropdownOpen)
                  }
                }}
              >
                Work
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${workDropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              
              {/* Dropdown Menu */}
              {workDropdownOpen && (
                <div className="absolute left-0 mt-0 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4 grid grid-cols-2 gap-3">
                  {workItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedVideo({ url: item.videoUrl, title: item.title })
                        setVideoModalOpen(true)
                        setWorkDropdownOpen(false)
                      }}
                      className="p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition-colors group cursor-pointer text-left"
                    >
                      <div className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors">
                        {item.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Portfolio Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setPortfolioDropdownOpen(true)}
              onMouseLeave={() => setPortfolioDropdownOpen(false)}
            >
              <Link 
                href="/portfolio"
                className="flex items-center gap-1 text-sm text-white transition-colors hover:text-orange-500"
              >
                Portfolio
                <ChevronDown className={`h-4 w-4 transition-transform ${portfolioDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              {/* Dropdown Menu */}
              {portfolioDropdownOpen && (
                <div className="absolute left-0 mt-0 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4 flex flex-col gap-2">
                  {portfolioCategories.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.url}
                      className="p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition-colors group cursor-pointer"
                    >
                      <div className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors">
                        {item.title}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/#contact" className="text-sm text-white transition-colors hover:text-orange-500 scroll-smooth">
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/get-started">
              <Button variant="primary-action" size="default" className="group gap-2 h-11 px-6 text-base rounded-full">
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800 transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-800 py-4 md:hidden bg-gray-900">
            <div className="flex flex-col gap-4">
              <Link href="/#services" className="text-sm text-white transition-colors hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                {t('services')}
              </Link>
              
              {/* Mobile Work Dropdown */}
              <div>
                <button 
                  onClick={() => setWorkDropdownOpen(!workDropdownOpen)}
                  className="flex items-center gap-1 text-sm text-white transition-colors hover:text-orange-500 w-full"
                >
                  Work
                  <ChevronDown className={`h-4 w-4 transition-transform ${workDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {workDropdownOpen && (
                  <div className="mt-2 ml-4 flex flex-col gap-2">
                    {workItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVideo({ url: item.videoUrl, title: item.title })
                          setVideoModalOpen(true)
                          setMobileMenuOpen(false)
                          setWorkDropdownOpen(false)
                        }}
                        className="text-xs text-gray-300 hover:text-orange-500 transition-colors text-left"
                      >
                        <div className="font-semibold">{item.title}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Portfolio Dropdown */}
              <div>
                <button 
                  onClick={() => setPortfolioDropdownOpen(!portfolioDropdownOpen)}
                  className="flex items-center gap-1 text-sm text-white transition-colors hover:text-orange-500 w-full"
                >
                  Portfolio
                  <ChevronDown className={`h-4 w-4 transition-transform ${portfolioDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {portfolioDropdownOpen && (
                  <div className="mt-2 ml-4 flex flex-col gap-2">
                    {portfolioCategories.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.url}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setPortfolioDropdownOpen(false)
                        }}
                        className="text-xs text-gray-300 hover:text-orange-500 transition-colors"
                      >
                        <div className="font-semibold">{item.title}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/#contact" className="text-sm text-white transition-colors hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link href="/get-started">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 justify-center">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => {
          setVideoModalOpen(false)
          setSelectedVideo(null)
        }}
        videoUrl={selectedVideo?.url || null}
        projectTitle={selectedVideo?.title || null}
      />

      {/* Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  )
}
