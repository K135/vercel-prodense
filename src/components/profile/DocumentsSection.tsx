'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import DocumentUploadModal from './DocumentUploadModal'
import { 
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  IdentificationIcon,
  HeartIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'
import { 
  ShieldCheckIcon as ShieldSolid,
  ClockIcon as ClockSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface Document {
  id: string
  title: string
  type: string
  category: string
  description?: string
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  issueDate?: string
  expiryDate?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verifiedAt?: string
  rejectionReason?: string
  tags: string[]
  fileUrl: string
  thumbnailUrl?: string
  hasThumbnail: boolean
  isExpired: boolean
  createdAt: string
  updatedAt: string
}

interface DocumentsSectionProps {
  isEditing: boolean
  onEditToggle: () => void
}

const categoryColors = {
  identity: 'blue',
  medical: 'red',
  travel: 'green',
  insurance: 'purple',
  other: 'gray'
}

const categoryIcons = {
  identity: IdentificationIcon,
  medical: HeartIcon,
  travel: GlobeAltIcon,
  insurance: ShieldCheckIcon,
  other: DocumentIcon
}

export default function DocumentsSection({ isEditing, onEditToggle }: DocumentsSectionProps) {
  const { token } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [token])

  const fetchDocuments = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await apiClient.user.getDocuments(token)
      
      if (response.success) {
        setDocuments(response.data.documents || [])
      } else {
        setError('Failed to load documents')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    fetchDocuments()
    setUploadModalOpen(false)
  }

  const handleDownload = async (documentId: string, fileName: string) => {
    if (!token) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/user/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError('Failed to download document')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to download document')
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!token) return

    try {
      await apiClient.user.deleteDocument(token, documentId)
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete document')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return PhotoIcon
    } else if (mimeType === 'application/pdf') {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow && expiry > now
  }

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || doc.category === selectedCategory
      const matchesStatus = !selectedStatus || doc.verificationStatus === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Document]
      let bValue = b[sortBy as keyof Document]
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return sortOrder === 'asc' ? 1 : -1
      if (bValue === undefined) return sortOrder === 'asc' ? -1 : 1
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h2>
              <p className="text-slate-600 dark:text-slate-400">
                {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <DocumentTextIcon className="h-4 w-4" />
            Upload Document
          </motion.button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="identity">Identity</option>
                <option value="medical">Medical</option>
                <option value="travel">Travel</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg"
          >
            <ExclamationTriangleIcon className="h-5 w-5" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              {documents.length === 0 ? 'No documents uploaded' : 'No documents match your filters'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {documents.length === 0 
                ? 'Upload your first document to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {documents.length === 0 && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document, index) => {
              const CategoryIcon = categoryIcons[document.category as keyof typeof categoryIcons] || DocumentIcon
              const FileIcon = getFileIcon(document.mimeType)
              const categoryColor = categoryColors[document.category as keyof typeof categoryColors] || 'gray'
              
              return (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Document Thumbnail */}
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                    {document.hasThumbnail && document.thumbnailUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${document.thumbnailUrl}`}
                        alt={document.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : document.mimeType.startsWith('image/') ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/user/documents/${document.id}/view`}
                        alt={document.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : document.mimeType === 'application/pdf' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-800/20">
                        <div className="text-center">
                          <div className="relative">
                            <DocumentTextIcon className="h-20 w-20 text-red-500 mx-auto mb-3 drop-shadow-sm" />
                            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                              PDF
                            </div>
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                            {formatFileSize(document.fileSize)}
                          </div>
                        </div>
                      </div>
                    ) : document.mimeType.includes('word') || document.mimeType.includes('document') ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/20">
                        <div className="text-center">
                          <div className="relative">
                            <DocumentIcon className="h-20 w-20 text-blue-500 mx-auto mb-3 drop-shadow-sm" />
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                              DOC
                            </div>
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {formatFileSize(document.fileSize)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                        <div className="text-center">
                          <div className="relative">
                            <FileIcon className="h-20 w-20 text-slate-500 mx-auto mb-3 drop-shadow-sm" />
                            <div className="absolute -bottom-1 -right-1 bg-slate-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                              {document.mimeType.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE'}
                            </div>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {formatFileSize(document.fileSize)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Fallback for broken images */}
                    <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      <div className="text-center">
                        <div className="relative">
                          <FileIcon className="h-20 w-20 text-slate-500 mx-auto mb-3 drop-shadow-sm" />
                          <div className="absolute -bottom-1 -right-1 bg-slate-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                            {document.mimeType.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE'}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {formatFileSize(document.fileSize)}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {document.verificationStatus === 'verified' && (
                        <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-full shadow-sm">
                          <ShieldSolid className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {document.verificationStatus === 'pending' && (
                        <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-full shadow-sm">
                          <ClockSolid className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      )}
                      {document.verificationStatus === 'rejected' && (
                        <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded-full shadow-sm">
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium shadow-sm",
                        categoryColor === 'blue' && "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                        categoryColor === 'red' && "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
                        categoryColor === 'green' && "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                        categoryColor === 'purple' && "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
                        categoryColor === 'gray' && "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      )}>
                        {document.category}
                      </div>
                    </div>
                  </div>

                  {/* Document Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-600">
                    <div className="mb-3">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate mb-1">
                        {document.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                        {document.type.replace('-', ' ')}
                      </p>
                    </div>

                    {/* File Info */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <FileIcon className="h-4 w-4" />
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(document.createdAt)}</span>
                    </div>

                    {/* Expiry Warning */}
                    {document.expiryDate && (
                      <div className="mt-2">
                        {document.isExpired ? (
                          <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span>Expired on {formatDate(document.expiryDate)}</span>
                          </div>
                        ) : isExpiringSoon(document.expiryDate) ? (
                          <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                            <ClockIcon className="h-4 w-4" />
                            <span>Expires {formatDate(document.expiryDate)}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Expires {formatDate(document.expiryDate)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {document.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 2 && (
                          <span className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-xs">
                            +{document.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/user/documents/${document.id}/view`, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(document.id, document.originalName)}
                        className="flex items-center justify-center px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(document.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Delete Document
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}