'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import UserAvatar from '@/components/UserAvatar'

import { 
  UserIcon, 
  CalendarIcon, 
  HeartIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  MapPinIcon,
  CalculatorIcon,
  UserGroupIcon,
  GiftIcon,
  BellIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalBookings: number
  savedClinics: number
  reviewsWritten: number
  loyaltyPoints: number
  upcomingAppointments: number
  completedTreatments: number
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth()
  const { userInitials, avatarSrc, hasVerification } = useUserAvatar()
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalBookings: 0,
    savedClinics: 0,
    reviewsWritten: 0,
    loyaltyPoints: 0,
    upcomingAppointments: 0,
    completedTreatments: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token || !user) return

      try {
        setStatsLoading(true)
        
        // Fetch various stats from different endpoints
        const [bookingsRes, loyaltyRes, notificationsRes] = await Promise.allSettled([
          apiClient.bookings.getAll(token),
          apiClient.loyalty.getPoints(token),
          apiClient.notifications.getAll(token)
        ])

        // Process results
        let stats: DashboardStats = {
          totalBookings: 0,
          savedClinics: 12, // Default for now
          reviewsWritten: 8, // Default for now
          loyaltyPoints: 0,
          upcomingAppointments: 0,
          completedTreatments: 0
        }

        if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success) {
          const bookings = bookingsRes.value.data.bookings || []
          stats.totalBookings = bookings.length
          stats.upcomingAppointments = bookings.filter((b: any) => 
            new Date(b.appointmentDate) > new Date() && b.status === 'confirmed'
          ).length
          stats.completedTreatments = bookings.filter((b: any) => 
            b.status === 'completed'
          ).length
        }

        if (loyaltyRes.status === 'fulfilled' && loyaltyRes.value.success) {
          stats.loyaltyPoints = loyaltyRes.value.data.totalPoints || 0
        }

        setDashboardStats(stats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [token, user])

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
      description: 'Personal info & health profile',
      icon: UserIcon,
      href: '/dashboard/profile',
      color: 'from-emerald-500 to-teal-600',
      stats: user.isEmailVerified ? 'Complete' : 'Incomplete'
    },
    {
      title: 'My Bookings',
      description: 'Appointments & treatments',
      icon: CalendarIcon,
      href: '/dashboard/booking',
      color: 'from-pink-500 to-rose-600',
      stats: `${dashboardStats.upcomingAppointments} Upcoming`
    },
    {
      title: 'My Itinerary',
      description: 'Travel & treatment schedule',
      icon: MapPinIcon,
      href: '/dashboard/itinerary',
      color: 'from-orange-500 to-red-600',
      stats: 'Plan Trip'
    },
    {
      title: 'Medical Reports',
      description: 'Records & documents',
      icon: DocumentTextIcon,
      href: '/dashboard/reports',
      color: 'from-indigo-500 to-blue-600',
      stats: 'View All'
    },
    {
      title: 'Good Faith Estimator',
      description: 'Treatment cost calculator',
      icon: CalculatorIcon,
      href: '/dashboard/cost-estimator',
      color: 'from-yellow-500 to-orange-600',
      stats: 'Calculate'
    },
    {
      title: 'Loyalty Points',
      description: 'Rewards & benefits',
      icon: GiftIcon,
      href: '/dashboard/loyalty-points',
      color: 'from-purple-500 to-pink-600',
      stats: `${dashboardStats.loyaltyPoints} Points`
    },
    {
      title: 'Notifications',
      description: 'Messages & alerts',
      icon: BellIcon,
      href: '/dashboard/notifications',
      color: 'from-green-500 to-emerald-600',
      stats: 'View All'
    },
    {
      title: 'Billing',
      description: 'Payments & invoices',
      icon: CreditCardIcon,
      href: '/dashboard/billing',
      color: 'from-slate-500 to-gray-600',
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
              <UserAvatar size="2xl" className="bg-white/20 text-white ring-2 ring-white/30" />
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
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {statsLoading ? '...' : dashboardStats.totalBookings}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Loyalty Points</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {statsLoading ? '...' : dashboardStats.loyaltyPoints}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <GiftIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Completed Treatments</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {statsLoading ? '...' : dashboardStats.completedTreatments}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
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
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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