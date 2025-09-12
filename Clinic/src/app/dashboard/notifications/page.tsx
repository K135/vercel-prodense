'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BellIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'appointment' | 'payment' | 'message' | 'review' | 'system' | 'community'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  metadata?: {
    patientName?: string
    amount?: number
    appointmentDate?: string
    reviewRating?: number
  }
}

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'New Appointment Request',
      message: 'Sarah Johnson has requested an appointment for teeth cleaning on January 20, 2024.',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      priority: 'high',
      actionUrl: '/dashboard/appointments',
      metadata: {
        patientName: 'Sarah Johnson',
        appointmentDate: '2024-01-20'
      }
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $450 received from Mike Chen for teeth whitening treatment.',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      priority: 'medium',
      actionUrl: '/dashboard/earnings',
      metadata: {
        patientName: 'Mike Chen',
        amount: 450
      }
    },
    {
      id: '3',
      type: 'message',
      title: 'New Patient Message',
      message: 'Emma Davis sent you a message about post-treatment care instructions.',
      timestamp: '2024-01-15T08:45:00Z',
      isRead: true,
      priority: 'medium',
      actionUrl: '/dashboard/patients',
      metadata: {
        patientName: 'Emma Davis'
      }
    },
    {
      id: '4',
      type: 'review',
      title: 'New 5-Star Review',
      message: 'John Smith left a 5-star review for your dental implant service.',
      timestamp: '2024-01-14T16:20:00Z',
      isRead: true,
      priority: 'low',
      actionUrl: '/dashboard/reviews',
      metadata: {
        patientName: 'John Smith',
        reviewRating: 5
      }
    },
    {
      id: '5',
      type: 'system',
      title: 'Profile Verification Complete',
      message: 'Your clinic profile has been successfully verified by our admin team.',
      timestamp: '2024-01-14T14:30:00Z',
      isRead: true,
      priority: 'high',
      actionUrl: '/dashboard/profile'
    },
    {
      id: '6',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Reminder: You have an appointment with Lisa Anderson tomorrow at 2:00 PM.',
      timestamp: '2024-01-14T12:00:00Z',
      isRead: true,
      priority: 'medium',
      actionUrl: '/dashboard/appointments',
      metadata: {
        patientName: 'Lisa Anderson',
        appointmentDate: '2024-01-16'
      }
    },
    {
      id: '7',
      type: 'community',
      title: 'New Forum Reply',
      message: 'Dr. Michael Chen replied to your post about Invisalign treatment planning.',
      timestamp: '2024-01-14T10:15:00Z',
      isRead: true,
      priority: 'low',
      actionUrl: '/dashboard/community'
    },
    {
      id: '8',
      type: 'payment',
      title: 'Settlement Processed',
      message: 'Your weekly settlement of $2,850 has been processed and will arrive in 1-2 business days.',
      timestamp: '2024-01-13T18:00:00Z',
      isRead: true,
      priority: 'medium',
      actionUrl: '/dashboard/earnings',
      metadata: {
        amount: 2850
      }
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <CalendarDaysIcon className="h-6 w-6" />
      case 'payment':
        return <CurrencyDollarIcon className="h-6 w-6" />
      case 'message':
        return <ChatBubbleLeftRightIcon className="h-6 w-6" />
      case 'review':
        return <UserPlusIcon className="h-6 w-6" />
      case 'system':
        return <InformationCircleIcon className="h-6 w-6" />
      case 'community':
        return <ChatBubbleLeftRightIcon className="h-6 w-6" />
      default:
        return <BellIcon className="h-6 w-6" />
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'bg-red-100 text-red-600'
    }
    
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-600'
      case 'payment':
        return 'bg-green-100 text-green-600'
      case 'message':
        return 'bg-purple-100 text-purple-600'
      case 'review':
        return 'bg-yellow-100 text-yellow-600'
      case 'system':
        return 'bg-gray-100 text-gray-600'
      case 'community':
        return 'bg-indigo-100 text-indigo-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      case 'medium':
        return <InformationCircleIcon className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notification.isRead) ||
                         (selectedFilter === 'read' && notification.isRead) ||
                         notification.type === selectedFilter
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    // Handle marking notification as read
    console.log('Marking as read:', id)
  }

  const markAllAsRead = () => {
    // Handle marking all notifications as read
    console.log('Marking all as read')
  }

  const deleteNotification = (id: string) => {
    // Handle deleting notification
    console.log('Deleting notification:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">Stay updated with your clinic activities and patient interactions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button
            onClick={markAllAsRead}
            className="btn-primary flex items-center"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BellIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
          <p className="text-sm text-gray-500">Total Notifications</p>
        </motion.div>

        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
          <p className="text-sm text-gray-500">Unread</p>
        </motion.div>

        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CalendarDaysIcon className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.type === 'appointment').length}
          </p>
          <p className="text-sm text-gray-500">Appointments</p>
        </motion.div>

        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.type === 'message').length}
          </p>
          <p className="text-sm text-gray-500">Messages</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'read', 'appointment', 'payment', 'message', 'review', 'system'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </motion.div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-semibold ${
                        notification.isRead ? 'text-gray-900' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      {getPriorityIndicator(notification.priority)}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                        {new Date(notification.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <div className="flex items-center space-x-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                            title="Mark as read"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Delete notification"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                          <EllipsisHorizontalIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    notification.isRead ? 'text-gray-600' : 'text-gray-700'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {notification.metadata && (
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                      {notification.metadata.patientName && (
                        <span className="flex items-center">
                          <UserPlusIcon className="h-3 w-3 mr-1" />
                          {notification.metadata.patientName}
                        </span>
                      )}
                      {notification.metadata.amount && (
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          ${notification.metadata.amount.toLocaleString()}
                        </span>
                      )}
                      {notification.metadata.appointmentDate && (
                        <span className="flex items-center">
                          <CalendarDaysIcon className="h-3 w-3 mr-1" />
                          {new Date(notification.metadata.appointmentDate).toLocaleDateString()}
                        </span>
                      )}
                      {notification.metadata.reviewRating && (
                        <span className="flex items-center">
                          ⭐ {notification.metadata.reviewRating}/5 stars
                        </span>
                      )}
                    </div>
                  )}
                  
                  {notification.actionUrl && (
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your filters or search query.'
                  : 'You\'re all caught up! New notifications will appear here.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Email Notifications</h3>
            <div className="space-y-3">
              {[
                'New appointment requests',
                'Payment confirmations',
                'Patient messages',
                'Review notifications',
                'System updates'
              ].map((item) => (
                <label key={item} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Push Notifications</h3>
            <div className="space-y-3">
              {[
                'Urgent appointment requests',
                'High-priority messages',
                'Payment alerts',
                'System maintenance',
                'Community mentions'
              ].map((item) => (
                <label key={item} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="btn-primary">Save Preferences</button>
        </div>
      </motion.div>
    </div>
  )
}