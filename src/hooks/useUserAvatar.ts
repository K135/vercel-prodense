import { useAuth } from '@/contexts/AuthContext'

export function useUserAvatar() {
  const { user } = useAuth()

  // Generate avatar from user initials if no avatar image
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

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

  const userInitials = getInitials(user?.firstName, user?.lastName)
  const avatarSrc = getAvatarSrc(user?.gender)

  return {
    user,
    userInitials,
    avatarSrc,
    hasVerification: user?.isPhoneVerified || user?.isEmailVerified
  }
}