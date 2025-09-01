'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  HeartIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  IdentificationIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  UserIcon as UserSolid,
  HeartIcon as HeartSolid,
  ShieldCheckIcon as ShieldSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const profileData = {
  personalInfo: {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1985-08-22',
    gender: 'Male',
    nationality: 'American',
    address: '456 Oak Avenue, Los Angeles, CA 90210',
    emergencyContact: {
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 876-5432'
    }
  },
  healthProfile: {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Latex'],
    medications: ['Lisinopril 10mg daily'],
    medicalConditions: ['Hypertension'],
    lastDentalVisit: '2023-12-15',
    dentalHistory: [
      'Root canal treatment (2022)',
      'Teeth cleaning (2023)',
      'Wisdom tooth extraction (2021)'
    ]
  },
  documents: [
    { id: 1, name: 'Passport', type: 'ID', status: 'verified', uploadDate: '2024-01-15' },
    { id: 2, name: 'Medical Insurance', type: 'Insurance', status: 'pending', uploadDate: '2024-02-01' },
    { id: 3, name: 'Dental X-Ray', type: 'Medical', status: 'verified', uploadDate: '2024-02-10' },
    { id: 4, name: 'Blood Test Results', type: 'Medical', status: 'verified', uploadDate: '2024-02-05' }
  ]
}

const sections = [
  { id: 'personal', name: 'Personal Information', icon: UserIcon, iconSolid: UserSolid },
  { id: 'health', name: 'Health Profile', icon: HeartIcon, iconSolid: HeartSolid },
  { id: 'documents', name: 'Documents', icon: DocumentTextIcon, iconSolid: DocumentTextIcon }
]

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(profileData.personalInfo)

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    setEditedData(profileData.personalInfo)
    setIsEditing(false)
  }

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
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              MJ
            </div>
            <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <CameraIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
            </h1>
            <p className="text-white/80 mb-4">Premium Patient • Member since 2024</p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{profileData.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{profileData.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>Los Angeles, USA</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-white/80">Profile Complete</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2"
      >
        <div className="flex space-x-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id
            const Icon = isActive ? section.iconSolid : section.icon
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={clsx(
                  "flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{section.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Content Sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'personal' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </motion.button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.firstName}
                        onChange={(e) => setEditedData({...editedData, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                        {profileData.personalInfo.firstName}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.lastName}
                        onChange={(e) => setEditedData({...editedData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                        {profileData.personalInfo.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                    {profileData.personalInfo.email}
                    <span className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-slate-400" />
                      {profileData.personalInfo.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Additional Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date of Birth
                    </label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                      <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                      {new Date(profileData.personalInfo.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Gender
                    </label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                      {profileData.personalInfo.gender}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nationality
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-slate-400" />
                    {profileData.personalInfo.nationality}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedData.address}
                      onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-slate-400 mt-0.5" />
                      {profileData.personalInfo.address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                    {profileData.personalInfo.emergencyContact.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Relationship
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                    {profileData.personalInfo.emergencyContact.relationship}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                    {profileData.personalInfo.emergencyContact.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'health' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Health Profile</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Medical Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Medical Information</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Blood Type</h4>
                    <p className="text-red-700 dark:text-red-400 font-semibold text-lg">
                      {profileData.healthProfile.bloodType}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.healthProfile.allergies.map((allergy, index) => (
                        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Current Medications</h4>
                    <ul className="space-y-1">
                      {profileData.healthProfile.medications.map((medication, index) => (
                        <li key={index} className="text-blue-700 dark:text-blue-400">
                          • {medication}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Medical Conditions</h4>
                    <ul className="space-y-1">
                      {profileData.healthProfile.medicalConditions.map((condition, index) => (
                        <li key={index} className="text-purple-700 dark:text-purple-400">
                          • {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dental History */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dental History</h3>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Last Dental Visit</h4>
                  <p className="text-green-700 dark:text-green-400 font-semibold">
                    {new Date(profileData.healthProfile.lastDentalVisit).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h4 className="font-medium text-slate-900 dark:text-slate-300 mb-3">Previous Treatments</h4>
                  <div className="space-y-2">
                    {profileData.healthProfile.dentalHistory.map((treatment, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-700 dark:text-slate-300">{treatment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <DocumentTextIcon className="h-4 w-4" />
                Upload Document
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "h-12 w-12 rounded-lg flex items-center justify-center",
                        document.type === 'ID' ? "bg-blue-100 dark:bg-blue-900/20" :
                        document.type === 'Insurance' ? "bg-green-100 dark:bg-green-900/20" :
                        "bg-purple-100 dark:bg-purple-900/20"
                      )}>
                        <IdentificationIcon className={clsx(
                          "h-6 w-6",
                          document.type === 'ID' ? "text-blue-600 dark:text-blue-400" :
                          document.type === 'Insurance' ? "text-green-600 dark:text-green-400" :
                          "text-purple-600 dark:text-purple-400"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {document.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {document.type}
                        </p>
                      </div>
                    </div>
                    
                    <span className={clsx(
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                      document.status === 'verified' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    )}>
                      {document.status === 'verified' ? (
                        <ShieldSolid className="h-4 w-4" />
                      ) : (
                        <ClockIcon className="h-4 w-4" />
                      )}
                      {document.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
                  </p>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View
                    </button>
                    <button className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                      Replace
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}