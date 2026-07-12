"use client"

import { motion } from "framer-motion"
import { ReactNode, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  variant?: "primary" | "outline" | "ghost"
  onClick?: () => void
  href?: string
  external?: boolean
  ariaLabel?: string
  /** override magnetic strength (0 = no magnetism); default maps ~8px max pull */
  strength?: number
}

export default function MagneticButton({
  children,
  className = "",
  variant = "primary",
  onClick,
  href,
  external,
  ariaLabel,
  strength = 0.35
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    // Magnetic field: include 20px padding around the button
    const pad = 20
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(relX, relY)
    const maxDist = Math.hypot(rect.width / 2 + pad, rect.height / 2 + pad)

    if (distance > maxDist) {
      setPosition({ x: 0, y: 0 })
      return
    }
    // Clamp translation to ~8px max, fall off smoothly at edge
    const falloff = 1 - distance / maxDist
    const maxTranslate = 8
    const x = Math.max(-maxTranslate, Math.min(maxTranslate, relX * strength * falloff))
    const y = Math.max(-maxTranslate, Math.min(maxTranslate, relY * strength * falloff))
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const variants = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost: "text-white/80 hover:text-white transition-colors"
  }

  const isExternal = external || (href ? href.startsWith("http") : false)
  const isHash = href ? href.startsWith("#") : false

  const handleClick = (e: React.MouseEvent) => {
    if (isHash && href) {
      e.preventDefault()
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    }
    onClick?.()
  }

  const motionProps = {
    animate: { x: position.x, y: position.y },
    transition: { type: "spring", stiffness: 250, damping: 12, mass: 0.4 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={handleClick}
        {...motionProps}
        className={cn(variants[variant], className)}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      {...motionProps}
      className={cn(variants[variant], className)}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </motion.button>
  )
}
