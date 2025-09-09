'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { 
  XMarkIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhotoIcon,
  DocumentIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface DocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

const documentTypes = [
  { value: 'passport', label: 'Passport', icon: IdentificationIcon, category: 'identity' },
  { value: 'visa', label: 'Visa', icon: IdentificationIcon, category: 'travel' },
  { value: 'id-card', label: 'ID Card', icon: IdentificationIcon, category: 'identity' },
  { value: 'driving-license', label: 'Driving License', icon: IdentificationIcon, category: 'identity' },
  { value: 'medical-report', label: 'Medical Report', icon: HeartIcon, category: 'medical' },
  { value: 'dental-xray', label: 'Dental X-Ray', icon: HeartIcon, category: 'medical' },
  { value: 'prescription', label: 'Prescription', icon: HeartIcon, category: 'medical' },
  { value: 'insurance-card', label: 'Insurance Card', icon: ShieldCheckIcon, category: 'insurance' },
  { value: 'travel-insurance', label: 'Travel Insurance', icon: ShieldCheckIcon, category: 'insurance' },
  { value: 'vaccination-certificate', label: 'Vaccination Certificate', icon: HeartIcon, category: 'medical' },
  { value: 'blood-test', label: 'Blood Test', icon: HeartIcon, category: 'medical' },
  { value: 'other', label: 'Other', icon: DocumentIcon, category: 'other' }
]

const categories = [
  { value: 'identity', label: 'Identity Documents', color: 'blue' },
  { value: 'medical', label: 'Medical Records', color: 'red' },
  { value: 'travel', label: 'Travel Documents', color: 'green' },
  { value: 'insurance', label: 'Insurance', color: 'purple' },
  { value: 'other', label: 'Other', color: 'gray' }
]

export default function DocumentUploadModal({ isOpen, onClose, onUploadSuccess }: DocumentUploadModalProps) {
  const { token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    issueDate: '',
    expiryDate: '',
    tags: [] as string[]
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, images, or document files.')
      return
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum allowed size is 10MB.')
      return
    }
    
    setSelectedFile(file)
    setError(null)
    
    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      setFormData(prev => ({ ...prev, title: fileName }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !token) {
      setError('Please select a file and ensure you are logged in.')
      return
    }
    
    if (!formData.title || !formData.type || !formData.category) {
      setError('Please fill in all required fields.')
      return
    }
    
    setUploading(true)
    setError(null)
    setUploadProgress(0)
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('document', selectedFile)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('type', formData.type)
      uploadFormData.append('category', formData.category)
      
      if (formData.description) {
        uploadFormData.append('description', formData.description)
      }
      
      if (formData.issueDate) {
        uploadFormData.append('issueDate', formData.issueDate)
      }
      
      if (formData.expiryDate) {
        uploadFormData.append('expiryDate', formData.expiryDate)
      }
      
      if (formData.tags.length > 0) {
        uploadFormData.append('tags', JSON.stringify(formData.tags))
      }
      
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            setSuccess(true)
            setTimeout(() => {
              onUploadSuccess()
              handleClose()
            }, 1500)
          } else {
            setError(response.message || 'Upload failed')
          }
        } else {
          const response = JSON.parse(xhr.responseText)
          setError(response.message || 'Upload failed')
        }
        setUploading(false)
      })
      
      xhr.addEventListener('error', () => {
        setError('Network error occurred during upload')
        setUploading(false)
      })
      
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/user/documents/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.send(uploadFormData)
      
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setFormData({
        title: '',
        type: '',
        category: '',
        description: '',
        issueDate: '',
        expiryDate: '',
        tags: []
      })
      setSelectedFile(null)
      setError(null)
      setSuccess(false)
      setUploadProgress(0)
      setNewTag('')
      onClose()
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return PhotoIcon
    } else if (file.type === 'application/pdf') {
      return DocumentTextIcon
    } else {
      return DocumentIcon
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CloudArrowUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Document</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Securely upload your medical and identity documents
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File Upload Area */}
            <div
              className={clsx(
                "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    {(() => {
                      const IconComponent = getFileIcon(selectedFile)
                      return <IconComponent className="h-8 w-8 text-green-600 dark:text-green-400" />
                    })()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    disabled={uploading}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <CloudArrowUpIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Supports PDF, images, and document files up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter document title"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, type: '' }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={uploading}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Document Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={uploading || !formData.category}
                >
                  <option value="">Select type</option>
                  {documentTypes
                    .filter(type => !formData.category || type.category === formData.category)
                    .map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={uploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description or notes"
                disabled={uploading}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={uploading}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 disabled:opacity-50"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add tag"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={uploading || !newTag.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                  <span className="text-slate-900 dark:text-white font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg"
              >
                <CheckCircleIcon className="h-5 w-5" />
                Document uploaded successfully!
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg"
              >
                <ExclamationTriangleIcon className="h-5 w-5" />
                {error}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={!selectedFile || uploading || !formData.title || !formData.type || !formData.category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}