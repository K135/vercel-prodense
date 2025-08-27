'use client'

import { TDentalClinicListing } from '@/data/dental'
import { Badge } from '@/shared/Badge'
import { Button } from '@/shared/Button'
import StartRating from './StartRating'
import { 
  MapPinpoint02Icon, 
  Award01Icon,
  WheelchairIcon,
  Wifi01Icon,
  Car01Icon,
  ParkingAreaSquareIcon,
  Restaurant01Icon,
  CreditCardIcon,
  UserCheckIcon,
  CallIcon,
  MedicalMaskIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface DentalClinicCardProps {
  className?: string
  data: TDentalClinicListing
}

const DentalClinicCard: FC<DentalClinicCardProps> = ({ className = '', data }) => {
  const {
    id,
    name,
    handle,
    title,
    specialty,
    description,
    profileImage,
    galleryImgs,
    address,
    phone,
    email,
    website,
    rating,
    reviewCount,
    yearsExperience,
    procedures,
    insuranceAccepted,
    languages,
    education,
    certifications,
    officeHours,
    emergencyAvailable,
    newPatientsAccepted,
    consultationFee,
    isVerified,
    map,
  } = data

  const clinicHref = `/dental-clinic/${handle}`

  // Sample features - you can add these to your data model later
  const features = [
    { name: 'Wheelchair Accessibility', icon: WheelchairIcon, available: true },
    { name: 'Free Wifi', icon: Wifi01Icon, available: true },
    { name: 'Pick Up & Drop Off', icon: Car01Icon, available: false },
    { name: 'Parking Space', icon: ParkingAreaSquareIcon, available: true },
    { name: 'Restaurants Nearby', icon: Restaurant01Icon, available: true },
    { name: 'Multiple Payment Options', icon: CreditCardIcon, available: true },
    { name: 'First Consultation Free', icon: UserCheckIcon, available: false },
    { name: 'Free Phone Call', icon: CallIcon, available: true },
    { name: 'Free Diagnostic Test', icon: MedicalMaskIcon, available: false },
    { name: 'Hotels Nearby', icon: MapPinpoint02Icon, available: true },
  ]

  return (
    <div className={`group relative bg-white rounded-3xl border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-500 dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden ${className}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Square Image */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              fill
              src={profileImage}
              alt={name}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 288px"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            


            {/* Experience badge */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <span className="text-sm font-bold">
                  {yearsExperience}+ Years
                </span>
              </div>
            </div>

            {/* Consultation fee */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  From {consultationFee}
                </span>
              </div>
            </div>
          </div>

          {/* Features & Amenities below image */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Features & Amenities
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {features.slice(0, 4).map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-xs p-2 rounded-lg transition-all duration-200 ${
                    feature.available
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-600'
                  }`}
                >
                  <HugeiconsIcon 
                    icon={feature.icon} 
                    size={14} 
                    className={feature.available ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}
                  />
                  <span className="truncate font-medium">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Link href={clinicHref} className="group/link">
              <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white group-hover/link:text-primary-600 transition-colors mb-2 leading-tight">
                {name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-3 mb-3">
              <StartRating point={rating} reviewCount={reviewCount} size="lg" />
              <div className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-medium">
                {yearsExperience}+ Years
              </div>
              {emergencyAvailable && (
                <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                  Emergency Available
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
              <HugeiconsIcon icon={MapPinpoint02Icon} size={16} className="mt-0.5 flex-shrink-0 text-primary-500" />
              <span className="text-sm">{address}</span>
            </div>

            {/* Distance & Tourist Places */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                <HugeiconsIcon icon={MapPinpoint02Icon} size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="font-medium">2.5 km from Airport</span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                <HugeiconsIcon icon={Award01Icon} size={12} className="text-green-600 dark:text-green-400" />
                <span className="font-medium">8 Tourist Places Nearby</span>
              </div>
            </div>
          </div>

          {/* Description - Two lines with truncation */}
          <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed line-clamp-2 text-sm">
            {description}
          </p>

          {/* Procedures Offered - Beautiful Grid */}
          {procedures && procedures.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                Procedures Offered
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {procedures.slice(0, 6).map((procedure, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100 dark:border-primary-800 rounded-lg px-3 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 hover:from-primary-100 hover:to-blue-100 dark:hover:from-primary-800/30 dark:hover:to-blue-800/30 transition-all duration-200"
                  >
                    {procedure}
                  </div>
                ))}
              </div>
              {procedures.length > 6 && (
                <div className="mt-3 text-center">
                  <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    +{procedures.length - 6} more procedures available
                  </span>
                </div>
              )}
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link href={clinicHref} className="flex-[2]">
              <div className="w-full bg-[#DB3116] hover:bg-[#B91C1C] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-base border border-[#DB3116] text-center cursor-pointer">
                View / Book
              </div>
            </Link>
            <div className="flex-1 border-2 border-[#DB3116] text-[#DB3116] hover:bg-[#DB3116] hover:text-white dark:border-[#DB3116] dark:text-[#DB3116] dark:hover:bg-[#DB3116] dark:hover:text-white font-bold py-4 rounded-2xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-base bg-transparent text-center cursor-pointer">
              Contact Clinic
            </div>
          </div>

          {/* Quick Info */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                <span className="font-medium">{languages?.join(', ') || 'English'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Digital Records</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="font-medium">Insurance Accepted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DentalClinicCard