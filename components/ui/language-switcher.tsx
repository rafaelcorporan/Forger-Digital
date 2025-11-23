"use client"

import * as React from 'react'
import { useI18n } from '@/lib/i18n/context'
import { ChevronDown } from 'lucide-react'
import { locales, localeConfig, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Error handling: Fallback to default locale if current locale config is missing
  const currentLocaleConfig = localeConfig[locale] || localeConfig.en

  const handleLocaleChange = React.useCallback((newLocale: Locale) => {
    try {
      // Validate locale exists before setting
      if (locales.includes(newLocale) && localeConfig[newLocale]) {
        setLocale(newLocale)
        setDropdownOpen(false)
      } else {
        console.warn(`Invalid locale attempted: ${newLocale}. Falling back to default.`)
        setLocale('en')
        setDropdownOpen(false)
      }
    } catch (error) {
      console.error('Error changing locale:', error)
      setDropdownOpen(false)
    }
  }, [setLocale])

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Close dropdown on Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [dropdownOpen])

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      onFocus={() => setDropdownOpen(true)}
      onBlur={(e) => {
        // Only close if focus is moving outside the component
        if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
          setDropdownOpen(false)
        }
      }}
    >
      <button 
        className="flex items-center gap-1 text-sm text-white transition-colors hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded px-2 py-1"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label={t('language.switch')}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setDropdownOpen(!dropdownOpen)
          }
        }}
      >
        <span className="text-base leading-none">{currentLocaleConfig.flag}</span>
        <span className="text-sm font-medium whitespace-nowrap">
          {currentLocaleConfig.nativeName}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      
      {/* Dropdown Menu - Matching Work dropdown style exactly */}
      {dropdownOpen && (
        <div 
          className="absolute left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100] p-4 flex flex-col gap-2"
          role="menu"
          aria-label="Language selection"
        >
          {locales.map((loc) => {
            const config = localeConfig[loc]
            if (!config) {
              console.warn(`Locale config missing for: ${loc}`)
              return null
            }
            const isActive = loc === locale
            return (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleLocaleChange(loc)
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault()
                    const nextIndex = locales.indexOf(loc) + 1
                    if (nextIndex < locales.length) {
                      const nextButton = e.currentTarget.parentElement?.children[nextIndex] as HTMLElement
                      nextButton?.focus()
                    }
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    const prevIndex = locales.indexOf(loc) - 1
                    if (prevIndex >= 0) {
                      const prevButton = e.currentTarget.parentElement?.children[prevIndex] as HTMLElement
                      prevButton?.focus()
                    }
                  }
                }}
                className={cn(
                  "p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition-colors group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                  isActive && "bg-orange-500/10 border border-orange-500/30"
                )}
                aria-selected={isActive}
                aria-checked={isActive}
                role="menuitemradio"
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none" aria-hidden="true">{config.flag}</span>
                  <div className="flex-1">
                    <div className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive 
                        ? "text-orange-500" 
                        : "text-white group-hover:text-orange-500"
                    )}>
                      {config.nativeName}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {config.name}
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-orange-500 text-sm" aria-hidden="true">✓</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
