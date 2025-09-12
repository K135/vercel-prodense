'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  PhotoIcon,
  BeakerIcon,
  HeartIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { 
  DocumentTextIcon as DocumentTextIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/solid'

// Mock data based on your sample
const mockBookings = [
  {
    _id: "68b99ae9246eff0a3c70198b",
    bookingNumber: "BK-2024-001234",
    treatmentType: "orthodontics",
    treatmentDescription: "Initial consultation for Invisalign treatment",
    appointmentDate: "2024-03-15T10:00:00.000Z",
    appointmentTime: "10:00",
    duration: 60,
    status: "confirmed",
    estimatedCost: {
      amount: 150,
      currency: "USD"
    },
    paymentStatus: "paid",
    clinic: {
      name: "Smile Dental Clinic",
      address: {
        street: "123 Dental Street",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      }
    }
  },
  {
    _id: "68b99ae9246eff0a3c70198c",
    bookingNumber: "BK-2024-001235",
    treatmentType: "cleaning",
    treatmentDescription: "Professional dental cleaning and checkup",
    appointmentDate: "2024-03-20T14:30:00.000Z",
    appointmentTime: "14:30",
    duration: 45,
    status: "pending",
    estimatedCost: {
      amount: 80,
      currency: "USD"
    },
    paymentStatus: "pending",
    clinic: {
      name: "City Dental Care",
      address: {
        street: "456 Health Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      }
    }
  }
]

const mockReports = [
  {
    _id: "68b99ae9246eff0a3c70199f",
    title: "Dental X-Ray Report",
    type: "panoramic-xray",
    category: "diagnostic",
    clinicName: "Radiology Center Mumbai",
    description: "Panoramic X-ray showing overall dental condition",
    reportDate: "2024-01-10T00:00:00.000Z",
    reportNumber: "RPT-2024-001234",
    status: "approved",
    findings: [
      {
        category: "normal",
        description: "Overall good dental health",
        location: "general"
      },
      {
        category: "requires-attention",
        description: "Minor plaque buildup on lower molars",
        location: "lower molars",
        severity: "mild"
      }
    ],
    recommendations: [
      {
        treatment: "Professional cleaning",
        priority: "medium",
        timeframe: "2-4 weeks"
      }
    ],
    files: [
      {
        fileName: "panoramic_xray_2024.pdf",
        originalName: "Panoramic X-Ray January 2024.pdf",
        fileSize: 2048576,
        mimeType: "application/pdf"
      }
    ]
  },
  {
    _id: "68b99ae9246eff0a3c7019a0",
    title: "Blood Test Results",
    type: "blood-test",
    category: "diagnostic",
    clinicName: "PathLab Mumbai",
    description: "Complete blood count and metabolic panel",
    reportDate: "2024-02-15T00:00:00.000Z",
    reportNumber: "RPT-2024-001235",
    status: "approved",
    findings: [
      {
        category: "normal",
        description: "All parameters within normal range",
        location: "general"
      }
    ],
    files: [
      {
        fileName: "blood_test_feb_2024.pdf",
        originalName: "Blood Test February 2024.pdf",
        fileSize: 1024576,
        mimeType: "application/pdf"
      }
    ]
  }
]

const mockDocuments = [
  {
    id: "1",
    name: "Medical History.docx",
    category: "Medicine",
    size: "2.1 MB",
    uploadDate: "2024-01-15",
    type: "docx"
  },
  {
    id: "2",
    name: "X-Ray Report.pdf",
    category: "X-Ray",
    size: "3.5 MB",
    uploadDate: "2024-01-10",
    type: "pdf"
  },
  {
    id: "3",
    name: "Lab Results.pdf",
    category: "Reports",
    size: "1.8 MB",
    uploadDate: "2024-02-15",
    type: "pdf"
  },
  {
    id: "4",
    name: "Insurance Card.png",
    category: "Others",
    size: "0.5 MB",
    uploadDate: "2024-01-05",
    type: "png"
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
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Medicine':
      return <BeakerIcon className="h-5 w-5" />
    case 'X-Ray':
      return <PhotoIcon className="h-5 w-5" />
    case 'Reports':
      return <DocumentTextIcon className="h-5 w-5" />
    default:
      return <DocumentIcon className="h-5 w-5" />
  }
}

const getFindingIcon = (category: string) => {
  switch (category) {
    case 'normal':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    case 'requires-attention':
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
    case 'critical':
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
    default:
      return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
  }
}

export default function ReportsPage() {
  const [expandedBookings, setExpandedBookings] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Medicine', 'Reports', 'X-Ray', 'Others']

  const toggleBookingExpansion = (bookingId: string) => {
    setExpandedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
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
            Reports & Documents
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your medical reports, bookings, and documents
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-[#D35C2F] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
      </motion.div>

      {/* Bookings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <CalendarDaysIconSolid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Recent Bookings
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Drop down to see your recent medical reports and documents
                </p>
              </div>
            </div>
            <button className="text-[#D35C2F] hover:text-red-700 text-sm font-medium flex items-center">
              View All
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <div key={booking._id} className="border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden">
                {/* Booking Header - Clickable */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => toggleBookingExpansion(booking._id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-[#D35C2F] to-red-600 flex items-center justify-center">
                      <DocumentTextIconSolid className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {booking.treatmentDescription}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          {new Date(booking.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {booking.appointmentTime}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {booking.clinic.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {booking.estimatedCost.currency} {booking.estimatedCost.amount}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {booking.bookingNumber}
                      </p>
                    </div>
                    <div className="ml-2">
                      {expandedBookings.includes(booking._id) ? (
                        <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Expandable Content - Full Medical Reports Overview and Documents */}
                {expandedBookings.includes(booking._id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-200 dark:border-slate-600"
                  >
                    <div className="p-8 bg-white dark:bg-slate-800 space-y-8">
                      
                      {/* Medical Reports Overview Section */}
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <DocumentTextIconSolid className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                              Medical Reports Overview
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Your recent medical reports and findings
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {mockReports.map((report) => (
                            <motion.div
                              key={report._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    {report.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                    <span>{report.clinicName}</span>
                                    <span>•</span>
                                    <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{report.reportNumber}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                  </span>
                                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <EyeIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <ShareIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {report.description}
                              </p>

                              {/* Findings */}
                              <div className="mb-4">
                                <h5 className="font-medium text-slate-900 dark:text-white mb-2">Key Findings:</h5>
                                <div className="space-y-2">
                                  {report.findings.map((finding, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                      {getFindingIcon(finding.category)}
                                      <div className="flex-1">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                          {finding.description}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                          Location: {finding.location}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Recommendations */}
                              {report.recommendations && report.recommendations.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-slate-900 dark:text-white mb-2">Recommendations:</h5>
                                  <div className="space-y-2">
                                    {report.recommendations.map((rec, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div>
                                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {rec.treatment}
                                          </p>
                                          <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Timeframe: {rec.timeframe}
                                          </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                                          {rec.priority}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Documents Section */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                              <DocumentIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Documents
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Organize your medical documents by category
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-6">
                          <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search documents..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-[#D35C2F] focus:border-transparent"
                            />
                          </div>
                          <div className="flex space-x-2">
                            {categories.map((category) => (
                              <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  selectedCategory === category
                                    ? 'bg-[#D35C2F] text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredDocuments.map((doc) => (
                            <motion.div
                              key={doc.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 border border-slate-200 dark:border-slate-600 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    {getCategoryIcon(doc.category)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-900 dark:text-white truncate">
                                      {doc.name}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      {doc.category}
                                    </p>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <EyeIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>{doc.size}</span>
                                <span>{doc.uploadDate}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {filteredDocuments.length === 0 && (
                          <div className="text-center py-12">
                            <DocumentIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                              No documents found
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400">
                              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>


    </div>
  )
}