'use client'

import { Heading } from '@/shared/Heading'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon, 
  HeartIcon, 
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  CheckCircleIcon,
  CreditCardIcon,
  UserGroupIcon,
  GiftIcon
} from '@heroicons/react/24/solid'

interface Props {
  className?: string
}

interface FlowStep {
  id: number
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<any>
  solidIcon: React.ComponentType<any>
  features: string[]
  highlights: string[]
  delay: number
  position: { x: number; y: number }
  side: 'left' | 'right'
}

const PATIENT_FLOW_STEPS: FlowStep[] = [
  {
    id: 1,
    title: "Discover & Research",
    subtitle: "Find Perfect Treatment",
    description: "Browse verified clinics and compare treatment options with authentic patient reviews.",
    icon: MagnifyingGlassIcon,
    solidIcon: CheckCircleIcon,
    features: [
      "Browse 500+ verified clinics",
      "Compare treatment packages",
      "Read authentic reviews",
      "Virtual clinic tours"
    ],
    highlights: ["Free Consultation"],
    delay: 500,
    position: { x: 15, y: 20 },
    side: 'left'
  },
  {
    id: 2,
    title: "Book & Prepare",
    subtitle: "Secure Your Journey",
    description: "Complete secure booking and receive comprehensive travel preparation guidance.",
    icon: CalendarDaysIcon,
    solidIcon: CreditCardIcon,
    features: [
      "Instant booking confirmation",
      "Secure payment options",
      "Document verification",
      "Travel assistance"
    ],
    highlights: ["24/7 Support"],
    delay: 1000,
    position: { x: 85, y: 35 },
    side: 'right'
  },
  {
    id: 3,
    title: "Experience & Treatment",
    subtitle: "World-Class Care",
    description: "Experience premium dental treatment with luxury accommodations and cultural tours.",
    icon: HeartIcon,
    solidIcon: UserGroupIcon,
    features: [
      "VIP airport pickup",
      "5-star accommodations",
      "Premium dental care",
      "Cultural experiences"
    ],
    highlights: ["Premium Care"],
    delay: 1500,
    position: { x: 15, y: 65 },
    side: 'left'
  },
  {
    id: 4,
    title: "Aftercare & Loyalty",
    subtitle: "Lifelong Partnership",
    description: "Continue your care journey with global network support and exclusive rewards.",
    icon: TrophyIcon,
    solidIcon: GiftIcon,
    features: [
      "Digital treatment records",
      "Global follow-up care",
      "Loyalty rewards program",
      "Priority booking"
    ],
    highlights: ["Lifetime Support"],
    delay: 2000,
    position: { x: 85, y: 80 },
    side: 'right'
  }
]

