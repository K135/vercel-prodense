'use client'

import { useState } from 'react'
import { Button } from '@/shared/Button'
import { 
  Search01Icon, 
  Location06Icon, 
  MedicalMaskIcon,
  Calendar03Icon 
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'

interface DentalSearchFormProps {
  className?: string
  formStyle?: 'default' | 'compact'
}

const DentalSearchForm: React.FC<DentalSearchFormProps> = ({ 
  className = '',
  formStyle = 'default' 
}) => {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    procedure: '',
    location: '',
    date: '',
    insurance: ''
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build search URL with parameters
    const params = new URLSearchParams()
    if (searchData.procedure) params.set('procedure', searchData.procedure)
    if (searchData.location) params.set('location', searchData.location)
    if (searchData.date) params.set('date', searchData.date)
    if (searchData.insurance) params.set('insurance', searchData.insurance)
    
    const url = `/stay-categories/all${params.toString() ? `?${params.toString()}` : ''}`
    router.push(url)
  }

  const procedures = [
    'General Dentistry',
    'Teeth Cleaning',
    'Dental Fillings',
    'Root Canal',
    'Tooth Extraction',
    'Dental Crowns',
    'Dental Implants',
    'Orthodontics',
    'Teeth Whitening',
    'Veneers',
  ]

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Miami, FL',
    'Boston, MA',
    'Seattle, WA',
    'Denver, CO',
  ]

  const insuranceOptions = [
    'Delta Dental',
    'Cigna',
    'Aetna',
    'MetLife',
    'Blue Cross Blue Shield',
    'Humana',
    'United Healthcare',
    'Guardian',
  ]

  if (formStyle === 'compact') {
    return (
      <form onSubmit={handleSearch} className={`bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-700 ${className}`}>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <HugeiconsIcon 
                icon={Search01Icon} 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search procedures, dental clinics..."
                value={searchData.procedure}
                onChange={(e) => setSearchData(prev => ({ ...prev, procedure: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
              />
            </div>
          </div>
          <Button type="submit" color="primary">
            Search
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className={`bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg dark:bg-neutral-900 dark:border-neutral-700 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Procedure/Service */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            <HugeiconsIcon icon={MedicalMaskIcon} size={16} className="inline mr-2" />
            Procedure or Service
          </label>
          <select
            value={searchData.procedure}
            onChange={(e) => setSearchData(prev => ({ ...prev, procedure: e.target.value }))}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          >
            <option value="">Select procedure</option>
            {procedures.map((procedure) => (
              <option key={procedure} value={procedure}>
                {procedure}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            <HugeiconsIcon icon={Location06Icon} size={16} className="inline mr-2" />
            Location
          </label>
          <select
            value={searchData.location}
            onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            <HugeiconsIcon icon={Calendar03Icon} size={16} className="inline mr-2" />
            Preferred Date
          </label>
          <input
            type="date"
            value={searchData.date}
            onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          />
        </div>

        {/* Insurance */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Insurance Provider
          </label>
          <select
            value={searchData.insurance}
            onChange={(e) => setSearchData(prev => ({ ...prev, insurance: e.target.value }))}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
          >
            <option value="">Select insurance</option>
            {insuranceOptions.map((insurance) => (
              <option key={insurance} value={insurance}>
                {insurance}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          color="primary" 
          className="px-8 py-3 text-base font-semibold"
        >
          <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" />
          Find Dentists
        </Button>
      </div>
    </form>
  )
}

export default DentalSearchForm