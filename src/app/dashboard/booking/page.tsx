'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  CalendarDaysIcon as CalendarSolid,
  ClockIcon as ClockSolid,
  CheckCircleIcon as CheckSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface Booking {
  id: string
  bookingNumber: string
  title: string
  dentist?: string
  clinic?: string
  appointmentDate: string
  appointmentTime?: string
  duration?: string
  type?: string
  status: string
  location?: string
  price?: string
  avatar?: string
  rating?: number
  specialties?: string[]
  image?: string
  treatmentType?: string
  clinicName?: string
  doctorName?: string
  cost?: number
  currency?: string
}

const statusConfig = {
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckSolid,
    iconColor: 'text-green-500'
  },
  pending: {
    label: 'Pending Confirmation',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: ClockSolid,
    iconColor: 'text-yellow-500'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: CalendarSolid,
    iconColor: 'text-blue-500'
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: CheckSolid,
    iconColor: 'text-gray-500'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    icon: ClockSolid,
    iconColor: 'text-red-500'
  },
}

export default function BookingPage() {
  const { user, token } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    thisMonth: 0
  })

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        console.log('Fetching bookings with token:', token ? 'Token exists' : 'No token')
        console.log('User ID:', user?.id || 'Unknown ID')
        
        const response = await apiClient.bookings.getAll(token)
        
        console.log('Bookings API Response:', response)
        console.log('Response success:', response.success)
        console.log('Response data:', response.data)
        
        if (response.success && response.data) {
          const bookingsData = response.data.bookings || response.data || []
          console.log('Bookings Data:', bookingsData)
          console.log('Bookings Data Length:', bookingsData.length)
          
          // Transform backend data to match our interface
          const transformedBookings: Booking[] = bookingsData.map((booking: any) => {
            // Handle populated dentist data - avoid "Dr. Dr." duplication
            let dentistName = 'Dr. Unknown'
            if (booking.dentistId) {
              const firstName = booking.dentistId.firstName || ''
              const lastName = booking.dentistId.lastName || ''
              const fullName = `${firstName} ${lastName}`.trim()
              // Check if the name already starts with "Dr."
              dentistName = fullName.toLowerCase().startsWith('dr.') ? fullName : `Dr. ${fullName}`
            } else if (booking.doctorName) {
              // Check if doctorName already starts with "Dr."
              dentistName = booking.doctorName.toLowerCase().startsWith('dr.') ? booking.doctorName : `Dr. ${booking.doctorName}`
            }
            
            const clinicName = booking.clinic?.name || booking.clinicName || 'Clinic'
            
            // Format address object into a readable string
            let location = 'Location TBD'
            if (booking.clinic?.address && typeof booking.clinic.address === 'object') {
              const addr = booking.clinic.address
              const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean)
              location = parts.length > 0 ? parts.join(', ') : 'Location TBD'
            } else if (booking.location) {
              location = booking.location
            }
            
            // Generate booking number from ID or use existing bookingNumber
            const bookingId = booking._id || booking.id
            const bookingNumber = booking.bookingNumber || `BK${bookingId.slice(-6).toUpperCase()}`
            
            return {
              id: bookingId,
              bookingNumber: bookingNumber,
              title: booking.treatmentType || booking.title || 'Dental Appointment',
              dentist: dentistName,
              clinic: clinicName,
              appointmentDate: booking.appointmentDate,
              appointmentTime: booking.appointmentTime,
              duration: booking.duration ? `${booking.duration} min` : '60 min',
              type: booking.treatmentType || booking.type,
              status: booking.status || 'pending',
              location: location,
              price: booking.estimatedCost?.amount ? `$${booking.estimatedCost.amount}` : booking.finalCost?.amount ? `$${booking.finalCost.amount}` : 'TBD',
              avatar: dentistName.split(' ').map((n: string) => n[0]).join(''),
              rating: booking.dentistId?.rating?.average || booking.rating || 4.5,
              specialties: booking.dentistId?.specializations || booking.specialties || [],
              image: booking.image || '/images/clinic-default.jpg',
              treatmentType: booking.treatmentType,
              clinicName: clinicName,
              doctorName: dentistName,
              cost: booking.estimatedCost?.amount || booking.finalCost?.amount,
              currency: booking.estimatedCost?.currency || booking.finalCost?.currency || 'USD'
            }
          })

          setBookings(transformedBookings)

          // Calculate stats
          const now = new Date()
          const thisMonth = now.getMonth()
          const thisYear = now.getFullYear()

          const newStats = {
            total: transformedBookings.length,
            confirmed: transformedBookings.filter(b => b.status === 'confirmed').length,
            pending: transformedBookings.filter(b => b.status === 'pending').length,
            thisMonth: transformedBookings.filter(b => {
              const bookingDate = new Date(b.appointmentDate)
              return bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear
            }).length
          }

          setStats(newStats)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        })
        // Set empty state on error
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [token, user])

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter
    const matchesSearch = (booking.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.dentist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.clinic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase())) ?? false
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage your dental appointments and treatments
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#DB3116] to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusIcon className="h-5 w-5" />
          Book New Appointment
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: stats.total.toString(), icon: CalendarDaysIcon, gradient: 'from-blue-500 to-purple-600' },
          { label: 'Confirmed', value: stats.confirmed.toString(), icon: CheckCircleIcon, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Pending', value: stats.pending.toString(), icon: ClockIcon, gradient: 'from-yellow-500 to-orange-600' },
          { label: 'This Month', value: stats.thisMonth.toString(), icon: CalendarDaysIcon, gradient: 'from-pink-500 to-rose-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className={clsx(
                "h-12 w-12 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg",
                stat.gradient
              )}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by booking number, appointments, dentists, or clinics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-slate-400" />
            {['all', 'confirmed', 'pending', 'scheduled', 'completed', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize",
                  selectedFilter === filter
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <CalendarDaysIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {searchQuery || selectedFilter !== 'all' ? 'No bookings found' : 'No bookings yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start your dental journey by booking your first appointment.'}
            </p>
            {(!searchQuery && selectedFilter === 'all') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#DB3116] to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlusIcon className="h-5 w-5" />
                Book Your First Appointment
              </motion.button>
            )}
          </motion.div>
        ) : (
          filteredBookings.map((booking, index) => {
          const statusInfo = statusConfig[booking.status as keyof typeof statusConfig] || {
            label: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            icon: ClockSolid,
            iconColor: 'text-gray-500'
          }
          
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left Section - Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {/* Booking Number */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {booking.bookingNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {booking.title}
                          </h3>
                          <span className={clsx(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                            statusInfo.color
                          )}>
                            <statusInfo.icon className="h-4 w-4" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          {booking.dentist} • {booking.clinic}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              {booking.rating}
                            </span>
                          </div>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {(booking.specialties ?? []).join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {booking.price}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {booking.duration}
                        </div>
                      </div>
                    </div>

                    {/* Date and Time Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <CalendarDaysIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(booking.appointmentDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {booking.appointmentTime || 'TBD'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Time</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                          <MapPinIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {booking.location}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Doctor Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {booking.avatar}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Reschedule
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })
        )}
      </div>
    </div>
  )
}