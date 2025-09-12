'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ProcedureModal from './ProcedureModal'

interface Procedure {
  id: string
  name: string
  image: string
  description: string
  detailedDescription: string
  benefits: string[]
  duration: string
  recovery: string
  href: string
}

const procedures: Procedure[] = [
  {
    id: '1',
    name: 'Root Canal Treatment (RCT)',
    image: '/polular-denta-procedures/Root Canal Treatment (RCT).gif',
    description: '',
    detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    benefits: [],
    duration: '60-90 minutes',
    recovery: '2-3 days',
    href: '/procedures/root-canal-treatment'
  },
  {
    id: '2',
    name: 'Dental Crowns',
    image: '/polular-denta-procedures/Dental Crowns.gif',
    description: '',
    detailedDescription: 'Dental crowns are custom-made caps that cover and protect damaged, weakened, or aesthetically compromised teeth. Made from high-quality materials like porcelain, ceramic, or zirconia, our crowns provide excellent durability while maintaining a natural appearance that blends seamlessly with your existing teeth.',
    benefits: [],
    duration: '45-60 minutes per crown',
    recovery: '1-2 days',
    href: '/procedures/dental-crowns'
  },
  {
    id: '3',
    name: 'Laser Dentistry',
    image: '/polular-denta-procedures/Laser Dentistry.gif',
    description: '',
    detailedDescription: 'Laser dentistry represents the cutting-edge of dental treatment, offering precise, minimally invasive procedures with reduced pain and faster healing. Our advanced laser technology is used for gum treatment, cavity preparation, teeth whitening, and soft tissue procedures, providing superior results with maximum patient comfort.',
    benefits: [],
    duration: '30-60 minutes',
    recovery: '1-2 days',
    href: '/procedures/laser-dentistry'
  },
  {
    id: '4',
    name: 'Clear Aligners / Invisible Braces',
    image: '/polular-denta-procedures/Clear Aligners : Invisible Braces.gif',
    description: '',
    detailedDescription: 'Clear aligners offer a virtually invisible way to straighten your teeth without traditional metal braces. These custom-made, removable aligners gradually move your teeth into the desired position. Perfect for adults and teens who want to improve their smile discreetly while maintaining their lifestyle and confidence.',
    benefits: [],
    duration: '6-18 months',
    recovery: 'No downtime',
    href: '/procedures/clear-aligners'
  },
  {
    id: '5',
    name: 'Dental Fillings / Teeth Fillings',
    image: '/polular-denta-procedures/Dental Fillings : Teeth Fillings.gif',
    description: '',
    detailedDescription: 'Modern dental fillings use advanced composite materials that not only restore the function of your teeth but also maintain their natural appearance. Our tooth-colored fillings are mercury-free, durable, and bond directly to your tooth structure, providing excellent protection against further decay.',
    benefits: [],
    duration: '30-45 minutes',
    recovery: 'Immediate',
    href: '/procedures/dental-fillings'
  },
  {
    id: '6',
    name: 'Wisdom Teeth Removal',
    image: '/polular-denta-procedures/Wisdom Teeth Removal.gif',
    description: '',
    detailedDescription: 'Wisdom tooth extraction is often necessary when these third molars cause crowding, pain, or are difficult to clean properly. Our experienced oral surgeons use advanced techniques and sedation options to ensure a comfortable procedure with minimal discomfort and optimal healing.',
    benefits: [],
    duration: '30-60 minutes',
    recovery: '3-7 days',
    href: '/procedures/wisdom-teeth-removal'
  },
  {
    id: '7',
    name: 'Dental Braces & Aligners',
    image: '/polular-denta-procedures/Dental Braces & Aligners.gif',
    description: '',
    detailedDescription: 'Our comprehensive orthodontic treatments include traditional braces, ceramic braces, and clear aligners to address various teeth alignment issues. We create personalized treatment plans to achieve optimal results, whether you need minor adjustments or major corrections to your bite and smile.',
    benefits: [],
    duration: '12-24 months',
    recovery: 'Ongoing adjustments',
    href: '/procedures/dental-braces-aligners'
  },
  {
    id: '8',
    name: 'Dental Implants / Teeth Implants',
    image: '/polular-denta-procedures/Dental Implants : Teeth Implants.gif',
    description: '',
    detailedDescription: 'Dental implants are the gold standard for replacing missing teeth. These titanium posts are surgically placed into the jawbone and topped with natural-looking crowns. Implants provide a permanent solution that looks, feels, and functions like your natural teeth while preserving jawbone health.',
    benefits: [],
    duration: '3-6 months (including healing)',
    recovery: '1-2 weeks initial, 3-6 months full integration',
    href: '/procedures/dental-implants'
  },
  {
    id: '9',
    name: 'Dentures',
    image: '/polular-denta-procedures/Dentures.gif',
    description: '',
    detailedDescription: 'Our custom-fitted dentures provide a comfortable and affordable solution for replacing multiple missing teeth. Using advanced materials and precise fitting techniques, we create dentures that restore your ability to eat, speak, and smile confidently while maintaining proper facial support.',
    benefits: [],
    duration: '2-4 weeks (multiple appointments)',
    recovery: '1-2 weeks adjustment period',
    href: '/procedures/dentures'
  },
  {
    id: '10',
    name: 'Kids Dentistry',
    image: '/polular-denta-procedures/Kids Dentistry.gif',
    description: '',
    detailedDescription: 'Our pediatric dentistry services are designed specifically for children, creating a fun, comfortable environment that helps build positive associations with dental care. We focus on preventive care, early intervention, and education to ensure your child develops healthy oral habits for life.',
    benefits: [],
    duration: '30-45 minutes',
    recovery: 'Immediate',
    href: '/procedures/kids-dentistry'
  },
  {
    id: '11',
    name: 'Mouth Ulcers',
    image: '/polular-denta-procedures/Mouth Ulcers.gif',
    description: '',
    detailedDescription: 'Mouth ulcers can be painful and disruptive to daily life. Our comprehensive treatment approach includes identifying underlying causes, providing immediate pain relief, and implementing preventive strategies to reduce recurrence. We use both traditional and laser therapy for optimal healing.',
    benefits: [],
    duration: '15-30 minutes',
    recovery: '3-7 days',
    href: '/procedures/mouth-ulcers'
  },
  {
    id: '12',
    name: 'Advanced Gum Treatment',
    image: '/polular-denta-procedures/Advanced Gum Treatment.gif',
    description: '',
    detailedDescription: 'Our advanced gum treatment addresses various stages of gum disease using the latest periodontal techniques. From deep cleaning and scaling to laser therapy and regenerative procedures, we provide comprehensive care to restore gum health and prevent tooth loss.',
    benefits: [],
    duration: '60-90 minutes',
    recovery: '1-2 weeks',
    href: '/procedures/advanced-gum-treatment'
  }
]

