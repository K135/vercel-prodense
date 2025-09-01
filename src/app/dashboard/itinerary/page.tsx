'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  BuildingOffice2Icon,
  AirplaneIcon,
  UserGroupIcon,
  CameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { 
  MapPinIcon as MapSolid,
  CalendarDaysIcon as CalendarSolid,
  CheckCircleIcon as CheckSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const itineraryData = {
  trip: {
    destination: 'Mumbai, India',
    duration: '7 days',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    status: 'confirmed'
  },
  timeline: [
    {
      id: 1,
      date: '2024-03-15',
      day: 'Day 1',
      title: 'Arrival & Initial Consultation',
      items: [
        {
          time: '08:00 AM',
          type: 'flight',
          title: 'Flight Departure',
          description: 'LAX → BOM (Air India AI173)',
          location: 'Los Angeles International Airport',
          status: 'confirmed',
          icon: AirplaneIcon
        },
        {
          time: '11:30 PM',
          type: 'flight',
          title: 'Flight Arrival',
          description: 'Welcome to Mumbai!',
          location: 'Chhatrapati Shivaji Airport',
          status: 'confirmed',
          icon: AirplaneIcon
        },
        {
          time: '01:00 AM+1',
          type: 'transport',
          title: 'Airport Transfer',
          description: 'Private transfer to hotel',
          location: 'Mumbai Airport → Hotel',
          status: 'confirmed',
          icon: MapPinIcon
        }
      ]
    },
    {
      id: 2,
      date: '2024-03-16',
      day: 'Day 2',
      title: 'Medical Consultation & City Tour',
      items: [
        {
          time: '10:00 AM',
          type: 'medical',
          title: 'Initial Dental Consultation',
          description: 'Dr. Priya Sharma - Comprehensive examination',
          location: 'Mumbai Dental Excellence',
          status: 'confirmed',
          icon: UserGroupIcon
        },
        {
          time: '02:00 PM',
          type: 'leisure',
          title: 'City Tour',
          description: 'Guided tour of historic Mumbai',
          location: 'Gateway of India & Marine Drive',
          status: 'optional',
          icon: CameraIcon
        }
      ]
    },
    {
      id: 3,
      date: '2024-03-17',
      day: 'Day 3',
      title: 'Treatment Day',
      items: [
        {
          time: '09:00 AM',
          type: 'medical',
          title: 'Pre-treatment Preparation',
          description: 'Final X-rays and treatment planning',
          location: 'Mumbai Dental Excellence',
          status: 'confirmed',
          icon: DocumentTextIcon
        },
        {
          time: '02:00 PM',
          type: 'medical',
          title: 'Teeth Whitening Treatment',
          description: 'Dr. Rajesh Kumar - Professional whitening',
          location: 'Delhi Premium Smile',
          status: 'confirmed',
          icon: UserGroupIcon
        }
      ]
    },
    {
      id: 4,
      date: '2024-03-20',
      day: 'Day 6',
      title: 'Final Treatment & Preparation',
      items: [
        {
          time: '09:00 AM',
          type: 'medical',
          title: 'Dental Implant Surgery',
          description: 'Dr. Anita Patel - Implant placement',
          location: 'Bangalore Advanced Dental',
          status: 'confirmed',
          icon: UserGroupIcon
        },
        {
          time: '03:00 PM',
          type: 'medical',
          title: 'Post-treatment Care Instructions',
          description: 'Recovery guidelines and medication',
          location: 'Bangalore Advanced Dental',
          status: 'pending',
          icon: DocumentTextIcon
        }
      ]
    },
    {
      id: 5,
      date: '2024-03-22',
      day: 'Day 8',
      title: 'Departure',
      items: [
        {
          time: '11:00 AM',
          type: 'medical',
          title: 'Final Check-up',
          description: 'Dr. Priya Sharma - Treatment review',
          location: 'Mumbai Dental Excellence',
          status: 'confirmed',
          icon: UserGroupIcon
        },
        {
          time: '06:00 PM',
          type: 'flight',
          title: 'Flight Departure',
          description: 'BOM → LAX (Air India AI174)',
          location: 'Chhatrapati Shivaji Airport',
          status: 'confirmed',
          icon: AirplaneIcon
        }
      ]
    }
  ],
  accommodation: {
    hotel: 'The Taj Mahal Palace Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    checkIn: '2024-03-15',
    checkOut: '2024-03-22',
    roomType: 'Deluxe Room with Sea View',
    amenities: ['Free WiFi', 'Spa Access', 'Airport Transfer', '24/7 Concierge']
  },
  contacts: [
    {
      name: 'Dr. Priya Sharma',
      role: 'Lead Dentist',
      clinic: 'Mumbai Dental Excellence',
      phone: '+91 22 2555 0123',
      email: 'priya.sharma@mumbaidental.com'
    },
    {
      name: 'Ravi Patel',
      role: 'Patient Coordinator',
      clinic: 'Prodense Mumbai Office',
      phone: '+91 22 2555 0456',
      email: 'ravi.patel@prodense.com'
    },
    {
      name: 'Emergency Hotline',
      role: '24/7 Support',
      clinic: 'Prodense Support',
      phone: '+91 22 2555 0999',
      email: 'emergency@prodense.com'
    }
  ]
}

const statusConfig = {
  confirmed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckSolid },
  pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: ClockIcon },
  optional: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: InformationCircleIcon }
}

