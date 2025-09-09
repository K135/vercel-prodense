'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  BuildingOffice2Icon,
  PaperAirplaneIcon as AirplaneIcon,
  UserGroupIcon,
  CameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ShareIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BanknotesIcon,
  HomeIcon,
  TruckIcon as CarIcon,
  GlobeAltIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import { 
  MapPinIcon as MapSolid,
  CalendarDaysIcon as CalendarSolid,
  CheckCircleIcon as CheckSolid,
  CurrencyDollarIcon as CurrencySolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const statusConfig = {
  confirmed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckSolid },
  scheduled: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckSolid },
  pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: ClockIcon },
  'in-progress': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: InformationCircleIcon },
  draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: InformationCircleIcon },
  completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckSolid },
  cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: ExclamationTriangleIcon },
  rescheduled: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', icon: ClockIcon }
}

const treatmentTypeConfig = {
  orthodontics: { gradient: 'from-blue-500 to-indigo-600', icon: UserGroupIcon },
  implants: { gradient: 'from-green-500 to-emerald-600', icon: UserGroupIcon },
  cosmetic: { gradient: 'from-purple-500 to-pink-600', icon: UserGroupIcon },
  general: { gradient: 'from-orange-500 to-red-600', icon: UserGroupIcon },
  surgery: { gradient: 'from-red-500 to-rose-600', icon: UserGroupIcon },
  cleaning: { gradient: 'from-teal-500 to-cyan-600', icon: UserGroupIcon },
  default: { gradient: 'from-gray-500 to-slate-600', icon: UserGroupIcon }
}

