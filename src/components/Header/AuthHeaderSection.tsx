'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginButton from './LoginButton'
import ProfileDropdown from './ProfileDropdown'

interface Props {
  className?: string
}

export default function AuthHeaderSection({ className }: Props) {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
      </div>
    )
  }

  // Show profile dropdown if authenticated, otherwise show login button
  return (
    <div className={className}>
      {isAuthenticated ? (
        <ProfileDropdown />
      ) : (
        <LoginButton />
      )}
    </div>
  )
}