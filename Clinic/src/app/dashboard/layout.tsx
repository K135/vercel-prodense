'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon, 
  UserIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  StarIcon,
  UserGroupIcon,
  BellIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  SparklesIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  UserIcon as UserIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  StarIcon as StarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BellIcon as BellIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid
} from '@heroicons/react/24/solid'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    gradient: 'from-[#D35C2F] to-red-600',
    description: 'Overview & Analytics'
  },
  { 
    name: 'Profile & Credentials', 
    href: '/dashboard/profile', 
    icon: UserIcon, 
    iconSolid: UserIconSolid,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Clinic Details & Verification'
  },
  { 
    name: 'Appointments', 
    href: '/dashboard/appointments', 
    icon: CalendarDaysIcon, 
    iconSolid: CalendarDaysIconSolid,
    gradient: 'from-blue-500 to-indigo-600',
    description: 'Calendar & Bookings'
  },
  { 
    name: 'Patient Interaction', 
    href: '/dashboard/patients', 
    icon: ChatBubbleLeftRightIcon, 
    iconSolid: ChatBubbleLeftRightIconSolid,
    gradient: 'from-purple-500 to-pink-600',
    description: 'Chat & Communication'
  },
  { 
    name: 'Reports & Documents', 
    href: '/dashboard/reports', 
    icon: DocumentTextIcon, 
    iconSolid: DocumentTextIconSolid,
    gradient: 'from-orange-500 to-red-600',
    description: 'Medical Records & Files'
  },
  { 
    name: 'Earnings & Payments', 
    href: '/dashboard/earnings', 
    icon: CurrencyDollarIcon, 
    iconSolid: CurrencyDollarIconSolid,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Financial Analytics'
  },
  { 
    name: 'Reviews & Ratings', 
    href: '/dashboard/reviews', 
    icon: StarIcon, 
    iconSolid: StarIconSolid,
    gradient: 'from-yellow-500 to-orange-600',
    description: 'Patient Feedback'
  },
  { 
    name: 'Community Forum', 
    href: '/dashboard/forum', 
    icon: UserGroupIcon, 
    iconSolid: UserGroupIconSolid,
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Professional Network'
  },
  { 
    name: 'Notifications', 
    href: '/dashboard/notifications', 
    icon: BellIcon, 
    iconSolid: BellIconSolid,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Alerts & Updates'
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-primary-500 to-red-600 flex items-center justify-center">
              <BuildingOffice2Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-red-600 bg-clip-text text-transparent">
                Prodense
              </h2>
              <p className="text-sm text-gray-500">Loading clinic dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              className="fixed left-0 top-0 h-full w-80 glass-effect shadow-2xl"
            >
              <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto glass-effect px-6 pb-4 shadow-xl border-r border-white/20">
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/20 glass-effect px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      Clinic Dashboard
                    </h1>
                    <p className="text-xs text-gray-500">
                      Professional Dental Care Management
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Settings Button */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <span className="sr-only">Settings</span>
                <Cog6ToothIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <ClinicProfileButton />
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
          <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
            <BuildingOffice2Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">
              Prodense
            </h2>
            <p className="text-xs text-gray-500">Clinic Portal</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
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
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:shadow-md hover:scale-[1.01]',
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
                        isActive ? "text-white/80" : "text-gray-500 group-hover:text-white/80"
                      )}>
                        {item.description}
                      </div>
                    </div>
                    <ChevronRightIcon className={clsx(
                      "h-4 w-4 transition-transform duration-200",
                      isActive ? "rotate-90 text-white/80" : "text-gray-400 group-hover:text-white/80 group-hover:rotate-90"
                    )} />
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">AI Assistant</p>
                <p className="text-xs text-gray-500">24/7 Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function ClinicProfileButton() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">SmileCare Dental</p>
        <p className="text-xs text-gray-500">Verified Clinic</p>
      </div>
      <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center shadow-lg">
        <BuildingOffice2IconSolid className="h-6 w-6 text-white" />
      </div>
    </div>
  )
}