'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import UserAvatar from '@/components/UserAvatar'
import { 
  HomeIcon, 
  CreditCardIcon, 
  CalendarDaysIcon, 
  UserIcon, 
  MapPinIcon, 
  DocumentTextIcon, 
  CalculatorIcon, 
  UserGroupIcon, 
  GiftIcon, 
  BellIcon, 
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  CreditCardIcon as CreditCardIconSolid, 
  CalendarDaysIcon as CalendarDaysIconSolid, 
  UserIcon as UserIconSolid, 
  MapPinIcon as MapPinIconSolid, 
  DocumentTextIcon as DocumentTextIconSolid, 
  CalculatorIcon as CalculatorIconSolid, 
  UserGroupIcon as UserGroupIconSolid, 
  GiftIcon as GiftIconSolid, 
  BellIcon as BellIconSolid, 
  HeartIcon as HeartIconSolid,
  DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIconSolid
} from '@heroicons/react/24/solid'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    gradient: 'from-[#D35C2F] to-red-600',
    description: 'Overview & Quick Actions'
  },
  { 
    name: 'Profile', 
    href: '/dashboard/profile', 
    icon: UserIcon, 
    iconSolid: UserIconSolid,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Personal Info & Health Profile'
  },
  { 
    name: 'My Itinerary', 
    href: '/dashboard/itinerary', 
    icon: MapPinIcon, 
    iconSolid: MapPinIconSolid,
    gradient: 'from-orange-500 to-red-600',
    description: 'Travel & Treatment Schedule'
  },
  { 
    name: 'Bookings', 
    href: '/dashboard/booking', 
    icon: CalendarDaysIcon, 
    iconSolid: CalendarDaysIconSolid,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Appointments & Treatments'
  },
  { 
    name: 'Reports', 
    href: '/dashboard/reports', 
    icon: DocumentTextIcon, 
    iconSolid: DocumentTextIconSolid,
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Medical Records & Documents'
  },
  { 
    name: 'Good Faith Estimator', 
    href: '/dashboard/cost-estimator', 
    icon: CalculatorIcon, 
    iconSolid: CalculatorIconSolid,
    gradient: 'from-yellow-500 to-orange-600',
    description: 'Treatment Cost Calculator'
  },
  { 
    name: 'Saved Clinic', 
    href: '/dashboard/dentist-profile', 
    icon: UserGroupIcon, 
    iconSolid: UserGroupIconSolid,
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Your Dental Care Team'
  },
  { 
    name: 'Loyalty Points', 
    href: '/dashboard/loyalty-points', 
    icon: GiftIcon, 
    iconSolid: GiftIconSolid,
    gradient: 'from-purple-500 to-pink-600',
    description: 'Rewards & Benefits'
  },
  { 
    name: 'Notifications', 
    href: '/dashboard/notifications', 
    icon: BellIcon, 
    iconSolid: BellIconSolid,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Messages & Alerts'
  },
  { 
    name: 'Continuity Care', 
    href: '/dashboard/continuity', 
    icon: HeartIcon, 
    iconSolid: HeartIconSolid,
    gradient: 'from-red-500 to-pink-600',
    description: 'Always by Your Side 24/7'
  },
  { 
    name: 'Billing', 
    href: '/dashboard/billing', 
    icon: CreditCardIcon, 
    iconSolid: CreditCardIconSolid,
    gradient: 'from-slate-500 to-gray-600',
    description: 'Payments & Invoices'
  },
  { 
    name: 'System Logs', 
    href: '/dashboard/logs', 
    icon: DocumentMagnifyingGlassIcon, 
    iconSolid: DocumentMagnifyingGlassIconSolid,
    gradient: 'from-gray-500 to-slate-600',
    description: 'Debug & Monitor System'
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, isLoading } = useProtectedRoute('/login')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 shadow-2xl"
            >
              <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 px-6 pb-4 shadow-xl border-r border-white/20 dark:border-slate-700/50">
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/20 dark:border-slate-700/50 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Patient Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Premium Dental Care Management
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* AI Chat Button */}
              <button className="relative p-2 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors">
                <span className="sr-only">AI Assistant</span>
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <UserProfileButton />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#D35C2F] to-red-600 flex items-center justify-center shadow-lg">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#D35C2F] to-red-600 bg-clip-text text-transparent">
              Prodense
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Premium Care</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 lg:hidden"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col mt-8">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <motion.li 
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200 relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r text-white shadow-lg transform scale-[1.02]'
                      : 'text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:shadow-md hover:scale-[1.01]',
                    isActive ? item.gradient : `hover:${item.gradient}`
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r rounded-xl"
                      style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-x-3 w-full">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{item.name}</div>
                      <div className={clsx(
                        "text-xs opacity-75 truncate",
                        isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400 group-hover:text-white/80"
                      )}>
                        {item.description}
                      </div>
                    </div>
                    <ChevronRightIcon className={clsx(
                      "h-4 w-4 transition-transform duration-200",
                      isActive ? "rotate-90 text-white/80" : "text-slate-400 group-hover:text-white/80 group-hover:rotate-90"
                    )} />
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">AI Assistant</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function UserProfileButton() {
  const { user, userInitials, avatarSrc, hasVerification } = useUserAvatar()
  
  if (!user) return null
  
  return (
    <button className="flex items-center gap-x-3 text-sm leading-6 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full px-3 py-2 transition-colors">
      <UserAvatar size="sm" className="bg-gradient-to-br from-pink-500 to-rose-600" />
      <span className="hidden lg:flex lg:items-center">
        <span className="ml-2 text-sm font-semibold" aria-hidden="true">
          {user.firstName} {user.lastName}
        </span>
      </span>
    </button>
  )
}