'use client'

import { useEffect } from 'react'

interface SmoothScrollingProps {
  children: React.ReactNode
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      return // Don't apply smooth scrolling if user prefers reduced motion
    }

    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const smoothScroll = (e: WheelEvent) => {
      // Don't interfere with horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return
      }

      // Don't interfere if user is scrolling inside a scrollable element
      let target = e.target as Element
      while (target && target !== document.body) {
        const computedStyle = window.getComputedStyle(target)
        if (computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto') {
          return
        }
        target = target.parentElement as Element
      }

      e.preventDefault()

      const delta = e.deltaY
      const scrollStep = Math.sign(delta) * Math.min(Math.abs(delta), 100) * 2

      if (!isScrolling) {
        isScrolling = true
        
        const currentScroll = window.pageYOffset
        const targetScroll = Math.max(0, Math.min(
          currentScroll + scrollStep,
          document.documentElement.scrollHeight - window.innerHeight
        ))

        // Use requestAnimationFrame for smooth scrolling
        const animateScroll = () => {
          const currentPos = window.pageYOffset
          const distance = targetScroll - currentPos
          
          if (Math.abs(distance) > 1) {
            window.scrollTo(0, currentPos + distance * 0.1)
            requestAnimationFrame(animateScroll)
          } else {
            window.scrollTo(0, targetScroll)
            isScrolling = false
          }
        }

        requestAnimationFrame(animateScroll)
      }

      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      // Set a timeout to reset scrolling state
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 150)
    }

    // Add event listener
    document.addEventListener('wheel', smoothScroll, { passive: false })

    // Cleanup
    return () => {
      document.removeEventListener('wheel', smoothScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  return <>{children}</>
}