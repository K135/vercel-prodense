'use client'

import React, { useRef, useEffect, ReactNode } from 'react'

interface GeminiBorderProps {
  children: ReactNode
  className?: string
  primaryColor?: string
  secondaryColor?: string
  animationSpeed?: number
}

export default function GeminiBorder({ 
  children, 
  className = '',
  primaryColor = '#D35C2F',
  secondaryColor = '#E6B862',
  animationSpeed = 0.015
}: GeminiBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * 2 // High DPI
      canvas.height = rect.height * 2
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(2, 2)
    }

    const draw = () => {
      if (!ctx || !canvas) return

      const width = canvas.width / 2
      const height = canvas.height / 2
      
      ctx.clearRect(0, 0, width, height)

      time += animationSpeed

      // Create two diagonal moving lines
      const numLines = 2
      
      for (let i = 0; i < numLines; i++) {
        // Both lines move clockwise but start at different positions
        // First line starts at 0°, second line starts at 180° (opposite side)
        const startOffset = i === 0 ? 0 : Math.PI // Second line starts 180° apart
        const rotationTime = time + startOffset
        
        // Create conic gradient that rotates clockwise
        const gradient = ctx.createConicGradient(rotationTime, width / 2, height / 2)
        
        if (i === 0) {
          // First diagonal line - Orange
          gradient.addColorStop(0, 'transparent')
          gradient.addColorStop(0.02, '#B8280F' + 'FF')
          gradient.addColorStop(0.05, '#D35C2F' + 'FF')
          gradient.addColorStop(0.08, '#FF6B1A' + 'DD')
          gradient.addColorStop(0.12, 'transparent')
          gradient.addColorStop(0.88, 'transparent')
          gradient.addColorStop(0.92, '#FF6B1A' + 'DD')
          gradient.addColorStop(0.95, '#D35C2F' + 'FF')
          gradient.addColorStop(0.98, '#B8280F' + 'FF')
          gradient.addColorStop(1, 'transparent')
        } else {
          // Second diagonal line - Gold
          gradient.addColorStop(0, 'transparent')
          gradient.addColorStop(0.02, '#B8860B' + 'FF')
          gradient.addColorStop(0.05, '#DAA520' + 'FF')
          gradient.addColorStop(0.08, '#E6B862' + 'DD')
          gradient.addColorStop(0.12, 'transparent')
          gradient.addColorStop(0.88, 'transparent')
          gradient.addColorStop(0.92, '#E6B862' + 'DD')
          gradient.addColorStop(0.95, '#DAA520' + 'FF')
          gradient.addColorStop(0.98, '#B8860B' + 'FF')
          gradient.addColorStop(1, 'transparent')
        }

        // Apply blur for glow effect
        ctx.save()
        ctx.filter = 'blur(8px) brightness(1.3) saturate(1.2)'

        ctx.strokeStyle = gradient
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.roundRect(6, 6, width - 12, height - 12, 18)
        ctx.stroke()
        ctx.restore()
      }



      animationRef.current = requestAnimationFrame(draw)
    }

    // Initial setup
    updateCanvasSize()
    draw()

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(container)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      resizeObserver.disconnect()
    }
  }, [primaryColor, secondaryColor, animationSpeed])

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