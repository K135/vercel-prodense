'use client'

import { useEffect } from 'react'

export default function SmoothScrollProvider() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      return // Don't apply smooth scrolling if user prefers reduced motion
    }

    // Apply CSS smooth scrolling only - much more performant
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.style.scrollBehavior = 'smooth'

    // Cleanup function
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
      document.body.style.scrollBehavior = 'auto'
    }
  }, [])

  return null // This component doesn't render anything
}