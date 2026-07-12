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
    const isMobile = window.matchMedia("(pointer: coarse)").matches
    const maxParticles = prefersReducedMotion ? 0 : isMobile ? 20 : 50

    if (maxParticles === 0) {
      // Draw a static gradient instead
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      )
      gradient.addColorStop(0, "rgba(30, 107, 255, 0.08)")
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return
    }

    let animationFrameId: number
    let particles: Particle[] = []
    let running = true
    let frameCount = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(Math.floor(window.innerWidth / 25), maxParticles)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.4 + 0.1
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

      const maxConnections = isMobile ? 1 : 2
      const connectionDistance = isMobile ? 80 : 120

      particles.forEach((particle, i) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1
        if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(30, 107, 255, ${particle.opacity})`
        ctx.fill()

        let connections = 0
        for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
          const dx = particles[j].x - particle.x
          const dy = particles[j].y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            connections++
            ctx.beginPath()
            ctx.strokeStyle = `rgba(30, 107, 255, ${0.08 * (1 - distance / connectionDistance)})`
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
      aria-hidden="true"
    />
  )
}
