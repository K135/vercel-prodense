'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Procedure {
  id: string
  name: string
  image: string
  description: string
  href: string
}

const procedures: Procedure[] = [
  {
    id: '1',
    name: 'Root Canal Treatment (RCT)',
    image: '/polular-denta-procedures/Root Canal Treatment (RCT).gif',
    description: 'Save infected teeth with advanced endodontic therapy',
    href: '/procedures/root-canal-treatment'
  },
  {
    id: '2',
    name: 'Dental Crowns',
    image: '/polular-denta-procedures/Dental Crowns.gif',
    description: 'Restore damaged teeth with durable, natural-looking crowns',
    href: '/procedures/dental-crowns'
  },
  {
    id: '3',
    name: 'Laser Dentistry',
    image: '/polular-denta-procedures/Laser Dentistry.gif',
    description: 'Advanced laser treatments for precise dental care',
    href: '/procedures/laser-dentistry'
  },
  {
    id: '4',
    name: 'Clear Aligners / Invisible Braces',
    image: '/polular-denta-procedures/Clear Aligners : Invisible Braces.gif',
    description: 'Straighten teeth discreetly with clear aligners',
    href: '/procedures/clear-aligners'
  },
  {
    id: '5',
    name: 'Dental Fillings / Teeth Fillings',
    image: '/polular-denta-procedures/Dental Fillings : Teeth Fillings.gif',
    description: 'Restore cavities with durable tooth-colored fillings',
    href: '/procedures/dental-fillings'
  },
  {
    id: '6',
    name: 'Wisdom Teeth Removal',
    image: '/polular-denta-procedures/Wisdom Teeth Removal.gif',
    description: 'Safe extraction of problematic wisdom teeth',
    href: '/procedures/wisdom-teeth-removal'
  },
  {
    id: '7',
    name: 'Dental Braces & Aligners',
    image: '/polular-denta-procedures/Dental Braces & Aligners.gif',
    description: 'Comprehensive orthodontic treatment options',
    href: '/procedures/dental-braces-aligners'
  },
  {
    id: '8',
    name: 'Dental Implants / Teeth Implants',
    image: '/polular-denta-procedures/Dental Implants : Teeth Implants.gif',
    description: 'Replace missing teeth with permanent implants',
    href: '/procedures/dental-implants'
  },
  {
    id: '9',
    name: 'Dentures',
    image: '/polular-denta-procedures/Dentures.gif',
    description: 'Custom-fitted dentures for missing teeth replacement',
    href: '/procedures/dentures'
  },
  {
    id: '10',
    name: 'Kids Dentistry',
    image: '/polular-denta-procedures/Kids Dentistry.gif',
    description: 'Specialized dental care for children',
    href: '/procedures/kids-dentistry'
  },
  {
    id: '11',
    name: 'Mouth Ulcers',
    image: '/polular-denta-procedures/Mouth Ulcers.gif',
    description: 'Treatment and prevention of mouth ulcers',
    href: '/procedures/mouth-ulcers'
  },
  {
    id: '12',
    name: 'Advanced Gum Treatment',
    image: '/polular-denta-procedures/Advanced Gum Treatment.gif',
    description: 'Comprehensive periodontal therapy and gum care',
    href: '/procedures/advanced-gum-treatment'
  }
]

const PopularProceduresGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
      {procedures.map((procedure, index) => (
        <motion.div
          key={procedure.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="group"
        >
          <Link href={procedure.href} className="block h-full">
            {/* Glassmorphism Card */}
            <div className="relative bg-white/20 backdrop-blur-md rounded-3xl transition-all duration-500 overflow-hidden border-2 border-[#E5BA47]/20 group-hover:border-[#E5BA47]/60 group-hover:shadow-2xl group-hover:shadow-[#E5BA47]/10 group-hover:-translate-y-3 h-full flex flex-col">
              {/* Glassmorphism background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E5BA47]/5 via-transparent to-[#E5BA47]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated golden glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E5BA47]/20 via-[#E5BA47]/5 to-[#E5BA47]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              {/* GIF Image Container - WHITE BACKGROUND ALWAYS */}
              <div className="relative flex-1 min-h-[120px] md:min-h-[140px] lg:min-h-[160px] overflow-hidden z-10 bg-white rounded-t-3xl">
                <Image
                  src={procedure.image}
                  alt={procedure.name}
                  fill
                  className="object-contain p-3 md:p-4 lg:p-5 group-hover:scale-105 transition-all duration-500 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                  unoptimized={true} // This ensures GIFs play properly
                />
              </div>
              
              {/* Content with glassmorphism */}
              <div className="relative p-3 md:p-4 lg:p-5 text-center z-10">
                {/* Subtle glass separator */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#E5BA47]/30 to-transparent" />
                
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-800 transition-colors duration-300 leading-tight mb-3 line-clamp-2 drop-shadow-sm">
                  {procedure.name}
                </h3>
                
                {/* Enhanced CTA with glassmorphism - Icon only */}
                <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-[#E5BA47]/10 backdrop-blur-sm border border-[#E5BA47]/20 flex items-center justify-center group-hover:bg-[#E5BA47]/20 group-hover:border-[#E5BA47]/30 transition-all duration-300">
                    <svg 
                      className="w-4 h-4 text-[#E5BA47] group-hover:translate-x-0.5 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Golden bottom accent with glassmorphism */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#E5BA47]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm" />
              
              {/* Additional glass reflection effect - only on content area */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent opacity-60 pointer-events-none rounded-b-3xl" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default PopularProceduresGrid