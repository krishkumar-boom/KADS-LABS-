"use client"

import { useEffect } from "react"
import { useContent } from "./ContentProvider"

export default function MetadataUpdater() {
  const { content, siteData } = useContent()

  useEffect(() => {
    const title = siteData.seo?.metaTitle || content.metaTitle
    const description = siteData.seo?.metaDescription || content.metaDescription
    if (title) document.title = title
    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute("content", description)
    }
    if (siteData.seo?.canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement("link")
        link.rel = "canonical"
        document.head.appendChild(link)
      }
      link.href = siteData.seo.canonical
    }
  }, [content, siteData])

  return null
}
