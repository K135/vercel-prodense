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
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
      {procedures.map((procedure, index) => (
        <motion.div
          key={procedure.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <Link href={procedure.href} className="block h-full">
            <div className="relative bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-blue-300 group-hover:-translate-y-1 h-full flex flex-col">
              {/* Image Container - Takes up most of the space */}
              <div className="relative flex-1 min-h-[100px] md:min-h-[120px] lg:min-h-[150px] overflow-hidden bg-white">
                <Image
                  src={procedure.image}
                  alt={procedure.name}
                  fill
                  className="object-contain p-2 md:p-3 lg:p-4 group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
                

              </div>
              
              {/* Content - Fixed height at bottom */}
              <div className="p-2 md:p-3 lg:p-4 text-center">
                <h3 className="text-xs md:text-sm lg:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight mb-2">
                  {procedure.name}
                </h3>
                
                {/* Arrow */}
                <div className="flex justify-center">
                  <svg 
                    className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              

            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default PopularProceduresGrid