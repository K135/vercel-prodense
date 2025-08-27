'use client'

import HeadingWithSub from '@/shared/Heading'
import { FC, useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface StatItem {
  number: string
  label: string
}

interface PartnerLogo {
  src: string
  alt: string
}

interface FeatureCard {
  title: string
  description: string
  image?: string
  hasAppStoreLinks?: boolean
  hasGetStartedButton?: boolean
  bgClass?: string
  isFeatureGrid?: boolean
}

interface BusinessStep {
  number: string
  title: string
  description: string
}

interface Props {
  className?: string
  heading?: string
  stats?: StatItem[]
  partnerLogos?: PartnerLogo[]
  featureCards?: FeatureCard[]
  businessSteps?: BusinessStep[]
}

// Counter component for animated numbers
const AnimatedCounter: FC<{ value: string; duration?: number }> = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  // Extract number from string (e.g., "2500+" -> 2500)
  const targetNumber = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const suffix = value.replace(/[0-9]/g, '') // Get the suffix like "+"
  
  // Set starting number based on target (2500+ starts from 2000, others from 0)
  const startNumber = targetNumber >= 2500 ? 2000 : 0

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
      const currentCount = Math.floor(startNumber + (easeOutQuart * (targetNumber - startNumber)))
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isVisible, targetNumber, duration, startNumber])

  return (
    <div ref={counterRef}>
      {count}{suffix}
    </div>
  )
}

const SectionTrustedStats: FC<Props> = ({
  className = '',
  heading = 'See Why We Are Trusted The World Over',
  stats = [
    { number: '2500+', label: 'Patients Treated' },
    { number: '50+', label: 'Partner Clinics' },
  ],
  partnerLogos = [
    { src: '/images/partners/placed.png', alt: 'Placed' },
    { src: '/images/partners/cuebiq.png', alt: 'Cuebiq' },
    { src: '/images/partners/factual.png', alt: 'Factual' },
    { src: '/images/partners/placeiq.png', alt: 'PlaceIQ' },
    { src: '/images/partners/airmeet.png', alt: 'Airmeet' },
    { src: '/images/partners/spen.png', alt: 'Spen' },
    { src: '/images/partners/klippa.png', alt: 'Klippa' },
    { src: '/images/partners/matrix.png', alt: 'Matrix' },
  ],
  featureCards = [
    {
      title: 'We Create Smiles Without Borders',
      description: "At Prodense, we believe a smile shouldn't be limited by geography. From affordable, world-class treatments in India's top clinics, to seamless travel and accommodation, we make your dental journey stress-free and memorable.",
      image: '/We Create Smiles Without Borders.png',
      hasAppStoreLinks: true,
    },
    {
      title: 'Prodense Is Peoples 1st Choice',
      description: 'Experience world-class dental care with our comprehensive approach to your oral health journey',
      hasGetStartedButton: true,
      bgClass: 'bg-gradient-to-br from-[#E85D04]/10 to-[#F77F00]/20 dark:from-[#E85D04]/20 dark:to-[#F77F00]/30',
      isFeatureGrid: true,
    },
  ],
  businessSteps = [
    {
      number: '1',
      title: 'Book Consultation',
      description: 'Start with a virtual consultation with our certified dental specialists. Get personalized treatment plans and cost estimates.',
    },
    {
      number: '2',
      title: 'Plan Your Journey',
      description: 'We coordinate your travel, accommodation, and treatment schedule. Everything is planned for your comfort and convenience.',
    },
    {
      number: '3',
      title: 'Receive World-Class Care',
      description: 'Experience premium dental treatments in state-of-the-art facilities with internationally trained specialists.',
    },
  ],
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Stats and Partners Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-end gap-8 lg:gap-12">
            {/* Stats Section */}
            <div className="lg:w-1/3 mb-8 lg:mb-0">
              <div className="mb-4">
                <h2 className="text-3xl font-semibold text-neutral-950 sm:text-4xl/10 dark:text-white">
                  {heading}
                </h2>
                <h3 className="text-lg font-normal text-neutral-500 dark:text-neutral-400 mt-2">
                  Trusted by patients worldwide
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-neutral-100 dark:border-neutral-700"
                  >
                    <div className="text-center">
                      <h3 className="text-4xl lg:text-5xl font-bold text-primary-500 dark:text-primary-400 mb-3">
                        <AnimatedCounter value={stat.number} duration={2500} />
                      </h3>
                      <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partners Section */}
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <ul className="flex flex-wrap items-center justify-start gap-4 lg:gap-6">
                {partnerLogos.map((logo, index) => (
                  <li key={index} className="inline-block min-w-[100px] px-4 lg:px-5 py-2">
                    <img 
                      src={logo.src} 
                      alt={logo.alt}
                      className="h-8 lg:h-10 w-auto object-contain vertical-align-middle inline-block opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featureCards.map((card, index) => (
              <div 
                key={index} 
                className={`rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  card.bgClass || 'bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="p-8 lg:p-10">
                  <div className="mb-6">
                    <h3 className="text-2xl lg:text-3xl font-medium text-black dark:text-white mb-4">
                      {card.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">
                      {card.description}
                    </p>
                  </div>

                  {/* Feature Grid for "Why People Choose Prodense" */}
                  {card.isFeatureGrid && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      {/* Accredited Dentists */}
                      <div className="group hover:transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white/70 dark:bg-neutral-700/50 rounded-xl p-6 h-full border border-primary-100 dark:border-primary-800/30 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 backdrop-blur-sm border border-primary-200/30 dark:border-primary-400/30 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-primary-800 dark:text-primary-300 mb-2">
                                Accredited Dentists
                              </h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Certified professionals with international standards and years of specialized experience
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post-Treatment Support */}
                      <div className="group hover:transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white/70 dark:bg-neutral-700/50 rounded-xl p-6 h-full border border-primary-100 dark:border-primary-800/30 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 backdrop-blur-sm border border-primary-200/30 dark:border-primary-400/30 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-primary-800 dark:text-primary-300 mb-2">
                                Post-Treatment Support
                              </h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                24/7 care and comprehensive follow-up services to ensure your complete recovery
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Worldwide Continuity */}
                      <div className="group hover:transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white/70 dark:bg-neutral-700/50 rounded-xl p-6 h-full border border-primary-100 dark:border-primary-800/30 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 backdrop-blur-sm border border-primary-200/30 dark:border-primary-400/30 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-primary-800 dark:text-primary-300 mb-2">
                                Worldwide Continuity
                              </h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Prodense global network coverage ensuring seamless care wherever you are
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Transparent Pricing */}
                      <div className="group hover:transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white/70 dark:bg-neutral-700/50 rounded-xl p-6 h-full border border-primary-100 dark:border-primary-800/30 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 backdrop-blur-sm border border-primary-200/30 dark:border-primary-400/30 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-primary-800 dark:text-primary-300 mb-2">
                                Transparent Pricing
                              </h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                No hidden fees with clear, upfront cost breakdown for all treatments and services
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Get Started Button */}
                  {card.hasGetStartedButton && (
                    <div className="mb-6">
                      <Link 
                        href="#" 
                        className="inline-flex items-center px-6 py-3 bg-[#DB3116] hover:bg-[#DB3116]/90 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Get Started Now
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Card Image - Only show if image exists and it's not a feature grid */}
                {card.image && !card.isFeatureGrid && (
                  <div className="px-8 pb-8">
                    <div className="rounded-2xl overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SectionTrustedStats