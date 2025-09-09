'use client'

import Avatar from '@/shared/Avatar'
import { useUserAvatar } from '@/hooks/useUserAvatar'

interface UserAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  showVerification?: boolean
  alt?: string
}

const sizeClasses = {
  xs: 'size-6',
  sm: 'size-8', 
  md: 'size-12',
  lg: 'size-16',
  xl: 'size-20',
  '2xl': 'size-24'
}

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm', 
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl'
}

export default function UserAvatar({ 
  size = 'md', 
  className = '', 
  showVerification = true,
  alt 
}: UserAvatarProps) {
  const { user, userInitials, avatarSrc, hasVerification } = useUserAvatar()

  if (!user) return null

  const sizeClass = sizeClasses[size]
  const textSizeClass = textSizeClasses[size]
  
  const avatarClassName = avatarSrc 
    ? `${sizeClass} ring-1 ring-white/20 ${className}`
    : `${sizeClass} bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${textSizeClass} flex items-center justify-center ring-1 ring-white/20 ${className}`

  return (
    <Avatar 
      src={avatarSrc}
      initials={avatarSrc ? undefined : userInitials}
      className={avatarClassName}
      hasChecked={showVerification ? hasVerification : false}
      hasCheckedClass="ring-2 ring-green-500"
      alt={alt || `${user.fullName} avatar`}
    />
  )
}