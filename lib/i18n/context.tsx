"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { defaultLocale, locales, type Locale } from '@/i18n/config'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'
import frMessages from '@/messages/fr.json'
import deMessages from '@/messages/de.json'

type Messages = typeof enMessages

const messages: Record<Locale, Messages> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string | string[]
  messages: Messages
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const router = useRouter()
  const pathname = usePathname()

  // Load locale from localStorage or detect from browser
  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') as Locale | null
    if (storedLocale && locales.includes(storedLocale)) {
      setLocaleState(storedLocale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (locales.includes(browserLang as Locale)) {
        setLocaleState(browserLang as Locale)
      }
    }
  }, [])

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
    // Trigger router refresh to update server components if needed
    router.refresh()
  }, [router])

  // Translation function - supports strings and arrays
  const t = (key: string, params?: Record<string, string | number>): string | string[] => {
    const keys = key.split('.')
    let value: any = messages[locale]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    // Return arrays as-is (for results, tags, etc.)
    if (Array.isArray(value)) {
      return value
    }

    // Return non-string values as-is (numbers, booleans, etc.)
    if (typeof value !== 'string') {
      return key
    }

    // Replace parameters in strings
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }

  // Update HTML lang attribute when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  // Memoize context value to ensure proper re-renders when locale changes
  const contextValue = React.useMemo(() => ({
    locale,
    setLocale,
    t,
    messages: messages[locale]
  }), [locale, setLocale, t])

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Hook for translations with type safety
export function useTranslation(namespace?: string) {
  const { t, locale, messages } = useI18n()
  
  const translate = (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey, params)
  }

  return { t: translate, locale, messages }
}