const timelineItemTypes = {
  treatment: { gradient: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50 dark:bg-green-900/20', icon: UserGroupIcon },
  boarding: { gradient: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: HomeIcon },
  arrival: { gradient: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20', icon: AirplaneIcon },
  visit: { gradient: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', icon: CameraIcon },
  departure: { gradient: 'from-gray-500 to-slate-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20', icon: AirplaneIcon }
}

interface Booking {
  _id: string
  userId: string
  dentistId: string
  bookingNumber: string
  treatmentType: string
  treatmentDescription: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  status: string
  estimatedCost: {
    amount: number
    currency: string
  }
  clinic: {
    name: string
    address: {
      street: string
      city: string
      state: string
      country: string
      pincode: string
    }
    contact: {
      phone: string
    }
  }
  notes: Array<{
    message: string
    createdAt: string
  }>
}

interface BudgetBreakdown {
  accommodation: number
  transportation: number
  food: number
  activities: number
  miscellaneous: number
}

interface TimelineItem {
  id: string
  type: 'treatment' | 'boarding' | 'arrival' | 'visit' | 'departure'
  title: string
  description: string
  date?: string
  time?: string
  location?: string
  status: string
  isEditable?: boolean
}

interface BookingItinerary {
  booking: Booking
  budget: BudgetBreakdown
  timeline: TimelineItem[]
}

export default function ItineraryPage() {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingItineraries, setBookingItineraries] = useState<Map<string, BookingItinerary>>(new Map())
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline'>('budget')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.bookings.getAll(token!, { status: 'confirmed' })
      const confirmedBookings = response.data?.bookings || []
      
      setBookings(confirmedBookings)
      
      // Initialize booking itineraries
      const itineraries = new Map<string, BookingItinerary>()
      confirmedBookings.forEach((booking: Booking) => {
        itineraries.set(booking._id, {
          booking,
          budget: {
            accommodation: 0,
            transportation: 0,
            food: 0,
            activities: 0,
            miscellaneous: 0
          },
          timeline: generateDefaultTimeline(booking)
        })
      })
      
      setBookingItineraries(itineraries)
    } catch (err: any) {
      console.error('Error fetching bookings:', err)
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchBookings()
    }
  }, [token, fetchBookings])

  const generateDefaultTimeline = (booking: Booking): TimelineItem[] => {
    const appointmentDate = new Date(booking.appointmentDate)
    const arrivalDate = new Date(appointmentDate)
    arrivalDate.setDate(arrivalDate.getDate() - 1)
    
    const departureDate = new Date(appointmentDate)
    departureDate.setDate(departureDate.getDate() + 1)

    return [
      {
        id: 'arrival',
        type: 'arrival',
        title: 'Arrival',
        description: `Arrive in ${booking.clinic.address.city}`,
        date: arrivalDate.toISOString().split('T')[0],
        time: '10:00',
        location: booking.clinic.address.city,
        status: 'scheduled',
        isEditable: true
      },
      {
        id: 'boarding',
        type: 'boarding',
        title: 'Check-in Accommodation',
        description: 'Check into hotel/accommodation',
        date: arrivalDate.toISOString().split('T')[0],
        time: '14:00',
        location: booking.clinic.address.city,
        status: 'scheduled',
        isEditable: true
      },
      {
        id: 'treatment',
        type: 'treatment',
        title: booking.treatmentType.charAt(0).toUpperCase() + booking.treatmentType.slice(1) + ' Treatment',
        description: booking.treatmentDescription,
        date: booking.appointmentDate.split('T')[0],
        time: booking.appointmentTime,
        location: booking.clinic.name,
        status: booking.status,
        isEditable: false
      },
      {
        id: 'visit',
        type: 'visit',
        title: 'Local Sightseeing',
        description: `Explore ${booking.clinic.address.city}`,
        date: appointmentDate.toISOString().split('T')[0],
        time: '16:00',
        location: booking.clinic.address.city,
        status: 'scheduled',
        isEditable: true
      },
      {
        id: 'departure',
        type: 'departure',
        title: 'Departure',
        description: `Depart from ${booking.clinic.address.city}`,
        date: departureDate.toISOString().split('T')[0],
        time: '12:00',
        location: booking.clinic.address.city,
        status: 'scheduled',
        isEditable: true
      }
    ]
  }

  const updateBudget = (bookingId: string, category: keyof BudgetBreakdown, amount: number) => {
    setBookingItineraries(prev => {
      const updated = new Map(prev)
      const itinerary = updated.get(bookingId)
      if (itinerary) {
        itinerary.budget[category] = amount
        updated.set(bookingId, itinerary)
      }
      return updated
    })
  }

  const addTimelineItem = (bookingId: string) => {
    setBookingItineraries(prev => {
      const updated = new Map(prev)
      const itinerary = updated.get(bookingId)
      if (itinerary) {
        const newItem: TimelineItem = {
          id: `custom-${Date.now()}`,
          type: 'visit',
          title: 'New Activity',
          description: 'Add description...',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          location: itinerary.booking.clinic.address.city,
          status: 'scheduled',
          isEditable: true
        }
        itinerary.timeline.push(newItem)
        // Sort timeline by date and time
        itinerary.timeline.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`)
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`)
          return dateA.getTime() - dateB.getTime()
        })
        updated.set(bookingId, itinerary)
      }
      return updated
    })
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getTotalBudget = (itinerary: BookingItinerary) => {
    const budgetTotal = Object.values(itinerary.budget).reduce((sum, amount) => sum + amount, 0)
    const treatmentCost = itinerary.booking.estimatedCost.amount || 0
    // Convert treatment cost from INR to USD (approximate rate)
    const treatmentCostUSD = itinerary.booking.estimatedCost.currency === 'INR' ? treatmentCost / 83 : treatmentCost
    return budgetTotal + treatmentCostUSD
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB3116]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Bookings</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchBookings}
          className="bg-[#DB3116] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Confirmed Bookings</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You don&apos;t have any confirmed bookings to create itineraries from.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Travel Itineraries</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Plan your dental tourism journey with detailed budgets and timelines
          </p>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="space-y-6">
        {bookings.map((booking) => {
          const itinerary = bookingItineraries.get(booking._id)
          if (!itinerary) return null

          const isExpanded = expandedBooking === booking._id
          const statusInfo = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending
          const treatmentConfig = treatmentTypeConfig[booking.treatmentType as keyof typeof treatmentTypeConfig] || treatmentTypeConfig.default
          const totalBudget = getTotalBudget(itinerary)

          return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#DB3116] to-orange-600 rounded-2xl shadow-lg border border-red-300 dark:border-red-700 overflow-hidden"
            >
              {/* Booking Card Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-black/10 transition-colors"
                onClick={() => setExpandedBooking(isExpanded ? null : booking._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Treatment Icon */}
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <treatmentConfig.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {booking.treatmentType.charAt(0).toUpperCase() + booking.treatmentType.slice(1)} Treatment - {booking.clinic.address.city}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                          <statusInfo.icon className="h-4 w-4" />
                          {booking.status}
                        </span>
                      </div>
                      
                      <p className="text-white/80 mb-3">
                        {booking.treatmentDescription}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-white/60" />
                          <span className="text-white/80">
                            {booking.clinic.address.city}, {booking.clinic.address.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="h-4 w-4 text-white/60" />
                          <span className="text-white/80">
                            {new Date(booking.appointmentDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-white/60" />
                          <span className="text-white/80">
                            {booking.appointmentTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-white/60" />
                          <span className="text-white/80">
                            {formatCurrency(totalBudget)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="h-6 w-6 text-white/60" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Expanded Content - Revolutionary Design */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="border-t border-red-300/30 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
                  >
                    <div className="p-8 space-y-8">
                      {/* 🔥 MIND-BLOWING BUDGET OVERVIEW - HORIZONTAL LAYOUT */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative"
                      >
                        {/* Floating Header with Glassmorphism */}
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-xl dark:from-slate-800/80 dark:to-slate-700/60 dark:border-slate-600/50"></div>
                          <div className="relative p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
                                <CurrencySolid className="h-8 w-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Budget Overview</h3>
                                <p className="text-slate-600 dark:text-slate-300">Your complete travel investment breakdown</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                                {formatCurrency(totalBudget)}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Estimated Cost</div>
                            </div>
                          </div>
                        </div>

                        {/* 🌟 REVOLUTIONARY BUDGET CARDS - HORIZONTAL SCROLL */}
                        <div className="relative">
                          <div className="flex gap-6 overflow-x-auto pb-8 px-2 hidden-scrollbar">
                            {/* Treatment Cost - Special Locked Card */}
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="flex-shrink-0 w-72 relative group my-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 rounded-3xl p-6 h-48 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
                                    <UserGroupIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-800/50 rounded-full border border-emerald-200 dark:border-emerald-700">
                                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">LOCKED</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Treatment Cost</h4>
                                  <p className="text-slate-600 dark:text-slate-300 text-sm">From your booking</p>
                                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(
                                      booking.estimatedCost.currency === 'INR' 
                                        ? booking.estimatedCost.amount / 83 
                                        : booking.estimatedCost.amount
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Accommodation - Interactive Card */}
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="flex-shrink-0 w-72 relative group my-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 rounded-3xl p-6 h-48 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <HomeIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-full border border-blue-200 dark:border-blue-700">
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">EDITABLE</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Accommodation</h4>
                                  <p className="text-slate-600 dark:text-slate-300 text-sm">Hotels & stays</p>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-2xl font-bold">$</span>
                                    <input
                                      type="number"
                                      value={itinerary.budget.accommodation}
                                      onChange={(e) => updateBudget(booking._id, 'accommodation', parseFloat(e.target.value) || 0)}
                                      className="w-full pl-8 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-blue-200/50 dark:border-blue-700/50 rounded-xl text-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Transportation */}
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="flex-shrink-0 w-72 relative group my-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 backdrop-blur-xl border border-orange-200/50 dark:border-orange-700/50 rounded-3xl p-6 h-48 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg">
                                    <CarIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="px-3 py-1 bg-orange-100 dark:bg-orange-800/50 rounded-full border border-orange-200 dark:border-orange-700">
                                    <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">EDITABLE</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Transportation</h4>
                                  <p className="text-slate-600 dark:text-slate-300 text-sm">Flights & local travel</p>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-2xl font-bold">$</span>
                                    <input
                                      type="number"
                                      value={itinerary.budget.transportation}
                                      onChange={(e) => updateBudget(booking._id, 'transportation', parseFloat(e.target.value) || 0)}
                                      className="w-full pl-8 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200/50 dark:border-orange-700/50 rounded-xl text-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 backdrop-blur-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Food & Dining */}
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="flex-shrink-0 w-72 relative group my-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/50 rounded-3xl p-6 h-48 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                                    <BanknotesIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="px-3 py-1 bg-purple-100 dark:bg-purple-800/50 rounded-full border border-purple-200 dark:border-purple-700">
                                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">EDITABLE</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Food & Dining</h4>
                                  <p className="text-slate-600 dark:text-slate-300 text-sm">Meals & restaurants</p>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-2xl font-bold">$</span>
                                    <input
                                      type="number"
                                      value={itinerary.budget.food}
                                      onChange={(e) => updateBudget(booking._id, 'food', parseFloat(e.target.value) || 0)}
                                      className="w-full pl-8 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-purple-200/50 dark:border-purple-700/50 rounded-xl text-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 backdrop-blur-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Activities */}
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="flex-shrink-0 w-72 relative group my-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <div className="relative bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-cyan-900/20 dark:via-teal-900/20 dark:to-blue-900/20 backdrop-blur-xl border border-cyan-200/50 dark:border-cyan-700/50 rounded-3xl p-6 h-48 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg">
                                    <CameraIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="px-3 py-1 bg-cyan-100 dark:bg-cyan-800/50 rounded-full border border-cyan-200 dark:border-cyan-700">
                                    <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">EDITABLE</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Activities</h4>
                                  <p className="text-slate-600 dark:text-slate-300 text-sm">Sightseeing & tours</p>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-2xl font-bold">$</span>
                                    <input
                                      type="number"
                                      value={itinerary.budget.activities}
                                      onChange={(e) => updateBudget(booking._id, 'activities', parseFloat(e.target.value) || 0)}
                                      className="w-full pl-8 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-cyan-200/50 dark:border-cyan-700/50 rounded-xl text-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 backdrop-blur-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Miscellaneous */}
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="flex-shrink-0 w-72 relative group my-4"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-slate-500 to-zinc-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <div className="relative bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-zinc-900/20 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-6 h-48 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-400 to-slate-600 flex items-center justify-center shadow-lg">
                                    <EllipsisHorizontalIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800/50 rounded-full border border-gray-200 dark:border-gray-700">
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">EDITABLE</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Miscellaneous</h4>
                                  <p className="text-slate-600 dark:text-slate-300 text-sm">Other expenses</p>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-2xl font-bold">$</span>
                                    <input
                                      type="number"
                                      value={itinerary.budget.miscellaneous}
                                      onChange={(e) => updateBudget(booking._id, 'miscellaneous', parseFloat(e.target.value) || 0)}
                                      className="w-full pl-8 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500/50 backdrop-blur-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* 🚀 EPIC TREATMENT TIMELINE */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative"
                      >
                        {/* Timeline Header with Floating Action */}
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-xl dark:from-slate-800/80 dark:to-slate-700/60 dark:border-slate-600/50"></div>
                          <div className="relative p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                                <CalendarSolid className="h-8 w-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Treatment Timeline</h3>
                                <p className="text-slate-600 dark:text-slate-300">Your complete journey schedule</p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addTimelineItem(booking._id)}
                              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#DB3116] to-orange-600 backdrop-blur-xl border border-red-300/50 rounded-2xl text-white font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                            >
                              <PlusIcon className="h-5 w-5" />
                              Add Activity
                            </motion.button>
                          </div>
                        </div>

                        {/* Revolutionary Timeline */}
                        <div className="relative">
                          {/* Timeline Background Line */}
                          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 rounded-full"></div>
                          
                          <div className="space-y-6">
                            {itinerary.timeline.map((item, index) => {
                              const typeInfo = timelineItemTypes[item.type]
                              const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending

                              return (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, x: -50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1, duration: 0.5 }}
                                  className="relative group"
                                >
                                  {/* Timeline Node */}
                                  <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 border-4 border-white dark:border-slate-800 shadow-lg z-10"></div>
                                  
                                  {/* Timeline Card */}
                                  <div className="ml-16 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-lg group-hover:border-slate-300/70 group-hover:shadow-xl transition-all duration-300 dark:from-slate-800/80 dark:to-slate-700/60 dark:border-slate-600/50 dark:group-hover:border-slate-500/70"></div>
                                    <div className="relative p-6 flex items-start gap-6">
                                      {/* Activity Icon */}
                                      <div className={clsx(
                                        "h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300",
                                        typeInfo.gradient
                                      )}>
                                        <typeInfo.icon className="h-8 w-8 text-white" />
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                              <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
                                                {item.title}
                                              </h4>
                                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                                <statusInfo.icon className="h-4 w-4" />
                                                {item.status}
                                              </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 mb-4 text-lg">
                                              {item.description}
                                            </p>
                                            
                                            {/* Timeline Details */}
                                            <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
                                              {item.date && (
                                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                                                  <CalendarDaysIcon className="h-5 w-5" />
                                                  <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                                                </div>
                                              )}
                                              {item.time && (
                                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                                                  <ClockIcon className="h-5 w-5" />
                                                  <span className="font-medium">{item.time}</span>
                                                </div>
                                              )}
                                              {item.location && (
                                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                                                  <MapPinIcon className="h-5 w-5" />
                                                  <span className="font-medium">{item.location}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          
                                          {/* Edit Button */}
                                          {item.isEditable && (
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300"
                                            >
                                              <PencilIcon className="h-5 w-5" />
                                            </motion.button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}