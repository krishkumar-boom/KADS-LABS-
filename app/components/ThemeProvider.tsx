"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = "kads-theme"

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyThemeClass(theme: "dark" | "light") {
  const html = document.documentElement
  if (theme === "dark") {
    html.classList.remove("light")
    html.classList.add("dark")
  } else {
    html.classList.remove("dark")
    html.classList.add("light")
  }
  // Update meta theme-color for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
  if (metaTheme) {
    metaTheme.content = theme === "dark" ? "#050B18" : "#f8fafc"
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  return stored || "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark"
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const t = stored || "system"
    return t === "system" ? getSystemTheme() : t
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const resolved = theme === "system" ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyThemeClass(resolved)

    const listener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const resolved = e.matches ? "dark" : "light"
        setResolvedTheme(resolved)
        applyThemeClass(resolved)
      }
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme
    setResolvedTheme(resolved)
    applyThemeClass(resolved)
  }

  const toggleTheme = () => {
    const current = resolvedTheme
    const next: Theme = current === "dark" ? "light" : "dark"
    setTheme(next)
  }

  // Prevent flash of wrong theme by keeping dark until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // SSR / static export fallback so components never crash outside the provider.
    return {
      theme: "dark" as Theme,
      resolvedTheme: "dark" as "dark" | "light",
      setTheme: () => {},
      toggleTheme: () => {}
    }
  }
  return context
}