const typeConfig = {
  flight: { gradient: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  medical: { gradient: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  transport: { gradient: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  leisure: { gradient: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' }
}

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DB3116] via-red-600 to-orange-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">My Treatment Itinerary</h1>
              <p className="text-white/80">Your complete dental tourism journey</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Destination</p>
                  <p className="font-semibold">{itineraryData.trip.destination}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CalendarSolid className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Duration</p>
                  <p className="font-semibold">{itineraryData.trip.duration}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <ClockIcon className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Start Date</p>
                  <p className="font-semibold">
                    {new Date(itineraryData.trip.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckSolid className="h-6 w-6 text-white" />
                <div>
                  <p className="text-sm text-white/80">Status</p>
                  <p className="font-semibold capitalize">{itineraryData.trip.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Treatment Timeline</h2>
        
        <div className="space-y-8">
          {itineraryData.timeline.map((day, dayIndex) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + dayIndex * 0.1 }}
              className="relative"
            >
              {/* Day Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {day.day.split(' ')[1]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {day.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="ml-6 space-y-4">
                {day.items.map((item, itemIndex) => {
                  const typeInfo = typeConfig[item.type as keyof typeof typeConfig]
                  const statusInfo = statusConfig[item.status as keyof typeof statusConfig]
                  
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + dayIndex * 0.1 + itemIndex * 0.05 }}
                      className="relative flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Timeline connector */}
                      {itemIndex !== day.items.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-slate-200 dark:bg-slate-600" />
                      )}
                      
                      {/* Icon */}
                      <div className={clsx(
                        "h-12 w-12 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg flex-shrink-0",
                        typeInfo.gradient
                      )}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {item.title}
                              </h4>
                              <span className={clsx(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                statusInfo.color
                              )}>
                                <statusInfo.icon className="h-3 w-3" />
                                {item.status}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-1">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accommodation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Accommodation</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {itineraryData.accommodation.hotel}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                {itineraryData.accommodation.address}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Check-in</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(itineraryData.accommodation.checkIn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Check-out</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(itineraryData.accommodation.checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                {itineraryData.accommodation.roomType}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {itineraryData.accommodation.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Important Contacts</h2>
          </div>
          
          <div className="space-y-4">
            {itineraryData.contacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {contact.role} • {contact.clinic}
                    </p>
                  </div>
                  {contact.name === 'Emergency Hotline' && (
                    <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                      24/7
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                    <a href={`tel:${contact.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>
                    <a href={`mailto:${contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}