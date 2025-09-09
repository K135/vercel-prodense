'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { 
  BellIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HeartIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'
import { 
  BellIcon as BellIconSolid,
  CheckIcon as CheckIconSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  urgency: 'normal' | 'time-sensitive' | 'immediate'
  isRead: boolean
  readAt?: string
  createdAt: string
  actions?: Array<{
    type: string
    label: string
    url: string
  }>
  personalization?: {
    appointmentDate?: string
    appointmentTime?: string
    clinicName?: string
    doctorName?: string
    amount?: number
    currency?: string
  }
}

interface NotificationResponse {
  notifications: Notification[]
  unreadCount: number
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const getNotificationIcon = (type: string, category: string) => {
  switch (category) {
    case 'appointment':
      return CalendarDaysIcon
    case 'payment':
      return CreditCardIcon
    case 'document':
      return DocumentTextIcon
    case 'loyalty':
      return GiftIcon
    case 'treatment':
      return HeartIcon
    case 'security':
      return ExclamationTriangleIcon
    default:
      return BellIcon
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'low':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'appointment':
      return 'from-blue-500 to-cyan-600'
    case 'payment':
      return 'from-green-500 to-emerald-600'
    case 'document':
      return 'from-purple-500 to-violet-600'
    case 'loyalty':
      return 'from-pink-500 to-rose-600'
    case 'treatment':
      return 'from-red-500 to-pink-600'
    case 'security':
      return 'from-orange-500 to-red-600'
    default:
      return 'from-gray-500 to-slate-600'
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const { user, token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    types: {
      appointment: true,
      payment: true,
      document: true,
      loyalty: true,
      treatment: true,
      promotion: true,
      system: false,
      security: true
    }
  })

  const filters = ['all', 'unread', 'read']
  const categories = ['all', 'appointment', 'payment', 'document', 'loyalty', 'treatment', 'promotion', 'system', 'security']

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Comprehensive debug logging
      console.log('🚀 Starting fetchNotifications...')
      console.log('📊 Current State:')
      console.log('- User object:', user)
      console.log('- User ID:', user?.id)
      console.log('- Token present:', !!token)
      console.log('- Token length:', token?.length)
      console.log('- Selected filter:', selectedFilter)
      console.log('- Selected category:', selectedCategory)
      
      const params: any = { limit: 50 }
      if (selectedFilter !== 'all') {
        params.status = selectedFilter
      }
      if (selectedCategory !== 'all') {
        params.type = selectedCategory
      }

      console.log('📡 Making API call with params:', params)
      const response: any = await apiClient.notifications.getAll(token!, params)
      
      console.log('📥 API Response received:')
      console.log('- Response type:', typeof response)
      console.log('- Response keys:', Object.keys(response))
      console.log('- Full response:', response)
      
      // Extract data from the correct structure
      const notificationsData = response.data || response
      console.log('📋 Notifications Data:')
      console.log('- Data keys:', Object.keys(notificationsData))
      console.log('- Notifications array:', notificationsData.notifications)
      console.log('- Notifications count:', notificationsData.notifications?.length || 0)
      console.log('- Unread count:', notificationsData.unreadCount)
      
      setNotifications(notificationsData.notifications || [])
      setUnreadCount(notificationsData.unreadCount || 0)
      
      console.log('✅ State updated successfully')
    } catch (err: any) {
      console.error('❌ Error in fetchNotifications:', err)
      console.error('- Error type:', typeof err)
      console.error('- Error message:', err.message)
      console.error('- Error stack:', err.stack)
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
      console.log('🏁 fetchNotifications completed')
    }
  }, [token, selectedFilter, selectedCategory, user])

  useEffect(() => {
    if (token) {
      fetchNotifications()
    }
  }, [token, fetchNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      await apiClient.notifications.markAsRead(token!, notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiClient.notifications.markAllAsRead(token!)
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
      )
      setUnreadCount(0)
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await apiClient.notifications.delete(token!, notificationId)
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId))
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n._id === notificationId)
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err: any) {
      console.error('Error deleting notification:', err)
    }
  }

  const updatePreferences = async () => {
    try {
      await apiClient.notifications.updatePreferences(token!, preferences)
      setShowPreferences(false)
    } catch (err: any) {
      console.error('Error updating preferences:', err)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-20">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Error Loading Notifications
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchNotifications}
            className="bg-[#DB3116] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

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
            Notifications
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Stay updated with your dental care journey
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <CheckIconSolid className="h-4 w-4 mr-2" />
              Mark All Read
            </button>
          )}
          <button
            onClick={() => setShowPreferences(true)}
            className="inline-flex items-center px-4 py-2 bg-[#DB3116] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <BellIconSolid className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <BellAlertIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unread</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Read</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-[#DB3116] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#DB3116] focus:border-transparent"
            >
              {filters.map(filter => (
                <option key={filter} value={filter}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#DB3116] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <BellIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type, notification.category)
              const categoryColor = getCategoryColor(notification.category)
              
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={clsx(
                    'bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300',
                    !notification.isRead && 'ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10'
                  )}
                >
                  <div className="flex items-start space-x-4">
                    <div className={clsx(
                      'h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r shadow-lg',
                      categoryColor
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={clsx(
                              'text-lg font-semibold truncate',
                              notification.isRead 
                                ? 'text-slate-900 dark:text-white' 
                                : 'text-slate-900 dark:text-white font-bold'
                            )}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <span className={clsx(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              getPriorityColor(notification.priority)
                            )}>
                              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                            </span>
                            
                            <div className="flex items-center text-slate-500 dark:text-slate-400">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>
                            
                            <span className="text-slate-500 dark:text-slate-400 capitalize">
                              {notification.category}
                            </span>
                          </div>
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="mt-4 flex gap-2">
                              {notification.actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  className="px-3 py-1 bg-[#DB3116] text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete notification"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Notification Preferences
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Delivery Methods
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.email}
                        onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.checked }))}
                        className="rounded border-slate-300 text-[#DB3116] focus:ring-[#DB3116]"
                      />
                      <EnvelopeIcon className="h-4 w-4 ml-3 mr-2 text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.push}
                        onChange={(e) => setPreferences(prev => ({ ...prev, push: e.target.checked }))}
                        className="rounded border-slate-300 text-[#DB3116] focus:ring-[#DB3116]"
                      />
                      <BellIcon className="h-4 w-4 ml-3 mr-2 text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Push Notifications</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.sms}
                        onChange={(e) => setPreferences(prev => ({ ...prev, sms: e.target.checked }))}
                        className="rounded border-slate-300 text-[#DB3116] focus:ring-[#DB3116]"
                      />
                      <DevicePhoneMobileIcon className="h-4 w-4 ml-3 mr-2 text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">SMS</span>
                    </label>
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Notification Types
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(preferences.types).map(([type, enabled]) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            types: { ...prev.types, [type]: e.target.checked }
                          }))}
                          className="rounded border-slate-300 text-[#DB3116] focus:ring-[#DB3116]"
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePreferences}
                  className="flex-1 px-4 py-2 bg-[#DB3116] text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}