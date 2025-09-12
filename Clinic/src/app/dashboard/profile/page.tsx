'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  CameraIcon,
  CheckBadgeIcon,
  StarIcon,
  UserPlusIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('clinic')

  const clinicInfo = {
    name: 'SmileCare Dental Clinic',
    description: 'Premier dental care facility providing comprehensive oral health services with state-of-the-art technology and experienced professionals.',
    address: '123 Medical Plaza, Downtown District, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@smilecare.com',
    website: 'www.smilecare.com',
    established: '2015',
    rating: 4.8,
    totalReviews: 234,
    isVerified: true,
    operatingHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: 'Closed'
    }
  }

  const specialties = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Periodontics',
    'Endodontics',
    'Pediatric Dentistry',
    'Dental Implants'
  ]

  const procedures = [
    'Teeth Cleaning',
    'Teeth Whitening',
    'Dental Crowns',
    'Root Canal',
    'Dental Implants',
    'Braces',
    'Invisalign',
    'Wisdom Tooth Extraction',
    'Dental Bridges',
    'Veneers'
  ]

  const accreditations = [
    {
      name: 'American Dental Association',
      code: 'ADA-2024-001',
      validUntil: '2025-12-31'
    },
    {
      name: 'Joint Commission Accreditation',
      code: 'JC-HC-2024-789',
      validUntil: '2026-06-30'
    },
    {
      name: 'ISO 9001:2015 Quality Management',
      code: 'ISO-9001-2024-456',
      validUntil: '2025-09-15'
    }
  ]

  const doctors = [
    {
      id: 1,
      name: 'Dr. Michael Smith',
      specialty: 'General Dentistry',
      experience: '15 years',
      education: 'DDS, Harvard School of Dental Medicine',
      isPublic: true,
      avatar: 'MS'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      specialty: 'Orthodontics',
      experience: '12 years',
      education: 'DDS, MS, Columbia University',
      isPublic: true,
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Dr. David Chen',
      specialty: 'Oral Surgery',
      experience: '18 years',
      education: 'DDS, MD, UCLA School of Dentistry',
      isPublic: false,
      avatar: 'DC'
    }
  ]

  const tabs = [
    { id: 'clinic', name: 'Clinic Details', icon: BuildingOffice2Icon },
    { id: 'doctors', name: 'Doctors', icon: UserPlusIcon },
    { id: 'credentials', name: 'Credentials', icon: CheckBadgeIcon }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile & Credentials</h1>
          <p className="text-gray-600 mt-2">Manage your clinic information and verification status</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`btn-${isEditing ? 'secondary' : 'primary'} flex items-center`}
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Verification Status */}
      <motion.div 
        className="bg-green-50 border border-green-200 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          <CheckBadgeIcon className="h-8 w-8 text-green-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Verified Clinic</h3>
            <p className="text-green-700">Your clinic has been verified by our admin team. All features are available.</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'clinic' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Basic Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{clinicInfo.rating}</span>
                  <span className="text-gray-500">({clinicInfo.totalReviews} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Clinic Photo */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                      <BuildingOffice2Icon className="h-16 w-16 text-primary-600" />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                        <CameraIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Clinic Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={clinicInfo.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{clinicInfo.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        defaultValue={clinicInfo.description}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                      />
                    ) : (
                      <p className="text-gray-600">{clinicInfo.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {isEditing ? (
                          <input
                            type="tel"
                            defaultValue={clinicInfo.phone}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        ) : (
                          <span className="text-gray-900">{clinicInfo.phone}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {isEditing ? (
                          <input
                            type="email"
                            defaultValue={clinicInfo.email}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        ) : (
                          <span className="text-gray-900">{clinicInfo.email}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      {isEditing ? (
                        <textarea
                          rows={2}
                          defaultValue={clinicInfo.address}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <span className="text-gray-900">{clinicInfo.address}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="url"
                          defaultValue={clinicInfo.website}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <a href={`https://${clinicInfo.website}`} className="text-primary-600 hover:text-primary-700">
                          {clinicInfo.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Operating Hours</h2>
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(clinicInfo.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={hours}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    ) : (
                      <span className="text-gray-600">{hours}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specialties & Procedures */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Specialties */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Specialties</h2>
                  {isEditing && (
                    <button className="text-primary-600 hover:text-primary-700">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {specialty}
                      {isEditing && (
                        <button className="ml-2 text-primary-600 hover:text-primary-800">
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Procedures */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Procedures</h2>
                  {isEditing && (
                    <button className="text-primary-600 hover:text-primary-700">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {procedures.map((procedure, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {procedure}
                      {isEditing && (
                        <button className="ml-2 text-blue-600 hover:text-blue-800">
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'doctors' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Doctor Management</h2>
              <button className="btn-primary flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {doctor.avatar}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doctor.isPublic ? 'Public' : 'Private'}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-sm text-primary-600 mb-2">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500 mb-2">{doctor.experience} experience</p>
                  <p className="text-xs text-gray-400">{doctor.education}</p>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={doctor.isPublic}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show in public search</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'credentials' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Accreditations & Badges</h2>
              <button className="btn-primary flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload New Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accreditations.map((accreditation, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <CheckBadgeIcon className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{accreditation.name}</h3>
                        <p className="text-sm text-gray-500">Code: {accreditation.code}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Valid until: {new Date(accreditation.validUntil).toLocaleDateString()}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Certificate
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Save Button */}
      {isEditing && (
        <motion.div 
          className="fixed bottom-8 right-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={() => setIsEditing(false)}
            className="btn-primary shadow-2xl"
          >
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  )
}