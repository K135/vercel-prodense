'use client'

import { Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { FC, Fragment } from 'react'
import Image from 'next/image'
import ButtonClose from '@/shared/ButtonClose'
import ButtonPrimary from '@/shared/ButtonPrimary'

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

interface ProcedureModalProps {
  procedure: Procedure | null
  isOpen: boolean
  onClose: () => void
}

const ProcedureModal: FC<ProcedureModalProps> = ({ procedure, isOpen, onClose }) => {
  if (!procedure) return null

  const handleTalkToUs = () => {
    // You can customize this action - could open a contact form, redirect to contact page, etc.
    window.open('/contact', '_blank')
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-4" onClick={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - sticky positioned outside scrollable area */}
              <ButtonClose
                onClick={onClose}
                className="!absolute !top-4 !right-4 z-30 bg-gradient-to-r from-[#D35C2F] to-[#E6B862] hover:from-[#D35C2F]/90 hover:to-[#E6B862]/90 text-white transition-all duration-200 shadow-lg border-2 border-white"
              />

              {/* Scrollable content wrapper */}
              <div className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D35C2F] scrollbar-track-gray-100"
                   style={{ 
                     scrollbarWidth: 'thin', 
                     scrollbarColor: '#D35C2F #f1f1f1',
                   }}
              >
              {/* Header with glassmorphism effect */}
              <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6B862]/10 via-white to-[#D35C2F]/5" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#E6B862]/5 to-transparent" />
                
                {/* Image and title section */}
                <div className="relative p-6 pb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Procedure Image */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={procedure.image}
                        alt={procedure.name}
                        fill
                        className="object-contain p-4"
                        unoptimized={true}
                      />
                    </div>
                    
                    {/* Title and basic info */}
                    <div className="flex-1 text-center sm:text-left">
                      <DialogTitle
                        as="h2"
                        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-tight"
                      >
                        {procedure.name}
                      </DialogTitle>
                      {procedure.description && (
                        <p className="text-[#D35C2F] font-medium text-lg mb-4">
                          {procedure.description}
                        </p>
                      )}

                    </div>
                  </div>
                </div>
              </div>

              {/* Content section */}
              <div className="px-6 pb-6">
                {/* Detailed description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Procedure</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {procedure.detailedDescription}
                  </p>
                </div>

                {/* Benefits - only show if there are benefits */}
                {procedure.benefits && procedure.benefits.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {procedure.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >
                          <div className="w-2 h-2 bg-[#D35C2F] rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600 text-sm leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Section */}
                <div className="relative">
                  {/* Background with glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E6B862]/5 via-[#D35C2F]/5 to-[#E6B862]/5 rounded-2xl" />
                  <div className="relative p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Ready to Get Started?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Our expert dental team is here to help you achieve your perfect smile.
                    </p>
                    <ButtonPrimary
                      onClick={handleTalkToUs}
                      className="bg-gradient-to-r from-[#D35C2F] to-[#E6B862] hover:from-[#D35C2F]/90 hover:to-[#E6B862]/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Talk to Us
                      </span>
                    </ButtonPrimary>
                  </div>
                </div>
              </div>
              </div> {/* Close scrollable wrapper */}
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ProcedureModal