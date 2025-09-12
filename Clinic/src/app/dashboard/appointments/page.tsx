'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Appointment {
  id: string
  patient: {
    name: string
    email: string
    phone: string
    avatar: string
  }
  treatment: string
  date: string
  time: string
  duration: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  type: 'in-person' | 'virtual'
  notes?: string
  isFirstVisit: boolean
}

export default function AppointmentsPage() {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const appointments: Appointment[] = [
    {
      id: '1',
      patient: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        avatar: 'SJ'
      },
      treatment: 'Dental Cleaning',
      date: '2024-01-15',
      time: '09:00',
      duration: 60,
      status: 'confirmed',
      type: 'in-person',
      isFirstVisit: false,
      notes: 'Regular checkup and cleaning'
    },
    {
      id: '2',
      patient: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 234-5678',
        avatar: 'MC'
      },
      treatment: 'Root Canal Consultation',
      date: '2024-01-15',
      time: '10:30',
      duration: 45,
      status: 'pending',
      type: 'virtual',
      isFirstVisit: true,
      notes: 'Patient experiencing pain in upper left molar'
    },
    {
      id: '3',
      patient: {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1 (555) 345-6789',
        avatar: 'ED'
      },
      treatment: 'Teeth Whitening',
      date: '2024-01-15',
      time: '14:00',
      duration: 90,
      status: 'confirmed',
      type: 'in-person',
      isFirstVisit: false
    },
    {
      id: '4',
      patient: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 456-7890',
        avatar: 'JS'
      },
      treatment: 'Dental Implant Follow-up',
      date: '2024-01-15',
      time: '15:30',
      duration: 30,
      status: 'completed',
      type: 'in-person',
      isFirstVisit: false,
      notes: 'Post-surgery checkup, healing well'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />
    }
  }

  const handleAcceptAppointment = (appointmentId: string) => {
    // Handle appointment acceptance
    console.log('Accepting appointment:', appointmentId)
  }

  const handleRejectAppointment = (appointmentId: string) => {
    // Handle appointment rejection
    console.log('Rejecting appointment:', appointmentId)
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    // Handle appointment rescheduling
    console.log('Rescheduling appointment:', appointmentId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your clinic's appointment calendar</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button className="btn-primary flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            {['day', 'week', 'month'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === view
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Types</option>
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {appointment.patient.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
                      {appointment.isFirstVisit && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          First Visit
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{appointment.treatment}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {appointment.time} ({appointment.duration} min)
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        {appointment.type === 'virtual' ? (
                          <VideoCameraIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <MapPinIcon className="h-4 w-4 mr-1" />
                        )}
                        {appointment.type === 'virtual' ? 'Virtual' : 'In-Person'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1 capitalize">{appointment.status}</span>
                  </span>

                  {appointment.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAcceptAppointment(appointment.id)
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRejectAppointment(appointment.id)
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedAppointment.patient.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedAppointment.patient.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {selectedAppointment.patient.email}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {selectedAppointment.patient.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                    <p className="text-gray-900">{selectedAppointment.treatment}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <p className="text-gray-900">
                      {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <p className="text-gray-900">{selectedAppointment.duration} minutes</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <p className="text-gray-900 capitalize">{selectedAppointment.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                      {getStatusIcon(selectedAppointment.status)}
                      <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                    <p className="text-gray-900">{selectedAppointment.isFirstVisit ? 'First Visit' : 'Follow-up'}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptAppointment(selectedAppointment.id)}
                      className="btn-primary flex items-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectAppointment(selectedAppointment.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleRescheduleAppointment(selectedAppointment.id)}
                  className="btn-secondary flex items-center"
                >
                  <CalendarDaysIcon className="h-5 w-5 mr-2" />
                  Reschedule
                </button>
                <button className="btn-secondary flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Message Patient
                </button>
                <button className="btn-secondary flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  View Records
                </button>
                {selectedAppointment.type === 'virtual' && (
                  <button className="btn-primary flex items-center">
                    <VideoCameraIcon className="h-5 w-5 mr-2" />
                    Start Video Call
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}