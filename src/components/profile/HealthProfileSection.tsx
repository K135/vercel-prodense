'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  HeartIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolid,
  ShieldCheckIcon as ShieldSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface HealthProfileData {
  medicalHistory: {
    bloodType?: string
    allergies: string[]
    medications: Array<{
      name: string
      dosage: string
      frequency: string
    }>
    chronicConditions: Array<{
      condition: string
      diagnosedDate: string
      severity: 'mild' | 'moderate' | 'severe'
    }>
    surgeries: Array<{
      procedure: string
      date: string
      hospital: string
    }>
  }
  dentalHistory: {
    lastDentalVisit: string
    dentalProblems: Array<{
      problem: string
      severity: 'mild' | 'moderate' | 'severe'
      dateReported: string
    }>
    previousTreatments: Array<{
      treatment: string
      date: string
      dentist: string
      location: string
    }>
    oralHygiene: {
      brushingFrequency: 'once-daily' | 'twice-daily' | 'after-meals' | 'rarely'
      flossingFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely' | 'never'
      mouthwashUse: boolean
    }
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    email: string
  }
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
    expiryDate: string
    coverageType: 'basic' | 'comprehensive' | 'premium'
  }
  preferences: {
    preferredLanguage: string
    communicationMethod: 'email' | 'sms' | 'phone' | 'whatsapp'
    appointmentReminders: boolean
    marketingEmails: boolean
  }
  completeness?: number
}

interface HealthProfileSectionProps {
  isEditing: boolean
  onEditToggle: () => void
}

