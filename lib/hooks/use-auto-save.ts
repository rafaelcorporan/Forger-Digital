"use client"

import { useEffect, useRef, useCallback } from "react"

export interface UseAutoSaveOptions {
  data: any
  storageKey: string
  debounceMs?: number
  enabled?: boolean
  onSave?: (data: any) => void
}

export function useAutoSave({
  data,
  storageKey,
  debounceMs = 1000,
  enabled = true,
  onSave,
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef<string>("")

  const saveToStorage = useCallback(
    (dataToSave: any) => {
      try {
        const serialized = JSON.stringify(dataToSave)
        
        // Only save if data has changed
        if (serialized !== lastSavedRef.current) {
          localStorage.setItem(storageKey, serialized)
          lastSavedRef.current = serialized
          onSave?.(dataToSave)
        }
      } catch (error) {
        console.error("Auto-save error:", error)
      }
    },
    [storageKey, onSave]
  )

  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveToStorage(data)
    }, debounceMs)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, debounceMs, enabled, saveToStorage])

  // Load from storage on mount
  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error("Auto-save load error:", error)
    }
    return null
  }, [storageKey])

  // Clear storage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
      lastSavedRef.current = ""
    } catch (error) {
      console.error("Auto-save clear error:", error)
    }
  }, [storageKey])

  return {
    loadFromStorage,
    clearStorage,
    saveToStorage,
  }
}

