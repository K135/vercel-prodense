'use client'

import {
  MapPinpoint02Icon,
  CallIcon,
  MailIcon,
  GlobeIcon,
  Time04Icon,
  Award01Icon,
  DollarCircleIcon,
  UserCheckIcon,
  MedicalMaskIcon,
  CreditCardIcon,
  WheelchairIcon,
  Car01Icon,
  ParkingAreaSquareIcon,
  Restaurant01Icon,
  Calendar03Icon,
  Clock01Icon,
  StarIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  HospitalIcon,
  StethoscopeIcon,
  FavouriteIcon,
  ShieldIcon,
  CertificateIcon,
  LanguageCircleIcon,
  MoneyIcon,
  CheckmarkCircle02Icon as VerifiedIcon,
  Wifi01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons'
import { getDentalClinicByHandle } from '@/data/dental'
import { getListingReviews } from '@/data/data'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { Badge } from '@/shared/Badge'
import StartRating from '@/components/StartRating'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Fragment, useCallback, useEffect, useRef, useState, use } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCarouselArrowButtons } from '@/hooks/use-carousel-arrow-buttons'



const Page = ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = use(params)
  const [clinic, setClinic] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Move carousel hooks to component level
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 1 },
        '(min-width: 1024px)': { slidesToScroll: 1 }
      }
    },
    [autoplayRef.current]
  )

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = useCarouselArrowButtons(emblaApi)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicData, reviewsData] = await Promise.all([
          getDentalClinicByHandle(handle),
          getListingReviews(handle)
        ])
        setClinic(clinicData)
        setReviews(reviewsData.slice(0, 3))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [handle])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!clinic?.id) {
    window.location.href = '/stay-categories/all'
    return null
  }

  const {
    id,
    name,
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
  } = clinic

  // Handle form submission
  const handleSubmitForm = (formData: FormData) => {
    console.log('Form submitted with data:', Object.fromEntries(formData.entries()))
    window.location.href = '/checkout'
  }

  // Header Gallery Component
  const renderHeaderGallery = () => {
    return (
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-96 lg:h-[500px] rounded-3xl overflow-hidden">
          {/* Main large image */}
          <div className="lg:col-span-2 relative">
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          
          {/* Side images */}
          <div className="hidden lg:grid grid-rows-2 gap-2">
            {galleryImgs.slice(0, 2).map((img: string, index: number) => (
              <div key={index} className="relative">
                <Image
                  src={img}
                  alt={`${name} gallery ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            ))}
          </div>
          
          <div className="hidden lg:grid grid-rows-2 gap-2">
            {galleryImgs.slice(2, 4).map((img: string, index: number) => (
              <div key={index} className="relative">
                <Image
                  src={img || profileImage}
                  alt={`${name} gallery ${index + 3}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                {index === 1 && galleryImgs.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">+{galleryImgs.length - 4} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isVerified && (
            <Badge className="bg-green-500 text-white">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="mr-1" />
              Verified
            </Badge>
          )}
          {emergencyAvailable && (
            <Badge className="bg-red-500 text-white">
              Emergency Available
            </Badge>
          )}
        </div>
      </div>
    )
  }

  const renderSectionHeader = () => {
    return (
      <div className="space-y-6">
        {/* Main Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                {name}
                {isVerified && (
                  <div className="relative group">
                    <HugeiconsIcon 
                      icon={VerifiedIcon} 
                      size={28} 
                      className="text-blue-500 dark:text-blue-400" 
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Prodense Verified
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-4">
                {title}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <StartRating point={rating} reviewCount={reviewCount} size="lg" />
                <Badge color="blue" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {yearsExperience}+ Years Experience
                </Badge>
                <Badge color="blue" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {specialty}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                From {consultationFee}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Consultation Fee
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={MapPinpoint02Icon} size={20} className="text-primary-500" />
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">Address</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{address}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={CallIcon} size={20} className="text-primary-500" />
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">Phone</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{phone}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Time04Icon} size={20} className="text-primary-500" />
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">Hours</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {officeHours.monday} (Mon-Fri)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSectionInfo = () => {
    return (
      <div className="space-y-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            All About {name}
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              {description}
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Established with over {yearsExperience} years of experience, {name} has been providing quality dental services to numerous patients seeking professional dental care.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              With state-of-the-art technologies and dedicated staff, our clinic has become one of the best dental facilities in the area. We specialize in {specialty} and offer comprehensive dental treatments with a patient-first approach.
            </p>
          </div>
        </div>

        <Divider />

        {/* Key Features */}
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Why Choose {name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} className="text-green-600 dark:text-green-400 mt-1" />
              <div>
                <div className="font-semibold text-green-800 dark:text-green-300">Best Price Guarantee</div>
                <div className="text-sm text-green-600 dark:text-green-400">Competitive pricing with quality care</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <HugeiconsIcon icon={Award01Icon} size={24} className="text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <div className="font-semibold text-blue-800 dark:text-blue-300">Hand-Picked Professionals</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Carefully selected expert dentists</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <HugeiconsIcon icon={ShieldIcon} size={24} className="text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <div className="font-semibold text-purple-800 dark:text-purple-300">Trust Score: 10/10</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Verified and trusted clinic</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSectionServices = () => {
    return (
      <div className="space-y-8">
        {/* Services & Procedures */}
        <div>
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Our Comprehensive Services
            </h2>
            <div className="w-24 h-1 bg-[#0480ea] mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Implantology */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0480ea] to-[#0366d6]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0480ea]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0480ea]/20 transition-colors duration-300">
                    <HugeiconsIcon icon={HospitalIcon} size={28} className="text-[#0480ea]" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Implantology</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Dental Implants</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Same Day Implants</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">All-on-4 Implants</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">All-on-6 Implants</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cosmetic Dentistry */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0480ea] to-[#0366d6]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0480ea]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0480ea]/20 transition-colors duration-300">
                    <HugeiconsIcon icon={StarIcon} size={28} className="text-[#0480ea]" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Cosmetic Dentistry</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Dental Veneers</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Teeth Whitening</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Dental Bonding</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Smile Makeover</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Prosthodontics */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0480ea] to-[#0366d6]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0480ea]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0480ea]/20 transition-colors duration-300">
                    <HugeiconsIcon icon={StethoscopeIcon} size={28} className="text-[#0480ea]" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Prosthodontics</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Full Mouth Reconstruction</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Dental Crowns & Bridges</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Complete Dentures</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Partial Dentures</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Orthodontics */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0480ea] to-[#0366d6]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0480ea]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0480ea]/20 transition-colors duration-300">
                    <HugeiconsIcon icon={FavouriteIcon} size={28} className="text-[#0480ea]" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Orthodontics</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Traditional Braces</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Clear Aligners</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Corrective Jaw Surgery</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Retainers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Endodontics */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0480ea] to-[#0366d6]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0480ea]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0480ea]/20 transition-colors duration-300">
                    <HugeiconsIcon icon={MedicalMaskIcon} size={28} className="text-[#0480ea]" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Endodontics</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Root Canal Treatment</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Root Surgeries</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Pulp Therapy</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Apicoectomy</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* General Dentistry */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0480ea] to-[#0366d6]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0480ea]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0480ea]/20 transition-colors duration-300">
                    <HugeiconsIcon icon={ShieldIcon} size={28} className="text-[#0480ea]" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">General Dentistry</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Professional Cleaning</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Dental Fillings</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Tooth Extractions</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-[#0480ea] rounded-full flex-shrink-0"></div>
                    <span className="font-semibold">Preventive Care</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#0480ea]/5 to-[#0366d6]/5 rounded-3xl p-8 border border-[#0480ea]/20">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Ready to Transform Your Smile?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                Schedule a consultation today and discover how our comprehensive dental services can help you achieve the healthy, beautiful smile you deserve.
              </p>
              <div className="flex justify-center">
                <button className="bg-[#0480ea] hover:bg-[#0369d1] text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-base border border-[#0480ea]">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSidebarBookingForm = () => {
    return (
      <div className="space-y-6">
        {/* Pricing Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {consultationFee}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Starting consultation fee
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Best Price Guarantee</span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Free Consultation</span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">24/7 Support</span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-green-500" />
            </div>
          </div>

          <div className="space-y-3">
            <ButtonPrimary className="w-full text-lg py-4">
              Get Good Faith Estimator
            </ButtonPrimary>
            <ButtonSecondary className="w-full">
              Book Appointment
            </ButtonSecondary>
          </div>
        </div>



        {/* Office Hours */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl p-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            Office Hours
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Monday - Friday</span>
              <span className="font-medium text-neutral-900 dark:text-white">{officeHours.monday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Saturday</span>
              <span className="font-medium text-neutral-900 dark:text-white">{officeHours.saturday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Sunday</span>
              <span className="font-medium text-neutral-900 dark:text-white">{officeHours.sunday}</span>
            </div>
          </div>
          
          {emergencyAvailable && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <HugeiconsIcon icon={CallIcon} size={16} />
                <span className="text-sm font-medium">Emergency services available 24/7</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDentistsSection = () => {
    const dentists = [
      {
        name: "Dr. Rajesh Kumar Sharma",
        specialty: "Implantology Specialist",
        experience: "15+ Years",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Dr. Priya Mehta",
        specialty: "Cosmetic Dentistry",
        experience: "12+ Years", 
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Dr. Amit Singh",
        specialty: "Orthodontist",
        experience: "18+ Years",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Dr. Sunita Gupta",
        specialty: "Endodontist",
        experience: "14+ Years",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Dr. Vikram Patel",
        specialty: "Prosthodontist", 
        experience: "16+ Years",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Dr. Kavita Sharma",
        specialty: "General Dentistry",
        experience: "10+ Years",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
      }
    ]

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Meet Our Top Dentists
          </h2>
          <div className="w-24 h-1 bg-[#0480ea] mx-auto rounded-full"></div>
        </div>
        
        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dentists.map((dentist, index) => (
            <div key={index} className="group bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Large Square Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={dentist.image}
                  alt={dentist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  {dentist.name}
                </h3>
                <p className="text-[#0480ea] font-semibold mb-3">
                  {dentist.specialty}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={Award01Icon} size={18} className="text-[#0480ea]" />
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {dentist.experience} Experience
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CertificateIcon} size={18} className="text-[#0480ea]" />
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    DDS Certified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTravelSection = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Explore Your Travel Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
              Location & Accessibility
            </h3>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={MapPinpoint02Icon} size={16} className="text-blue-600 dark:text-blue-400" />
                <span>2.5 km from Indira Gandhi International Airport</span>
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={Car01Icon} size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Free parking available</span>
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={ParkingAreaSquareIcon} size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Free shuttle service</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4">
              Nearby Amenities
            </h3>
            <ul className="space-y-3 text-sm text-green-800 dark:text-green-200">
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={Restaurant01Icon} size={16} className="text-green-600 dark:text-green-400" />
                <span>8 Tourist Places Nearby</span>
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={HospitalIcon} size={16} className="text-green-600 dark:text-green-400" />
                <span>Hotels within walking distance</span>
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={Wifi01Icon} size={16} className="text-green-600 dark:text-green-400" />
                <span>Free WiFi available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const renderPricingSection = () => {
    const samplePricing = [
      { procedure: 'Titanium Dental Implant', details: 'MIS Only implant', price: '$850', days: '2' },
      { procedure: 'All on 4 Implants', details: 'Nobel Biocare + Fixed bridge per arch', price: '$8,500', days: '6' },
      { procedure: 'Dental Veneers', details: 'Porcelain veneers per tooth', price: '$450', days: '3' },
      { procedure: 'Teeth Whitening', details: 'Professional whitening session', price: '$200', days: '1' },
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Know the Prices for Your Procedures
        </h2>
        
        {/* Mobile-friendly pricing cards */}
        <div className="block md:hidden space-y-4">
          {samplePricing.map((item, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">{item.procedure}</h3>
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">{item.price}</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs mb-2">{item.details}</p>
              <div className="text-neutral-500 dark:text-neutral-400 text-xs">{item.days} days</div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">Procedure</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">Details</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {samplePricing.map((item, index) => (
                <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">{item.procedure}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{item.details}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400">{item.price}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{item.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-center">
          <ButtonPrimary className="px-8 py-3">
            Get Good Faith Estimated Quote
          </ButtonPrimary>
        </div>
      </div>
    )
  }

  const renderPaymentSection = () => {
    const paymentMethods = [
      { name: 'Cash', icon: DollarCircleIcon },
      { name: 'Credit/Debit Cards', icon: CreditCardIcon },
      { name: 'Bank Transfer', icon: MoneyIcon },
      { name: 'Insurance', icon: ShieldIcon },
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Pick Your Payment Method
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 text-center hover:shadow-lg transition-shadow">
              <HugeiconsIcon icon={method.icon} size={32} className="text-primary-500 mx-auto mb-3" />
              <div className="font-medium text-neutral-900 dark:text-white">{method.name}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTestimonialsSection = () => {
    const testimonials = [
      {
        name: 'Alessandro Rossi',
        country: 'Italy',
        text: 'Exceptional dental care! The team was professional and the results exceeded my expectations. Highly recommend for dental tourism.',
        rating: 5
      },
      {
        name: 'Marie Dubois',
        country: 'France',
        text: 'Outstanding service from start to finish. The clinic is modern and the staff speaks excellent English. Very satisfied!',
        rating: 5
      },
      {
        name: 'Vladimir Petrov',
        country: 'Russia',
        text: 'Amazing experience! Quality treatment at affordable prices. The doctors are highly skilled and caring.',
        rating: 5
      },
      {
        name: 'Hans Mueller',
        country: 'Germany',
        text: 'Professional and efficient service. The dental work was completed perfectly and the recovery was smooth.',
        rating: 4
      },
      {
        name: 'Anna Kowalski',
        country: 'Poland',
        text: 'Great value for money! The clinic exceeded all my expectations. Will definitely return for future treatments.',
        rating: 5
      },
      {
        name: 'Carlos Rodriguez',
        country: 'Spain',
        text: 'Fantastic dental tourism experience. The staff was welcoming and the treatment was world-class.',
        rating: 5
      },
      {
        name: 'Olga Ivanova',
        country: 'Russia',
        text: 'Incredible results! The dental implants look and feel natural. Thank you for the excellent care.',
        rating: 5
      },
      {
        name: 'Erik Larsson',
        country: 'Sweden',
        text: 'Top-notch dental care with modern equipment. The entire process was smooth and comfortable.',
        rating: 4
      },
      {
        name: 'Sofia Papadopoulos',
        country: 'Greece',
        text: 'Wonderful experience! The dentists are skilled and the clinic maintains high hygiene standards.',
        rating: 5
      },
      {
        name: 'Dmitri Volkov',
        country: 'Russia',
        text: 'Excellent dental tourism destination. Quality work, reasonable prices, and friendly staff.',
        rating: 5
      },
      {
        name: 'Isabella Silva',
        country: 'Portugal',
        text: 'Amazing dental care! The team was patient and explained every procedure clearly. Highly recommended.',
        rating: 5
      },
      {
        name: 'Jan Novak',
        country: 'Czech Republic',
        text: 'Outstanding results! The dental work was completed efficiently and the aftercare was excellent.',
        rating: 4
      },
      {
        name: 'Natasha Kozlov',
        country: 'Russia',
        text: 'Perfect dental tourism experience. Professional service, modern facilities, and great results.',
        rating: 5
      },
      {
        name: 'Marco Bianchi',
        country: 'Italy',
        text: 'Exceptional quality and service. The dental work was flawless and the staff was incredibly helpful.',
        rating: 5
      },
      {
        name: 'Ingrid Hansen',
        country: 'Norway',
        text: 'Fantastic experience! The clinic offers world-class dental care at competitive prices.',
        rating: 5
      }
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Read What Our Happy Patients Say from Europe & Russia
          </h2>
          
          <div className="flex gap-2 flex-shrink-0">
            <button
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                prevBtnDisabled
                  ? 'border-neutral-300 text-neutral-300 cursor-not-allowed'
                  : 'border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white'
              }`}
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
            </button>
            <button
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                nextBtnDisabled
                  ? 'border-neutral-300 text-neutral-300 cursor-not-allowed'
                  : 'border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white'
              }`}
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            >
              <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden -mx-2" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-none w-full md:w-1/2 lg:w-1/3 px-2">
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm h-full">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <HugeiconsIcon key={i} icon={StarIcon} size={16} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 italic text-sm leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-white text-sm">{testimonial.name}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{testimonial.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderHotelsSection = () => {
    const hotels = [
      {
        name: 'Hotel Rajmahal Palace',
        rating: 4.3,
        reviews: 327,
        address: 'MG Road, Connaught Place, New Delhi, 110001, India',
        distance: '0.3 km from Dental Clinic',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&crop=center'
      },
      {
        name: 'The Grand Mumbai',
        rating: 4.2,
        reviews: 116,
        address: 'Linking Road, Bandra West, Mumbai, 400050, India',
        distance: '0.1 km from Dental Clinic',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop&crop=center'
      },
      {
        name: 'Heritage Inn Bangalore',
        rating: 4.4,
        reviews: 419,
        address: 'Brigade Road, Bangalore, Karnataka, 560001, India',
        distance: '0.3 km from Dental Clinic',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop&crop=center'
      }
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Recommended Hotels for a Comfortable Stay
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          For a comfortable and seamless stay, consider staying at the hotels mentioned below:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
              {/* Hotel Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Hotel Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-neutral-900 dark:text-white">{hotel.name}</h3>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={StarIcon} size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{hotel.rating}</span>
                  </div>
                </div>
                
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  ({hotel.reviews} Reviews)
                </div>
                
                <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  {hotel.address}
                </div>
                
                <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">
                  {hotel.distance}
                </div>
                
                <ButtonSecondary className="w-full">
                  View Hotel
                </ButtonSecondary>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderFAQSection = () => {
    const faqs = [
      {
        question: 'Does the clinic charge any consultation fee?',
        answer: 'No, the consultation with the clinic\'s dental experts is absolutely free of cost. You can book easy and quick appointments and get a treatment plan designed to your needs.'
      },
      {
        question: 'How much warranty is given for dental procedures?',
        answer: 'For all dental treatments that we provide, a warranty is given depending upon the type of treatment. For most implant cases, there is a 5-year guarantee.'
      },
      {
        question: 'What options does the clinic offer for replacing a missing tooth?',
        answer: 'We offer various options including dental implants, bridges, and dentures. Our specialists will recommend the best option based on your specific needs and oral health condition.'
      },
      {
        question: 'Does the dentist need to know about my diabetes?',
        answer: 'Yes, it\'s very important to inform your dentist about any medical conditions including diabetes, as it can affect your dental treatment plan and healing process.'
      },
      {
        question: 'What kind of payment methods does the clinic accept?',
        answer: 'We accept cash, credit/debit cards, bank transfers, and work with various insurance providers. We also offer financing options for major treatments.'
      }
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-16">
      {/* HEADER GALLERY */}
      <div className="overflow-x-hidden">
        {renderHeaderGallery()}
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 mt-10 max-w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-12 min-w-0 overflow-x-hidden">
            {renderSectionHeader()}
            {renderSectionInfo()}
            {renderSectionServices()}
            {renderDentistsSection()}
            {renderTravelSection()}
            {renderPricingSection()}
            {renderPaymentSection()}
            {renderHotelsSection()}
            {renderTestimonialsSection()}
            {renderFAQSection()}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-96 lg:flex-shrink-0">
            <div className="sticky top-24 z-10">
              {renderSidebarBookingForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
