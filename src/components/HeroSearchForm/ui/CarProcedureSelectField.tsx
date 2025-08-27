'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon, HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState, useMemo } from 'react'

const carProcedures = [
  { value: 'smile-makeover', label: 'Complete Smile Makeover', icon: '✨' },
  { value: 'dental-implants', label: 'Dental Implants', icon: '⚙️' },
  { value: 'teeth-whitening', label: 'Professional Teeth Whitening', icon: '💎' },
  { value: 'veneers', label: 'Porcelain Veneers', icon: '🦷' },
  { value: 'orthodontics', label: 'Orthodontic Treatment', icon: '🔗' },
  { value: 'root-canal', label: 'Root Canal Therapy', icon: '🔧' },
  { value: 'crowns-bridges', label: 'Crowns & Bridges', icon: '👑' },
  { value: 'gum-treatment', label: 'Gum Disease Treatment', icon: '🌿' },
  { value: 'tooth-extraction', label: 'Tooth Extraction', icon: '🔨' },
  { value: 'dentures', label: 'Complete Dentures', icon: '🦷' },
  { value: 'invisalign', label: 'Invisalign Treatment', icon: '👓' },
  { value: 'dental-cleaning', label: 'Deep Cleaning', icon: '🧽' },
  { value: 'cosmetic-bonding', label: 'Cosmetic Bonding', icon: '💫' },
  { value: 'oral-surgery', label: 'Oral Surgery', icon: '🏥' },
  { value: 'pediatric-dentistry', label: 'Children\'s Dentistry', icon: '👶' },
  { value: 'emergency-care', label: 'Emergency Dental Care', icon: '🚨' },
  { value: 'full-mouth-reconstruction', label: 'Full Mouth Reconstruction', icon: '🔄' },
  { value: 'dental-checkup', label: 'Comprehensive Checkup', icon: '🔍' },
]

interface Props {
  className?: string
  fieldStyle: 'default' | 'small'
}

export const CarProcedureSelectField = ({ className, fieldStyle }: Props) => {
  const [selectedProcedure, setSelectedProcedure] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const selectedProcedureData = carProcedures.find(p => p.value === selectedProcedure)
  
  const filteredProcedures = useMemo(() => {
    if (!searchQuery) return carProcedures
    return carProcedures.filter(procedure => 
      procedure.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className={clsx('relative flex', className)}>
      <Popover className="flex flex-1">
        <PopoverButton
          className={clsx(
            'flex w-full cursor-pointer items-center justify-between rounded-full px-4 py-3 text-left text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus:outline-none dark:text-neutral-200 dark:hover:bg-neutral-700',
            fieldStyle === 'small' && 'px-3 py-2 text-xs',
            fieldStyle === 'default' && 'px-4 py-3 text-sm'
          )}
        >
          <div className="flex items-center gap-2">
            <HeartIcon className={clsx(
              'text-[#0480ea]',
              fieldStyle === 'small' ? 'h-3 w-3' : 'h-4 w-4'
            )} />
            <div>
              <div className={clsx(
                'font-semibold text-neutral-800 dark:text-neutral-100',
                fieldStyle === 'small' ? 'text-xs' : 'text-sm'
              )}>
                Treatment
              </div>
              <div className={clsx(
                'text-neutral-500 dark:text-neutral-400',
                fieldStyle === 'small' ? 'text-xs' : 'text-sm'
              )}>
                {selectedProcedureData ? (
                  <span className="flex items-center gap-1">
                    <span>{selectedProcedureData.icon}</span>
                    {selectedProcedureData.label}
                  </span>
                ) : (
                  'Select treatment'
                )}
              </div>
            </div>
          </div>
          <ChevronDownIcon className={clsx(
            'text-neutral-500',
            fieldStyle === 'small' ? 'h-3 w-3' : 'h-4 w-4'
          )} />
        </PopoverButton>

        <PopoverPanel className="absolute top-full left-0 z-20 mt-2 w-full min-w-[320px] max-w-[400px] rounded-2xl bg-white shadow-2xl border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="p-4">
            {/* Search Header */}
            <div className="flex items-center gap-3 mb-4">
              <HeartIcon className="h-5 w-5 text-[#0480ea]" />
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Choose Your Treatment
              </div>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0480ea]/20 focus:border-[#0480ea] dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>
            
            {/* Procedures List */}
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredProcedures.length > 0 ? (
                filteredProcedures.map((procedure) => (
                  <button
                    key={procedure.value}
                    type="button"
                    className={clsx(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700',
                      selectedProcedure === procedure.value && 'bg-[#0480ea]/10 text-[#0480ea] dark:bg-[#0480ea]/20 ring-1 ring-[#0480ea]/20'
                    )}
                    onClick={() => {
                      setSelectedProcedure(procedure.value)
                      setSearchQuery('')
                    }}
                  >
                    <span className="text-lg flex-shrink-0">{procedure.icon}</span>
                    <span className="font-medium flex-1">{procedure.label}</span>
                    {selectedProcedure === procedure.value && (
                      <div className="w-2 h-2 rounded-full bg-[#0480ea] flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No treatments found</p>
                </div>
              )}
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="procedure"
        value={selectedProcedure}
      />
    </div>
  )
}