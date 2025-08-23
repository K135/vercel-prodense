'use client'

import { FC, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Heading } from '@/shared/Heading'

interface Props {
  className?: string
}

// Counter component for animated numbers
const AnimatedCounter: FC<{ end: number; duration?: number }> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={counterRef}>
      {count}
    </div>
  )
}

const SectionGetToKnowAboutUs: FC<Props> = ({ className = '' }) => {
  return (
    <section className={`relative py-4 lg:py-8 bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-blue-900/10 overflow-hidden ${className}`}>
      {/* Background Shapes - Enhanced with better positioning */}
      <div className="absolute top-20 left-10 lg:top-32 lg:left-20 opacity-40 hidden lg:block animate-pulse">
        <img src="/assets/img/shape/about-three__shape1.png" alt="decorative shape" className="w-16 h-16 lg:w-24 lg:h-24" />
      </div>
      <div className="absolute left-1/4 bottom-20 opacity-20 hidden lg:block animate-pulse" style={{ animationDelay: '1s' }}>
        <img src="/assets/img/shape/about-three__shape2.png" alt="decorative shape" className="w-20 h-20 lg:w-28 lg:h-28" />
      </div>
      <div className="absolute top-16 right-10 lg:top-24 lg:right-20 opacity-25 hidden lg:block animate-pulse" style={{ animationDelay: '2s' }}>
        <img src="/assets/img/shape/about-three__shape3.png" alt="decorative shape" className="w-18 h-18 lg:w-26 lg:h-26" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="relative space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center">
                <span className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  About Prodense
                </span>
              </div>
              
              <Heading 
                className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white leading-tight"
                level={2}
              >
                World-Class Dental Care<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0480ea] to-[#0366d6] dark:from-[#0480ea] dark:to-[#0366d6]">
                  Without Borders
                </span>
              </Heading>
              
              <div className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium max-w-2xl">
                <p className="mb-4">At Prodense, we believe that world-class dental care should be accessible, transparent, and seamlessly integrated with life&apos;s journeys.</p>
                <p>We are India&apos;s first dedicated dental tourism enabler, connecting international patients with accredited clinics in India&apos;s most trusted destinations.</p>
              </div>
            </div>



            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="group relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0480ea]/10 transition-all duration-500 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-[#0480ea]/30 dark:hover:border-[#0480ea]/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0480ea]/5 to-[#0480ea]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0480ea] to-[#0366d6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Trusted Dentists & Clinics
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Verified professionals with international certifications and top-quality facilities.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0480ea]/10 transition-all duration-500 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-[#0480ea]/30 dark:hover:border-[#0480ea]/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0480ea]/5 to-[#0480ea]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0480ea] to-[#0366d6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Seamless Travel & Stay
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Curated packages including treatment, accommodation, and travel assistance.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0480ea]/10 transition-all duration-500 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-[#0480ea]/30 dark:hover:border-[#0480ea]/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0480ea]/5 to-[#0480ea]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0480ea] to-[#0366d6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Transparent Pricing
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Upfront Good Faith cost estimates so you know exactly what to expect.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0480ea]/10 transition-all duration-500 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-[#0480ea]/30 dark:hover:border-[#0480ea]/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0480ea]/5 to-[#0480ea]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0480ea] to-[#0366d6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Global Aftercare
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Secure digital records and access to local partner dentists for ongoing support.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-gradient-to-r from-[#0480ea]/5 to-[#0480ea]/10 dark:from-[#0480ea]/10 dark:to-[#0480ea]/20 rounded-3xl p-8 border border-[#0480ea]/20 dark:border-[#0480ea]/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0480ea] to-[#0366d6] rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Our Mission</h3>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    To create smiles without borders by blending healthcare, hospitality, and technology.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0480ea] to-[#0366d6] rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Our Vision</h3>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    To be the world&apos;s most trusted dental tourism partner, making care accessible, affordable, and global.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Image Gallery */}
          <div className="relative max-w-2xl w-full ml-0 xl:ml-12">
            {/* Top Row Images */}
            <div className="flex items-end gap-6 mb-12">
              <div className="flex-1 animate-fade-in-right" style={{ animationDelay: '0ms' }}>
                <div className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="/assets/img/about/dental-tourism-2.jpg" 
                    alt="Professional dental care in beautiful destinations" 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="flex-1 animate-fade-in-right" style={{ animationDelay: '200ms' }}>
                <div className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="/assets/img/about/dental-tourism-3.jpg" 
                    alt="Dental tourism experience with Prodense" 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Image */}
            <div className="ml-16 animate-fade-in-left" style={{ animationDelay: '400ms' }}>
              <div className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img 
                  src="/assets/img/about/dental-tourism-1.jpg" 
                  alt="Quality dental care in India's tourist destinations" 
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>


          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 1.2s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 1.2s ease-out forwards;
          opacity: 0;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default SectionGetToKnowAboutUs