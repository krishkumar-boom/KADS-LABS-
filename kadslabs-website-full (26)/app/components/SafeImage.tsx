"use client"

import { ImgHTMLAttributes, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean
  containerClassName?: string
  fallbackText?: string
  priority?: boolean
}

// Standard <img> wrapper that avoids Next.js Image complexities and works
// reliably when the site is opened directly from file:// / content:// URLs.
export default function SafeImage({
  fill,
  containerClassName,
  className,
  alt = "",
  src,
  style,
  loading,
  fallbackText,
  priority,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset error state when src changes
  useEffect(() => {
    setError(false)
  }, [src])

  // priority = eager + fetchpriority=high for above-the-fold; default lazy for below
  const resolvedLoading = loading || (priority ? "eager" : "lazy")

  const imageContent = (
    <img
      src={src}
      alt={alt}
      className={cn(
        fill ? "absolute inset-0 h-full w-full object-cover" : "",
        className
      )}
      style={style}
      loading={resolvedLoading}
      // @ts-expect-error fetchpriority is a valid HTML attribute
      fetchpriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setError(true)}
      {...props}
    />
  )

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        {imageContent}
        {error && mounted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900/90 text-white/50 text-xs text-center p-4">
            <span className="font-medium">{fallbackText || alt || "Image"}</span>
            <span className="text-[10px] mt-1 opacity-70">Failed to load</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {imageContent}
      {error && mounted && (
        <span className="text-xs text-white/40">{fallbackText || alt || "Image unavailable"}</span>
      )}
    </>
  )
}
