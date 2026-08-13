"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
    const maxParticles = prefersReducedMotion ? 0 : isMobile ? 18 : 45

    // Theme-aware color
    const getColor = () => {
      const isLight = document.documentElement.classList.contains("light")
      return isLight ? { r: 30, g: 107, b: 255 } : { r: 51, g: 181, b: 255 }
    }

    if (maxParticles === 0) return

    let animationFrameId: number
    let particles: Particle[] = []
    let running = true
    let frameCount = 0
    let color = getColor()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(Math.floor(window.innerWidth / (isMobile ? 35 : 28)), maxParticles)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 1.4 + 0.4,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.35 + 0.08
        })
      }
    }

    const draw = () => {
      if (!running) return
      frameCount++

      // Render every 2nd frame on mobile for performance
      if (isMobile && frameCount % 2 !== 0) {
        animationFrameId = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Refresh color each frame (cheap; allows theme switch reactivity without listeners)
      if (frameCount % 30 === 0) color = getColor()

      const maxConnections = isMobile ? 1 : 2
      const connectionDistance = isMobile ? 80 : 120
      const baseOpacity = document.documentElement.classList.contains("light") ? 0.5 : 1

      particles.forEach((particle, i) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1
        if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * baseOpacity})`
        ctx.fill()

        let connections = 0
        for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
          const dx = particles[j].x - particle.x
          const dy = particles[j].y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            connections++
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.06 * baseOpacity * (1 - distance / connectionDistance)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    try {
      resize()
      createParticles()
      draw()
    } catch (err) {
      console.error("Particle background failed:", err)
      return
    }

    const handleResize = () => {
      resize()
      createParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      running = false
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  )
}