const PopularProceduresGrid = () => {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProcedureClick = (procedure: Procedure) => {
    setSelectedProcedure(procedure)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProcedure(null)
  }

  return (
    <>
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
            <button 
              onClick={() => handleProcedureClick(procedure)}
              className="block h-full w-full text-left"
            >
            {/* Glassmorphism Card */}
            <div className="relative bg-white/20 backdrop-blur-md rounded-3xl transition-all duration-500 overflow-hidden border-2 border-[#D35C2F]/20 group-hover:border-[#D35C2F]/60 group-hover:shadow-2xl group-hover:shadow-[#D35C2F]/10 group-hover:-translate-y-3 h-full flex flex-col">
              {/* Glassmorphism background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D35C2F]/5 via-transparent to-[#D35C2F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated red glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D35C2F]/20 via-[#D35C2F]/5 to-[#D35C2F]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
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
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#D35C2F]/30 to-transparent" />
                
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-800 transition-colors duration-300 leading-tight mb-3 line-clamp-2 drop-shadow-sm">
                  {procedure.name}
                </h3>
                
                {/* Enhanced CTA with glassmorphism - Icon only */}
                <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-[#D35C2F]/10 backdrop-blur-sm border border-[#D35C2F]/20 flex items-center justify-center group-hover:bg-[#D35C2F]/20 group-hover:border-[#D35C2F]/30 transition-all duration-300">
                    <svg 
                      className="w-4 h-4 text-[#D35C2F] group-hover:translate-x-0.5 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Red bottom accent with glassmorphism */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#D35C2F]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm" />
              
              {/* Additional glass reflection effect - only on content area */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent opacity-60 pointer-events-none rounded-b-3xl" />
            </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Procedure Modal */}
      <ProcedureModal
        procedure={selectedProcedure}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default PopularProceduresGrid