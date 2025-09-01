'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { 
  UserIcon, 
  CalendarIcon, 
  HeartIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const dashboardCards = [
    {
      title: 'My Profile',
      description: 'Manage your personal information',
      icon: UserIcon,
      href: '/account',
      color: 'from-blue-500 to-blue-600',
      stats: 'Complete'
    },
    {
      title: 'My Appointments',
      description: 'View and manage your bookings',
      icon: CalendarIcon,
      href: '/my-appointments',
      color: 'from-green-500 to-green-600',
      stats: '3 Upcoming'
    },
    {
      title: 'Wishlist',
      description: 'Your saved dental clinics',
      icon: HeartIcon,
      href: '/account-savelists',
      color: 'from-red-500 to-red-600',
      stats: '12 Saved'
    },
    {
      title: 'My Listings',
      description: 'Manage your property listings',
      icon: DocumentTextIcon,
      href: '/my-listings',
      color: 'from-purple-500 to-purple-600',
      stats: '2 Active'
    },
    {
      title: 'Analytics',
      description: 'View your booking statistics',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'from-yellow-500 to-yellow-600',
      stats: 'This Month'
    },
    {
      title: 'Settings',
      description: 'Account and privacy settings',
      icon: CogIcon,
      href: '/settings',
      color: 'from-gray-500 to-gray-600',
      stats: 'Manage'
    }
  ]

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Here&apos;s what&apos;s happening with your account today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Bookings</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Saved Clinics</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">12</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Reviews Written</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Member Since</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {new Date(user.createdAt).getFullYear()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <div
              key={index}
              className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => router.push(card.href)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded-full">
                  {card.stats}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {card.title}
              </h3>
              
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Recent Activity
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Appointment booked at SmileCare Dental
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Added Bright Dental Clinic to wishlist
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">1 day ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Left a review for Perfect Smile Dentistry
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}