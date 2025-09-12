'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BellIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  todayAppointments: number
  totalPatients: number
  monthlyEarnings: number
  averageRating: number
  pendingApprovals: number
  unreadMessages: number
  completedTreatments: number
  upcomingAppointments: number
}

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    todayAppointments: 12,
    totalPatients: 1247,
    monthlyEarnings: 45600,
    averageRating: 4.8,
    pendingApprovals: 3,
    unreadMessages: 8,
    completedTreatments: 156,
    upcomingAppointments: 24
  })

  const quickActions = [
    {
      title: 'View Calendar',
      description: 'Manage appointments',
      icon: CalendarDaysIcon,
      href: '/dashboard/appointments',
      color: 'from-blue-500 to-indigo-600',
      stats: `${dashboardStats.todayAppointments} today`
    },
    {
      title: 'Patient Messages',
      description: 'Chat with patients',
      icon: ChatBubbleLeftRightIcon,
      href: '/dashboard/patients',
      color: 'from-purple-500 to-pink-600',
      stats: `${dashboardStats.unreadMessages} unread`
    },
    {
      title: 'Upload Reports',
      description: 'Medical documents',
      icon: DocumentTextIcon,
      href: '/dashboard/reports',
      color: 'from-orange-500 to-red-600',
      stats: 'Secure storage'
    },
    {
      title: 'View Earnings',
      description: 'Financial overview',
      icon: CurrencyDollarIcon,
      href: '/dashboard/earnings',
      color: 'from-green-500 to-emerald-600',
      stats: `$${dashboardStats.monthlyEarnings.toLocaleString()}`
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      title: 'New appointment booked',
      description: 'Sarah Johnson - Dental Cleaning',
      time: '2 minutes ago',
      icon: CalendarDaysIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'message',
      title: 'Patient message received',
      description: 'Mike Chen asking about post-treatment care',
      time: '15 minutes ago',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-star review',
      description: 'Emma Davis left a positive review',
      time: '1 hour ago',
      icon: StarIcon,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment received',
      description: '$450 for root canal treatment',
      time: '2 hours ago',
      icon: CurrencyDollarIcon,
      color: 'bg-green-100 text-green-600'
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      treatment: 'Dental Implant Consultation',
      time: '10:00 AM',
      status: 'confirmed',
      avatar: 'JS'
    },
    {
      id: 2,
      patient: 'Maria Garcia',
      treatment: 'Teeth Whitening',
      time: '11:30 AM',
      status: 'confirmed',
      avatar: 'MG'
    },
    {
      id: 3,
      patient: 'David Wilson',
      treatment: 'Root Canal Treatment',
      time: '2:00 PM',
      status: 'pending',
      avatar: 'DW'
    },
    {
      id: 4,
      patient: 'Lisa Anderson',
      treatment: 'Regular Checkup',
      time: '3:30 PM',
      status: 'confirmed',
      avatar: 'LA'
    }
  ]

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="gradient-bg rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Good morning, Dr. Smith! 🌟
              </h1>
              <p className="text-white/80 text-lg">
                You have {dashboardStats.todayAppointments} appointments today and {dashboardStats.unreadMessages} unread messages.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                DS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats.todayAppointments}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats.totalPatients.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Earnings</p>
              <p className="text-3xl font-bold text-gray-900">
                ${dashboardStats.monthlyEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +15% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats.averageRating}
              </p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <StarIcon className="h-4 w-4 mr-1 fill-current" />
                Based on 234 reviews
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <motion.div
                key={index}
                className="group card cursor-pointer hover:shadow-xl transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => window.location.href = action.href}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {action.stats}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {action.title}
                </h3>
                
                <p className="text-sm text-gray-500">
                  {action.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {appointment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.patient}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {appointment.treatment}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.time}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'confirmed' ? (
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ClockIcon className="h-3 w-3 mr-1" />
                    )}
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              <BellIcon className="h-4 w-4 mr-1" />
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Alerts Section */}
      {dashboardStats.pendingApprovals > 0 && (
        <motion.div 
          className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">
                Pending Approvals Required
              </h3>
              <p className="text-yellow-700 mt-1">
                You have {dashboardStats.pendingApprovals} items requiring your approval. 
                <button className="ml-2 text-yellow-800 underline hover:text-yellow-900">
                  Review now
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}