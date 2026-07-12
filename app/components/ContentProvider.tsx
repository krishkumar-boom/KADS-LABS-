"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import {
  SiteData,
  SiteContent,
  defaultSiteData,
  defaultContent,
  loadSiteDataFromStorage,
  saveSiteDataToStorage,
  sanitizeSiteData
} from "@/lib/content"
import { useLanguage } from "./LanguageProvider"
import { applyHindiTranslations } from "@/lib/translations"

interface ContentContextType {
  content: SiteContent
  siteData: SiteData
  updateContent: (updates: Partial<SiteContent>) => Promise<void>
  updateSection: <K extends keyof SiteData>(section: K, value: SiteData[K]) => Promise<void>
  refresh: () => Promise<void>
  isLoading: boolean
  lastSaved: number | null
  demoMode: boolean
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData)
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  const localizeSiteData = useCallback((data: SiteData): SiteData => {
    if (language === "hi") {
      return sanitizeSiteData(applyHindiTranslations(data))
    }
    return sanitizeSiteData(data)
  }, [language])

  const applySiteData = useCallback((data: SiteData) => {
    const sanitized = localizeSiteData(data)
    setSiteData(sanitized)
    setContent(sanitized.siteContent)
  }, [localizeSiteData])

  const load = useCallback(async () => {
    setIsLoading(true)
    const local = loadSiteDataFromStorage()
    applySiteData(local)

    if (!hasSupabaseCredentials()) {
      setDemoMode(true)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.from("site_data").select("key, value")
      if (error) throw error

      const updates: Partial<SiteData> = {}
      if (data && data.length > 0) {
        data.forEach((row) => {
          const key = row.key as keyof SiteData
          if (key in defaultSiteData) {
            try {
              // jsonb is returned as a parsed object by Supabase, but realtime may send a string.
              const parsed = typeof row.value === "string" ? JSON.parse(row.value) : row.value
              updates[key] = parsed
            } catch (e) {
              console.error(`Failed to parse site_data row ${key}:`, e)
            }
          }
        })
      }

      const merged = sanitizeSiteData({ ...local, ...updates })
      applySiteData(merged)
      saveSiteDataToStorage(merged)

      const channel = supabase
        .channel("site_data_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "site_data" },
          (payload) => {
            const newRow = payload.new as { key: keyof SiteData; value: string } | null
            if (!newRow) return
            try {
              const value = typeof newRow.value === "string" ? JSON.parse(newRow.value) : newRow.value
              setSiteData((prev) => {
                const updated = localizeSiteData({ ...prev, [newRow.key]: value } as SiteData)
                saveSiteDataToStorage(updated)
                return updated
              })
              if (newRow.key === "siteContent") {
                setContent(language === "hi" ? { ...value, ...applyHindiTranslations({ siteContent: value }).siteContent } : value)
              }
            } catch (e) {
              console.error("Realtime update parse failed:", e)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (err) {
      console.error("Supabase site data load failed:", err)
      setDemoMode(true)
    } finally {
      setIsLoading(false)
    }
  }, [applySiteData])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    load().then((unsub) => {
      cleanup = unsub
    })
    return () => {
      cleanup?.()
    }
  }, [load])

  const updateSection = useCallback(async <K extends keyof SiteData>(section: K, value: SiteData[K]) => {
    const updated = { ...siteData, [section]: value, updatedAt: Date.now() }
    applySiteData(updated)
    saveSiteDataToStorage(updated)
    setLastSaved(Date.now())

    if (!hasSupabaseCredentials()) return

    try {
      await supabase
        .from("site_data")
        .upsert(
          { key: section, value: JSON.stringify(value), updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )
    } catch (err) {
      console.error(`Supabase update failed for ${section}:`, err)
    }
  }, [siteData, applySiteData])

  const updateContent = useCallback(async (updates: Partial<SiteContent>) => {
    const newContent = { ...siteData.siteContent, ...updates }
    await updateSection("siteContent", newContent)
  }, [siteData.siteContent, updateSection])

  const refresh = useCallback(async () => {
    await load()
  }, [load])

  return (
    <ContentContext.Provider
      value={{
        content,
        siteData,
        updateContent,
        updateSection,
        refresh,
        isLoading,
        lastSaved,
        demoMode
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  const context = useContext(ContentContext)
  if (!context) throw new Error("useContent must be used within ContentProvider")
  return context
}

export const useSiteData = useContent