export default function HealthProfileSection({ isEditing, onEditToggle }: HealthProfileSectionProps) {
  const { token } = useAuth()
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [completeness, setCompleteness] = useState<any>(null)
  
  // Form states for editing
  const [editedProfile, setEditedProfile] = useState<HealthProfileData | null>(null)
  const [newAllergy, setNewAllergy] = useState('')
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' })
  const [newCondition, setNewCondition] = useState({ condition: '', diagnosedDate: '', severity: 'mild' as const })
  const [newTreatment, setNewTreatment] = useState({ treatment: '', date: '', dentist: '', location: '' })

  useEffect(() => {
    fetchHealthProfile()
    fetchCompleteness()
  }, [token, fetchHealthProfile, fetchCompleteness])

  const fetchHealthProfile = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await apiClient.user.getHealthProfile(token)
      
      if (response.success) {
        setHealthProfile(response.data)
        setEditedProfile(response.data)
      } else {
        setError('Failed to load health profile')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load health profile')
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchCompleteness = useCallback(async () => {
    if (!token) return

    try {
      const response = await apiClient.user.getHealthProfileCompleteness(token)
      if (response.success) {
        setCompleteness(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch completeness:', err)
    }
  }, [token])

  const handleSave = async () => {
    if (!token || !editedProfile) return

    try {
      setSaving(true)
      setError(null)

      const response = await apiClient.user.updateHealthProfile(token, editedProfile)
      
      if (response.success) {
        setHealthProfile(editedProfile)
        setSuccess(true)
        onEditToggle()
        fetchCompleteness()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(response.message || 'Failed to save health profile')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save health profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(healthProfile)
    setError(null)
    onEditToggle()
  }

  const addAllergy = async () => {
    if (!newAllergy.trim() || !token) return

    try {
      const response = await apiClient.user.addMedicalHistory(token, 'allergy', { allergy: newAllergy })
      if (response.success) {
        await fetchHealthProfile()
        setNewAllergy('')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add allergy')
    }
  }

  const addMedication = async () => {
    if (!newMedication.name.trim() || !token) return

    try {
      const response = await apiClient.user.addMedicalHistory(token, 'medication', newMedication)
      if (response.success) {
        await fetchHealthProfile()
        setNewMedication({ name: '', dosage: '', frequency: '' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add medication')
    }
  }

  const addCondition = async () => {
    if (!newCondition.condition.trim() || !token) return

    try {
      const response = await apiClient.user.addMedicalHistory(token, 'condition', newCondition)
      if (response.success) {
        await fetchHealthProfile()
        setNewCondition({ condition: '', diagnosedDate: '', severity: 'mild' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add condition')
    }
  }

  const addTreatment = async () => {
    if (!newTreatment.treatment.trim() || !token) return

    try {
      const response = await apiClient.user.addDentalHistory(token, 'treatment', newTreatment)
      if (response.success) {
        await fetchHealthProfile()
        setNewTreatment({ treatment: '', date: '', dentist: '', location: '' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add treatment')
    }
  }

  const removeAllergy = async (index: number) => {
    if (!token) return

    try {
      const response = await apiClient.user.removeMedicalHistory(token, 'allergies', index)
      if (response.success) {
        await fetchHealthProfile()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove allergy')
    }
  }

  const removeMedication = async (index: number) => {
    if (!token) return

    try {
      const response = await apiClient.user.removeMedicalHistory(token, 'medications', index)
      if (response.success) {
        await fetchHealthProfile()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove medication')
    }
  }

  const removeCondition = async (index: number) => {
    if (!token) return

    try {
      const response = await apiClient.user.removeMedicalHistory(token, 'conditions', index)
      if (response.success) {
        await fetchHealthProfile()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove condition')
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
            <HeartSolid className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Health Profile</h2>
            {completeness && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-xs">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completeness.completeness}%` }}
                  ></div>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {completeness.completeness}% complete
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg text-sm font-medium"
            >
              <CheckIcon className="h-4 w-4" />
              Saved successfully
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg text-sm font-medium"
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              {error}
            </motion.div>
          )}
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
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
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEditToggle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>

      {/* Completeness Suggestions */}
      {completeness && completeness.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                Complete your profile for better care
              </h3>
              <ul className="space-y-1">
                {completeness.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-sm text-blue-700 dark:text-blue-400">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medical Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartIcon className="h-5 w-5 text-red-500" />
            Medical Information
          </h3>
          
          {/* Blood Type */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Blood Type</h4>
            {isEditing ? (
              <select
                value={editedProfile?.medicalHistory?.bloodType || ''}
                onChange={(e) => setEditedProfile(prev => prev ? {
                  ...prev,
                  medicalHistory: { ...prev.medicalHistory, bloodType: e.target.value }
                } : null)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="text-red-700 dark:text-red-400 font-semibold text-lg">
                {(healthProfile?.medicalHistory as any)?.bloodType || 'Not specified'}
              </p>
            )}
          </div>
          
          {/* Allergies */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-300">Allergies</h4>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy"
                    className="px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-yellow-300 dark:border-yellow-700 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <button
                    onClick={addAllergy}
                    className="p-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {healthProfile?.medicalHistory?.allergies?.map((allergy, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {allergy}
                  {isEditing && (
                    <button
                      onClick={() => removeAllergy(index)}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  )}
                </motion.span>
              ))}
              {(!healthProfile?.medicalHistory?.allergies?.length) && (
                <span className="text-yellow-600 dark:text-yellow-400 text-sm italic">No allergies recorded</span>
              )}
            </div>
          </div>
          
          {/* Current Medications */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-300">Current Medications</h4>
              {isEditing && (
                <button
                  onClick={() => {
                    const modal = document.getElementById('medication-modal')
                    if (modal) modal.classList.remove('hidden')
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </button>
              )}
            </div>
            <div className="space-y-2">
              {healthProfile?.medicalHistory?.medications?.map((medication, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-300">{medication.name}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">
                      {medication.dosage} - {medication.frequency}
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
              {(!healthProfile?.medicalHistory?.medications?.length) && (
                <span className="text-blue-600 dark:text-blue-400 text-sm italic">No medications recorded</span>
              )}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-purple-900 dark:text-purple-300">Medical Conditions</h4>
              {isEditing && (
                <button
                  onClick={() => {
                    const modal = document.getElementById('condition-modal')
                    if (modal) modal.classList.remove('hidden')
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </button>
              )}
            </div>
            <div className="space-y-2">
              {healthProfile?.medicalHistory?.chronicConditions?.map((condition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-300">{condition.condition}</div>
                    <div className="text-sm text-purple-700 dark:text-purple-400">
                      Severity: {condition.severity}
                      {condition.diagnosedDate && ` • Diagnosed: ${new Date(condition.diagnosedDate).toLocaleDateString()}`}
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
              {(!healthProfile?.medicalHistory?.chronicConditions?.length) && (
                <span className="text-purple-600 dark:text-purple-400 text-sm italic">No conditions recorded</span>
              )}
            </div>
          </div>
        </div>

        {/* Dental History & Other Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-green-500" />
            Dental History
          </h3>
          
          {/* Last Dental Visit */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Last Dental Visit</h4>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile?.dentalHistory?.lastDentalVisit ? new Date(editedProfile.dentalHistory.lastDentalVisit).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedProfile(prev => prev ? {
                  ...prev,
                  dentalHistory: { ...prev.dentalHistory, lastDentalVisit: e.target.value }
                } : null)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-green-300 dark:border-green-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-green-700 dark:text-green-400 font-semibold">
                {healthProfile?.dentalHistory?.lastDentalVisit 
                  ? new Date(healthProfile.dentalHistory.lastDentalVisit).toLocaleDateString()
                  : 'Not available'
                }
              </p>
            )}
          </div>

          {/* Previous Treatments */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-300">Previous Treatments</h4>
              {isEditing && (
                <button
                  onClick={() => {
                    const modal = document.getElementById('treatment-modal')
                    if (modal) modal.classList.remove('hidden')
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </button>
              )}
            </div>
            <div className="space-y-2">
              {healthProfile?.dentalHistory?.previousTreatments?.map((treatment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg"
                >
                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-300">{treatment.treatment}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {treatment.date && new Date(treatment.date).toLocaleDateString()}
                      {treatment.dentist && ` • Dr. ${treatment.dentist}`}
                      {treatment.location && ` • ${treatment.location}`}
                    </div>
                  </div>
                </motion.div>
              ))}
              {(!healthProfile?.dentalHistory?.previousTreatments?.length) && (
                <span className="text-slate-600 dark:text-slate-400 text-sm italic">No treatments recorded</span>
              )}
            </div>
          </div>

          {/* Oral Hygiene */}
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <h4 className="font-medium text-teal-900 dark:text-teal-300 mb-3">Oral Hygiene Routine</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-teal-800 dark:text-teal-400 mb-1">
                  Brushing Frequency
                </label>
                {isEditing ? (
                  <select
                    value={editedProfile?.dentalHistory?.oralHygiene?.brushingFrequency || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      dentalHistory: {
                        ...prev.dentalHistory,
                        oralHygiene: {
                          ...prev.dentalHistory.oralHygiene,
                          brushingFrequency: e.target.value as any
                        }
                      }
                    } : null)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="once-daily">Once daily</option>
                    <option value="twice-daily">Twice daily</option>
                    <option value="after-meals">After meals</option>
                    <option value="rarely">Rarely</option>
                  </select>
                ) : (
                  <p className="text-teal-700 dark:text-teal-400">
                    {healthProfile?.dentalHistory?.oralHygiene?.brushingFrequency?.replace('-', ' ') || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-teal-800 dark:text-teal-400 mb-1">
                  Flossing Frequency
                </label>
                {isEditing ? (
                  <select
                    value={editedProfile?.dentalHistory?.oralHygiene?.flossingFrequency || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      dentalHistory: {
                        ...prev.dentalHistory,
                        oralHygiene: {
                          ...prev.dentalHistory.oralHygiene,
                          flossingFrequency: e.target.value as any
                        }
                      }
                    } : null)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                ) : (
                  <p className="text-teal-700 dark:text-teal-400">
                    {healthProfile?.dentalHistory?.oralHygiene?.flossingFrequency || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-3">Emergency Contact</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-400 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.emergencyContact?.name || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                    } : null)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Emergency contact name"
                  />
                ) : (
                  <p className="text-orange-700 dark:text-orange-400">
                    {healthProfile?.emergencyContact?.name || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-400 mb-1">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.emergencyContact?.relationship || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                    } : null)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Relationship"
                  />
                ) : (
                  <p className="text-orange-700 dark:text-orange-400">
                    {healthProfile?.emergencyContact?.relationship || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-400 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile?.emergencyContact?.phone || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                    } : null)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                ) : (
                  <p className="text-orange-700 dark:text-orange-400">
                    {healthProfile?.emergencyContact?.phone || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <>
          {/* Medication Modal */}
          <div id="medication-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Medication</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Medication name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="Dosage (e.g., 10mg)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  placeholder="Frequency (e.g., twice daily)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    const modal = document.getElementById('medication-modal')
                    if (modal) modal.classList.add('hidden')
                  }}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addMedication()
                    const modal = document.getElementById('medication-modal')
                    if (modal) modal.classList.add('hidden')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Medication
                </button>
              </div>
            </div>
          </div>

          {/* Condition Modal */}
          <div id="condition-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Medical Condition</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newCondition.condition}
                  onChange={(e) => setNewCondition(prev => ({ ...prev, condition: e.target.value }))}
                  placeholder="Condition name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newCondition.diagnosedDate}
                  onChange={(e) => setNewCondition(prev => ({ ...prev, diagnosedDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  value={newCondition.severity}
                  onChange={(e) => setNewCondition(prev => ({ ...prev, severity: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    const modal = document.getElementById('condition-modal')
                    if (modal) modal.classList.add('hidden')
                  }}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addCondition()
                    const modal = document.getElementById('condition-modal')
                    if (modal) modal.classList.add('hidden')
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Condition
                </button>
              </div>
            </div>
          </div>

          {/* Treatment Modal */}
          <div id="treatment-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Dental Treatment</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTreatment.treatment}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, treatment: e.target.value }))}
                  placeholder="Treatment name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newTreatment.date}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newTreatment.dentist}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, dentist: e.target.value }))}
                  placeholder="Dentist name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newTreatment.location}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Location/Clinic"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    const modal = document.getElementById('treatment-modal')
                    if (modal) modal.classList.add('hidden')
                  }}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addTreatment()
                    const modal = document.getElementById('treatment-modal')
                    if (modal) modal.classList.add('hidden')
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Add Treatment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}