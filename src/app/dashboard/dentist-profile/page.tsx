'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  AcademicCapIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'

// Mock data for booked dentists
const bookedDentists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Orthodontist",
    clinic: "Smile Dental Clinic",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    reviews: 156,
    experience: "12 years",
    nextAppointment: "2024-03-15T10:00:00.000Z",
    phone: "+91 98765 43210",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    isVerified: true,
    languages: ["English", "Hindi", "Marathi"],
    treatments: ["Invisalign", "Braces", "Retainers"],
    bookingDate: "2024-02-15",
    status: "confirmed"
  },
  {
    id: "2",
    name: "Dr. Rajesh Patel",
    specialty: "General Dentist",
    clinic: "City Dental Care",
    location: "Mumbai, Maharashtra",
    rating: 4.7,
    reviews: 89,
    experience: "8 years",
    nextAppointment: "2024-03-20T14:30:00.000Z",
    phone: "+91 98765 43211",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    isVerified: true,
    languages: ["English", "Hindi", "Gujarati"],
    treatments: ["Cleaning", "Fillings", "Root Canal"],
    bookingDate: "2024-02-20",
    status: "pending"
  }
]

// Mock data for saved dentists
const savedDentists = [
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialty: "Cosmetic Dentist",
    clinic: "Elite Dental Studio",
    location: "Mumbai, Maharashtra",
    rating: 4.8,
    reviews: 203,
    experience: "15 years",
    phone: "+91 98765 43212",
    image: "https://images.unsplash.com/photo-1594824475317-d3c2b8b8b8b8?w=400&h=400&fit=crop&crop=face",
    isVerified: true,
    languages: ["English", "Hindi"],
    treatments: ["Veneers", "Whitening", "Smile Makeover"],
    savedDate: "2024-02-10",
    availability: "Available this week"
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    specialty: "Oral Surgeon",
    clinic: "Advanced Dental Center",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    reviews: 134,
    experience: "18 years",
    phone: "+91 98765 43213",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    isVerified: true,
    languages: ["English", "Mandarin"],
    treatments: ["Implants", "Extractions", "Jaw Surgery"],
    savedDate: "2024-01-25",
    availability: "Booking available"
  },
  {
    id: "5",
    name: "Dr. Anita Desai",
    specialty: "Pediatric Dentist",
    clinic: "Kids Dental World",
    location: "Mumbai, Maharashtra",
    rating: 4.6,
    reviews: 78,
    experience: "10 years",
    phone: "+91 98765 43214",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=face",
    isVerified: true,
    languages: ["English", "Hindi", "Marathi"],
    treatments: ["Child Dentistry", "Preventive Care", "Fluoride Treatment"],
    savedDate: "2024-02-05",
    availability: "Available next week"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export default function DentistProfilePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filters = ['All', 'Orthodontist', 'General Dentist', 'Cosmetic Dentist', 'Oral Surgeon', 'Pediatric Dentist']

  const filteredSavedDentists = savedDentists.filter(dentist => {
    const matchesSearch = dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dentist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'All' || dentist.specialty === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Saved Clinics
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your booked appointments and saved dentist profiles
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-[#DB3116] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" />
            Find Dentist
          </button>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dentists by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-[#DB3116] focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#DB3116] focus:border-transparent"
          >
            {filters.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Booked Dentists Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CalendarDaysIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Booked Dentists
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your upcoming and confirmed appointments
                </p>
              </div>
            </div>
            <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              {bookedDentists.length} Active
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookedDentists.map((dentist, index) => (
              <motion.div
                key={dentist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={dentist.image}
                      alt={dentist.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-lg"
                    />
                    {dentist.isVerified && (
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500 absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {dentist.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dentist.status)}`}>
                        {dentist.status.charAt(0).toUpperCase() + dentist.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-[#DB3116] font-medium">{dentist.specialty}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(dentist.rating)
                                ? 'text-yellow-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {dentist.rating} ({dentist.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {dentist.clinic}, {dentist.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Next: {new Date(dentist.nextAppointment).toLocaleDateString()} at {new Date(dentist.nextAppointment).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    {dentist.experience} experience
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {dentist.treatments.slice(0, 3).map((treatment) => (
                    <span
                      key={treatment}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs"
                    >
                      {treatment}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-[#DB3116] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Call
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Saved Dentists Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Saved Dentists
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your favorite dentists for future appointments
                </p>
              </div>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              {filteredSavedDentists.length} Saved
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSavedDentists.map((dentist, index) => (
              <motion.div
                key={dentist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={dentist.image}
                        alt={dentist.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-lg"
                      />
                      {dentist.isVerified && (
                        <CheckBadgeIcon className="h-4 w-4 text-blue-500 absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {dentist.name}
                      </h3>
                      <p className="text-sm text-[#DB3116] font-medium">{dentist.specialty}</p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-600 transition-colors">
                    <HeartIconSolid className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(dentist.rating)
                            ? 'text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    {dentist.rating} ({dentist.reviews})
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{dentist.clinic}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <AcademicCapIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    {dentist.experience} experience
                  </div>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    {dentist.availability}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {dentist.treatments.slice(0, 2).map((treatment) => (
                    <span
                      key={treatment}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs"
                    >
                      {treatment}
                    </span>
                  ))}
                  {dentist.treatments.length > 2 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs">
                      +{dentist.treatments.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-[#DB3116] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Book Now
                  </button>
                  <button className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSavedDentists.length === 0 && (
            <div className="text-center py-12">
              <BookmarkIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No saved dentists found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}