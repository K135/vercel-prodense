'use client'

import { useEffect } from 'react'

interface SmoothScrollOptions {
  duration?: number
  easing?: (t: number) => number
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const { duration = 1000, easing = (t: number) => t * (2 - t) } = options

  useEffect(() => {
    let isScrolling = false

    const smoothScrollTo = (targetY: number, duration: number) => {
      const startY = window.pageYOffset
      const distance = targetY - startY
      const startTime = performance.now()

      const scrollStep = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)

        window.scrollTo(0, startY + distance * easedProgress)

        if (progress < 1) {
          requestAnimationFrame(scrollStep)
        } else {
          isScrolling = false
        }
      }

      if (!isScrolling) {
        isScrolling = true
        requestAnimationFrame(scrollStep)
      }
    }

    const handleWheelScroll = (e: WheelEvent) => {
      // Only apply smooth scrolling for regular wheel events, not when user is already scrolling smoothly
      if (isScrolling) return

      e.preventDefault()
      
      const delta = e.deltaY
      const scrollAmount = delta * 3 // Adjust multiplier for scroll sensitivity
      const currentY = window.pageYOffset
      const targetY = Math.max(0, Math.min(currentY + scrollAmount, document.body.scrollHeight - window.innerHeight))

      smoothScrollTo(targetY, duration)
    }

    // Add smooth scrolling for wheel events
    const addSmoothScrolling = () => {
      document.addEventListener('wheel', handleWheelScroll, { passive: false })
    }

    // Remove smooth scrolling
    const removeSmoothScrolling = () => {
      document.removeEventListener('wheel', handleWheelScroll)
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      addSmoothScrolling()
    }

    return () => {
      removeSmoothScrolling()
    }
  }, [duration, easing])

  // Function to scroll to a specific element smoothly
  const scrollToElement = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (element) {
      const targetY = element.offsetTop - offset
      const startY = window.pageYOffset
      const distance = targetY - startY
      const startTime = performance.now()

      const scrollStep = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)

        window.scrollTo(0, startY + distance * easedProgress)

        if (progress < 1) {
          requestAnimationFrame(scrollStep)
        }
      }

      requestAnimationFrame(scrollStep)
    }
  }

  return { scrollToElement }
}