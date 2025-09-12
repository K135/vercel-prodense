'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import UserAvatar from '@/components/UserAvatar'
import HealthProfileSection from '@/components/profile/HealthProfileSection'
import DocumentsSection from '@/components/profile/DocumentsSection'
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

interface ProfileData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    nationality?: string
    country?: string
    profession?: string
    address?: string
  }
  healthProfile: {
    bloodType?: string
    allergies: string[]
    medications: string[]
    medicalConditions: string[]
    lastDentalVisit?: string
    dentalHistory: string[]
    emergencyContact?: {
      name: string
      relationship: string
      phone: string
    }
  }
  documents: Array<{
    id: number
    name: string
    type: string
    status: string
    uploadDate: string
  }>
}

const sections = [
  { id: 'personal', name: 'Personal Information', icon: UserIcon, iconSolid: UserSolid },
  { id: 'health', name: 'Health Profile', icon: HeartIcon, iconSolid: HeartSolid },
  { id: 'documents', name: 'Documents', icon: DocumentTextIcon, iconSolid: DocumentTextIcon }
]

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth()
  const { userInitials, avatarSrc, hasVerification } = useUserAvatar()
  const [activeSection, setActiveSection] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editedData, setEditedData] = useState<any>({})
  const [healthProfile, setHealthProfile] = useState<any>(null)
  const [editedEmergencyContact, setEditedEmergencyContact] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const hasFetchedAdditionalData = useRef(false)

  // Initialize profile data from user context
  useEffect(() => {
    if (user) {
      const initialProfileData: ProfileData = {
        personalInfo: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth || '',
          gender: user.gender || '',
          country: user.country || '',
          profession: user.profession || '',
          address: user.address || ''
        },
        healthProfile: {
          bloodType: '',
          allergies: [],
          medications: [],
          medicalConditions: [],
          lastDentalVisit: '',
          dentalHistory: [],
          emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
          }
        },
        documents: []
      }
      
      setProfileData(initialProfileData)
      // Initialize editedData with only the fields that can be edited via the backend
      // Ensure all values are strings (not undefined) for proper form handling
      const initialEditedData = {
        firstName: initialProfileData.personalInfo.firstName || '',
        lastName: initialProfileData.personalInfo.lastName || '',
        dateOfBirth: initialProfileData.personalInfo.dateOfBirth || '',
        gender: initialProfileData.personalInfo.gender || '',
        country: initialProfileData.personalInfo.country || '',
        profession: initialProfileData.personalInfo.profession || '',
        address: initialProfileData.personalInfo.address || ''
      }
      console.log('Setting initial editedData:', initialEditedData)
      setEditedData(initialEditedData)
      setLoading(false)
    }
  }, [user])

  // Fetch additional profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token || !user || !profileData || hasFetchedAdditionalData.current) return

      try {
        hasFetchedAdditionalData.current = true
        
        // Fetch health profile
        const healthRes = await apiClient.user.getHealthProfile(token).catch(() => null)

        // Fetch documents
        const docsRes = await apiClient.user.getDocuments(token).catch(() => null)

        const updatedProfile = { ...profileData }
        
        if (healthRes?.success && healthRes.data) {
          updatedProfile.healthProfile = {
            ...updatedProfile.healthProfile,
            ...healthRes.data
          }
          setHealthProfile(healthRes.data)
          
          // Initialize emergency contact edited data
          const initialEmergencyContact = {
            name: healthRes.data.emergencyContact?.name || '',
            relationship: healthRes.data.emergencyContact?.relationship || '',
            phone: healthRes.data.emergencyContact?.phone || ''
          }
          setEditedEmergencyContact(initialEmergencyContact)
        }

        if (docsRes?.success && docsRes.data) {
          updatedProfile.documents = docsRes.data.documents || []
        }

        setProfileData(updatedProfile)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        hasFetchedAdditionalData.current = false // Reset on error to allow retry
      }
    }

    // Only fetch once when user and token are available and profileData is initially set
    if (token && user && profileData) {
      fetchProfileData()
    }
  }, [token, user, profileData])

  const handleSave = async () => {
    if (!token || !profileData) return

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      // Only send fields that have actually changed and are not empty
      const dataToSend: Record<string, string | undefined> = {}
      const allowedFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'country', 'profession', 'address'] as const
      
      allowedFields.forEach(field => {
        const newValue = editedData[field] || ''
        const originalValue = (profileData.personalInfo[field as keyof typeof profileData.personalInfo] || '').toString()
        
        console.log(`Field ${field}:`, {
          newValue,
          originalValue,
          isDifferent: newValue !== originalValue,
          willInclude: newValue !== originalValue
        })
        
        // Include field if it's different from original (including empty strings)
        if (newValue !== originalValue) {
          dataToSend[field] = newValue
        }
      })
      
      // Special handling for dateOfBirth - convert to ISO format
      if (dataToSend.dateOfBirth && typeof dataToSend.dateOfBirth === 'string') {
        dataToSend.dateOfBirth = new Date(dataToSend.dateOfBirth).toISOString()
      }
      
      console.log('Original data:', {
        firstName: profileData.personalInfo.firstName,
        lastName: profileData.personalInfo.lastName,
        dateOfBirth: profileData.personalInfo.dateOfBirth,
        gender: profileData.personalInfo.gender,
        country: profileData.personalInfo.country,
        profession: profileData.personalInfo.profession
      })
      console.log('Edited data:', editedData)
      console.log('editedData type:', typeof editedData)
      console.log('editedData keys:', Object.keys(editedData))
      console.log('Sending to API:', dataToSend)
      
      // Check if there are emergency contact changes
      const hasEmergencyContactChanges = 
        editedEmergencyContact.name !== (healthProfile?.emergencyContact?.name || '') ||
        editedEmergencyContact.relationship !== (healthProfile?.emergencyContact?.relationship || '') ||
        editedEmergencyContact.phone !== (healthProfile?.emergencyContact?.phone || '')
      
      // If no changes detected in both personal info and emergency contact, return early with a message
      if (Object.keys(dataToSend).length === 0 && !hasEmergencyContactChanges) {
        setSaveError('No changes detected. Please modify at least one field.')
        setSaving(false)
        return
      }
      
      // Handle personal info changes
      if (Object.keys(dataToSend).length > 0) {
        // Update user profile via API
        const response = await apiClient.user.updateProfile(token, dataToSend)
        
        console.log('API response:', response)

        if (response.success) {
          // Update local state
          const updatedProfile = {
            ...profileData,
            personalInfo: { ...profileData.personalInfo, ...editedData }
          }
          setProfileData(updatedProfile)
          
          // Update auth context
          updateUser(editedData)
        } else {
          setSaveError(response.message || 'Failed to save profile')
          setSaving(false)
          return
        }
      }
      
      // Handle emergency contact changes
      if (hasEmergencyContactChanges) {
        await handleSaveEmergencyContact()
      }
      
      setIsEditing(false)
      setSaveSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setSaveError(error.message || 'An error occurred while saving your profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEmergencyContact = async () => {
    if (!token) return

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const dataToSend = {
        emergencyContact: editedEmergencyContact
      }

      console.log('Sending emergency contact data:', dataToSend)

      const response = await apiClient.user.updateHealthProfile(token, dataToSend)

      if (!response.success) {
        throw new Error(response.message || 'Failed to update emergency contact')
      }

      // Update local state - handle case where healthProfile might not exist
      const updatedHealthProfile = {
        ...(healthProfile || {}),
        emergencyContact: editedEmergencyContact
      }
      setHealthProfile(updatedHealthProfile)

      // Update profile data
      if (profileData) {
        const updatedProfile = {
          ...profileData,
          healthProfile: {
            ...profileData.healthProfile,
            emergencyContact: editedEmergencyContact
          }
        }
        setProfileData(updatedProfile)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

    } catch (error: any) {
      console.error('Error saving emergency contact:', error)
      setSaveError(error.message || 'Failed to save emergency contact')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profileData) {
      // Reset editedData with only the fields that can be edited via the backend
      // Ensure all values are strings (not undefined) for proper form handling
      setEditedData({
        firstName: profileData.personalInfo.firstName || '',
        lastName: profileData.personalInfo.lastName || '',
        dateOfBirth: profileData.personalInfo.dateOfBirth || '',
        gender: profileData.personalInfo.gender || '',
        country: profileData.personalInfo.country || '',
        profession: profileData.personalInfo.profession || '',
        address: profileData.personalInfo.address || ''
      })
      
      // Reset emergency contact data
      if (healthProfile) {
        setEditedEmergencyContact({
          name: healthProfile.emergencyContact?.name || '',
          relationship: healthProfile.emergencyContact?.relationship || '',
          phone: healthProfile.emergencyContact?.phone || ''
        })
      }
    }
    setIsEditing(false)
    setSaveError(null)
    setSaveSuccess(false)
  }

  if (loading || !profileData) {
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#D35C2F] via-red-600 to-orange-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative">
            <UserAvatar size="2xl" className="bg-white/20 backdrop-blur-sm text-white shadow-lg ring-2 ring-white/30" />
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
                      whileHover={{ scale: saving ? 1 : 1.05 }}
                      whileTap={{ scale: saving ? 1 : 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                        saving
                          ? "bg-green-400 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      )}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          Save
                        </>
                      )}
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

            {/* Success Message */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckIcon className="h-5 w-5" />
                  <span className="font-medium">Profile updated successfully!</span>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <XMarkIcon className="h-5 w-5" />
                  <span className="font-medium">Error: {saveError}</span>
                </div>
              </motion.div>
            )}

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
                        value={editedData.firstName || ''}
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
                        value={editedData.lastName || ''}
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
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                    {profileData.personalInfo.phone}
                    <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">Cannot be changed</span>
                  </div>
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
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedData.dateOfBirth ? new Date(editedData.dateOfBirth).toISOString().split('T')[0] : ''}
                        onChange={(e) => setEditedData({...editedData, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                        <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                        {profileData.personalInfo.dateOfBirth ? new Date(profileData.personalInfo.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.gender || ''}
                        onChange={(e) => setEditedData({...editedData, gender: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                        {profileData.personalInfo.gender || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.country || ''}
                        onChange={(e) => setEditedData({...editedData, country: e.target.value})}
                        placeholder="Enter your country"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                        <GlobeAltIcon className="h-5 w-5 text-slate-400" />
                        {profileData.personalInfo.country || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Profession
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.profession || ''}
                        onChange={(e) => setEditedData({...editedData, profession: e.target.value})}
                        placeholder="Enter your profession"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-center gap-3">
                        <IdentificationIcon className="h-5 w-5 text-slate-400" />
                        {profileData.personalInfo.profession || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedData.address || ''}
                      onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-slate-400 mt-0.5" />
                      <span className={profileData.personalInfo.address ? '' : 'text-slate-500 dark:text-slate-400'}>
                        {profileData.personalInfo.address || 'Not set'}
                      </span>
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEmergencyContact.name || ''}
                      onChange={(e) => setEditedEmergencyContact({...editedEmergencyContact, name: e.target.value})}
                      placeholder="Enter contact name"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                      <span className={profileData.healthProfile.emergencyContact?.name ? '' : 'text-slate-500 dark:text-slate-400'}>
                        {profileData.healthProfile.emergencyContact?.name || 'Not set'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Relationship
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEmergencyContact.relationship || ''}
                      onChange={(e) => setEditedEmergencyContact({...editedEmergencyContact, relationship: e.target.value})}
                      placeholder="Enter relationship"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                      <span className={profileData.healthProfile.emergencyContact?.relationship ? '' : 'text-slate-500 dark:text-slate-400'}>
                        {profileData.healthProfile.emergencyContact?.relationship || 'Not set'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedEmergencyContact.phone || ''}
                      onChange={(e) => setEditedEmergencyContact({...editedEmergencyContact, phone: e.target.value})}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-900 dark:text-white">
                      <span className={profileData.healthProfile.emergencyContact?.phone ? '' : 'text-slate-500 dark:text-slate-400'}>
                        {profileData.healthProfile.emergencyContact?.phone || 'Not set'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'health' && (
          <HealthProfileSection 
            isEditing={isEditing && activeSection === 'health'} 
            onEditToggle={() => setIsEditing(!isEditing)} 
          />
        )}

        {activeSection === 'documents' && (
          <DocumentsSection 
            isEditing={isEditing && activeSection === 'documents'} 
            onEditToggle={() => setIsEditing(!isEditing)} 
          />
        )}
      </motion.div>
    </div>
  )
}