const SectionPatientFlow: FC<Props> = ({ className }) => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [pathProgress, setPathProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true)
            // Start automatic animation sequence
            PATIENT_FLOW_STEPS.forEach((step, index) => {
              setTimeout(() => {
                setVisibleSteps(prev => [...prev, step.id])
                setPathProgress((index + 1) / PATIENT_FLOW_STEPS.length * 100)
              }, step.delay)
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  // Generate S-shaped path
  const generateSPath = () => {
    const points = PATIENT_FLOW_STEPS.map(step => step.position)
    if (points.length < 2) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i]
      const previous = points[i - 1]
      
      // Create S-curve with control points
      const midX = (previous.x + current.x) / 2
      const midY = (previous.y + current.y) / 2
      
      // Alternate curve direction for S-shape
      const curveOffset = i % 2 === 0 ? 20 : -20
      const control1X = previous.x + (midX - previous.x) * 0.3
      const control1Y = previous.y + curveOffset
      const control2X = current.x - (current.x - midX) * 0.3
      const control2Y = current.y - curveOffset
      
      path += ` C ${control1X} ${control1Y} ${control2X} ${control2Y} ${current.x} ${current.y}`
    }
    
    return path
  }

  return (
    <div 
      ref={sectionRef}
      className={clsx(
        'relative pt-2 pb-12 lg:pt-3 lg:pb-16 overflow-hidden bg-white dark:bg-neutral-900',
        className
      )}
    >
      {/* Blue Glassmorphism Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Large glassmorphism blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#e6ba47]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e6ba47]/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#e6ba47]/4 rounded-full blur-3xl"></div>
        
        {/* Medium glassmorphism elements */}
        <div className="absolute top-32 right-1/4 w-48 h-48 bg-[#e6ba47]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-[#e6ba47]/7 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Small floating glassmorphism dots */}
        {[
          { left: 12, top: 15, delay: 0.5, duration: 4.2 },
          { left: 78, top: 8, delay: 2.1, duration: 5.8 },
          { left: 35, top: 25, delay: 1.3, duration: 3.7 },
          { left: 89, top: 42, delay: 3.2, duration: 6.1 },
          { left: 6, top: 58, delay: 0.8, duration: 4.9 },
          { left: 52, top: 72, delay: 2.7, duration: 3.4 },
          { left: 91, top: 88, delay: 1.9, duration: 5.3 },
          { left: 23, top: 91, delay: 4.1, duration: 4.6 },
          { left: 67, top: 78, delay: 0.3, duration: 6.7 },
          { left: 41, top: 5, delay: 3.8, duration: 3.9 },
          { left: 15, top: 45, delay: 1.6, duration: 5.2 },
          { left: 83, top: 62, delay: 2.4, duration: 4.1 },
          { left: 58, top: 18, delay: 4.7, duration: 6.3 },
          { left: 29, top: 83, delay: 0.9, duration: 3.8 },
          { left: 74, top: 29, delay: 3.5, duration: 5.7 },
          { left: 8, top: 76, delay: 1.2, duration: 4.4 },
          { left: 96, top: 15, delay: 2.8, duration: 6.9 },
          { left: 45, top: 52, delay: 4.3, duration: 3.6 },
          { left: 62, top: 95, delay: 0.6, duration: 5.1 },
          { left: 31, top: 38, delay: 3.9, duration: 4.8 }
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-[#e6ba47]/20 rounded-full blur-sm animate-pulse"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Side - Title & Description (30%) */}
          <div className="lg:w-[30%] lg:sticky lg:top-24 lg:self-center">
            <div className="space-y-6 flex flex-col justify-center h-full lg:min-h-[500px]">
              <div className="relative">
               
              </div>
              
              <Heading 
                className="text-3xl font-semibold text-neutral-950 sm:text-4xl/10 dark:text-white"
                level={2}
              >
                Journey Of Your
                <span className="block text-[#e6ba47] mt-2">Perfect Smile</span>
              </Heading>
              
              <div className="space-y-4">
                <p className="text-lg lg:text-xl text-neutral-700 dark:text-neutral-200 leading-relaxed">
                  Experience a seamless journey from discovery to lifelong care.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive Journey Map (70%) - NO BOX */}
          <div className="lg:w-[70%] relative">
            <div className="relative h-[600px] lg:h-[700px]">
              
              {/* Additional glassmorphism scattered around */}
              <div className="absolute top-16 right-16 w-40 h-40 bg-[#e6ba47]/5 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-16 left-16 w-32 h-32 bg-[#e6ba47]/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 left-1/2 w-28 h-28 bg-[#e6ba47]/6 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
              <div className="absolute bottom-1/3 right-1/3 w-36 h-36 bg-[#e6ba47]/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              {/* S-Shaped Path SVG */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e6ba47" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#e6ba47" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#e6ba47" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Background S-path */}
                <path
                  d={generateSPath()}
                  stroke="#e6ba47"
                  strokeWidth="0.4"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray="4,4"
                />
                
                {/* Animated progress S-path */}
                <path
                  d={generateSPath()}
                  stroke="url(#pathGradient)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="100"
                  strokeDashoffset={100 - pathProgress}
                  className="transition-all duration-2000 ease-out"
                  filter="url(#glow)"
                />
              </svg>

              {/* Expandable Step Cards */}
              {PATIENT_FLOW_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={clsx(
                    'absolute transition-all duration-800 ease-out group hover:z-50',
                    // Top cards (1,2) get higher z-index, bottom cards (3,4) get lower z-index
                    step.id <= 2 ? 'z-30' : 'z-10',
                    visibleSteps.includes(step.id) 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-90'
                  )}
                  style={{
                    left: step.side === 'left' ? '0%' : '45%',
                    top: `${step.position.y - 12}%`,
                    transitionDelay: `${step.delay}ms`
                  }}
                >
                  {/* Expandable Step Card */}
                  <div className="w-72 group-hover:w-80 p-5 rounded-3xl shadow-2xl border bg-white/95 dark:bg-neutral-800/95 border-[#e6ba47]/20 backdrop-blur-sm hover:scale-105 transition-all duration-500 hover:shadow-3xl hover:border-[#e6ba47]/40">
                    
                    {/* Step Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-[#e6ba47] to-[#e6ba47]/80 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-7 h-7 text-white" />
                        
                        {/* Step number */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border-2 border-[#e6ba47]">
                          <span className="text-xs font-bold text-[#e6ba47]">{step.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight group-hover:text-[#e6ba47] transition-colors duration-300">{step.title}</h3>
                        <p className="text-sm text-[#e6ba47] font-semibold mt-1">{step.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
                      {step.description}
                    </p>
                    
                    {/* Highlight */}
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-[#e6ba47]/10 text-[#e6ba47] text-xs font-semibold rounded-full border border-[#e6ba47]/20 group-hover:bg-[#e6ba47]/20 group-hover:border-[#e6ba47]/40 transition-all duration-300">
                        {step.highlights[0]}
                      </span>
                    </div>
                    
                    {/* Features List - Hidden by default, shown on hover */}
                    <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 overflow-hidden transition-all duration-500 ease-out">
                      <ul className="space-y-2 pt-2">
                        {step.features.map((feature, featureIndex) => (
                          <li 
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-all duration-300"
                            style={{ 
                              transitionDelay: `${featureIndex * 50}ms` 
                            }}
                          >
                            <step.solidIcon className="w-4 h-4 text-[#e6ba47] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hover indicator - shown when not hovering */}
                    <div className="mt-3 text-center opacity-60 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="text-xs text-[#e6ba47] font-medium">
                        Hover to see features
                      </div>
                    </div>
                  </div>

                  {/* Connection line to path */}
                  <div 
                    className={clsx(
                      'absolute w-px h-8 bg-gradient-to-b from-[#e6ba47] to-transparent transition-all duration-500',
                      step.side === 'left' ? 'right-0 top-1/2' : 'left-0 top-1/2',
                      visibleSteps.includes(step.id) ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{ transitionDelay: `${step.delay + 200}ms` }}
                  />
                </div>
              ))}

              {/* Step Circles on Path - Only for cards 2 and 4 */}
              {PATIENT_FLOW_STEPS.filter(step => step.id === 2 || step.id === 4).map((step) => (
                <div
                  key={`circle-${step.id}`}
                  className={clsx(
                    'absolute w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-500 z-10',
                    visibleSteps.includes(step.id) 
                      ? 'bg-[#e6ba47] scale-125' 
                      : 'bg-[#e6ba47]/30 scale-100'
                  )}
                  style={{
                    left: `${step.position.x}%`,
                    top: `${step.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transitionDelay: `${step.delay}ms`
                  }}
                >
                  {visibleSteps.includes(step.id) && (
                    <div className="absolute inset-0 rounded-full bg-[#e6ba47]/30 animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 flex items-center justify-center space-x-3">
              {PATIENT_FLOW_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={clsx(
                    'relative transition-all duration-300',
                    visibleSteps.includes(step.id) ? 'scale-125' : ''
                  )}
                >
                  <div
                    className={clsx(
                      'w-3 h-3 rounded-full transition-all duration-300',
                      visibleSteps.includes(step.id) 
                        ? 'bg-[#e6ba47] shadow-lg' 
                        : 'bg-[#e6ba47]/20'
                    )}
                  />
                  {visibleSteps.includes(step.id) && (
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#e6ba47]/30 animate-ping" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionPatientFlow