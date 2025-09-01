'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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

const bookings = [
  {
    id: 1,
    title: 'Dental Consultation',
    dentist: 'Dr. Priya Sharma',
    clinic: 'Mumbai Dental Excellence',
    date: '2024-03-15',
    time: '10:00 AM',
    duration: '60 min',
    type: 'Initial Consultation',
    status: 'confirmed',
    location: 'Mumbai, India',
    price: '$45',
    avatar: 'PS',
    rating: 4.9,
    specialties: ['Cosmetic Dentistry', 'Implants'],
    image: '/images/clinic1.jpg'
  },
  {
    id: 2,
    title: 'Teeth Whitening',
    dentist: 'Dr. Rajesh Kumar',
    clinic: 'Delhi Premium Smile',
    date: '2024-03-17',
    time: '2:00 PM',
    duration: '90 min',
    type: 'Cosmetic Treatment',
    status: 'pending',
    location: 'New Delhi, India',
    price: '$85',
    avatar: 'RK',
    rating: 4.8,
    specialties: ['Cosmetic Dentistry', 'Whitening'],
    image: '/images/clinic2.jpg'
  },
  {
    id: 3,
    title: 'Dental Implant Surgery',
    dentist: 'Dr. Anita Patel',
    clinic: 'Bangalore Advanced Dental',
    date: '2024-03-20',
    time: '9:00 AM',
    duration: '120 min',
    type: 'Surgical Procedure',
    status: 'confirmed',
    location: 'Bangalore, India',
    price: '$280',
    avatar: 'AP',
    rating: 4.9,
    specialties: ['Oral Surgery', 'Implants'],
    image: '/images/clinic3.jpg'
  },
  {
    id: 4,
    title: 'Follow-up Check',
    dentist: 'Dr. Priya Sharma',
    clinic: 'Mumbai Dental Excellence',
    date: '2024-03-25',
    time: '11:30 AM',
    duration: '30 min',
    type: 'Follow-up',
    status: 'scheduled',
    location: 'Mumbai, India',
    price: '$25',
    avatar: 'PS',
    rating: 4.9,
    specialties: ['General Dentistry'],
    image: '/images/clinic1.jpg'
  },
]

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
}

export default function BookingPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter
    const matchesSearch = booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.dentist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.clinic.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
          { label: 'Total Bookings', value: '4', icon: CalendarDaysIcon, gradient: 'from-blue-500 to-purple-600' },
          { label: 'Confirmed', value: '2', icon: CheckCircleIcon, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Pending', value: '1', icon: ClockIcon, gradient: 'from-yellow-500 to-orange-600' },
          { label: 'This Month', value: '3', icon: CalendarDaysIcon, gradient: 'from-pink-500 to-rose-600' },
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
              placeholder="Search appointments, dentists, or clinics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-slate-400" />
            {['all', 'confirmed', 'pending', 'scheduled'].map((filter) => (
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
        {filteredBookings.map((booking, index) => {
          const statusInfo = statusConfig[booking.status as keyof typeof statusConfig]
          
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
                            {booking.specialties.join(', ')}
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
                            {new Date(booking.date).toLocaleDateString('en-US', { 
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
                            {booking.time}
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
        })}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <CalendarDaysIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No bookings found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchQuery || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'You haven\'t made any bookings yet. Book your first appointment!'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#DB3116] to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            Book New Appointment
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}