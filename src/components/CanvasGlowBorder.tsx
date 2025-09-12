'use client'

import React, { useRef, useEffect, ReactNode } from 'react'

interface CanvasGlowBorderProps {
  children: ReactNode
  className?: string
  glowColor?: string
  sharpColor?: string
  animationSpeed?: number
}

export default function CanvasGlowBorder({ 
  children, 
  className = '',
  glowColor = '#D35C2F',
  sharpColor = '#FF4A2B',
  animationSpeed = 0.01
}: CanvasGlowBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let angle = 0

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    const draw = () => {
      if (!ctx || !canvas) return

      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)

      // Draw outer glow (most blurred)
      ctx.save()
      ctx.filter = 'blur(20px) brightness(1.8)'
      const outerGlowGradient = ctx.createConicGradient(angle, width / 2, height / 2)
      outerGlowGradient.addColorStop(0, 'transparent')
      outerGlowGradient.addColorStop(0.03, glowColor + 'FF') // Full opacity
      outerGlowGradient.addColorStop(0.08, glowColor + 'CC') // 80% opacity
      outerGlowGradient.addColorStop(0.2, 'transparent')
      ctx.strokeStyle = outerGlowGradient
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.roundRect(6, 6, width - 12, height - 12, 24)
      ctx.stroke()
      ctx.restore()

      // Draw medium glow
      ctx.save()
      ctx.filter = 'blur(12px) brightness(1.5)'
      const mediumGlowGradient = ctx.createConicGradient(angle, width / 2, height / 2)
      mediumGlowGradient.addColorStop(0, 'transparent')
      mediumGlowGradient.addColorStop(0.04, sharpColor + 'FF') // Full opacity
      mediumGlowGradient.addColorStop(0.12, sharpColor + '99') // 60% opacity
      mediumGlowGradient.addColorStop(0.18, 'transparent')
      ctx.strokeStyle = mediumGlowGradient
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.roundRect(4, 4, width - 8, height - 8, 24)
      ctx.stroke()
      ctx.restore()

      // Draw sharp glowing border
      const sharpGradient = ctx.createConicGradient(angle, width / 2, height / 2)
      sharpGradient.addColorStop(0, 'transparent')
      sharpGradient.addColorStop(0.05, sharpColor + 'FF') // Full opacity
      sharpGradient.addColorStop(0.15, 'transparent')
      ctx.strokeStyle = sharpGradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(2, 2, width - 4, height - 4, 24)
      ctx.stroke()

      angle += animationSpeed
      animationRef.current = requestAnimationFrame(draw)
    }

    // Initial setup
    updateCanvasSize()
    draw()

    // Handle resize
    const resizeObserver = new ResizeObserver(updateCanvasSize)
    resizeObserver.observe(container)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      resizeObserver.disconnect()
    }
  }, [glowColor, sharpColor, animationSpeed])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ borderRadius: '24px' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}