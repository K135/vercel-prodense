'use client'

import { useAuth } from '@/contexts/AuthContext'
import Avatar from '@/shared/Avatar'
import UserAvatar from '@/components/UserAvatar'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
  DashboardSquare01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

interface Props {
  className?: string
}

export default function ProfileDropdown({ className }: Props) {
  const { user, logout, isAuthenticated } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Generate avatar from user initials if no avatar image
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const userInitials = getInitials(user.firstName, user.lastName)

  // Get gender-based avatar image
  const getAvatarSrc = (gender?: string) => {
    if (!gender) return null
    
    const normalizedGender = gender.toLowerCase()
    if (normalizedGender === 'male' || normalizedGender === 'm') {
      return '/avatar/male-avatar.jpg'
    } else if (normalizedGender === 'female' || normalizedGender === 'f') {
      return '/avatar/female-avatar.jpg'
    }
    return null
  }

  const avatarSrc = getAvatarSrc(user.gender)

  return (
    <div className={className}>
      <Popover>
        <PopoverButton className="group flex cursor-pointer items-center space-x-2 rounded-lg bg-white/80 backdrop-blur-sm px-3 py-2 shadow-sm ring-1 ring-black/5 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:bg-neutral-800/80 dark:ring-white/10 dark:hover:bg-neutral-800 transition-all duration-200">
          <UserAvatar size="xs" />
          <span className="hidden sm:block text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
            Hey {user.firstName || 'Profile'}!
          </span>
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid grid-cols-1 gap-6 bg-white px-6 py-7 dark:bg-neutral-800">
            {/* User Info Header */}
            <div className="flex items-center space-x-3">
              <UserAvatar size="md" />

              <div className="grow">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {user.fullName}
                </h4>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {user.email || user.phone}
                </p>
                {user.country && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {user.country}
                  </p>
                )}
              </div>
            </div>

            <Divider />

            {/* Dashboard Link */}
            <Link
              href={'/dashboard'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-blue-600 dark:text-blue-400">
                <HugeiconsIcon icon={DashboardSquare01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Dashboard
              </p>
            </Link>

            {/* My Account */}
            <Link
              href={'/account'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                My Profile
              </p>
            </Link>

            {/* My Listings */}
            <Link
              href={'/my-listings'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                My Listings
              </p>
            </Link>

            {/* Wishlist */}
            <Link
              href={'/account-savelists'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={FavouriteIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Wishlist
              </p>
            </Link>

            <Divider />

            {/* Dark Mode Toggle */}
            <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Dark theme
                </p>
              </div>
              <SwitchDarkMode2 />
            </div>

            {/* Help */}
            <Link
              href={'/help'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Help
              </p>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-red-50 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-red-500/50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex shrink-0 items-center justify-center text-red-600 dark:text-red-400">
                <HugeiconsIcon 
                  icon={Logout01Icon} 
                  size={24} 
                  strokeWidth={1.5}
                  className={isLoggingOut ? 'animate-spin' : ''}
                />
              </div>
              <p className="ms-4 text-sm font-medium text-red-600 dark:text-red-400">
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </p>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}